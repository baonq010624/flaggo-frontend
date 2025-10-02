// src/screens/Homepage.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import heritagesData from "../data/heritages.json";

// Ảnh fallback khi không tìm thấy ảnh theo tên trong JSON
import FallbackImg from "../images/HomePage.jpg";

// Helper auto-map ảnh theo tên file (đã tạo ở src/utils/images.js)
import { resolveImageByName } from "../utils/images";

export default function HomePage() {
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(null);
  const [page, setPage] = useState(0);
  const [overlayPos, setOverlayPos] = useState(null); // {top,left,width}
  const containerRef = useRef(null);

  // 4x2 layout => 8 items / page
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(heritagesData.length / ITEMS_PER_PAGE));

  // clamp page if data length changed
  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(totalPages - 1);
      setHovered(null);
      setOverlayPos(null);
    }
  }, [totalPages, page]);

  const getPageItems = (p) => {
    const start = p * ITEMS_PER_PAGE;
    return heritagesData.slice(start, start + ITEMS_PER_PAGE);
  };

  const pageItems = useMemo(() => getPageItems(page), [page]);
  const active = heritagesData.find((h) => h.id === hovered);

  const goToPage = (p) => {
    const next = Math.min(Math.max(0, p), totalPages - 1);
    setPage(next);
    setHovered(null);
    setOverlayPos(null);
  };
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  // Resolve ảnh theo tên trong JSON, fallback nếu không có
  const resolveImage = (imgName) => resolveImageByName(imgName, FallbackImg);

  // compute floating overlay position near the hovered item
  const showOverlayFor = (id, targetEl) => {
    if (!targetEl) {
      setOverlayPos(null);
      setHovered(null);
      return;
    }
    const rect = targetEl.getBoundingClientRect();
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const overlayW = 440;
    const overlayH = 230;
    let left = rect.right + 12;
    let top = rect.top;

    if (left + overlayW > vw - 12) left = rect.left - overlayW - 12;
    if (left < 12) left = 12;
    if (top + overlayH > vh - 12) top = Math.max(12, vh - overlayH - 12);
    if (top < 12) top = 12;

    setOverlayPos({ top: Math.round(top), left: Math.round(left), width: overlayW });
    setHovered(id);
  };

  const hideOverlay = () => {
    setHovered(null);
    setOverlayPos(null);
  };

  const onItemEnter = (e, id) => showOverlayFor(id, e.currentTarget);
  const onItemLeave = () => {
    // small grace period to let cursor move into the overlay
    setTimeout(() => {
      const overlay = document.querySelector(".hg-preview-overlay");
      if (!overlay || !overlay.matches(":hover")) hideOverlay();
    }, 120);
  };

  const onOverlayMouseLeave = () => hideOverlay();
  const onItemFocus = (e, id) => showOverlayFor(id, e.currentTarget);
  const onItemBlur = () => {
    setTimeout(() => {
      const overlay = document.querySelector(".hg-preview-overlay");
      if (!overlay || !overlay.contains(document.activeElement)) hideOverlay();
    }, 120);
  };

  return (
    <div className="hg-homepage" ref={containerRef}>
      {/* HERO */}
      <header className="hg-hero">
        <div className="hg-hero-inner hg-container">
          <div className="hg-hero-left">
            <h1>Khám phá Di tích & Thắng cảnh — Cần Thơ</h1>
            <p className="hg-lead">
              Hệ thống thông tin tập trung về các di tích, thắng cảnh và điểm
              văn hóa tại tỉnh Cần Thơ. Di chuột (hover) vào một điểm để xem
              preview, click để xem chi tiết.
            </p>
            <div className="hg-hero-actions">
              <button
                className="btn primary"
                onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
              >
                Khám phá ngay ↓
              </button>
              <button className="btn ghost" onClick={() => navigate("/information")}>
                Xem thông tin chung
              </button>
            </div>
          </div>
        </div>
        {/* subtle animated gradient strip */}
        <div className="hg-hero-accent" aria-hidden />
      </header>

      {/* LIST + PAGINATION */}
      <section className="hg-divisions">
        <div className="hg-container">
          <div className="hg-left-col">
            <h2>Danh lam — Thắng cảnh</h2>
            <p className="small-muted">
              Di chuột (hover) để xem preview nhanh, click để xem chi tiết.
            </p>

            {/* 4x2 grid (8 items) */}
            <div className="hg-division-grid-paged" role="list">
              {pageItems.map((h, idx) => (
                <button
                  key={`${h.id}-${page}`}
                  data-id={h.id}
                  className={`hg-division-item reveal ${hovered === h.id ? "active" : ""}`}
                  onMouseEnter={(e) => onItemEnter(e, h.id)}
                  onMouseLeave={onItemLeave}
                  onFocus={(e) => onItemFocus(e, h.id)}
                  onBlur={onItemBlur}
                  onClick={() => navigate(`/heritage/${h.id}`)}
                  role="listitem"
                  type="button"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="div-name">{h.name}</div>
                  <div className="div-meta">
                    <span>{h.location || "—"}</span>
                    <span>{h.category || ""}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* pagination */}
            <div className="hg-pagination">
              <button className="btn outline" onClick={prevPage} disabled={page === 0}>
                ← Trước
              </button>
              <div className="page-indicator">
                Trang {page + 1} / {totalPages}
              </div>
              <button className="btn outline" onClick={nextPage} disabled={page === totalPages - 1}>
                Tiếp →
              </button>
            </div>
          </div>
          <aside className="hg-right-col" aria-hidden="true" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="hg-about">
        <div className="hg-container">
          <div className="about-content">
            <h2>Về FlagGo — Cần Thơ</h2>
            <p>
              FlagGo là nền tảng giới thiệu hệ thống di tích và thắng cảnh của
              tỉnh Cần Thơ, giúp bạn dễ dàng tiếp cận thông tin lịch sử, văn
              hóa, và các điểm đến nổi bật.
            </p>
            <div className="about-cards">
              <div className="about-card">
                <h4>📚 Kiến thức</h4>
                <p>Tập hợp thông tin chuẩn xác, dễ tiếp cận.</p>
              </div>
              <div className="about-card">
                <h4>🌏 Du lịch</h4>
                <p>Gợi ý địa điểm, trải nghiệm văn hóa đặc sắc.</p>
              </div>
              <div className="about-card">
                <h4>🏛️ Di sản</h4>
                <p>Bảo tồn giá trị văn hóa và truyền thống lâu đời.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating overlay preview */}
      {active && overlayPos && (
        <div
          className="hg-preview-overlay enter"
          style={{ top: overlayPos.top, left: overlayPos.left, width: overlayPos.width, position: "fixed" }}
          onMouseLeave={onOverlayMouseLeave}
          onMouseEnter={() => {}}
        >
          <div className="preview-image">
            <img
              src={resolveImage(active.image)}
              alt={active.name}
              onError={(e) => (e.currentTarget.src = FallbackImg)}
            />
          </div>
          <div className="preview-body">
            <h3>{active.name}</h3>
            <div className="preview-stats">
              <div>
                <strong>Vị trí</strong>
                <br />
                {active.location || "—"}
              </div>
              <div>
                <strong>Loại</strong>
                <br />
                {active.category || "—"}
              </div>
            </div>
            <p className="preview-desc">{active.shortDesc || active.description}</p>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button className="btn outline" onClick={() => navigate(`/heritage/${active.id}`)}>Xem chi tiết</button>
              <button className="btn" onClick={() => hideOverlay()}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
