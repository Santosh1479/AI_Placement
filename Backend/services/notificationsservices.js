const Notification = require("../models/Notifications");
const Student = require("../models/Student");
const { sendEmail } = require("../utils/emailService");

// Create a new notification and send email (save always; email best-effort)
exports.createNotification = async (notificationData) => {
  // persist first so DB always has record even if email fails
  const notification = new Notification(notificationData);
  await notification.save();

  try {
    // attempt to resolve student email and send
    const student = await Student.findOne({ usn: notificationData.usn });
    if (student && student.email) {
      const emailSubject = notificationData.title;
      const emailText = notificationData.message;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">${notificationData.title}</h2>
          <p>${notificationData.message}</p>
          ${notificationData.round ? `<p><strong>Round:</strong> ${notificationData.round}</p>` : ""}
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Placement Portal. Please do not reply to this email.
          </p>
        </div>
      `;
      await sendEmail(student.email, emailSubject, emailText, emailHtml);
      // email succeeded
    } else {
      console.warn(`No email found for USN ${notificationData.usn}`);
    }
  } catch (err) {
    // log but do NOT fail the operation — notifications are persisted
    console.error("Email send failed for notification:", err.message || err);
  }

  return notification;
};

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