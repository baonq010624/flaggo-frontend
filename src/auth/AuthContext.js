import React, { createContext, useEffect, useState } from "react";
import { refreshRequest } from "./authService";

export const AuthContext = createContext();

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  // 1) Rehydrate ngay từ localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [loading, setLoading] = useState(true);

  // 2) Sau khi mount, gọi refresh ở nền
  useEffect(() => {
    let mounted = true;

    const doRefresh = async () => {
      try {
        const data = await refreshRequest(); // yêu cầu cookie cross-site
        if (!mounted) return;
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          localStorage.setItem("accessToken", data.accessToken);
        }
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (e) {
        // ⚠️ ĐIỂM KHÁC BIỆT:
        // Không xoá localStorage ngay nếu refresh fail.
        // Giữ trạng thái từ LS (nếu còn token chưa hết hạn) để tránh 'đăng xuất' sau reload.
        // Có thể log nhẹ để debug:
        // console.debug("Refresh failed:", e?.status, e?.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Nếu đã có LS token -> hiển thị ngay rồi refresh nền
    // Nếu chưa có -> vẫn thử refresh (có thể user còn cookie)
    doRefresh();

    return () => { mounted = false; };
  }, []);

  const saveLogin = (token, userObj) => {
    setAccessToken(token);
    setUser(userObj);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const doLogout = async () => {
    try { await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    setAccessToken("");
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, saveLogin, doLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
