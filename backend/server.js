const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timeLogRoutes = require("./routes/timeLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productivityRoutes = require("./routes/productivityRoutes");
require("./middleware/passport");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timelogs", timeLogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dashboard", productivityRoutes);
// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log("📌 Incoming Request:");
  console.log("➡️ Method:", req.method);
  console.log("➡️ URL:", req.url);
  console.log("➡️ Headers:", req.headers);
  console.log("➡️ Body:", req.body);
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("ProjectPulse Backend is Running! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const Project = require("./models/Project");
const Task = require("./models/Task");
const TimeLog = require("./models/TimeLog");

// Temporary Test Route
app.get("/test-models", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ message: "Models are working!", projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
