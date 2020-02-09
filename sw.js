//window.Vue = require('vue');

self.importScripts('main.js');

// Files to cache
var cacheName = 'courseWebsite-v1';
var appShellFiles = [
  '/activities.html',
  '/admin.html',
  '/login.html',
  '/main.html',
  '/reviews.html',
  '/start.css',
  '/styles.css',
  '/basketball.jpg',
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
  '/img4.jpg',
  '/img5.jpg',
  '/img6.jpg',
  '/img7.jpg',
  '/img8.jpg',
  '/img9.jpg',
  '/img10.jpg',
  '/placeholder.png',
  '/icon.png'
];

var courseImages = [];
for (var i = 0; i < courses.length; i++) {
  courseImages.push('/' + courses[i].image + '.jpg');
}
var contentToCache = appShellFiles.concat(courseImages);

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open(cacheName).then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});