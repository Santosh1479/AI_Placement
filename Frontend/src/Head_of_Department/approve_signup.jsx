import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../components/topbar"; // Import the Topbar component

const ApproveSignup = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const hodDepartment = localStorage.getItem("department") || "CSE"; // HOD's department
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch all students with auth
    axios
      .get("http://localhost:5000/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Filter students: same department & approval is 'inprogress'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans">
      {/* Add Topbar */}
      <Topbar name="HOD" />

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">
          Approve Signup Requests
        </h1>
        {loading ? (
          <div className="text-gray-500 text-center">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-gray-500 text-center">No pending requests.</div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-2 py-2 text-indigo-600">Name</th>
                <th className="px-2 py-2 text-indigo-600">USN</th>
                <th className="px-2 py-2 text-indigo-600">Branch</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((student) => (
                <tr key={student.usn} className="bg-indigo-50 rounded-xl">
                  <td className="px-2 py-2 font-medium">{student.name}</td>
                  <td className="px-2 py-2">{student.usn}</td>
                  <td className="px-2 py-2">{student.department}</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleApprove(student._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApproveSignup;