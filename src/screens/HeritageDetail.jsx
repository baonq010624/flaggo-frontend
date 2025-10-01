// src/screens/HeritageDetail.jsx
import React, { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import heritageData from "../data/heritages.json"; // <— dữ liệu MỚI
import "../styles/HeritageDetail.css";
import VanHoaImg from "../images/VanHoa.jpg";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const imageMap = {
  "VanHoa.jpg": VanHoaImg,
};

function getClientId() {
  try {
    const k = "fg_client_id";
    let id = localStorage.getItem(k);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(k, id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export default function HeritageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favMsg, setFavMsg] = useState("");

  // tìm heritage theo id trong dataset mới
  const heritage = useMemo(() => {
    return heritageData.find(
      (h) => (h?.id ?? "").toString() === (id ?? "").toString()
    );
  }, [id]);

  const resolveImage = (imgName) => imageMap[imgName] || VanHoaImg;

  // trạng thái đã "yêu thích" của client cho heritage này
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!heritage) return;
      setLoading(true);
      setFavMsg("");
      try {
        const clientId = getClientId();
        const url = `${API_BASE}/api/track/favorite/state?heritageId=${encodeURIComponent(
          heritage.id
        )}&clientId=${encodeURIComponent(clientId)}`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (mounted) setVoted(!!data?.voted);
      } catch {
        if (mounted) setVoted(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [heritage]);

  const handleToggleFavorite = async () => {
    if (!heritage || loading) return;
    setLoading(true);
    setFavMsg("");
    try {
      const clientId = getClientId();
      const want = !voted;
      const res = await fetch(`${API_BASE}/api/track/favorite/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          heritageId: heritage.id,
          name: heritage.name,
          clientId,
          vote: want,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("toggle failed");
      setVoted(!!data.voted);
      setFavMsg(want ? "Đã thêm vào yêu thích." : "Đã bỏ yêu thích.");
    } catch {
      setFavMsg("Không thể cập nhật. Thử lại sau nhé.");
    } finally {
      setLoading(false);
    }
  };

  if (!heritage) {
    return (
      <div className="heritage-detail container">
        <h2>Không tìm thấy di tích</h2>
        <button className="btn ghost" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="heritage-detail container">
      <header className="detail-hero">
        <img src={resolveImage(heritage.image)} alt={heritage.name} />
        <div className="overlay">
          <h1>{heritage.name}</h1>
          {heritage.shortDesc && <p>{heritage.shortDesc}</p>}

          <div className="hero-actions">
            <button
              className={`btn fav-btn ${voted ? "done" : ""}`}
              onClick={handleToggleFavorite}
              disabled={loading}
              title={voted ? "Bỏ yêu thích" : "Thêm yêu thích"}
            >
              {loading ? "Đang cập nhật..." : voted ? "Bỏ yêu thích" : "❤ Yêu thích"}
            </button>
            {favMsg && <span className="fav-msg">{favMsg}</span>}
          </div>
        </div>
      </header>

      <main className="detail-body">
        <section>
          <h2>Giới thiệu</h2>
          <p>{heritage.description}</p>
        </section>

        {/* Thông tin cần thiết: giờ, giá, di chuyển */}
        {(heritage.hours || heritage.price || heritage.transport) && (
          <section>
            <h2>Thông tin cần thiết</h2>
            <div className="info-grid">
              {heritage.hours && (
                <div className="info-item">
                  <strong>Giờ mở cửa</strong>
                  <div>{heritage.hours}</div>
                </div>
              )}
              {heritage.price && (
                <div className="info-item">
                  <strong>Giá vé</strong>
                  <div>{heritage.price}</div>
                </div>
              )}
              {heritage.transport && (
                <div className="info-item">
                  <strong>Di chuyển</strong>
                  <div>{heritage.transport}</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Điểm nhấn */}
        {Array.isArray(heritage.highlights) && heritage.highlights.length > 0 && (
          <section>
            <h2>Điểm nhấn</h2>
            <ul className="hi-lights">
              {heritage.highlights.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Địa điểm + Loại */}
        {(heritage.location || heritage.category) && (
          <section>
            <h2>Thông tin thêm</h2>
            {heritage.location && <p>📍 <strong>Địa điểm:</strong> {heritage.location}</p>}
            {heritage.category && <p>🏷️ <strong>Loại:</strong> {heritage.category}</p>}
          </section>
        )}
      </main>

      <div className="back-btn">
        <button className="btn ghost" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>
    </div>
  );
}
