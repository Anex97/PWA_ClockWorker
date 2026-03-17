# 📚 GUÍA DE CONCEPTOS - PWA y Service Workers

## ¿QUÉ ES UNA PWA?

**Progressive Web Application (Aplicación Web Progresiva)**

Una PWA es una aplicación web que funciona como una app nativa en dispositivos móviles y escritorio.

### Características principales:
1. **Responsiva** - Se adapta a cualquier tamaño de pantalla
2. **Funcionamiento offline** - Usa Service Workers para caché
3. **Instalable** - Se instala como app en el dispositivo
4. **Segura** - Funciona bajo HTTPS
5. **Rápida** - Carga rápido gracias al caché
6. **Actualizable** - Se actualiza automáticamente

---

## COMPONENTES DE UNA PWA

### 1. **HTML5 Semántico**
```html
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icon.png">
<meta name="theme-color" content="#00a8e8">
```
- Conecta la PWA con su manifiesto
- Define iconos y colores de tema

### 2. **CSS3 Responsivo**
```css
@media (max-width: 768px) {
    /* Estilos para móviles */
}
```
- Media queries para adaptarse a dispositivos
- Animaciones y efectos visuales

### 3. **JavaScript Moderno**
```javascript
setInterval(actualizarReloj, 1000);
navigator.serviceWorker.register('sw.js');
```
- Lógica de la aplicación
- Registro del Service Worker

### 4. **Service Worker**
- Archivo separado (.js)
- Intercepta requests
- Maneja caché
- Permite offline

### 5. **Manifest (JSON)**
```json
{
  "name": "Nombre de la app",
  "start_url": "/",
  "icons": [{...}],
  "theme_color": "#00a8e8"
}
```
- Configuración de instalación
- Define nombre, icono, colores

---

## SERVICE WORKER (Trabajador de Servicio)

### ¿Qué es?
Un script que corre en background del navegador, separado de la página.

### Ventajas:
- ✅ Funciona sin conexión
- ✅ Cachea recursos automáticamente
- ✅ Intercepta requests
- ✅ Actualización en background
- ✅ Push notifications (avanzado)

### Ciclo de vida:
```
1. Registro → .register('sw.js')
   ↓
2. Instalación (install event)
   ↓
3. Activación (activate event)
   ↓
4. Estado activo (fetch event)
```

### Eventos principales:
```javascript
// Instalación
self.addEventListener('install', (evento) => {
    // Cachear archivos
});

// Activación
self.addEventListener('activate', (evento) => {
    // Limpiar cachés antiguos
});

// Intercepción de requests
self.addEventListener('fetch', (evento) => {
    // Estrategia: Caché o red
});
```

---

## ESTRATEGIAS DE CACHÉ

### 1. **Cache First, Network Fallback** (Usada en este proyecto)
```
Usuario solicita → ¿Está en caché? 
    ├─ Sí → Devolver desde caché
    └─ No → Obtener de la red → Cachear
```
- Rápido (desde caché)
- Funciona offline
- Contenido menos actualizado

### 2. **Network First, Cache Fallback**
```
Usuario solicita → ¿Hay conexión?
    ├─ Sí → Obtener de red (y cachear)
    └─ No → Devolver desde caché
```
- Contenido más actualizado
- Falla offline para nuevos recursos

### 3. **Cache Only**
- Solo usa caché
- Ideal para assets estáticas (imágenes, CSS)

### 4. **Network Only**
- Siempre obtiene de la red
- Sin caché
- Ideal para datos dinámicos

---

## MANIFEST.JSON - Explicado

```json
{
  "name": "Clock Worker - Reloj en Tiempo Real",    // Nombre completo
  "short_name": "Clock Worker",                     // Nombre corto (app)
  "description": "...",                             // Descripción
  "start_url": "/",                                 // URL inicial
  "scope": "/",                                     // Espacio de aplicación
  "display": "standalone",                          // Pantalla completa (sin barra)
  "background_color": "#001a33",                    // Color fondo instalación
  "theme_color": "#00a8e8",                         // Color tema
  "orientation": "portrait",                        // Vertical
  
  "icons": [                                        // Iconos en diferentes tamaños
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

### Valores de `display`:
- `standalone` - App sin barra de navegación
- `fullscreen` - Pantalla completa
- `minimal-ui` - Mínima interfaz
- `browser` - Como sitio web normal

### Valores de `orientation`:
- `portrait` - Vertical (comúnmente para móviles)
- `landscape` - Horizontal
- `portrait-primary` - Vertical fija
- `any` - Permite rotación automática

---

## ACTUALIZAR LA HORA CADA SEGUNDO

### Conceptos clave:

#### 1. **Objeto Date**
```javascript
const ahora = new Date();
const horas = ahora.getHours();      // 0-23
const minutos = ahora.getMinutes();  // 0-59
const segundos = ahora.getSeconds(); // 0-59
```

#### 2. **Formato con padStart()**
```javascript
String(9).padStart(2, '0')  // "09"
String(15).padStart(2, '0') // "15"
```
- Agrega ceros a la izquierda si es necesario
- Importante para que el reloj se vea: 09:05:03

#### 3. **setInterval()**
```javascript
setInterval(actualizarReloj, 1000);
// Ejecuta función cada 1000ms (1 segundo)
```

#### 4. **Actualización del DOM**
```javascript
document.getElementById('clock').textContent = '15:30:45';
// Actualiza el texto en pantalla
```

### En este proyecto:
```javascript
function actualizarReloj() {
    const horaActual = obtenerHoraActual();
    document.getElementById('clock').textContent = horaActual;
}

