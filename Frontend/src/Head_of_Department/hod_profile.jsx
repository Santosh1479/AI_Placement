import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/topbar";
import { Bar, Pie } from "react-chartjs-2";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { COLORS } from "../constants/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const HOD_Profile = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("name") || "HOD"
  );
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    placed: 0,
    unplaced: 0,
    avgPackage: 0,
    highestPackage: 0,
    lpaList: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/hods/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDepartment(res.data.department);
        if (res.data.name) setDisplayName(res.data.name);
      })
      .catch((error) => console.error("Error fetching HOD profile:", error));
  }, []);

  useEffect(() => {
    if (!department) return;
    axios
      .get("http://localhost:5000/students")
      .then((res) => {
        const deptStudents = res.data.filter(
          (s) => s.department === department
        );
        setStudents(deptStudents);

        const placed = deptStudents.filter((s) => s.placed);
        const lpaList = placed.map((s) => s.lpa || 0);
        const total = deptStudents.length;
        const avg = lpaList.length
          ? (lpaList.reduce((a, b) => a + b, 0) / lpaList.length).toFixed(2)
          : 0;
        const highest = lpaList.length ? Math.max(...lpaList) : 0;

        setStats({
          totalStudents: total,
          placed: placed.length,
          unplaced: total - placed.length,
          avgPackage: avg,
          highestPackage: highest,
          lpaList,
        });
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, [department]);

  const handleDownloadExcel = () => {
    const excelData = students.map((student) => ({
      Name: student.name,
      USN: student.usn,
      Placed: student.placed ? "Yes" : "No",
      "Package (LPA)": student.placed ? student.lpa : "N/A",
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(
      wb,
      `${department}_Students_${new Date().toLocaleDateString()}.xlsx`
    );
  };

  const barData = {
    labels: stats.lpaList.map((_, idx) => `#${idx + 1}`),
    datasets: [
      {
        label: "LPA",
        data: stats.lpaList,
        backgroundColor: COLORS.accent,
        borderColor: COLORS.highlight,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Placed", "Unplaced"],
    datasets: [
      {
        label: "Placement Ratio",
        data: [stats.placed, stats.unplaced],
        backgroundColor: [COLORS.success, COLORS.highlight],
      },
    ],
  };

  return (
    <div style={{ backgroundColor: COLORS.background, minHeight: "100vh" }}>
      <Topbar name={displayName} />

      <div
        className="max-w-5xl mx-auto rounded-3xl shadow-2xl p-8 md:p-12 mt-10"
        style={{
          backgroundColor: COLORS.primary,
          boxShadow: `0 6px 20px ${COLORS.shadow}`,
        }}
      >
        <h1
          className="text-2xl md:text-3xl font-extrabold mb-10 text-center uppercase tracking-wide"
          style={{ color: COLORS.accent }}
        >
          Department Overview — {department || "Loading..."}
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total",
              value: stats.totalStudents,
              color: COLORS.accent,
            },
            { label: "Placed", value: stats.placed, color: COLORS.success },
            {
              label: "Unplaced",
              value: stats.unplaced,
              color: COLORS.highlight,
            },
            {
              label: "Avg. Package",
              value: `₹${stats.avgPackage}L`,
              color: COLORS.accent,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: item.color,
                color: COLORS.text,
                boxShadow: `0 3px 8px ${COLORS.shadow}`,
              }}
              className="p-6 rounded-2xl text-center font-semibold hover:scale-105 transition-all duration-300"
            >
              <div className="text-3xl font-bold">{item.value}</div>
              <div
                className="text-sm mt-1 uppercase tracking-wide"
                style={{ color: COLORS.textLight }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ backgroundColor: COLORS.card }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2
                className="font-bold text-lg"
                style={{ color: COLORS.accent }}
              >
                LPA Distribution
              </h2>
              <button
                onClick={handleDownloadExcel}
                className="text-sm font-semibold px-3 py-1 rounded-md transition-all hover:scale-105"
                style={{
                  backgroundColor: COLORS.highlight,
                  color: COLORS.background,
                }}
              >
                Download Excel
              </button>
            </div>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { color: COLORS.textLight } },
                  x: { ticks: { color: COLORS.textLight } },
                },
              }}
            />
          </div>

          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ backgroundColor: COLORS.card }}
          >
            <h2
              className="font-bold text-lg mb-3"
              style={{ color: COLORS.accent }}
            >
              Placement Ratio
            </h2>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: COLORS.textLight },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Highest Package */}
        <div className="text-center mb-10">
          <div
            className="inline-block px-8 py-4 rounded-2xl font-semibold shadow-lg"
            style={{ backgroundColor: COLORS.accent, color: COLORS.background }}
          >
            Highest Package: ₹{stats.highestPackage}L
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <button
            style={{
              backgroundColor: COLORS.accent,
              color: COLORS.background,
              boxShadow: `0 4px 8px ${COLORS.shadow}`,
            }}
            className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            onClick={() => navigate("/hod/approve-signup")}
          >
            Approve Signup Requests
          </button>
          <button
            style={{
              backgroundColor: COLORS.highlight,
              color: COLORS.background,
              boxShadow: `0 4px 8px ${COLORS.shadow}`,
            }}
            className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            onClick={() => navigate("/hod/edit-student")}
          >
            Edit Student Profiles
          </button>
        </div>
      </div>
    </div>
  );
};

export default HOD_Profile;
