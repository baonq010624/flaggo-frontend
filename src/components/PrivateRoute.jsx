// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken"); // token lưu khi login
  return token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
