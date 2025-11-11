import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants/colors";

const Topbar = ({ name, avatarUrl, children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toLowerCase();

  const displayName =
    name ||
    localStorage.getItem("name") ||
    localStorage.getItem("role") ||
    "User";

  const avatar =
    avatarUrl ||
    `https://avatar.iran.liara.run/public/44`;

  const [unreadCount, setUnreadCount] = useState(
    Number(localStorage.getItem("unreadNotifications") || 0)
  );

  // ✅ Keep unread count synced across tabs and components
  useEffect(() => {
    const onStorage = () =>
      setUnreadCount(Number(localStorage.getItem("unreadNotifications") || 0));

    const onCustom = (e) =>
      setUnreadCount(Number(e?.detail ?? (localStorage.getItem("unreadNotifications") || 0)));

    window.addEventListener("storage", onStorage);
    window.addEventListener("unreadCountChanged", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("unreadCountChanged", onCustom);
    };
  }, []);

  // ✅ Logout logic
  const handleLogout = () => {
    try {
      ["token", "role", "name", "unreadNotifications"].forEach((key) =>
        localStorage.removeItem(key)
      );
    } catch (err) {
      console.error("Logout error:", err);
    }

    window.dispatchEvent(new Event("app-logout"));
    window.location.replace("/login");
  };

  // ✅ Navigate to notifications based on role
  const goToNotifications = () => {
    const role = (localStorage.getItem("role") || "students").toLowerCase();
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
    <div
      className="flex justify-between items-center gap-4 px-6 md:px-12 py-4 md:py-6 rounded-b-3xl"
      style={{
        backgroundColor: COLORS.primary,
        boxShadow: `0 4px 10px ${COLORS.shadow}`,
        borderBottom: `2px solid ${COLORS.border}`,
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt="Profile"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 cursor-pointer transition-transform hover:scale-105"
          style={{
            borderColor: COLORS.border,
            boxShadow: `0 2px 8px ${COLORS.shadow}`,
          }}
        />

        <span
          className="font-bold text-lg truncate max-w-xs"
          style={{ color: COLORS.text }}
        >
          {displayName}
        </span>

        {children && <div className="ml-4">{children}</div>}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {role === "students" && (
          <button
            onClick={goToNotifications}
            title="Notifications"
            className="relative p-2 rounded-full transition-transform hover:scale-105"
            style={{
              backgroundColor: COLORS.card,
              boxShadow: `0 2px 4px ${COLORS.shadow}`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke={COLORS.text}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-3.5 h-3.5 rounded-full text-[10px]"
                style={{
                  backgroundColor: COLORS.expense,
                  color: COLORS.card,
                  border: `2px solid ${COLORS.primary}`,
                }}
              />
            )}
          </button>
        )}

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
          style={{
            backgroundColor: COLORS.accent,
            color: COLORS.card,
            boxShadow: `0 2px 6px ${COLORS.shadow}`,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
