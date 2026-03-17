# Clock Worker - PWA ⏰

## Descripción del Proyecto

**Clock Worker** es una Progressive Web Application (PWA) que muestra la hora actual del sistema en tiempo real. La aplicación se actualiza automáticamente cada segundo sin necesidad de intervención del usuario.

Esta PWA ha sido desarrollada como parte de un proyecto educativo para demostrar los conceptos fundamentales de las Progressive Web Applications, incluyendo:
- Actualización de datos en tiempo real
- Service Workers para funcionalidad offline
- Manifiesto de aplicación para instalación en dispositivos
- Diseño responsivo adaptado a dispositivos móviles

---

## Características

✅ **Reloj en Tiempo Real** - Muestra horas, minutos y segundos actualizando cada segundo
✅ **Service Worker** - Permite que la aplicación funcione sin conexión a internet
✅ **Instalable** - Se puede instalar en dispositivos móviles como una aplicación nativa
✅ **Responsive** - Interfaz adaptada para pantallas de cualquier tamaño
✅ **Orientación Portrait** - Optimizada para dispositivos en modo vertical
✅ **Tema Visual** - Diseño moderno con colores azul oscuro y azul claro
✅ **Fecha Actual** - Muestra la fecha completa en formato legible

---

## Estructura del Proyecto

```
PWA_ClockWorker/
├── index.html              # Archivo HTML principal
├── styles.css              # Estilos y diseño de la aplicación
├── app.js                  # Lógica de la aplicación (actualización de hora)
├── service-worker.js       # Service Worker (soporte offline)
├── manifest.json           # Manifiesto de la PWA
├── icon-192.png           # Icono de la aplicación (192x192px)
├── README.md              # Este archivo
└── .git/                  # Control de versiones

```

---

## Archivos Incluidos

### 1. **index.html**
Archivo HTML principal que estructura la página. Incluye:
- Referencias a estilos CSS y JavaScript
- Enlace al archivo manifest.json
- Enlace al icono de la aplicación
- Registro del Service Worker
- Contenedor para mostrar la hora y fecha

