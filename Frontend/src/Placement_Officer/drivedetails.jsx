import React, { useState } from "react";
import { COLORS } from '../constants/colors';

// Demo drives data (can import from a shared file)
const demoDrives = [
  { id: "DRV001", company: "Google", date: "2025-11-10", role: "SWE", required: 10, placed: 7, cgpa: "8.0", skills: "DSA, React", selected: ["Chandana", "Sneha Patel"], rejected: ["Rahul Verma"] },
  { id: "DRV002", company: "Amazon", date: "2025-11-15", role: "Cloud Eng", required: 8, placed: 5, cgpa: "7.5", skills: "AWS, Python", selected: ["Priya Singh"], rejected: [] },
];

const DriveDetails = () => {
  const [driveId, setDriveId] = useState("");
  const [drive, setDrive] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = () => {
    const found = demoDrives.find(d => d.id === driveId);
    setDrive(found || null);
    setMessage("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSendEmail = () => {
    if (!file) {
      setMessage("Please upload a file before sending.");
      return;
    }
    // Here you would send emails and notifications via backend
    setMessage("Emails and notifications sent to selected students (demo)!");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center font-sans"
      style={{ 
        background: `linear-gradient(to bottom right, ${COLORS.background}, ${COLORS.secondary})`
      }}
    >
      <div 
        className="max-w-lg w-full rounded-2xl p-8"
        style={{ 
          backgroundColor: COLORS.card,
          boxShadow: `0 4px 6px ${COLORS.shadow}`,
          border: `1px solid ${COLORS.border}`
        }}
      >
        <h1 
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: COLORS.primary }}
        >
          Drive Details
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={driveId}
            onChange={e => setDriveId(e.target.value)}
            className="px-3 py-2 rounded-lg w-full"
            style={{ 
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.background,
              color: COLORS.text
            }}
            placeholder="Enter Drive ID (e.g. DRV001)"
          />
          <button
            className="px-4 py-2 rounded-lg font-semibold transition"
            style={{ 
              backgroundColor: COLORS.primary,
              color: COLORS.white 
            }}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {!drive && driveId && (
          <div 
            className="mb-2"
            style={{ color: COLORS.expense }}
          >
            Drive not found.
          </div>
        )}

        {drive && (
          <div>
            <div 
              className="mb-2 font-semibold"
              style={{ color: COLORS.primary }}
            >
              {drive.company} | {drive.role}
            </div>

            <div 
              className="text-sm mb-2"
              style={{ color: COLORS.text }}
            >
              Date: {drive.date} <br />
              Required: {drive.required} | Placed: {drive.placed} | 
              Remaining: {drive.required - drive.placed}<br />
              Min CGPA: {drive.cgpa} | Skills: {drive.skills}
            </div>

            <div className="mb-4">
              <div 
                className="font-semibold mb-1"
                style={{ color: COLORS.primary }}
              >
                Selected Students:
              </div>
              <ul className="list-disc pl-5 mb-2">
                {drive.selected.map((s, idx) => (
                  <li 
                    key={idx}
                    style={{ color: COLORS.text }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <label 
                className="block font-medium mb-2"
                style={{ color: COLORS.text }}
              >
                Upload Offer Letter/Document
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full px-3 py-2 rounded-lg"
                style={{ 
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.background,
                  color: COLORS.text
                }}
              />
            </div>

            <button
              className="px-4 py-2 rounded-lg font-semibold transition w-full"
              style={{ 
                backgroundColor: COLORS.success,
                color: COLORS.white
              }}
              onClick={handleSendEmail}
            >
              Send Email & Notify Selected
            </button>

            {message && (
              <div 
                className="mt-4 font-bold text-center"
                style={{ color: COLORS.success }}
              >
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveDetails;