import express from "express";
import {
  createDeliveryCharge,
  getAllDeliveryCharges,
  getDeliveryChargeByPincode,
  updateDeliveryCharge,
  deleteDeliveryCharge,
} from "../controllers/deliveryCharge.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: look up delivery charge for a pincode (checkout flow)
router.get("/check/:pincode", getDeliveryChargeByPincode);

// Admin: manage delivery charges
router.post("/", verifyToken, allowedRoles("admin"), createDeliveryCharge);
router.get("/", verifyToken, allowedRoles("admin"), getAllDeliveryCharges);
router.put("/:id", verifyToken, allowedRoles("admin"), updateDeliveryCharge);
router.delete("/:id", verifyToken, allowedRoles("admin"), deleteDeliveryCharge);

export default router;
