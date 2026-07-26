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
.catch((error) => {
    console.error("❌ Database Error:", error);
});

export default pool;
