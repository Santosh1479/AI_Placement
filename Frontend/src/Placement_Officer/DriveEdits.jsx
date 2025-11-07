import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((res) => setDrive(res.data))
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
      const isLastBeforeAppointed = currentRound === "technicalInterview";
      const isFinalRound = currentRound === "appointed";
      const nextRound = isLastBeforeAppointed ? "appointed" : roundsOrder[currentIndex + 1];

      // Only show students who are not already rejected
      const availableUSNs = drive.appliedUSNs.filter(
        (usn) => !(drive.rounds.rejected || []).includes(usn)
      );

      // Students NOT selected (not green-ticked) are rejected
      const actuallyRejectedUSNs = availableUSNs.filter(
        (usn) => !selectedUSNs.includes(usn)
      );

      // Prevent repetition in rejected array
      const newRejected = [
        ...drive.rounds.rejected,
        ...actuallyRejectedUSNs.filter((usn) => !drive.rounds.rejected.includes(usn)),
      ];

      let updatePayload = {
        rounds: {
          ...drive.rounds,
          rejected: newRejected,
        },
        currentRound: nextRound,
        selectedUSNs, // Include selected USNs in the payload
        rejectedUSNs: newRejected, // Include rejected USNs in the payload
      };

      if (isLastBeforeAppointed) {
        updatePayload.rounds.technicalInterview = selectedUSNs;
        updatePayload.rounds.appointed = selectedUSNs;
        updatePayload.completed = true;
      } else if (isFinalRound) {
        updatePayload.rounds.appointed = selectedUSNs;
        updatePayload.completed = true;
      } else {
        updatePayload.rounds[currentRound] = selectedUSNs;
      }

      const token = localStorage.getItem("token");

      // Log the payload being sent to the backend
      console.log("Sending update payload to backend:", updatePayload);

      const response = await axios.put(`${API_URL}/${id}`, updatePayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Log the response from the backend
      console.log("Response from backend:", response.data);

      setShowSelection(false);
      setSelectedUSNs([]);
      setRejectedUSNs([]);

      // Refetch drive (include token)
      const res = await axios.get(`${API_URL}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Log the updated drive data
      console.log("Updated drive data:", res.data);

      setDrive(res.data);
    } catch (err) {
      // Log any errors encountered
      console.error("Error updating round:", err);
      alert("Error updating round");
    }
  };


  // Only show students who are in appliedUSNs and NOT in rounds.rejected
  const selectableUSNs = drive.appliedUSNs.filter(
    (usn) => !(drive.rounds.rejected || []).includes(usn)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          Edit Drive:{" "}
          <span className="text-indigo-900">{drive.companyName}</span>{" "}
          <span className="text-xs text-gray-400">({drive._id})</span>
        </h2>
        <div className="mb-6">
          <div className="text-lg font-semibold text-indigo-600">
            Current Round:{" "}
            <span className="text-indigo-900">
              {roundLabels[currentRound] || currentRound}
            </span>
          </div>
          <div className="text-gray-700 mt-2">
            <strong>
              {currentRound === "appointed"
                ? "Appointed Students:"
                : "Applied Students:"}
            </strong>
            {appliedUSNs.length === 0 ? (
              <div className="text-gray-400 mt-2">
                No students{" "}
                {currentRound === "appointed" ? "appointed" : "have applied"} yet.
              </div>
            ) : (
              <ul className="mt-2 space-y-2">
                {appliedUSNs.map((usn) => (
                  <li key={usn} className="flex items-center gap-3">
                    <span className="font-mono text-indigo-800">{usn}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {currentRound !== "appointed" && (
          <>
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition w-full"
              onClick={() => setShowSelection(true)}
              disabled={appliedUSNs.length === 0}
            >
              Next Stage
            </button>
            {showSelection && (
              <div className="mt-6 bg-indigo-50 rounded-xl p-4 shadow">
                <h3 className="font-bold mb-2 text-indigo-700">
                  Confirm moving selected students to next round?
                </h3>
                <div className="flex gap-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    onClick={handleNextStage}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                    onClick={() => setShowSelection(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="mt-8">
              <strong>Selection Panel:</strong>
              <ul className="mt-2 space-y-2">
                {selectableUSNs.map((usn) => (
                  <li key={usn} className="flex items-center gap-3">
                    <span className="font-mono text-indigo-800">{usn}</span>
                    <button
                      style={{
                        background: selectedUSNs.includes(usn)
                          ? "green"
                          : "#e5e7eb",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        border: "2px solid #22c55e",
                      }}
                      onClick={() => handleSelect(usn)}
                      title="Select"
                    >
                      {selectedUSNs.includes(usn) && (
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          ✓
                        </span>
                      )}
                    </button>
                    <button
                      style={{
                        background: rejectedUSNs.includes(usn)
                          ? "red"
                          : "#e5e7eb",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        border: "2px solid #ef4444",
                      }}
                      onClick={() => handleReject(usn)}
                      title="Reject"
                    >
                      {rejectedUSNs.includes(usn) && (
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          ✗
                        </span>
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
