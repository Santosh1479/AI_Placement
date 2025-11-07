const studentService = require("../services/studentservices");
const Student = require("../models/Student");

exports.register = async (req, res) => {
    try {
        req.body.password = await Student.hashPassword(req.body.password);
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
        const updated = await Student.findByIdAndUpdate(req.user._id, req.body, { new: true });
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