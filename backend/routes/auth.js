import express from "express";
import { loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// Test Route
router.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Auth Route Working"
    });

});

// Login Route
router.post("/login", loginAdmin);

export default router;