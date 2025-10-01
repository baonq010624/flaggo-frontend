// src/utils/apiFetch.js
import { refreshRequest } from "../auth/authService";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * apiFetch(path, options, accessToken, onNewAccessToken)
 */
export async function apiFetch(path, options = {}, accessToken = null, onNewAccessToken = null) {
  const finalUrl = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = { ...(options.headers || {}) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(finalUrl, { ...options, headers, credentials: options.credentials ?? "include" });

  if (res.status === 401) {
    try {
      const refreshData = await refreshRequest();
      const newToken = refreshData.accessToken;
      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        if (onNewAccessToken) onNewAccessToken(newToken);

        const headers2 = { ...(options.headers || {}), Authorization: `Bearer ${newToken}` };
        res = await fetch(finalUrl, { ...options, headers: headers2, credentials: options.credentials ?? "include" });
      }
    } catch (e) {
      return res; // refresh fail → propagate 401
    }
  }

  return res;
}
