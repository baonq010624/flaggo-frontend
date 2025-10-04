// src/auth/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { refreshRequest } from "./authService";

export const AuthContext = createContext();

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export const AuthProvider = ({ children }) => {
  const [user,   setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [loading, setLoading] = useState(true);

  // Init: cố refresh bằng cookie; nếu fail thì vẫn giữ localStorage hiện tại (không logout cứng)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await refreshRequest(); // dùng cookie httpOnly
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
        // Không có cookie / refresh fail → vẫn giữ nguyên trạng hiện tại từ localStorage
        // (tránh “bị đăng xuất” khi F5)
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const saveLogin = (token, userObj) => {
    setAccessToken(token);
    setUser(userObj);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const doLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
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
