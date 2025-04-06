import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import studentRoutes from "./routes/students.mjs";
import courseRoutes from "./routes/courses.mjs";
import rewardRoutes from "./routes/rewards.mjs";
import challengeRoutes from "./routes/challenges.mjs";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/challenges", challengeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
