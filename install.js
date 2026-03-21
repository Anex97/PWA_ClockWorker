/* ===========================================
   CLOCK WORKER - MANEJADOR DE INSTALACIÓN (install.js)
   Gestiona la instalación de la PWA en dispositivos
   =========================================== */

// Variables globales
let deferredPrompt = null;

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarInstalacion);
} else {
    inicializarInstalacion();
}

/**
 * Función principal de inicialización
 */
function inicializarInstalacion() {
    console.log('=== INSTALACIÓN PWA - INICIALIZANDO ===');
    
    const installButton = document.getElementById('install-button');
    const statusMessage = document.getElementById('status-message');
    
    if (!installButton) {
        console.error('✗ Botón de instalación no encontrado en el DOM');
        return;
    }
    
    console.log('✓ Botón de instalación encontrado');
    
    /**
     * CRÍTICO: Escuchar el evento beforeinstallprompt
     * Este evento se dispara cuando el navegador detecta que la PWA puede instalarse
     */
    window.addEventListener('beforeinstallprompt', (evento) => {
        console.log('✓✓✓ beforeinstallprompt DISPARADO - PWA es instalable');
        
        // Prevenir que el navegador muestre su propio prompt
        evento.preventDefault();
        
        // Guardar el evento para usarlo después
        deferredPrompt = evento;
        
        // Mostrar estado
        if (statusMessage) {
            statusMessage.textContent = '✓ La app puede instalarse en tu dispositivo';
            console.log('✓ Estado actualizado: "La app puede instalarse"');
        }
        
        // Agregar animación al botón
        installButton.classList.add('pulse');
        console.log('✓ Animación pulse agregada al botón');
    });
    
    /**
     * Click en el botón de instalación
     */
    installButton.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('--- CLICK EN BOTÓN INSTALAR ---');
        
        // Si no tenemos el evento guardado, no podemos instalar
        if (!deferredPrompt) {
            console.warn('⚠ beforeinstallprompt NO fue capturado');
            console.warn('Razones posibles:');
            console.warn('1. La PWA no cumple requisitos mínimos');
            console.warn('2. El navegador no la reconoce como PWA');
            console.warn('3. Está en modo incógnito');
            
            if (statusMessage) {
                statusMessage.textContent = '⚠ beforeinstallprompt no disponible - Intenta con menú ⋮';
            }
            return;
        }
        
        console.log('✓ Mostrando prompt de instalación...');
        
        try {
            // Mostrar el popup de instalación del navegador
            deferredPrompt.prompt();
            
            // Esperar la respuesta del usuario
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✓✓✓ USUARIO ACEPTÓ INSTALACIÓN');
                if (statusMessage) {
                    statusMessage.textContent = '✓ ¡Instalación en progreso! La app aparecerá en tu pantalla';
                }
                installButton.textContent = '✓ Instalando...';
                installButton.disabled = true;
            } else {
                console.log('✗ Usuario rechazó la instalación');
                if (statusMessage) {
                    statusMessage.textContent = '⚠ Instalación cancelada. Puedes intentar más tarde';
                }
            }
        } catch (error) {
            console.error('✗ Error mostrando prompt:', error);
            if (statusMessage) {
                statusMessage.textContent = '⚠ Error: ' + error.message;
            }
        }
        
        // Limpiar después de usar
        deferredPrompt = null;
    });
    
    /**
     * Evento: appinstalled
     * Se dispara CUANDO la instalación fue exitosa
     */
    window.addEventListener('appinstalled', () => {
        console.log('✓✓✓ APP INSTALADA CORRECTAMENTE');
        
        if (statusMessage) {
            statusMessage.textContent = '✓✓✓ ¡La app está instalada y lista!';
        }
        
        installButton.textContent = '✓ Instalada';
        installButton.disabled = true;
        installButton.classList.remove('pulse');
        
        deferredPrompt = null;
    });
}

console.log('✓ Script install.js COMPLETAMENTE cargado y listo');

