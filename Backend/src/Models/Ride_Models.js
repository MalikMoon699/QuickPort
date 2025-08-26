// Backend/src/Models/Ride_Models.js
import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    riderData: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
      profileImg: { type: String, default: "" },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      role: { type: String, enum: ["rider"], default: "rider" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },

    driverData: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
      profileImg: { type: String, default: "" },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      CNIC: { type: String, required: true },
      rideType: { type: String, enum: ["Car", "Bike", "Auto"], required: true },
      rideNumber: { type: String, required: true },
      rideBrand: { type: String, required: true },
      role: { type: String, enum: ["driver"], default: "driver" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },

    rideDetails: {
      locations: {
        start: { type: String, required: true },
        stop: { type: String, required: true },
        end: { type: String, required: true },
        totalDistance: { type: String, required: true },
        riderlocation: { type: String, required: true },
        driverlocation: { type: String, required: true },
      },
      Time: { type: String, default: "now" },
    },

    price: { type: String, required: true },
    driverStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    riderStatus: {
      type: String,
      enum: ["pending", "accepted", "cancelled"],
      default: "pending",
    },
    rideStatus: {
      type: String,
      enum: ["pending", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema,"Ride");