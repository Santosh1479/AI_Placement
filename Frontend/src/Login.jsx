import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "./constants/colors";
import { loginUser } from "./lib/api";

const Login = () => {
  const [role, setRole] = useState("students");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("testpass");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password, role);

      if (data?.token) localStorage.setItem("token", data.token);
      localStorage.setItem("role", role || data?.role);

      const displayName =
        data?.name ||
        data?.user?.name ||
        data?.officer?.name ||
        data?.student?.name ||
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

        if (profileData.approval === "approved") {
          window.location.href = "/students/home";
        } else {
          window.location.href = "/students/not-verified";
        }
      } else {
        let target = "/";
        if (role === "hods") target = "/hods/home";
        else if (role === "placeofficers") target = "/placeofficers/home";
        window.location.href = target;
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundColor: COLORS.background,
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        color: COLORS.text,
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 shadow-2xl transition-all hover:scale-[1.02]"
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
          {role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h2>

        {/* 🧾 Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
                // backgroundColor: COLORS.surface,
                color: COLORS.text, // Ensures text is visible
                caretColor: COLORS.accent, // Improves cursor visibility
                backgroundColor: COLORS.card, // replaces pure white
                // color: COLORS.text, // visible text color
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
                color: COLORS.text, // Ensures text is visible
                caretColor: COLORS.accent, // Improves cursor visibility
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl p-3 transition duration-200 cursor-pointer"
              style={{
                border: `1px solid ${COLORS.border}`,
               backgroundColor: COLORS.card,
                color: COLORS.text, // Ensures text is visible
              }}
              required
            >
              <option value="students">Student</option>
              <option value="hods">HOD</option>
              <option value="placeofficers">Placement Officer</option>
            </select>
          </div>

          {/* 🔘 Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.03]"
            style={{
              backgroundColor: COLORS.highlight,
              boxShadow: `0 4px 12px ${COLORS.shadow}`,
            }}
          >
            Login
          </button>
        </form>

        {/* 🧭 Footer Section */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="text-sm font-medium hover:underline"
            style={{ color: COLORS.accent }}
          >
            Forgot your password?
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm mb-2" style={{ color: COLORS.textLight }}>
            Don’t have an account?
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-2 rounded-xl font-semibold transition-all hover:scale-[1.03]"
            style={{
              backgroundColor: COLORS.secondary,
              color: COLORS.text,
              boxShadow: `0 3px 8px ${COLORS.shadow}`,
            }}
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
