import React from "react";
import { useNavigate } from "react-router-dom";
import heritageData from "../data/heritage.json";
import "../styles/HeritagePage.css";

const HeritagePage = () => {
  const navigate = useNavigate();

  return (
    <div className="heritage-list-page">
      <h2 className="heritage-list-title">Các Di tích - Thắng cảnh nổi bật</h2>
      <div className="heritage-list-grid">
        {heritageData.map((item) => (
          <div
            key={item.id}
            className="heritage-card"
            onClick={() => navigate(`/heritage/${item.id}`)}
          >
            <img
              src={require(`../images/${item.image}`)}
              alt={item.title}
              className="heritage-card-img"
            />
            <div className="heritage-card-info">
              <h3>{item.title}</h3>
              <p>{item.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeritagePage;
