// src/screens/TourPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/styles/TourPage.css";
import toursData from "../data/tours.json";

// Fallback khi không tìm thấy ảnh theo tên
import FallbackImg from "../images/VanHoa.jpg";
// Helper auto-map ảnh theo tên file (đã tạo ở src/utils/images.js)
import { resolveImageByName } from "../utils/images";

export default function TourPage() {
  const navigate = useNavigate();
  const tours = useMemo(() => toursData || [], []);

  const resolveImage = (imgName) => resolveImageByName(imgName, FallbackImg);

  const formatPrice = (t) => {
    if (t.priceText) return t.priceText;
    const n = Number(t.price);
    if (Number.isFinite(n)) {
      // ví dụ 99000 -> "99k VND"
      return `${Math.round(n / 1000).toLocaleString()}k VND`;
    }
    return "Liên hệ";
  };

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
              <img
                src={resolveImage(t.image)}
                alt={t.title}
                onError={(e) => (e.currentTarget.src = FallbackImg)}
              />
              <div className="tp-thumb-overlay">
                {t.duration && <span className="tp-badge">{t.duration}</span>}
                {t.capacity && (
                  <span className="tp-badge ghost">Sức chứa: {t.capacity}</span>
                )}
              </div>
            </div>

            <div className="tp-info">
              <h3 className="tp-title">{t.title}</h3>
              {t.code && <div className="tp-code">Mã tour: {t.code}</div>}
              {t.shortDesc && <p className="tp-short">{t.shortDesc}</p>}

              <div className="tp-bottom">
                <div className="tp-price">{formatPrice(t)}</div>
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
