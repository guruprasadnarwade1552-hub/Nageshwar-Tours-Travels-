import bcrypt from "bcrypt";
import promptSync from "prompt-sync";
import pool from "../config/db.js";

const prompt = promptSync();

// =========================
// TAKE INPUT
// =========================

const adminId = prompt("Enter Admin ID : ");

const username = prompt("Enter New Username : ");

const email = prompt("Enter New Email : ");

const password = prompt("Enter New Password : ");

// =========================
// UPDATE ADMIN
// =========================

async function updateAdmin(){

    try{

        const hashedPassword =
        await bcrypt.hash(password,10);

        const result =
        await pool.query(

            `UPDATE admins
             SET username=$1,
                 email=$2,
                 password=$3
             WHERE id=$4
             RETURNING *`,

            [

                username,

                email,

                hashedPassword,

                adminId

            ]

        );

        if(result.rows.length===0){

            console.log("\n❌ Admin Not Found");

            process.exit();

        }

        console.log("\n✅ Admin Updated Successfully\n");

        console.log({

            id:result.rows[0].id,

            username:result.rows[0].username,

            email:result.rows[0].email

        });

        process.exit();

    }

    catch(err){

        console.log(err);

        process.exit();

    }

}

updateAdmin();