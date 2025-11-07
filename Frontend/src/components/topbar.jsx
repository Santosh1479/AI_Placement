import React from "react";
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
    `https://avatar.iran.liara.run/public/44`;

  // Logout logic lives here: clear auth and redirect to /login
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
     
    } catch (err) {
      // ignore
    }
    window.location.replace("/login");
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

      {/* Right: logout button */}
      <div>
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
