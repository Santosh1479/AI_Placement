import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from './constants/colors';
import { registerUser } from './lib/api';

const Register = () => {
  const [role, setRole] = useState('students'); // Change default role to lowercase 'students'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usn, setUsn] = useState(''); // For students
  const [department, setDepartment] = useState(''); // For students and HODs
  const [skills, setSkills] = useState(''); // For students
  const navigate = useNavigate(); // Hook for navigation

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data based on the role
      const data = {
        name,
        email,
        password,
        ...(role === 'students' && { usn, department, skills: skills.split(',') }),
        ...(role === 'hods' && { department }),
        ...(role === 'placeofficers' && {}), // Placement officers don't need additional data
      };

      // Call the registerUser API
      const response = await registerUser(data.name, data.email, data.password, role, data);

      // store token/role if present
      if (response?.token) localStorage.setItem('token', response.token);
      localStorage.setItem('role', role);

      // derive a display name from possible response shapes, fallback to submitted name or email
      const displayName =
        response?.name ||
        response?.user?.name ||
        response?.hod?.name ||
        response?.officer?.name ||
        response?.student?.name ||
        name ||
        email;
      localStorage.setItem('name', displayName);

      alert(`Registration successful! Welcome, ${displayName}.`);

      // Redirect based on role using react-router navigate
      if (role === 'students') {
        navigate('/students/home');
      } else if (role === 'hods') {
        navigate('/hods/home');
      } else if (role === 'placeofficers') {
        navigate('/placeofficers/home');
      } else {
        navigate('/');
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

          {/* Role-Specific Fields */}
          {role === 'students' && (
            <>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: COLORS.text }}
                >
                  USN
                </label>
                <input
                  type="text"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your USN"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: COLORS.text }}
                >
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your department"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: COLORS.text }}
                >
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your skills"
                  required
                />
              </div>
            </>
          )}

          {role === 'hods' && (
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: COLORS.text }}
              >
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your department"
                required
              />
            </div>
          )}

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
              <option value="students">Student</option>
              <option value="hods">HOD</option>
              <option value="placeofficers">Placement Officer</option>
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