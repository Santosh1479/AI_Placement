import React from "react";
const NotVerified = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100">
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Account Not Verified</h2>
      <p className="text-gray-700 mb-6">
        Your account is not yet verified.<br />
        Please meet your HOD for verification.
      </p>
      <a href="/login" className="text-indigo-600 underline">Back to Login</a>
    </div>
  </div>
);
export default NotVerified;