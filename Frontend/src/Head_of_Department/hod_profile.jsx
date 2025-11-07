import React from "react";
import Topbar from "../components/topbar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Demo data
const departmentStats = {
  totalStudents: 120,
  placed: 85,
  unplaced: 35,
  avgPackage: 7.2,
  highestPackage: 18,
  companies: [
    { name: "Google", count: 10 },
    { name: "Microsoft", count: 8 },
    { name: "Amazon", count: 12 },
    { name: "Infosys", count: 15 },
    { name: "TCS", count: 20 },
    { name: "Others", count: 20 },
  ],
  yearlyPlacement: [
    { year: "2021", placed: 70 },
    { year: "2022", placed: 80 },
    { year: "2023", placed: 85 },
  ],
};

const barData = {
  labels: departmentStats.yearlyPlacement.map((y) => y.year),
  datasets: [
    {
      label: "Students Placed",
      data: departmentStats.yearlyPlacement.map((y) => y.placed),
      backgroundColor: "rgba(99,102,241,0.7)",
      borderRadius: 8,
    },
  ],
};

const pieData = {
  labels: departmentStats.companies.map((c) => c.name),
  datasets: [
    {
      label: "Placements by Company",
      data: departmentStats.companies.map((c) => c.count),
      backgroundColor: [
        "#6366f1",
        "#818cf8",
        "#a5b4fc",
        "#fbbf24",
        "#34d399",
        "#f472b6",
      ],
    },
  ],
};

const HOD_Profile = () => {
  const displayName = localStorage.getItem("name") || "HOD";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans">
      {/* Topbar: logout handled inside Topbar now */}
      <Topbar
        name={displayName}
        avatarUrl={`https://avatar.iran.liara.run/public/44`}
      >
        
      </Topbar>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">
          Department Placement Statistics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-indigo-700">
              {departmentStats.totalStudents}
            </div>
            <div className="text-gray-600 mt-2">Total Students</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-green-600">
              {departmentStats.placed}
            </div>
            <div className="text-gray-600 mt-2">Placed</div>
          </div>
          <div className="bg-red-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-red-500">
              {departmentStats.unplaced}
            </div>
            <div className="text-gray-600 mt-2">Unplaced</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-yellow-600">
              ₹{departmentStats.avgPackage}L
            </div>
            <div className="text-gray-600 mt-2">Avg. Package</div>
          </div>
        </div>

        {/* Performance Graphs */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">
            Yearly Placement Trend
          </h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">
            Placement by Company
          </h2>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
        </div>

        {/* Highest Package */}
        <div className="mt-10 text-center">
          <div className="inline-block bg-indigo-100 rounded-xl px-6 py-3">
            <span className="text-indigo-700 font-bold text-lg">Highest Package:</span>
            <span className="text-indigo-900 font-extrabold text-2xl ml-2">
              ₹{departmentStats.highestPackage}L
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOD_Profile;