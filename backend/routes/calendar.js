import express from "express";

const router = express.Router();

router.get("/", (req,res)=>{

    res.json({
        message:"Calendar Route Working"
    });

});

export default router;