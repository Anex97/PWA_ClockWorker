/* ===========================================
   CLOCK WORKER - LÓGICA DE LA APLICACIÓN (app.js)
   Actualiza la hora en tiempo real cada segundo
   =========================================== */

// Variables globales
let intervaloReloj = null;
const DEBUG = true;

/**
 * Log mejorado con timestamp
 */
function logApp(mensaje) {
    const timestamp = new Date().toLocaleTimeString();
    if (DEBUG) {
        console.log(`[${timestamp}] ${mensaje}`);
    }
}

/**
 * Función para obtener la hora actual formateada
 * @returns {string} Hora en formato HH:MM:SS
 */
function obtenerHoraActual() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

/**
 * Función para obtener la fecha actual formateada
 * @returns {string} Fecha en formato legible
 */
function obtenerFechaActual() {
    const ahora = new Date();
    
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const diasSemana = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];
    
    const mes = meses[ahora.getMonth()];
    const dia = ahora.getDate();
    const año = ahora.getFullYear();
    const diaSemana = diasSemana[ahora.getDay()];
    
    return `${diaSemana}, ${dia} de ${mes} de ${año}`;
}

/**
 * Función para actualizar el reloj en el DOM
 * Se ejecuta cada segundo sin errores
 */
function actualizarReloj() {
    try {
        const elementoReloj = document.getElementById('clock');
        const elementoFecha = document.getElementById('date-display');
        
        if (elementoReloj) {
            elementoReloj.textContent = obtenerHoraActual();
        }
        
        if (elementoFecha) {
            elementoFecha.textContent = obtenerFechaActual();
        }
    } catch (error) {
        console.error('Error actualizando reloj:', error);
    }
}

/**
 * Función para iniciar el reloj
 * Crítica para Android y PWA instalada
 */
function iniciarReloj() {
    // Detener intervalo anterior para evitar duplicados
    if (intervaloReloj) {
        clearInterval(intervaloReloj);
        logApp('Intervalo anterior detenido');
    }
    
    logApp('⏱ Iniciando reloj...');
    
    // Actualizar hora inmediatamente
    actualizarReloj();
    
    // Iniciar intervalo cada segundo (crucial)
    intervaloReloj = setInterval(function() {
        actualizarReloj();
    }, 1000);
    
    logApp('✓ Reloj ACTIVO - actualizando cada segundo');
    
    // Verificar que el intervalo está corriendo
    setTimeout(() => {
        if (intervaloReloj) {
            logApp('✓ Verificación: Intervalo funcionando correctamente');
        } else {
            logApp('⚠ Advertencia: Intervalo no está asignado');
        }
    }, 2000);
}

/**
 * Inicializar lo antes posible - CRÍTICO para PWA
 */
(function() {
    logApp('✓ app.js iniciado - readyState: ' + document.readyState);
    
    // Inicializar según el estado del DOM
    if (document.readyState === 'loading') {
        // DOM aún cargándose
        document.addEventListener('DOMContentLoaded', iniciarReloj);
    } else if (document.readyState === 'interactive') {
        // DOM está interactivo
        iniciarReloj();
    } else {
        // DOM completamente cargado
        iniciarReloj();
    }
    
    // Responder a cambios de visibilidad
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && !intervaloReloj) {
            logApp('Página visible - reiniciando reloj');
            iniciarReloj();
        }
    });
    
    // Responder a focus window
    window.addEventListener('focus', function() {
        if (!intervaloReloj) {
            logApp('App enfocada - reiniciando reloj');
            iniciarReloj();
        }
    });
    
})();

logApp('✓ Script app.js completamente cargado');
