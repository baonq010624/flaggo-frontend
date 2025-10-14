// src/App.js
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import CoverPage from "./screens/CoverPage";
import HomePage from "./screens/HomePage";
import InformationPage from "./screens/InformationPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import PersonalPage from "./screens/PersonalPage";
import HeritageDetail from "./screens/HeritageDetail";
import TourPage from "./screens/TourPage";
import TourDetailPage from "./screens/TourDetailPage";
import AdminPage from "./screens/AdminPage";
import AdminRoute from "./components/AdminRoute";
import BookingRedirect from "./screens/BookingRedirect";
import PersonalizePage from "./screens/PersonalizePage";
import "./App.css";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleExplore = () => {
    navigate("/homepage");
  };

  // Gửi lượt truy cập khi người dùng vào web lần đầu (mỗi reload 1 lần)
  useEffect(() => {
    if (!sessionStorage.getItem("trackedVisit")) {
      sessionStorage.setItem("trackedVisit", "1");
      fetch(`${API_BASE}/api/track/visit`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }
  }, []);

  // Tự động scroll lên đầu khi chuyển trang (trừ khi có #hash)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  // Gửi sự kiện page_view tới Google Analytics nếu có
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search + location.hash,
        page_location: window.location.href,
        page_title: document.title || "FlagGo",
      });
    }
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="App">
      {/* Ẩn Navbar ở CoverPage */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<CoverPage onExplore={handleExplore} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/personal"
          element={
            <PrivateRoute>
              <PersonalPage />
            </PrivateRoute>
          }
        />

        <Route path="/homepage" element={<HomePage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/heritage/:id" element={<HeritageDetail />} />

        {/* Tour system */}
        <Route path="/tours" element={<TourPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />
        <Route path="/tours/:id/book" element={<BookingRedirect />} />

        {/* Cá nhân hóa */}
        <Route path="/personalize" element={<PersonalizePage />} />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
