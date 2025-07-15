import React from "react";
import { useParams } from "react-router-dom";
import heritageData from "../data/heritageDetails.json";
import "../styles/HeritageDetail.css";
import DetailBTTH from "../images/DetailBTTH.png";

const imageMap = {
  "DetailBTTH.png": DetailBTTH,
};

const HeritageDetail = () => {
  const { id } = useParams();
  const heritage = heritageData.find((item) => item.id === id);

  if (!heritage) {
    return <div style={{ padding: "40px" }}>Không tìm thấy thông tin di tích.</div>;
  }

  return (
    <div className="heritage-detail">
      <h1>{heritage.title}</h1>
      <p className="location">{heritage.location}</p>
      <hr />

      <section className="section">
        <h3>Giới thiệu chung</h3>
        <p>{heritage.introduction}</p>
        <ul>
          {heritage.highlights.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      <img
        className="detail-image"
        src={imageMap[heritage.image]}
        alt={heritage.title}
      />

      <section className="section">
        <h3>Quy trình làm bánh</h3>
        <ol>
          {heritage.process.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h3>Trải nghiệm dành cho du khách</h3>
        <p>{heritage.experience}</p>
      </section>

      <section className="section contact">
        <h3>Thông tin liên hệ</h3>
        <p>Điện thoại: {heritage.contact.phone}</p>
        <p>Email: {heritage.contact.email}</p>
        <p>Giờ mở cửa: {heritage.contact.open}</p>
      </section>
    </div>
  );
};

export default HeritageDetail;
