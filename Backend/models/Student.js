const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "Name must be longer"],
    },
    usn: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    department: {
        type: String,
        required: true,
    },
    skills: [String],
    approval: {
        type: String,
        enum: ["inprogress", "approved"],
        default: "inprogress"
    },
    drivesEnrolled: [{
        drive: { type: mongoose.Schema.Types.ObjectId, ref: "Drive" },
        status: {
            type: String,
            enum: ["aptitude", "gd", "interview", "selected", "rejected"],
            default: "aptitude"
        }
    }]
});

studentSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

studentSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

studentSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;