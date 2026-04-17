// =========================================
// SaveManager.js - SISTEMA DE GUARDADO LOCAL BLINDADO
// =========================================

const SAVE_KEY = "proyecto_genos_save_v1";

// 1. CARGA INMEDIATA
window.cargarProgreso = function() {
    const dataString = localStorage.getItem(SAVE_KEY);
    if (dataString) {
        const data = JSON.parse(dataString);

        if (data.misGenos) {
            window.misGenos = data.misGenos;
            window.misGenos.forEach(geno => {
                if (typeof generarSvgGeno === 'function') geno.svg = generarSvgGeno(geno);
            });
        }
        
        if (data.miMascota) {
            window.miMascota = data.miMascota;
            if (typeof generarSvgGeno === 'function') window.miMascota.svg = generarSvgGeno(window.miMascota);
        }

        if (data.maxGenoSlots) {
            window.maxGenoSlots = data.maxGenoSlots;
        }

        if (!window.miInventario) window.miInventario = {};
        if (data.inventarioItems) window.miInventario.items = data.inventarioItems;
        if (data.esencia !== undefined) window.miInventario.vitalEssence = data.esencia;

        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                if (window.miWallet && data.pol !== undefined) {
                    window.miWallet.pol = data.pol;
                    const polText = document.getElementById("pol-amount");
                    if(polText) polText.innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
                }
                if(window.actualizarPanelRPG) window.actualizarPanelRPG();
                if(window.renderizarIncubadora) window.renderizarIncubadora();
            }, 100); 
        });
        
        return true;
    }
    return false;
};

// 2. FUNCIÓN PARA GUARDAR EL PROGRESO
window.guardarProgreso = function() {
    // 🔥 ANTI-CORRUPCIÓN: Si la mascota actual no tiene ID, es el Geno verde falso de RPGManager. ¡NO GUARDAR!
    if (!window.miMascota || !window.miMascota.id) return;

    const dataToSave = {
        misGenos: window.misGenos || [],
        miMascota: window.miMascota || null,
        maxGenoSlots: window.maxGenoSlots || 6,
        esencia: window.miInventario ? (window.miInventario.vitalEssence || 0) : 0,
        pol: window.miWallet ? window.miWallet.pol : 10.0,
        inventarioItems: window.miInventario ? (window.miInventario.items || window.miInventario.slots || []) : []
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
};

// EJECUTAR CARGA AL INICIO
window.cargarProgreso();

document.addEventListener("DOMContentLoaded", () => {
    // AUTO-GUARDADO
    setInterval(() => {
        window.guardarProgreso();
    }, 5000);
});