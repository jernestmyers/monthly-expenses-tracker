import { Router } from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import {
  ChaseCheckingJsonObject,
  ChaseCreditJsonObject,
  getCsvOrigin,
  SchwabJsonObject,
  CapitalOneCreditJsonObject,
} from '../utils/getCsvOrigin';
import { formatChaseCreditCardCsv } from '../utils/formatChaseCreditCardCsv';
import { formatSchwabCsv } from '../utils/formatSchwabCsv';
import { formatCapitalOneCreditCardCsv } from '../utils/formatCapitalOneCreditCardCsv';
import { formatChaseCheckingCsv } from '../utils/formatChaseCheckingCsv';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db';
import { authenticateJWT } from './auth';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/upload',
  authenticateJWT,
  upload.single('csvfile'),
  (req, res) => {
    try {
      if (!req.file) return res.status(400).send('No file was uploaded.');

      const fileContent = req.file.buffer.toString('utf-8');

      Papa.parse(fileContent, {
        header: true,
        complete: (results) => {
          const csvOrigin = getCsvOrigin(results.meta.fields);
          const dataWithId = (results.data as object[]).map((d) => ({
            ...d,
            id: uuidv4(),
          }));
          if (csvOrigin === 'chase_credit_card') {
            const formattedData = formatChaseCreditCardCsv(
              dataWithId as ChaseCreditJsonObject[],
            );
            res.status(201).send(formattedData);
          } else if (csvOrigin === 'schwab') {
            const formattedData = formatSchwabCsv(
              dataWithId as SchwabJsonObject[],
            );
            res.status(201).send(formattedData);
          } else if (csvOrigin === 'chase_checking') {
            const formattedData = formatChaseCheckingCsv(
              dataWithId as ChaseCheckingJsonObject[],
            );
            res.status(200).send(formattedData);
          } else if (csvOrigin === 'capital_one_credit_card') {
            const formattedData = formatCapitalOneCreditCardCsv(
              dataWithId as CapitalOneCreditJsonObject[],
            );
            res.status(200).send(formattedData);
          } else {
            res.status(200).send(dataWithId);
          }
        },
        error: (error: Error) => {
          console.error('Error parsing CSV:', error.message);
          res.status(500).send('Error parsing CSV');
        },
      });
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Internal Server Error');
    }
  },
);

router.post('/submit', authenticateJWT, async (req, res) => {
  const tabUrlParts = req.headers['referer']?.split('/');
  const transactions = req.body;
  if (!Array.isArray(transactions) || !transactions.length || !tabUrlParts) {
    return res.status(400).send('Invalid request');
  }

  try {
    const user = req.user as { id: number; username: string };
    const { id } = user;
    const client = await pool.connect();
    transactions.forEach(async (t) => {
      const newTransaction = await client.query(
        `
        INSERT INTO transactions (user_id, payer_id, date, amount, description, memo)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
        [id, Number(t.paidBy), t.date, t.amount, t.description, t.memo],
      );
      await client.query(
        `
        INSERT INTO transaction_categories (transaction_id, category_id)
        VALUES ($1, $2)
      `,
        [newTransaction.rows[0].id, Number(t.category)],
      );
    });

    const currentTabDatePrefix = tabUrlParts[3] + '-' + tabUrlParts[4];
    const currentTabTransactions = await client.query(`
      SELECT t.*, c.name AS category_name, c2.name AS parent_category_name, p.name AS payer_name
      FROM transactions t
      LEFT JOIN transaction_categories tc ON t.id = tc.transaction_id
      LEFT JOIN categories c ON tc.category_id = c.id
      LEFT JOIN categories c2 ON c.parent_id = c2.id
      LEFT JOIN payers p ON t.payer_id = p.id
      WHERE t.user_id = ${id} AND t.date >= '${currentTabDatePrefix + '-1'}' AND t.date <= '${currentTabDatePrefix + '-31'}';    
    `);
    client.release();
    res.status(200).json(currentTabTransactions.rows);
  } catch (err) {}
});

export default router;
