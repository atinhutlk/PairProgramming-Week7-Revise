const User = require("../models/userModel");
const mongoose = require("mongoose");

//GET / users;
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

// POST /users
const createUser = async (req, res) => {
  try {
    const newUser = await User.create({ ...req.body });
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create user", error: error.message });
  }
};

// GET /users/:userId
const getUserById = async (req, res) => {
  res.send("getUserById");
};
// DeLETE /users/:userId
const deleteUser = async (req, res) => {
  res.send("deleteUser");
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
