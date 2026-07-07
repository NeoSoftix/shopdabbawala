import express from "express";
import {
  initializeMealPlan,
  getMyMealPlan,
  updateDaySchedule,
  addMealPlanAddress,
  deleteMealPlanAddress,
  createMealSchedule,
} from "../controllers/mealScheduke.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Initialize plan
router.post("/create", verifyToken, createMealSchedule);
router.get("/my-plan/:subscriptionId", verifyToken, getMyMealPlan);

// Update day's schedule
router.put("/update-day", verifyToken, updateDaySchedule);

// Add Address
router.post("/address", verifyToken, addMealPlanAddress);

// Delete Address
router.delete("/address/:addressId", verifyToken, deleteMealPlanAddress);

export default router;
