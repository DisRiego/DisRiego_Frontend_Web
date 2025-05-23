import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Reset_password from "./components/Reset_password";
import Reset_password_confirm from "./components/Reset_password_confirm";
import Account_activation from "./pages/Account_activation";
import Update_info from "./pages/Update_info";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";

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
        <Route path="/login/update-info" element={<Update_info />} />

        <Route element={<ProtectedRoute />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/dashboard/company/:id" element={<Dashboard />} />
          <Route path="/dashboard/request/:id" element={<Dashboard />} />
          <Route path="/dashboard/rol/:id" element={<Dashboard />} />
          <Route path="/dashboard/user/:id" element={<Dashboard />} />
          <Route path="/dashboard/property/:id" element={<Dashboard />} />
          <Route path="/dashboard/properties/:id" element={<Dashboard />} />
          <Route path="/dashboard/device/:id" element={<Dashboard />} />
          <Route path="/dashboard/system/:id" element={<Dashboard />} />
          <Route path="/dashboard/report/:id" element={<Dashboard />} />
          <Route path="/dashboard/systems/:id" element={<Dashboard />} />
          <Route path="/dashboard/reports/:id" element={<Dashboard />} />
          <Route path="/dashboard/invoice/:id" element={<Dashboard />} />
          <Route path="/dashboard/invoices/:id" element={<Dashboard />} />
          <Route path="/dashboard/transaction/:id" element={<Dashboard />} />
          <Route path="/dashboard/consumptions/:id" element={<Dashboard />} />
          <Route
            path="/dashboard/property/:id/lot/:id/device/:id"
            element={<Dashboard />}
          />
          <Route
            path="/dashboard/property/:id/lot/:id"
            element={<Dashboard />}
          />
          <Route
            path="/dashboard/properties/:id/lot/:id"
            element={<Dashboard />}
          />
          <Route
            path="/dashboard/properties/:id/lot/:id/device/:id"
            element={<Dashboard />}
          />
          <Route path="/dashboard/invoice/pay/:id" element={<Dashboard />} />
          <Route path="/dashboard/invoices/pay/:id" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
