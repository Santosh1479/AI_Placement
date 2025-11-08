import React from "react";
import { useNavigate } from "react-router-dom";

const NotVerified = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    // Clear all auth-related data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("approval");
    localStorage.removeItem("name");
    
    // Force navigation to login
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Account Not Verified</h2>
        <p className="text-gray-700 mb-6">
          Your account is not yet verified.<br />
          Please meet your HOD for verification.
        </p>
        <button
          onClick={handleBackToLogin}
          className="text-indigo-600 underline cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default NotVerified;