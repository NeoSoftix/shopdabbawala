import express from "express";
import {
  upsertWeeklyMenu,
  getWeeklyMenu,
  getAvailableItemsForDate,
} from "../controllers/weeklyMenu.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin configures which items are available per date for a category.
router.post("/", verifyToken, allowedRoles("admin"), upsertWeeklyMenu);
router.get("/", verifyToken, allowedRoles("admin"), getWeeklyMenu);

// Customer-facing: items available for a category on a specific date.
router.get("/available-items", verifyToken, getAvailableItemsForDate);

export default router;
