// src/auth/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { refreshRequest } from "./authService";

export const AuthContext = createContext();

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [loading, setLoading] = useState(true);

  // Tries refresh on init to populate accessToken & user
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const data = await refreshRequest(); // will throw if fails
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
        // not logged in or refresh failed
        setAccessToken("");
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
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
