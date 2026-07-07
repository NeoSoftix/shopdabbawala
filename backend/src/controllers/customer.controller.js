import User from "../models/User.model.js";
import mongoose from "mongoose";

// ➤ 1. Get Customer Count / Stats (Admin Only)
export const getCustomerStats = async (req, res) => {
  try {
    // Count only users with role "user" (customers)
    const customerCount = await User.countDocuments({ role: "user" });

    return res.status(200).json({
      success: true,
      message: "Customer stats fetched successfully",
      stats: {
        totalCustomers: customerCount,
      },
    });
  } catch (error) {
    console.error("Get Customer Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching customer statistics",
      error: error.message,
    });
  }
};

// ➤ 2. Get All Customers (Admin Only)
export const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    // Base query: only select role: "user" (which represents customers)
    let query = { role: "user" };

    // Add search criteria if search query parameter is present
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await User.find(query).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get All Customers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching customers",
      error: error.message,
    });
  }
};

// ➤ 3. Get Logged-in Customer Profile (Me)
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await User.findOne({ _id: req.user.id, role: "user" }).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Get Customer Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile",
      error: error.message,
    });
  }
};

// ➤ 4. Update Customer Profile (Self)
export const updateCustomerProfile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { name, phone, email } = req.body;

    const customer = await User.findOne({ _id: customerId, role: "user" });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check duplicate phone number
    if (phone && phone !== customer.phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: customerId } });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered with another account",
        });
      }
      customer.phone = phone;
    }

    // Check duplicate email
    if (email && email !== customer.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: customerId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered with another account",
        });
      }
      customer.email = email;
    }

    if (name) customer.name = name;
    if (req.body.address !== undefined) customer.address = req.body.address;
    if (req.body.pincode !== undefined) customer.pincode = req.body.pincode;

    await customer.save();

    const updatedCustomer = await User.findById(customerId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Update Customer Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
      error: error.message,
    });
  }
};

// ➤ 5. Get One Customer (Admin Only)
export const getOneCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Customer ID",
      });
    }

    const customer = await User.findOne({ _id: id, role: "user" }).select("-password");
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Get One Customer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching customer details",
      error: error.message,
    });
  }
};

// ➤ 6. Delete Customer (Admin Only)
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Customer ID",
      });
    }

    const customer = await User.findOne({ _id: id, role: "user" });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting customer",
      error: error.message,
    });
  }
};
