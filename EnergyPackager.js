// =========================================
// EnergyPackager.js - SISTEMA DE CÁPSULAS DE EV
// =========================================

window.EnergyPackager = {
    costoEmpaquetado: 1100, // Lo que cuesta crearla
    valorCapsula: 1000,     // Lo que contiene la cápsula

    inyectarUI: function() {
        // 1. Inyectar el botón en el HUD (debajo de la barra de recursos)
        const hudContainer = document.querySelector('.hud-top-row') || document.body;
        
        const btnEmpaquetar = document.createElement('div');
        btnEmpaquetar.innerHTML = `
            <button id="btn-abrir-empaquetador" style="position: absolute; top: 55px; left: 16px; background: #2a2a4a; border: 1px solid #00d2ff; color: #00d2ff; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-family: sans-serif; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 100;">
                <span>⚡</span> Empaquetar EV
            </button>
        `;
        document.body.appendChild(btnEmpaquetar);

        // 2. Inyectar el Modal del Laboratorio
        const modalHTML = `
            <div id="packager-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; justify-content:center; align-items:center;">
                <div style="background:#1a1a2e; border: 2px solid #00d2ff; border-radius: 15px; padding: 25px; width: 85%; max-width: 320px; text-align: center; color: white; font-family: sans-serif; box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);">
                    <h2 style="color: #00d2ff; margin-top:0; font-size: 20px;">🔋 Laboratorio</h2>
                    <p style="font-size: 13px; color: #aaa; margin-bottom: 20px; line-height: 1.4;">
                        Comprime tu Esencia Vital en cápsulas físicas para comerciarlas en el Mercado Global. Ocuparán espacio en tu inventario.
                    </p>
                    
                    <div style="background: #0f0f1a; border: 1px solid #2a2a4a; border-radius: 10px; padding: 15px; margin-bottom: 20px;">
                        <div style="font-size: 14px; margin-bottom: 10px;">Coste de compresión: <b style="color: #ff4757;">${this.costoEmpaquetado} EV</b></div>
                        <div style="font-size: 24px; margin-bottom: 10px;">⬇️</div>
                        <div style="font-size: 14px;">Recibes: <b style="color: #2ed573;">1x Cápsula (${this.valorCapsula} EV)</b></div>
                    </div>

                    <button id="btn-crear-capsula" style="background: #00d2ff; color: #000; border: none; padding: 12px; font-weight: bold; border-radius: 8px; cursor: pointer; width: 100%; margin-bottom: 10px; font-size: 14px;">
                        CREAR CÁPSULA
                    </button>
                    <button onclick="document.getElementById('packager-modal').style.display='none'" style="background: transparent; color: #888; border: 1px solid #888; padding: 10px; border-radius: 8px; cursor: pointer; width: 100%; font-size: 13px;">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 3. Eventos
        document.getElementById('btn-abrir-empaquetador').onclick = () => {
            document.getElementById('packager-modal').style.display = 'flex';
        };

        document.getElementById('btn-crear-capsula').onclick = () => this.fabricarCapsula();
    },

    fabricarCapsula: function() {
        // Validar si existe el inventario
        if (!window.miInventario) window.miInventario = { items: [], slots: 10, vitalEssence: 0 };
        if (!window.miInventario.items) window.miInventario.items = [];

        // 1. Comprobar si hay suficiente EV
        if (window.miInventario.vitalEssence < this.costoEmpaquetado) {
            alert(`❌ Energía insuficiente. Necesitas ${this.costoEmpaquetado} EV.`);
            return;
        }

        // 2. Comprobar límites de "Bolsillos Rotos" (Slots)
        // Buscamos si ya existe un stack de cápsulas que no esté lleno (Límite 20)
        let slotExistente = window.miInventario.items.find(item => item.id === "capsula_ev" && item.cantidad < 20);
        let maxSlots = window.miInventario.slots || 10;
        
        if (!slotExistente && window.miInventario.items.length >= maxSlots) {
            alert("🎒 ¡Inventario lleno! Debes descartar objetos o mejorar tu mochila.");
            return;
        }

        // 3. Ejecutar la transacción
        window.miInventario.vitalEssence -= this.costoEmpaquetado;

        if (slotExistente) {
            slotExistente.cantidad += 1;
        } else {
            window.miInventario.items.push({
                id: "capsula_ev",
                name: "Cápsula EV",
                type: "consumible", // Tipo consumible (se apila hasta 20)
                description: `Contiene ${this.valorCapsula} EV. Muy demandada en el mercado.`,
                icon: "🔋",
                cantidad: 1,
                valorMercado: 1 // Referencia para el mercado
            });
        }

        // 4. Actualizar Interfaces y Guardar
        if (typeof window.actualizarHUD === 'function') window.actualizarHUD();
        
        // Actualizar el número de la barra que acabamos de unificar
        const evText = document.getElementById("vital-essence-amount");
        if (evText) evText.innerText = Math.floor(window.miInventario.vitalEssence);

        if (window.miInventario && typeof window.miInventario.updateUI === 'function') {
            window.miInventario.updateUI();
            window.miInventario.renderGrid();
        }

        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        alert("✨ ¡Cápsula creada con éxito! Revisa tu mochila.");
    }
};

// Iniciar cuando el juego cargue
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        window.EnergyPackager.inyectarUI();
    }, 600);
});