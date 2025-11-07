const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  companyName: { type: String, required: true },
  cgpaRequired: { type: Number, required: true },
  numStudentsSelected: { type: Number, default: 0 },
  numRequired: { type: Number, required: true },
  skillsRequired: [String],
  offerMoney: { type: Number, default: 0 },
  date: { type: String },
  role: { type: String },
  completed: { type: Boolean, default: false },
  currentRound: { type: String, default: "aptitude" }, // <-- Track present stage
  appliedUSNs: [String], // <-- Track applied students
  rounds: {
    aptitude: [String],
    groupDiscussion: [String],
    technicalInterview: [String],
    appointed: [String],
    rejected: [String]
  }
});

const Drive = mongoose.model("Drive", driveSchema);
module.exports = Drive;