setInterval(actualizarReloj, 1000);  // Cada segundo
```

---

## FUNCIONAMIENTO OFFLINE CON SERVICE WORKER

### ¿Qué sucede sin conexión?

1. **Usuario abre la app** → Service Worker controla
2. **Usuario hace request** → SW verifica caché
3. **Recurso en caché** → Lo devuelve inmediatamente
4. **Recurso NO en caché** → Muestra error o fallback

### En este proyecto:
```javascript
self.addEventListener('fetch', (evento) => {
    evento.respondWith(
        caches.match(evento.request)
            .then((respuesta) => {
                return respuesta || fetch(evento.request);
            })
            .catch(() => {
                return new Response('Sin conexión');
            })
    );
});
```

---

## CICLO DE ACTUALIZACIÓN DE LA PWA

```
Primer acceso:
├─ Descarga HTML, CSS, JS
├─ Registra Service Worker
├─ Service Worker instala
├─ Cachea todos los archivos
└─ ✓ App lista

Siguiente acceso:
├─ Service Worker controla
├─ Sirve desde caché
├─ Intenta obtener nuevas versiones
└─ Si hay cambios, actualiza

Sin conexión:
├─ Service Worker controla
├─ Sirve desde caché
└─ ✓ App funciona normalmente
```

---

## VERSIONADO DEL CACHÉ

```javascript
const VERSION_CACHE = 'clock-worker-v1';

// Si cambias código, cambia versión:
// const VERSION_CACHE = 'clock-worker-v2';

// El Service Worker elimina versiones antiguas
// con la función en el evento 'activate'
```

**¿Por qué es importante?**
- Cuando cambias código, necesitas versión nueva
- El Service Worker detecta cambios
- Elimina caché antiguo automáticamente
- Usuarios obtienen versión actualizada

---

## RESPONSIVIDAD - Media Queries

```css
/* Pantallas grandes */
@media (min-width: 1024px) {
    .reloj { font-size: 5em; }
}

/* Tablets */
@media (max-width: 768px) {
    .reloj { font-size: 3em; }
}

/* Móviles */
@media (max-width: 480px) {
    .reloj { font-size: 2em; }
}

/* Orientación específica */
@media (orientation: portrait) {
    body { min-height: 100vh; }
}
```

---

## DEBUGGING - Cómo Solucionar Problemas

### Abre la consola: F12

### Service Worker:
```javascript
chrome://serviceworkers/  // Ver estado
chrome://cache-storage/   // Ver caché
```

### Verifica en console:
```javascript
// Listar todos los cachés
caches.keys().then(keys => console.log(keys));

// Ver qué hay en un caché
caches.open('clock-worker-v1').then(cache => 
    cache.keys().then(keys => console.log(keys))
);
```

### Errores comunes:
- ❌ SW solo funciona en HTTPS o localhost
- ❌ Archivo service-worker.js con errors
- ❌ Manifest.json con JSON inválido
- ❌ Rutas incorrectas en archivos

---

## PRUEBAS LOCALES

### Con Python:
```bash
python -m http.server 8000
# http://localhost:8000
```

### Con Node.js:
```bash
npm install -g http-server
http-server
# http://localhost:8080
```

### Desactivar caché (desarrollo):
```
F12 → Network → ☑ Disable cache while DevTools is open
```

---

## REFERENCIA RÁPIDA - Archivos de Este Proyecto

| Archivo | Líneas | Propósito |
|---------|--------|----------|
| index.html | ~45 | Estructura HTML |
| styles.css | ~180 | Estilos y responsive |
| app.js | ~60 | Lógica de actualización |
| service-worker.js | ~140 | Caché y offline |
| manifest.json | ~35 | Configuración PWA |
| icon-192.png | 1 | Icono de app |

---

## CONCEPTOS CLAVE A RECORDAR

### ✅ Debe estar bien:
1. Service Worker **registrado** en HTML
2. Manifest **referenciado** en HTML
3. Todos los archivos **cacheados** en el SW
4. Rutas **correctas** en referencias
5. JSON **válido** en manifest.json
6. Nombres de variables **descriptivos**
7. Código **comentado** y **organizado**

### ❌ Errores comunes:
1. Rutas relativas incorrectas
2. Service Worker con sintaxis errors
3. Manifest JSON mal formado
4. Archivo manifest.json sin enlace en HTML
5. Caché versioning sin actualizar
6. HTTPS no configurado en producción

---

## RECURSOS

- [MDN Service Workers](https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
- [Can I Use](https://caniuse.com/) - Compatibilidad de navegadores
- [JSON Formatter](https://jsonformatter.org/) - Validar JSON
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Última actualización: Marzo 2026**

