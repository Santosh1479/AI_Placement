const mongoose = require('mongoose');
const Notification = require("../models/Notifications");
const Student = require("../models/Student");
const { sendEmail } = require("../utils/emailService");

exports.createNotification = async (notificationData) => {
  try {
    // console.log("[notifications] Creating notification:", notificationData);

    // Fetch student details using USN
    const student = await Student.findOne({ usn: notificationData.usn }).select("email name usn");
    if (!student || !student.email) {
      // console.warn(`[notifications] Student not found or no email for USN ${notificationData.usn}`);
      throw new Error(`Student not found or no email for USN ${notificationData.usn}`);
    }

    // Create and save the notification
    const notification = new Notification(notificationData);
    const saved = await notification.save();

    // console.log("[notifications] Notification saved to DB:", {
    //   id: saved._id,
    //   usn: saved.usn,
    //   type: saved.type
    // });

    // Send email to the student
    // console.log(`[notifications] Triggering email service for student:`, {
    //   usn: student.usn,
    //   email: student.email
    // });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">${saved.title}</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.5;">${saved.message}</p>
        ${saved.round ? `<p style="color: #374151;"><strong>Round:</strong> ${saved.round}</p>` : ''}
        <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="color: #6B7280; font-size: 14px;">
          This is an automated message from the Placement Portal. Please do not reply to this email.
        </p>
      </div>
    `;

    await sendEmail(
      student.email,
      saved.title,
      saved.message,
      emailHtml
    );

    // console.log(`[notifications] Email service triggered and sent to ${student.email}`);
    return saved;

  } catch (err) {
    // console.error("[notifications] Error in createNotification:", err);
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