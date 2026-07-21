import express from "express";
import { login, getMe, logout, forgotPassword, resetPassword, changedPassword, sendOtp, verifyOtp, issueSocketToken } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { resetPasswordTemplate } from "../utils/email/welcomeTemplate.js";
import {loginLimiter, forgotPasswordLimiter, resetPasswordLimiter} from "../middleware/ratelimiter.middleware.js"

const router = express.Router();

// loginLimiter temporarily disabled for testing (EC2 rate-limit debugging) — re-enable before going live
router.post("/login", /* loginLimiter, */ login);

router.get("/me", verifyToken, getMe)
router.get("/socket-token", verifyToken, issueSocketToken)
router.post("/logout",verifyToken, logout)
router.post("/forgot-password", /* forgotPasswordLimiter, */ forgotPassword)
router.put("/reset-password/:token", /* resetPasswordLimiter, */ resetPassword)
router.patch("/change-password", verifyToken, changedPassword)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)

export default router;
    