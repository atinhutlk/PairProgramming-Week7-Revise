const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// CRUD routes
router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;
