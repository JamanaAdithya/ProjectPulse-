const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number }, // in minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeLog", timeLogSchema);
