// src/screens/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import logo from "../images/Logo.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/homepage");
      } else {
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi kết nối tới server");
    }
  };

  return (
    <div className="login-page-root">
      {/* Gradient Veil Effect */}
      <div className="veil"></div>

      <div className="login-container">
        {/* Left panel */}
        <div className="login-left">
          <div className="brand">
            <img src={logo} alt="Logo" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-name">FlagGo</div>
              <div className="brand-sub">Cần Thơ trong tôi</div>
            </div>
          </div>

          <h1 className="hero-title">Khám phá vùng đất sông nước</h1>
          <p className="hero-desc">
            Hành trình tìm về các di tích, lễ hội và ẩm thực đặc sắc của Cần Thơ.
          </p>
        </div>

        {/* Right panel (form) */}
        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Đăng nhập</h2>

            <div className="input-row">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>

            <div className="input-row">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="login-btn">
                Đăng nhập
              </button>
            </div>

            <div className="small-note">
              Chưa có tài khoản? <a href="/#/register">Đăng ký</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
