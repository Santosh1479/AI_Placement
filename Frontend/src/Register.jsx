import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "./constants/colors";
import { registerUser } from "./lib/api";

const Register = () => {
  const [role, setRole] = useState("students");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usn, setUsn] = useState("");
  const [department, setDepartment] = useState("");
  const [GPA, setGPA] = useState("");
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      email,
      password,
      ...(role === "students" && {
        usn,
        department,
        skills: skills.split(","),
        gpa: parseFloat(GPA),
      }),
      ...(role === "hods" && { department }),
      ...(role === "placeofficers" && {}),
    };

    try {
      const response = await registerUser(
        data.name,
        data.email,
        data.password,
        role,
        data
      );

      if (response?.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", role || response?.role);
      }

      const displayName =
        response?.name ||
        response?.user?.name ||
        response?.hod?.name ||
        response?.officer?.name ||
        response?.student?.name ||
        name ||
        email;

      localStorage.setItem("name", displayName);

      if (role === "students") {
        const token = localStorage.getItem("token");
        const profileResponse = await fetch(
          "http://localhost:5000/students/profile",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profileData = await profileResponse.json();
        localStorage.setItem("approval", profileData.approval);

        if (profileData.approval === "approved")
          window.location.href = "/students/home";
        else window.location.href = "/students/not-verified";
      } else {
        let target = "/";
        if (role === "hods") target = "/hods/home";
        else if (role === "placeofficers") target = "/placeofficers/home";
        window.location.href = target;
      }
    } catch (error) {
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        backgroundColor: COLORS.background,
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        color: COLORS.text,
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded-3xl shadow-2xl transition-all hover:scale-[1.02]"
        style={{
          backgroundColor: COLORS.card,
          boxShadow: `0 12px 30px ${COLORS.shadow}`,
        }}
      >
        {/* 🔹 Title */}
        <h2
          className="text-center text-3xl font-extrabold mb-8 uppercase tracking-wide"
          style={{ color: COLORS.accent }}
        >
          Register as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h2>

        {/* 🧾 Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl p-3 transition duration-200"
              style={{
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.card,
                color: COLORS.text,
              }}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl p-3 transition duration-200"
              style={{
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.card,
                color: COLORS.text,
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl p-3 transition duration-200"
              style={{
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.card,
                color: COLORS.text,
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* 🧩 Conditional Inputs */}
          {role === "students" && (
            <>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.text }}
                >
                  USN
                </label>
                <input
                  type="text"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  className="w-full rounded-xl p-3 transition duration-200"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.card,
                    color: COLORS.text,
                  }}
                  placeholder="Enter your USN"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.text }}
                >
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl p-3 transition duration-200"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.card,
                    color: COLORS.text,
                  }}
                  placeholder="Enter your department"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.text }}
                >
                  GPA
                </label>
                <input
                  type="text"
                  value={GPA}
                  onChange={(e) => setGPA(e.target.value)}
                  className="w-full rounded-xl p-3 transition duration-200"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.card,
                    color: COLORS.text,
                  }}
                  placeholder="Enter your GPA"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.text }}
                >
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full rounded-xl p-3 transition duration-200"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.card,
                    color: COLORS.text,
                  }}
                  placeholder="e.g. React, Python, SQL"
                  required
                />
              </div>
            </>
          )}

          {role === "hods" && (
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.text }}
              >
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl p-3 transition duration-200"
                style={{
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.card,
                  color: COLORS.text,
                }}
                placeholder="Enter your department"
                required
              />
            </div>
          )}

          {/* 🧭 Role Selector */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Role
            </label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full rounded-xl p-3 transition duration-200 cursor-pointer"
              style={{
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.card,
                color: COLORS.text,
              }}
            >
              <option value="students">Student</option>
              <option value="hods">HOD</option>
              <option value="placeofficers">Placement Officer</option>
            </select>
          </div>

          {/* 🔘 Register Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.03]"
            style={{
              backgroundColor: COLORS.highlight,
              boxShadow: `0 4px 12px ${COLORS.shadow}`,
            }}
          >
            Register
          </button>
        </form>

        {/* 🔹 Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm mb-2" style={{ color: COLORS.textLight }}>
            Already have an account?
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 rounded-xl font-semibold transition-all hover:scale-[1.03]"
            style={{
              backgroundColor: COLORS.secondary,
              color: COLORS.text,
              boxShadow: `0 3px 8px ${COLORS.shadow}`,
            }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
