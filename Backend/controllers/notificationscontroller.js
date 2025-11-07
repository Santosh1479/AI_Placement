const notificationService = require("../services/notificationsservices");

// Get all notifications for the authenticated student
exports.getNotifications = async (req, res) => {
  try {
    const usn = req.user && req.user.usn;
    if (!usn) return res.status(400).json({ message: "USN missing from user" });
    const notifications = await notificationService.getStudentNotifications(usn);
    const unreadCount = await notificationService.getUnreadCount(usn);
    return res.json({ notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const usn = req.user && req.user.usn;
    const notification = await notificationService.markAsRead(notificationId, usn);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    const unreadCount = await notificationService.getUnreadCount(usn);
    return res.json({ message: "Marked as read", notification, unreadCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const usn = req.user && req.user.usn;
    await notificationService.markAllAsRead(usn);
    const unreadCount = await notificationService.getUnreadCount(usn);
    return res.json({ message: "All marked as read", unreadCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const usn = req.user && req.user.usn;
    const deleted = await notificationService.deleteNotification(notificationId, usn);
    if (!deleted) return res.status(404).json({ message: "Notification not found" });
    const unreadCount = await notificationService.getUnreadCount(usn);
    return res.json({ message: "Deleted", unreadCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};