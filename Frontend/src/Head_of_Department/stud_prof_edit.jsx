import React, { useState } from "react";
import axios from "axios";
import { COLORS } from "../constants/colors";
import Topbar from "../components/topbar";

const StudProfEdit = () => {
  const [usn, setUsn] = useState("");
  const [student, setStudent] = useState("1ai23cs001");
  const [editData, setEditData] = useState({
    name: "",
    department: "",
    email: "",
    placed: false,
    lpa: 0,
    gpa: 0, // Add GPA field
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSearch = async () => {
    if (!usn.trim()) {
      setError("Please enter a valid USN.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/students/");
      const found = res.data.find(
        (s) => s.usn.toLowerCase() === usn.toLowerCase()
      );
      if (found) {
        setStudent(found);
        setEditData({
          name: found.name,
          department: found.department,
          email: found.email,
          placed: found.placed,
          lpa: found.lpa,
          gpa: found.gpa, // Add GPA
        });
      } else {
        setStudent(null);
        setError("❌ Student not found.");
      }
    } catch {
      setError("⚠️ Error fetching student data.");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/students/${usn}`, editData);
      alert("✅ Student profile updated successfully!");
      setStudent(editData);
    } catch {
      alert("❌ Error updating student profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: COLORS.background }}
    >
      <Topbar name="HOD" />

      <div
        className="max-w-xl mx-auto rounded-3xl shadow-2xl p-8 mt-10"
        style={{
          backgroundColor: COLORS.primary,
          boxShadow: `0 2px 2px ${COLORS.highlight}`,
          border: `2px solid ${COLORS.accent}`,
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <h1
          className="text-2xl font-extrabold mb-8 text-center uppercase tracking-wide"
          style={{ color: COLORS.highlight, letterSpacing: "2px" }}
        >
          Edit Student Profile
        </h1>

        {/* Search Section */}
        <div className="mb-8">
          <label
            className="block font-semibold mb-2"
            style={{ color: COLORS.textLight }}
          >
            Enter Student USN
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="px-4 py-2 rounded-lg w-full outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: COLORS.secondary,
                border: `1.5px solid ${COLORS.highlight}`,
                color: "#6B7280",
                fontWeight: 500,
                fontSize: "1rem",
              }}
              placeholder="e.g. 1AI20CS001"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-5 py-2 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: COLORS.highlight,
                color: COLORS.background,
                boxShadow: `0 2px 8px ${COLORS.accent}`,
              }}
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>
          {error && (
            <div
              style={{ color: COLORS.highlight }}
              className="mt-3 text-sm font-medium"
            >
              {error}
            </div>
          )}
        </div>

        {/* Editable Form */}
        {student && (
          <form className="space-y-6 transition-all duration-300">
            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: "COLORS.textLight" }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none transition-all"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1.5px solid ${COLORS.accent}`,
                  color: "6B7280",
                  fontWeight: 500,
                }}
              />
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.textLight }}
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                value={editData.department}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none transition-all"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1.5px solid ${COLORS.accent}`,
                  color: "6B7280",
                  fontWeight: 500,
                }}
              />
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.textLight }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none transition-all"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1.5px solid ${COLORS.accent}`,
                  color: "6B7280",
                  fontWeight: 500,
                }}
              />
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.textLight }}
              >
                Placement Status
              </label>
              <div className="flex gap-8 items-center">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center cursor-pointer"
                    style={{ color: "6B7280" }}
                  >
                    <input
                      type="radio"
                      name="placed"
                      value={option === "Yes"}
                      checked={editData.placed === (option === "Yes")}
                      onChange={() =>
                        setEditData({ ...editData, placed: option === "Yes" })
                      }
                      className="mr-2 accent-highlight"
                      style={{
                        accentColor: COLORS.highlight,
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.textLight }}
              >
                LPA (if placed)
              </label>
              <input
                type="number"
                name="lpa"
                step="0.1"
                value={editData.lpa}
                onChange={handleChange}
                disabled={!editData.placed}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none disabled:opacity-50 transition-all"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1.5px solid ${COLORS.accent}`,
                  color: "6B7280",
                  fontWeight: 500,
                  opacity: editData.placed ? 1 : 0.6,
                }}
                placeholder="e.g. 4.5"
              />
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.textLight }}
              >
                GPA
              </label>
              <input
                type="number"
                name="gpa"
                step="0.01"
                min="0"
                max="10"
                value={editData.gpa}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none transition-all"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1.5px solid ${COLORS.accent}`,
                  color: "6B7280",
                  fontWeight: 500,
                }}
                placeholder="e.g. 8.5"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 w-full rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-60"
              style={{
                backgroundColor: COLORS.accent,
                color: "6B7280",
                boxShadow: `0 2px 8px ${COLORS.highlight}`,
                letterSpacing: "1px",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudProfEdit;
