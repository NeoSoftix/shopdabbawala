import express from "express";
import { submitContactQuery } from "../controllers/contactQuery.controller.js";

const router = express.Router();

// Public Contact Us form submission - no auth required.
router.post("/", submitContactQuery);

export default router;
