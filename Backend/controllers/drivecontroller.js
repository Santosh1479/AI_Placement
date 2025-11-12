const driveService = require("../services/driveservices");
const Drive = require("../models/Drivemodel");
const Student = require("../models/Student");
const notificationService = require("../services/notificationsservices");
const emailService = require("../utils/emailService"); // Import email service

// helper to map drive round keys to notification round enum
const roundMap = {
  aptitude: "aptitude",
  groupDiscussion: "gd",
  technicalInterview: "interview",
  appointed: "selected",
};

exports.createDrive = async (req, res) => {
    try {
        const drive = await driveService.createDrive(req.body);
        res.status(201).json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.editDrive = async (req, res) => {
    try {
        const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteDrive = async (req, res) => {
    try {
        await driveService.deleteDrive(req.params.id);
        res.json({ message: "Drive deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.enrollStudent = async (req, res) => {
    try {
        const { usn } = req.body;
        if (!usn) return res.status(400).json({ error: "USN required" });

        // Add USN to appliedUSNs only if not already present
        const drive = await Drive.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { appliedUSNs: usn } },
            { new: true }
        );
        if (!drive) return res.status(404).json({ error: "Drive not found" });

        // Also add drive to student's drivesEnrolled if not already present
        const student = await Student.findOneAndUpdate(
            { usn },
            { $addToSet: { drivesEnrolled: { drive: drive._id, status: "aptitude" } } },
            { new: true }
        );
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json({ message: "Enrolled successfully", drive, student });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllDrives = async (req, res) => {
    try {
        const drives = await Drive.find();
        res.json(drives);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getActiveDrives = async (req, res) => {
    try {
        const drives = await Drive.find({ completed: false });
        res.json(drives);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOfferMoney = async (req, res) => {
    try {
        const drive = await driveService.updateOfferMoney(req.params.id, req.body.offerMoney);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.addStudentToRound = async (req, res) => {
    try {
        const drive = await driveService.addStudentToRound(req.params.id, req.body.round, req.body.usn);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.removeStudentFromRound = async (req, res) => {
    try {
        const drive = await driveService.removeStudentFromRound(req.params.id, req.body.round, req.body.usn);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDrive = async (req, res) => {
    try {
        const drive = await driveService.getDrive(req.params.id);
        res.json(drive);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find current drive
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ error: "Drive not found" });
    }

    // Update appointment counts if moving to appointed round
    if (updates.currentRound === "appointed" && updates.selectedUSNs) {
      drive.numStudentsSelected += updates.selectedUSNs.length;
      drive.numRequired = Math.max(0, drive.numRequired - updates.selectedUSNs.length);
    }

    // Apply other updates
    Object.assign(drive, updates);

    // Save changes
    await drive.save();

    // Send emails to selected students
    if (updates.selectedUSNs && updates.selectedUSNs.length > 0) {
      const selectedStudents = await Student.find({ usn: { $in: updates.selectedUSNs } });

      for (const student of selectedStudents) {
        const emailData = {
          to: student.email,
          subject: `Congratulations! You've advanced to the ${updates.currentRound} round`,
          text: `Dear ${student.name},\n\nYou have been selected to advance to the ${updates.currentRound} round for the drive at ${drive.companyName}. Please prepare accordingly.\n\nBest regards,\nPlacement Team`,
          html: `<p>Dear ${student.name},</p><p>You have been selected to advance to the <strong>${updates.currentRound}</strong> round for the drive at <strong>${drive.companyName}</strong>. Please prepare accordingly.</p><p>Best regards,<br>Placement Team</p>`,
        };

        await emailService.sendEmail(
          emailData.to,
          emailData.subject,
          emailData.text,
          emailData.html,
          "roundUpdate",
          { student, drive, round: updates.currentRound }
        );
      }
    }

    // Send updated drive data
    res.json(drive);
  } catch (error) {
    console.error("Drive update error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;