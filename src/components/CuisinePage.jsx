// src/components/CuisinePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import cuisineData from "../data/cuisine.json";
import "../styles/CuisinePage.css";

const CuisinePage = () => {
  const navigate = useNavigate();

  return (
    <div className="cuisine-list-page">
      <h2 className="cuisine-list-title">Các Món Ăn Đặc Sắc</h2>
      <div className="cuisine-list-grid">
        {cuisineData.map((item) => (
          <div
            key={item.id}
            className="cuisine-card"
            onClick={() => navigate(`/cuisine/${item.id}`)}
          >
            <img
              src={require(`../images/${item.image}`)}
              alt={item.title}
              className="cuisine-card-img"
            />
            <div className="cuisine-card-info">
              <h3>{item.title}</h3>
              <p>{item.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuisinePage;
