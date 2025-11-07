const HOD = require("../models/HODmodel");
const Student = require("../models/Student");

exports.register = async (data) => {
    data.password = await HOD.hashPassword(data.password);
    const hod = new HOD(data);
    return await hod.save();
};

exports.login = async (email, password) => {
    const hod = await HOD.findOne({ email }).select("+password");
    if (!hod) throw new Error("Invalid credentials");
    const isMatch = await hod.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");
    return hod;
};

exports.approveStudent = async (studentId) => {
    return await Student.findByIdAndUpdate(studentId, { approval: "approved" }, { new: true });
};

exports.editStudentProfile = async (studentId, data) => {
    return await Student.findByIdAndUpdate(studentId, data, { new: true });
};