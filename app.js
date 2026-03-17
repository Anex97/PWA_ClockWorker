/* ===========================================
   CLOCK WORKER - LÓGICA DE LA APLICACIÓN (app.js)
   Actualiza la hora en tiempo real cada segundo
   =========================================== */

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
        
        // Actualizar la fecha (menos frecuentemente para mayor rendimiento)
        elementoFecha.textContent = obtenerFechaActual();
    }
}

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Aplicación Clock Worker iniciada');
    
    // Actualizar la hora inmediatamente
    actualizarReloj();
    
    // Actualizar la hora cada segundo (1000 ms)
    setInterval(actualizarReloj, 1000);
    
    // Log de confirmación
    console.log('✓ Reloj actualizándose automáticamente cada segundo');
});

/**
 * Si el navegador cierra la pestaña sin estar lista,
 * registrar un event listener adicional como respaldo
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', actualizarReloj);
} else {
    actualizarReloj();
}
