import express from "express";
import {
  getCustomerStats,
  getAllCustomers,
  getCustomerProfile,
  updateCustomerProfile,
  getOneCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// --- Customer Profile Routes (Self / Customer Role only) ---
router.get("/me", allowedRoles("user"), getCustomerProfile);
router.put("/me", allowedRoles("user"), updateCustomerProfile);

// --- Admin Only Customer Management Routes ---
router.get("/stats", allowedRoles("admin"), getCustomerStats);
router.get("/", allowedRoles("admin"), getAllCustomers);
router.get("/:id", allowedRoles("admin"), getOneCustomer);
router.delete("/:id", allowedRoles("admin"), deleteCustomer);

export default router;
