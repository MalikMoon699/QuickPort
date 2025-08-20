// Backend/src/Models/Rider_Models.js
import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    profileImg: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, default: "rider" },
  },
  { timestamps: true }
);

export default mongoose.model("Riders", riderSchema, "Riders");
