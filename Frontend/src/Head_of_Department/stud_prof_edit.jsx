import React, { useState } from "react";
import axios from "axios";
import { COLORS } from "../constants/colors";
import Topbar from "../components/topbar";

const StudProfEdit = () => {
  const [usn, setUsn] = useState("");
  const [student, setStudent] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    department: "",
    email: "",
    placed: false,
    lpa: 0,
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
      const found = res.data.find((s) => s.usn.toLowerCase() === usn.toLowerCase());
      if (found) {
        setStudent(found);
        setEditData({
          name: found.name,
          department: found.department,
          email: found.email,
          placed: found.placed,
          lpa: found.lpa,
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
        className="max-w-xl mx-auto rounded-2xl shadow-lg p-8 mt-10"
        style={{
          backgroundColor: COLORS.card,
          boxShadow: `0 6px 12px ${COLORS.shadow}`,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <h1
          className="text-2xl font-extrabold mb-6 text-center"
          style={{ color: COLORS.text }}
        >
          Edit Student Profile
        </h1>

        {/* Search Section */}
        <div className="mb-6">
          <label
            className="block font-semibold mb-2"
            style={{ color: COLORS.text }}
          >
            Enter Student USN
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="px-4 py-2 rounded-lg w-full outline-none focus:ring-2"
              style={{
                backgroundColor: COLORS.secondary,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text,
                transition: "0.2s",
              }}
              placeholder="e.g. 1AI20CS001"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.text,
              }}
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>
          {error && (
            <div
              style={{ color: COLORS.expense }}
              className="mt-3 text-sm font-medium"
            >
              {error}
            </div>
          )}
        </div>

        {/* Editable Form */}
        {student && (
          <form className="space-y-5 transition-all duration-300">
            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.text }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                }}
              />
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.text }}
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                value={editData.department}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                }}
              />
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.text }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                }}
              />
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.text }}
              >
                Placement Status
              </label>
              <div className="flex gap-8 items-center">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center cursor-pointer"
                    style={{ color: COLORS.text }}
                  >
                    <input
                      type="radio"
                      name="placed"
                      value={option === "Yes"}
                      checked={editData.placed === (option === "Yes")}
                      onChange={() =>
                        setEditData({ ...editData, placed: option === "Yes" })
                      }
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                className="block font-medium mb-1"
                style={{ color: COLORS.text }}
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
                className="px-4 py-2 rounded-lg w-full focus:ring-2 outline-none disabled:opacity-50"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                }}
                placeholder="e.g. 4.5"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 w-full rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-60"
              style={{
                backgroundColor: COLORS.success,
                color: COLORS.card,
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
