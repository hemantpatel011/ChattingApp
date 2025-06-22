import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const userProtect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    const error = new Error("No token provided, authorization denied");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      const error = new Error("User not found, authorization denied");
      error.statusCode = 404;
      return next(error);
    }
    next(); // Proceed to the route handler
  } catch (error) {
    console.error("Authentication error:", error);
    const err = new Error("Invalid token, authorization denied");
    err.statusCode = 401;
    next(err);
  }
};