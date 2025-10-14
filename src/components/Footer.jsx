// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Về FlagGo</h4>
          <p>Dự án giới thiệu du lịch miền Nam Việt Nam sau sáp nhập 2025.</p>
        </div>
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: vsouth1605@gmail.com</p>
          <p>Điện thoại: 0946 840 606</p>
        </div>
        <div className="footer-section">
          <h4>Địa chỉ</h4>
          <p>Trường Đại học FPT Cần Thơ</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 FlagGo. Mọi quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
