  import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* =========================================
   GET ALL BLOCKED DATES
========================================= */

router.get("/", async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT * FROM blocked_dates
             ORDER BY blocked_date ASC`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blocked dates"
        });

    }
});

/* =========================================
   BLOCK NEW DATE
========================================= */

router.post("/", async (req, res) => {

    try {

        const { blocked_date, reason } = req.body;

        // Check if already blocked
        const existing = await pool.query(

            `SELECT * FROM blocked_dates
             WHERE blocked_date = $1`,

            [blocked_date]

        );

        if (existing.rows.length > 0) {

            return res.status(400).json({

                success: false,
                message: "Date already blocked"

            });

        }

        const result = await pool.query(

            `INSERT INTO blocked_dates
            (blocked_date, reason)
            VALUES ($1,$2)
            RETURNING *`,

            [

                blocked_date,

                reason || "Booked"

            ]

        );

        res.status(201).json({

            success: true,

            data: result.rows[0]

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Failed to block date"

        });

    }

});

/* =========================================
   DELETE BLOCKED DATE
========================================= */

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(

            `DELETE FROM blocked_dates
             WHERE id=$1`,

            [id]

        );

        res.json({

            success: true,
            message: "Blocked date removed"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Delete failed"

        });

    }

});

export default router;
