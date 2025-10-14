// src/ga.js
export const GA_MEASUREMENT_ID = 'G-W74LMHKWRB';

export function sendPageView(path) {
  if (!window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
  });
}
