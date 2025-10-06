import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import logo from "../images/Logo.png";
import { AuthContext } from "../auth/AuthContext";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const validators = useMemo(() => {
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const validate = (fields) => {
      const e = {};
      const _email = fields.email?.trim() || "";
      const _pwd = fields.password || "";

      if (!_email) e.email = "Vui lòng nhập email.";
      else if (!isEmail(_email)) e.email = "Email không hợp lệ.";

      if (!_pwd) e.password = "Vui lòng nhập mật khẩu.";

      return e;
    };
    return { validate };
  }, []);

  const runValidation = (partial = {}) => {
    const e = validators.validate({
      email,
      password,
      ...partial,
    });
    setErrors(e);
    return e;
  };

  const onBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    runValidation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const eMap = runValidation();
    if (Object.keys(eMap).length > 0) {
      const firstKey = ["email", "password"].find((k) => eMap[k]);
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`);
        if (el) el.focus();
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (auth && typeof auth.saveLogin === "function") {
          auth.saveLogin(data.accessToken, data.user);
        }
        navigate("/homepage");
      } else {
        setServerError(data.message || "Email hoặc mật khẩu không đúng.");
      }
    } catch (err) {
      console.error(err);
      setServerError("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-root">
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
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Đăng nhập</h2>

            {serverError ? <div className="form-error">{serverError}</div> : null}

            <div className={`input-row ${touched.email && errors.email ? "has-error" : ""}`}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) runValidation({ email: e.target.value });
                }}
                onBlur={() => onBlur("email")}
                placeholder="email@example.com"
                required
              />
              {touched.email && errors.email ? (
                <div className="error-text">{errors.email}</div>
              ) : null}
            </div>

            <div className={`input-row ${touched.password && errors.password ? "has-error" : ""}`}>
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) runValidation({ password: e.target.value });
                }}
                onBlur={() => onBlur("password")}
                placeholder="Nhập mật khẩu"
                required
              />
              {touched.password && errors.password ? (
                <div className="error-text">{errors.password}</div>
              ) : null}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="login-btn"
                disabled={submitting || Object.keys(errors).length > 0}
              >
                {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
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
