/* ===========================================
   CLOCK WORKER - MANEJADOR DE INSTALACIÓN (install.js)
   Gestiona la instalación de la PWA en dispositivos
   =========================================== */

// Variable para almacenar el evento de instalación
let deferredPrompt;
const installButton = document.getElementById('install-button');
const statusMessage = document.getElementById('status-message');

/**
 * Evento: beforeinstallprompt
 * Se dispara cuando la PWA es instalable
 */
window.addEventListener('beforeinstallprompt', (evento) => {
    console.log('✓ PWA es instalable');
    
    // Prevenir que se muestre el prompt automático
    evento.preventDefault();
    
    // Guardar el evento para usarlo después
    deferredPrompt = evento;
    
    // Mostrar el botón de instalación
    if (installButton) {
        installButton.style.display = 'block';
        installButton.classList.add('pulse');
        statusMessage.textContent = '✓ La app puede installarse en tu dispositivo';
        console.log('✓ Botón de instalación mostrado');
    }
});

/**
 * Event listener: Click en el botón de instalación
 */
if (installButton) {
    installButton.addEventListener('click', async () => {
        console.log('✓ Usuario hizo click en instalar');
        
        // Verificar que tenemos el evento guardado
        if (!deferredPrompt) {
            console.error('✗ No hay evento de instalación disponible');
            statusMessage.textContent = '⚠ No se puede instalar en este momento';
            return;
        }
        
        // Mostrar el prompt de instalación
        deferredPrompt.prompt();
        
        // Esperar respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✓ Usuario aceptó la instalación');
            statusMessage.textContent = '✓ ¡Instalación completada! La app está en tu pantalla de inicio';
            installButton.style.display = 'none';
            installButton.classList.remove('pulse');
        } else {
            console.log('✗ Usuario rechazó la instalación');
            statusMessage.textContent = '⚠ Instalación cancelada. Puedes intentar más tarde';
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
    
    // Ocultar el botón
    if (installButton) {
        installButton.style.display = 'none';
        statusMessage.textContent = '✓ ¡Bienvenido! La app está instalada';
    }
    
    // Limpiar el evento
    deferredPrompt = null;
});

/**
 * Evento: beforeuninstall (opcional)
 * Se puede usar para analytics o despedidas personalizadas
 */
window.addEventListener('beforeuninstall', () => {
    console.log('⚠ PWA será desinstalada');
});

// Log de inicialización del script
console.log('✓ Script de instalación cargado correctamente');
