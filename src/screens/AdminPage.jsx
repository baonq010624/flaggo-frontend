// src/screens/AdminPage.jsx
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import "../styles/AdminPage.css";
import { apiFetch } from "../utils/apiFetch";
import { AuthContext } from "../auth/AuthContext";

export default function AdminPage() {
  const { accessToken } = useContext(AuthContext) || {};
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error

  // Visits
  const [mode, setMode] = useState("day"); // day | month | year
  const [limit, setLimit] = useState(30);
  const [chart, setChart] = useState({ rows: [], mode: "day" });
  const [chartStatus, setChartStatus] = useState("idle");

  // Favorites
  const [favLimit, setFavLimit] = useState(10);
  const [favData, setFavData] = useState({ rows: [] });
  const [favStatus, setFavStatus] = useState("idle");

  // Basic stats (userCount)
  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      setStatus("loading");
      try {
        const res = await apiFetch("/api/admin/stats", { method: "GET" }, accessToken);
        if (!mounted) return;
        if (res.status === 403 || res.status === 401) {
          setStatus("error");
          setStats({ message: "Không có quyền truy cập." });
          return;
        }
        if (!res.ok) {
          const txt = await res.text();
          setStatus("error");
          setStats({ message: txt || `Lỗi (${res.status})` });
          return;
        }
        const data = await res.json();
        setStats(data);
        setStatus("ok");
      } catch (e) {
        console.error("Fetch admin stats error", e);
        if (!mounted) return;
        setStatus("error");
        setStats({ message: "Lỗi kết nối." });
      }
    };

    fetchStats();
    return () => { mounted = false; };
  }, [accessToken]);

  // Visits chart
  const loadChart = async () => {
    setChartStatus("loading");
    try {
      const url = `/api/admin/visits?mode=${encodeURIComponent(mode)}&limit=${encodeURIComponent(limit)}`;
      const res = await apiFetch(url, { method: "GET" }, accessToken);
      if (res.status === 403 || res.status === 401) {
        setChartStatus("error");
        setChart({ rows: [], mode });
        return;
      }
      if (!res.ok) {
        setChartStatus("error");
        setChart({ rows: [], mode });
        return;
      }
      const data = await res.json();
      setChart(data);
      setChartStatus("ok");
    } catch (e) {
      console.error("Fetch visits chart error", e);
      setChartStatus("error");
      setChart({ rows: [], mode });
    }
  };

  useEffect(() => {
    loadChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, limit, accessToken]);

  // Favorites chart (memo hóa để thỏa eslint exhaustive-deps)
  const loadFavs = useCallback(async () => {
    setFavStatus("loading");
    try {
      const url = `/api/admin/favorites?limit=${encodeURIComponent(favLimit)}`;
      const res = await apiFetch(url, { method: "GET" }, accessToken);
      if (res.status === 403 || res.status === 401) {
        setFavStatus("error");
        setFavData({ rows: [] });
        return;
      }
      if (!res.ok) {
        setFavStatus("error");
        setFavData({ rows: [] });
        return;
      }
      const data = await res.json();
      setFavData(data);
      setFavStatus("ok");
    } catch (e) {
      console.error("Fetch favorites chart error", e);
      setFavStatus("error");
      setFavData({ rows: [] });
    }
  }, [favLimit, accessToken]);

  useEffect(() => {
    loadFavs();
  }, [loadFavs]);

  // Chart sizing for visits
  const { maxValue, bars } = useMemo(() => {
    const rows = chart?.rows || [];
    const maxValue = rows.reduce((m, r) => Math.max(m, r.value || 0), 0) || 1;
    const bars = rows.map((r) => ({
      label: r.label,
      value: r.value,
      pct: Math.round(((r.value || 0) / maxValue) * 100),
    }));
    return { maxValue, bars };
  }, [chart]);

  // Chart sizing for favorites
  const { favMax, favBars } = useMemo(() => {
    const rows = favData?.rows || [];
    const favMax = rows.reduce((m, r) => Math.max(m, r.value || 0), 0) || 1;
    const favBars = rows.map((r) => ({
      label: r.label,
      value: r.value,
      pct: Math.round(((r.value || 0) / favMax) * 100),
    }));
    return { favMax, favBars };
  }, [favData]);

  return (
    <div className="admin-root">
      <div className="admin-container">
        <header className="admin-header">
          <h1>Trang Quản Trị</h1>
          <p className="small-muted">Chỉ quản trị viên mới truy cập được trang này.</p>
        </header>

        {/* Basic stats */}
        {status === "loading" && <div className="admin-loading">Đang tải số liệu...</div>}

        {status === "error" && (
          <div className="admin-error">
            <p>Không thể tải số liệu.</p>
            <pre style={{ whiteSpace: "pre-wrap" }}>{stats?.message}</pre>
          </div>
        )}

        {status === "ok" && stats && (
          <div className="admin-cards">
            <div className="admin-card">
              <div className="card-title">Tổng số tài khoản</div>
              <div className="card-value">{stats.userCount ?? "—"}</div>
            </div>
          </div>
        )}

        {/* Visits chart */}
        <section className="admin-chart-section">
          <div className="chart-header">
            <h2>Lượt truy cập</h2>
            <div className="chart-controls">
              <label>
                Phạm vi:&nbsp;
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="day">Theo ngày</option>
                  <option value="month">Theo tháng</option>
                  <option value="year">Theo năm</option>
                </select>
              </label>
              <label>
                Số mục:&nbsp;
                <input
                  type="number"
                  min={mode === "day" ? 1 : 1}
                  max={mode === "day" ? 365 : mode === "month" ? 60 : 20}
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value || "0", 10))}
                  style={{ width: 90 }}
                />
              </label>
              <button className="btn outline" onClick={loadChart}>Tải lại</button>
            </div>
          </div>

          {chartStatus === "loading" && <div className="admin-loading">Đang tải biểu đồ...</div>}
          {chartStatus === "error" && (
            <div className="admin-error">
              Không thể tải biểu đồ lượt truy cập.
            </div>
          )}

          {chartStatus === "ok" && (
            <div className="chart-wrap">
              <div className="chart-grid">
                {bars.map((b) => (
                  <div className="bar-col" key={b.label} title={`${b.label}: ${b.value}`}>
                    <div className="bar" style={{ height: `${b.pct}%` }}>
                      <span className="bar-value">{b.value}</span>
                    </div>
                    <div className="bar-label">{b.label}</div>
                  </div>
                ))}
              </div>
              <div className="chart-footer">
                <div>Giá trị lớn nhất: <strong>{maxValue}</strong></div>
                <div>Chế độ: <code>{chart.mode}</code></div>
              </div>
            </div>
          )}
        </section>

        {/* Favorites chart */}
        <section className="admin-chart-section">
          <div className="chart-header">
            <h2>Danh lam được yêu thích</h2>
            <div className="chart-controls">
              <label>
                Top:&nbsp;
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={favLimit}
                  onChange={(e) => setFavLimit(parseInt(e.target.value || "0", 10))}
                  style={{ width: 90 }}
                />
              </label>
              <button className="btn outline" onClick={loadFavs}>Tải lại</button>
            </div>
          </div>

          {favStatus === "loading" && <div className="admin-loading">Đang tải biểu đồ...</div>}
          {favStatus === "error" && (
            <div className="admin-error">
              Không thể tải biểu đồ yêu thích.
            </div>
          )}

          {favStatus === "ok" && (
            <div className="chart-wrap">
              <div className="chart-grid chart-grid--wide-labels">
                {favBars.map((b) => (
                  <div className="bar-col" key={b.label} title={`${b.label}: ${b.value}`}>
                    <div className="bar bar--secondary" style={{ height: `${b.pct}%` }}>
                      <span className="bar-value">{b.value}</span>
                    </div>
                    <div className="bar-label" title={b.label}>{b.label}</div>
                  </div>
                ))}
              </div>
              <div className="chart-footer">
                <div>Giá trị lớn nhất: <strong>{favMax}</strong></div>
                <div>Dữ liệu: <code>top {favLimit}</code></div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
