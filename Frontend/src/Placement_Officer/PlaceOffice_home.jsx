import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const demoDrives = [
  { id: "DRV001", company: "Google", date: "2025-11-10", role: "SWE", required: 10, placed: 7, cgpa: "8.0", skills: "DSA, React", rounds: ["Aptitude", "Technical", "HR"], selected: ["Amit Kumar", "Sneha Patel"], rejected: ["Rahul Verma"] },
  { id: "DRV002", company: "Amazon", date: "2025-11-15", role: "Cloud Eng", required: 8, placed: 5, cgpa: "7.5", skills: "AWS, Python", rounds: ["Coding", "Managerial"], selected: ["Priya Singh"], rejected: [] },
];

const PlaceOfficeHome = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [driveData, setDriveData] = useState({ company: "", date: "", role: "", required: "", cgpa: "", skills: "" });
  const [createdId, setCreatedId] = useState("");
  const [drives, setDrives] = useState(demoDrives);
  const [detailsId, setDetailsId] = useState("");
  const [detailsDrive, setDetailsDrive] = useState(null);
  const [newRound, setNewRound] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [rejectedName, setRejectedName] = useState("");
  const navigate = useNavigate();

  // Generate a simple Drive ID
  const generateDriveId = () => "DRV" + Math.floor(100 + Math.random() * 900);

  const handleCreateDrive = (e) => {
    e.preventDefault();
    const newId = generateDriveId();
    setDrives([
      ...drives,
      { id: newId, ...driveData, placed: 0, rounds: [], selected: [], rejected: [] }
    ]);
    setCreatedId(newId);
    setDriveData({ company: "", date: "", role: "", required: "", cgpa: "", skills: "" });
  };

  const handleDeleteDrive = (id) => {
    setDrives(drives.filter((d) => d.id !== id));
  };

  const handleLoadDetails = () => {
    const found = drives.find(d => d.id === detailsId);
    setDetailsDrive(found || null);
  };

  const handleAddRound = () => {
    if (newRound && detailsDrive) {
      const updated = { ...detailsDrive, rounds: [...detailsDrive.rounds, newRound] };
      setDrives(drives.map(d => d.id === detailsDrive.id ? updated : d));
      setDetailsDrive(updated);
      setNewRound("");
    }
  };

  const handleAddSelected = () => {
    if (selectedName && detailsDrive) {
      const updated = { ...detailsDrive, selected: [...detailsDrive.selected, selectedName] };
      setDrives(drives.map(d => d.id === detailsDrive.id ? updated : d));
      setDetailsDrive(updated);
      setSelectedName("");
    }
  };

  const handleAddRejected = () => {
    if (rejectedName && detailsDrive) {
      const updated = { ...detailsDrive, rejected: [...detailsDrive.rejected, rejectedName] };
      setDrives(drives.map(d => d.id === detailsDrive.id ? updated : d));
      setDetailsDrive(updated);
      setRejectedName("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-8 text-center">
          Placement Office Head
        </h1>
        <div className="flex flex-col gap-6">
          <button
            className="bg-indigo-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
            onClick={() => { setShowCreate(true); setShowManage(false); setShowDetails(false); setCreatedId(""); }}
          >
            Create Drive
          </button>
          <button
            className="bg-indigo-50 text-indigo-700 px-6 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-100 transition"
            onClick={() => { setShowManage(true); setShowCreate(false); setShowDetails(false); }}
          >
            Manage Drives
          </button>
          <button
            className="bg-green-50 text-green-700 px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-100 transition"
            onClick={() => { setShowDetails(true); setShowCreate(false); setShowManage(false); setDetailsDrive(null); setDetailsId(""); }}
          >
            Drive Details
          </button>
        </div>

        {/* Create Drive Modal */}
        {showCreate && (
          <div className="mt-8 bg-indigo-50 rounded-xl p-6 shadow">
            <h2 className="text-lg font-bold text-indigo-700 mb-4">Create New Drive</h2>
            <form onSubmit={handleCreateDrive} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={driveData.company}
                  onChange={e => setDriveData({ ...driveData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={driveData.date}
                  onChange={e => setDriveData({ ...driveData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={driveData.role}
                  onChange={e => setDriveData({ ...driveData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Job Role"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Number of Required Candidates</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={driveData.required}
                  onChange={e => setDriveData({ ...driveData, required: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={driveData.cgpa}
                  onChange={e => setDriveData({ ...driveData, cgpa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. 7.5"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Preferred Skills</label>
                <input
                  type="text"
                  required
                  value={driveData.skills}
                  onChange={e => setDriveData({ ...driveData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. DSA, React, AWS"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full"
              >
                Create Drive
              </button>
            </form>
            {createdId && (
              <div className="mt-4 text-green-700 font-bold text-center">
                Drive Created! ID: {createdId}
              </div>
            )}
          </div>
        )}

        {/* Manage Drives Modal */}
        {showManage && (
          <div className="mt-8 bg-indigo-50 rounded-xl p-6 shadow">
            <h2 className="text-lg font-bold text-indigo-700 mb-4">Manage Drives</h2>
            {drives.length === 0 ? (
              <div className="text-gray-500 text-center">No drives available.</div>
            ) : (
              <ul className="space-y-4">
                {drives.map((drive) => (
                  <li key={drive.id} className="bg-white rounded-lg p-4 shadow flex flex-col gap-2">
                    <div>
                      <span className="font-bold text-indigo-700">{drive.company}</span> | {drive.role}
                    </div>
                    <div className="text-gray-600 text-sm">Date: {drive.date}</div>
                    <div className="text-gray-500 text-xs">Drive ID: {drive.id}</div>
                    <div className="text-gray-700 text-sm">
                      Required: <span className="font-semibold">{drive.required}</span>
                      {" | "}
                      Placed: <span className="font-semibold">{drive.placed}</span>
                      {" | "}
                      Remaining Seats: <span className="font-semibold">{drive.required - drive.placed}</span>
                    </div>
                    <div className="text-gray-700 text-sm">
                      Min CGPA: <span className="font-semibold">{drive.cgpa}</span>
                      {" | "}
                      Skills: <span className="font-semibold">{drive.skills}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                        onClick={() => alert(`Viewing drive ${drive.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        onClick={() => handleDeleteDrive(drive.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Drive Details Modal */}
        {showDetails && (
          <div className="mt-8 bg-green-50 rounded-xl p-6 shadow">
            <h2 className="text-lg font-bold text-green-700 mb-4">Drive Details</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={detailsId}
                onChange={e => setDetailsId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter Drive ID (e.g. DRV001)"
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={handleLoadDetails}
              >
                Load
              </button>
            </div>
            {!detailsDrive && detailsId && (
              <div className="text-red-500 mb-2">Drive not found.</div>
            )}
            {detailsDrive && (
              <div>
                <div className="mb-2 font-semibold text-green-800">
                  {detailsDrive.company} | {detailsDrive.role}
                </div>
                <div className="text-gray-700 text-sm mb-2">
                  Date: {detailsDrive.date} <br />
                  Required: {detailsDrive.required} | Placed: {detailsDrive.placed} | Remaining: {detailsDrive.required - detailsDrive.placed}
                  <br />
                  Min CGPA: {detailsDrive.cgpa} | Skills: {detailsDrive.skills}
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-green-700 mb-1">Recruitment Rounds:</div>
                  <ul className="list-disc pl-5 mb-2">
                    {detailsDrive.rounds.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newRound}
                      onChange={e => setNewRound(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg w-full"
                      placeholder="Add new round"
                    />
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      onClick={handleAddRound}
                    >
                      Add Round
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-green-700 mb-1">Selected Students:</div>
                  <ul className="list-disc pl-5 mb-2">
                    {detailsDrive.selected.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={selectedName}
                      onChange={e => setSelectedName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg w-full"
                      placeholder="Add selected student"
                    />
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      onClick={handleAddSelected}
                    >
                      Add Selected
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-green-700 mb-1">Rejected Students:</div>
                  <ul className="list-disc pl-5 mb-2">
                    {detailsDrive.rejected.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={rejectedName}
                      onChange={e => setRejectedName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg w-full"
                      placeholder="Add rejected student"
                    />
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      onClick={handleAddRejected}
                    >
                      Add Rejected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOfficeHome;