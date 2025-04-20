const express = require("express");
const Task = require("../models/Task");
const TimeLog = require("../models/TimeLog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET productivity score
router.get("/productivity-score", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "completed",
    });

    const totalTasks = await Task.countDocuments({
      assignedTo: userId,
    });

    const timeLogs = await TimeLog.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, totalDuration: { $sum: "$duration" } } },
    ]);

    const totalDuration = timeLogs[0]?.totalDuration || 0;

    const productivityScore = totalTasks
      ? Math.min(
          100,
          Math.round((completedTasks / totalTasks) * 100 + totalDuration / 3600)
        )
      : 0;

    res.json({
      productivityScore,
      completedTasks,
      totalTasks,
      totalDurationInHours: (totalDuration / 3600).toFixed(2),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to calculate productivity score",
        details: error.message,
      });
  }
});
module.exports = router;