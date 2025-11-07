import React from 'react';
import { COLORS } from './constants/colors';

const Index = () => {
  const handleGetStarted = () => {
    // Navigate to the login page with the default role as Student
    window.location.href = '/login?role=Student';
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: COLORS.background }}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8 text-center"
        style={{
          backgroundColor: COLORS.card || COLORS.white,
          color: COLORS.text,
        }}
      >
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          AI_Placement
        </h1>
        <p className="mb-6" style={{ color: COLORS.textLight }}>
          A simple login system for Students, HODs, and Admins.
        </p>

        <button
          onClick={handleGetStarted}
          className="w-full py-2 rounded-md font-semibold"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            border: `1px solid ${COLORS.border || 'transparent'}`,
          }}
        >
          Get Started
        </button>

        <div className="mt-4 text-sm" style={{ color: COLORS.textLight }}>
          Click "Get Started" to go to the login page.
        </div>
      </div>
    </div>
  );
};

export default Index;