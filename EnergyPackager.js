// =========================================
// EnergyPackager.js - SISTEMA DE CÁPSULAS DINÁMICAS
// =========================================

window.EnergyPackager = {
    comision: 0.10, // 10% de impuesto anti-bot

    inyectarUI: function() {
        // ✨ Inyectamos CSS para los botones de selección
        const style = document.createElement('style');
        style.innerHTML = `
            .capsule-size-btn {
                background: rgba(0, 210, 255, 0.05) !important;
                border: 1px solid #2a2a4a !important;
                border-radius: 8px;
                padding: 12px 10px;
                color: white !important;
                font-weight: bold;
                font-size: 13.5px;
                cursor: pointer;
                transition: all 0.2s;
                outline: none;
            }
            .capsule-size-btn:hover {
                background: rgba(0, 210, 255, 0.15) !important;
                border-color: #00e5ff !important;
                box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
            }
            .capsule-size-btn.active {
                background: linear-gradient(135deg, #00e5ff, #00838f) !important;
                border-color: #00e5ff !important;
                color: #000 !important;
                box-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
            }
        `;
        document.head.appendChild(style);

        // Interfaz ultra-limpia sin títulos ni emojis innecesarios
        const modalHTML = `
            <div id="packager-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; justify-content:center; align-items:center;">
                <div style="background:#1a1a2e; border: 2px solid #00d2ff; border-radius: 15px; padding: 25px; width: 85%; max-width: 320px; text-align: center; color: white; font-family: sans-serif; box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);">
                    
                    <div style="font-size: 13px; color: #aaa; margin-top: 0; margin-bottom: 15px; line-height: 1.4;">
                        Esencia Vital disponible: <br>
                        <span id="packager-ev-disponibles" style="color: #00d2ff; font-weight: bold; font-size: 18px;">0</span> EV
                    </div>
                    
                    <p style="font-size: 11px; color: #888; margin-top: 0; margin-bottom: 20px; line-height: 1.3;">
                        Selecciona un tamaño de cápsula para empaquetar tu Esencia Vital. Se aplicará un impuesto de red del 10%.
                    </p>
                    
                    <div style="background: #0f0f1a; border: 1px solid #2a2a4a; border-radius: 10px; padding: 15px; margin-bottom: 20px;">
                        <div style="margin-bottom: 15px; text-align: left;">
                            <label style="font-size: 11.5px; color: #4dd0e1; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 10px; text-align: center;">Tamaño de la cápsula:</label>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" id="capsule-options-container">
                                <button type="button" class="capsule-size-btn" data-value="5000">5K EV</button>
                                <button type="button" class="capsule-size-btn" data-value="10000">10K EV</button>
                                <button type="button" class="capsule-size-btn" data-value="25000">25K EV</button>
                                <button type="button" class="capsule-size-btn" data-value="50000">50K EV</button>
                            </div>
                            <input type="hidden" id="input-ev-capsula" value="">
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

        const btnAbrir = document.getElementById('btn-abrir-empaquetador');
        if(btnAbrir) {
            btnAbrir.onclick = () => {
                document.getElementById('packager-modal').style.display = 'flex';
                document.getElementById('input-ev-capsula').value = '';
                document.getElementById('txt-comision-ev').innerText = '0';
                document.getElementById('txt-total-ev').innerText = '0';
                
                // Desmarcar todos los botones
                document.querySelectorAll('.capsule-size-btn').forEach(b => b.classList.remove('active'));

                // Mostrar balance disponible completo (sin abreviar con K, usando separador de miles)
                const disponible = window.miInventario ? (window.miInventario.vitalEssence || 0) : 0;
                document.getElementById('packager-ev-disponibles').innerText = typeof window.formatFullNumber === 'function' ? window.formatFullNumber(disponible) : Number(disponible).toFixed(1).replace(/\.0$/, '');
            };
        }

        const sizeBtns = document.querySelectorAll('.capsule-size-btn');
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const val = parseInt(btn.getAttribute('data-value')) || 0;
                document.getElementById('input-ev-capsula').value = val;
                
                let comision = Math.ceil(val * this.comision);
                let total = val + comision;
                
                document.getElementById('txt-comision-ev').innerText = typeof window.formatFullNumber === 'function' ? window.formatFullNumber(comision) : comision;
                document.getElementById('txt-total-ev').innerText = typeof window.formatFullNumber === 'function' ? window.formatFullNumber(total) : total;
            });
        });

        document.getElementById('btn-crear-capsula').onclick = () => {
            let val = parseInt(document.getElementById('input-ev-capsula').value);
            this.fabricarCapsula(val);
        };
    },

    fabricarCapsula: function(valorDeseado) {
        if (!valorDeseado || valorDeseado <= 0 || isNaN(valorDeseado)) {
            alert("Por favor, selecciona un tamaño de cápsula para fabricar.");
            return;
        }

        if (!window.miInventario) return;

        let comision = Math.ceil(valorDeseado * this.comision);
        let costoTotal = valorDeseado + comision;

        if (window.miInventario.vitalEssence < costoTotal) {
            alert(`❌ Energía insuficiente. Necesitas ${costoTotal} EV (incluyendo el 10% de impuesto).`);
            return;
        }

        let capsulaId = "capsula_ev_" + valorDeseado;
        
        // Un ícono SVG con un diseño de celda de energía futurista
        const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#4dd0e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="4" width="10" height="16" rx="2" ry="2" fill="rgba(77,208,225,0.1)"></rect><line x1="10" y1="2" x2="14" y2="2"></line><line x1="7" y1="10" x2="17" y2="10"></line><line x1="7" y1="14" x2="17" y2="14"></line><circle cx="12" cy="18" r="1" fill="#4dd0e1"></circle></svg>`;

        // ✨ DEJAMOS QUE TU INVENTORY MANAGER HAGA EL TRABAJO
        let exito = window.miInventario.addItem({
            id: capsulaId,
            name: `Cápsula EV (${valorDeseado})`,
            type: "consumable", // <-- Esto coincide con tu regla "this.stackLimits.consumable"
            description: `Contiene ${valorDeseado} EV condensada.`,
            icon: iconSVG,
            count: 1, // <-- Usando count en lugar de cantidad
            evContenido: valorDeseado,
            valorMercado: valorDeseado
        });

        // Si se añadió con éxito (había espacio en la mochila)
        if (exito) {
            window.miInventario.addEssence(-costoTotal);
            document.getElementById('packager-modal').style.display = 'none';
            alert(`✨ ¡Cápsula creada y guardada en tu mochila!`);
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        window.EnergyPackager.inyectarUI();
    }, 600);
});