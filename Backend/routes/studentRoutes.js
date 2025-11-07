const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentcontroller");
const { authStudent } = require("../middleware/authMiddleware");

// Register a new student
router.post("/register", studentController.register);

// Login student
router.post("/login", studentController.login);

// Get logged-in student's profile
router.get("/profile", studentController.getProfile);

// Update student's profile (example, you need to implement in controller)
router.put("/profile", studentController.updateProfile);

// Get all students (example, you need to implement in controller)
router.get("/",  studentController.getAllStudents);

module.exports = router;