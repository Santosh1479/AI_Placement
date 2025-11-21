const studentService = require("../services/studentservices");
const Student = require("../models/Student");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

exports.register = async (req, res) => {
    try {
        req.body.password = await Student.hashPassword(req.body.password);
        console.log("Register req.body:", req.body); // <-- Add this line
        const student = new Student(req.body);
        await student.save();
        const token = student.generateAuthToken();
        res.status(201).json({ token, student });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.body.email }).select('+password');
        if (!student) throw new Error('Invalid credentials');
        const isMatch = await student.comparePassword(req.body.password);
        if (!isMatch) throw new Error('Invalid credentials');
        const token = student.generateAuthToken();
        res.json({ token, student });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id).populate('drivesEnrolled.drive');
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updateFields = { ...req.body };
        // Only allow GPA update if present
        if (req.body.gpa !== undefined) updateFields.gpa = req.body.gpa;
        const updated = await Student.findByIdAndUpdate(req.user._id, updateFields, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateStudentByUsn = async (req, res) => {
    try {
        const { usn } = req.params;
        const updateFields = {};
        if (req.body.name) updateFields.name = req.body.name;
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.department) updateFields.department = req.body.department;
        if (req.body.placed !== undefined) updateFields.placed = req.body.placed;
        if (req.body.lpa !== undefined) updateFields.lpa = req.body.lpa;
        if (req.body.gpa !== undefined) updateFields.gpa = req.body.gpa;

        const student = await Student.findOneAndUpdate(
            { usn },
            { $set: updateFields },
            { new: true }
        );
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.calculateAtsScore = async (req, res) => {
    try {
        let resumeText = "";
        if (req.file) {
            if (req.file.mimetype === "application/pdf") {
                const data = await pdfParse(req.file.buffer);
                resumeText = data.text;
            } else if (
                req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                const result = await mammoth.extractRawText({ buffer: req.file.buffer });
                resumeText = result.value;
            } else {
                return res.status(400).json({ error: "Unsupported file type" });
            }
        } else {
            return res.status(400).json({ error: "Resume file is required" });
        }

        // You can optionally get jobDescription from req.body if you want
        const jobDescription = req.body.jobDescription || "";

        const result = await studentService.analyzeResume(resumeText, jobDescription);

        if (!result.success) {
            return res.status(500).json({
                error: "Failed to analyze resume",
                details: result.error
            });
        }

        await studentService.updateAtsScore(req.user._id, result.data.total_score);

        res.json({
            ...result.data,
            message: "ATS score updated successfully"
        });
    } catch (err) {
        console.error("[studentController] calculateAtsScore error:", err);
        res.status(500).json({
            error: "Failed to calculate ATS score",
            details: err.message
        });
    }
};

exports.getAtsScore = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json({ ats_score: student.ats_score });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};