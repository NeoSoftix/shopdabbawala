import express from "express";
import { signup, login, getMe, logout, forgotPassword, resetPassword, changedPassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { resetPasswordTemplate } from "../utils/email/welcomeTemplate.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getMe)
router.post("/logout",verifyToken, logout)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:token", resetPassword)
router.patch("/change-password", verifyToken, changedPassword)

export default router;
