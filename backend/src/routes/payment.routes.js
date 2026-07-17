import express from "express";
import {
  createPackageCheckout,
  createAddonCheckout,
  createDayAddonCheckout,
  saveCheckoutDetails,
  createScheduledSubscription,
  getCheckoutSession,
} from "../controllers/payment.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { paymentLimiter } from "../middleware/ratelimiter.middleware.js";

const router = express.Router();

// Admin Package Purchase
router.post("/package-checkout", verifyToken, paymentLimiter, createPackageCheckout);

// Add-ons Cart Checkout
router.post("/addon-checkout", verifyToken, paymentLimiter, createAddonCheckout);

// Per-day add-ons checkout (extra items on top of an already-scheduled meal)
router.post("/day-addon-checkout", verifyToken, paymentLimiter, createDayAddonCheckout);

// Get Checkout Session Details
router.get("/session/:sessionId", verifyToken, getCheckoutSession);

// Save Checkout Details & Send Email
router.post("/save-details", verifyToken, saveCheckoutDetails);

// Create Subscription Schedule
router.post("/create-schedule", verifyToken, createScheduledSubscription);

// Note: the Stripe webhook (/api/payment/webhook) is registered directly in
// server.js, before the global express.json() middleware, so it can receive
// the raw body Stripe's signature verification requires. It is not mounted
// here.

export default router;