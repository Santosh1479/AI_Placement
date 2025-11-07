const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationscontroller");
const { authStudent } = require("../middleware/authMiddleware");


// Get all notifications for the authenticated student
router.get("/", authStudent, notificationController.getNotifications);

// Mark a specific notification as read
router.put("/:notificationId/read", authStudent, notificationController.markAsRead);

// Mark all notifications as read
router.put("/read-all", authStudent, notificationController.markAllAsRead);

// Delete a notification
router.delete("/:notificationId", authStudent, notificationController.deleteNotification);

module.exports = router;