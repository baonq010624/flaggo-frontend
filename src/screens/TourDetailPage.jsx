// src/screens/TourDetailPage.jsx
import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../src/styles/TourDetailPage.css";
import toursData from "../data/tours.json";

// Fallback khi không tìm thấy ảnh theo tên
import FallbackImg from "../images/VanHoa.jpg";
// Helper auto-map ảnh theo tên file (đã tạo ở src/utils/images.js)
import { resolveImageByName } from "../utils/images";

// ---- GA helpers ----
function trackEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {}
}
function getTrafficSource() {
  try {
    const cur = new URL(window.location.href);
    const utm = cur.searchParams.get("utm_source");
    if (utm) return utm;
    if (document.referrer) {
      const u = new URL(document.referrer);
      return u.host || "(referrer)";
    }
  } catch {}
  return "(direct)";
}

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hook 1: tìm tour
  const tour = useMemo(() => toursData.find((t) => t.id === id), [id]);

  // Không phải hook
  const resolveImage = (imgName) => resolveImageByName(imgName, FallbackImg);

  // Hook 2: chuẩn bị danh sách ảnh poster (1 hoặc 2 ảnh)
  const posterSrcs = useMemo(() => {
    const arr = Array.isArray(tour?.images) ? tour.images.filter(Boolean) : [];
    const list = arr.length ? arr : [tour?.image]; // fallback sang hero image nếu thiếu
    return list
      .filter(Boolean)
      .map((name) => resolveImageByName(name, FallbackImg));
  }, [tour]);

  // Không phải hook
  const priceDisplay =
    tour?.priceText ||
    (Number.isFinite(Number(tour?.price))
      ? `${Math.round(Number(tour.price) / 1000).toLocaleString()}k VND`
      : "Liên hệ");

  // GA: view detail khi đã có tour
  useEffect(() => {
    if (!tour) return;
    trackEvent("view_tour_detail", {
      tour_id: tour.id,
      tour_title: tour.title,
      price_text: priceDisplay,
      traffic_source: getTrafficSource(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour?.id]);

  const fanpageUrl = tour?.contact?.fanpage || "";

  const goBookNow = () => {
    if (!tour) return;
    // GA click đặt tour
    trackEvent("click_book_now", {
      tour_id: tour.id,
      tour_title: tour.title,
      price_text: priceDisplay,
      traffic_source: getTrafficSource(),
      location: "detail_page_top", // có 2 nút: top & bottom; nút dưới sẽ gán khác
    });
    navigate(`/tours/${tour.id}/book`);
  };

  const goBookNowBottom = () => {
    if (!tour) return;
    trackEvent("click_book_now", {
      tour_id: tour.id,
      tour_title: tour.title,
      price_text: priceDisplay,
      traffic_source: getTrafficSource(),
      location: "detail_page_bottom",
    });
    navigate(`/tours/${tour.id}/book`);
  };

  const onClickFanpage = () => {
    if (!tour) return;
    trackEvent("click_tour_fanpage", {
      tour_id: tour.id,
      tour_title: tour.title,
      traffic_source: getTrafficSource(),
    });
  };

  // Chỉ kiểm tra/return sau khi đã gọi xong mọi hook ở trên
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

  return (
    <div className="tdp-root">
      {/* HERO */}
      <section className="tdp-hero">
        <img
          src={resolveImage(tour.image)}
          alt={tour.title}
          onError={(e) => (e.currentTarget.src = FallbackImg)}
        />
        <div className="tdp-hero-overlay">
          <div className="tdp-hero-head">
            {tour.duration && <span className="tdp-badge">{tour.duration}</span>}
          </div>
          <h1>{tour.title}</h1>

          {/* meta ngắn */}
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

          <span className="tdp-price">💰 {priceDisplay}</span>
        </div>
      </section>

      {/* BODY: Poster to bên trái + nút bên phải */}
      <main className="tdp-body">
        <div className="tdp-grid poster-layout">
          {/* Left: 1-2 poster ảnh */}
          <section className="tdp-card tdp-poster-card">
            <div className={`tdp-gallery ${posterSrcs.length > 1 ? "multi" : "single"}`}>
              {posterSrcs.map((src, idx) => (
                <img
                  key={idx}
                  className="tdp-poster"
                  src={src}
                  loading="lazy"
                  alt={`${tour.title} poster ${idx + 1}`}
                  onError={(e) => (e.currentTarget.src = FallbackImg)}
                />
              ))}
            </div>
          </section>

          {/* Right: Action buttons */}
          <aside className="tdp-card tdp-side-card">
            <h3 className="side-title">Hành động nhanh</h3>
            <div className="side-actions">
              <button className="btn primary btn-lg" onClick={goBookNow}>
                Đặt ngay
              </button>
              {fanpageUrl ? (
                <a
                  className="btn outline btn-lg"
                  href={fanpageUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClickFanpage}
                >
                  Fanpage
                </a>
              ) : (
                <button className="btn outline btn-lg" disabled>
                  Fanpage
                </button>
              )}
              <button
                className="btn ghost dark btn-lg"
                onClick={() => navigate("/tours")}
              >
                ← Quay lại danh sách
              </button>
            </div>
            <p className="side-note">* Poster hiển thị đầy đủ thông tin tour.</p>
          </aside>
        </div>

        {/* bottom actions (mobile-friendly) */}
        <div className="tdp-actions">
          <button className="btn primary" onClick={goBookNowBottom}>
            Đặt ngay
          </button>
          {fanpageUrl ? (
            <a className="btn outline" href={fanpageUrl} target="_blank" rel="noreferrer" onClick={onClickFanpage}>
              Fanpage
            </a>
          ) : null}
          <button className="btn outline" onClick={() => navigate("/tours")}>
            Quay lại danh sách
          </button>
        </div>
      </main>
    </div>
  );
}
