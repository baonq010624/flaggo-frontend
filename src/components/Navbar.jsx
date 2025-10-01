// src/components/Navbar.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../images/Logo.png";
import profileHolder from "../images/Profile_holder.jpg"; // đặt hình ở src/images/
import { AuthContext } from "../auth/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lấy user & token từ localStorage
  // Prefer using AuthContext so Navbar updates reactively when user/avatar changes.
  const auth = useContext(AuthContext) || {};
  const { user: ctxUser, accessToken: ctxAccessToken } = auth;

  // Fallback to localStorage if context isn't available (keeps backward compatibility)
  const rawUser = ctxUser ? null : localStorage.getItem("user");
  let user = ctxUser || null;
  if (!user && rawUser) {
    try { user = JSON.parse(rawUser); } catch (e) { user = null; }
  }
  const accessToken = ctxAccessToken || localStorage.getItem("accessToken");

  const menuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    // call context logout if available
    if (auth && typeof auth.doLogout === "function") {
      try { auth.doLogout(); } catch (e) {}
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* left: logo */}
      <div className="navbar-left">
        <Link to="/homepage" className="logo" aria-label="FlagGo home">
          <img src={logo} alt="FlagGo Logo" className="logo-image" />
        </Link>
      </div>

      {/* center: links — đặt ở giữa bằng position absolute để không bị xê dịch */}
      <div className="nav-center" aria-hidden={false}>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/homepage"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tours"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Tour
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/personalize"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Cá nhân hóa
            </NavLink>
          </li>
          {user && user.role === "admin" && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* right: auth / user */}
      <div className="navbar-auth" ref={menuRef}>
        {accessToken && user ? (
          <div className="navbar-user">
            <button
              className="user-btn"
              onClick={() => setMenuOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {/* compute avatar src similar to PersonalPage so it respects API_BASE */}
              {(() => {
                try {
                  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
                  const avatar = user && user.avatar ? user.avatar : null;
                  const src = avatar
                    ? (avatar.startsWith("http") ? avatar : `${API_BASE}${avatar.startsWith("/") ? "" : "/"}${avatar}`)
                    : profileHolder;
                  return <img src={src} alt="avatar" className="user-avatar" />;
                } catch (e) {
                  return <img src={profileHolder} alt="avatar" className="user-avatar" />;
                }
              })()}
              <span className="user-name">
                {user.name ? user.name : user.email}
              </span>
            </button>

            {menuOpen && (
              <div className="user-menu">
                <Link
                  to="/personal"
                  onClick={() => setMenuOpen(false)}
                  className="user-menu-item"
                >
                  Trang cá nhân
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="user-menu-item"
                  >
                    Bảng điều khiển
                  </Link>
                )}
                <button
                  className="user-menu-item logout"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn-login">
              Đăng nhập
            </Link>
            <Link to="/register" className="btn-register">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
