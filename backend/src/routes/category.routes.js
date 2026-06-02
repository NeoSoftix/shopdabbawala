import express from "express"
import { createCategory, disableCategory, getAllCategories, getSingleCategory, updateCategory } from "../controllers/category.controller.js"

const router = express.Router()

router.post("/", createCategory)
router.get("/", getAllCategories)
router.get("/:id", getSingleCategory)
router.patch(":/id", updateCategory)
router.patch("/:id/status", disableCategory)
router.delete("/:id", disableCategory)

export default router
