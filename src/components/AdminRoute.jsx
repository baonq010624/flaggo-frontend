// src/components/AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

/**
 * AdminRoute: bảo vệ route chỉ cho admin.
 * - Nếu auth still loading -> render loading placeholder.
 * - Nếu không logged in -> redirect /login
 * - Nếu logged in but not admin -> redirect /homepage (hoặc thông báo)
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext) || {};

  if (loading) {
    return <div style={{ padding: 40 }}>Đang kiểm tra quyền truy cập...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if ((user.role || "user") !== "admin") {
    // thay đổi redirect nếu bạn muốn khác
    return <Navigate to="/homepage" replace />;
  }

  return children;
}
