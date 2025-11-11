import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants/colors";

const NotVerified = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    // Clear local storage safely
    ["token", "role", "approval", "name"].forEach((key) =>
      localStorage.removeItem(key)
    );
    window.location.href = "/login";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        color: COLORS.text,
      }}
    >
      <div
        className="max-w-md w-full p-10 rounded-3xl shadow-2xl text-center transition-all hover:scale-[1.02]"
        style={{
          backgroundColor: COLORS.card,
          boxShadow: `0 12px 30px ${COLORS.shadow}`,
        }}
      >
        {/* 🔹 Title */}
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: COLORS.expense }}
        >
          Account Not Verified
        </h2>

        {/* 🧾 Message */}
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: COLORS.textLight }}
        >
          Your account is pending verification.
          <br />
          Please contact your <strong>HOD</strong> for approval before logging
          in.
        </p>

        {/* 🔘 Button */}
        <button
          onClick={handleBackToLogin}
          className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.03]"
          style={{
            backgroundColor: COLORS.highlight,
            color: "#fff",
            boxShadow: `0 4px 10px ${COLORS.shadow}`,
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default NotVerified;
