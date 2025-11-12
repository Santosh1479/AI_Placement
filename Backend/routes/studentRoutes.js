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

//
router.post("/calculate-ats", authStudent, studentController.calculateAtsScore);

router.get("/get-ats", authStudent, studentController.getAtsScore);

// Get student's GPA
router.get("/gpa", authStudent, async (req, res) => {
    try {
        const student = await require("../models/Student").findById(req.user._id).select("gpa");
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json({ gpa: student.gpa });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update student's GPA
router.put("/gpa", authStudent, async (req, res) => {
    try {
        const { gpa } = req.body;
        if (gpa === undefined) return res.status(400).json({ error: "GPA is required" });
        const student = await require("../models/Student").findByIdAndUpdate(
            req.user._id,
            { gpa },
            { new: true }
        );
        res.json({ gpa: student.gpa });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;