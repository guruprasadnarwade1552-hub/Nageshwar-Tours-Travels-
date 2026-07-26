 import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL?.trim();
console.log("DATABASE_URL RAW:", JSON.stringify(dbUrl));

const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query("SELECT NOW()")
.then((result) => {
    console.log("✅ Neon PostgreSQL Connected");
    console.log("Database Time:", result.rows[0]);
})
.catch((error) => {
    console.error("❌ Database Connection Failed");
    console.error(error);
});

export default pool;
