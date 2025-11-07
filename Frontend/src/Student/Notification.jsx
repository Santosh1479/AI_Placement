import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../components/topbar";

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
      window.dispatchEvent(
        new CustomEvent("unreadCountChanged", { detail: unreadCount })
      );
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
      
      // Refresh notifications after marking as read
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
      
      // Refresh notifications
      fetchNotifications();
      setMessage("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setMessage("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from local state
      setNotifications(notifications.filter(note => note._id !== id));
      setMessage("Notification deleted");
      
      // Update unread count
      const unreadCount = notifications.filter(n => !n.read && n._id !== id).length;
      localStorage.setItem("unreadNotifications", String(unreadCount));
      window.dispatchEvent(new CustomEvent("unreadCountChanged", { detail: unreadCount }));
    } catch (error) {
      console.error("Error deleting notification:", error);
      setMessage("Failed to delete notification");
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "drive": return "border-blue-200";
      case "result": return "border-green-200";
      case "approval": return "border-yellow-200";
      default: return "border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans">
      <Topbar
        name={displayName}
        avatarUrl={`https://ui-avatars.com/?name=${encodeURIComponent(
          displayName
        )}`}
      />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-indigo-700 font-bold text-xl">Your Notifications</h2>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No notifications yet.</div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note) => (
              <li
                key={note._id}
                className={`p-4 rounded-lg ${
                  note.read ? "bg-gray-50" : "bg-white"
                } border-2 ${getNotificationColor(note.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-800 font-semibold">
                        {note.title}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        note.type === "drive" ? "bg-blue-100 text-blue-700" :
                        note.type === "result" ? "bg-green-100 text-green-700" :
                        note.type === "approval" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {note.type}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {note.message}
                    </div>
                    {note.round && (
                      <div className="text-sm mt-1 text-indigo-600">
                        Round: {note.round}
                      </div>
                    )}
                    <div className="text-gray-400 text-xs mt-2">
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!note.read && (
                      <button
                        onClick={() => markAsRead(note._id)}
                        className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(note._id)}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
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