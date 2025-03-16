import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Reset_password from "./components/Reset_password";
import Reset_password_confirm from "./components/Reset_password_confirm";
import Account_activation from "./pages/Account_activation";

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/resetpassword" element={<Reset_password />} />
        <Route
          path="/login/resetpassword/:id"
          element={<Reset_password_confirm />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/:id" element={<Account_activation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard/rol/:id" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard/user/:id" element={<Dashboard />} />
        <Route path="/dashboard/property/:id" element={<Dashboard />} />
        <Route path="/dashboard/property/:id/lot/:id" element={<Dashboard />} />
        <Route path="/dashboard/properties/:id" element={<Dashboard />} />
        <Route
          path="/dashboard/properties/:id/lots/:id"
          element={<Dashboard />}
        />
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
