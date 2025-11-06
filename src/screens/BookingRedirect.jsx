// src/screens/BookingRedirect.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BookingRedirect.css";
import toursData from "../data/tours.json";

const COUNTDOWN = 40; // giây

function extractPageHandle(fanpageUrl) {
  try {
    if (!fanpageUrl) return "";
    const u = new URL(fanpageUrl);
    if (!/facebook\.com$/i.test(u.hostname.replace(/^www\./, ""))) return "";
    if (u.pathname === "/profile.php") {
      const id = u.searchParams.get("id");
      return id || "";
    }
    const parts = u.pathname.split("/").filter(Boolean);
    const numericSeg = parts.findLast?.((s) => /^\d{5,}$/.test(s));
    if (numericSeg) return numericSeg;
    if (parts.length) return parts[0];
    return "";
  } catch {
    return "";
  }
}
function buildMessengerLink(fanpageUrl) {
  const handle = extractPageHandle(fanpageUrl);
  return handle ? `https://m.me/${handle}` : fanpageUrl || "";
}

export default function BookingRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sec, setSec] = useState(COUNTDOWN);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const tour = useMemo(() => toursData.find((t) => t.id === id), [id]);
  const fanpage = tour?.contact?.fanpage || "";
  const messengerUrl = buildMessengerLink(fanpage);

  const prefillMsg = useMemo(() => {
    const title = tour?.title || "Tour";
    const code = tour?.code ? ` (${tour.code})` : "";
    return [
      `Xin chào, tôi muốn đặt ${title}${code}.`,
      "Thông tin của tôi:",
      "- Họ & Tên: ...",
      "- Số điện thoại: ...",
      "- Ngày khởi hành dự kiến: ...",
      "- Số lượng khách: ...",
      "- Ghi chú khác: ...",
    ].join("\n");
  }, [tour]);

  useEffect(() => {
    if (!tour) return;
    timerRef.current = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          if (messengerUrl) {
            window.location.assign(messengerUrl);
          } else {
            navigate(`/tours/${id}`);
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tour, messengerUrl, navigate, id]);

  if (!tour) {
    return (
      <div className="booking-redirect-root">
        <div className="br-card">
          <h2>Không tìm thấy tour</h2>
          <div className="br-actions">
            <button className="btn" onClick={() => navigate("/tours")}>← Danh sách tour</button>
          </div>
        </div>
      </div>
    );
  }

  const copyMsg = async () => {
    try {
      await navigator.clipboard.writeText(prefillMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const openNow = () => {
    if (messengerUrl) window.location.assign(messengerUrl);
  };

  const cancelRedirect = () => {
    clearInterval(timerRef.current);
    navigate(`/tours/${id}`);
  };

  return (
    <div className="booking-redirect-root">
      <div className="br-card">
        {/* Header đẹp, bỏ badge cũ */}
        <div className="br-head">
          <div className="br-eyebrow">Liên hệ qua Messenger</div>
          <h1>Chuẩn bị mở hộp chat Fanpage</h1>
          <p className="br-lead">
            Vui lòng cung cấp thông tin cơ bản để chúng tôi hỗ trợ đặt tour nhanh chóng.
          </p>

          {/* Tour meta */}
          <div className="br-tourMeta">
            <span className="chip">{tour.title}</span>
            {tour.code && <span className="chip ghost">Mã: {tour.code}</span>}
            {tour.duration && <span className="chip ghost">{tour.duration}</span>}
          </div>
        </div>

        {/* Countdown + nút chính */}
        <div className="br-countdown">
          <div className="cd-circle" aria-live="polite">
            <span className="cd-num">{sec}</span>
            <span className="cd-unit">giây</span>
          </div>
          <div className="cd-actions">
            <button className="btn primary" onClick={openNow}>Nhắn Fanpage ngay</button>
            <button className="btn ghost" onClick={cancelRedirect}>Hủy chuyển hướng</button>
          </div>
        </div>

        {/* Nội dung 2 cột */}
        <div className="br-content">
          <div className="br-left">
            <h3>Bạn nên chuẩn bị</h3>
            <ul className="br-list">
              <li>Họ & Tên</li>
              <li>Số điện thoại liên hệ</li>
              <li>Ngày khởi hành dự kiến</li>
              <li>Số lượng khách</li>
              <li>Ghi chú thêm (nếu có)</li>
            </ul>

            <div className="br-note">
              <strong>Mẹo nhanh:</strong> Bấm “Sao chép nội dung” rồi dán vào hộp chat để thao tác nhanh hơn.
            </div>
          </div>

          <div className="br-right">
            <h3>Nội dung mẫu</h3>
            <textarea className="msg-box" readOnly value={prefillMsg} />
            <div className="right-actions">
              <button className="btn outline" onClick={copyMsg}>
                {copied ? "Đã sao chép ✓" : "Sao chép nội dung"}
              </button>
              {messengerUrl ? (
                <a className="btn primary" href={messengerUrl} target="_blank" rel="noreferrer">
                  Mở hộp chat
                </a>
              ) : (
                <button className="btn" disabled>Fanpage chưa có</button>
              )}
            </div>
            <div className="privacy">
              Thông tin bạn gửi chỉ để tư vấn & đặt tour. Vui lòng không chia sẻ dữ liệu nhạy cảm.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="br-footer">
          <button className="btn outline" onClick={() => navigate(`/tours/${id}`)}>
            ← Quay lại trang tour
          </button>
          <button className="btn" onClick={() => navigate("/tours")}>
            Danh sách tour
          </button>
        </div>
      </div>
    </div>
  );
}
