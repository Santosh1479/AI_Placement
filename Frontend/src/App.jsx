import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './Index';
import Login from './Login';
import Register from './Register';
import StudentHome from './Student/home';
import PlaceOfficeHome from './Placement_Officer/PlaceOffice_home'; // Import the PlaceOfficeHome component
import HOD_Profile from './Head_of_Department/hod_profile'; // Import the HOD_Profile component
import './App.css';

// Authentication check
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

const getRole = () => {
  return localStorage.getItem('role');
};

const App = () => {
  const routes = [
    {
      path: '/',
      element: isAuthenticated() ? (
        getRole() === 'Student' ? (
          <Navigate to="/student/home" />
        ) : getRole() === 'Admin' ? (
          <Navigate to="/admin/home" />
        ) : (
          <Navigate to="/hod/home" />
        )
      ) : (
        <Index />
      ),
    },
    {
      path: '/login',
      element: !isAuthenticated() ? <Login /> : <Navigate to="/" />,
    },
    {
      path: '/register',
      element: !isAuthenticated() ? <Register /> : <Navigate to="/" />,
    },
    {
      path: '/student/home',
      element: isAuthenticated() && getRole() === 'Student' ? <StudentHome /> : <Navigate to="/login" />,
    },
    {
      path: '/admin/home',
      element: isAuthenticated() && getRole() === 'Admin' ? <PlaceOfficeHome /> : <Navigate to="/login" />,
    },
    {
      path: '/hod/home',
      element: isAuthenticated() && getRole() === 'HOD' ? <HOD_Profile /> : <Navigate to="/login" />,
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