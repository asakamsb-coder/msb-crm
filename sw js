// Service Worker для MSB CRM (PWA).
//
// ВАЖНО: это НЕ полноценный офлайн-режим — сами данные (клиенты, статусы,
// суммы) всегда должны быть свежими, поэтому запросы к бэкенду
// (Google Apps Script) вообще не кэшируются, идут напрямую в сеть.
// Кэшируется только "оболочка" приложения (сам файл сайта, шрифты и
// сторонние библиотеки с CDN) — это даёт быстрый запуск и то, что
// приложение хотя бы откроется при плохом/отсутствующем интернете, а не
// покажет белый экран.

const CACHE_NAME = 'msb-crm-shell-v1';
const APP_SHELL = ['./', './index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Запросы к Apps Script (все данные CRM) — никогда не кэшируем, всегда
  // напрямую в сеть. Это самое важное правило во всём файле.
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleusercontent.com') || url.hostname.includes('drive.google.com')) {
    return;
  }

  // Сама страница — сеть в приоритете (чтобы сразу видеть новую версию
  // после обновления кода), кэш как запасной вариант при плохой связи.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Прочее (шрифты, библиотека Excel с CDN) — кэш в приоритете, сеть как запасной вариант.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
