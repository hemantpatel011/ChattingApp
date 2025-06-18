import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const userData = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.status(200).json({
      message: "All users retrieved successfully",
      users,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const getRecentUser = async (req, res, next) => {
  try {
    const receiverId = req.params.id;

    const recentUsers = await User.findById(receiverId);

    res.status(200).json({
      message: "Recent users retrieved successfully",
      receiver: recentUsers,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const receiverId = req.params.id;
    const message = req.params.message;
    const senderId = req.user._id;

    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);
    console.log("Message:", message);

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ message: "Receiver ID and message are required" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      timestamp: new Date(),
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const recieveMessage = async (req, res, next) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!senderId) {
      const error = new Error("Sender ID is required");
      error.statusCode = 400;
      return next(error);
    }
    if (!receiverId) {
      const error = new Error("Receiver ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const messages =
      (await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })) || [];

    res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
