// =========================================
// SaveManager.js - SISTEMA DE GUARDADO LOCAL
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const SAVE_KEY = "proyecto_genos_save_v1";

    // 1. FUNCIÓN PARA CARGAR EL PROGRESO
    window.cargarProgreso = function() {
        const dataString = localStorage.getItem(SAVE_KEY);
        if (dataString) {
            const data = JSON.parse(dataString);

            // Restaurar BBDD de Genos y el Geno Principal
            if (data.misGenos) {
                window.misGenos = data.misGenos;
                // 🔥 LA SOLUCIÓN: Recalcular los dibujos de TODOS los Genos cargados
                window.misGenos.forEach(geno => {
                    if (typeof generarSvgGeno === 'function') {
                        geno.svg = generarSvgGeno(geno);
                    }
                });
            }
            
            if (data.miMascota) {
                window.miMascota = data.miMascota;
                // 🔥 LA SOLUCIÓN: Recalcular el dibujo de tu mascota actual
                if (typeof generarSvgGeno === 'function') {
                    window.miMascota.svg = generarSvgGeno(window.miMascota);
                }
            }

            // Esperamos un segundo para que carguen los demás scripts y restauramos el dinero
            setTimeout(() => {
                if (window.miWallet && data.pol !== undefined) {
                    window.miWallet.pol = data.pol;
                    const polText = document.getElementById("pol-amount");
                    if(polText) polText.innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
                }
                if (window.miInventario && data.esencia !== undefined) {
                    // Calculamos la diferencia para no romper el inventario
                    const diferencia = data.esencia - window.miInventario.vitalEssence;
                    window.miInventario.addEssence(diferencia);
                }
                
                // Actualizamos la UI del panel RPG
                if(window.actualizarPanelRPG) window.actualizarPanelRPG();
                if(window.renderizarIncubadora) window.renderizarIncubadora();
                
                console.log("💾 Progreso cargado con éxito y SVGs actualizados.");
            }, 800); 
            
            return true;
        }
        return false;
    };

    // 2. FUNCIÓN PARA GUARDAR EL PROGRESO
    window.guardarProgreso = function() {
        const dataToSave = {
            misGenos: window.misGenos,
            miMascota: window.miMascota,
            esencia: window.miInventario ? window.miInventario.vitalEssence : 0,
            pol: window.miWallet ? window.miWallet.pol : 10.0
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    };

    // 3. AUTO-GUARDADO SILENCIOSO (Cada 5 segundos)
    setInterval(() => {
        window.guardarProgreso();
    }, 5000);

    // Intentar cargar al iniciar el juego
    window.cargarProgreso();
});