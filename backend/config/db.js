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


pool.query("SELECT NOW()")
.then((result)=>{
    console.log("✅ Neon PostgreSQL Connected");
    console.log("Database Time:", result.rows[0]);
})
.catch((error)=>{
    console.error("❌ Database Connection Failed");
    console.error(error);
});


export default pool;
