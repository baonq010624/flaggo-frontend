// src/components/CuisineDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import cuisineData from "../data/cuisineDetails.json";
import "../styles/CuisineDetail.css";

import LauMamCT from "../images/LauMamCT.png";
import BanhTet from "../images/BanhTetLaLotCT.png";
import ChaoLong from "../images/ChaoLongCaiTac.png";
import BunNuocLeo from "../images/BunNuocLeo.png";
import BunGoiDa from "../images/BunGoiDa.png";

const imageMap = {
  "LauMamCT.png": LauMamCT,
  "BanhTetLaLotCT.png": BanhTet,
  "ChaoLongCaiTac.png": ChaoLong,
  "BunNuocLeo.png": BunNuocLeo,
  "BunGoiDa.png": BunGoiDa,
};

const CuisineDetail = () => {
  const { id } = useParams();
  const item = cuisineData.find((cuisine) => cuisine.id === id);

  if (!item) {
    return <div style={{ padding: "40px" }}>Không tìm thấy món ăn.</div>;
  }

  return (
    <div className="cuisine-detail">
      <h1>{item.title}</h1>
      <p className="location">{item.origin}</p>
      <hr />

      <section className="section">
        <h3>Giới thiệu chung</h3>
        <p>{item.introduction}</p>
        <ul>
          {item.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </section>

      <img
        className="detail-image"
        src={imageMap[item.image]}
        alt={item.title}
      />

      <section className="section">
        <h3>Trải nghiệm ẩm thực</h3>
        <p>{item.experience}</p>
      </section>

      <section className="section contact">
        <h3>Thông tin liên hệ</h3>
        <p>Địa chỉ: {item.contact.address}</p>
        <p>Giờ phục vụ: {item.contact.open}</p>
      </section>
    </div>
  );
};

export default CuisineDetail;
