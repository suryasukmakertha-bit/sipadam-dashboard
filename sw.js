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
  // PENTING: jangan ikut campur permintaan ke domain LAIN (peta zona dari
  // BIG, data dari Google Apps Script, ubin peta dari OpenStreetMap).
  // Gambar peta lintas-domain (mis. L.imageOverlay ke BIG) dimuat browser
  // dengan mode "no-cors" -- itu sebabnya bisa tampil meski BIG tidak
  // pernah mengizinkan CORS. Begitu diambil ulang di sini lewat
  // fetch(event.request), status "no-cors" itu hilang dan permintaannya
  // berubah wajib izin CORS -- BIG langsung menolak dengan "Failed to
  // fetch", dan zona di peta tidak pernah muncul. Jadi permintaan ke
  // domain lain dibiarkan lewat APA ADANYA (tidak dipanggil respondWith
  // sama sekali), seolah tidak ada service worker ini untuk request itu.
  if (new URL(event.request.url).origin !== self.location.origin) {
    return;
  }
  event.respondWith(fetch(event.request));
});
