const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String }, 
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    status: { type: String, enum: ["pending", "in progress", "completed"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
