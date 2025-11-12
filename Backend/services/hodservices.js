const HOD = require("../models/HODmodel");
const Student = require("../models/Student");

exports.register = async (data) => {
  // Validate required fields
  if (!data.name || !data.email || !data.password || !data.department) {
    throw new Error('All fields (name, email, password, department) are required');
  }

  // Hash the password
  data.password = await HOD.hashPassword(data.password);

  // Create and save the HOD
  const hod = new HOD({
    name: data.name,
    email: data.email,
    password: data.password,
    department: data.department,
  });

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
  // Allow GPA edit
  const updateFields = { ...data };
  if (data.gpa !== undefined) updateFields.gpa = data.gpa;
  return await Student.findByIdAndUpdate(studentId, updateFields, { new: true });
};

exports.getHodProfile = async (hodId) => {
  const hod = await HOD.findById(hodId);
  if (!hod) throw new Error("HOD not found");
  return hod;
};