import { Request, Response, Router, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport, { AuthenticateCallback } from 'passport';
import pool from '../db';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config({ path: '../../.env' });

const router = Router();

router.post(
  '/register',
  [
    body('username').isString().notEmpty(),
    body('password').isString().isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
      );
      if (result.rows[0]) {
        res.status(409).json({
          message: `The username "${username}" already exists. Please try again.`,
        });
      } else {
        const newUser = await client.query(
          'INSERT INTO users (id, username, password, created_at) VALUES (DEFAULT, $1, $2, DEFAULT) RETURNING *',
          [username, hashedPassword],
        );
        const user: User = newUser.rows[0];
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET as string,
          { expiresIn: '2h' },
        );
        res.json({ token });
      }
      client.release();
    } catch (err) {
      res.status(500).json({ message: 'Failed to create user' });
    }
  },
);

router.post(
  '/login',
  [body('username').exists(), body('password').exists()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
      );
      client.release();

      if (result.rowCount === 0) {
        return res.status(400).json({
          message: `A user with username "${username}" was not found. Please try again.`,
        });
      }

      const user: User = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: 'Incorrect password. Please try again.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: '2h' },
      );
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Oops. Something went wrong.' });
    }
  },
);

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    console.log({ req, err });
    if (err) {
      return next(err);
    }
    res.status(200).send({ message: 'Logged out successfully' });
  });
});

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

export default router;
