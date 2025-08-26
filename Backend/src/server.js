// Backend/src/server.js
import express from "express";
import { connectDB } from "./Config/db.js";
import path from "path";
import bodyParser from "body-parser";
import authRoutes from "./Routes/Auth.routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import Ride from "./Models/Ride_Models.js";
import driverRoutes from "./Routes/Driver.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://quick-port-gules.vercel.app"],
    credentials: true,
  },
});

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://quick-port-gules.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "Public")));
const uploadsDir = path.join(__dirname, "Public", "Uploads");

app.use("/Uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.send("QuickPort Backend Working 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/driver", driverRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (userId, role) => {
    if (!userId || !role) {
      console.error("Invalid join-room parameters:", { userId, role });
      return;
    }
    
    socket.join(`${role}-${userId}`);
    console.log(`User ${userId} joined room as ${role}`);
  });

  socket.on("ride-request", async (rideData) => {
    try {
      console.log("Received ride request:", rideData);

      // Validate required fields
      if (!rideData.riderData || !rideData.riderData._id) {
        throw new Error("Invalid rider data");
      }

      if (
        !rideData.rideDetails ||
        !rideData.rideDetails.locations ||
        !rideData.rideDetails.locations.start
      ) {
        throw new Error("Invalid ride details");
      }

      // Save ride request to database
      const newRide = new Ride(rideData);
      await newRide.save();

      console.log("Ride saved to database:", newRide);

      // Find available drivers (you'll need to implement this logic)
      const availableDrivers = await findAvailableDrivers();
      console.log("Available drivers:", availableDrivers.length);

      // Emit ride request to available drivers
      availableDrivers.forEach((driver) => {
        io.to(`driver-${driver._id}`).emit("new-ride-request", newRide);
      });

      // Send confirmation to rider
      io.to(`rider-${rideData.riderData._id}`).emit(
        "ride-request-sent",
        newRide
      );
    } catch (error) {
      console.error("Error saving ride request:", error);
      io.to(`rider-${rideData.riderData._id}`).emit(
        "ride-request-error",
        error.message || "Failed to send ride request"
      );
    }
  });

  // Handle driver accepting ride
  socket.on("accept-ride", async (rideId, driverData, price) => {
    try {
      console.log("Driver accepting ride:", rideId, driverData, price);

      // Update ride with driver data and price
      const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
          driverData: driverData,
          price: price,
          driverStatus: "accepted",
        },
        { new: true }
      );

      // Notify rider that driver accepted
      io.to(`rider-${updatedRide.riderData._id}`).emit(
        "ride-accepted",
        updatedRide
      );

      // Notify driver that acceptance was successful
      io.to(`driver-${driverData._id}`).emit(
        "ride-acceptance-confirmed",
        updatedRide
      );
    } catch (error) {
      console.error("Error accepting ride:", error);
      io.to(`driver-${driverData._id}`).emit(
        "ride-acceptance-error",
        "Failed to accept ride"
      );
    }
  });

  // Handle ride rejection
  socket.on("reject-ride", (rideId, driverId) => {
    console.log("Driver rejecting ride:", rideId, driverId);

    // Notify rider that driver rejected
    // You might want to update the ride status in the database
    io.to(`rider-${rideId}`).emit("ride-rejected", driverId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

async function findAvailableDrivers() {
  try {
    const Driver = (await import("./Models/Driver_Models.js")).default;

    const availableDrivers = await Driver.find({
      isAvailable: true,
    });

    console.log("Available drivers:", availableDrivers.length);
    return availableDrivers;
  } catch (error) {
    console.error("Error finding available drivers:", error);
    return [];
  }
}

if (process.env.NODE_ENV !== "production") {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
