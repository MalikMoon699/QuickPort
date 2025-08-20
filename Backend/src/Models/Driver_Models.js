// Backend/src/Models/Driver_Models.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
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
    CNIC: { type: String, default: "" },
    rideType: { type: String, default: "" },
    rideNumber: { type: String, default: "" },
    rideBrand: { type: String, default: "" },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, default: "driver" },
  },
  { timestamps: true }
);

export default mongoose.model("Drivers", driverSchema, "Drivers");
