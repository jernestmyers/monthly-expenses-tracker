import { Router } from 'express';
import pool from '../db';
import { authenticateJWT } from './auth';

const router = Router();

router.get('/', authenticateJWT, async (req, res) => {
  const { query } = req;
  const { year, month } = query;
  if (!year || !month) {
    return res.status(400).send('Invalid request');
  }

  try {
    const user = req.user as { id: number; username: string };
    const { id } = user;
    const client = await pool.connect();
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
    const currentTabDatePrefix = year + '-' + month;
    const currentTabTransactions = await client.query(`
      SELECT t.*, c.id AS category_id, c.name AS category_name, c2.name AS parent_category_name, p.name AS payer_name
      FROM transactions t
      LEFT JOIN transaction_categories tc ON t.id = tc.transaction_id
      LEFT JOIN categories c ON tc.category_id = c.id
      LEFT JOIN categories c2 ON c.parent_id = c2.id
      LEFT JOIN payers p ON t.payer_id = p.id
      WHERE t.user_id = ${id} AND t.date >= '${currentTabDatePrefix + '-1'}' AND t.date <= '${currentTabDatePrefix + '-' + daysInMonth}';
    `);
    client.release();
    res.status(200).json(currentTabTransactions.rows);
  } catch (err) {}
});

export default router;
