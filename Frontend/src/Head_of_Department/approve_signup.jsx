import React, { useState } from "react";

// Demo student signup requests
const demoRequests = [
  { id: 1, name: "Amit Kumar", usn: "1AI20CS001", branch: "CSE" },
  { id: 2, name: "Priya Singh", usn: "1AI20EC002", branch: "ECE" },
  { id: 3, name: "Rahul Verma", usn: "1AI20ME003", branch: "MECH" },
  { id: 4, name: "Sneha Patel", usn: "1AI20CS004", branch: "CSE" },
  { id: 5, name: "Vikram Joshi", usn: "1AI20EE005", branch: "EEE" },
  { id: 6, name: "Anjali Rao", usn: "1AI20EC006", branch: "ECE" },
];

const ApproveSignup = () => {
  const [requests, setRequests] = useState(demoRequests);

  const handleApprove = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
    // Add backend API call here to approve student
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">
          Approve Signup Requests
        </h1>
        {requests.length === 0 ? (
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
                <tr key={student.id} className="bg-indigo-50 rounded-xl">
                  <td className="px-2 py-2 font-medium">{student.name}</td>
                  <td className="px-2 py-2">{student.usn}</td>
                  <td className="px-2 py-2">{student.branch}</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleApprove(student.id)}
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
