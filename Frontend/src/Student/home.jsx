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
  const [resumeScore, setResumeScore] = useState(personal.ats_score || 0);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    let studentData = null;
    axios
      .get("http://localhost:5000/students/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setPersonal(res.data);
        studentData = res.data;
        setResumeScore(res.data.ats_score || 0);
        return axios.get("http://localhost:5000/drives");
      })
      .then((driveRes) => {
        setAllDrives(driveRes.data);
        const studentSkills = studentData.skills || [];
        const unenrolledDrives = driveRes.data.filter(
          (drive) => !(drive.appliedUSNs || []).includes(studentData.usn)
        );
        const enrolledDrives = driveRes.data.filter((drive) =>
          (drive.appliedUSNs || []).includes(studentData.usn)
        );
        setFilteredDrives([...unenrolledDrives, ...enrolledDrives]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEnroll = async (driveId) => {
    try {
      await axios.post(`http://localhost:5000/drives/${driveId}/enroll`, {
        usn: personal.usn,
      });
      setMessage("✅ Successfully enrolled! You'll receive email updates.");
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

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const res = await axios.post(
        "http://localhost:5000/students/calculate-ats",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResumeScore(res.data.ats_score);
      setMessage("✅ Resume score updated successfully!");
      setFileName("");
      setResumeFile(null);
    } catch (err) {
      setMessage("❌ Failed to update resume score. Please try again.");
    }
    setUploading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10B981"; // Green
    if (score >= 60) return "#F59E0B"; // Amber
    if (score >= 40) return "#EF4444"; // Red
    return "#6B7280"; // Gray
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent! Your resume is ATS-optimized.";
    if (score >= 60) return "Good! Some improvements can be made.";
    if (score >= 40) return "Needs work. Consider optimizing your resume.";
    return "Upload your resume to get your ATS score.";
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
      <div className="max-w-6xl mx-auto mt-8  mb-12 p-6">
        {/* 🎯 Resume Score Card */}
        <div
          className="rounded-2xl p-8 mb-8  text-center"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent}20 100%)`,
            boxShadow: `0 8px 32px ${COLORS.shadow}`,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <h1 className="text-3xl md:text-4xl  text-white font-bold mb-4 uppercase tracking-wide">
            ATS Resume Analyzer
          </h1>
          <p className="text-lg mb-8  text-white opacity-90">
            Get your resume score and improve your job application success
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Score Display */}
            <div className="flex-1">
              <div className="relative inline-block">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: `conic-gradient(${getScoreColor(resumeScore)} ${
                      resumeScore * 3.6
                    }deg, ${COLORS.border} 0deg)`,
                  }}
                >
                  <div
                    className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
                    style={{ backgroundColor: COLORS.card }}
                  >
                    <span
                      className="text-3xl font-bold"
                      style={{ color: getScoreColor(resumeScore) }}
                    >
                      {resumeScore}
                    </span>
                    <span className="text-xs opacity-75">SCORE</span>
                  </div>
                </div>
              </div>
              <p
                className="text-lg font-semibold mt-2"
                style={{ color: getScoreColor(resumeScore) }}
              >
                {getScoreMessage(resumeScore)}
              </p>
            </div>

            {/* Upload Section */}
            <div className="flex-1 max-w-md">
              <div
                className="p-6 rounded-xl border-2 border-dashed transition-all"
                style={{
                  borderColor: resumeFile ? COLORS.accent : COLORS.border,
                  backgroundColor: COLORS.card,
                }}
              >
                <h3 className="text-lg  text-white font-semibold mb-4">
                  Update Your Resume Score
                </h3>

                <label
                  className="block w-full px-4 py-3 rounded-lg text-center cursor-pointer transition-all hover:scale-[1.02] mb-3"
                  style={{
                    backgroundColor: COLORS.highlight,
                    color: COLORS.background,
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden "
                  />
                  Choose Resume File
                </label>

                {fileName && (
                  <div className="text-center mb-4 p-2 rounded bg-green-50 border border-green-200">
                    <span className="text-sm text-green-700">✓ {fileName}</span>
                  </div>
                )}

                <button
                  onClick={handleResumeUpload}
                  disabled={uploading || !resumeFile}
                  className="w-full px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50  text-white disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: resumeFile ? COLORS.accent : COLORS.border,
                    color: COLORS.background,
                  }}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </span>
                  ) : (
                    "Update ATS Score"
                  )}
                </button>

                <p className="text-xs  text-white text-center mt-3 opacity-75">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 🏢 Available Drives Section */}
        <div className="mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6 text-center uppercase tracking-wide"
            style={{ color: COLORS.accent }}
          >
            Available Placement Drives
          </h2>

          {filteredDrives.length === 0 ? (
            <div
              className="text-center p-8 rounded-2xl"
              style={{
                backgroundColor: COLORS.card,
                boxShadow: `0 4px 12px ${COLORS.shadow}`,
                color: COLORS.text,
              }}
            >
              <p className="text-lg opacity-75">
                No drives available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {filteredDrives.map((drive) => {
                const isEnrolled = (drive.appliedUSNs || []).includes(
                  personal.usn
                );
                const skillMatch = personal.skills
                  ? drive.skillsRequired.filter((skill) =>
                      personal.skills.includes(skill)
                    ).length
                  : 0;
                const matchPercentage =
                  drive.skillsRequired.length > 0
                    ? Math.round(
                        (skillMatch / drive.skillsRequired.length) * 100
                      )
                    : 0;

                return (
                  <div
                    key={drive._id}
                    className="p-6 rounded-2xl transition-all hover:scale-[1.01] group"
                    style={{
                      backgroundColor: COLORS.card,
                      color: "#F8F6F0",
                      boxShadow: `0 4px 12px ${COLORS.shadow}`,
                      border: isEnrolled
                        ? `2px solid ${COLORS.success}`
                        : `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3
                            className="text-xl font-bold group-hover:text-blue-600 transition-colors"
                            style={{ color: COLORS.accent }}
                          >
                            {drive.companyName}
                          </h3>
                          {isEnrolled && (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: COLORS.success,
                                color: COLORS.background,
                              }}
                            >
                              Enrolled
                            </span>
                          )}
                        </div>

                        <div className="space-y-2  text-white">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm opacity-75">
                              Role:
                            </span>
                            <span>{drive.role}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm opacity-75">
                              Date:
                            </span>
                            <span>{drive.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm opacity-75">
                              CGPA Required:
                            </span>
                            <span>{drive.cgpaRequired}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm opacity-75">
                              Current Round:
                            </span>
                            <span className="capitalize">
                              {drive.currentRound}
                            </span>
                          </div>

                          {/* Skills Match Indicator */}
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Skills Match</span>
                              <span>{matchPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${matchPercentage}%`,
                                  backgroundColor:
                                    matchPercentage >= 70
                                      ? COLORS.success
                                      : matchPercentage >= 40
                                      ? COLORS.highlight
                                      : COLORS.accent,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-sm opacity-75">
                              Required Skills:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {drive.skillsRequired.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded text-xs"
                                  style={{
                                    backgroundColor: personal.skills?.includes(
                                      skill
                                    )
                                      ? COLORS.success
                                      : COLORS.border,
                                    color: personal.skills?.includes(skill)
                                      ? COLORS.background
                                      : COLORS.text,
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-end md:justify-center min-w-[120px]">
                        {isEnrolled ? (
                          <span
                            className="px-4 py-2 rounded-lg font-semibold text-sm"
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
                            className="px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                            style={{
                              backgroundColor: COLORS.highlight,
                              color: COLORS.background,
                            }}
                          >
                            Enroll Now
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
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 📨 Message */}
        {message && (
          <div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 animate-bounce-in"
            style={{
              backgroundColor: message.includes("✅")
                ? COLORS.success
                : COLORS.highlight,
              color: COLORS.background,
              boxShadow: `0 4px 12px ${COLORS.shadow}`,
            }}
          >
            {message}
            <button
              onClick={() => setMessage("")}
              className="ml-3 text-sm opacity-80 hover:opacity-100"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
