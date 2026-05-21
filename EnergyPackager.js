// =========================================
// EnergyPackager.js - SISTEMA DE CÁPSULAS DINÁMICAS
// =========================================

window.EnergyPackager = {
    comision: 0.10, // 10% de impuesto anti-bot

    inyectarUI: function() {
        // 1. Inyectar el Modal del Laboratorio (Diseño actualizado con Input)
        const modalHTML = `
            <div id="packager-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; justify-content:center; align-items:center;">
                <div style="background:#1a1a2e; border: 2px solid #00d2ff; border-radius: 15px; padding: 25px; width: 85%; max-width: 320px; text-align: center; color: white; font-family: sans-serif; box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);">
                    <h2 style="color: #00d2ff; margin-top:0; font-size: 20px;">🔋 Laboratorio</h2>
                    <p style="font-size: 12px; color: #aaa; margin-bottom: 20px; line-height: 1.4;">
                        Introduce la cantidad de EV que deseas encapsular. Se aplicará un impuesto de red del 10%.
                    </p>
                    
                    <div style="background: #0f0f1a; border: 1px solid #2a2a4a; border-radius: 10px; padding: 15px; margin-bottom: 20px;">
                        <div style="margin-bottom: 15px; text-align: left;">
                            <label style="font-size: 11px; color: #4dd0e1; font-weight: bold; text-transform: uppercase;">Cantidad a encapsular (EV):</label>
                            <input type="number" id="input-ev-capsula" min="1" placeholder="Ej. 1000" style="width: 100%; padding: 10px; margin-top: 8px; border-radius: 5px; border: 1px solid #00d2ff; background: rgba(0, 210, 255, 0.1); color: white; font-size: 18px; box-sizing: border-box; text-align: center; font-weight: bold; outline: none;">
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #ff4757; margin-bottom: 8px; border-bottom: 1px dashed rgba(255, 71, 87, 0.3); padding-bottom: 8px;">
                            <span>Impuesto (10%):</span>
                            <span><b id="txt-comision-ev">0</b> EV</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold;">
                            <span style="color: #aaa;">Total a pagar:</span>
                            <span style="color: #ffcc00;"><b id="txt-total-ev">0</b> EV</span>
                        </div>
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

        // 2. Evento para abrir el modal desde el HUD
        const btnAbrir = document.getElementById('btn-abrir-empaquetador');
        if(btnAbrir) {
            btnAbrir.onclick = () => {
                document.getElementById('packager-modal').style.display = 'flex';
                document.getElementById('input-ev-capsula').value = '';
                document.getElementById('txt-comision-ev').innerText = '0';
                document.getElementById('txt-total-ev').innerText = '0';
            };
        }

        // 3. Lógica matemática en tiempo real al escribir
        const inputEv = document.getElementById('input-ev-capsula');
        inputEv.addEventListener('input', (e) => {
            let val = parseInt(e.target.value) || 0;
            if (val < 0) { val = 0; e.target.value = 0; }
            
            let comision = Math.ceil(val * this.comision);
            let total = val + comision;
            
            document.getElementById('txt-comision-ev').innerText = comision;
            document.getElementById('txt-total-ev').innerText = total;
        });

        // 4. Botón de creación
        document.getElementById('btn-crear-capsula').onclick = () => {
            let val = parseInt(document.getElementById('input-ev-capsula').value);
            this.fabricarCapsula(val);
        };
    },

    fabricarCapsula: function(valorDeseado) {
        if (!valorDeseado || valorDeseado <= 0) {
            alert("Introduce una cantidad válida superior a 0.");
            return;
        }

        if (!window.miInventario) window.miInventario = { items: [], slots: 10, vitalEssence: 0 };
        if (!window.miInventario.items) window.miInventario.items = [];

        let comision = Math.ceil(valorDeseado * this.comision);
        let costoTotal = valorDeseado + comision;

        if (window.miInventario.vitalEssence < costoTotal) {
            alert(`❌ Energía insuficiente. Necesitas ${costoTotal} EV (incluyendo el 10% de impuesto).`);
            return;
        }

        // Generamos un ID dinámico. Así, una cápsula de 500 no se mezclará con una de 1000.
        let capsulaId = "capsula_ev_" + valorDeseado;
        
        let slotExistente = window.miInventario.items.find(item => item.id === capsulaId && item.cantidad < 20);
        let maxSlots = window.miInventario.slots || 10;
        
        if (!slotExistente && window.miInventario.items.length >= maxSlots) {
            alert("🎒 ¡Inventario lleno! Debes descartar objetos o mejorar tu mochila.");
            return;
        }

        // Ejecutar transacción
        window.miInventario.vitalEssence -= costoTotal;

        if (slotExistente) {
            slotExistente.cantidad += 1;
        } else {
            window.miInventario.items.push({
                id: capsulaId,
                name: `Cápsula EV (${valorDeseado})`,
                type: "consumible",
                description: `Contiene ${valorDeseado} EV condensada.`,
                icon: "🔋",
                cantidad: 1,
                evContenido: valorDeseado, // Guardamos la pureza interna de la cápsula
                valorMercado: valorDeseado // Ayuda para listados en el mercado Web3
            });
        }

        // Actualizar visuales y guardar
        if (typeof window.actualizarHUD === 'function') window.actualizarHUD();
        
        const evText = document.getElementById("vital-essence-amount");
        if (evText) evText.innerText = Math.floor(window.miInventario.vitalEssence);

        if (window.miInventario && typeof window.miInventario.updateUI === 'function') {
            window.miInventario.updateUI();
            window.miInventario.renderGrid();
        }

        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        alert(`✨ ¡Cápsula de ${valorDeseado} EV creada! Se te descontaron ${costoTotal} EV.`);
        document.getElementById('packager-modal').style.display = 'none';
    }
};

// Iniciar al cargar
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        window.EnergyPackager.inyectarUI();
    }, 600);
});