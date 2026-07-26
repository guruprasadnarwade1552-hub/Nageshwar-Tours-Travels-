 import express from "express";

import {

loginAdmin,

getAdminDashboard

}

from "../controllers/adminController.js";

import {

authenticateAdmin

}

from "../middleware/authMiddleware.js";

const router=

express.Router();

router.post(

"/login",

loginAdmin

);

router.get(

"/dashboard",

authenticateAdmin,

getAdminDashboard

);

export default router;