import express from "express";
import { connectDB } from "./Config/db.js";
import path from "path";
import bodyParser from "body-parser";
import NameRoutes from "./Routes/Name.routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("QuickPort Backend Working 🚀");
});

app.use("/api", NameRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
