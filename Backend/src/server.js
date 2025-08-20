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
dotenv.config();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://quick-port-gules.vercel.app"],
    credentials: true,
  })
);
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "Public")));
const uploadsDir = path.join(__dirname, "Public", "Uploads");

app.use("/Uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.send("QuickPort Backend Working 🚀");
});
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
