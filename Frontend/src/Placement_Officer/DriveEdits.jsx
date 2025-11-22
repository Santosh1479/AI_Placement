import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { COLORS } from "../constants/colors";

const API_URL = "http://localhost:5000/drives";
const roundsOrder = [
  "aptitude",
  "groupDiscussion",
  "technicalInterview",
  "appointed",
];

const roundLabels = {
  aptitude: "Aptitude Test",
  groupDiscussion: "Group Discussion",
  technicalInterview: "Technical Interview",
  appointed: "Appointed",
};

const DriveEdits = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [selectedUSNs, setSelectedUSNs] = useState([]);
  const [rejectedUSNs, setRejectedUSNs] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setDrive(res.data))
      .catch(() => setDrive(null));
  }, [id]);

  if (!drive) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: COLORS.text }}>Loading drive details...</p>
        </div>
      </div>
    );
  }

  const currentRound = drive.currentRound;

  const handleSelect = (usn) => {
    setSelectedUSNs([...selectedUSNs, usn]);
    setRejectedUSNs(rejectedUSNs.filter((u) => u !== usn));
  };

  const handleReject = (usn) => {
    setRejectedUSNs([...rejectedUSNs, usn]);
    setSelectedUSNs(selectedUSNs.filter((u) => u !== usn));
  };

  const handleNextStage = async () => {
    try {
      setLoading(true);
      const currentIndex = roundsOrder.indexOf(currentRound);
      const nextRound = roundsOrder[currentIndex + 1];

      const updatePayload = {
        currentRound: nextRound,
        selectedUSNs,
        rejectedUSNs,
      };

      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/${id}`, updatePayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const updatedDrive = await axios.get(`${API_URL}/${id}`);
      setDrive(updatedDrive.data);
      setSelectedUSNs([]);
      setRejectedUSNs([]);
      setShowSelection(false);

      if (nextRound === "appointed") {
        navigate("/home");
      }
    } catch (err) {
      console.error("Error updating round:", err);
      alert("Error updating round");
    } finally {
      setLoading(false);
    }
  };

  const selectableUSNs = drive.appliedUSNs.filter(
    (usn) => !(drive.rounds.rejected || []).includes(usn)
  );

  const getRoundProgress = () => {
    const currentIndex = roundsOrder.indexOf(currentRound);
    // If it's the first round (aptitude), show 0% progress
    // Otherwise, show progress based on completed rounds
    return currentIndex === 0 ? 0 : (currentIndex / roundsOrder.length) * 100;
  };
  return (
    <>
      {/* Main Card */}
      <div
        className="max-w-full h-screen mx-auto  shadow-xl p-6 sm:p-8"
        style={{
          backgroundColor: COLORS.card,
          boxShadow: `0 20px 40px ${COLORS.shadow}`,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent"
            style={{
              backgroundColor: `${COLORS.accent}`,
            }}
          >
            Drive Management
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div className="text-left">
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.text }}
              >
                {drive.companyName}
              </h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${COLORS.primary}80`,
                    color: "#FFFFFF",
                  }}
                >
                  {drive.role}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${COLORS.primary}80`,
                    color: "#FFFFFF",
                  }}
                >
                  ID: {drive._id}
                </span>
              </div>
            </div>
            <div
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: `${COLORS.primary}80`,
                color: "#FFFFFF",
              }}
            >
              {roundLabels[currentRound] || currentRound}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: COLORS.textLight }}>Round Progress</span>
            <span style={{ color: COLORS.text }}>
              {roundsOrder.indexOf(currentRound) + 1} of {roundsOrder.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${getRoundProgress()}%`,
                backgroundColor: COLORS.primary,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            {roundsOrder.map((round, index) => (
              <span
                key={round}
                style={{
                  color:
                    index < roundsOrder.indexOf(currentRound)
                      ? COLORS.primary
                      : COLORS.textLight,
                  fontWeight:
                    index === roundsOrder.indexOf(currentRound)
                      ? "bold"
                      : "normal",
                }}
              >
                {roundLabels[round]}
              </span>
            ))}
          </div>
        </div>

        {/* Students Selection Section */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            backgroundColor: COLORS.card,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{
                backgroundColor: `${COLORS.primary}80`,
                color: COLORS.primary,
              }}
            >
              👥
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: COLORS.text }}
              >
                Student Selection
              </h3>
              <p className="text-sm" style={{ color: COLORS.textLight }}>
                Select students to move to the next round
              </p>
            </div>
          </div>

          {selectableUSNs.length === 0 ? (
            <div
              className="text-center py-8 rounded-lg"
              style={{ backgroundColor: `${COLORS.border}20` }}
            >
              <div className="text-4xl mb-3">📝</div>
              <p style={{ color: COLORS.textLight }}>
                No students have applied yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectableUSNs.map((usn) => {
                const isSelected = selectedUSNs.includes(usn);
                const isRejected = rejectedUSNs.includes(usn);

                return (
                  <div
                    key={usn}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected ? "scale-[1.02]" : ""
                    }`}
                    style={{
                      backgroundColor: COLORS.background,
                      borderColor: isSelected
                        ? COLORS.success
                        : isRejected
                        ? COLORS.expense
                        : COLORS.border,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                          style={{
                            backgroundColor: `${COLORS.primary}20`,
                            color: COLORS.primary,
                          }}
                        >
                          {usn.slice(-3)}
                        </div>
                        <div>
                          <div
                            className="font-semibold"
                            style={{ color: COLORS.text }}
                          >
                            {usn}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: COLORS.textLight }}
                          >
                            Student
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelect(usn)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? "scale-110" : "hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? COLORS.success
                              : "transparent",
                            border: `2px solid ${COLORS.success}`,
                            color: isSelected ? "#FFFFFF" : COLORS.success,
                          }}
                          title="Select"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleReject(usn)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isRejected ? "scale-110" : "hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: isRejected
                              ? COLORS.expense
                              : "transparent",
                            border: `2px solid ${COLORS.expense}`,
                            color: isRejected ? "#FFFFFF" : COLORS.expense,
                          }}
                          title="Reject"
                        >
                          ✗
                        </button>
                      </div>
                    </div>

                    {(isSelected || isRejected) && (
                      <div
                        className="mt-2 text-sm font-semibold text-center"
                        style={{
                          color: isSelected ? COLORS.success : COLORS.expense,
                        }}
                      >
                        {isSelected ? "Selected for next round" : "Rejected"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Section */}
        {currentRound !== "appointed" && (
          <div className="space-y-4">
            <button
              onClick={() => setShowSelection(true)}
              disabled={
                selectableUSNs.length === 0 ||
                loading ||
                selectedUSNs.length === 0
              }
              className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{
                backgroundColor: COLORS.primary,
                color: "#FFFFFF",
                boxShadow: `0 4px 12px ${COLORS.shadow}`,
                opacity:
                  selectableUSNs.length === 0 || selectedUSNs.length === 0
                    ? 0.5
                    : 1,
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Advance to Next Round ({selectedUSNs.length} selected)
                </>
              )}
            </button>

            {showSelection && (
              <div
                className="rounded-xl p-6 border-2 animate-fade-in"
                style={{
                  backgroundColor: `${COLORS.primary}08`,
                  borderColor: COLORS.primary,
                }}
              >
                <h3
                  className="text-lg font-semibold mb-3 text-center"
                  style={{ color: COLORS.text }}
                >
                  Confirm Round Advancement
                </h3>
                <p
                  className="text-center mb-4"
                  style={{ color: COLORS.textLight }}
                >
                  Move {selectedUSNs.length} selected student
                  {selectedUSNs.length !== 1 ? "s" : ""} to{" "}
                  {
                    roundLabels[
                      roundsOrder[roundsOrder.indexOf(currentRound) + 1]
                    ]
                  }
                  ?
                </p>

                {selectedUSNs.length > 0 && (
                  <div className="mb-4">
                    <p
                      className="text-sm font-semibold mb-2"
                      style={{ color: COLORS.text }}
                    >
                      Selected Students:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUSNs.map((usn) => (
                        <span
                          key={usn}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: COLORS.success,
                            color: "#FFFFFF",
                          }}
                        >
                          {usn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleNextStage}
                    className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
                    style={{
                      backgroundColor: COLORS.success,
                      color: "#FFFFFF",
                    }}
                  >
                    ✅ Confirm
                  </button>
                  <button
                    onClick={() => setShowSelection(false)}
                    className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
                    style={{
                      backgroundColor: COLORS.textLight,
                      color: "#FFFFFF",
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DriveEdits;
