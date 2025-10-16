// src/screens/AdminPage.jsx
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import "../styles/AdminPage.css";
import { apiFetch } from "../utils/apiFetch";
import { AuthContext } from "../auth/AuthContext";

// Recharts
import {
  ResponsiveContainer,
  LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar,
} from "recharts";

export default function AdminPage() {
  const { accessToken } = useContext(AuthContext) || {};
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error

  // Visits
  const [mode, setMode] = useState("day"); // day | week | month | year
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

  // Favorites chart
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

  // Chuẩn hóa dữ liệu cho Recharts
  const visitSeries = useMemo(
    () => (chart?.rows || []).map((r) => ({ label: r.label, value: Number(r.value) || 0 })),
    [chart]
  );
  const favSeries = useMemo(
    () => (favData?.rows || []).map((r) => ({ label: r.label, value: Number(r.value) || 0 })),
    [favData]
  );

  // Tick formatter (trục Y)
  const numberFmt = (v) => {
    try { return new Intl.NumberFormat("vi-VN").format(v); }
    catch { return v; }
  };

  const modeVN = {
    day: "ngày",
    week: "tuần",
    month: "tháng",
    year: "năm",
  };

  const maxForMode = (m) => {
    if (m === "day") return 365;
    if (m === "week") return 104; // ~ 2 năm
    if (m === "month") return 60; // ~ 5 năm
    return 20; // year
  };

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

        {/* Visits chart (LineChart) */}
        <section className="admin-chart-section">
          <div className="chart-header">
            <h2>Lượt truy cập</h2>
            <div className="chart-controls">
              <label>
                Phạm vi:&nbsp;
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="day">Theo ngày</option>
                  <option value="week">Theo tuần</option>
                  <option value="month">Theo tháng</option>
                  <option value="year">Theo năm</option>
                </select>
              </label>
              <label>
                Số mục:&nbsp;
                <input
                  type="number"
                  min={1}
                  max={maxForMode(mode)}
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value || "0", 10))}
                  style={{ width: 90 }}
                />
              </label>
              <button className="btn outline" onClick={loadChart}>Tải lại</button>
            </div>
          </div>

          {chartStatus === "loading" && <div className="admin-loading">Đang tải biểu đồ...</div>}
          {chartStatus === "error" && <div className="admin-error">Không thể tải biểu đồ lượt truy cập.</div>}

          {chartStatus === "ok" && (
            <div className="chart-wrap">
              <div className="chart-canvas" style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitSeries} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      minTickGap={20}
                      interval="preserveStartEnd"
                    />
                    <YAxis tickFormatter={numberFmt} width={60} />
                    <Tooltip formatter={(v) => numberFmt(v)} labelClassName="tooltip-label" />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={`Lượt truy cập (${modeVN[mode] || mode})`}
                      stroke="#2f9e44"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-footer">
                <div>Điểm dữ liệu: <strong>{visitSeries.length}</strong></div>
                <div>Chế độ: <code>{chart.mode}</code></div>
              </div>
            </div>
          )}
        </section>

        {/* Favorites chart (BarChart) */}
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
          {favStatus === "error" && <div className="admin-error">Không thể tải biểu đồ yêu thích.</div>}

          {favStatus === "ok" && (
            <div className="chart-wrap">
              <div className="chart-canvas" style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={favSeries} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      minTickGap={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis tickFormatter={numberFmt} width={60} />
                    <Tooltip formatter={(v) => numberFmt(v)} />
                    <Legend />
                    <Bar dataKey="value" name="Lượt yêu thích" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-footer">
                <div>Số danh mục hiển thị: <strong>{favSeries.length}</strong></div>
                <div>Dữ liệu: <code>top {favLimit}</code></div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
