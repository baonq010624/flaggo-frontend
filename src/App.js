// src/App.js
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CoverPage from "./components/CoverPage";
import HomePage from "./components/HomePage";
import InformationPage from "./components/InformationPage";
import HistoryPage from "./components/HistoryPage";
import HeritagePage from "./components/HeritagePage";
import HeritageDetail from "./components/HeritageDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleExplore = () => {
    navigate("/homepage");
  };

  return (
    <div className="App">
      {/* Ẩn Navbar ở CoverPage */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<CoverPage onExplore={handleExplore} />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/heritage" element={<HeritagePage />} />
        <Route path="/heritage/:id" element={<HeritageDetail />} />
        <Route path="/festival" element={<div style={{ padding: "40px" }}>Festival Page - đang phát triển</div>} />
        <Route path="/cuisine" element={<div style={{ padding: "40px" }}>Cuisine Page - đang phát triển</div>} />
        <Route path="/personalize" element={<div style={{ padding: "40px" }}>Cá nhân hóa - đang phát triển</div>} />
        <Route path="/shop" element={<div style={{ padding: "40px" }}>Mua sắm - đang phát triển</div>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
