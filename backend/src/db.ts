import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '../.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.NODE_ENV === 'production' && process.env.PGSSLROOTCERT
    ? {
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync(process.env.PGSSLROOTCERT).toString(),
        },
      }
    : {}),
});

export default pool;
