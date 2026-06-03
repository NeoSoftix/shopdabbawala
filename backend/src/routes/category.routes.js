import express from "express"
import { createCategory, deleteCategory, disableCategory, getAllCategories, getCategoryByFoodType, getSingleCategory, updateCategory } from "../controllers/category.controller.js"
import upload from "../middleware/upload.middleware.js"
import { allowedRoles, verifyToken } from "../middleware/auth.middleware.js"
import { createCategory, disableCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js"

const router = express.Router()

router.post("/", verifyToken, allowedRoles('admin'),upload.single("image") ,createCategory)
router.get("/", getAllCategories)
router.get("/food-type/:foodType", getCategoryByFoodType)
router.get("/:id", getSingleCategory)
router.patch("/:id",verifyToken, allowedRoles('admin'),upload.single("image") ,updateCategory)
router.patch("/:id/status",verifyToken, allowedRoles('admin'), disableCategory)
router.delete("/:id",verifyToken, allowedRoles('admin'),deleteCategory)



router.patch("/:id/status", disableCategory)

router.patch("/:id", updateCategory)
router.delete("/:id", deleteCategory);
export default router
