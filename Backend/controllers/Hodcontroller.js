const hodService = require("../services/hodservices");

exports.register = async (req, res) => {
    try {
        const hod = await hodService.register(req.body);
        const token = hod.generateAuthToken();
        res.status(201).json({ token, hod });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const hod = await hodService.login(req.body.email, req.body.password);
        const token = hod.generateAuthToken();
        res.json({ token, hod });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const hod = await hodService.getHodProfile(req.user.id);
        res.json({ department: hod.department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveStudent = async (req, res) => {
    try {
        const student = await hodService.approveStudent(req.params.studentId);
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.editStudentProfile = async (req, res) => {
    try {
        const student = await hodService.editStudentProfile(req.params.studentId, req.body);
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};