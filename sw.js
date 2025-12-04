// Nombre de la cache
const CACHE = 'Media-PWA-V1';

// Archivos que se almacenaran en cache durante la instalacacion del SW
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    '/manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/maskable-192.png',
    './icons/maskable-192.png',
    './icons/maskable-192.png'
];


// Evento que se ejecuta cuando el SW se ejecuta por primera vez.
self.addEventListener('install', (e) => {
    self.skipWaitting();
    e.waitUntil(
        caches.open(CACHE).then(c=> c.addAll(ASSETS))
    );
});

// Evento que se ejecuta cuando el SW se activa
self.addEventListener('activate', (e) => {
    e.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        );
        // Reclama inmediatamente el control de las pestañas abiertas
        self.clients.claim();
    })());
});

// Evento que intercepta todas las peticiones de red
self.addEventListener('fetch', (e) => { 
    const req = e.request;
    e.responWith((async () => {
        const cached = await caches.match(req);
        if (cached) return cached;

        try {
            const fresh = await fetch(req);
            const cache = await caches.open(CACHE);
            if (req.method === 'GET' && fresh.status === 200) {
                cache.put(req, fresh.clone());
            }
            return fresh;
        } catch (err) {
            return cached || Response.error();
        }
    })());
});

