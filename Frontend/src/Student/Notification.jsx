import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../components/topbar";
import { COLORS } from "../constants/colors";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const displayName = localStorage.getItem("name") || "User";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { notifications, unreadCount } = response.data;
      setNotifications(notifications);
      localStorage.setItem("unreadNotifications", String(unreadCount));
      window.dispatchEvent(new CustomEvent("unreadCountChanged", { detail: unreadCount }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      localStorage.setItem("unreadNotifications", "0");
      window.dispatchEvent(new CustomEvent("unreadCountChanged", { detail: 0 }));
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      setMessage("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setMessage("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      setMessage("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      setMessage("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = notifications.filter((n) => n._id !== id);
      setNotifications(updated);
      setMessage("Notification deleted");

      const unreadCount = updated.filter((n) => !n.read).length;
      localStorage.setItem("unreadNotifications", String(unreadCount));
      window.dispatchEvent(new CustomEvent("unreadCountChanged", { detail: unreadCount }));
    } catch (error) {
      console.error("Error deleting notification:", error);
      setMessage("Failed to delete notification");
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "drive": return `${COLORS.primary}40`;
      case "result": return `${COLORS.success}40`;
      case "approval": return `${COLORS.warning}40`;
      default: return COLORS.border;
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: COLORS.background }}
    >
      <Topbar
        name={displayName}
        avatarUrl={`https://avatar.iran.liara.run/public/44`}
      />

      <div
        className="max-w-2xl mx-auto rounded-2xl p-8 mt-8"
        style={{
          backgroundColor: COLORS.card,
          boxShadow: `0 4px 10px ${COLORS.shadow}`,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl" style={{ color: COLORS.text }}>
            Your Notifications
          </h2>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm px-4 py-2 rounded-lg transition hover:opacity-90"
              style={{
                backgroundColor: COLORS.primary,
                color: "#fff",
              }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className="mb-4 p-3 rounded-lg"
            style={{
              backgroundColor: `${COLORS.success}20`,
              color: COLORS.success,
            }}
          >
            {message}
          </div>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-8" style={{ color: COLORS.textLight }}>
            No notifications yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note) => (
              <li
                key={note._id}
                className="p-4 rounded-lg transition hover:scale-[1.01]"
                style={{
                  backgroundColor: note.read ? COLORS.background : COLORS.card,
                  border: `2px solid ${getNotificationColor(note.type)}`,
                  boxShadow: `0 2px 4px ${COLORS.shadow}`,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="font-semibold"
                        style={{ color: COLORS.text }}
                      >
                        {note.title}
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${COLORS.primary}20`,
                          color: COLORS.primary,
                        }}
                      >
                        {note.type}
                      </span>
                    </div>

                    <div
                      className="text-sm mt-1"
                      style={{ color: COLORS.textLight }}
                    >
                      {note.message}
                    </div>

                    {note.round && (
                      <div
                        className="text-sm mt-1"
                        style={{ color: COLORS.primary }}
                      >
                        Round: {note.round}
                      </div>
                    )}

                    <div
                      className="text-xs mt-2"
                      style={{ color: COLORS.textMuted }}
                    >
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    {!note.read && (
                      <button
                        onClick={() => markAsRead(note._id)}
                        className="text-xs px-2 py-1 rounded transition hover:opacity-90"
                        style={{
                          backgroundColor: COLORS.primary,
                          color: "#fff",
                        }}
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(note._id)}
                      className="text-xs px-2 py-1 rounded transition hover:opacity-90"
                      style={{
                        backgroundColor: `${COLORS.expense}20`,
                        color: COLORS.expense,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
