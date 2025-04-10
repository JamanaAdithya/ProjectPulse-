const express = require("express");
const Task = require("../models/task");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();
// Get all tasks
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }
    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("project", "name status");
    res.status(200).json({ tasks });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch tasks", details: error.message });
  }
});

// Get a task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "name status");
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch task", details: error.message });
  }
});

// create new task
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      dueDate,
      status,
      priority,
    } = req.body;
    if (!title || !project) {
      return res
        .status(400)
        .json({ error: "Title and Project ID are required" });
    }

    const newTask = new Task({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      status,
      priority,
    });
    await newTask.save();

    await Project.findByIdAndUpdate(project, {
      $push: { tasks: newTask._id },
    });

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create task", details: error.message });
  }
});

// Update a task
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      dueDate,
      status,
      priority,
    } = req.body;

    if (!title || !project) {
      return res
        .status(400)
        .json({ error: "Task title and project are required" });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, project, assignedTo, dueDate, status, priority },
      { new: true, runValidators: true }
    ).populate("assignedTo project");

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found " });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update task", details: error.message });
  }
});

// Delete a Task
router.delete("/:id",authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(400).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete task", details: error.message });
  }
});

module.exports = router;
