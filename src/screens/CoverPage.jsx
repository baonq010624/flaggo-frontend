// src/screens/CoverPage.jsx
import React, { useState, useEffect } from "react";
import "../styles/CoverPage.css";

import img0 from "../images/CoverPage.jpg";
import img1 from "../images/CoverPage1.jpg";
import img2 from "../images/CoverPage2.jpg";
import img3 from "../images/CoverPage3.jpg";
import img4 from "../images/CoverPage4.jpg";
import img5 from "../images/CoverPage5.jpg";

const backgroundImages = [img0, img1, img2, img3, img4, img5];

const CoverPage = ({ onExplore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // slideshow / ken-burns
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cover-page">
      {backgroundImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Cover ${index}`}
          className={`cover-image ${index === currentIndex ? "active" : ""}`}
        />
      ))}

      {/* overlay giữ để chữ dễ đọc */}
      <div className="cover-overlay" />

      <div className="cover-text">
        <h1 className="brand-title">FLAGGO</h1>
        <p className="slogan">Cần Thơ trong tôi</p>

        <button onClick={onExplore} className="explore-button">
          Bắt đầu khám phá <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default CoverPage;
