import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../components/topbar";
import { COLORS } from "../constants/colors";

const API_URL = "http://localhost:5000/drives";

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
    offerMoney: "",
  });
  const [createdId, setCreatedId] = useState("");
  const [drives, setDrives] = useState([]);
  const [detailsId, setDetailsId] = useState("");
  const [detailsDrive, setDetailsDrive] = useState(null);
  const navigate = useNavigate();

  const displayName = localStorage.getItem("name") || "Placement Officer";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setDrives(res.data))
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
        skillsRequired: driveData.skillsRequired.split(",").map((s) => s.trim()),
        offerMoney: Number(driveData.offerMoney),
        date: driveData.date,
        role: driveData.role,
        completed: false,
        currentRound: "aptitude",
        appliedUSNs: [],
        rounds: {
          aptitude: [],
          groupDiscussion: [],
          technicalInterview: [],
          appointed: [],
          rejected: [],
        },
      };

      const res = await axios.post(API_URL, payload);
      setDrives([...drives, res.data]);
      setCreatedId(res.data._id || "Created");
      setDriveData({
        driveId: "",
        companyName: "",
        date: "",
        role: "",
        numRequired: "",
        cgpaRequired: "",
        skillsRequired: "",
        offerMoney: "",
      });
    } catch {
      alert("Error creating drive");
    }
  };

  const handleDeleteDrive = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDrives(drives.filter((d) => d._id !== id));
    } catch {
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
    axios
      .get(API_URL)
      .then((res) => setDrives(res.data.filter((drive) => drive.completed === false)))
      .catch(() => setDrives([]));
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.background, color: COLORS.text }}
    >
      <Topbar name={displayName} />

      {/* MAIN CONTAINER */}
      <div
        className="max-w-5xl mx-auto mt-10 mb-16 p-8 rounded-2xl shadow-lg transition-all"
        style={{
          backgroundColor: COLORS.surface,
          boxShadow: `0 10px 30px ${COLORS.shadow}`,
        }}
      >
        <h1
          className="text-3xl font-bold text-center mb-10"
          style={{ color: COLORS.primary }}
        >
          Placement Officer Dashboard
        </h1>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
          <button
            style={{
              backgroundColor: COLORS.highlight,
              color: "#fff",
              boxShadow: `0 4px 10px ${COLORS.shadow}`,
            }}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
            onClick={() => {
              setShowCreate(true);
              setShowManage(false);
              setShowDetails(false);
              setCreatedId("");
            }}
          >
            Create Drive
          </button>
          <button
            style={{
              backgroundColor: COLORS.primary,
              color: "#fff",
              boxShadow: `0 4px 10px ${COLORS.shadow}`,
            }}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
            onClick={handleShowManage}
          >
            Manage Drives
          </button>
          <button
            style={{
              backgroundColor: COLORS.secondary,
              color: COLORS.text,
              boxShadow: `0 4px 10px ${COLORS.shadow}`,
            }}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
            onClick={() => {
              setShowDetails(true);
              setShowCreate(false);
              setShowManage(false);
              setDetailsDrive(null);
              setDetailsId("");
            }}
          >
            Drive Details
          </button>
        </div>

        {/* CREATE DRIVE FORM */}
        {showCreate && (
          <div
            className="p-8 rounded-xl shadow-md"
            style={{
              backgroundColor: COLORS.accent,
              boxShadow: `0 6px 20px ${COLORS.shadow}`,
            }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
              Create New Drive
            </h2>

            <form onSubmit={handleCreateDrive} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Drive ID
                </label>
                <input
                  type="text"
                  required
                  value={driveData.driveId}
                  onChange={e => setDriveData({ ...driveData, driveId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                  placeholder="Custom Drive ID"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={driveData.companyName}
                  onChange={e => setDriveData({ ...driveData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={driveData.date}
                  onChange={e => setDriveData({ ...driveData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  required
                  value={driveData.role}
                  onChange={e => setDriveData({ ...driveData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                  placeholder="Job Role"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Number of Required Candidates
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={driveData.numRequired}
                  onChange={e => setDriveData({ ...driveData, numRequired: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Minimum CGPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={driveData.cgpaRequired}
                  onChange={e => setDriveData({ ...driveData, cgpaRequired: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                  placeholder="e.g. 7.5"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Preferred Skills
                </label>
                <input
                  type="text"
                  required
                  value={driveData.skillsRequired}
                  onChange={e => setDriveData({ ...driveData, skillsRequired: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                  placeholder="e.g. DSA, React, AWS"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Offer Money
                </label>
                <input
                  type="number"
                  required
                  value={driveData.offerMoney}
                  onChange={e => setDriveData({ ...driveData, offerMoney: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.inputText,
                  }}
                  placeholder="e.g. 1000000"
                />
              </div>
                <button
    type="submit"
    className="w-full py-3 mt-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
    style={{
      backgroundColor: COLORS.primary,
      color: "#fff",
      boxShadow: `0 4px 10px ${COLORS.shadow}`,
    }}
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

      {/* Drive management cards */}
      <div style={{ backgroundColor: COLORS.accent }} className="max-w-4xl mx-auto rounded-xl p-6">
        <div className="grid gap-4">
          {drives.map((drive) => (
            <div
              key={drive._id}
              style={{ backgroundColor: COLORS.secondary }}
              className="rounded-lg p-4"
            >
              <h3 style={{ color: COLORS.text }}>{drive.companyName}</h3>
                <button
                style={{ backgroundColor: COLORS.highlight }}
                className="text-white px-4 py-2 rounded"
              >
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