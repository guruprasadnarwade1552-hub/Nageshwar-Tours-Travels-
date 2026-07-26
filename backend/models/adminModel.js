 import pool from "../config/db.js";

export async function findAdminByUsername(username) {

    const result = await pool.query(

        "SELECT * FROM admins WHERE username=$1",

        [username]

    );

    return result.rows[0];

}

export async function createAdmin(username,email,password){

    const result = await pool.query(

        `INSERT INTO admins
        (username,email,password)

        VALUES($1,$2,$3)

        RETURNING *`,

        [username,email,password]

    );

    return result.rows[0];

}