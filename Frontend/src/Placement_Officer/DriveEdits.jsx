import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { COLORS } from '../constants/colors';

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
  const [drive, setDrive] = useState(null);
  const [selectedUSNs, setSelectedUSNs] = useState([]);
  const [rejectedUSNs, setRejectedUSNs] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [driveDetails, setDriveDetails] = useState({
    companyName: "",
    role: "",
    numStudentsSelected: 0,
    numRequired: 0,
  });
  const [stats, setStats] = useState({
    numStudentsSelected: 0,
    numRequired: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setDrive(res.data);
        setDriveDetails({
          companyName: res.data.companyName,
          role: res.data.role,
          numStudentsSelected: res.data.selectedUSNs?.length || 0,
          numRequired: res.data.numRequired || 0,
        });
        setStats({
          numStudentsSelected: res.data.numStudentsSelected,
          numRequired: res.data.numRequired,
        });
      })
      .catch(() => setDrive(null));
  }, [id]);

  if (!drive) return <div className="p-8">Loading or Drive not found.</div>;

  // Get current round and applied students
  const currentRound = drive.currentRound;

  // If appointed, show appointed students only
  const appointedUSNs = drive.rounds?.appointed || [];
  const appliedUSNs =
    currentRound === "appointed" ? appointedUSNs : drive.appliedUSNs || [];

  // Handle select/reject
  const handleSelect = (usn) => {
    setSelectedUSNs([...selectedUSNs, usn]);
    setRejectedUSNs(rejectedUSNs.filter((u) => u !== usn));
  };
  const handleReject = (usn) => {
    setRejectedUSNs([...rejectedUSNs, usn]);
    setSelectedUSNs(selectedUSNs.filter((u) => u !== usn));
  };

  // Move to next round
  const handleNextStage = async () => {
    try {
      const currentIndex = roundsOrder.indexOf(currentRound);
      const nextRound = roundsOrder[currentIndex + 1];

      // Count new appointments
      const newAppointments = selectedUSNs.length;

      const updatePayload = {
        currentRound: nextRound,
        selectedUSNs,
        rejectedUSNs,
        // Add these fields explicitly
        numStudentsSelected: drive.numStudentsSelected + newAppointments,
        numRequired: Math.max(0, drive.numRequired - newAppointments),
      };

      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${id}`, updatePayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Update local state immediately
      setStats({
        numStudentsSelected: response.data.numStudentsSelected,
        numRequired: response.data.numRequired,
      });

      // Refresh drive data
      const updatedDrive = await axios.get(`${API_URL}/${id}`);
      setDrive(updatedDrive.data);
    } catch (err) {
      console.error("Error updating round:", err);
      alert("Error updating round");
    }
  };

  // Only show students who are in appliedUSNs and NOT in rounds.rejected
  const selectableUSNs = drive.appliedUSNs.filter(
    (usn) => !(drive.rounds.rejected || []).includes(usn)
  );

  return (
    <div 
      className="min-h-screen p-8"
      style={{ 
        background: `linear-gradient(to bottom right, ${COLORS.background}, ${COLORS.secondary})` 
      }}
    >
      <div 
        className="max-w-4xl mx-auto rounded-xl shadow-lg p-6"
        style={{ 
          backgroundColor: COLORS.card,
          boxShadow: `0 4px 6px ${COLORS.shadow}`,
          border: `1px solid ${COLORS.border}`
        }}
      >
        <h2 
          className="text-2xl font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          Edit Drive:{" "}
          <span style={{ color: COLORS.text }}>{drive.companyName}</span>{" "}
          <span style={{ color: COLORS.textLight }}>({drive._id})</span>
        </h2>

        <div className="mb-6">
          <div 
            className="text-lg font-semibold"
            style={{ color: COLORS.primary }}
          >
            Current Round:{" "}
            <span style={{ color: COLORS.text }}>
              {roundLabels[currentRound] || currentRound}
            </span>
          </div>

          <div style={{ color: COLORS.text }} className="mt-2">
            <strong>
              {currentRound === "appointed"
                ? "Appointed Students:"
                : "Applied Students:"}
            </strong>
            {appliedUSNs.length === 0 ? (
              <div style={{ color: COLORS.textLight }} className="mt-2">
                No students{" "}
                {currentRound === "appointed" ? "appointed" : "have applied"} yet.
              </div>
            ) : (
              <ul className="mt-2 space-y-2">
                {appliedUSNs.map((usn) => (
                  <li key={usn} className="flex items-center gap-3">
                    <span style={{ color: COLORS.primary }}>{usn}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: `${COLORS.success}15`,
              border: `1px solid ${COLORS.success}30`
            }}
          >
            <h3 style={{ color: COLORS.success }} className="font-semibold">
              Selected
            </h3>
            <p style={{ color: COLORS.success }} className="text-2xl font-bold">
              {stats.numStudentsSelected}
            </p>
          </div>
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: `${COLORS.primary}15`,
              border: `1px solid ${COLORS.primary}30`
            }}
          >
            <h3 style={{ color: COLORS.primary }} className="font-semibold">
              Remaining
            </h3>
            <p style={{ color: COLORS.primary }} className="text-2xl font-bold">
              {stats.numRequired}
            </p>
          </div>
        </div>

        {currentRound !== "appointed" && (
          <>
            <button
              className="px-6 py-2 rounded-lg font-semibold transition w-full mt-4"
              style={{ 
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                opacity: appliedUSNs.length === 0 ? 0.5 : 1
              }}
              onClick={() => setShowSelection(true)}
              disabled={appliedUSNs.length === 0}
            >
              Next Stage
            </button>

            {showSelection && (
              <div 
                className="mt-6 rounded-xl p-4"
                style={{ 
                  backgroundColor: `${COLORS.primary}10`,
                  border: `1px solid ${COLORS.primary}30`
                }}
              >
                <h3 
                  className="font-bold mb-2"
                  style={{ color: COLORS.primary }}
                >
                  Confirm moving selected students to next round?
                </h3>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition"
                    style={{ 
                      backgroundColor: COLORS.success,
                      color: COLORS.white
                    }}
                    onClick={handleNextStage}
                  >
                    Confirm
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition"
                    style={{ 
                      backgroundColor: COLORS.textLight,
                      color: COLORS.white
                    }}
                    onClick={() => setShowSelection(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8">
              <strong style={{ color: COLORS.text }}>Selection Panel:</strong>
              <ul className="mt-2 space-y-2">
                {selectableUSNs.map((usn) => (
                  <li key={usn} className="flex items-center gap-3">
                    <span style={{ color: COLORS.primary }}>{usn}</span>
                    <button
                      style={{
                        background: selectedUSNs.includes(usn)
                          ? COLORS.success
                          : COLORS.background,
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        border: `2px solid ${COLORS.success}`
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
                        border: `2px solid ${COLORS.expense}`
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DriveEdits;
