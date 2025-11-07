const driveService = require("../services/driveservices");
const Drive = require("../models/Drivemodel");
const Student = require("../models/Student");
const notificationService = require("../services/notificationsservices");

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
    const driveId = req.params.id;
    const update = req.body;

    // console.log("[drivecontroller] updateDrive called", { driveId, update });

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    // Apply updates to drive
    Object.assign(drive, update);
    await drive.save();

    const notificationResults = {
      success: [],
      failed: []
    };

    // Process notifications for selected students
    const selectedUSNs = update.selectedUSNs || [];
    for (const usn of selectedUSNs) {
      try {
        // console.log(`[drivecontroller] Creating notification for selected student: ${usn}`);

        // Create notification data
        const notificationData = {
          usn,
          title: `${drive.companyName} - ${roundMap[update.currentRound] || update.currentRound} Round`,
          message: `Congratulations! You have been selected for the ${roundMap[update.currentRound] || update.currentRound} round of ${drive.companyName}.`,
          type: "result",
          round: roundMap[update.currentRound] || update.currentRound
        };

        // console.log("[drivecontroller] Notification data for selected student:", notificationData);

        // Create notification and send email
        const notif = await notificationService.createNotification(notificationData);

        notificationResults.success.push({
          usn,
          notificationId: notif._id
        });
        // console.log(`[drivecontroller] Notification sent successfully for ${usn}`);
      } catch (notifError) {
        // console.error(`[drivecontroller] Failed to send notification to ${usn}:`, notifError);
        notificationResults.failed.push({
          usn,
          error: notifError.message
        });
        continue;
      }
    }

    // Process notifications for rejected students
    const rejectedUSNs = update.rejectedUSNs || [];
    for (const usn of rejectedUSNs) {
      try {
        // console.log(`[drivecontroller] Creating rejection notification for student: ${usn}`);

        // Create rejection notification data
        const notificationData = {
          usn,
          title: `${drive.companyName} - Status Update`,
          message: `We regret to inform you that you have not been selected to proceed further in the ${drive.companyName} recruitment process.`,
          type: "result",
          round: "rejected"
        };

        // console.log("[drivecontroller] Notification data for rejected student:", notificationData);

        // Create notification and send email
        const notif = await notificationService.createNotification(notificationData);

        notificationResults.success.push({
          usn,
          notificationId: notif._id
        });
        // console.log(`[drivecontroller] Rejection notification sent successfully for ${usn}`);
      } catch (notifError) {
        // console.error(`[drivecontroller] Failed to send rejection notification to ${usn}:`, notifError);
        notificationResults.failed.push({
          usn,
          error: notifError.message
        });
        continue;
      }
    }

    return res.json({
      message: "Drive updated and notifications processed",
      drive,
      notificationResults: {
        successful: notificationResults.success.length,
        failed: notificationResults.failed.length,
        details: notificationResults
      }
    });

  } catch (err) {
    // console.error("[drivecontroller] Error in updateDrive:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = exports;