const express = require("express");
const router = express.Router();
const hodController = require("../controllers/Hodcontroller");
const {  authHOD } = require("../middleware/authMiddleware");

// Register HOD
router.post("/register", hodController.register);

// Login HOD
router.post("/login", hodController.login);

// Approve student signup
router.put("/approve/:studentId",authHOD, hodController.approveStudent);

// Edit student profile
router.put("/student/:studentId",authHOD, hodController.editStudentProfile);

module.exports = router;