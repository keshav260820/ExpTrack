import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import connectDB from "./database/dbConnection.js";
import userRoutes from "./routes/userAuthRoute.js";
import rideRouter from "./routes/rideRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// static
app.use(express.static(path.join(__dirname, "../Frontend")));
app.use(express.static("public"));

// routes
app.use("/api/v4/user", userRoutes);
app.use("/api/v4/rides", rideRouter);

// frontend route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/login.html"));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    error: "Something went wrong!",
    message: err.message
  });
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();