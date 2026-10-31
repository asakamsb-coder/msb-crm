// Минимальный service worker: нужен браузеру для установки на экран телефона.
// Ничего не кэширует, всегда берёт свежую версию CRM из сети.
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function() {});
