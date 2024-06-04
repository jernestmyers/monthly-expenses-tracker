import { Request, Response, Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport, { AuthenticateCallback } from 'passport'
import pool from '../db'
import { body, validationResult } from 'express-validator'
import dotenv from 'dotenv'
import { User } from '../models/User'

dotenv.config({ path: '../../.env' });

const router = Router();

router.post('/login', [
    body('username').exists(),
    body('password').exists(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() })
    }

    passport.authenticate('local', { session: false }, (err: Error | null, user: User | false, info: any) => {
        if (err || !user) {
            return res.status(400).json({message: info ? info.message : 'Login failed', user})
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return res.json({ username: user.username, token });
    })(req, res);
})

export default router;