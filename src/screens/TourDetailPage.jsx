// src/screens/TourDetailPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../src/styles/TourDetailPage.css";
import toursData from "../data/tours.json";

// import ảnh (map tên file JSON sang import thực)
import VanHoaImg from "../images/VanHoa.jpg";

const imageMap = {
  "VanHoa.jpg": VanHoaImg,
};

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tour = useMemo(() => toursData.find((t) => t.id === id), [id]);

  if (!tour) {
    return (
      <div className="tdp-root not-found">
        <h2>Không tìm thấy tour</h2>
        <button onClick={() => navigate("/tours")} className="btn back-btn">
          Quay lại danh sách tour
        </button>
      </div>
    );
  }

  const resolveImage = (img) => imageMap[img] || VanHoaImg;

  return (
    <div className="tdp-root">
      {/* HERO */}
      <section className="tdp-hero">
        <img src={resolveImage(tour.image)} alt={tour.title} />
        <div className="tdp-hero-overlay">
          <div className="tdp-hero-head">
            <span className="tdp-badge">{tour.duration}</span>
            <span className="tdp-badge ghost">
              {tour.capacity ? `${tour.capacity} khách` : ""}
            </span>
          </div>
          <h1>{tour.title}</h1>
          {/* show code / pickup / departure */}
          <div className="tdp-meta">
            {tour.code && <div className="meta-line">Mã tour: {tour.code}</div>}
            {tour.departure && (
              <div className="meta-line">Khởi hành: {tour.departure}</div>
            )}
            {tour.pickup && (
              <div className="meta-line">Điểm đón/trả: {tour.pickup}</div>
            )}
            {tour.vehicle && (
              <div className="meta-line">Phương tiện: {tour.vehicle}</div>
            )}
          </div>

          {!!tour.shortDesc && <p className="tdp-sub">{tour.shortDesc}</p>}
          <div className="tdp-hero-foot">
            <span className="tdp-price">💰 {tour.priceText}</span>
            <div className="tdp-hero-actions">
              <button className="btn primary">Đặt ngay</button>
              <button className="btn ghost" onClick={() => navigate("/tours")}>
                ← Danh sách tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <main className="tdp-body">
        <div className="tdp-grid">
          {/* left: content */}
          <section className="tdp-card tdp-info">
            <h2>Chương trình chi tiết</h2>
            {/* description */}
            <p className="tdp-desc">{tour.description}</p>

            {/* itinerary */}
            {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
              <>
                <h3>Hành trình / Lịch trình</h3>
                <ol className="tdp-itinerary">
                  {tour.itinerary.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </>
            )}
            {/* included / not included */}
            {Array.isArray(tour.included) && (
              <>
                <h3>Dịch vụ bao gồm</h3>
                <ul>
                  {tour.included.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </>
            )}
            {Array.isArray(tour.notIncluded) && (
              <>
                <h3>Dịch vụ không bao gồm</h3>
                <ul>
                  {tour.notIncluded.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </>
            )}

            {/* meta small cards */}
            <div className="tdp-meta-cards">
              <div className="tdp-meta-card">
                <div className="meta-title">Thời lượng</div>
                <div className="meta-value">{tour.duration}</div>
              </div>
              {tour.capacity && (
                <div className="tdp-meta-card">
                  <div className="meta-title">Sức chứa</div>
                  <div className="meta-value">{tour.capacity} khách</div>
                </div>
              )}
              <div className="tdp-meta-card">
                <div className="meta-title">Giá</div>
                <div className="meta-value accent">
                  {tour.priceText || tour.price}
                </div>
              </div>
            </div>

            {/* child policy & cancellation */}
            {tour.childPolicy && (
              <>
                <h3>Quy định cho trẻ em</h3>
                <p>{tour.childPolicy}</p>
              </>
            )}
            {tour.cancellation && (
              <>
                <h3>Quy định huỷ tour</h3>
                <p>{tour.cancellation}</p>
              </>
            )}
          </section>

          {/* right: highlights & contact */}
          <section className="tdp-card tdp-highlights">
            <h2>Điểm nổi bật</h2>
            <ul className="tdp-hl">
              {Array.isArray(tour.highlights) &&
                tour.highlights.map((h, idx) => (
                  <li key={idx}>
                    <span className="dot" />
                    <span>{h}</span>
                  </li>
                ))}
            </ul>

            {tour.contact && (
              <>
                <h3>Thông tin liên hệ</h3>
                <div className="contact-block">
                  <div><strong>{tour.contact.company}</strong></div>
                  {tour.contact.phone && <div>Điện thoại: {tour.contact.phone}</div>}
                  {tour.contact.address && <div>Địa chỉ: {tour.contact.address}</div>}
                  {tour.contact.email && <div>Email: {tour.contact.email}</div>}
                  {tour.contact.fanpage && (
                    <div>
                      Fanpage: <a href={tour.contact.fanpage} target="_blank" rel="noreferrer">Link</a>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>

        {/* bottom actions (mobile-friendly) */}
        <div className="tdp-actions">
          <button className="btn primary">Đặt ngay</button>
          <button className="btn outline" onClick={() => navigate("/tours")}>
            Quay lại danh sách
          </button>
        </div>
      </main>
    </div>
  );
}
