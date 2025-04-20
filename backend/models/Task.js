const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["todo", "in progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    timeLogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TimeLog",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
