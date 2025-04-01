const express = require("express");
const TimeLog = require("../models/TimeLog");

const router = express.Router();

// Get all time logs
router.get("/" , async(req, res) => {
    try {
        const timeLogs = await TimeLog.find()
        res.status(200).json(timeLogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch time logs", details: error.message });
    }
});

// Get a single time log by id
router.get("/:id", async(req, res) => {
    try {
        const timeLog = await TimeLog.findById(req.params.id);
        if (!timeLog) return res.status(404).json({ error: "Timelog not found"});
        res.status(200).json(timeLog)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch time log", details: error.message });
    }
});

// Create a new time log
router.post("/", async(req, res) => {
    try {
        const { user, project, task, startTime, endTime, duration } = req.body;

        if( !user || !startTime || !project ) {
            return res.status(400).json({ error: "user, start time, project are required" })
        }
        
        const newTimeLog = new TimeLog({ user, project, task, startTime, endTime, duration, })
        await newTimeLog.save();

        res.status(201).json({ message: "TimeLog created successfully", timeLog: newTimeLog });
    } catch (error) {
        res.status(500).json({ error: "Failed to create time log", details: error.message });
    }
});

// Update a time log
router.put("/:id", async (req, res) => {
    try {
        const { user, project, task, startTime, endTime, duration } = req.body;

        if (!user || !project || !startTime) {
            return res.status(400).json({ error: "User, project, and startTime are required" });
        }
        const updatedTimeLog = await TimeLog.findByIdAndUpdate(
            req.params.id, 
            { user, project, task, startTime, endTime, duration }, 
            { new: true, runValidators: true }
        ).populate("user project task");

        if (!updatedTimeLog) {
            return res.status(404).json({ error: "TimeLog not found" });
        }

        res.status(200).json({ message: "TimeLog updated successfully", timeLog: updatedTimeLog });
    } catch (error) {
        res.status(500).json({ error: "Failed to update time log", details: error.message });
    }
});

// Delete a time log
router.delete("/:id", async (req, res) => {
    try {
        const deletedTimeLog = await TimeLog.findByIdAndDelete(req.params.id);
        if (!deletedTimeLog) return res.status(404).json({ error: "TimeLog not found" });

        res.status(200).json({ message: "TimeLog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete time log", details: error.message });
    }
});

module.exports = router;