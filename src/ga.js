// src/ga.js
// Safe wrapper để gọi GA4 mà không lỗi nếu gtag chưa sẵn sàng
export function gtagSafe(event, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

// ————— Các hàm track cụ thể —————
export function trackViewHeritageDetail({ heritage_id, heritage_name }) {
  gtagSafe("view_heritage_detail", { heritage_id, heritage_name });
}

export function trackFavorite({ heritage_id, heritage_name, saved }) {
  gtagSafe("click_favorite", {
    heritage_id,
    heritage_name,
    saved: !!saved, // true = đã lưu; false = bỏ lưu
  });
}

export function trackRegisterSuccess({ user_email }) {
  gtagSafe("register_success", {
    user_email,
  });
}

export function trackClickBookTour({ tour_id, tour_name }) {
  gtagSafe("click_book_tour", { tour_id, tour_name });
}

export function trackOpenPersonalizePage() {
  gtagSafe("open_personalize_page");
}
