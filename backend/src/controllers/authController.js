import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      phone,
      role: role || "user",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
       name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};