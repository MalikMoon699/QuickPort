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
      _id: { type: mongoose.Schema.Types.ObjectId, required: false }, // Make required: false
      email: { type: String, required: false }, // Make required: false
      profileImg: { type: String, default: "" },
      firstName: { type: String, required: false }, // Make required: false
      lastName: { type: String, required: false }, // Make required: false
      phoneNumber: { type: String, required: false }, // Make required: false
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: false, // Make required: false
      },
      CNIC: { type: String, required: false }, // Make required: false
      rideType: {
        type: String,
        enum: ["Car", "Bike", "Auto"],
        required: false,
      }, // Make required: false
      rideNumber: { type: String, required: false }, // Make required: false
      rideBrand: { type: String, required: false }, // Make required: false
      role: { type: String, enum: ["driver"], default: "driver" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },

    rideDetails: {
      locations: {
        start: { type: String, required: true },
        stop: { type: String, required: false }, // Make stop optional
        end: { type: String, required: true },
        totalDistance: { type: String, required: false }, // Make this optional initially
        riderlocation: { type: String, required: true },
        driverlocation: { type: String, required: false }, // Make this optional initially
      },
      Time: { type: String, default: "now" },
    },

    price: { type: String, required: false }, // Make price optional initially
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

export default mongoose.model("Ride", rideSchema, "Ride");
