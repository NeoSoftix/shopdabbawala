import express from "express";
import { login, getMe, logout, forgotPassword, resetPassword, changedPassword, sendOtp, verifyOtp, issueSocketToken } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { resetPasswordTemplate } from "../utils/email/welcomeTemplate.js";
import {loginLimiter} from "../middleware/ratelimiter.middleware.js"

const router = express.Router();

router.post("/login", loginLimiter, login);

router.get("/me", verifyToken, getMe)
router.get("/socket-token", verifyToken, issueSocketToken)
router.post("/logout",verifyToken, logout)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:token", resetPassword)
router.patch("/change-password", verifyToken, changedPassword)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)

export default router;
