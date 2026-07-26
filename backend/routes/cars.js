 import express from "express";
import pool from "../config/db.js";

const router = express.Router();


router.get("/available", async (req,res)=>{

    try{

        const result = await pool.query(
            "SELECT * FROM cars WHERE status='available' ORDER BY id"
        );

        res.json(result.rows);

    }
    catch(error){

        console.error(error);

        res.status(500).json({
            error:"Database Error"
        });

    }

});


router.get("/", async (req, res) => {

    try {

        const result =
        await pool.query(
            "SELECT * FROM cars ORDER BY id"
        );

        res.json(result.rows);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: "Database Error"
        });

    }

});

router.post("/", async (req, res) => {

    try {
        const {
            name,
            brand,
            type,
            price_per_km,
            image_url,
            status
        } = req.body;

        const result =
        await pool.query(

            `INSERT INTO cars
            (
                name,
                brand,
                type,
                price_per_km,
                image_url,
                status
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            RETURNING *`,

            [
                name,
                brand,
                type,
                price_per_km,
                image_url,
                status
            ]

        );

        res.status(201).json(
            result.rows[0]
        );

    } catch(error){

        console.error(error);

        res.status(500).json({
            error:"Failed To Add Car"
        });

    }

}); 

router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            brand,
            type,
            price_per_km,
            image_url,
            status
        } = req.body;

        const result = await pool.query(

            `UPDATE cars
             SET
             name=$1,
             brand=$2,
             type=$3,
             price_per_km=$4,
             image_url=$5,
             status=$6
             WHERE id=$7
             RETURNING *`,

            [
                name,
                brand,
                type,
                price_per_km,
                image_url,
                status,
                id
            ]

        );

        res.json(result.rows[0]);

    } catch(error){

        console.error(error);

        res.status(500).json({
            error: "Update Failed"
        });

    }

});

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM cars WHERE id=$1",
            [id]
        );

        res.json({
            success:true,
            message:"Car Deleted"
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            error:"Delete Failed"
        });

    }

});
export default router;