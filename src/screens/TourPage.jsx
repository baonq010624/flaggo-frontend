// src/screens/TourPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/styles/TourPage.css";
import toursData from "../data/tours.json";

import VanHoaImg from "../images/VanHoa.jpg";

const imageMap = {
  "VanHoa.jpg": VanHoaImg,
  // map thêm nếu bạn có ảnh khác
};

export default function TourPage() {
  const navigate = useNavigate();
  const tours = useMemo(() => toursData || [], []);

  const resolveImage = (img) => imageMap[img] || VanHoaImg;

  return (
    <div className="tp-root">
      {/* Header */}
      <div className="tp-header">
        <h1>Các Tour Du Lịch</h1>
        <p className="tp-sub">
          Chọn tour phù hợp — từ trải nghiệm miệt vườn đến homestay văn hóa.
        </p>
      </div>

      {/* Grid */}
      <div className="tp-grid">
        {tours.map((t) => (
          <article
            key={t.id}
            className="tp-card"
            onClick={() => navigate(`/tours/${t.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/tours/${t.id}`);
            }}
          >
            <div className="tp-thumb">
              <img src={resolveImage(t.image)} alt={t.title} />
              <div className="tp-thumb-overlay">
                <span className="tp-badge">{t.duration}</span>
                <span className="tp-badge ghost">Sức chứa: {t.capacity}</span>
              </div>
            </div>

            <div className="tp-info">
              <h3 className="tp-title">{t.title}</h3>
              {/* show code if available */}
              {t.code && <div className="tp-code">Mã tour: {t.code}</div>}
              <p className="tp-short">{t.shortDesc}</p>

              <div className="tp-bottom">
                <div className="tp-price">
                  {t.priceText ||
                    `${(Number(t.price) / 1000).toLocaleString()}k VND`}
                </div>
                <button
                  className="btn tp-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tours/${t.id}`);
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
