// src/screens/PersonalPage.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PersonalPage.css";
import profileHolder from "../images/Profile_holder.jpg";
import { AuthContext } from "../auth/AuthContext";
import { apiFetch } from "../utils/apiFetch";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PersonalPage = () => {
  const navigate = useNavigate();
  // expect these to exist in your AuthContext
  const { user, setUser, accessToken, setAccessToken, doLogout } = useContext(AuthContext) || {};
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const fileInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      if (!mounted) return;
      setStatus("loading");

      // If context doesn't have token but localStorage does, populate context token.
      const storedToken = localStorage.getItem("accessToken");
      if (!accessToken && storedToken && typeof setAccessToken === "function") {
        // set in context (no await) so other components can use it later
        setAccessToken(storedToken);
      }

      // token to use for the initial request (prefer context, fallback to stored)
      const tokenToUse = accessToken || storedToken || null;

      try {
        const res = await apiFetch("/api/me", { method: "GET" }, tokenToUse, (newToken) => {
          // refresh callback from apiFetch (if it provides one)
          if (typeof setAccessToken === "function") {
            setAccessToken(newToken);
            localStorage.setItem("accessToken", newToken);
          }
        });

        if (res.status === 401) {
          // unauthorized -> ensure logged out and redirect to login
          console.warn("Not authorized when fetching /api/me");
          if (mounted) {
            try {
              if (typeof doLogout === "function") await doLogout();
            } catch (e) { /* ignore */ }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            if (typeof setUser === "function") setUser(null);
            if (typeof setAccessToken === "function") setAccessToken(null);
            navigate("/login");
          }
          return;
        }

        if (!res.ok) {
          console.error("Failed to fetch profile", res.status);
          if (mounted) setStatus("error");
          return;
        }

        const data = await res.json();
        if (mounted) {
          if (typeof setUser === "function") setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
          setStatus("ok");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (mounted) setStatus("error");
      }
    };

    // If no user in context, try to fetch. If user exists, mark ok.
    if (!user) {
      fetchProfile();
    } else {
      setStatus("ok");
    }

    return () => {
      mounted = false;
    };
  }, [accessToken, navigate, setUser, user, setAccessToken, doLogout]);

  const handleLogout = async () => {
    try {
      if (typeof doLogout === "function") await doLogout();
    } catch (e) { console.error("Logout failed:", e); }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    if (typeof setUser === "function") setUser(null);
    if (typeof setAccessToken === "function") setAccessToken(null);
    navigate("/");
  };

  const handleChooseFile = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewSrc) {
      try { URL.revokeObjectURL(previewSrc); } catch (e) {}
      setPreviewSrc(null);
    }
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    uploadAvatar(file);
  };

  const safeParse = async (res) => {
    const text = await res.text();
    if (!text) return {};
    try { return JSON.parse(text); } catch { return { message: text }; }
  };

  const uploadAvatar = async (file) => {
    if (!file || uploading) return;
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("avatar", file);

      // pass current accessToken (may be null — apiFetch will try refresh)
      const tokenToUse = accessToken || localStorage.getItem("accessToken") || null;

      const res = await apiFetch("/api/user/avatar", { method: "POST", body: fd }, tokenToUse, (newToken) => {
        if (typeof setAccessToken === "function") {
          setAccessToken(newToken);
          localStorage.setItem("accessToken", newToken);
        }
      });

      const data = await safeParse(res);

      if (!res.ok) {
        alert(data?.message || `Upload failed (${res.status})`);
      } else {
        // update user in context + localStorage
        const avatarUrl = data.avatar || "";
        const updated = { ...(user || {}), avatar: avatarUrl };
        if (typeof setUser === "function") setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        if (previewSrc) {
          try { URL.revokeObjectURL(previewSrc); } catch (e) {}
          setPreviewSrc(null);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Có lỗi khi upload ảnh");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (status === "loading" || status === "idle") {
    return (
      <div className="personal-root">
        <div className="personal-container">
          <div className="personal-loading">Đang tải thông tin người dùng...</div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="personal-root">
        <div className="personal-container">
          <div className="personal-error">
            Không thể tải thông tin tài khoản.{" "}
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_BASE}${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`
    : profileHolder;

  return (
    <div className="personal-root">
      <div className="personal-container">
        <aside className="personal-sidebar">
          <div className="avatar-wrap">
            <div className="avatar-frame">
              <img src={previewSrc || avatarSrc} alt="Avatar" className="avatar-img" />
              {uploading && <div className="avatar-loading">Đang tải...</div>}
            </div>

            <div className="avatar-actions">
              <button
                className={`ghost ${uploading ? "is-busy" : ""}`}
                onClick={handleChooseFile}
                type="button"
              >
                {uploading ? "Đang tải..." : "Tải ảnh"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <button
                className="ghost"
                type="button"
                onClick={() => alert("Xoá ảnh tạm thời chưa triển khai trên server.")}
              >
                Xoá
              </button>
            </div>
          </div>

          <div className="user-basic">
            <h2 className="user-name">{user?.name || "Người dùng"}</h2>
            <p className="user-email">{user?.email}</p>
            {user?.phone && <p className="user-phone">📞 {user.phone}</p>}
          </div>

          <div className="sidebar-meta">
            <div>
              <div className="meta-label">Tài khoản tạo</div>
              <div className="meta-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
              </div>
            </div>
          </div>

          <div className="sidebar-actions">
            <button className="btn logout" onClick={handleLogout}>
              Đăng xuất
            </button>
            <button className="btn secondary" disabled>
              Cập nhật (coming soon)
            </button>
          </div>
        </aside>

        <main className="personal-main">
          <div className="panel">
            <div className="panel-header">
              <h3>Thông tin cá nhân</h3>
              <div className="small-muted">Xem & quản lý thông tin của bạn</div>
            </div>

            <div className="profile-grid">
              <div className="field">
                <label>Họ và tên</label>
                <div className="value">{user?.name || "-"}</div>
              </div>
              <div className="field">
                <label>Email</label>
                <div className="value">{user?.email}</div>
              </div>
              <div className="field">
                <label>Số điện thoại</label>
                <div className="value">{user?.phone || "-"}</div>
              </div>
              <div className="field wide">
                <label>Ghi chú</label>
                <div className="value muted">
                  Các chức năng chỉnh sửa ảnh và cập nhật sẽ được bổ sung sau.
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Hoạt động gần đây</h3>
              <div className="small-muted">Hoạt động, lịch sử truy cập (placeholder)</div>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <div className="act-time">—</div>
                <div className="act-desc">Không có hoạt động gần đây.</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalPage;
