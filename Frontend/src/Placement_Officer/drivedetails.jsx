import React, { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Drive Details</h1>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={driveId}
            onChange={e => setDriveId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg w-full"
            placeholder="Enter Drive ID (e.g. DRV001)"
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {!drive && driveId && (
          <div className="text-red-500 mb-2">Drive not found.</div>
        )}
        {drive && (
          <div>
            <div className="mb-2 font-semibold text-indigo-800">
              {drive.company} | {drive.role}
            </div>
            <div className="text-gray-700 text-sm mb-2">
              Date: {drive.date} <br />
              Required: {drive.required} | Placed: {drive.placed} | Remaining: {drive.required - drive.placed}
              <br />
              Min CGPA: {drive.cgpa} | Skills: {drive.skills}
            </div>
            <div className="mb-4">
              <div className="font-semibold text-indigo-700 mb-1">Selected Students:</div>
              <ul className="list-disc pl-5 mb-2">
                {drive.selected.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Upload Offer Letter/Document</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full"
              onClick={handleSendEmail}
            >
              Send Email & Notify Selected
            </button>
            {message && (
              <div className="mt-4 text-green-700 font-bold text-center">{message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveDetails;