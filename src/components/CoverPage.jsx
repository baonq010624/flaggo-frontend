import React, { useState, useEffect } from 'react';
import '../styles/CoverPage.css';

import img0 from '../images/CoverPage.jpg';
import img1 from '../images/CoverPage1.jpg';
import img2 from '../images/CoverPage2.jpg';
import img3 from '../images/CoverPage3.jpg';
import img4 from '../images/CoverPage4.jpg';
import img5 from '../images/CoverPage5.jpg';

const backgroundImages = [img0, img1, img2, img3, img4, img5];

const CoverPage = ({ onExplore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
          className={`cover-image ${index === currentIndex ? 'active' : ''}`}
        />
      ))}
      <div className="cover-text">
  <p className="subtitle">FlagGo</p>
  <h1>Việt Nam Trong Tầm Tay Bạn</h1>
  <button onClick={onExplore} className="explore-button">
    Bắt đầu khám phá
  </button>
</div>

    </div>
  );
};

export default CoverPage;
