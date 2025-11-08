import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './Index';
import Login from './Login';
import Register from './Register';
import StudentHome from './Student/home';
import PlaceOfficeHome from './Placement_Officer/PlaceOffice_home';
import HOD_Profile from './Head_of_Department/hod_profile';
import './App.css';
import DriveEdits from './Placement_Officer/DriveEdits';
import Notification from './Student/Notification';
import ApproveSignup from './Head_of_Department/approve_signup';
import StudProfEdit from './Head_of_Department/stud_prof_edit';
import NotVerified from './Student/NotVerified'; // Import NotVerified component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [approval, setApproval] = useState(null); // Add approval state

  // Load authentication, role, and approval status from localStorage once
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userApproval = localStorage.getItem('approval'); // Retrieve approval status
    setIsAuthenticated(!!token); // Set true if token exists
    setRole(userRole ? userRole.toLowerCase() : null); // Normalize role to lowercase
    setApproval(userApproval); // Set approval status
  }, []);

  const routes = [
    {
      path: '/',
      element: isAuthenticated ? (
        role === 'students' ? (
          approval === 'approved' ? (
            <Navigate to="/students/home" />
          ) : (
            <Navigate to="/students/not-verified" />
          )
        ) : role === 'placeofficers' ? (
          <Navigate to="/placeofficers/home" />
        ) : (
          <Navigate to="/hods/home" />
        )
      ) : (
        <Index />
      ),
    },
    {
      path: '/login',
      element: !isAuthenticated ? <Login /> : <Navigate to="/" />,
    },
    {
      path: '/register',
      element: !isAuthenticated ? <Register /> : <Navigate to="/" />,
    },
    {
      path: '/students/home',
      element:
        isAuthenticated && role === 'students' && approval === 'approved' ? (
          <StudentHome />
        ) : (
          <Navigate to="/students/not-verified" />
        ),
    },
    {
      path: '/students/not-verified',
      element: isAuthenticated && role === 'students' ? <NotVerified /> : <Navigate to="/login" />,
    },
    {
      path: '/placeofficers/home',
      element: isAuthenticated && role === 'placeofficers' ? <PlaceOfficeHome /> : <Navigate to="/login" />,
    },
    {
      path: '/hods/home',
      element: isAuthenticated && role === 'hods' ? <HOD_Profile /> : <Navigate to="/login" />,
    },
    {
      path: '/drives/:id',
      element: isAuthenticated && role === 'placeofficers' ? <DriveEdits /> : <Navigate to="/login" />,
    },
    {
      path: '/students/notifications',
      element: isAuthenticated && role === 'students' ? <Notification /> : <Navigate to="/login" />,
    },
    {
      path: '/hod/approve-signup',
      element: isAuthenticated && role === 'hods' ? <ApproveSignup /> : <Navigate to="/login" />,
    },
    {
      path: '/hod/edit-student',
      element: isAuthenticated && role === 'hods' ? <StudProfEdit /> : <Navigate to="/login" />,
    },
  ];

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;