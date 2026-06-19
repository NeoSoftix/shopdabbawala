import express from "express";
import { 
  createVendor, 
  deleteVendor, 
  getAllVendors, 
  getOneVendor, 
  getServiceAreaOfvendor, 
  removeAreaAndCategory, 
  selectAreaAndCategory, 
  toggleVendorStatus, 
  updateVendor 
} from "../controllers/vendor.controller.js";
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js";
import  upload  from "../middleware/upload.middleware.js"; 

const router = express.Router();

// creaet a vender
router.post(
  "/", 
  verifyToken, 
  allowedRoles("admin"), 
  upload.single("logo"), 
  createVendor
);

// Update the vendor (Admin Only + Optional Logo Update)
router.put(
  "/:id", 
  verifyToken, 
  allowedRoles("admin"), 
  upload.single("logo"), 
  updateVendor
);

// select Area And category 
router.patch("/select-zone", verifyToken, allowedRoles("vendor"), selectAreaAndCategory)

// get Service Area Of a Vendor
router.get("/service-area", verifyToken, allowedRoles("vendor"), getServiceAreaOfvendor)

// remove Area and category
router.patch("/deselect-zone", verifyToken, allowedRoles("vendor"), removeAreaAndCategory)

// Toggle Vendor Status (Active/Inactive)
router.patch("/:id/status", verifyToken, allowedRoles("admin"), toggleVendorStatus);

// Get vendor by ID (Public Route)
router.get("/:id", getOneVendor);

// Delete vendor (Admin Only)
router.delete("/:id", verifyToken, allowedRoles("admin"), deleteVendor);

export default router;
