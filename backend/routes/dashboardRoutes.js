const express = require("express");
const Task = require("../models/Task");
const TimeLog = require("../models/TimeLog");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// GET /dashboard/task-stats
router.get("/task-stats", authMiddleware, async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task stats" });
  }
});

// GET /dashboard/time-stats
router.get("/time-stats", authMiddleware, async (req, res) => {
  try {
    const stats = await TimeLog.aggregate([
      {
        $group: {
          _id: "$project",
          totalDuration: { $sum: "$duration" },
        },
      },
    ]);
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch time stats" });
  }
});

module.exports = router;
