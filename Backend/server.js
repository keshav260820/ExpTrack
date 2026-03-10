import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import your routes (Ensure these files use 'export default')
import userRoutes from "./routes/userAuthRoute.js";
import rideRouter from "./routes/rideRoute.js"; 

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, "../Frontend")));

// Routes
app.use("/api/v4/user", userRoutes);
app.use("/api/v4/rides", rideRouter);

// Default Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/login.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});