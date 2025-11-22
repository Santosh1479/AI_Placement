import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../components/topbar";
import { COLORS } from "../constants/colors";

const API_URL = "http://localhost:5000/drives";

const PlaceOfficeHome = () => {
  const [activeSection, setActiveSection] = useState("create"); // "create", "manage", "details"
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
  const [loading, setLoading] = useState(false);
  const [deleteDriveId, setDeleteDriveId] = useState(""); // Add this state
  const navigate = useNavigate();

  const displayName = localStorage.getItem("name") || "Placement Officer";

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = () => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => setDrives(res.data))
      .catch(() => setDrives([]))
      .finally(() => setLoading(false));
  };
  const handleCreateDrive = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        _id: driveData.driveId,
        companyName: driveData.companyName,
        cgpaRequired: Number(driveData.cgpaRequired),
        numStudentsSelected: 0,
        numRequired: Number(driveData.numRequired),
        skillsRequired: driveData.skillsRequired
          .split(",")
          .map((s) => s.trim()),
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

      // Hide success message after 2 seconds
      setTimeout(() => setCreatedId(""), 2000);

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

      // Auto-switch to manage section after creation
      setTimeout(() => setActiveSection("manage"), 1500);
    } catch {
      alert("Error creating drive");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrive = async (id) => {
    setDeleteDriveId(id); // Show confirmation dialog
  };

  const confirmDeleteDrive = async () => {
    if (!deleteDriveId) return;
    try {
      await axios.delete(`${API_URL}/${deleteDriveId}`);
      setDrives(drives.filter((d) => d._id !== deleteDriveId));
      setDeleteDriveId(""); // Hide dialog
    } catch {
      setDeleteDriveId(""); // Hide dialog
    }
  };

  const cancelDeleteDrive = () => {
    setDeleteDriveId(""); // Hide dialog
  };

  const handleLoadDetails = async () => {
    if (!detailsId.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${detailsId}`);
      setDetailsDrive(res.data);
    } catch {
      setDetailsDrive(null);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionPercentage = (drive) => {
    return Math.round((drive.numStudentsSelected / drive.numRequired) * 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "#10B981"; // Green
    if (percentage >= 50) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.background, color: COLORS.text }}
    >
      <Topbar name={displayName} />

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto mt-8 mb-16 p-6">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${COLORS.accent}, #9333EA)`,
            }}
          >
            Placement Officer Dashboard
          </h1>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            Manage placement drives, track student progress, and oversee
            recruitment activities
          </p>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: "create", label: "Create Drive", icon: "➕" },
            { id: "manage", label: "Manage Drives", icon: "⚙️" },
            { id: "details", label: "Drive Details", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${
                activeSection === tab.id
                  ? "scale-105 shadow-lg"
                  : "opacity-80 hover:opacity-100 hover:scale-102"
              }`}
              style={{
                backgroundColor:
                  activeSection === tab.id ? COLORS.primary : COLORS.card,
                color: activeSection === tab.id ? "#FFFFFF" : COLORS.text,
                boxShadow:
                  activeSection === tab.id
                    ? `0 8px 25px ${COLORS.shadow}`
                    : "none",
              }}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT SECTIONS */}
        <div className="transition-all duration-300">
          {/* CREATE DRIVE SECTION */}
          {activeSection === "create" && (
            <div
              className="rounded-2xl p-8 backdrop-blur-sm border"
              style={{
                backgroundColor: COLORS.surface,
                boxShadow: `0 20px 40px ${COLORS.shadow}`,
                borderColor: COLORS.border,
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: `${COLORS.primary}20`,
                    color: "#000000",
                  }}
                >
                  ➕
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: COLORS.text }}
                  >
                    Create New Drive
                  </h2>
                  <p className="opacity-75 text-white">
                    Set up a new placement drive for companies
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCreateDrive}
                className="space-y-8 text-black"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 text-white lg:grid-cols-3 gap-6">
                  {[
                    {
                      key: "driveId",
                      label: "Drive ID",
                      type: "text",
                      placeholder: "DRIVE_001",
                    },
                    {
                      key: "companyName",
                      label: "Company Name",
                      type: "text",
                      placeholder: "Google, Microsoft, etc.",
                    },
                    {
                      key: "role",
                      label: "Job Role",
                      type: "text",
                      placeholder: "Software Engineer",
                    },
                    { key: "date", label: "Drive Date", type: "date" },
                    {
                      key: "numRequired",
                      label: "Number Required",
                      type: "number",
                      placeholder: "10",
                    },
                    {
                      key: "cgpaRequired",
                      label: "Minimum CGPA",
                      type: "number",
                      step: "0.1",
                      placeholder: "7.5",
                    },
                    {
                      key: "skillsRequired",
                      label: "Required Skills",
                      type: "text",
                      placeholder: "React, Node.js, Python",
                    },
                    {
                      key: "offerMoney",
                      label: "Offer Amount (₹)",
                      type: "number",
                      placeholder: "1000000",
                    },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="block text-sm font-semibold opacity-90">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        step={field.step}
                        value={driveData[field.key]}
                        onChange={(e) =>
                          setDriveData({
                            ...driveData,
                            [field.key]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 text-black rounded-xl border transition-all focus:ring-2 focus:ring-offset-2"
                        style={{
                          backgroundColor: COLORS.inputBackground,
                          color: "#000000", // <-- Force input text to black
                          borderColor: COLORS.border,
                          focusBorderColor: COLORS.primary,
                          "::placeholder": { color: "#000000" }, // This will not work inline, see below
                        }}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: "#FFFFFF",
                      boxShadow: `0 6px 20px ${COLORS.shadow}`,
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Create Drive
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection("manage")}
                    className="px-6 py-4 rounded-xl font-semibold border transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "transparent",
                      color: COLORS.text,
                      borderColor: COLORS.border,
                    }}
                  >
                    View All Drives
                  </button>
                </div>
              </form>

              {createdId && (
                <div
                  className="mt-6 p-4 rounded-xl text-center animate-pulse"
                  style={{
                    backgroundColor: `${COLORS.success}20`,
                    color: COLORS.success,
                  }}
                >
                  ✅ Drive Created Successfully! ID:{" "}
                  <strong>{createdId}</strong>
                </div>
              )}
            </div>
          )}

          {/* MANAGE DRIVES SECTION */}
          {activeSection === "manage" && (
            <div
              className="rounded-2xl p-8 backdrop-blur-sm border"
              style={{
                backgroundColor: COLORS.surface,
                boxShadow: `0 20px 40px ${COLORS.shadow}`,
                borderColor: COLORS.border,
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: `${COLORS.primary}20`,
                      color: "#000000",
                    }}
                  >
                    ⚙️
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: COLORS.accent }} // Match "Create Drive" heading color
                    >
                      Manage Drives
                    </h2>
                    <p
                      className="opacity-75"
                      style={{ color: COLORS.textLight }}
                    >
                      Active placement drives and their status
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="opacity-75">Loading drives...</p>
                </div>
              ) : drives.length === 0 ? (
                <div
                  className="text-center py-12 rounded-2xl"
                  style={{ backgroundColor: COLORS.card }}
                >
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Drives Found
                  </h3>
                  <p className="opacity-75 mb-6">
                    Get started by creating your first placement drive
                  </p>
                  <button
                    onClick={() => setActiveSection("create")}
                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: "#FFFFFF",
                    }}
                  >
                    Create First Drive
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {drives.map((drive) => {
                    const completion = getCompletionPercentage(drive);
                    return (
                      <div
                        key={drive._id}
                        className="p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] group"
                        style={{
                          backgroundColor: COLORS.card,
                          borderColor: COLORS.border,
                          boxShadow: `0 4px 12px ${COLORS.shadow}`,
                        }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          {/* Drive Info */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3
                                className="text-2xl font-bold group-hover:text-blue-400 transition-colors"
                                style={{ color: COLORS.accent }}
                              >
                                {drive.companyName}
                              </h3>
                              {/* Current Status */}
                              <span
                                className="px-3 py-1 rounded-full text-sm font-semibold"
                                style={{
                                  backgroundColor: `${COLORS.primary}80`,
                                  color: "#FFFFFF",
                                  marginLeft: "4px",
                                }}
                              >
                                {drive.currentRound
                                  ? drive.currentRound
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) => str.toUpperCase())
                                  : "Not Started"}
                              </span>
                              {drive.completed && (
                                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                  Completed
                                </span>
                              )}
                            </div>
                            <div>
                              <span
                                className="px-3 py-1 rounded-full text-sm font-semibold"
                                style={{
                                  backgroundColor: `${COLORS.primary}80`,
                                  color: "#FFFFFF",
                                  display: "inline-block",
                                  marginTop: "4px",
                                }}
                              >
                                {drive.role}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 text-white md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="opacity-75">Date:</span>
                                <div className="font-semibold">
                                  {drive.date}
                                </div>
                              </div>
                              <div>
                                <span className="opacity-75">Drive ID:</span>
                                <div className="font-mono text-xs">
                                  {drive._id}
                                </div>
                              </div>
                              <div>
                                <span className="opacity-75">Min CGPA:</span>
                                <div className="font-semibold">
                                  {drive.cgpaRequired}
                                </div>
                              </div>
                              <div>
                                <span className="opacity-75">Offer:</span>
                                <div className="font-semibold">
                                  ₹{drive.offerMoney?.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="flex text-white justify-between text-sm mb-2">
                                <span>Placement Progress</span>
                                <span>
                                  {drive.numStudentsSelected} /{" "}
                                  {drive.numRequired} ({completion}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(completion, 100)}%`,
                                    backgroundColor: getStatusColor(completion),
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Skills */}
                            {drive.skillsRequired?.length > 0 && (
                              <div className="mt-3 text-white">
                                <span className="text-sm opacity-75">
                                  Skills:{" "}
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {drive.skillsRequired.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 rounded text-xs"
                                      style={{
                                        backgroundColor: COLORS.border,
                                        color: COLORS.text,
                                      }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 min-w-[140px]">
                            <button
                              onClick={() => navigate(`/drives/${drive._id}`)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 justify-center"
                              style={{
                                backgroundColor: COLORS.primary,
                                color: "#FFFFFF",
                              }}
                            >
                              📊 Details
                            </button>
                            <button
                              onClick={() => handleDeleteDrive(drive._id)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 justify-center"
                              style={{
                                backgroundColor: "#EF4444",
                                color: "#FFFFFF",
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* DRIVE DETAILS SECTION */}
          {activeSection === "details" && (
            <div
              className="rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm border mx-2 sm:mx-4"
              style={{
                backgroundColor: COLORS.surface,
                boxShadow: `0 20px 40px ${COLORS.shadow}`,
                borderColor: COLORS.border,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl mx-auto sm:mx-0"
                  style={{
                    backgroundColor: `${COLORS.primary}20`,
                    color: COLORS.primary,
                  }}
                >
                  📊
                </div>
                <div className="text-center sm:text-left">
                  <h2
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: COLORS.accent }}
                  >
                    Drive Details
                  </h2>
                  <p className="opacity-75 text-sm text-white sm:text-base">
                    Get detailed information about specific drives
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto w-full">
                {/* Search Section */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <input
                    type="text"
                    value={detailsId}
                    onChange={(e) => setDetailsId(e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-sm sm:text-base"
                    style={{
                      backgroundColor: COLORS.inputBackground,
                      color: COLORS.inputText,
                      borderColor: COLORS.border,
                    }}
                    placeholder="Enter Drive ID (e.g., DRIVE_001)"
                  />
                  <button
                    onClick={handleLoadDetails}
                    disabled={loading || !detailsId.trim()}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: "#FFFFFF",
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Loading...</span>
                        <span className="sm:hidden">Load...</span>
                      </>
                    ) : (
                      <>
                        <span>🔍</span>
                        <span className="hidden sm:inline">Search</span>
                        <span className="sm:hidden text-">Go</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Not Found State */}
                {!detailsDrive && detailsId && (
                  <div
                    className="text-center py-6 sm:py-8 rounded-xl sm:rounded-2xl"
                    style={{ backgroundColor: COLORS.card }}
                  >
                    <div className="text-3xl sm:text-4xl mb-3">🔍</div>
                    <p className="opacity-75 text-sm sm:text-base">
                      Drive not found. Please check the Drive ID.
                    </p>
                  </div>
                )}

                {/* Drive Details Card */}
                {detailsDrive && (
                  <div
                    className="p-4 sm:p-6 rounded-xl border animate-fade-in"
                    style={{
                      backgroundColor: COLORS.card,
                      borderColor: COLORS.border,
                    }}
                  >
                    <div className="text-center mb-4 sm:mb-6">
                      <h3
                        className="text-xl sm:text-2xl font-bold mb-2"
                        style={{ color: COLORS.accent }}
                      >
                        {detailsDrive.companyName}
                      </h3>
                      <div
                        className="px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block text-xs sm:text-sm font-semibold mb-3 sm:mb-4"
                        style={{
                          backgroundColor: `${COLORS.primary}120`,
                          color: "#FFFFFF",
                        }}
                      >
                        {detailsDrive.role}
                      </div>
                    </div>

                    {/* Drive Information Grid */}
                    <div className="grid grid-cols-1 text-white sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Left Column */}
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm opacity-75 mb-1">
                            Drive Date
                          </label>
                          <div className="font-semibold text-sm sm:text-base">
                            {detailsDrive.date}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm opacity-75 mb-1">
                            Drive ID
                          </label>
                          <div className="font-mono text-xs sm:text-sm break-all">
                            {detailsDrive._id}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm opacity-75 mb-1">
                            Minimum CGPA
                          </label>
                          <div className="font-semibold text-sm sm:text-base">
                            {detailsDrive.cgpaRequired}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm opacity-75 mb-1">
                            Placement Status
                          </label>
                          <div className="font-semibold text-sm sm:text-base">
                            {detailsDrive.numStudentsSelected} /{" "}
                            {detailsDrive.numRequired} placed (
                            {getCompletionPercentage(detailsDrive)}%)
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm opacity-75 mb-1">
                            Offer Amount
                          </label>
                          <div className="font-semibold text-sm sm:text-base">
                            ₹{detailsDrive.offerMoney?.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm opacity-75 mb-1">
                            Current Round
                          </label>
                          <div className="font-semibold text-sm sm:text-base capitalize">
                            {detailsDrive.currentRound}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    {detailsDrive.skillsRequired?.length > 0 && (
                      <div
                        className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t"
                        style={{ borderColor: COLORS.border }}
                      >
                        <label className="block text-xs text-white sm:text-sm opacity-75 mb-2 sm:mb-3">
                          Required Skills
                        </label>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {detailsDrive.skillsRequired.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-xs sm:text-sm"
                              style={{
                                backgroundColor: COLORS.border,
                                color: COLORS.text,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Dialog */}
          {deleteDriveId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div
                className="bg-white rounded-2xl p-8 shadow-xl text-center"
                style={{
                  backgroundColor: COLORS.card,
                  color: COLORS.text,
                  minWidth: "320px",
                }}
              >
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: COLORS.accent }}
                >
                  Confirm Delete
                </h3>
                <p className="mb-6">
                  Are you sure you want to delete this drive?
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={confirmDeleteDrive}
                    className="px-6 py-2 rounded-lg font-semibold"
                    style={{
                      backgroundColor: "#EF4444",
                      color: "#fff",
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={cancelDeleteDrive}
                    className="px-6 py-2 rounded-lg font-semibold"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: "#fff",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOfficeHome;
