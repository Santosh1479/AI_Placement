const Student = require("../models/Student");

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