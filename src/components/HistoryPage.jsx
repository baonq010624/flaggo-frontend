import React, { useState } from "react";
import "../styles/HistoryPage.css";
import historyData from "../data/history.json";

const HistoryPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleDetails = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="history-page-bg">
      <div className="history-container">
        <h1 className="history-title">Lịch sử Việt Nam</h1>
        <p className="history-subtitle">Khám phá những dấu mốc lịch sử hào hùng của dân tộc</p>
        <div className="timeline">
          {historyData.map((period, index) => (
            <div
              key={index}
              className="timeline-card"
              onClick={() => toggleDetails(index)}
            >
              <div className="timeline-header">
                <div className="timeline-info">
                  <h3>{period.title}</h3>
                  <p className="period-time">{period.time}</p>
                </div>
                <img src={period.image} alt={period.title} className="timeline-image" />
              </div>
              {activeIndex === index && (
                <div className="timeline-details">
                  <p>{period.overview}</p>
                  <ul>
                    {period.highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
