import express from "express";
import {
  createPackage,
  deletePackage,
  getActivePackage,
  getAllPackage,
  getOnePackage,
  toggleStatus,
  updatePackage,
} from "../controllers/package.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// create the package
router.post("/", verifyToken, allowedRoles("admin"), createPackage);

// get the active package
router.get("/active", getActivePackage);

// get all package
router.get("/", getAllPackage);

// get by id package
router.get("/:id", getOnePackage);

// update the package
router.put("/:id", verifyToken, allowedRoles("admin"), updatePackage);

// toggle the package
router.patch("/:id", verifyToken, allowedRoles("admin"), toggleStatus);

// delete teh package
router.delete("/:id",verifyToken, allowedRoles("admin"), deletePackage); 

export default router;
