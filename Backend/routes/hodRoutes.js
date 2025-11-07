const express = require("express");
const router = express.Router();
const hodController = require("../controllers/Hodcontroller");
const { protect } = require("../middleware/authMiddleware");

// Register HOD
router.post("/register", hodController.register);

// Login HOD
router.post("/login", hodController.login);

// Approve student signup
router.put("/approve/:studentId", hodController.approveStudent);

// Edit student profile
router.put("/student/:studentId", hodController.editStudentProfile);

module.exports = router;