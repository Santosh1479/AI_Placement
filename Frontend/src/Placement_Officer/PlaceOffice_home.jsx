import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../components/topbar"; // added
import { COLORS } from '../constants/colors'

const API_URL = "http://localhost:5000/drives"; // Adjust if your route is different

const PlaceOfficeHome = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [driveData, setDriveData] = useState({
    driveId: "",
    companyName: "",
    date: "",
    role: "",
    numRequired: "",
    cgpaRequired: "",
    skillsRequired: "",
    offerMoney: "", // <-- Add this
  });
  const [createdId, setCreatedId] = useState("");
  const [drives, setDrives] = useState([]);
  const [detailsId, setDetailsId] = useState("");
  const [detailsDrive, setDetailsDrive] = useState(null);
  const [newRound, setNewRound] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [rejectedName, setRejectedName] = useState("");
  const navigate = useNavigate();

  // get display name from localStorage (Topbar will also use this)
  const displayName = localStorage.getItem("name") || "Placement Officer";

  // Fetch drives from backend
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setDrives(res.data))
      .catch(() => setDrives([]));
  }, []);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        _id: driveData.driveId,
        companyName: driveData.companyName,
        cgpaRequired: Number(driveData.cgpaRequired),
        numStudentsSelected: 0,
        numRequired: Number(driveData.numRequired),
        skillsRequired: driveData.skillsRequired.split(",").map(s => s.trim()),
        offerMoney: Number(driveData.offerMoney), // <-- Add this
        date: driveData.date,
        role: driveData.role,
        completed: false,
        currentRound: "aptitude",
        appliedUSNs: [], // Initially empty
        rounds: {
          aptitude: [],
          groupDiscussion: [],
          technicalInterview: [],
          appointed: [],
          rejected: []
        }
      };
      const res = await axios.post(API_URL, payload); // <-- FIXED ENDPOINT
      setDrives([...drives, res.data]);
      setCreatedId(res.data._id || "Created");
      setDriveData({
        driveId: "G1",
        companyName: "",
        date: "",
        role: "",
        numRequired: "",
        cgpaRequired: "",
        skillsRequired: "",
        offerMoney: "", // <-- Reset this
      });
    } catch (err) {
      alert("Error creating drive");
    }
  };

  const handleDeleteDrive = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDrives(drives.filter((d) => d._id !== id));
    } catch (err) {
      alert("Error deleting drive");
    }
  };

  const handleLoadDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/${detailsId}`);
      setDetailsDrive(res.data);
    } catch {
      setDetailsDrive(null);
    }
  };

  const handleShowManage = () => {
    setShowManage(true);
    setShowCreate(false);
    setShowDetails(false);
    axios.get(API_URL)
      .then(res => {
        // Filter drives with completed: false
        setDrives(res.data.filter(drive => drive.completed === false));
      })
      .catch(() => setDrives([]));
  };

  // The rest of your handlers (handleAddRound, handleAddSelected, handleAddRejected) would need to call backend endpoints as well

  // Update the return section with new styling
  return (
    <div style={{ backgroundColor: COLORS.background }} className="min-h-screen">
      <Topbar name={displayName} />

      <div className="flex items-center justify-center flex-1 p-6">
        <div style={{ backgroundColor: COLORS.accent }} 
             className="max-w-md w-full rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h1 style={{ color: COLORS.text }} className="text-2xl font-bold mb-8 text-center">
            Placement Office Head
          </h1>
          
          <div className="flex flex-col gap-6">
            {/* Main buttons */}
            <button
              style={{ backgroundColor: COLORS.highlight }}
              className="text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => { setShowCreate(true); setShowManage(false); setShowDetails(false); setCreatedId(""); }}
            >
              Create Drive
            </button>
            
            <button
              style={{ backgroundColor: COLORS.primary, color: COLORS.text }}
              className="px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => { setShowManage(true); setShowCreate(false); setShowDetails(false); }}
            >
              Manage Drives
            </button>
            
            <button
              style={{ backgroundColor: COLORS.secondary, color: COLORS.text }}
              className="px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => { setShowDetails(true); setShowCreate(false); setShowManage(false); setDetailsDrive(null); setDetailsId(""); }}
            >
              Drive Details
            </button>
          </div>

          {/* Modal sections */}
          {showCreate && (
            <div className="mt-8 bg-indigo-50 rounded-xl p-6 shadow">
              <h2 className="text-lg font-bold text-indigo-700 mb-4">Create New Drive</h2>
              <form onSubmit={handleCreateDrive} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Drive ID</label>
                  <input
                    type="text"
                    required
                    value={driveData.driveId}
                    onChange={e => setDriveData({ ...driveData, driveId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Custom Drive ID"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={driveData.companyName}
                    onChange={e => setDriveData({ ...driveData, companyName: e.target.value })}
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
                    value={driveData.numRequired}
                    onChange={e => setDriveData({ ...driveData, numRequired: e.target.value })}
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
                    value={driveData.cgpaRequired}
                    onChange={e => setDriveData({ ...driveData, cgpaRequired: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. 7.5"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Preferred Skills</label>
                  <input
                    type="text"
                    required
                    value={driveData.skillsRequired}
                    onChange={e => setDriveData({ ...driveData, skillsRequired: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. DSA, React, AWS"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Offer Money</label>
                  <input
                    type="number"
                    required
                    value={driveData.offerMoney}
                    onChange={e => setDriveData({ ...driveData, offerMoney: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. 1000000"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full"
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

          {showManage && (
            <div className="mt-8 bg-indigo-50 rounded-xl p-6 shadow">
              <h2 className="text-lg font-bold text-indigo-700 mb-4">Manage Drives</h2>
              {drives.length === 0 ? (
                <div className="text-gray-500 text-center">No drives available.</div>
              ) : (
                <ul className="space-y-4">
                  {drives.map((drive) => (
                    <li key={drive._id} className="bg-white rounded-lg p-4 shadow flex flex-col gap-2">
                      <div>
                        <span className="font-bold text-indigo-700">{drive.companyName}</span> | {drive.role}
                      </div>
                      <div className="text-gray-600 text-sm">Date: {drive.date}</div>
                      <div className="text-gray-500 text-xs">Drive ID: {drive._id}</div>
                      <div className="text-gray-700 text-sm">
                        Required: <span className="font-semibold">{drive.numRequired}</span>
                        {" | "}
                        Placed: <span className="font-semibold">{drive.numStudentsSelected}</span>
                        {" | "}
                        Remaining Seats: <span className="font-semibold">{drive.numRequired - drive.numStudentsSelected}</span>
                      </div>
                      <div className="text-gray-700 text-sm">
                        Min CGPA: <span className="font-semibold">{drive.cgpaRequired}</span>
                        {" | "}
                        Skills: <span className="font-semibold">{drive.skillsRequired && drive.skillsRequired.join(", ")}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                          onClick={() => alert(`Viewing drive ${drive._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          onClick={() => handleDeleteDrive(drive._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                          onClick={() => navigate(`/drives/${drive._id}`)}
                        >
                          More
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {showDetails && (
            <div className="mt-8 bg-green-50 rounded-xl p-6 shadow">
              <h2 className="text-lg font-bold text-green-700 mb-4">Drive Details</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={detailsId}
                  onChange={e => setDetailsId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter Drive ID"
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
                    {detailsDrive.companyName} | {detailsDrive.role}
                  </div>
                  <div className="text-gray-700 text-sm mb-2">
                    Date: {detailsDrive.date} <br />
                    Required: {detailsDrive.numRequired} | Placed: {detailsDrive.numStudentsSelected} | Remaining: {detailsDrive.numRequired - detailsDrive.numStudentsSelected}
                    <br />
                    Min CGPA: {detailsDrive.cgpaRequired} | Skills: {detailsDrive.skillsRequired && detailsDrive.skillsRequired.join(", ")}
                  </div>
                  {/* Add rounds, selected, rejected logic here as needed */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drive management cards */}
      <div style={{ backgroundColor: COLORS.accent }} className="max-w-4xl mx-auto rounded-xl p-6">
        <div className="grid gap-4">
          {drives.map(drive => (
            <div key={drive._id} style={{ backgroundColor: COLORS.secondary }}
                 className="rounded-lg p-4">
              <h3 style={{ color: COLORS.text }}>{drive.companyName}</h3>
              <button style={{ backgroundColor: COLORS.highlight }}
                      className="text-white px-4 py-2 rounded">
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceOfficeHome;