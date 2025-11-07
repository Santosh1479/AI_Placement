import React, { useState } from "react";
import axios from "axios";

const StudProfEdit = () => {
  const [usn, setUsn] = useState("");
  const [student, setStudent] = useState(null);
  const [editData, setEditData] = useState({ name: "", department: "", email: "", placed: false, lpa: 0 });
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/students/`);
      const found = res.data.find(s => s.usn === usn);
      if (found) {
        setStudent(found);
        setEditData({
          name: found.name,
          department: found.department,
          email: found.email,
          placed: found.placed,
          lpa: found.lpa
        });
        setError("");
      } else {
        setStudent(null);
        setError("Student not found.");
      }
    } catch {
      setStudent(null);
      setError("Error fetching student.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/students/${usn}`, editData);
      alert("Student profile updated!");
      setStudent(editData);
    } catch {
      alert("Error updating student profile.");
    }
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
              <label className="block text-gray-700 font-medium mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={editData.department}
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
            <div>
              <label className="block text-gray-700 font-medium mb-1">Placed</label>
              <div className="flex gap-6 items-center">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="placed"
                    value={true}
                    checked={editData.placed === true}
                    onChange={() => setEditData({ ...editData, placed: true })}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="placed"
                    value={false}
                    checked={editData.placed === false}
                    onChange={() => setEditData({ ...editData, placed: false })}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">LPA</label>
              <input
                type="number"
                name="lpa"
                step="0.1"
                value={editData.lpa}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                placeholder="e.g. 3.5"
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