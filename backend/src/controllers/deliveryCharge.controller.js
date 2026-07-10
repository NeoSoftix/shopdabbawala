import mongoose from "mongoose";
import DeliveryCharge from "../models/deliveryCharge.model.js";

// Admin adds a delivery charge for a pincode
export const createDeliveryCharge = async (req, res) => {
  try {
    const { pincode, charge } = req.body;

    if (!pincode || charge === undefined || charge === null || charge === "") {
      return res.status(400).json({
        success: false,
        message: "Pincode and charge are required.",
      });
    }

    if (Number.isNaN(Number(charge)) || Number(charge) < 0) {
      return res.status(400).json({
        success: false,
        message: "Charge must be a valid non-negative number.",
      });
    }

    const normalizedPincode = pincode.trim();

    const existing = await DeliveryCharge.findOne({ pincode: normalizedPincode });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A delivery charge is already set for this pincode.",
      });
    }

    const deliveryCharge = await DeliveryCharge.create({
      pincode: normalizedPincode,
      charge: Number(charge),
    });

    return res.status(201).json({
      success: true,
      message: "Delivery charge added successfully.",
      data: deliveryCharge,
    });
  } catch (error) {
    console.error("Create Delivery Charge Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Admin views all delivery charges
export const getAllDeliveryCharges = async (req, res) => {
  try {
    const deliveryCharges = await DeliveryCharge.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: deliveryCharges.length,
      data: deliveryCharges,
    });
  } catch (error) {
    console.error("Get All Delivery Charges Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Public: look up the delivery charge for a pincode (used at checkout)
export const getDeliveryChargeByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;

    const deliveryCharge = await DeliveryCharge.findOne({
      pincode: pincode.trim(),
      isActive: true,
    });

    if (!deliveryCharge) {
      return res.status(404).json({
        success: false,
        message: "No delivery charge configured for this pincode.",
      });
    }

    return res.status(200).json({
      success: true,
      data: deliveryCharge,
    });
  } catch (error) {
    console.error("Get Delivery Charge By Pincode Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Admin updates a pincode's delivery charge
export const updateDeliveryCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { pincode, charge, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Delivery Charge ID.",
      });
    }

    const deliveryCharge = await DeliveryCharge.findById(id);
    if (!deliveryCharge) {
      return res.status(404).json({
        success: false,
        message: "Delivery charge not found.",
      });
    }

    if (pincode) {
      const normalizedPincode = pincode.trim();

      const existing = await DeliveryCharge.findOne({
        pincode: normalizedPincode,
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "A delivery charge is already set for this pincode.",
        });
      }

      deliveryCharge.pincode = normalizedPincode;
    }

    if (charge !== undefined && charge !== null && charge !== "") {
      if (Number.isNaN(Number(charge)) || Number(charge) < 0) {
        return res.status(400).json({
          success: false,
          message: "Charge must be a valid non-negative number.",
        });
      }
      deliveryCharge.charge = Number(charge);
    }

    if (typeof isActive === "boolean") {
      deliveryCharge.isActive = isActive;
    }

    await deliveryCharge.save();

    return res.status(200).json({
      success: true,
      message: "Delivery charge updated successfully.",
      data: deliveryCharge,
    });
  } catch (error) {
    console.error("Update Delivery Charge Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Admin deletes a delivery charge
export const deleteDeliveryCharge = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Delivery Charge ID.",
      });
    }

    const deleted = await DeliveryCharge.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Delivery charge not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery charge deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Delivery Charge Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
