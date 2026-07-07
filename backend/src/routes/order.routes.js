import express from "express";
import {
  getOrderCountsByMonth,
  getOrdersByDate,
} from "../controllers/order.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken, allowedRoles("admin", "vendor"));

// Order counts per day for the calendar view
router.get("/calendar-counts", getOrderCountsByMonth);

// Orders for a specific date
router.get("/by-date", getOrdersByDate);

export default router;
