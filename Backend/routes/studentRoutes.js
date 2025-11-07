const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentcontroller");
const auth = require("../middleware/auth");

// Register a new student
router.post("/register", studentController.register);

// Login student
router.post("/login", studentController.login);

// Get logged-in student's profile
router.get("/profile", auth, studentController.getProfile);

// Update student's profile (example, you need to implement in controller)
router.put("/profile", auth, studentController.updateProfile);

// Get all students (example, you need to implement in controller)
router.get("/", auth, studentController.getAllStudents);

module.exports = router;