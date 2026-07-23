import express from "express";
import {
  checkServiceAvailability,
  createVendor,
  deleteVendor,
  getAllVendors,
  getOneVendor,
  toggleVendorStatus,
  updateVendor,
  vendorProfile
} from "../controllers/vendor.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";
import upload, { handleUploadError } from "../middleware/upload.middleware.js";

const router = express.Router();

// Create Vendor
router.post("/", verifyToken, allowedRoles("admin"), upload.single("logo"), handleUploadError, createVendor);

// Get Vendor Profile
router.get("/me", verifyToken, allowedRoles("vendor"), vendorProfile);

// Get All Vendors
router.get("/", verifyToken, allowedRoles("admin"), getAllVendors);

// get vendor by pincode 
router.get("/service-availability", checkServiceAvailability)

// Update Vendor
router.put("/:id", verifyToken, allowedRoles("admin", "vendor"), upload.single("logo"), handleUploadError, updateVendor);

// Toggle Status
router.patch("/:id/status", verifyToken, allowedRoles("admin"), toggleVendorStatus);

// Get One Vendor
router.get("/:id", verifyToken, allowedRoles("admin"), getOneVendor);



// Delete Vendor
router.delete("/:id", verifyToken, allowedRoles("admin"), deleteVendor);

export default router;
