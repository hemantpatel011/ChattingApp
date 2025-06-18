import User from "../models/userModel.js";
import { generateAuthToken } from "../config/auth.js";
import bcrypt from "bcrypt";

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      return next(error);
    }

    // Generate token
    generateAuthToken(user._id, res);

    // Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const userRegister = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  // Validate input
  if (!fullName || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      return next(error);
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const profilePicture = `https://api.dicebear.com/5.x/initials/svg?seed=${fullName
      .charAt(0)
      .toUpperCase()}`;

    // Create new user
    const newuser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePicture,
    });
    if (!newuser) {
      const error = new Error("User registration failed");
      error.statusCode = 500;
      return next(error);
    }

    // Send response
    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const userLogout = async (req, res, next) => {
  try {
    // Clear the token from the request (if using cookies, clear the cookie)
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to the past
    });

    // Send response
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
