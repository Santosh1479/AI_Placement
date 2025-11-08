const mongoose = require('mongoose');
const { sendEmail } = require("../utils/emailService");
const Notification = require("../models/Notifications");
const Student = require("../models/Student");

exports.createNotification = async (notificationData) => {
  try {
    console.log("[notifications] Creating notification:", notificationData);

    // Fetch student details using USN
    const student = await Student.findOne({ usn: notificationData.usn }).select("email name usn");
    if (!student || !student.email) {
      console.warn(`[notifications] Student not found or no email for USN ${notificationData.usn}`);
      throw new Error(`Student not found or no email for USN ${notificationData.usn}`);
    }

    // Create and save the notification
    const notification = new Notification(notificationData);
    const saved = await notification.save();

    console.log("[notifications] Notification saved to DB:", {
      id: saved._id,
      usn: saved.usn,
      type: saved.type,
    });

    // If the current round is "interview" and the student is selected, send an offer letter
    if (notificationData.round === "interview" && notificationData.type === "result") {
      console.log(`[notifications] Sending offer letter to ${student.email}`);

      const emailData = {
        student_name: student.name,
        company_name: notificationData.title.split(" - ")[0], // Extract company name from title
        role: "Software Engineer", // You can customize this role dynamically
         
      };

      await sendEmail(
        student.email,
        "Congratulations on Your Offer!",
        "You have been selected for the role of Software Engineer.",
        null, // HTML will be generated dynamically
        "Offer Letter Notification",
        emailData
      );

      console.log(`[notifications] Offer letter sent successfully to ${student.email}`);
    }

    return saved;
  } catch (err) {
    console.error("[notifications] Error in createNotification:", err);
    throw err;
  }
};

// Add this helper function at the top of the file
const createNotificationSafely = async (notificationData) => {
  try {
    const notification = await exports.createNotification(notificationData);
    return { success: true, notification };
  } catch (error) {
    console.error('[notifications] Failed to create notification:', error);
    return { success: false, error };
  }
};

// Add this to exports
exports.createNotificationSafely = createNotificationSafely;

// Get notifications for a specific student (USN)
exports.getStudentNotifications = async (usn) => {
    return await Notification.find({ usn })
        .sort({ createdAt: -1 })
        .populate('driveId', 'companyName role');
};

// Get unread notifications count for a student
exports.getUnreadCount = async (usn) => {
    return await Notification.countDocuments({ usn, read: false });
};

// Mark a notification as read
exports.markAsRead = async (notificationId, usn) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, usn },
        { read: true },
        { new: true }
    );
};

// Mark all notifications as read for a student
exports.markAllAsRead = async (usn) => {
    return await Notification.updateMany(
        { usn, read: false },
        { read: true }
    );
};

// Delete a notification
exports.deleteNotification = async (notificationId, usn) => {
    return await Notification.findOneAndDelete({ _id: notificationId, usn });
};