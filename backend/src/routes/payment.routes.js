import express from "express";
import {
  createPackageCheckout,
  stripeWebhook,
} from "../controllers/payment.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin Package Purchase
router.post("/package-checkout", verifyToken, createPackageCheckout);


// Webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;