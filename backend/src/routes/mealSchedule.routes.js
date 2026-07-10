import express from "express";
import {
  getMyMealPlan,
  updateDaySchedule,
  addMealPlanAddress,
  deleteMealPlanAddress,
  createMealSchedule,
  getDayStatuses,
  updateDayOrderStatus,
} from "../controllers/mealScheduke.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Initialize plan
router.post("/create", verifyToken, createMealSchedule);
router.get("/my-plan/:subscriptionId", verifyToken, getMyMealPlan);

// Per-day active/inactive toggle (pause/resume a day's delivery)
router.get("/day-status/:subscriptionId", verifyToken, getDayStatuses);
router.patch("/day-status", verifyToken, updateDayOrderStatus);

// Update day's schedule
router.put("/update-day", verifyToken, updateDaySchedule);

// Add Address
router.post("/address", verifyToken, addMealPlanAddress);

// Delete Address
router.delete("/address/:addressId", verifyToken, deleteMealPlanAddress);

export default router;
