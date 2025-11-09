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
import { COLORS } from '../constants/colors'

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
        backgroundColor: COLORS.primary,
        borderColor: COLORS.highlight,
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
    <div style={{ backgroundColor: COLORS.background }} className="min-h-screen">
      <Topbar
        name={displayName}
      />

      <div style={{ backgroundColor: COLORS.accent }} 
           className="max-w-3xl mx-auto rounded-2xl p-8 mt-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        
        {/* Summary Cards with new styling */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div style={{ backgroundColor: COLORS.primary }} 
               className="rounded-xl p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <div style={{ color: COLORS.text }} className="text-3xl font-extrabold">
              {stats.totalStudents}
            </div>
            <div style={{ color: COLORS.textLight }} className="mt-2">Total Students</div>
          </div>
          <div style={{ backgroundColor: COLORS.primary }}
               className="rounded-xl p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <div style={{ color: COLORS.highlight }} className="text-3xl font-extrabold">
              {stats.placed}
            </div>
            <div style={{ color: COLORS.textLight }} className="mt-2">Placed</div>
          </div>
          <div style={{ backgroundColor: COLORS.primary }}
               className="rounded-xl p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <div style={{ color: COLORS.text }} className="text-3xl font-extrabold">
              {stats.unplaced}
            </div>
            <div style={{ color: COLORS.textLight }} className="mt-2">Unplaced</div>
          </div>
          <div style={{ backgroundColor: COLORS.primary }}
               className="rounded-xl p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <div style={{ color: COLORS.highlight }} className="text-3xl font-extrabold">
              ₹{stats.avgPackage}L
            </div>
            <div style={{ color: COLORS.textLight }} className="mt-2">Avg. Package</div>
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
            style={{ backgroundColor: COLORS.highlight }}
            className="text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate("/hod/approve-signup")}
          >
            Approve Signup Requests
          </button>
          <button
            style={{ backgroundColor: COLORS.highlight }}
            className="text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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