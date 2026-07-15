import express from "express";

import {
  createItem,
  getAllItems,
  getActiveItems,
  getSingleItem,
  updateItem,
  deleteItem,
  toggleItemStatus,
  getItemsByCategory,
} from "../controllers/item.controller.js";
import {verifyToken, allowedRoles} from "../middleware/auth.middleware.js"

const router = express.Router();

// Create
router.post("/", verifyToken, allowedRoles("admin"), createItem);

// Read
router.get("/", getAllItems);

// Active items (user-facing, for dropdowns/checklists)
router.get("/active", getActiveItems);

// Filters
router.get(
  "/category/:categoryId",
  getItemsByCategory
);

// Status
router.patch(
  "/:id/toggle-status",
  verifyToken,
  allowedRoles("admin"),
  toggleItemStatus
);

// Single Item
router.get("/:id", getSingleItem);

// Update
router.put("/:id",verifyToken, allowedRoles("admin"), updateItem);

// Delete
router.delete("/:id",verifyToken, allowedRoles("admin"), deleteItem);

export default router;