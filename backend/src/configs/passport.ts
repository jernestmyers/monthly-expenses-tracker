import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import pool from '../db'
import dotenv from 'dotenv'

dotenv.config({path: '../../.env'});

passport.use(new LocalStrategy(
    { usernameField: 'username' },
    async (username, password, done) => {
        try {
            const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = res.rows[0];

            if (!user) {
                return done(null, false, { message: 'No user with username ' + `"${username}"` })
            }

            // const isMatch = await bcrypt.compare(password, user.password);
            const isMatch = password === user.password

            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password. Please try again.' })
            }
        } catch (err) {
            return done(err)
        }
    }
));

const opts: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [jwt_payload.id])
        const user = res.rows[0];

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}))

export default passport;