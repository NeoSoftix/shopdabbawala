import express from "express"
import { createSubscription, renewSubscription, cancelSubscription, getMySubscriptions } from "../controllers/subcription.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/create-custom-package", verifyToken, createSubscription)
router.post("/renew", verifyToken, renewSubscription)
router.post("/cancel", verifyToken, cancelSubscription)
router.get("/my-subscriptions", verifyToken, getMySubscriptions)

export default router