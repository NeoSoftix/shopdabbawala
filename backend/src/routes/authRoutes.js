import express from "express";
import { signup, login, getMe, logout } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getMe)
router.post("/logout",verifyToken, logout)

export default router;
