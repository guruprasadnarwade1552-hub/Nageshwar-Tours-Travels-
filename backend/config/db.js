 import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
.then(() => {
    console.log("✅ PostgreSQL Connected");
})
.catch((err) => {
    console.error(err);
});
console.log("DB CONFIG VERSION 2");

export default pool;
