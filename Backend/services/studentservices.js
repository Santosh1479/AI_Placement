const Student = require("../models/Student");
const { analyzeResume } = require("../utils/ats_score");

exports.register = async (data) => {
    data.password = await Student.hashPassword(data.password);
    const student = new Student(data);
    return await student.save();
};

exports.login = async (email, password) => {
    const student = await Student.findOne({ email }).select("+password");
    if (!student) throw new Error("Invalid credentials");
    const isMatch = await student.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");
    return student;
};

exports.getProfile = async (studentId) => {
    return await Student.findById(studentId).populate("drivesEnrolled.drive");
};

exports.analyzeResume = async (resumeText, jobDescription) => {
    try {
        const result = await analyzeResume(resumeText, jobDescription);
        if (!result.success) {
            throw new Error(result.error || 'Failed to analyze resume');
        }
        return result;
    } catch (error) {
        console.error("[studentServices] Resume analysis error:", error);
        throw error;
    }
};

exports.updateAtsScore = async (studentId, score) => {
    try {
        return await Student.findByIdAndUpdate(
            studentId,
            { ats_score: score },
            { new: true }
        );
    } catch (error) {
        console.error("[studentServices] Update ATS score error:", error);
        throw error;
    }
};
exports.getAtsScore = async (studentId) => {
    try {
        const student = await Student.findById(studentId).select("ats_score");
        return student ? student.ats_score : null;
    }
    catch (error) {
        // console.error("[studentServices] Get ATS score error:", error);
        throw error;
    }
};
