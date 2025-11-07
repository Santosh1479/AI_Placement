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

// Update student's profile
router.put("/profile", authStudent, studentController.updateProfile);

// Get all students (for HOD, remove authStudent if needed)
router.get("/", studentController.getAllStudents);

// Update any student by USN (for HOD)
router.put("/:usn", studentController.updateStudentByUsn);

module.exports = router;