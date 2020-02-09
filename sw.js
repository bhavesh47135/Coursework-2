self.importScripts('main.js');

// Files to cache
var cacheName = 'courseWebsite-v1';
var appShellFiles = [
  '/activities.html',
  '/admin.html',
  '/login.html',
  '/main.html',
  '/reviews.html',
  //'/public/*'
];
var courseImages = [];
for(var i=0; i<courses.length; i++) {
  courseImages.push('/'+courses[i].image+'.jpg');
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