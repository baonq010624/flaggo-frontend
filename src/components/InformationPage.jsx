import React, { useState } from "react";
import "../styles/InformationPage.css";
import mapImage from "../images/MapCanTho.png";
import cultureImage from "../images/DiTich2.jpg";
import BanhTrangTH from "../images/BanhTrangTH.png";
import ChuaOng from "../images/ChuaOng.png";
import BenNK from "../images/BenNK.png";
import VuonBL from "../images/VuonBL.png";

const InformationPage = () => {
  const [activeTab, setActiveTab] = useState("lehoi");
  const [, setTransitioning] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTransitioning(false);
    }, 300); // thời gian trùng với CSS transition
  };

  return (
    <div className="information-page">
      <div className="province-header">
        <h1 className="province-title">Tỉnh Cần Thơ</h1>
        <div className="old-province-buttons">
          <button className="active">Cần Thơ</button>
          <button>Hậu Giang</button>
          <button>Sóc Trăng</button>
        </div>
        <hr className="province-divider" />
        <div className="overview-section">
          <div className="overview-text">
            <div className="info-box">
              <h3>Diện tích</h3>
              <p>
                <strong>6.360,83 km²</strong>
              </p>
              <p>
                Đơn vị hành chính: 103 đơn vị (72 xã và 31 phường). Cần Thơ nằm
                ở vùng hạ lưu của sông Cửu Long và ở vị trí trung tâm đồng bằng
                sông Cửu Long, là thành phố nằm trong vùng kinh tế trọng điểm
                vùng đồng bằng sông Cửu Long.
              </p>
            </div>
            <div className="info-box">
              <h3>Dân số</h3>
              <p>
                <strong>4.199.824 người</strong>
              </p>
              <p>
                Sau khi sáp nhập, dân số thành phố Cần Thơ vào khoảng hơn 1.3
                triệu người. Đây là trung tâm kinh tế, văn hoá và giáo dục của
                vùng Đồng bằng sông Cửu Long, với dân số đa số tập trung tại các
                quận nội thành như Ninh Kiều, Cái Răng và Bình Thủy.
              </p>
            </div>
          </div>
          <div className="overview-map">
            <img src={mapImage} alt="Bản đồ Cần Thơ" />
          </div>
        </div>
      </div>

      {/* PHẦN VĂN HÓA */}
      <div className="culture-card">
        <h2 className="culture-title">Lễ hội - Ẩm thực</h2>
        <div className="culture-tabs">
          <button
            className={`tab ${activeTab === "lehoi" ? "active" : ""}`}
            onClick={() => handleTabChange("lehoi")}
          >
            Lễ hội
          </button>
          <button
            className={`tab ${activeTab === "amthuc" ? "active" : ""}`}
            onClick={() => handleTabChange("amthuc")}
          >
            Ẩm thực
          </button>
        </div>

        <div className="culture-tab-wrapper">
          <div
            className={`culture-tab-content ${
              activeTab === "lehoi" ? "active" : ""
            }`}
          >
            <div className="culture-body-horizontal">
              <div className="culture-text">
                <p>
                  Cần Thơ, bắt nguồn từ tên gọi “Cầm Thi Giang” (Sông của thi và
                  nhạc), là vùng đất đậm chất văn hóa sông nước. Mạng lưới kênh
                  rạch chằng chịt không chỉ là đặc điểm tự nhiên mà còn tạo nên
                  kiến trúc đô thị đặc sắc, như những “tuyến phố” gắn liền với
                  đời sống cư dân miền Tây.
                </p>
                <p>
                  Thành phố mang vẻ đẹp bình dị, thơ mộng với làng xóm trù phú,
                  dân cư đông đúc dưới bóng dừa. Cần Thơ còn là nơi chung sống
                  của người Việt, người Hoa và người Khmer, tạo nên một nền văn
                  hóa phong phú, đa dạng và giàu bản sắc lễ hội vùng đồng bằng
                  sông Cửu Long.
                </p>
                <div className="see-more">
                  <a href="/FlagGo#/festival">Xem thêm →</a>
                </div>
              </div>
              <div className="culture-image">
                <img src={cultureImage} alt="Ảnh lễ hội" />
              </div>
            </div>
          </div>

          <div
            className={`culture-tab-content ${
              activeTab === "amthuc" ? "active" : ""
            }`}
          >
            <div className="culture-body-horizontal">
              <div className="culture-text">
                <p>
                  Ẩm thực Cần Thơ là sự giao thoa tinh tế giữa các nền văn hóa
                  Việt, Hoa và Khmer. Từ các món ăn dân dã đến đặc sản phong phú
                  như bánh xèo, lẩu mắm hay cá linh kho mía – tất cả đều phản
                  ánh tinh thần hào sảng và mến khách của người miền Tây.
                </p>
                <p>
                  Với nguồn nguyên liệu tươi ngon từ hệ thống sông ngòi phong
                  phú, ẩm thực nơi đây vừa đậm đà, vừa dân dã, khiến du khách
                  không thể quên mỗi lần ghé thăm.
                </p>
                <div className="see-more">
                  <a href="/cuisine">Xem thêm →</a>
                </div>
              </div>
              <div className="culture-image">
                <img src={cultureImage} alt="Ẩm thực placeholder" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DI TÍCH */}
      <div className="heritage-card">
        <h2 className="heritage-title">Di tích - Thắng cảnh</h2>
        <div className="heritage-grid">
          <div
            className="heritage-item"
            style={{ backgroundImage: `url(${BanhTrangTH})` }}
          >
            <span>Làng bánh tráng Thuận Hưng</span>
          </div>
          <div
            className="heritage-item"
            style={{ backgroundImage: `url(${ChuaOng})` }}
          >
            <span>Chùa Ông (Quảng Triệu Hội quán)</span>
          </div>
          <div
            className="heritage-item"
            style={{ backgroundImage: `url(${BenNK})` }}
          >
            <span>Bến Ninh Kiều</span>
          </div>
          <div
            className="heritage-item"
            style={{ backgroundImage: `url(${VuonBL})` }}
          >
            <span>Vườn cỏ Bằng Lăng</span>
          </div>
        </div>
        <div className="heritage-more">
          <a href="/FlagGo#/heritage">Xem thêm →</a>
        </div>
      </div>
    </div>
  );
};

export default InformationPage;
