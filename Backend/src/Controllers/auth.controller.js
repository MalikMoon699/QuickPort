// Backend/src/Controllers/auth.controller.js

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Driver from "../Models/Driver_Models.js";
import Rider from "../Models/Rider_Models.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { OAuth2Client } from "google-auth-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---- Helpers ----
const findUserByEmail = async (email) => {
  let user = await Rider.findOne({ email });
  let role = "rider";
  if (!user) {
    user = await Driver.findOne({ email });
    if (user) role = "driver";
  }
  return { user, role };
};

const createUserByType = async (email, type) => {
  if (type === "drive" || type === "driver") {
    const user = new Driver({ email, role: "driver" });
    await user.save();
    return { user, role: "driver" };
  }
  const user = new Rider({ email, role: "rider" });
  await user.save();
  return { user, role: "rider" };
};

// ---- Multer (upload avatar) ----
const uploadsDir = path.join(__dirname, "..", "Public", "Uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(
      null,
      `${req.user.email}-${Date.now()}${path.extname(file.originalname)}`
    ),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(null, false);
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
export const uploadProfileImage = upload.single("profileImg");

// ---- Nodemailer ----
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "malikmoon.developer061@gmail.com",
    pass: "upqk cerh kxbr qtup",
  },
});

// ---- Controllers ----
export const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

    let { user, role } = await findUserByEmail(email);
    if (!user) {
      ({ user, role } = await createUserByType(email, type));
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await transporter.sendMail({
      from: `"QuickPort" <malikmoon.developer061@gmail.com>`,
      to: email,
      subject: "Your OTP for QuickPort Login",
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });

    res
      .status(200)
      .json({ message: `OTP sent successfully`, role });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: `Failed to send OTP: ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }
  try {
    let { user } = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    if (user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "30d" }
);

    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: `Failed to verify OTP: ${error.message}` });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token, type } = req.body;
    if (!token)
      return res.status(400).json({ message: "Google token required" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let { user } = await findUserByEmail(email);
    if (!user) {
      ({ user } = await createUserByType(email, type));
      if (name) {
        user.firstName = name.split(" ")[0] || "";
        user.lastName = name.split(" ")[1] || "";
      }
      if (picture) user.profileImg = picture;
      await user.save();
    }

    const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res
      .status(200)
      .json({ message: "Google login successful", token: jwtToken, user });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Failed to login with Google" });
  }
};

export const appleLogin = async (_req, res) => {
  // Placeholder for real Apple Sign-in
  return res.status(501).json({ message: "Apple login not implemented yet" });
};

export const getUserData = async (req, res) => {
  try {
    const { email } = req.user || {};
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    let { user } = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { otp, otpExpires, ...obj } = user.toObject();
    res
      .status(200)
      .json({ message: "User data retrieved successfully", user: obj });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ message: `Failed to fetch user data: ${error.message}` });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email } = req.user || {};
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    let { user } = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, phoneNumber, gender, dob, location } =
      req.body;

    if (phoneNumber && phoneNumber.replace(/\D/g, "").length < 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be at least 10 digits" });
    }
    if (gender && !["Male", "Female", "Other", ""].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value" });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob;
    if (location !== undefined) user.location = location;

    if (req.file) {
      user.profileImg = `https://quick-port-backend.vercel.app/uploads/${req.file.filename}`;
      // user.profileImg = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    await user.save();
    const { otp, otpExpires, ...obj } = user.toObject();
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: obj });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: `Failed to update profile: ${error.message}` });
  }
};
