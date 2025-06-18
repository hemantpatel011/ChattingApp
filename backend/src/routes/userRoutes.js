import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";

import {
  userData,
  getAllUsers,
  getRecentUser,
  sendMessage,
  recieveMessage,
} from "../controller/userController.js";

const router = express.Router();

router.get("/getUser", userProtect, userData);
router.get("/getAllUsers", userProtect, getAllUsers);
router.get("/getRecentUser/:id", userProtect, getRecentUser);
router.post("/send/:id&:message", userProtect, sendMessage);
router.post("/receive/:id", userProtect, recieveMessage);

export default router;
