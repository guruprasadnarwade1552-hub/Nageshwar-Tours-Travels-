 import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* GET ALL BOOKINGS */

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                b.*,
                c.name AS car_name,
                c.price_per_day
            FROM bookings b
            LEFT JOIN cars c
            ON b.car_id = c.id
            ORDER BY b.id DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

/* CREATE BOOKING */

/* CREATE BOOKING */

router.post("/", async (req, res) => {

    try {

        const {

            customer_name,
            email,
            phone,

            car_id,

            pickup_location,
            destination_location,

            round_trip,

            pickup_date,
            pickup_time,

            return_date,
            return_time,

            passengers,

            total_km,
            rate_per_km,

            total_price,
            advance_amount,

            travel_purpose,
            special_requirements

        } = req.body;

        // Basic validation

        if(
            !customer_name ||
            !phone ||
            !car_id ||
            !pickup_location ||
            !destination_location ||
            !pickup_date ||
            !pickup_time
        ){  
            const carCheck = await pool.query(
            "SELECT status FROM cars WHERE id = $1",
             [car_id]
            );

        if(!carCheck.rows.length){
    return res.status(404).json({
        message:"Car not found"
    });
        }

        if(carCheck.rows[0].status !== "Available"){
        return res.status(400).json({
        message:"This vehicle is currently unavailable"
        });
        } 
            return res.status(400).json({
                message: "Required fields missing"
            });
        }
         

                    const carCheck = await pool.query(
                "SELECT status FROM cars WHERE id = $1",
                [car_id]
            );

            if(!carCheck.rows.length){
                return res.status(404).json({
                    message:"Car not found"
                });
            }

            if(carCheck.rows[0].status !== "available"){
                return res.status(400).json({
                    message:"This vehicle is currently unavailable"
                });
            }
        const result = await pool.query(

            `
            INSERT INTO bookings
            (
                customer_name,
                email,
                phone,

                car_id,

                pickup_location,
                destination_location,

                round_trip,

                pickup_date,
                pickup_time,

                return_date,
                return_time,

                passengers,

                total_km,
                rate_per_km,

                total_price,
                advance_amount,

                travel_purpose,
                special_requirements
            )
            VALUES
            (
                $1,$2,$3,
                $4,
                $5,$6,
                $7,
                $8,$9,
                $10,$11,
                $12,
                $13,$14,
                $15,$16,
                $17,$18
            )
            RETURNING *
            `,

            [

                customer_name,
                email,
                phone,

                car_id,

                pickup_location,
                destination_location,

                round_trip || false,

                pickup_date,
                pickup_time,

                return_date || null,
                return_time || null,

                passengers || 1,

                total_km || 0,
                rate_per_km || 0,

                total_price || 0,
                advance_amount || 0,

                travel_purpose || null,
                special_requirements || null

            ]

        );

        res.status(201).json(result.rows[0]);

    }
    catch(err){

        console.error(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

});

/* APPROVE BOOKING */

router.put("/:id/approve", async (req,res)=>{

    try{

        const booking = await pool.query(
            "SELECT car_id FROM bookings WHERE id=$1",
            [req.params.id]
        );

        const carId = booking.rows[0].car_id;

        const result = await pool.query(
            `UPDATE bookings
             SET status='approved'
             WHERE id=$1
             RETURNING *`,
             [req.params.id]
        );

        await pool.query(
            `UPDATE cars
             SET status='Booked'
             WHERE id=$1`,
             [carId]
        );

        res.json(result.rows[0]);

    }catch(err){

        console.error(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

});
/* REJECT BOOKING */

router.put("/:id/reject", async (req,res)=>{

    try{

        const booking = await pool.query(
            "SELECT car_id FROM bookings WHERE id=$1",
            [req.params.id]
        );

        const carId = booking.rows[0].car_id;

        const result = await pool.query(

            `UPDATE bookings
             SET status='rejected'
             WHERE id=$1
             RETURNING *`,

            [req.params.id]

        );

        await pool.query(
            `UPDATE cars
             SET status='available'
             WHERE id=$1`,
            [carId]
        );

        res.json(result.rows[0]);

    }catch(err){

        console.error(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

});

router.delete("/:id", async (req,res)=>{

    try{

        await pool.query(

            "DELETE FROM bookings WHERE id=$1",

            [req.params.id]

        );

        res.json({

            success:true

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            message:"Server Error"

        });

    }

});  

router.put("/:id/complete", async(req,res)=>{

    try{

        const booking = await pool.query(
            "SELECT car_id FROM bookings WHERE id=$1",
            [req.params.id]
        );

        const carId = booking.rows[0].car_id;

        const result = await pool.query(

            `UPDATE bookings
             SET status='completed'
             WHERE id=$1
             RETURNING *`,

            [req.params.id]
        );

        await pool.query(
            `UPDATE cars
             SET status='Available'
             WHERE id=$1`,
             [carId]
        );

        res.json(result.rows[0]);

    }catch(err){

        console.error(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

});

export default router;
