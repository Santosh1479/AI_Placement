import React, { useState } from "react";
import Topbar from "../components/topbar";

// Demo drives data
const demoDrives = [
  { id: "DRV001", company: "Google", date: "2025-11-10", role: "SWE", status: "Enrolled", round: "Technical", selected: true, offerLetter: true },
  { id: "DRV002", company: "Amazon", date: "2025-11-15", role: "Cloud Eng", status: "Applied", round: "Aptitude", selected: false, offerLetter: false },
];

const home = () => {
  const [personal, setPersonal] = useState({
    name: "Your Name",
    email: "your@email.com",
    phone: "9876543210",
  });
  const [resume, setResume] = useState(null);
  const [enrolledDrives, setEnrolledDrives] = useState(demoDrives);
  const [message, setMessage] = useState("");

  const handlePersonalChange = (e) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleEnroll = (id) => {
    setEnrolledDrives(
      enrolledDrives.map((d) =>
        d.id === id ? { ...d, status: "Enrolled" } : d
      )
    );
    setMessage("Enrolled in drive! You will receive email updates.");
  };

  const handleDownloadOffer = (id) => {
    setMessage("Offer letter downloaded (demo)!");
    // Actual download logic goes here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans">
      {/* Top bar with profile */}
      <Topbar
           name={personal.name}
        avatarUrl={`https://avatar.iran.liara.run/public/44`}
       
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
        }}
      >
    
      </Topbar>

      {/* Main content card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        {/* Personal details */}
        <h2 className="text-indigo-700 font-bold text-xl mb-4">Personal Details</h2>
        <form className="space-y-4 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={personal.name}
              onChange={handlePersonalChange}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={personal.email}
              onChange={handlePersonalChange}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={personal.phone}
              onChange={handlePersonalChange}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </form>

        {/* Resume upload */}
        <div className="mb-8">
          <label
            htmlFor="resume-upload"
            className="block font-bold text-indigo-600 mb-2"
          >
            Upload Résumé
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
          />
          {resume && (
            <div className="text-gray-600 text-sm mt-1">
              Selected: {resume.name}
            </div>
          )}
        </div>

        {/* Placement drives list */}
        <h2 className="text-indigo-700 font-bold text-xl mb-4">
          Active Placement Drives
        </h2>
        <ul className="space-y-4 mb-4">
          {enrolledDrives.map((drive) => (
            <li
              key={drive.id}
              className="border border-indigo-100 rounded-xl p-4 bg-gray-50 shadow-sm"
            >
              <strong className="text-indigo-700">{drive.company}</strong>
              <div className="text-gray-700 mt-1">
                Role: <span className="font-medium">{drive.role}</span>
                <br />
                Date: <span className="font-medium">{drive.date}</span>
                <br />
                Status: <span className="font-semibold">{drive.status}</span>
                <br />
                Current Round: <span className="font-semibold">{drive.round}</span>
              </div>
              {drive.status !== "Enrolled" && (
                <button
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  onClick={() => handleEnroll(drive.id)}
                >
                  Enroll
                </button>
              )}
              {/* Demo: show selection/rejection message */}
              {drive.status === "Enrolled" && (
                <div className="mt-2">
                  {drive.selected ? (
                    <span className="text-green-700 font-bold">
                      Selected! Email sent.
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">
                      Not selected. Rejection email sent.
                    </span>
                  )}
                </div>
              )}
              {/* Download offer letter if available */}
              {drive.offerLetter && (
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  onClick={() => handleDownloadOffer(drive.id)}
                >
                  Download Offer Letter
                </button>
              )}
            </li>
          ))}
        </ul>
        {message && (
          <div className="mt-4 text-green-700 font-bold text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default home;