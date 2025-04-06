const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();
const jwt = require("jsonwebtoken");

// User registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
    const newUser = new User({ name, email, password, role: assignedRole });
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

// Google oauth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Oauth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

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
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is missing" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successfull", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized no token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: "Invalid token", details: error.message });
  }
});

module.exports = router;
