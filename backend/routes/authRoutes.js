const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const assignedRole = role === "admin" ? "admin" : "member";
    // create new user
    const newUser = new User({ name, email, password, role: assignedRole});
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to register user", details: error.message });
  }
});

const jwt = require("jsonwebtoken");

// User login
router.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // verify user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // generate JWT token
    if(!process.env.JWT_SECRET) {
        return res.status(500).json({error: "JWT_SECRET is missing"});
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successfull", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

module.exports = router;
