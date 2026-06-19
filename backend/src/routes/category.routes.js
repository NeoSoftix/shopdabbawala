import express from "express"
import { createCategory, deleteCategory, disableCategory, getActiveCategory, getAllCategories, getCategoryByFoodType, getSingleCategory, updateCategory } from "../controllers/category.controller.js"
import upload from "../middleware/upload.middleware.js"
import { allowedRoles, verifyToken } from "../middleware/auth.middleware.js"


const router = express.Router()

router.post("/", verifyToken, allowedRoles('admin'),upload.single("image") ,createCategory)

router.get("/", getAllCategories)

router.get("/active", getActiveCategory)

router.get("/food-type/:foodType", getCategoryByFoodType)

router.get("/:id", getSingleCategory)

router.put("/:id",verifyToken, allowedRoles('admin'),upload.single("image") ,updateCategory)

router.patch("/:id/status",verifyToken, allowedRoles('admin'), disableCategory)

router.delete("/:id",verifyToken, allowedRoles('admin'),deleteCategory)



export default router
