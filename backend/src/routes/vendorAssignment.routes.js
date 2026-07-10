import express from "express";
import {
  assignVendor,
  removeAssignment,
  getAllAssignments,
} from "../controllers/vendorAssignment.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin assigns a vendor to serve a package in a pincode
router.post("/", verifyToken, allowedRoles("admin"), assignVendor);

// Admin views all assignments
router.get("/", verifyToken, allowedRoles("admin"), getAllAssignments);

// Admin removes an assignment
router.delete("/:id", verifyToken, allowedRoles("admin"), removeAssignment);

export default router;
