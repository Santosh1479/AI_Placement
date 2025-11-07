import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './Index';
import Login from './Login';
import Register from './Register';
import StudentHome from './Student/home';
import PlaceOfficeHome from './Placement_Officer/PlaceOffice_home';
import HOD_Profile from './Head_of_Department/hod_profile';
import DriveEdits from './Placement_Officer/DriveEdits';
import './App.css';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

const getRole = () => {
  return localStorage.getItem('role');
};

// Redirect component for "/"
const HomeRedirect = () => {
  if (!isAuthenticated()) return <Index />;
  if (getRole() === 'Student') return <Navigate to="/student/home" />;
  if (getRole() === 'Admin') return <Navigate to="/admin/home" />;
  return <Navigate to="/hod/home" />;
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/" />} />
      <Route path="/student/home" element={isAuthenticated() && getRole() === 'Student' ? <StudentHome /> : <Navigate to="/login" />} />
      {/* <Route path="/admin/home" element={isAuthenticated() && getRole() === 'Admin' ? <PlaceOfficeHome /> : <Navigate to="/login" />} /> */}
      <Route path="/hod/home" element={isAuthenticated() && getRole() === 'HOD' ? <HOD_Profile /> : <Navigate to="/login" />} />
      <Route path="/admin" element={<PlaceOfficeHome/>}/> 
      <Route path="/drives/:id" element={<DriveEdits />} />
    </Routes>
  </Router>
);

export default App;