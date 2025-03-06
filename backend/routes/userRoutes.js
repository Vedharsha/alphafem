const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import your User model

router.get("/", (req, res) => {
  res.json({ message: "Auth API is working!" });
});
// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

module.exports = router;
