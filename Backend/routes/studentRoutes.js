const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentcontroller");
const { authStudent } = require("../middleware/authMiddleware");

// Register a new student
router.post("/register", studentController.register);

// Login student
router.post("/login", studentController.login);

// Get logged-in student's profile
router.get("/profile", authStudent, studentController.getProfile);

// Update student's profile (example, you need to implement in controller)
router.put("/profile", authStudent, studentController.updateProfile);

// Get all students (example, you need to implement in controller)
router.get("/", authStudent, studentController.getAllStudents);

module.exports = router;