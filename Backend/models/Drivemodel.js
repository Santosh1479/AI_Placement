const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    cgpaRequired: { type: Number, required: true },
    numStudentsSelected: { type: Number, default: 0 },
    numRequired: { type: Number, required: true },
    skillsRequired: [String],
    offerMoney: { type: Number, default: 0 },
    rounds: {
        aptitude: [String],           // USNs who cleared aptitude
        groupDiscussion: [String],    // USNs who cleared GD
        technicalInterview: [String], // USNs who cleared technical
        appointed: [String],          // USNs appointed
        rejected: [String]            // USNs rejected
    }
});

const Drive = mongoose.model("Drive", driveSchema);
module.exports = Drive;