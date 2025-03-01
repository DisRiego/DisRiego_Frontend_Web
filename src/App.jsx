import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Reset_password from "./components/Reset_password";
import Confirm_email from "./components/Confirm_email";

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/resetpassword" element={<Reset_password />} />
        <Route path="/confirmemail" element={<Confirm_email />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard/rol/:id" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard/user/:id" element={<Dashboard />} />
        <Route path="/dashboard/property/:id" element={<Dashboard />} />
        <Route path="/dashboard/property/:id/lot/:id" element={<Dashboard />} />
        <Route path="/dashboard/report/:id" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </>
  );
}

export default App;
