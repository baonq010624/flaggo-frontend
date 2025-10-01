// src/screens/InformationPage.jsx
import React from "react";
import "../styles/InformationPage.css";
import mapImage from "../images/MapCanTho.png";

export default function InformationPage() {
  return (
    <div className="infPro-root">
      {/* HERO */}
      <header className="infPro-hero">
        <div className="infPro-wrap">
          <h1>Cần Thơ — Tổng quan sau sáp nhập</h1>
          <p className="infPro-lead">
            Trung tâm vùng Đồng bằng sông Cửu Long: quy mô không gian & dân số mở rộng,
            vai trò “cực tăng trưởng” rõ nét với thế mạnh thương mại, dịch vụ, giáo dục – y tế
            và du lịch sông nước.
          </p>

          <div className="infPro-chips">
            <span className="chip on">Cần Thơ</span>
            <span className="chip ghost">Hậu Giang</span>
            <span className="chip ghost">Sóc Trăng</span>
          </div>
        </div>
      </header>

      {/* QUICK FACTS */}
      <section className="infPro-wrap infPro-facts">
        <div className="fact">
          <span>Diện tích</span>
          <strong>6.360,83 km²</strong>
        </div>
        <div className="fact">
          <span>Đơn vị hành chính</span>
          <strong>103 (72 xã, 31 phường)</strong>
        </div>
        <div className="fact">
          <span>Dân số ước tính</span>
          <strong>~4,20 triệu</strong>
        </div>
        <div className="fact">
          <span>Vai trò vùng</span>
          <strong>Thủ phủ ĐBSCL</strong>
        </div>
      </section>

      {/* MAP */}
      <figure className="infPro-wrap infPro-figure card">
        <img src={mapImage} alt="Bản đồ hành chính tỉnh Cần Thơ (sau sáp nhập)" />
        <figcaption>Bản đồ hành chính tỉnh Cần Thơ (sau sáp nhập)</figcaption>
      </figure>

      {/* BODY */}
      <main className="infPro-wrap infPro-body card">
        <section className="infPro-sec">
          <h2 className="sec-title">Vị thế & Không gian đô thị</h2>
          <p>
            Nằm ở hạ lưu sông Cửu Long, Cần Thơ là đầu mối giao thương – dịch vụ của vùng.
            Sau sáp nhập, không gian đô thị & dân số mở rộng, tạo dư địa nâng cấp hạ tầng,
            dịch vụ chất lượng cao và thu hút đầu tư chiến lược.
          </p>
        </section>

        <section className="infPro-sec">
          <h2 className="sec-title">Điều kiện tự nhiên & Khí hậu</h2>
          <p>
            Khí hậu nhiệt đới gió mùa, nắng ấm quanh năm. Mùa khô khoảng <strong>12–4</strong>,
            mùa mưa <strong>5–11</strong>, nhiệt độ trung bình <strong>26–28°C</strong>.
            Thời điểm lý tưởng để du lịch là mùa khô và mùa trái cây.
          </p>
        </section>

        <section className="infPro-sec">
          <h2 className="sec-title">Kinh tế & Giáo dục</h2>
          <p>
            Kinh tế chuyển dịch mạnh sang dịch vụ, công nghiệp chế biến và logistics; nông nghiệp
            gắn chuỗi giá trị & chuyển đổi số. Là trung tâm giáo dục – y tế của vùng, Cần Thơ
            quy tụ nhiều trường đại học/viện nghiên cứu, cung cấp nguồn nhân lực chất lượng.
          </p>
          <ul className="tick-list">
            <li>Dịch vụ – thương mại phát triển, điểm đến hội nghị – triển lãm của ĐBSCL.</li>
            <li>Logistics kết nối đường bộ – đường thủy, hỗ trợ chuỗi cung ứng nông sản.</li>
            <li>Hệ sinh thái đại học – viện nghiên cứu thúc đẩy đổi mới sáng tạo.</li>
          </ul>
        </section>

        <section className="infPro-sec">
          <h2 className="sec-title">Văn hoá & Du lịch</h2>
          <p>
            Bản sắc sông nước là “DNA” của Cần Thơ: <em>chợ nổi Cái Răng</em>, miệt vườn, cồn,
            đình – chùa – nhà cổ, cùng ẩm thực phong phú và đờn ca tài tử. Trải nghiệm đa dạng,
            phù hợp du lịch cuối tuần lẫn nghỉ dưỡng dài ngày.
          </p>
          <ul className="tag-row">
            <li>Chợ nổi Cái Răng</li>
            <li>Nhà cổ, đình–chùa</li>
            <li>Vườn trái cây, cồn</li>
            <li>Ẩm thực miệt vườn</li>
            <li>Đờn ca tài tử</li>
          </ul>
        </section>

        <section className="infPro-sec">
          <h2 className="sec-title">Di chuyển</h2>
          <ul className="transport">
            <li>🛫 <strong>Hàng không:</strong> Sân bay quốc tế Cần Thơ, tăng dần tuyến nội địa & quốc tế.</li>
            <li>🛣️ <strong>Đường bộ:</strong> Cao tốc & quốc lộ kết nối TP.HCM và các tỉnh ĐBSCL.</li>
            <li>⛴️ <strong>Đường thủy:</strong> Mạng sông rạch – bến cảng, thuận lợi tour sông nước & vận tải.</li>
          </ul>
        </section>

        <hr className="soft" />

        <p className="closing">
          Với vai trò trung tâm vùng, Cần Thơ đang bước vào giai đoạn phát triển mới:
          hạ tầng – dịch vụ – nguồn nhân lực chất lượng cao, đi cùng bảo tồn văn hoá sông nước
          để phát triển du lịch bền vững.
        </p>
      </main>
    </div>
  );
}
