import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;

const pool = new Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", (client) => {
  client.query("SET search_path TO cvision");
});

export async function checkPgConnection() {
  try {
    const res = await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connection successful.");
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    return false;
  }
}

export default pool;
