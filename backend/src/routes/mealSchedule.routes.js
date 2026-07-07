import express from "express";
import {
  initializeMealPlan,
  getMyMealPlan,
  updateDaySchedule,
  addMealPlanAddress,
  deleteMealPlanAddress,
} from "../controllers/mealScheduke.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Initialize plan
router.post("/initialize", verifyToken, initializeMealPlan);

// Get user's active schedule/plan
router.get("/my-plan", verifyToken, getMyMealPlan);

// Update day's schedule
router.put("/update-day", verifyToken, updateDaySchedule);

// Add Address
router.post("/address", verifyToken, addMealPlanAddress);

// Delete Address
router.delete("/address/:addressId", verifyToken, deleteMealPlanAddress);

export default router;
