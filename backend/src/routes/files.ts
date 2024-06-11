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

router.post('/submit', authenticateJWT, (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});

export default router;
