// src/components/FestivalPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import festivalData from "../data/festival.json";
import "../styles/FestivalPage.css";

const FestivalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="festival-list-page">
      <h2 className="festival-list-title">Các lễ hội nổi bật</h2>
      <div className="festival-list-grid">
        {festivalData.map((item) => (
          <div
            key={item.id}
            className="festival-card"
            onClick={() => navigate(`/festival/${item.id}`)}
          >
            <img
              src={require(`../images/${item.image}`)}
              alt={item.title}
              className="festival-card-img"
            />
            <div className="festival-card-info">
              <h3>{item.title}</h3>
              <p>{item.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FestivalPage;
