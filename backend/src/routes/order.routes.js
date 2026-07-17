import express from "express";
import {
  getOrderStats,
  getAllOrders,
  getOrderCountsByMonth,
  getOrdersByDate,
  acceptOrder,
  rejectOrder,
  markOrderReadyToDeliver,
  markOrderDelivered,
  getMyOrders,
} from "../controllers/order.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Logged-in customer's own orders - available to any authenticated user,
// so this is declared before the admin/vendor-only gate below.
router.get("/my-orders", verifyToken, getMyOrders);

router.use(verifyToken, allowedRoles("admin", "vendor"));

// Total order count for dashboard stat card
router.get("/stats", getOrderStats);

// Order counts per day for the calendar view
router.get("/calendar-counts", getOrderCountsByMonth);

// Orders for a specific date
router.get("/by-date", getOrdersByDate);

// All orders list
router.get("/", getAllOrders);

// Admin accepts/rejects a pending order
router.patch("/:id/accept", allowedRoles("admin"), acceptOrder);
router.patch("/:id/reject", allowedRoles("admin"), rejectOrder);

// Vendor progresses an accepted order through delivery (today's orders only)
router.patch("/:id/ready-to-deliver", allowedRoles("vendor"), markOrderReadyToDeliver);
router.patch("/:id/delivered", allowedRoles("vendor"), markOrderDelivered);

export default router;
