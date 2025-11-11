import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./Index";
import Login from "./Login";
import Register from "./Register";
import StudentHome from "./Student/home";
import PlaceOfficeHome from "./Placement_Officer/PlaceOffice_home";
import HOD_Profile from "./Head_of_Department/hod_profile";
import DriveEdits from "./Placement_Officer/DriveEdits";
import Notification from "./Student/Notification";
import ApproveSignup from "./Head_of_Department/approve_signup";
import StudProfEdit from "./Head_of_Department/stud_prof_edit";
import NotVerified from "./Student/NotVerified";
import PageTransition from "./components/PageTransition";
import PageSkeleton from "./components/PageSkeleton";
import "./App.css";

const AnimatedRoutes = ({ isAuthenticated, role, approval }) => {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // simulate load delay for skeleton effect
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 400); // 400ms fast fade
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isPageLoading) return <PageSkeleton />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              {isAuthenticated ? (
                role === "students" ? (
                  approval === "approved" ? (
                    <Navigate to="/students/home" />
                  ) : (
                    <Navigate to="/students/not-verified" />
                  )
                ) : role === "placeofficers" ? (
                  <Navigate to="/placeofficers/home" />
                ) : (
                  <Navigate to="/hods/home" />
                )
              ) : (
                <Index />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              {!isAuthenticated ? <Login /> : <Navigate to="/" />}
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              {!isAuthenticated ? <Register /> : <Navigate to="/" />}
            </PageTransition>
          }
        />
        <Route
          path="/students/home"
          element={
            <PageTransition>
              {isAuthenticated && role === "students" && approval === "approved" ? (
                <StudentHome />
              ) : (
                <Navigate to="/students/not-verified" />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/students/not-verified"
          element={
            <PageTransition>
              {isAuthenticated && role === "students" ? (
                <NotVerified />
              ) : (
                <Navigate to="/login" />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/placeofficers/home"
          element={
            <PageTransition>
              {isAuthenticated && role === "placeofficers" ? (
                <PlaceOfficeHome />
              ) : (
                <Navigate to="/login" />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/hods/home"
          element={
            <PageTransition>
              {isAuthenticated && role === "hods" ? (
                <HOD_Profile />
              ) : (
                <Navigate to="/login" />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/drives/:id"
          element={
            <PageTransition>
              {isAuthenticated && role === "placeofficers" ? (
                <DriveEdits />
              ) : (
                <Navigate to="/login" />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/students/notifications"
          element={
            <PageTransition>
              {isAuthenticated && role === "students" ? (
                <Notification />
              ) : (
                <Navigate to="/login" />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/hod/approve-signup"
          element={
            <PageTransition>
              {isAuthenticated && role === "hods" ? (
                <ApproveSignup />
              ) : (
                <Navigate to="/login" />
              )}
            </PageTransition>
          }
        />
        <Route
          path="/hod/edit-student"
          element={
            <PageTransition>
              {isAuthenticated && role === "hods" ? (
                <StudProfEdit />
              ) : (
                <Navigate to="/login" />
              )}
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [approval, setApproval] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userApproval = localStorage.getItem("approval");
    setIsAuthenticated(!!token);
    setRole(userRole ? userRole.toLowerCase() : null);
    setApproval(userApproval);
  }, []);

  return (
    <Router>
      <AnimatedRoutes isAuthenticated={isAuthenticated} role={role} approval={approval} />
    </Router>
  );
};

export default App;
