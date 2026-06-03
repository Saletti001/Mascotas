// ========================================================
// LabManager.js - GESTOR DE META-PROGRESIÓN DEL LABORATORIO
// ========================================================

window.labLevel = 1;
window.labXP = 0;
window.comercioDesbloqueado = false;

// Fórmula: XP = 100 * L^1.5
window.obtenerXPRequeridaLaboratorio = function(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
};

// Función global para otorgar experiencia del Laboratorio
window.ganarXPLaboratorio = function(cantidad, motivo) {
    window.labXP += cantidad;
    console.log(`[LAB XP] +${cantidad} XP de laboratorio por: ${motivo}. Total: ${window.labXP}/${window.obtenerXPRequeridaLaboratorio(window.labLevel)}`);

    let subioDeNivel = false;
    let nivelInicial = window.labLevel;

    // Loop para manejar subidas múltiples de nivel
    while (window.labXP >= window.obtenerXPRequeridaLaboratorio(window.labLevel)) {
        window.labXP -= window.obtenerXPRequeridaLaboratorio(window.labLevel);
        window.labLevel++;
        subioDeNivel = true;
    }

    if (subioDeNivel) {
        if (window.Sonidos) {
            window.Sonidos.play("heal");
        }
        
        // Efecto visual en el contenedor del Geno principal si estamos en la vista de la habitación
        const pedestal = document.getElementById("geno-container");
        if (pedestal) {
            pedestal.classList.remove("geno-idle");
            pedestal.classList.add("happy-jump");
            setTimeout(() => {
                pedestal.classList.remove("happy-jump");
                pedestal.classList.add("geno-idle");
            }, 500);
        }

        alert(`🧪 ¡EXPANSIÓN CIENTÍFICA! 🌟\nTu Laboratorio ha ascendido al Nivel ${window.labLevel}.\n` + 
              (window.labLevel >= 5 && !window.comercioDesbloqueado 
               ? "🔓 ¡Has desbloqueado el derecho a comprar el Permiso de Comercio en el Bazar!" 
               : "¡Continúa mejorando tus instalaciones!"));
    }

    window.actualizarHUDLaboratorio();

    if (typeof window.autoGuardar === 'function') {
        window.autoGuardar();
    } else if (typeof window.respaldarEnNube === 'function') {
        window.respaldarEnNube();
    }
};

// Función para actualizar la UI del HUD
window.actualizarHUDLaboratorio = function() {
    const lvlText = document.getElementById("hud-lab-level-text");
    const xpText = document.getElementById("hud-lab-xp-text");
    const xpFill = document.getElementById("hud-lab-xp-fill");

    if (lvlText) lvlText.innerText = `Nv. ${window.labLevel}`;
    
    const xpNeeded = window.obtenerXPRequeridaLaboratorio(window.labLevel);
    if (xpText) xpText.innerText = `${Math.floor(window.labXP)} / ${xpNeeded}`;
    
    if (xpFill) {
        let pct = (window.labXP / xpNeeded) * 100;
        if (pct > 100) pct = 100;
        if (pct < 0) pct = 0;
        xpFill.style.width = pct + "%";
    }
};

// Ganancia genérica al completar minijuegos de Arcade
window.completarMinijuegoArcade = function(nombreMiniguego) {
    const xpRandom = Math.floor(Math.random() * 6) + 10; // Rango: 10 a 15
    if (window.ganarXPLaboratorio) {
        window.ganarXPLaboratorio(xpRandom, `Minijuego Arcade: ${nombreMiniguego}`);
    }
    return xpRandom;
};

// Validación y recompensa del Cuidado Diario Pasivo
window.verificarCuidadoDiarioXP = function(geno) {
    if (!geno || !geno.id || geno.id === "temp") return;
    const hoy = new Date().toDateString();
    
    if (!geno.registroAmistadDiaria) geno.registroAmistadDiaria = {};
    
    // Si ya fue otorgado hoy el XP para este Geno, no hacer nada
    if (geno.registroAmistadDiaria.careXPAwarded === hoy) return;
    
    const limpia = (geno.registroAmistadDiaria.limpieza === hoy);
    const acariciada = (geno.registroAmistadDiaria.caricia === hoy);
    
    // Verificar si está alimentado (manualmente hoy o tiene Ración Automática activa)
    const tieneAutoRacion = window.rationAutoActiveUntil && (window.rationAutoActiveUntil > (typeof window.obtenerTiempoSeguro === 'function' ? window.obtenerTiempoSeguro() : Date.now()));
    const alimentada = (geno.registroAmistadDiaria.alimentacion === hoy) || tieneAutoRacion;
    
    if (limpia && acariciada && alimentada) {
        geno.registroAmistadDiaria.careXPAwarded = hoy;
        
        // Sincronizar cambios en el inventario global de Genos
        if (window.misGenos) {
            const idx = window.misGenos.findIndex(g => String(g.id) === String(geno.id));
            if (idx !== -1) {
                window.misGenos[idx].registroAmistadDiaria = geno.registroAmistadDiaria;
            }
        }
        
        // Recompensa de 30 de Laboratorio XP
        setTimeout(() => {
            if (window.ganarXPLaboratorio) {
                window.ganarXPLaboratorio(30, `Cuidado completo diario de ${geno.name || 'Geno'}`);
            }
            alert(`🧪 ¡CUIDADO COMPLETO CON ÉXITO! ✨\nHas cumplido todas las necesidades diarias de ${geno.name || 'tu Geno'}.\n¡Obtienes +30 XP de Laboratorio!`);
        }, 600);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Inicialización del HUD después de que cargue el DOM
    window.actualizarHUDLaboratorio();
});
