// src/App.js
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CoverPage from "./screens/CoverPage";
import HomePage from "./screens/HomePage";
import InformationPage from "./screens/InformationPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import PersonalPage from "./screens/PersonalPage";
import HeritageDetail from "./screens/HeritageDetail";
import TourPage from "./screens/TourPage";
import TourDetailPage from "./screens/TourDetailPage";
import AdminPage from "./screens/AdminPage";
import AdminRoute from "./components/AdminRoute";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleExplore = () => {
    navigate("/homepage");
  };

  // Track visit khi app mount (1 lần mỗi reload)
  useEffect(() => {
    let fired = sessionStorage.getItem("trackedVisit");
    if (!fired) {
      sessionStorage.setItem("trackedVisit", "1");
      fetch(`${API_BASE}/api/track/visit`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="App">
      {/* Ẩn Navbar ở CoverPage */}
      {location.pathname !== "/" && <Navbar /> }

      <Routes>
        <Route path="/" element={<CoverPage onExplore={handleExplore} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/personal" element={<PrivateRoute><PersonalPage /></PrivateRoute>} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/heritage/:id" element={<HeritageDetail />} />
        <Route path="/tours" element={<TourPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />
        <Route path="/personalize" element={<div style={{ padding: "40px" }}>Cá nhân hóa - đang phát triển</div>} />
        <Route path="/shop" element={<div style={{ padding: "40px" }}>Mua sắm - đang phát triển</div>} />

        {/* Admin route */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        } />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
