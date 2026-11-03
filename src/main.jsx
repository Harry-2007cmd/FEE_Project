import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/styles.css";
import "./lib/data-loader.js";
import AppShell from "./components/layout/AppShell.jsx";
import Load from "./pages/Load.jsx";
import Home from "./pages/Home.jsx";
import Trainers from "./pages/Trainers.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import Lesson from "./pages/Lesson.jsx";
import Coach from "./pages/Coach.jsx";
import Tools from "./pages/Tools.jsx";
import Pricing from "./pages/Pricing.jsx";
import Planner from "./pages/Planner.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/load" element={<Load />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="courses" element={<Courses />} />
            <Route path="course" element={<CourseDetail />} />
            <Route path="lesson" element={<Lesson />} />
            <Route path="coach" element={<Coach />} />
            <Route path="tools" element={<Tools />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="planner" element={<Planner />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<Navigate to="/load" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);