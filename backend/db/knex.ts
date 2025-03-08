import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
  client: "pg", // Change based on your DB (pg, mysql2, sqlite3)
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432
  },
});

export default db;
