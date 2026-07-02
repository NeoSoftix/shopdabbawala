import express from "express";
import { 
  checkServiceAvailability,
  createVendor, 
  deleteVendor, 
  getAllVendors, 
  getOneVendor, 
  getServiceAreaOfvendor, 
  removeAreaAndCategory, 
  selectAreaAndCategory, 
  toggleVendorStatus, 
  updateVendor,
  vendorProfile
} from "../controllers/vendor.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";
import  upload  from "../middleware/upload.middleware.js"; 

const router = express.Router();

// Create Vendor
router.post("/", verifyToken, allowedRoles("admin"), upload.single("logo"), createVendor);

// Get Vendor Profile
router.get("/me", verifyToken, allowedRoles("vendor"), vendorProfile);

// Get All Vendors
router.get("/", verifyToken, allowedRoles("admin"), getAllVendors);

// get vendor by pincode 
router.get("/service-availability", checkServiceAvailability)

// Select Area & Category
router.patch("/select-zone", verifyToken, allowedRoles("vendor"), selectAreaAndCategory);

// Service Area
router.get("/service-area", verifyToken, allowedRoles("vendor"), getServiceAreaOfvendor);

// Remove Area & Category
router.delete("/remove-area-category/:id", verifyToken, allowedRoles("vendor"), removeAreaAndCategory);

// Update Vendor
router.put("/:id", verifyToken, allowedRoles("admin"), upload.single("logo"), updateVendor);

// Toggle Status
router.patch("/:id/status", verifyToken, allowedRoles("admin"), toggleVendorStatus);

// Get One Vendor
router.get("/:id",allowedRoles("admin"), getOneVendor);



// Delete Vendor
router.delete("/:id", verifyToken, allowedRoles("admin"), deleteVendor);

export default router;
