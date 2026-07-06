import express from "express";
import {
  createPackageCheckout,
  stripeWebhook,
  saveCheckoutDetails,
} from "../controllers/payment.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin Package Purchase
router.post("/package-checkout", verifyToken, createPackageCheckout);

// Save Checkout Details & Send Email
router.post("/save-details", verifyToken, saveCheckoutDetails);


// Webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;