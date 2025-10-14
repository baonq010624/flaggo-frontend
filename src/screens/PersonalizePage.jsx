// src/screens/PersonalizePage.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { apiFetch } from "../utils/apiFetch";
import heritages from "../data/heritages.json";
import { resolveImageByName } from "../utils/images";
import FallbackImg from "../images/VanHoa.jpg";
import "../styles/PersonalizePage.css";

function formatDateTime(ts) {
  try { return new Date(ts).toLocaleString(); } catch { return ts; }
}

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
    if (document.referrer) {
      const u = new URL(document.referrer);
      return u.host || "(referrer)";
    }
  } catch {}
  return "(direct)";
}

export default function PersonalizePage() {
  const { user, accessToken, setAccessToken } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest|oldest|az|za
  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem("pz_view_mode") || "grid"; } catch { return "grid"; }
  }); // grid | list
  const [busyId, setBusyId] = useState(""); // heritageId đang xử lý bỏ lưu

  const mapById = useMemo(() => {
    const m = new Map();
    heritages.forEach((h) => m.set(h.id, h));
    return m;
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch saved items
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user || !accessToken) { setLoading(false); return; }
      try {
        const res = await apiFetch(
          "/api/user/favorites",
          { method: "GET" },
          accessToken,
          (newTk) => setAccessToken?.(newTk)
        );
        const data = await res.json();
        if (!mounted) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user, accessToken, setAccessToken]);

  // GA: Bắn event khi trang đã load xong (để có total_items)
  useEffect(() => {
    if (!loading) {
      trackEvent("view_personalize", {
        logged_in: !!user,
        total_items: items.length,
        traffic_source: getTrafficSource(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]); // chạy một lần sau khi loading -> false

  // Filter + sort
  const filtered = useMemo(() => {
    let list = items.map((it) => {
      const h = mapById.get(it.heritageId);
      return {
        ...it,
        _name: h?.name || it.name || it.heritageId,
        _image: resolveImageByName(h?.image, FallbackImg),
        _category: h?.category || "Khác",
        _short: h?.shortDesc || "",
      };
    });

    if (debouncedQuery) {
      list = list.filter((x) => x._name.toLowerCase().includes(debouncedQuery));
    }

    switch (sortBy) {
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "az":
        list.sort((a, b) => a._name.localeCompare(b._name, "vi"));
        break;
      case "za":
        list.sort((a, b) => b._name.localeCompare(a._name, "vi"));
        break;
      case "newest":
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return list;
  }, [items, mapById, debouncedQuery, sortBy]);

  const total = items.length;

  const handleUnsave = async (heritageId) => {
    if (!user || !accessToken || busyId) return;
    setBusyId(heritageId);
    try {
      const res = await apiFetch(
        "/api/user/favorites/toggle",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heritageId, vote: false }),
        },
        accessToken,
        (newTk) => setAccessToken?.(newTk)
      );
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error("toggle failed");
      setItems((cur) => cur.filter((x) => x.heritageId !== heritageId));
    } catch {
      alert("Bỏ lưu thất bại. Vui lòng thử lại!");
    } finally {
      setBusyId("");
    }
  };

  const setMode = (mode) => {
    setViewMode(mode);
    try { localStorage.setItem("pz_view_mode", mode); } catch {}
  };

  if (!user) {
    return (
      <div className="pz-root">
        <div className="pz-card pz-auth-card">
          <h2>Trang Cá Nhân Hóa</h2>
          <p>
            Bạn cần <Link className="pz-link" to="/login">đăng nhập</Link> để xem các địa điểm đã lưu.
          </p>
          <div className="pz-actions">
            <Link className="btn outline" to="/homepage">Khám phá ngay</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pz-root">
      <header className="pz-head">
        <div className="pz-head-top">
          <h1>Địa điểm đã lưu</h1>
          <span className="pz-badge">{total} mục</span>
        </div>
        <p className="pz-sub">
          Những di tích/điểm đến bạn đã “❤ Yêu thích” sẽ xuất hiện tại đây. Bấm vào thẻ để xem chi tiết,
          hoặc bỏ lưu ngay trên thẻ.
        </p>
      </header>

      {/* Toolbar */}
      <div className="pz-toolbar">
        <div className="pz-toolbar-row pz-toolbar-compact">
          <div className="pz-field">
            <input
              className="pz-input"
              placeholder="Tìm theo tên địa điểm…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="pz-field">
            <select
              className="pz-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sắp xếp"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="az">Tên A → Z</option>
              <option value="za">Tên Z → A</option>
            </select>
          </div>

          <div className="pz-field pz-viewtoggle">
            <div className="pz-toggle">
              <button
                className={`pz-viewbtn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setMode("grid")}
                aria-pressed={viewMode === "grid"}
                title="Dạng lưới"
              >
                ▦ Lưới
              </button>
              <button
                className={`pz-viewbtn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setMode("list")}
                aria-pressed={viewMode === "list"}
                title="Dạng danh sách"
              >
                ☰ Danh sách
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={viewMode === "grid" ? "pz-grid" : "pz-list"}>
          {Array.from({ length: viewMode === "grid" ? 8 : 6 }).map((_, i) => (
            <div key={i} className={`pz-card pz-skeleton ${viewMode === "list" ? "list" : ""}`}>
              <div className={`pz-thumb ${viewMode === "list" ? "list" : ""}`} />
              <div className="pz-info">
                <div className="pz-line w60" />
                <div className="pz-line w40" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="pz-empty">
          <div className="pz-emoji">🔎</div>
          <h3>Không có kết quả phù hợp</h3>
          <p>Thử đổi từ khóa tìm kiếm hoặc đổi kiểu sắp xếp.</p>
          <div className="pz-actions">
            <button
              className="btn outline"
              onClick={() => { setQuery(""); setSortBy("newest"); }}
            >
              Xóa bộ lọc
            </button>
            <Link className="btn primary" to="/homepage">Tiếp tục khám phá</Link>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="pz-grid">
          {filtered.map((it) => (
            <div key={it.heritageId} className="pz-card pz-item">
              <Link to={`/heritage/${it.heritageId}`} className="pz-img-wrap" title={it._name}>
                <img
                  src={it._image}
                  alt={it._name}
                  onError={(e) => (e.currentTarget.src = FallbackImg)}
                />
              </Link>
              <div className="pz-info">
                <div className="pz-title">{it._name}</div>
                <div className="pz-meta">
                  {it._category} • Lưu lúc: {formatDateTime(it.createdAt)}
                </div>
                <div className="pz-card-actions">
                  <Link to={`/heritage/${it.heritageId}`} className="btn outline btn-sm">
                    Xem chi tiết
                  </Link>
                  <button
                    className="btn danger btn-sm"
                    disabled={busyId === it.heritageId}
                    onClick={() => handleUnsave(it.heritageId)}
                    title="Bỏ lưu khỏi danh sách"
                  >
                    {busyId === it.heritageId ? "Đang bỏ…" : "Bỏ lưu"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ===== List view =====
        <div className="pz-list">
          {filtered.map((it) => (
            <div key={it.heritageId} className="pz-card pz-list-item">
              <Link to={`/heritage/${it.heritageId}`} className="pz-list-media" title={it._name}>
                <img
                  src={it._image}
                  alt={it._name}
                  onError={(e) => (e.currentTarget.src = FallbackImg)}
                />
              </Link>

              <div className="pz-list-main">
                <div className="pz-title-row">
                  <Link to={`/heritage/${it.heritageId}`} className="pz-title-link">
                    <div className="pz-title">{it._name}</div>
                  </Link>
                  <span className="pz-chip">{it._category}</span>
                </div>

                <div className="pz-meta">Lưu lúc: {formatDateTime(it.createdAt)}</div>

                {it._short ? (
                  <p className="pz-desc">{it._short}</p>
                ) : null}
              </div>

              <div className="pz-list-actions">
                <Link to={`/heritage/${it.heritageId}`} className="btn outline btn-sm">
                  Xem chi tiết
                </Link>
                <button
                  className="btn danger btn-sm"
                  disabled={busyId === it.heritageId}
                  onClick={() => handleUnsave(it.heritageId)}
                  title="Bỏ lưu khỏi danh sách"
                >
                  {busyId === it.heritageId ? "Đang bỏ…" : "Bỏ lưu"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
