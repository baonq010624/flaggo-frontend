// src/screens/RegisterPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css"; // dùng đúng file RegisterPage.css
import logo from "../images/Logo.png";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "");

// ---- GA helpers (an toàn khi GA chưa sẵn sàng) ----
function trackEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {}
}
function getTrafficSource() {
  try {
    if (document.referrer) {
      const u = new URL(document.referrer);
      return u.host || "(referrer)";
    }
  } catch {}
  return "(direct)";
}

function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // optional
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // ========= Validators =========
  const validators = useMemo(() => {
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    // VN phone: 0xxxxxxxxx (10 số) hoặc +84xxxxxxxxx
    const isVNPhone = (v) => {
      const raw = v.replace(/\s|[-().]/g, "");
      if (!raw) return true; // optional
      return /^(?:0\d{9}|\+?84\d{9})$/.test(raw);
    };

    const validate = (fields) => {
      const e = {};
      const _name = (fields.name ?? "").trim();
      const _email = (fields.email ?? "").trim();
      const _pwd = fields.password ?? "";
      const _phone = fields.phone ?? "";

      if (!_name) e.name = "Vui lòng nhập họ & tên.";
      else if (_name.length < 2) e.name = "Tên quá ngắn (>= 2 ký tự).";

      if (!_email) e.email = "Vui lòng nhập email.";
      else if (!isEmail(_email)) e.email = "Email không hợp lệ.";

      if (!_pwd) e.password = "Vui lòng tạo mật khẩu.";
      else if (_pwd.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự.";

      if (_phone && !isVNPhone(_phone)) {
        e.phone = "Số điện thoại không đúng định dạng VN (0xxxxxxxxx hoặc +84xxxxxxxxx).";
      }

      return e;
    };

    return { validate };
  }, []);

  const runValidation = (partial = {}) => {
    const next = { name, email, password, phone, ...partial };
    const e = validators.validate(next);
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

    // final validate before submit
    const eMap = runValidation();
    if (Object.keys(eMap).length > 0) {
      // focus vào field đầu tiên có lỗi
      const firstKey = ["name", "email", "password", "phone"].find((k) => eMap[k]);
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`);
        if (el) el.focus();
      }
      return;
    }

    // GA: user nhấn submit form đăng ký
    trackEvent("register_submit", {
      method: "email_password",
      traffic_source: getTrafficSource(),
    });

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // GA: đăng ký thành công
        trackEvent("register_success", {
          method: "email_password",
          traffic_source: getTrafficSource(),
        });

        // lưu luôn để vào app liền tay (backend trả accessToken + user)
        localStorage.setItem("accessToken", data.accessToken);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/homepage");
      } else {
        // GA: đăng ký thất bại
        trackEvent("register_failed", {
          reason: data?.message ? String(data.message).slice(0, 80) : "unknown",
          traffic_source: getTrafficSource(),
        });
        setServerError(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      trackEvent("register_failed", {
        reason: "network_error",
        traffic_source: getTrafficSource(),
      });
      setServerError("Không thể kết nối máy chủ. Kiểm tra mạng và thử lại.");
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
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Đăng ký</h2>

            {serverError ? <div className="form-error">{serverError}</div> : null}

            <div className={`input-row ${touched.name && errors.name ? "has-error" : ""}`}>
              <label htmlFor="name">Họ & tên</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) runValidation({ name: e.target.value });
                }}
                onBlur={() => onBlur("name")}
                placeholder="Tên của bạn"
                autoComplete="name"
                required
              />
              {touched.name && errors.name ? (
                <div className="error-text">{errors.name}</div>
              ) : null}
            </div>

            <div className={`input-row ${touched.phone && errors.phone ? "has-error" : ""}`}>
              <label htmlFor="phone">Số điện thoại (tùy chọn)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (touched.phone) runValidation({ phone: e.target.value });
                }}
                onBlur={() => onBlur("phone")}
                placeholder="0xxxxxxxxx hoặc +84xxxxxxxxx"
                autoComplete="tel"
              />
              {touched.phone && errors.phone ? (
                <div className="error-text">{errors.phone}</div>
              ) : null}
            </div>

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
                autoComplete="email"
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
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
                required
                minLength={6}
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
                aria-busy={submitting ? "true" : "false"}
              >
                {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
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
