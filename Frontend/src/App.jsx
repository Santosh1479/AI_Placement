import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './Index';
import Login from './Login';
import Register from './Register';
import StudentHome from './Student/home';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/home" element={<StudentHome />} />
      </Routes>
    </Router>
  );
};

export default App;



  