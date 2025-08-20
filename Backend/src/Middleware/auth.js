// Backend/src/Middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  console.log("Incoming token:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT error:", err);
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
