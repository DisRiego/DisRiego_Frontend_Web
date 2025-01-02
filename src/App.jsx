import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home"

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
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
