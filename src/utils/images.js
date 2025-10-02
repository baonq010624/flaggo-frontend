// src/utils/images.js
// Tự động import mọi ảnh trong src/images bằng webpack's require.context (CRA hỗ trợ)

function buildImagesMap() {
  // chỉ duyệt 1 cấp (không đệ quy). Nếu bạn có thư mục con → đổi tham số thứ 2 thành true
  const ctx = require.context("../images", false, /\.(png|jpe?g|gif|webp|svg)$/i);
  const map = {};
  ctx.keys().forEach((key) => {
    // key dạng "./ChoNoi.jpg" → lấy "ChoNoi.jpg"
    const filename = key.replace(/^.\//, "");
    map[filename] = ctx(key); // với CRA, đây là URL đã được xử lý
  });
  return map;
}

const IMAGES_MAP = buildImagesMap();

// Trả về URL ảnh theo tên file trong JSON; nếu không có thì trả về fallback
export function resolveImageByName(name, fallbackUrl) {
  if (!name) return fallbackUrl;
  const hit = IMAGES_MAP[name];
  return hit || fallbackUrl;
}
