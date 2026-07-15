import express from "express";
import {
  getMyMealPlan,
  updateDaySchedule,
  addMealPlanAddress,
  deleteMealPlanAddress,
  createMealSchedule,
  getDayStatuses,
  updateDayOrderStatus,
  getDayAddonsSummary,
} from "../controllers/mealScheduke.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Initialize plan
router.post("/create", verifyToken, createMealSchedule);
router.get("/my-plan/:subscriptionId", verifyToken, getMyMealPlan);

// Per-day active/inactive toggle (pause/resume a day's delivery)
router.get("/day-status/:subscriptionId", verifyToken, getDayStatuses);
router.patch("/day-status", verifyToken, updateDayOrderStatus);

// Per-day add-ons summary (extra items purchased on top of an
// already-scheduled meal - purchasing itself goes through
// POST /api/payment/day-addon-checkout, a paid Stripe flow)
router.get("/day-addons/:subscriptionId", verifyToken, getDayAddonsSummary);

// Update day's schedule
router.put("/update-day", verifyToken, updateDaySchedule);

// Add Address
router.post("/address", verifyToken, addMealPlanAddress);

// Delete Address
router.delete("/address/:addressId", verifyToken, deleteMealPlanAddress);

export default router;
