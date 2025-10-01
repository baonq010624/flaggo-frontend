// src/screens/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // reuse same styles as LoginPage
import logo from "../images/Logo.png";

function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email và mật khẩu là bắt buộc.");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            name,
            phone, // backend might ignore this if not supported
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // đăng ký thành công -> chuyển đến trang login và hiển thị thông báo
        alert(data.message || "Đăng ký thành công. Vui lòng đăng nhập.");
        localStorage.setItem("accessToken", data.accessToken);
localStorage.setItem("user", JSON.stringify(data.user));
navigate("/homepage");

      } else {
        alert(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi kết nối tới server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-root">
      <div className="login-container">
        {/* Left panel (brand) */}
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
            <h2 className="form-title">Đăng ký</h2>

            <div className="input-row">
              <label>Họ & tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn"
                required
              />
            </div>

            <div className="input-row">
              <label>Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912xxxxxx"
              />
            </div>

            <div className="input-row">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="input-row">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tạo mật khẩu"
                required
                minLength={6}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="login-btn" disabled={submitting}>
                {submitting ? "Đang gửi..." : "Tạo tài khoản"}
              </button>
            </div>

            <div className="small-note">
              Đã có tài khoản? <a href="/#/login">Đăng nhập</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
