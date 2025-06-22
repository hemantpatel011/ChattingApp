import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";

import {
  userData,
  getAllUsers,
  getRecentUser,
  sendMessage,
  recieveMessage,
  updateUser,
} from "../controller/userController.js";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.get("/getUser", userProtect, userData);
router.get("/getAllUsers", userProtect, getAllUsers);
router.get("/getRecentUser/:id", userProtect, getRecentUser);
router.post("/send/:id", userProtect, sendMessage);
router.post("/receive/:id", userProtect, recieveMessage);
router.put("/update", userProtect, upload.single("photo"), updateUser);

export default router;