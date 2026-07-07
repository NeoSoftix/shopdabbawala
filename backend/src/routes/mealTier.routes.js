import express from "express";
import {
  createMealTier,
  getAllMealTiers,
  getActiveMealTiers,
  getOneMealTier,
  updateMealTier,
  toggleMealTierStatus,
  deleteMealTier,
} from "../controllers/mealTier.contoller.js";
import { allowedRoles, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin routes
router.post("/", verifyToken, allowedRoles("admin"), createMealTier);                          // POST   /api/meal-tiers

router.get("/", verifyToken, allowedRoles("admin"), getAllMealTiers);                            // GET    /api/meal-tiers

router.put("/:id", verifyToken, allowedRoles("admin"), updateMealTier);                          // PUT    /api/meal-tiers/:id

router.patch("/toggle-status/:id", verifyToken, allowedRoles("admin"), toggleMealTierStatus);    // PATCH  /api/meal-tiers/toggle-status/:id

router.delete("/:id", verifyToken, allowedRoles("admin"), deleteMealTier);                       // DELETE /api/meal-tiers/:id

// User-facing route
router.get("/active", getActiveMealTiers);                   // GET    /api/meal-tiers/active

router.get("/:id", getOneMealTier);                          // GET    /api/meal-tiers/:id

export default router;