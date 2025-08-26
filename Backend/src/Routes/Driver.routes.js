// Backend/src/Routes/Driver.routes.js
import express from "express";
import { verifyToken } from "../Middleware/auth.js";
import Driver from "../Models/Driver_Models.js";

const router = express.Router();

router.put("/availability", verifyToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { isAvailable } = req.body;

    const driver = await Driver.findOneAndUpdate(
      { email },
      { isAvailable },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Availability updated successfully",
      isAvailable: driver.isAvailable,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Failed to update availability" });
  }
});

export default router;
