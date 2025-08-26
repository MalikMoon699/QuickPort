import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Creating new Socket.io server...");

    // Create HTTP server
    const http = require("http");
    const httpServer = http.createServer();

    // Initialize Socket.io
    io = new Server(httpServer, {
      cors: {
        origin: [
          "http://localhost:5173",
          "https://quick-port-gules.vercel.app",
        ],
        credentials: true,
      },
    });

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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

    res.socket.server.io = io;
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
