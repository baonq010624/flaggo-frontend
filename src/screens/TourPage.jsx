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
      return `${Math.round(n / 1000).toLocaleString()}k VND`;
    }
    return "Liên hệ";
  };

  return (
    <div className="tp-root">
      {/* Header */}
      <div className="tp-header container">
        <h1>Tour Du Lịch</h1>
        <p className="tp-sub">
          Chọn tour phù hợp — từ trải nghiệm miệt vườn, sông nước đến hành trình liên tỉnh.
        </p>
      </div>

      {/* Grid */}
      <div className="tp-grid container">
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
            {/* Thumb block */}
            <div className="tp-thumb">
              <img
                src={resolveImage(t.image)}
                alt={t.title}
                onError={(e) => (e.currentTarget.src = FallbackImg)}
                loading="lazy"
              />

              {/* Corner badges */}
              <div className="tp-corners">
                {t.duration && <span className="tp-chip">{t.duration}</span>}
                {t.capacity && (
                  <span className="tp-chip ghost">{t.capacity} khách</span>
                )}
              </div>

              {/* Title overlay */}
              <div className="tp-title-overlay">
                <h3 className="tp-title">{t.title}</h3>
              </div>
            </div>

            {/* Info block */}
            <div className="tp-info">
              {t.code && <div className="tp-code">Mã tour: {t.code}</div>}

              {/* PRICE moved here */}
              <div className="tp-price-inline" title={formatPrice(t)}>
                {formatPrice(t)}
              </div>

              {t.shortDesc && <p className="tp-short">{t.shortDesc}</p>}

              <div className="tp-meta">
                {t.departure && (
                  <span className="tp-pill">Khởi hành: {t.departure}</span>
                )}
                {t.pickup && <span className="tp-pill">Đón: {t.pickup}</span>}
                {t.vehicle && <span className="tp-pill">{t.vehicle}</span>}
              </div>

              <div className="tp-bottom">
                <button
                  className="btn tp-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tours/${t.id}`);
                  }}
                  aria-label={`Xem chi tiết ${t.title}`}
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
