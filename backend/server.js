 import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import carRoutes from "./routes/cars.js";
import bookingRoutes from "./routes/bookings.js";
import calendarRoutes from "./routes/calendar.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import "./config/db.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

/* ROUTES */
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

/* ROOT */
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "DriveNow Backend Running"
    });
});

/* START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚗 Server Running On Port ${PORT}`);
});
