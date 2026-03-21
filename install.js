/* ===========================================
   CLOCK WORKER - MANEJADOR DE INSTALACIÓN (install.js)
   Gestiona la instalación de la PWA en dispositivos
   =========================================== */

// Variable para almacenar el evento de instalación
let deferredPrompt;
const installButton = document.getElementById('install-button');
const statusMessage = document.getElementById('status-message');

// Detectar si estamos en ambiente móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * Evento: beforeinstallprompt
 * Se dispara cuando la PWA es instalable (principalmente en móviles)
 */
window.addEventListener('beforeinstallprompt', (evento) => {
    console.log('✓ PWA es instalable (evento beforeinstallprompt detected)');
    
    // Prevenir que se muestre el prompt automático
    evento.preventDefault();
    
    // Guardar el evento para usarlo después
    deferredPrompt = evento;
    
    // Mostrar estado
    if (statusMessage) {
        statusMessage.textContent = '✓ La app puede instalarse en tu dispositivo';
    }
    
    if (installButton) {
        installButton.classList.add('pulse');
        installButton.setAttribute('data-installable', 'true');
    }
    
    console.log('✓ Botón de instalación listo');
});

/**
 * Event listener: Click en el botón de instalación
 */
if (installButton) {
    installButton.addEventListener('click', async () => {
        console.log('✓ Usuario hizo click en instalar');
        
        if (!deferredPrompt) {
            // Si no hay evento pero es móvil, dar instrucciones
            if (isMobile) {
                console.log('ℹ Dispositivo móvil detectado, instrucciones mostradas');
                statusMessage.textContent = '📱 Toca el menú ⋮ (tres puntos) → "Instalar aplicación"';
            } else {
                // En escritorio, mostrar mensaje informativo
                console.log('ℹ En navegadores de escritorio, instálalo desde Android');
                statusMessage.textContent = '💻 Los escritorios no soportan PWA. ¡Prueba en Android! Abre: https://github.com/[usuario]/PWA_ClockWorker';
            }
            return;
        }
        
        // Si hay evento, mostrar el prompt
        try {
            deferredPrompt.prompt();
            
            // Esperar respuesta del usuario
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✓ Usuario aceptó la instalación');
                statusMessage.textContent = '✓ ¡Instalación completada! La app está en tu pantalla de inicio';
                installButton.classList.remove('pulse');
                installButton.textContent = '✓ Instalada';
                installButton.disabled = true;
            } else {
                console.log('✗ Usuario rechazó la instalación');
                statusMessage.textContent = '⚠ Instalación cancelada. Puedes intentar más tarde';
            }
        } catch (error) {
            console.error('✗ Error durante instalación:', error);
            statusMessage.textContent = '⚠ Error en la instalación. Intenta de nuevo';
        }
        
        // Limpiar el evento
        deferredPrompt = null;
    });
}

/**
 * Evento: appinstalled
 * Se dispara cuando la PWA fue instalada exitosamente
 */
window.addEventListener('appinstalled', () => {
    console.log('✓ PWA instalada correctamente');
    
    if (installButton) {
        installButton.classList.remove('pulse');
        installButton.textContent = '✓ Instalada';
        installButton.disabled = true;
        
        if (statusMessage) {
            statusMessage.textContent = '✓ ¡Bienvenido! La app está instalada';
        }
    }
    
    deferredPrompt = null;
});

/**
 * Inicialización
 * Mostrar instrucciones según el dispositivo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Si es móvil y no hay evento aún, mostrar instrucción
    if (isMobile && !deferredPrompt && statusMessage) {
        console.log('ℹ Esperando evento de instalación en móvil...');
        statusMessage.textContent = '📱 Espera un momento... verificando si se puede instalar';
        
        // Esperar un poco y si no hay evento, mostrar instrucción manual
        setTimeout(() => {
            if (!deferredPrompt && isMobile) {
                statusMessage.textContent = '📱 Si no ves opción de instalar, toca el menú ⋮ (tres puntos)';
                console.log('ℹ Instrucciones manuales mostradas');
            }
        }, 2000);
    }
});

console.log('✓ Script de instalación cargado (isMobile: ' + isMobile + ')');

