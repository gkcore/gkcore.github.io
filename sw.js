// GK Core: funciona sem internet e se atualiza sozinho (sempre tenta a versão nova primeiro)
const CACHE = 'gkcore-1.0-202611241444';
const ARQS = ['./', 'index.html', 'app.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(ARQS.map(a => c.add(a).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('/lista.json')) return; // a lista vai sempre direto na internet
  e.respondWith(fetch(e.request, {cache:'no-cache'}).then(r => {
    if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
    return r;
  }).catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match('app.html'))));
});
