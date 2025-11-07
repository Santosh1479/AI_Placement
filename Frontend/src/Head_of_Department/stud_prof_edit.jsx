import React, { useState } from "react";

// Demo student data
const demoStudents = {
  "1AI20CS001": { name: "Amit Kumar", branch: "CSE", email: "amit@example.com" },
  "1AI20EC002": { name: "Priya Singh", branch: "ECE", email: "priya@example.com" },
  "1AI20ME003": { name: "Rahul Verma", branch: "MECH", email: "rahul@example.com" },
};

const StudProfEdit = () => {
  const [usn, setUsn] = useState("");
  const [student, setStudent] = useState(null);
  const [editData, setEditData] = useState({ name: "", branch: "", email: "" });
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (demoStudents[usn]) {
      setStudent(demoStudents[usn]);
      setEditData(demoStudents[usn]);
      setError("");
    } else {
      setStudent(null);
      setError("Student not found.");
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Add backend update logic here
    alert("Student profile updated (demo)!");
    setStudent(editData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Edit Student Profile</h1>
        <div className="mb-6">
          <label className="block text-indigo-600 font-semibold mb-2">Enter Student USN</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
              placeholder="e.g. 1AI20CS001"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Load
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>

        {student && (
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Branch</label>
              <input
                type="text"
                name="branch"
                value={editData.branch}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudProfEdit;