// src/components/FestivalDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import festivalDetails from "../data/festivalDetails.json";
import "../styles/FestivalDetail.css";
import LHChuaOng from "../images/LHChuaOng.png";
import LHDinhBT from "../images/LHDinhBT.png";

const imageMap = {
  "LHChuaOng.png": LHChuaOng,
  "LHDinhBT.png": LHDinhBT,
};

const FestivalDetail = () => {
  const { id } = useParams();
  const festival = festivalDetails.find((item) => item.id === id);

  if (!festival) {
    return <div style={{ padding: "40px" }}>Không tìm thấy thông tin lễ hội.</div>;
  }

  return (
    <div className="festival-detail">
      <h1>{festival.title}</h1>
      <p className="location">{festival.location}</p>
      <hr />

      <section className="section">
        <h3>Giới thiệu chung</h3>
        <p>{festival.introduction}</p>
        <ul>
          {festival.highlights.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      <img
        className="detail-image"
        src={imageMap[festival.image]}
        alt={festival.title}
      />

      <section className="section">
        <h3>Hoạt động tiêu biểu</h3>
        <ol>
          {festival.activities.map((act, index) => (
            <li key={index}>{act}</li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h3>Trải nghiệm dành cho du khách</h3>
        <p>{festival.experience}</p>
      </section>

      <section className="section contact">
        <h3>Thông tin liên hệ</h3>
        <p>Điện thoại: {festival.contact.phone}</p>
        <p>Email: {festival.contact.email}</p>
        <p>Thời gian: {festival.contact.open}</p>
      </section>
    </div>
  );
};

export default FestivalDetail;
