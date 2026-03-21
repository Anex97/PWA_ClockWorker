/**
 * SCRIPT DE DIAGNÓSTICO PWA
 * Verifica si la PWA cumple todos los requisitos para ser instalable
 */

console.log('=================================');
console.log('DIAGNÓSTICO PWA - CLOCK WORKER');
console.log('=================================\n');

// 1. Verificar HTTPS
console.log('1. HTTPS:');
if (window.location.protocol === 'https:') {
    console.log('   ✓ HTTPS habilitado');
} else {
    console.warn('   ✗ NO HTTPS - Esto previene instalación en Android');
    console.warn('   En localhost está OK, pero en producción debe ser HTTPS');
}

// 2. Verificar Service Worker
console.log('\n2. SERVICE WORKER:');
if ('serviceWorker' in navigator) {
    console.log('   ✓ Service Worker soportado');
    navigator.serviceWorker.getRegistrations().then(regs => {
        if (regs.length === 0) {
            console.warn('   ✗ Ningún Service Worker registrado AÚN');
            console.log('   Esperando a que se registre...');
        } else {
            console.log('   ✓ ' + regs.length + ' Service Worker(s) registrado(s)');
            regs.forEach((reg, i) => {
                console.log('     SW #' + (i+1) + ': ' + reg.scope);
            });
        }
    });
} else {
    console.error('   ✗ Service Worker NO soportado');
}

// 3. Verificar Manifest
console.log('\n3. MANIFEST JSON:');
const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) {
    console.log('   ✓ Manifest encontrado: ' + manifestLink.href);
    // Intentar obtenerlo
    fetch(manifestLink.href)
        .then(r => r.json())
        .then(manifest => {
            console.log('   ✓ Manifest cargado correctamente');
            console.log('     - name: ' + manifest.name);
            console.log('     - short_name: ' + manifest.short_name);
            console.log('     - display: ' + manifest.display);
            console.log('     - start_url: ' + manifest.start_url);
            if (manifest.icons && manifest.icons.length > 0) {
                console.log('     - icons: ' + manifest.icons.length);
            } else {
                console.warn('     ✗ SIN ICONOS EN MANIFEST');
            }
        })
        .catch(e => {
            console.error('   ✗ ERROR cargando manifest: ' + e.message);
        });
} else {
    console.error('   ✗ NO hay link a manifest.json en HTML');
}

// 4. Verificar iconos
console.log('\n4. ICONOS:');
const appIconLink = document.querySelector('link[rel="icon"]');
if (appIconLink) {
    console.log('   ✓ ícono encontrado: ' + appIconLink.href);
    const img = new Image();
    img.onload = () => console.log('   ✓ Icono cargando correctamente');
    img.onerror = () => console.error('   ✗ Error cargando icono');
    img.src = appIconLink.href;
} else {
    console.error('   ✗ NO hay icono en HTML');
}

// 5. Verificar beforeinstallprompt
console.log('\n5. BEFOREINSTALLPROMPT:');
let beforeInstallPromptFired = false;
window.addEventListener('beforeinstallprompt', (e) => {
    beforeInstallPromptFired = true;
    console.log('   ✓✓✓ beforeinstallprompt DISPARADO');
    console.log('   La PWA ES instalable');
});

setTimeout(() => {
    if (!beforeInstallPromptFired) {
        console.warn('   ✗ beforeinstallprompt NO se disparó');
        console.warn('   Posibles razones:');
        console.warn('   1. La PWA NO cumple requisitos mínimos');
        console.warn('   2. Manifest.json inaccesible o mal formado');
        console.warn('   3. Service Worker no registrado');
        console.warn('   4. Falta HTTPS en producción');
        console.warn('   5. Icono no encontrado');
    }
}, 3000);

// 6. Verificar Metadata
console.log('\n6. METADATA:');
const viewport = document.querySelector('meta[name="viewport"]');
if (viewport) {
    console.log('   ✓ Viewport meta tag: ' + viewport.content);
} else {
    console.warn('   ✗ Falta viewport meta tag');
}

const themeColor = document.querySelector('meta[name="theme-color"]');
if (themeColor) {
    console.log('   ✓ Theme color: ' + themeColor.content);
} else {
    console.warn('   ✗ Falta theme-color meta tag');
}

// 7. Verificar Display mode
console.log('\n7. DISPLAY MODE:');
if ('display' in navigator) {
    console.log('   ✓ navigator.standalone: ' + navigator.standalone);
    console.log('   ✓ display-mode: ' + window.matchMedia('(display-mode: standalone)').matches);
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('   ✓✓✓ LA APP ESTÁ INSTALADA Y CORRIENDO COMO PWA');
    }
}

// 8. Verificar ReadyState
console.log('\n8. DOM READY STATE:');
console.log('   readyState: ' + document.readyState);

// 9. Verificar recursos
console.log('\n9. RECURSOS:');
const scripts = document.querySelectorAll('script[src]');
console.log('   Scripts cargados: ' + scripts.length);
scripts.forEach(s => {
    const status = s.complete ? '✓' : '⏳';
    console.log('   ' + status + ' ' + s.src);
});

const links = document.querySelectorAll('link[href]');
console.log('   Links: ' + links.length);

// Resumen
console.log('\n=================================');
console.log('RESUMEN DE REQUISITOS PWA');
console.log('=================================');
console.log('Para que beforeinstallprompt funcione:');
console.log('✓ HTTPS (OK en localhost y GitHub Pages)');
console.log('✓ Manifest.json válido (verificar arriba)');
console.log('✓ Service Worker registrado (verificar arriba)');
console.log('✓ Icono 192x192 en manifest (verificar arriba)');
console.log('✓ display: standalone en manifest');
console.log('✓ start_url en manifest');
console.log('\nSi NO ves "beforeinstallprompt DISPARADO" arriba,');
console.log('revisa los errores marcados con ✗');

console.log('\n=================================\n');
