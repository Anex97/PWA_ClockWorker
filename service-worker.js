/* ===========================================
   CLOCK WORKER - SERVICE WORKER (service-worker.js)
   Maneja caché y permite funcionamiento offline
   =========================================== */

// Versión del caché - cambiar cuando se realicen cambios
const VERSION_CACHE = 'clock-worker-v6';

// Archivos a cachear
const ARCHIVOS_A_CACHEAR = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/install.js',
    '/manifest.json',
    '/icon-192.png',
    '/toothless.png',
    '/Toothless_animated.gif'
];

/**
 * Evento: Instalación del Service Worker
 * Se ejecuta cuando el SW se registra por primera vez
 */
self.addEventListener('install', (evento) => {
    console.log('✓ Service Worker: Instalando...');
    
    evento.waitUntil(
        caches.open(VERSION_CACHE)
            .then((cache) => {
                console.log('✓ Service Worker: Cacheando archivos...');
                return cache.addAll(ARCHIVOS_A_CACHEAR);
            })
            .then(() => {
                // Forzar que el SW se active inmediatamente
                return self.skipWaiting();
            })
    );
});

/**
 * Evento: Activación del Service Worker
 * Se ejecuta cuando el SW se activa (reemplazando versiones anteriores)
 */
self.addEventListener('activate', (evento) => {
    console.log('✓ Service Worker: Activando...');
    
    evento.waitUntil(
        caches.keys().then((nombresCache) => {
            return Promise.all(
                nombresCache.map((nombreCache) => {
                    // Eliminar cachés antiguos
                    if (nombreCache !== VERSION_CACHE) {
                        console.log('✓ Service Worker: Eliminando caché antigua -', nombreCache);
                        return caches.delete(nombreCache);
                    }
                })
            );
        }).then(() => {
            // Controlar todos los clientes inmediatamente
            return self.clients.claim();
        })
    );
});

/**
 * Evento: Intercepción de requests (fetch)
 * Implementa estrategia inteligente según el tipo de archivo
 */
self.addEventListener('fetch', (evento) => {
    const url = evento.request.url;
    
    // Solo interceptar GET requests
    if (evento.request.method !== 'GET') {
        return;
    }
    
    // Para JavaScript (crítico que siempre funcione)
    if (url.includes('.js')) {
        evento.respondWith(
            fetch(evento.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        // Clonar y guardar en caché
                        const responseClone = response.clone();
                        caches.open(VERSION_CACHE).then((cache) => {
                            cache.put(evento.request, responseClone);
                        });
                        return response;
                    }
                    return response;
                })
                .catch(() => {
                    // Si falla la red, usar caché
                    return caches.match(evento.request);
                })
        );
        return;
    }
    
    // Para HTML (también Network First)
    if (url.includes('.html') || url.endsWith('/')) {
        evento.respondWith(
            fetch(evento.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(VERSION_CACHE).then((cache) => {
                            cache.put(evento.request, responseClone);
                        });
                        return response;
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(evento.request);
                })
        );
        return;
    }
    
    // Para otros archivos (CSS, imágenes, GIF) - Cache First
    evento.respondWith(
        caches.match(evento.request)
            .then((respuesta) => {
                if (respuesta) {
                    return respuesta;
                }
                
                return fetch(evento.request)
                    .then((respuestaRed) => {
                        if (!respuestaRed || respuestaRed.status !== 200 || respuestaRed.type === 'error') {
                            return respuestaRed;
                        }
                        
                        const respuestaClonada = respuestaRed.clone();
                        caches.open(VERSION_CACHE).then((cache) => {
                            cache.put(evento.request, respuestaClonada);
                        });
                        
                        return respuestaRed;
                    })
                    .catch(() => {
                        return new Response('Sin conexión', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

/**
 * Evento: Mensajes desde el cliente
 * Permite comunicación entre la página y el Service Worker
 */
self.addEventListener('message', (evento) => {
    console.log('✓ Service Worker recibió mensaje:', evento.data);
    
    // Responder al cliente
    evento.ports[0].postMessage({
        tipo: 'respuesta',
        contenido: 'Service Worker está activo y escuchando'
    });
});

console.log('✓ Service Worker cargado correctamente');
