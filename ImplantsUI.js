// =========================================
// ImplantsUI.js - INTERFAZ DEL LABORATORIO
// =========================================

window.ImplantsUI = {
    inyectarCSS: function() {
        if (document.getElementById("implants-styles")) return;
        const style = document.createElement("style");
        style.id = "implants-styles";
        style.innerHTML = `
            .implants-screen {
                background-color: #0d161c;
                background-image: radial-gradient(circle at center, #1a2a36 0%, #0d161c 100%);
                min-height: 100vh;
                padding: 20px;
                color: #e0f7fa;
            }

            .lab-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                max-width: 1000px;
                margin: 0 auto;
            }

            /* --- VISOR DEL GENO (IZQUIERDA) --- */
            .geno-scanner {
                flex: 1;
                min-width: 300px;
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid #00acc1;
                border-radius: 20px;
                padding: 30px;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                box-shadow: 0 0 30px rgba(0, 172, 193, 0.2);
            }

            .scanner-line {
                position: absolute;
                width: 90%;
                height: 2px;
                background: rgba(77, 208, 225, 0.5);
                top: 20%;
                box-shadow: 0 0 15px #4dd0e1;
                animation: scanMove 4s infinite linear;
            }

            @keyframes scanMove {
                0% { top: 10%; opacity: 0; }
                50% { opacity: 1; }
                100% { top: 80%; opacity: 0; }
            }

            #implants-geno-preview {
                width: 250px;
                height: 250px;
                filter: drop-shadow(0 0 10px rgba(77, 208, 225, 0.4));
                z-index: 2;
            }

            /* --- PANEL DE CONTROL (DERECHA) --- */
            .control-panel {
                flex: 1.2;
                min-width: 320px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .lab-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }

            .lab-tab {
                flex: 1;
                padding: 12px;
                background: #1a2a36;
                border: 1px solid #334;
                color: #80deea;
                cursor: pointer;
                text-align: center;
                font-weight: bold;
                border-radius: 8px;
                transition: 0.3s;
            }

            .lab-tab.active {
                background: #00acc1;
                color: white;
                box-shadow: 0 0 15px rgba(0, 172, 193, 0.5);
            }

            .slot-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                background: rgba(0,0,0,0.3);
                padding: 15px;
                border-radius: 12px;
            }

            .implant-slot {
                background: #0d161c;
                border: 1px dashed #4dd0e1;
                padding: 15px;
                border-radius: 10px;
                text-align: center;
                cursor: pointer;
                transition: 0.2s;
            }

            .implant-slot:hover {
                background: rgba(77, 208, 225, 0.1);
                border-style: solid;
            }

            .implant-slot label {
                display: block;
                font-size: 10px;
                color: #4dd0e1;
                margin-bottom: 5px;
                text-transform: uppercase;
            }

            .implant-slot .item-name {
                font-size: 13px;
                font-weight: bold;
            }

            /* --- LISTA DE INVENTARIO (MODAL/POPUP) --- */
            #lab-inventory-selector {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 400px;
                background: #1a2a36;
                border: 2px solid #00acc1;
                border-radius: 15px;
                padding: 20px;
                z-index: 1000;
                display: none;
                box-shadow: 0 0 100px rgba(0,0,0,0.9);
            }
        `;
        document.head.appendChild(style);
    },

    renderBase: function() {
        const screen = document.getElementById("implants-area");
        screen.className = "implants-screen";
        screen.innerHTML = `
            <h2 style="text-align:center; color:#4dd0e1; letter-spacing:3px;">LABORATORIO DE IMPLANTES</h2>
            
            <div class="lab-container">
                <div class="geno-scanner">
                    <div class="scanner-line"></div>
                    <div id="implants-geno-preview"></div>
                    <div id="implants-geno-stats" style="margin-top:20px; width:100%;"></div>
                </div>

                <div class="control-panel">
                    <div class="lab-tabs">
                        <div class="lab-tab active" onclick="ImplantsManager.setTab('combat')">MÓDULOS COMBATE</div>
                        <div class="lab-tab" onclick="ImplantsManager.setTab('cosmetic')">MEJORAS FÍSICAS</div>
                    </div>

                    <div id="combat-slots" class="slot-grid">
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('atk_1')">
                            <label>Slot 1</label>
                            <span class="item-name" id="slot-atk-1">VACÍO</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('atk_2')">
                            <label>Slot 2</label>
                            <span class="item-name" id="slot-atk-2">VACÍO</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('atk_3')">
                            <label>Slot 3</label>
                            <span class="item-name" id="slot-atk-3">VACÍO</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('atk_4')">
                            <label>Slot 4</label>
                            <span class="item-name" id="slot-atk-4">BLOQUEADO</span>
                        </div>
                    </div>

                    <div id="cosmetic-slots" class="slot-grid" style="display:none;">
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('head')">
                            <label>Cabeza</label>
                            <span class="item-name" id="slot-head">VACÍO</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('back')">
                            <label>Espalda</label>
                            <span class="item-name" id="slot-back">VACÍO</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('skin')">
                            <label>Piel</label>
                            <span class="item-name" id="slot-skin">ESTÁNDAR</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('aura')">
                            <label>Aura</label>
                            <span class="item-name" id="slot-aura">VACÍO</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="lab-inventory-selector">
                <h3 id="selector-title" style="color:#4dd0e1; margin-top:0;">Seleccionar</h3>
                <div id="lab-inventory-list" style="max-height:300px; overflow-y:auto; margin-bottom:15px;"></div>
                <button onclick="ImplantsManager.closeSelector()" style="width:100%; padding:10px; background:#334; color:white; border:none; border-radius:5px; cursor:pointer;">CERRAR</button>
            </div>

            <button onclick="window.navegarA('nexo-area')" class="btn-secondary" style="margin: 20px auto; display:block;">VOLVER AL NEXO</button>
        `;
    }
};