import express from "express"
import { createVendor, deleteVendor, getAllVendors, getOneVendor, toggleVendorStatus, updateVendor } from "../controllers/vendor.controller.js"
import { verifyToken, allowedRoles } from "../middleware/auth.middleware.js"

const router = express.Router()

// create the vendor 
router.post("/", verifyToken, allowedRoles("admin"),createVendor)

// get vendor by id
router.get("/:id", getOneVendor)

// get all vender
router.get("/", getAllVendors)

// update the vendor
router.put("/:id", verifyToken, allowedRoles("admin"),updateVendor)

// Active/inActive the vdender
router.patch("/:id/status",verifyToken, allowedRoles("admin"), toggleVendorStatus)

// delete vendor 
router.delete("/:id",verifyToken, allowedRoles("admin"), deleteVendor)

export default router