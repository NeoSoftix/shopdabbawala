import express from "express";
import {
  getOrderStats,
  getAllOrders,
  getOrderCountsByMonth,
  getOrdersByDate,
} from "../controllers/order.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken, allowedRoles("admin", "vendor"));

// Total order count for dashboard stat card
router.get("/stats", getOrderStats);

// Order counts per day for the calendar view
router.get("/calendar-counts", getOrderCountsByMonth);

// Orders for a specific date
router.get("/by-date", getOrdersByDate);

// All orders list
router.get("/", getAllOrders);

export default router;
