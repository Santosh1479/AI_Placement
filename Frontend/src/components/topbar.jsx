import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ name, avatarUrl, children }) => {
  const navigate = useNavigate();

  const displayName =
    name ||
    localStorage.getItem("name") ||
    localStorage.getItem("role") ||
    "User";
  const avatar =
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  const [unreadCount, setUnreadCount] = useState(
    Number(localStorage.getItem("unreadNotifications") || 0)
  );

  useEffect(() => {
    // update when other tabs change localStorage
    const onStorage = () =>
      setUnreadCount(Number(localStorage.getItem("unreadNotifications") || 0));
    window.addEventListener("storage", onStorage);

    // update when Notification page dispatches custom event in same tab
    const onCustom = (e) => setUnreadCount(Number(e?.detail ?? (localStorage.getItem("unreadNotifications") || 0)));
    window.addEventListener("unreadCountChanged", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("unreadCountChanged", onCustom);
    };
  }, []);

  // Logout logic: clear auth and redirect to /login
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("unreadNotifications");
    } catch (err) {
      // ignore
    }
    navigate("/login", { replace: true });
    // Reload the whole page
  };

  const goToNotifications = () => {
    const role = (localStorage.getItem("role") || "students").toLowerCase();
    // choose route per role; default to students notifications
    const path =
      role === "students"
        ? "/students/notifications"
        : role === "placeofficers"
        ? "/placeofficers/notifications"
        : role === "hods"
        ? "/hods/notifications"
        : "/notifications";
    navigate(path);
  };

  return (
    <div className="flex justify-between items-center gap-4 px-6 md:px-12 py-4 md:py-6 bg-indigo-600 rounded-b-3xl">
      {/* Left: avatar then name, then any children */}
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt="Profile"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow cursor-pointer"
        />

        <span className="text-white font-bold text-lg truncate max-w-xs">
          {displayName}
        </span>

        {children && <div className="ml-4">{children}</div>}
      </div>

      {/* Right: notification icon then logout */}
      <div className="flex items-center gap-3">
        <button
          onClick={goToNotifications}
          title="Notifications"
          className="relative p-2 rounded-full hover:bg-white/20 transition"
        >
          {/* simple bell icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>

          {/* optional badge dot if unread count exists in localStorage */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-white text-[10px] text-white">
              {/* small dot; show count if you prefer: {unreadCount} */}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="text-indigo-600 bg-white px-3 py-1 rounded-md font-medium hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;