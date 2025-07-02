// src/server.ts
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import fs from "fs";

import artistsRouter from "./routes/artists";
import uploadRouter from "./routes/upload";
import errorHandler from "./middleware/errorHandler";
import notFound from "./middleware/notFound";

// Load environment variables
dotenv.config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(helmet());
app.use(morgan("combined"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use("/uploads", express.static(uploadsDir));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);

// Health check routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Artistly Backend is running");
});

app.get("/api", (_req: Request, res: Response) => {
  res.json({
    message: "Artistly API",
    endpoints: ["/api/artists", "/api/upload"],
  });
});

// Main API routes
app.use("/api/artists", artistsRouter);
app.use("/api/upload", uploadRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

// MongoDB connection and server start
const PORT: number = parseInt(process.env.PORT || "3001", 10);
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err: Error) => console.error("❌ MongoDB connection error:", err));

export default app;
