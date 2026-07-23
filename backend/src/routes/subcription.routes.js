import express from "express"
import { createSubscription, renewSubscription, cancelSubscription, getMySubscriptions, instantUpgrade } from "../controllers/subcription.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/create-custom-package", verifyToken, createSubscription)
router.post("/renew", verifyToken, renewSubscription)
router.post("/cancel", verifyToken, cancelSubscription)
router.get("/my-subscriptions", verifyToken, getMySubscriptions)
// Grants a subscription with no payment - admin-only. Never leave this on
// verifyToken alone: any logged-in customer could otherwise self-grant a
// free plan by calling it directly.
router.post("/instant-upgrade", verifyToken, allowedRoles("admin"), instantUpgrade)

export default router