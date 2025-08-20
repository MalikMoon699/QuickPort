// Backend/src/Routes/Auth.routes.js
import express from "express";
import {
  sendOtp,
  verifyOtp,
  getUserData,
  updateProfile,
  uploadProfileImage,
  googleLogin,
  appleLogin,
} from "../Controllers/auth.controller.js";
import { verifyToken } from "../Middleware/auth.js";

const router = express.Router();

// Socials
router.post("/google-login", googleLogin);
router.post("/apple-login", appleLogin);

// OTP flow
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Authenticated user ops
router.get("/user", verifyToken, getUserData);
router.put("/update-profile", verifyToken, uploadProfileImage, updateProfile);

export default router;