### 2. **styles.css**
Hoja de estilos que define:
- Fondo degradado azul oscuro (#001a33 a #004d7a)
- Reloj digital con efecto de brillo (glow)
- Diseño responsivo para dispositivos móviles
- Media queries para diferentes tamaños de pantalla
- Animaciones y efectos visuales

### 3. **app.js**
Script principal que implementa:
- Función `obtenerHoraActual()` - Obtiene hora formateada (HH:MM:SS)
- Función `obtenerFechaActual()` - Obtiene fecha en formato legible
- Función `actualizarReloj()` - Actualiza los elementos del DOM
- `setInterval()` - Actualiza la hora cada 1000ms (1 segundo)
- Manejo de eventos DOMContentLoaded

### 4. **service-worker.js**
Service Worker que proporciona:
- Instalación y cacheo de archivos estáticos
- Estrategia "Cache First, Network Fallback"
- Activación del SW y limpieza de cachés antiguos
- Intercepción de requests (fetch)
- Comunicación entre página y SW mediante mensajes
- Funcionalidad offline

### 5. **manifest.json**
Archivo de configuración que especifica:
- **name**: "Clock Worker - Reloj en Tiempo Real"
- **short_name**: "Clock Worker"
- **start_url**: "/" (página de inicio)
- **display**: "standalone" (modo pantalla completa)
- **background_color**: "#001a33" (azul oscuro)
- **theme_color**: "#00a8e8" (azul claro)
- **orientation**: "portrait" (vertical)
- **icons**: Especificación del icono de 192x192
- **Categorías**: utilities (herramienta)

### 6. **icon-192.png**
Icono de la aplicación de 192x192 píxeles:
- Diseño de reloj analógico
- Colores azul oscuro de fondo
- Icono azul claro (#00a8e8) con marcas de horas

---

## Instalación y Uso

### Opción 1: Localmente en tu computadora

1. **Descargar los archivos**
   ```bash
   git clone https://github.com/[tuusuario]/PWA_ClockWorker.git
   cd PWA_ClockWorker
   ```

2. **Servir los archivos localmente** (necesitas un servidor local)
   - Con Python 3:
     ```bash
     python -m http.server 8000
     ```
   - Con Node.js (http-server):
     ```bash
     npm install -g http-server
     http-server
     ```

3. **Acceder en el navegador**
   - Ir a `http://localhost:8000`
   - La PWA se registrará automáticamente

### Opción 2: Instalar como aplicación

**En dispositivos móviles:**
1. Abre el navegador Chrome, Edge o Firefox
2. Navega a la URL donde está alojada la PWA
3. Toca el botón "Instalar" (o acepta el prompt)
4. La aplicación se añadirá a tu pantalla de inicio

**En navegadores de escritorio:**
1. Abre la PWA en Chrome, Edge o navegador basado en Chromium
2. Haz clic en el ícono de instalar (generalmente arriba a la derecha)
3. Selecciona "Instalar Clock Worker"

---

## Componentes Clave de una PWA

### Service Worker
- Archivo: `service-worker.js`
- Propósito: Interceptar requests, cachear recursos y permitir funcionamiento offline
- Características: Cache versioning, actualizaciones automáticas

### Manifest
- Archivo: `manifest.json`
- Propósito: Define cómo se instala y se ve la app en el dispositivo
- Configuración: Nombre, icono, colores, orientación

### HTTPS
- Requerido para PWAs en producción
- Los Service Workers solo funcionan en HTTPS o localhost

---

## Explicación Técnica

### Actualización de la Hora

```javascript
setInterval(actualizarReloj, 1000); // Cada 1 segundo
```

- La función `actualizarReloj()` se ejecuta cada segundo
- Obtiene la fecha/hora actual con `new Date()`
- Formatea la hora como HH:MM:SS
- Actualiza el DOM con el nuevo valor

### Service Worker - Estrategia Cache First

1. **Usuario solicita recurso**
2. **SW verifica si está en caché**
   - ✓ Sí → Devuelve desde caché
   - ✗ No → Intenta obtener de la red
3. **Si conexión disponible**
   - Obtiene del servidor
   - Almacena en caché
   - Devuelve al usuario
4. **Si no hay conexión**
   - Devuelve desde caché o error

### Responsividad

El CSS incluye media queries para:
- **Pantallas grandes** (>768px): Reloj de 4em
- **Dispositivos móviles** (480-768px): Reloj de 3em
- **Pantallas pequeñas** (<480px): Reloj de 2.5em

---

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo y animaciones
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Web APIs:**
  - Service Worker API
  - Fetch API
  - Cache API
  - Web App Manifest

---

## Navegadores Compatibles

| Navegador | Soporte PWA | Service Worker |
|-----------|------------|-----------------|
| Chrome 40+ | ✓ | ✓ |
| Firefox 44+ | ✓ | ✓ |
| Edge 17+ | ✓ | ✓ |
| Safari 11.1+ | Parcial | ✓ |
| Samsung Internet | ✓ | ✓ |

---

## Notas de Desarrollo

### Nombres Claros de Variables y Funciones
```javascript
obtenerHoraActual()      // Claro: obtiene la hora actual
actualizarReloj()        // Claro: actualiza el reloj
elementoReloj            // Claro: referencia al elemento DOM
VERSION_CACHE            // Claro: versión del caché
```

### Comentarios Explicativos
Todos los archivos incluyen comentarios que explican:
- Bloques principales de código
- Funciones y su propósito
- Event listeners importantes
- Configuraciones de la PWA

### Organización del Código
```
1. Imports y constantes
2. Funciones de utilidad
3. Event listeners
4. Inicialización
5. Lógica principal
```

---

## Solución de Problemas

### Service Worker no se registra
- Verifica que estés usando HTTPS o localhost
- Consola del navegador (F12) mostrará errores
- Limpia el caché del navegador

### PWA no se instala
- El manifest.json debe ser válido (usa JSON Formatter)
- El icono debe existir en la ruta correcta
- Necesitas HTTPS en producción

### Hora no se actualiza
- Verifica que app.js esté cargado (F12 → Console)
- Comprueba que el elemento #clock exista en el HTML
- Revisa la consola para errores JavaScript

---

## Futuras Mejoras

- [ ] Agregar zona horaria seleccionable
- [ ] Modo oscuro/claro toggle
- [ ] Alarma/Temporizador
- [ ] Múltiples zonas horarias
- [ ] Sincronización con hora de servidor
- [ ] Idiomas adicionales

---

## Estructura Recomendada para GitHub

```
PWA_ClockWorker/
├── README.md              (Este archivo)
├── index.html            (HTML principal)
├── styles.css            (Estilos)
├── app.js                (Lógica)
├── service-worker.js     (Service Worker)
├── manifest.json         (Manifiesto)
├── icon-192.png         (Icono)
└── .gitignore           (Archivos a ignorar)
```

---

## Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

## Autor

Desarrollado como proyecto educativo para demostrar los conceptos de Progressive Web Applications.

---

## Referencias

- [MDN - Progressive Web Apps](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
- [Google Developers - Web.dev PWA](https://web.dev/progressive-web-apps/)
- [W3C - Web App Manifest](https://www.w3.org/TR/appmanifest/)
- [W3C - Service Workers](https://www.w3.org/TR/service-workers/)

---

**Última actualización:** Marzo 2026

