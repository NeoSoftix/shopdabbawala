import User from "../../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, Password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: req.secure,
      sameSite: req.secure ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get me controller
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully get the user",
      user: user,
    });
  } catch (error) {
    console.log("Get me error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Issues a short-lived JWT for the socket.io handshake. The main `token`
// cookie is httpOnly and, on the deployed app, cross-site (Vercel frontend
// -> Render backend) - browsers with third-party cookie blocking (Safari,
// Firefox, and a growing share of Chrome users) drop it on the socket
// handshake even with SameSite=None; Secure set. This endpoint rides the
// same-origin Vercel rewrite (like every other REST call), so the httpOnly
// cookie reaches it reliably; the token it returns is then sent explicitly
// in the socket connection's `auth` payload instead of depending on cookies.
export const issueSocketToken = async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user.userId, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.log("Issue socket token error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// log out
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: req.secure,
      sameSite: req.secure ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
