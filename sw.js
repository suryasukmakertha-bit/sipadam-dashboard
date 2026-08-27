// Service worker minimal untuk SIPADAM Dashboard.
// Tujuannya HANYA supaya browser mengenali halaman ini sebagai PWA yang
// bisa "diinstall" (syarat wajib dari Chrome/Edge, dan syarat teknis kalau
// nanti dibungkus jadi APK lewat Bubblewrap).
//
// SENGAJA tidak melakukan caching data — dashboard ini butuh data selalu
// terbaru dari Google Apps Script, jadi setiap permintaan tetap diteruskan
// langsung ke jaringan seperti biasa (bukan offline-first).

const CACHE_NAME = 'sipadam-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through murni: semua request tetap diambil langsung dari jaringan.
// Ini memastikan dashboard selalu menampilkan versi terbaru, tidak pernah
// "nyangkut" di versi lama karena cache.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
