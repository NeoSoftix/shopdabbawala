import Vendor from "../../models/vendor.model.js";
import { findServingVendor } from "../../utils/findServingVendor.js";

// get vendor profile
export const vendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      userId: req.user.id,
    }).populate("userId", "name email phone")

    if(!vendor) {
      return res.status(404).json({
        message:"Vendor not found",
        success:false
      })
    }

    return res.status(200).json({
      message:"Vendor profile fetch successfully",
      success:true,
      data:vendor
    })
  } catch (error) {
    console.log("Get Profile Of Profile Error")

    return res.status(500).json({
      message:"Internal Server error",
      success:false
    })
  }
}

// get vendor by pincode
export const checkServiceAvailability = async (req, res) => {
  try {
    const {pincode, package: packageId}= req.query

    if(!pincode) {
      return res.status(404).json({
        success:false,
        message:"Pincode not Found"
      })
    }

    const vendor = await findServingVendor(pincode, packageId)

    if(!vendor) {
      return res.status(404).json({
        message:"Sorry! Service is not available in your area.",
        success:false
      })
    }

    return res.status(200).json({
      message:"Service is aviable",
      success:true
    })

  } catch (error) {
      console.error("Check Service Availability Error:", error)

      return res.status(500).json({
        message:"Internal Server error",
        success:false
      })
  }
}
