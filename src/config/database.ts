import { Pool  } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';

dotenv.config();

const globalForPg = globalThis as unknown as {
  pool?: Pool;
};

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}

export const db = drizzle(pool);

// setInterval(() => {
//   db.execute(`SELECT 1`);
// }, 5000); 


