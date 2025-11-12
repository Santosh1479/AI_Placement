import React, { useState, useEffect } from "react";
import axios from "axios";
import ATSChecker from "./ATSChecker";
import Topbar from "../components/topbar";
import { COLORS } from "../constants/colors";

const Home = () => {
  const [personal, setPersonal] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    usn: "",
  });
  const [allDrives, setAllDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/students/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setPersonal(res.data);
        return axios.get("http://localhost:5000/drives");
      })
      .then((driveRes) => {
        setAllDrives(driveRes.data);
        const studentSkills = res.data.skills || [];
        const matchedDrives = driveRes.data.filter((drive) =>
          drive.skillsRequired.some((skill) => studentSkills.includes(skill))
        );
        setFilteredDrives(matchedDrives);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEnroll = async (driveId) => {
    try {
      await axios.post(`http://localhost:5000/drives/${driveId}/enroll`, {
        usn: personal.usn,
      });
      setMessage("✅ Successfully enrolled! You’ll receive email updates.");
      const driveRes = await axios.get("http://localhost:5000/drives");
      const studentSkills = personal.skills || [];
      const matchedDrives = driveRes.data.filter((drive) =>
        drive.skillsRequired.some((skill) => studentSkills.includes(skill))
      );
      setFilteredDrives(matchedDrives);
    } catch (err) {
      setMessage("❌ Enrollment failed. Try again later.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
      }}
    >
      {/* 🌟 Topbar */}
      <Topbar
        name={personal.name}
        avatarUrl={`https://avatar.iran.liara.run/public/44`}
      />

      {/* 📄 Main Container */}
      <div
        className="max-w-5xl mx-auto mt-10 mb-12 p-10 rounded-3xl transition-all"
        style={{
          backgroundColor: COLORS.primary,
          boxShadow: `0 8px 25px ${COLORS.shadow}`,
        }}
      >
        {/* 🧩 ATS Resume Section */}
        <h1
          className="text-2xl md:text-3xl font-extrabold text-center mb-10 uppercase tracking-wide"
          style={{ color: COLORS.accent }}
        >
          Resume Analyzer & Skill Matching
        </h1>

        <div
          className="p-8 rounded-2xl mb-12 transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: COLORS.card,
            boxShadow: `0 4px 12px ${COLORS.shadow}`,
          }}
        >
          <ATSChecker />
        </div>

        {/* 🚀 Active Placement Drives */}
        <h2
          className="text-xl md:text-2xl font-bold mb-6 text-center uppercase tracking-wide"
          style={{ color: COLORS.accent }}
        >
          Active Placement Drives Matching Your Skills
        </h2>

        {filteredDrives.length === 0 ? (
          <div>
            <div
              className="text-center py-12 text-lg rounded-2xl mb-6"
              style={{
                backgroundColor: COLORS.card,
                color: COLORS.textLight,
                boxShadow: `0 3px 10px ${COLORS.shadow}`,
              }}
            >
              No drives currently match your skill set. Keep your resume updated!
            </div>
            <h2
              className="text-xl md:text-2xl font-bold mb-6 text-center uppercase tracking-wide"
              style={{ color: COLORS.accent }}
            >
              Available Placement Drives
            </h2>
            <ul className="space-y-6">
              {allDrives.map((drive) => {
                const isEnrolled = (drive.appliedUSNs || []).includes(personal.usn);
                return (
                  <li
                    key={drive._id}
                    className="p-6 md:p-8 rounded-2xl transition-transform hover:scale-[1.02]"
                    style={{
                      backgroundColor: COLORS.card,
                      boxShadow: `0 5px 14px ${COLORS.shadow}`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
                      <div>
                        <h3
                          className="text-lg md:text-xl font-extrabold mb-2"
                          style={{ color: COLORS.accent }}
                        >
                          {drive.companyName}
                        </h3>

                        <p style={{ color: COLORS.textLight }}>
                          <strong>Role:</strong> {drive.role}
                          <br />
                          <strong>Date:</strong> {drive.date}
                          <br />
                          <strong>Required Skills:</strong>{" "}
                          {drive.skillsRequired.join(", ")}
                          <br />
                          <strong>Required CGPA:</strong> {drive.cgpaRequired}
                          <br />
                          <strong>Current Round:</strong> {drive.currentRound}
                        </p>
                      </div>

                      {/* 🎯 Status / Enroll Button */}
                      <div className="text-center md:text-right">
                        {isEnrolled ? (
                          <span
                            className="px-4 py-2 rounded-lg font-semibold"
                            style={{
                              backgroundColor: COLORS.success,
                              color: COLORS.background,
                            }}
                          >
                            Enrolled
                          </span>
                        ) : drive.currentRound === "aptitude" ? (
                          <button
                            onClick={() => handleEnroll(drive._id)}
                            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-[1.05]"
                            style={{
                              backgroundColor: COLORS.highlight,
                              color: COLORS.background,
                            }}
                          >
                            Enroll
                          </button>
                        ) : (
                          <span
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{
                              backgroundColor: COLORS.border,
                              color: COLORS.textLight,
                            }}
                          >
                            Enrollment Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <ul className="space-y-6">
            {filteredDrives.map((drive) => {
              const isEnrolled = (drive.appliedUSNs || []).includes(personal.usn);
              return (
                <li
                  key={drive._id}
                  className="p-6 md:p-8 rounded-2xl transition-transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: COLORS.card,
                    boxShadow: `0 5px 14px ${COLORS.shadow}`,
                  }}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
                    <div>
                      <h3
                        className="text-lg md:text-xl font-extrabold mb-2"
                        style={{ color: COLORS.accent }}
                      >
                        {drive.companyName}
                      </h3>

                      <p style={{ color: COLORS.textLight }}>
                        <strong>Role:</strong> {drive.role}
                        <br />
                        <strong>Date:</strong> {drive.date}
                        <br />
                        <strong>Required Skills:</strong>{" "}
                        {drive.skillsRequired.join(", ")}
                        <br />
                        <strong>Required CGPA:</strong> {drive.cgpaRequired}
                        <br />
                        <strong>Current Round:</strong> {drive.currentRound}
                      </p>
                    </div>

                    {/* 🎯 Status / Enroll Button */}
                    <div className="text-center md:text-right">
                      {isEnrolled ? (
                        <span
                          className="px-4 py-2 rounded-lg font-semibold"
                          style={{
                            backgroundColor: COLORS.success,
                            color: COLORS.background,
                          }}
                        >
                          Enrolled
                        </span>
                      ) : drive.currentRound === "aptitude" ? (
                        <button
                          onClick={() => handleEnroll(drive._id)}
                          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-[1.05]"
                          style={{
                            backgroundColor: COLORS.highlight,
                            color: COLORS.background,
                          }}
                        >
                          Enroll
                        </button>
                      ) : (
                        <span
                          className="px-4 py-2 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: COLORS.border,
                            color: COLORS.textLight,
                          }}
                        >
                          Enrollment Closed
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* 📨 Message */}
        {message && (
          <div
            className="mt-8 text-center font-semibold py-4 px-6 rounded-2xl transition-all"
            style={{
              backgroundColor:
                message.includes("✅") || message.includes("Enrolled")
                  ? COLORS.success
                  : COLORS.highlight,
              color: COLORS.background,
              boxShadow: `0 4px 10px ${COLORS.shadow}`,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
