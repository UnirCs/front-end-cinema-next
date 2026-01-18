// app/api/_db.js
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en el entorno.");
}

const globalForPg = globalThis;

export const pool =
  globalForPg.__pgPool ||
  new Pool({
    connectionString,
    // Si tu DB exige SSL en producción, aquí lo configurarías.
    // ssl: { rejectUnauthorized: false }
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.__pgPool = pool;
}

export async function query(text, params) {
  return pool.query(text, params);
}

export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
