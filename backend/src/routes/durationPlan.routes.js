// routes/durationPlan.routes.js
import express from "express";
import {
  createDurationPlan,
  getAllDurationPlans,
  getActiveDurationPlans,
  updateDurationPlan,
  toggleDurationPlanStatus,
  deleteDurationPlan,
} from "../controllers/durationPlan.controller.js";

import { allowedRoles, verifyToken } from "../middleware/auth.middleware.js";
// import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
// apna existing auth middleware yahan import karke admin-only routes pe laga dena

const router = express.Router();

// Admin routes — sirf admin create/update/delete/toggle kar sakta hai
router.post("/", verifyToken, allowedRoles("admin"), createDurationPlan);                          // POST   /api/duration-plans

router.get("/", verifyToken, allowedRoles("admin"), getAllDurationPlans);                           // GET    /api/duration-plans

router.put("/:id", verifyToken, allowedRoles("admin"),updateDurationPlan);                         // PUT    /api/duration-plans/:id

router.patch("/toggle-status/:id",  verifyToken, allowedRoles("admin"),toggleDurationPlanStatus);   // PATCH  /api/duration-plans/toggle-status/:id

router.delete("/:id",verifyToken, allowedRoles("admin"), deleteDurationPlan);                      // DELETE /api/duration-plans/:id

// User-facing route — sirf active plans, frontend dashboard ke liye
router.get("/active", getActiveDurationPlans);                  // GET    /api/duration-plans/active

export default router;