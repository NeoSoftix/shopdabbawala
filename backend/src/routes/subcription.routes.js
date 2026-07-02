import express from "express"
import {createSubscription } from "../controllers/subcription.controller.js";

const router = express.Router()

router.post("/create-custom-package",  createSubscription)

export default router