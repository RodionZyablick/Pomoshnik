const C='ep-3',F=['index.html','style.css','app.js','offline.js','manifest.json','icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>{if(!e.request.url.startsWith(self.location.origin))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
