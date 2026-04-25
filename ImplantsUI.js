// =========================================
// ImplantsUI.js - INTERFAZ DEL LABORATORIO V10 (DISEÑO UNIFICADO PC/MÓVIL)
// =========================================

window.ImplantsUI = {
    inyectarCSS: function() {
        if (document.getElementById("implants-styles")) return;
        const style = document.createElement("style");
        style.id = "implants-styles";
        style.innerHTML = `
            /* REGLA MAESTRA: Todo hacia adentro para evitar desbordamientos */
            .implants-screen, .implants-screen * {
                box-sizing: border-box !important;
            }

            /* Fondo sólido y scroll invisible */
            .implants-screen {
                background-color: #0d161c !important; 
                background-image: radial-gradient(circle at center, #1a2a36 0%, #0d161c 100%) !important;
                padding: 15px !important;
                padding-bottom: 30px !important; 
                color: #e0f7fa !important;
                overflow-y: auto !important; 
                overflow-x: hidden !important; 
                z-index: 5000 !important; 
                -ms-overflow-style: none !important;  
                scrollbar-width: none !important;  
            }
            .implants-screen::-webkit-scrollbar { display: none !important; }

            /* CONTENEDOR UNIFICADO: Ancho fijo para PC y móvil */
            .lab-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
                width: 100%;
                max-width: 480px; /* Misma medida que el área de batalla del coliseo */
                margin: 0 auto;
            }

            .implants-screen h2 {
                text-align: center;
                color: #4dd0e1;
                letter-spacing: 2px;
                margin: 0 0 15px 0;
                font-size: 18px;
                text-transform: uppercase;
            }

            /* ESCÁNER GENO */
            .geno-scanner {
                width: 100%;
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid #00acc1;
                border-radius: 16px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-shadow: 0 0 20px rgba(0, 172, 193, 0.2);
            }

            .preview-wrapper {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: center;
                padding: 5px 0;
            }

            .scanner-line {
                position: absolute;
                width: 70%;
                height: 2px;
                background: rgba(77, 208, 225, 0.5);
                left: 15%;
                box-shadow: 0 0 15px #4dd0e1;
                animation: scanMove 3s infinite linear;
                z-index: 10;
                pointer-events: none; 
            }

            @keyframes scanMove {
                0% { top: 5%; opacity: 0; }
                50% { opacity: 1; }
                90% { top: 95%; opacity: 0; }
                100% { top: 95%; opacity: 0; }
            }

            #implants-geno-preview {
                width: 130px;
                height: 130px;
                filter: drop-shadow(0 0 10px rgba(77, 208, 225, 0.4));
                z-index: 2;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            /* ESTADÍSTICAS */
            .geno-lab-name {
                text-align: center;
                font-weight: bold;
                color: #fff;
                font-size: 13px;
                text-transform: uppercase;
                margin-bottom: 8px;
                word-break: break-word;
            }
            .geno-lab-name span { color: #4dd0e1; font-size: 10px; }
            
            .geno-lab-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                font-size: 11px;
                color: #80deea;
                text-align: center;
                gap: 6px;
                width: 100%;
            }
            .geno-lab-stats div {
                background: rgba(0,0,0,0.5);
                padding: 6px;
                border-radius: 6px;
                border: 1px solid #333;
            }

            /* PANEL DE CONTROL */
            .control-panel {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .lab-tabs {
                display: flex;
                gap: 8px;
            }

            .lab-tab {
                flex: 1;
                padding: 10px;
                background: #1a2a36;
                border: 1px solid #334;
                color: #80deea;
                cursor: pointer;
                text-align: center;
                font-weight: bold;
                border-radius: 8px;
                transition: 0.3s;
                text-transform: uppercase;
                font-size: 12px;
            }

            .lab-tab.active {
                background: #00acc1;
                color: white;
                box-shadow: 0 0 10px rgba(0, 172, 193, 0.4);
            }

            /* GRID DE BOTONES 2x2 */
            .slot-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                background: rgba(0,0,0,0.3);
                padding: 10px;
                border-radius: 12px;
            }

            .implant-slot {
                background: #0d161c;
                border: 1px dashed #4dd0e1;
                padding: 10px;
                border-radius: 8px;
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
                font-size: 9px;
                color: #4dd0e1;
                margin-bottom: 2px;
                text-transform: uppercase;
                pointer-events: none;
            }

            .implant-slot .item-name {
                font-size: 11px;
                font-weight: bold;
                pointer-events: none;
            }

            #lab-inventory-selector {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 380px;
                background: #1a2a36;
                border: 2px solid #00acc1;
                border-radius: 15px;
                padding: 20px;
                z-index: 10000; 
                display: none;
                box-shadow: 0 0 100px rgba(0,0,0,0.9);
            }

            .btn-lab-back {
                padding: 12px !important;
                margin: 10px auto 0 auto !important;
                font-size: 12px !important;
                width: 100% !important;
                max-width: 480px !important;
                display: block !important;
                position: relative !important;
                left: auto !important;
                bottom: auto !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    renderBase: function() {
        const screen = document.getElementById("implants-area");
        if (!screen) return;

        screen.classList.add("implants-screen");

        if (screen.innerHTML.includes("LABORATORIO DE IMPLANTES")) return;

        screen.innerHTML = `
            <div class="lab-container">
                <h2>LABORATORIO DE IMPLANTES</h2>
                
                <div class="geno-scanner">
                    <div class="preview-wrapper">
                        <div class="scanner-line"></div>
                        <div id="implants-geno-preview"></div>
                    </div>
                    <div id="implants-geno-stats"></div>
                </div>

                <div class="control-panel">
                    <div class="lab-tabs">
                        <div class="lab-tab active" onclick="ImplantsManager.setTab('combat')">ATAQUES</div>
                        <div class="lab-tab" onclick="ImplantsManager.setTab('cosmetic')">FÍSICO</div>
                    </div>

                    <div id="combat-slots" class="slot-grid">
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('atk_1')">
                            <label>Básico</label>
                            <span class="item-name" id="slot-atk-1">VACÍO</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('atk_2')">
                            <label>Técnica</label>
                            <span class="item-name" id="slot-atk-2">VACÍO</span>
                        </div>
                        <div class="implant-slot" onclick="ImplantsManager.openSelector('atk_3')">
                            <label>Soporte</label>
                            <span class="item-name" id="slot-atk-3">VACÍO</span>
                        </div>
                        <div class="implant-slot" style="border-color: #555; cursor: not-allowed; opacity: 0.6;">
                            <label style="color:#555;">Definitivo</label>
                            <span class="item-name" style="color:#888;">🔒 Nv. 25+</span>
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

                <button onclick="ImplantsManager.closeLab()" class="btn-secondary btn-lab-back">VOLVER AL NEXO</button>
            </div>

            <div id="lab-inventory-selector">
                <h3 id="selector-title" style="color:#4dd0e1; margin-top:0; font-size:16px; text-align:center;">SELECCIONAR</h3>
                <div id="lab-inventory-list" style="max-height:250px; overflow-y:auto; margin-bottom:15px; border:1px solid #334; border-radius:8px; padding:10px;"></div>
                <button onclick="ImplantsManager.closeSelector()" class="btn-secondary" style="width:100%; padding:10px;">CERRAR</button>
            </div>
        `;
    }
};