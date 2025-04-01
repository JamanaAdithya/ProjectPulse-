// File to handle all the routes for the project
const express = require("express");
const Project = require("../models/Project");
const router = express.Router();

// Get all projects
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().populate("createdBy members tasks");
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch projects", details: error.message });
    }
});

// Get a project by ID
router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("createdBy members tasks");
        if(!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch project", details: error.message });
    }
})

// Create a new project
router.post("/", async (req, res) => {
    try {
        const { name, description, createdBy, members, status } = req.body;
        
        // Validate required fields
        if ( !name || !createdBy ) {
            return res.status(400).json({ error: "Project name and createdBy are required" });
        }

        const newProject = new Project({ name, description, createdBy, members, status, });
        await newProject.save();
        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        res.status(500).json({ error: "Failed to create project", details: error.message });
    }
});

// update a project
router.put("/:id", async(req, res) => {
    try {
        const{ name, description, createdBy, members, status } = req.body;

        if( !name || !createdBy) {
            return res.status(400).json({ error: "Project name and createdBy are required" })
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description, createdBy, members, status },
            { new : true, runValidators: true }
        ).populate("createdBy members tasks");

        if(!updatedProject) {
            return res.status(400).json({ error: "Project not found" });
        }

        res.status(200).json({ message: "Project updated successfully", project: updatedProject });
    } catch (error) {
        res.status(500).json({ error: "Failed to update project", details: error.message });
    }
})


// Delete a project
router.delete("/:id", async(req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if(!deletedProject) {
            return res.status(400).json({ error: "Project not found" });
        }

        res.status(200).json({ error: "Project not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete project", details: error.message });
    }
})
module.exports = router;