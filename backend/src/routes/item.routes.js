import express from "express";

import {
  createItem,
  getAllItems,
  getSingleItem,
  updateItem,
  deleteItem,
  toggleItemStatus,
  getItemsByCategory,
} from "../controllers/item.controller.js";
import upload from "../middleware/upload.middleware.js";
import {verifyToken, allowedRoles} from "../middleware/auth.middleware.js"

const router = express.Router();

// Create
router.post("/", verifyToken, allowedRoles("admin") ,upload.single("image"), createItem);

// Read
router.get("/", getAllItems);

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
router.put("/:id",verifyToken, allowedRoles("admin"), upload.single("image"), updateItem);

// Delete
router.delete("/:id",verifyToken, allowedRoles("admin"), deleteItem);

export default router;