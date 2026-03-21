/* ===========================================
   CLOCK WORKER - LÓGICA DE LA APLICACIÓN (app.js)
   Actualiza la hora en tiempo real cada segundo
   =========================================== */

// Variable global del intervalo del reloj
let intervaloReloj = null;

/**
 * Función para obtener la hora actual formateada
 * @returns {string} Hora en formato HH:MM:SS
 */
function obtenerHoraActual() {
    const ahora = new Date();
    
    // Extraer horas, minutos y segundos
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    
    // Retornar la hora formateada
    return `${horas}:${minutos}:${segundos}`;
}

/**
 * Función para obtener la fecha actual formateada
 * @returns {string} Fecha en formato legible
 */
function obtenerFechaActual() {
    const ahora = new Date();
    
    // Array de nombres de meses
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Array de nombres de días
    const diasSemana = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];
    
    // Construir la fecha formateada
    const mes = meses[ahora.getMonth()];
    const dia = ahora.getDate();
    const año = ahora.getFullYear();
    const diaSemana = diasSemana[ahora.getDay()];
    
    return `${diaSemana}, ${dia} de ${mes} de ${año}`;
}

/**
 * Función para actualizar el reloj en el DOM
 * Se ejecuta cada segundo
 */
function actualizarReloj() {
    // Obtener referencias a los elementos del DOM
    const elementoReloj = document.getElementById('clock');
    const elementoFecha = document.getElementById('date-display');
    
    // Verificar que los elementos existan
    if (elementoReloj && elementoFecha) {
        // Actualizar la hora
        elementoReloj.textContent = obtenerHoraActual();
        
        // Actualizar la fecha
        elementoFecha.textContent = obtenerFechaActual();
    }
}

/**
 * Función para iniciar el reloj automático
 * Se puede llamar múltiples veces sin problemas
 */
function iniciarReloj() {
    // Detener intervalo anterior si existe (por si acaso)
    if (intervaloReloj) {
        clearInterval(intervaloReloj);
        console.log('⏹ Intervalo anterior detenido');
    }
    
    console.log('⏱ Iniciando reloj...');
    
    // Actualizar la hora inmediatamente
    actualizarReloj();
    
    // Actualizar la hora cada segundo (1000 ms)
    intervaloReloj = setInterval(actualizarReloj, 1000);
    
    console.log('✓ Reloj actualizándose automáticamente cada segundo');
}

/**
 * Inicialización de la aplicación - Ejecutarse lo antes posible
 */
if (document.readyState === 'loading') {
    // El DOM aún se está cargando
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✓ Evento DOMContentLoaded - Inicializando reloj');
        iniciarReloj();
    });
} else {
    // El DOM ya está listo
    console.log('✓ DOM ya listo - Inicializando reloj directamente');
    iniciarReloj();
}

/**
 * Re-iniciar reloj cuando la app se enfoca (vuelve a primer plano)
 * Importante para PWA instalada
 */
window.addEventListener('focus', function() {
    console.log('✓ App enfocada - Verificando reloj');
    if (!intervaloReloj) {
        console.log('⚠ Intervalo inactivo, reiniciando...');
        iniciarReloj();
    }
});

/**
 * Pausar reloj cuando la app pierde enfoque (va a background)
 * Importante para ahorro de batería en móviles
 */
window.addEventListener('blur', function() {
    console.log('⏸ App en background');
});

/**
 * Manejar visibilidad de la página (importante para PWA)
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('⏸ Página oculta');
    } else {
        console.log('✓ Página visible - Reiniciando reloj si es necesario');
        if (!intervaloReloj) {
            iniciarReloj();
        }
    }
});

// Log de inicialización
console.log('✓ Script app.js cargado correctamente');
