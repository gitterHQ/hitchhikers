const CACHE_NAME = 'github-unverse';

importScripts('/worker-cache.js');

self.addEventListener('install', function(e) {

  var work = fetch('/assets/stats').then(function(res) {
    return res.json();
  })
  .then(function(json) {
    return caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(json);
      });
  });

  e.waitUntil(work);
});
