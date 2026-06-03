import express from "express";
import {
  createItem,
  getAllItems,
  getSingleItem,
  updateItem,
  deleteItem,
  toggleItemStatus,
  getItemsByCategory,
  getItemsByMeal,
} from "../controllers/item.controller.js";

const router = express.Router();

// CRUD
router.post("/", createItem);
router.get("/", getAllItems);
router.get("/:id", getSingleItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

// extra features
router.patch("/toggle/:id", toggleItemStatus);

// filtering
router.get("/category/:categoryId", getItemsByCategory);
router.get("/meal/:mealType", getItemsByMeal);

export default router;