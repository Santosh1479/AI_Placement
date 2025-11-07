import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from './constants/colors';
import { registerUser } from './lib/api';

const Register = () => {
  const [role, setRole] = useState('Student'); // Default role is Student
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(name, email, password, role);
      alert(`Registration successful! Welcome, ${data.name}.`);
      
      // Redirect based on role
      if (data.role === 'Student') {
        navigate('/student/home'); // Navigate to Student Home
      } else if (data.role === 'HOD') {
        navigate('/hod/home'); // Navigate to HOD Home
      } else if (data.role === 'Admin') {
        navigate('/admin/home'); // Navigate to Admin Home
      }
    } catch (error) {
      alert(error.message || 'An error occurred during registration. Please try again.');
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
          Register
        </h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: COLORS.text }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
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
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-sm" style={{ color: COLORS.textLight }}>
          Already have an account? <a href="/login" className="underline">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;