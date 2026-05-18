// =========================================
// SaveManager.js - SISTEMA DE GUARDADO LOCAL Y NUBE
// =========================================

const SAVE_KEY = "proyecto_genos_save_v1";

window.cargarProgreso = function() {
    const dataString = localStorage.getItem(SAVE_KEY);
    if (dataString) {
        const data = JSON.parse(dataString);

        if (data.misGenos) window.misGenos = data.misGenos;
        if (data.miMascota) window.miMascota = data.miMascota;
        if (data.maxGenoSlots) window.maxGenoSlots = data.maxGenoSlots;

        if (!window.miInventario) window.miInventario = {};
        if (data.inventarioItems) window.miInventario.items = data.inventarioItems;
        if (data.esencia !== undefined) window.miInventario.vitalEssence = data.esencia;

        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                if (window.misGenos) {
                    window.misGenos.forEach(geno => {
                        if (typeof generarSvgGeno === 'function') geno.svg = generarSvgGeno(geno);
                    });
                }
                if (window.miMascota && typeof generarSvgGeno === 'function') {
                    window.miMascota.svg = generarSvgGeno(window.miMascota);
                }

                if (window.miWallet && data.pol !== undefined) {
                    window.miWallet.pol = data.pol;
                    const polText = document.getElementById("pol-amount");
                    if(polText) polText.innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
                }

                const pedestal = document.getElementById("geno-container");
                if (pedestal && window.miMascota && window.miMascota.id && window.miMascota.id !== "temp") {
                    pedestal.style.display = "block";
                    pedestal.innerHTML = `<div class="geno-idle" style="color: ${window.miMascota.color}; top: 50%; left: 50%; display: flex; justify-content: center; align-items: center;">${window.miMascota.svg}</div>`;
                }

                if(window.actualizarPanelRPG) window.actualizarPanelRPG();
                if(window.renderizarIncubadora) window.renderizarIncubadora();
            }, 150); 
        });
        
        return true;
    }
    return false;
};

// ========================================================
// 1. GUARDADO SILENCIOSO (Solo PC local)
// ========================================================
window.guardarLocalSilencioso = function() {
    if (!window.miMascota || !window.miMascota.id || window.miMascota.id === "temp") return;

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

// ========================================================
// 2. GUARDADO DE ACCIÓN (Local + Nube)
// ========================================================
window.guardarProgreso = function() {
    // Primero guarda en la PC
    window.guardarLocalSilencioso(); 
    
    // Luego le avisa a la Nube (con sus 3 segundos de espera de seguridad)
    if (typeof window.autoGuardar === 'function') {
        window.autoGuardar();
    }
};

window.cargarProgreso();

document.addEventListener("DOMContentLoaded", () => {
    // EL BUCLE DE 5 SEGUNDOS: Ahora SOLO llama al silencioso, no despierta a la Nube.
    setInterval(() => {
        window.guardarLocalSilencioso();
    }, 5000);
});