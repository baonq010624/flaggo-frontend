import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import provinceThumbnail from '../images/VanHoa.jpg'; // Dùng ảnh mẫu


const HomePage = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleInfoClick = () => {
    navigate('/information');
  };

  return (
    <div className="homepage">
      {/* Main Content */}
      <main className="main-content map-layout">
        {/* Bên trái: Vùng bản đồ */}
        <div
          className="map-region"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleInfoClick}
        >
          <div className="province-area">
            <span>HOVER TỈNH A</span>
          </div>
        </div>

        {/* Bên phải: Hiện thông tin nếu hover */}
        <div className={`info-preview ${hovered ? 'show' : ''}`}>
          <img src={provinceThumbnail} alt="Tỉnh A" />
          <h4>Tỉnh A</h4>
          <p><strong>Diện tích:</strong> 3.500 km²</p>
          <p><strong>Dân số:</strong> 1.200.000 người</p>
          <p className="desc">
            Tỉnh A nằm ở khu vực miền Tây Nam Bộ, có nền văn hóa phong phú và đặc trưng, nổi bật với các khu du lịch sinh thái và di tích lịch sử lâu đời.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-section">
          <h4>Về chúng tôi</h4>
          <p>Dự án FlagGo nhằm số hóa trải nghiệm du lịch miền Nam Việt Nam.</p>
        </div>
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: support@flaggo.vn</p>
          <p>Hotline: 0123 456 789</p>
        </div>
        <div className="footer-section">
          <h4>Bản quyền</h4>
          <p>© 2025 FlagGo. Mọi quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
