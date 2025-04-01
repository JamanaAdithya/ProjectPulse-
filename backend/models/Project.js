const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
