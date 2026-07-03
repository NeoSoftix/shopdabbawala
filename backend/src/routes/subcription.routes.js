import express from "express"
import {createSubscription } from "../controllers/subcription.controller.js";
import {verifyToken} from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/create-custom-package", verifyToken,  createSubscription)

export default router