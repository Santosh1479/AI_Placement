import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from './constants/colors';
import { loginUser } from './lib/api';

const Login = () => {
  const [role, setRole] = useState('Student'); // Default role is Student
  const [email, setEmail] = useState('test1@gmail.com');
  const [password, setPassword] = useState('test@404');
  const navigate = useNavigate(); // Hook for navigation

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password, role);
      alert(`Welcome, ${data.name}! You are logged in as ${data.role}.`);

      // Redirect based on role
      if (data.role === 'Student') {
        navigate('/student/home'); // Navigate to Student Home
      } else if (data.role === 'HOD') {
        navigate('/hod/home'); // Navigate to HOD Home
      } else if (data.role === 'Admin') {
        navigate('/admin/home'); // Navigate to Admin Home
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: COLORS.background }}
    >
      <div
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
        style={{
          backgroundColor: COLORS.card,
          color: COLORS.text,
        }}
      >
        <h2
          className="text-center text-2xl font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          {role} Login
        </h2>
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: COLORS.text }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: COLORS.text }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: COLORS.text }}
            >
              Role
            </label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Student">Student</option>
              <option value="HOD">HOD</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md font-bold text-white"
            style={{
              backgroundColor: COLORS.primary,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm" style={{ color: COLORS.textLight }}>
          Forgot your password? <a href="#" className="underline">Click here</a>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm" style={{ color: COLORS.textLight }}>
            Don't have an account?
          </p>
          <a
            href="/register"
            className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;