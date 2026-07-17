import express from "express";
import {
  createAddOn,
  getActiveAddOns,
  deleteAddOn,
  getAllAddOns,
  getOneAddOns,
  toggleStatus,
  updateAddOn,
} from "../controllers/addsOn.controller.js";
import { allowedRoles, verifyToken } from "../middleware/auth.middleware.js";
import upload, { handleUploadError } from "../middleware/upload.middleware.js";

const router = express.Router();

// create Add On
router.post("/", verifyToken, allowedRoles("admin"), upload.single("image"), handleUploadError, createAddOn);

// get all Add on
router.get("/", getAllAddOns);

// get active Add on
router.get("/active", getActiveAddOns);

// get One Add On
router.get("/:id", getOneAddOns);

// update the Add On
router.put("/:id", verifyToken, allowedRoles("admin"), upload.single("image"), handleUploadError, updateAddOn);

// toggle the status of Add On
router.patch("/:id/status", verifyToken, allowedRoles("admin"), toggleStatus);

// delete the Add On
router.delete("/:id", verifyToken, allowedRoles("admin"), deleteAddOn);

export default router;
