import React, { useState, useEffect } from "react";
import axios from "axios";
import ATSChecker from "./ATSChecker";
import Topbar from "../components/topbar";

const home = () => {
  const [personal, setPersonal] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    usn: "",
  });
  const [resume, setResume] = useState(null);
  const [allDrives, setAllDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch student profile
    axios
      .get("http://localhost:5000/students/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPersonal(res.data);
        // Fetch all drives after getting skills
        axios.get("http://localhost:5000/drives").then((driveRes) => {
          setAllDrives(driveRes.data);
          // Filter drives by matching skills
          const studentSkills = res.data.skills || [];
          const matchedDrives = driveRes.data.filter((drive) =>
            drive.skillsRequired.some((skill) => studentSkills.includes(skill))
          );
          setFilteredDrives(matchedDrives);
        });
      });
  }, []);

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleEnroll = async (driveId) => {
    try {
      await axios.post(`http://localhost:5000/drives/${driveId}/enroll`, {
        usn: personal.usn,
      });
      setMessage("Enrolled in drive! You will receive email updates.");
      // Optionally, refetch drives to update UI
      axios.get("http://localhost:5000/drives").then((driveRes) => {
        setAllDrives(driveRes.data);
        const studentSkills = personal.skills || [];
        const matchedDrives = driveRes.data.filter((drive) =>
          drive.skillsRequired.some((skill) => studentSkills.includes(skill))
        );
        setFilteredDrives(matchedDrives);
      });
    } catch (err) {
      setMessage("Enrollment failed.");
    }
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
        avatarUrl={`https://ui-avatars.com/api/?name=${
          personal.name || "User"
        }`}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
        }}
      />

      {/* Main content card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        {/* Resume upload */}
       <ATSChecker />

        {/* Placement drives list */}
        <h2 className="text-indigo-700 font-bold text-xl mb-4">
          Active Placement Drives Matching Your Skills
        </h2>
        <ul className="space-y-4 mb-4">
          {filteredDrives.map((drive) => {
            const isEnrolled = (drive.appliedUSNs || []).includes(personal.usn);

            return (
              <li
                key={drive._id}
                className="border border-indigo-100 rounded-xl p-4 bg-gray-50 shadow-sm"
              >
                <strong className="text-indigo-700">{drive.companyName}</strong>
                <div className="text-gray-700 mt-1">
                  Role: <span className="font-medium">{drive.role}</span>
                  <br />
                  Date: <span className="font-medium">{drive.date}</span>
                  <br />
                  Required Skills:{" "}
                  <span className="font-semibold">
                    {drive.skillsRequired.join(", ")}
                  </span>
                  <br />
                  <span>
                    <strong>Required CGPA:</strong> {drive.cgpaRequired}
                  </span>
                  <br />
                  Current Round:{" "}
                  <span className="font-semibold">{drive.currentRound}</span>
                </div>
                <div className="mt-2">
                  {isEnrolled ? (
                    <span className="text-green-600 font-bold">Enrolled</span>
                  ) : drive.currentRound === "aptitude" ? (
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                      onClick={() => handleEnroll(drive._id)}
                    >
                      Enroll
                    </button>
                  ) : (
                    <span className="text-gray-500">Enrollment Closed</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {message && (
          <div className="mt-4 text-green-700 font-bold text-center">
            {message}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default home;