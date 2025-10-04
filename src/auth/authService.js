// src/auth/authService.js
const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "");

// Đăng nhập: server set cookie refreshToken (httpOnly). Trả về accessToken + user.
export async function loginRequest(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // QUAN TRỌNG để nhận cookie refreshToken
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Refresh: chỉ cần cookie; KHÔNG gửi token trong body
export async function refreshRequest() {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    let msg = "refresh failed";
    try { msg = (await res.json()).message || msg; } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// Logout: cũng chỉ dựa vào cookie
export async function logoutRequest() {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}
