import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize useNavigate
  const [drive, setDrive] = useState(null);
  const [selectedUSNs, setSelectedUSNs] = useState([]);
  const [rejectedUSNs, setRejectedUSNs] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setDrive(res.data))
      .catch(() => setDrive(null));
  }, [id]);

  if (!drive) return <div className="p-8">Loading or Drive not found.</div>;

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
      setLoading(true); // Start loading
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

      // Navigate to home page after the "appointed" round
      if (nextRound === "appointed") {
        navigate("/home");
      }
    } catch (err) {
      console.error("Error updating round:", err);
      alert("Error updating round");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const selectableUSNs = drive.appliedUSNs.filter(
    (usn) => !(drive.rounds.rejected || []).includes(usn)
  );

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(to bottom right, ${COLORS.background}, ${COLORS.secondary})`,
      }}
    >
      <div
        className="max-w-4xl mx-auto rounded-xl shadow-lg p-6"
        style={{
          backgroundColor: COLORS.card,
          boxShadow: `0 4px 6px ${COLORS.shadow}`,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "#000000" }}
        >
          Edit Drive:{" "}
          <span style={{ color: "#000000" }}>{drive.companyName}</span>{" "}
          <span style={{ color: "#000000" }}>({drive._id})</span>
        </h2>

        <div className="mb-6">
          <div
            className="text-lg font-semibold"
            style={{ color: "#000000" }}
          >
            Current Round:{" "}
            <span style={{ color: "#000000" }}>
              {roundLabels[currentRound] || currentRound}
            </span>
          </div>

          <div style={{ color: "#000000" }} className="mt-2">
            <strong>Applied Students:</strong>
            {selectableUSNs.length === 0 ? (
              <div style={{ color: "#000000" }} className="mt-2">
                No students have applied yet.
              </div>
            ) : (
              <ul className="mt-2 space-y-2">
                {selectableUSNs.map((usn) => (
                  <li key={usn} className="flex items-center gap-3">
                    <span style={{ color: "#000000" }}>{usn}</span>
                    <button
                      style={{
                        background: selectedUSNs.includes(usn)
                          ? COLORS.success
                          : COLORS.background,
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        border: `2px solid ${COLORS.success}`,
                      }}
                      onClick={() => handleSelect(usn)}
                      title="Select"
                    >
                      {selectedUSNs.includes(usn) && (
                        <span style={{ color: COLORS.white }}>✓</span>
                      )}
                    </button>
                    <button
                      style={{
                        background: rejectedUSNs.includes(usn)
                          ? COLORS.expense
                          : COLORS.background,
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        border: `2px solid ${COLORS.expense}`,
                      }}
                      onClick={() => handleReject(usn)}
                      title="Reject"
                    >
                      {rejectedUSNs.includes(usn) && (
                        <span style={{ color: COLORS.white }}>✗</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {currentRound !== "appointed" && (
          <>
            <button
              className="px-6 py-2 rounded-lg font-semibold transition w-full mt-4 flex items-center justify-center"
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                opacity: selectableUSNs.length === 0 || loading ? 0.5 : 1,
              }}
              onClick={() => setShowSelection(true)}
              disabled={selectableUSNs.length === 0 || loading}
            >
              {loading ? (
                <span className="loader" style={{ marginRight: "8px" }}></span>
              ) : null}
              {loading ? "Processing..." : "Next Stage"}
            </button>

            {showSelection && (
              <div
                className="mt-6 rounded-xl p-4"
                style={{
                  backgroundColor: `${COLORS.primary}10`,
                  border: `1px solid ${COLORS.primary}30`,
                }}
              >
                <h3
                  className="font-bold mb-2"
                  style={{ color: "#000000" }}
                >
                  Confirm moving selected students to next round?
                </h3>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition"
                    style={{
                      backgroundColor: COLORS.success,
                      color: COLORS.white,
                    }}
                    onClick={handleNextStage}
                  >
                    Confirm
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition"
                    style={{
                      backgroundColor: COLORS.textLight,
                      color: COLORS.white,
                    }}
                    onClick={() => setShowSelection(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriveEdits;
