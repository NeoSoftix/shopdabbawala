import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("Token Verification Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

// allowed for a event snd permission 
export const allowedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};
