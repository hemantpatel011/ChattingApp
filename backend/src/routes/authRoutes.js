import express from "express";
import {
  userLogin,
  userRegister,
  userLogout,
} from "../controller/authController.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.post("/logout", userLogout);

export default router;
