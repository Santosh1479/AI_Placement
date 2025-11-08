import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/topbar";
import { Bar, Pie } from "react-chartjs-2";
import * as XLSX from 'xlsx';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const HOD_Profile = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(localStorage.getItem('name') || 'HOD');
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    placed: 0,
    unplaced: 0,
    avgPackage: 0,
    highestPackage: 0,
    lpaList: [],
  });

  // Fetch HOD's department first
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get("http://localhost:5000/hods/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setDepartment(res.data.department);
      // If the API returns a name, update displayName
      if (res.data.name) {
        setDisplayName(res.data.name);
      }
    })
    .catch(error => {
      console.error("Error fetching HOD profile:", error);
    });
  }, []); // Run once on component mount

  // Fetch students after we have the department
  useEffect(() => {
    if (!department) return; // Don't fetch if we don't have department yet

    axios.get("http://localhost:5000/students")
      .then(res => {
        const deptStudents = res.data.filter(s => s.department === department);
        setStudents(deptStudents);
        
        const placedStudents = deptStudents.filter(s => s.placed);
        const lpaList = placedStudents.map(s => s.lpa || 0);
        const totalStudents = deptStudents.length;
        const placed = placedStudents.length;
        const unplaced = totalStudents - placed;
        const avgPackage = lpaList.length ? 
          (lpaList.reduce((a, b) => a + b, 0) / lpaList.length).toFixed(2) : 0;
        const highestPackage = lpaList.length ? Math.max(...lpaList) : 0;

        setStats({
          totalStudents,
          placed,
          unplaced,
          avgPackage,
          highestPackage,
          lpaList,
        });
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });
  }, [department]); // Run when department changes

  const handleDownloadExcel = () => {
    // Prepare data for Excel
    const excelData = students.map(student => ({
      'Name': student.name,
      'USN': student.usn,
      'Placed': student.placed ? 'Yes' : 'No',
      'Package (LPA)': student.placed ? student.lpa : 'N/A'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    
    // Generate Excel file
    XLSX.writeFile(wb, `${department}_Students_${new Date().toLocaleDateString()}.xlsx`);
  };

  // Bar chart for LPA distribution
  const barData = {
    labels: stats.lpaList.map((lpa, idx) => `Student ${idx + 1}`),
    datasets: [
      {
        label: "LPA",
        data: stats.lpaList,
        backgroundColor: "rgba(99,102,241,0.7)",
        borderRadius: 8,
      },
    ],
  };

  // Pie chart for placed/unplaced
  const pieData = {
    labels: ["Placed", "Unplaced"],
    datasets: [
      {
        label: "Placement Status",
        data: [stats.placed, stats.unplaced],
        backgroundColor: ["#34d399", "#f472b6"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans relative">
      {/* Topbar */}
      <Topbar
        name={displayName}
        avatarUrl={`https://avatar.iran.liara.run/public/44`}
      />

      {/* Main content */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            Department Placement Statistics ({department})
          </h1>
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download Excel
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-indigo-700">
              {stats.totalStudents}
            </div>
            <div className="text-gray-600 mt-2">Total Students</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-green-600">
              {stats.placed}
            </div>
            <div className="text-gray-600 mt-2">Placed</div>
          </div>
          <div className="bg-red-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-red-500">
              {stats.unplaced}
            </div>
            <div className="text-gray-600 mt-2">Unplaced</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center">
            <div className="text-3xl font-extrabold text-yellow-600">
              ₹{stats.avgPackage}L
            </div>
            <div className="text-gray-600 mt-2">Avg. Package</div>
          </div>
        </div>

        {/* Performance Graphs */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">
            LPA Distribution (Placed Students)
          </h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">
            Placement Status
          </h2>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
        </div>

        {/* Highest Package */}
        <div className="mt-10 text-center">
          <div className="inline-block bg-indigo-100 rounded-xl px-6 py-3">
            <span className="text-indigo-700 font-bold text-lg">Highest Package:</span>
            <span className="text-indigo-900 font-extrabold text-2xl ml-2">
              ₹{stats.highestPackage}L
            </span>
          </div>
        </div>

        {/* Menu Buttons below all stats */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
            onClick={() => navigate("/hod/approve-signup")}
          >
            Approve Signup Requests
          </button>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition"
            onClick={() => navigate("/hod/edit-student")}
          >
            Edit Student Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default HOD_Profile;