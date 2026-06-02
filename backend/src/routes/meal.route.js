import express from "express"
import { createMeal, deleteMeal, getActiveMeal, getAllMeals, getMealById, toggleMealStatus, updateMeal } from "../controllers/meals.controller.js"

import upload from "../middleware/upload.middleware.js"
import { allowedRoles, verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/", verifyToken, allowedRoles('admin'),upload.single("image") ,createMeal)
router.get("/active", getActiveMeal)
router.get("/", getAllMeals)
router.get("/:id", getMealById)
router.put("/:id",verifyToken, allowedRoles('admin'),upload.single("image"), updateMeal)
router.patch("/:id/status",verifyToken, allowedRoles('admin'), toggleMealStatus)
router.delete("/:id", verifyToken, allowedRoles('admin'),deleteMeal)

export default router 