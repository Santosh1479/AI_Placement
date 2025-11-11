import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../components/topbar";
import { COLORS } from "../constants/colors";

const ApproveSignup = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const hodDepartment = localStorage.getItem("department") || "CSE";
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const pending = res.data.filter(
          (s) => s.department === hodDepartment && s.approval === "inprogress"
        );
        setRequests(pending);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hodDepartment, token]);

  const handleApprove = async (usn) => {
    try {
      await axios.put(
        `http://localhost:5000/hods/approve/${usn}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(requests.filter((req) => req._id !== usn));
    } catch {
      alert("Error approving student.");
    }
  };

  return (
    <div
      className="min-h-screen font-sans transition-all"
      style={{ backgroundColor: COLORS.background }}
    >
      <Topbar name="HOD" />

      <div
        className="max-w-3xl mx-auto rounded-2xl shadow-lg p-8 mt-12 transition-all duration-300 hover:shadow-xl"
        style={{
          backgroundColor: COLORS.card,
          boxShadow: `0 4px 12px ${COLORS.shadow}`,
        }}
      >
        <h1
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: COLORS.text }}
        >
          Approve Signup Requests
        </h1>

        {loading ? (
          <div
            className="text-center text-lg font-medium"
            style={{ color: COLORS.textLight }}
          >
            Loading student data...
          </div>
        ) : requests.length === 0 ? (
          <div
            className="text-center text-lg font-semibold"
            style={{ color: COLORS.textLight }}
          >
            🎉 No pending requests!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr style={{ color: COLORS.textLight, textAlign: "left" }}>
                  <th className="px-4 py-2 text-sm uppercase tracking-wide">Name</th>
                  <th className="px-4 py-2 text-sm uppercase tracking-wide">USN</th>
                  <th className="px-4 py-2 text-sm uppercase tracking-wide">Branch</th>
                  <th className="px-4 py-2 text-sm uppercase tracking-wide text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((student) => (
                  <tr
                    key={student.usn}
                    className="rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                    style={{
                      backgroundColor: COLORS.secondary,
                      borderRadius: "12px",
                    }}
                  >
                    <td
                      className="px-4 py-3 font-semibold text-base"
                      style={{ color: COLORS.text }}
                    >
                      {student.name}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: COLORS.text }}
                    >
                      {student.usn}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: COLORS.text }}
                    >
                      {student.department}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleApprove(student._id)}
                        className="px-5 py-2 rounded-lg font-semibold transition-transform transform hover:scale-105"
                        style={{
                          backgroundColor: COLORS.success,
                          color: COLORS.card,
                          boxShadow: `0 3px 6px ${COLORS.shadow}`,
                        }}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveSignup;
