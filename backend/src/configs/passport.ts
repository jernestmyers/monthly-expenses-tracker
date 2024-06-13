import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import pool from '../db';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [
        jwt_payload.id,
      ]);
      const user = res.rows[0];

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }),
);

export default passport;
