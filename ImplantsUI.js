// =========================================
// ImplantsUI.js - INTERFAZ DEL LABORATORIO V9 (FIX CONTENEDOR NATIVO)
// =========================================

window.ImplantsUI = {
    inyectarCSS: function() {
        if (document.getElementById("implants-styles")) return;
        const style = document.createElement("style");
        style.id = "implants-styles";
        style.innerHTML = `
            /* El secreto: que todo calcule sus márgenes hacia adentro */
            .implants-screen, .implants-screen * {
                box-sizing: border-box !important;
            }

            /* Respetamos tu .app-screen, solo añadimos fondo, padding y scroll */
            .implants-screen {
                background-color: #0d161c !important; 
                background-image: radial-gradient(circle at center, #1a2a36 0%, #0d161c 100%) !important;
                padding: 15px !important;
                padding-bottom: 20px !important; 
                color: #e0f7fa !important;
                overflow-y: auto !important; 
                overflow-x: hidden !important; 
                z-index: 5000 !important; 
                -ms-overflow-style: none !important;  
                scrollbar-width: none !important;  
            }

            /* Ocultar barra lateral de scroll */
            #implants-area::-webkit-scrollbar, 
            .implants-screen::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                background: transparent !important;
            }

            .lab-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                width: 100%;
                max-width: 600px; /* Centrado en PC, ancho total en móvil */
                margin: 0 auto;
            }

            .geno-scanner {
                width: 100%;
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid #00acc1;
                border-radius: 16px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-shadow: 0 0 30px rgba(0, 172, 193, 0.2);
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
                width: 60%;
                height: 2px;
                background: rgba(77, 208, 225, 0.5);
                left: 20%;
                box-shadow: 0 0 15px #4dd0e1;
                animation: scanMove 3s infinite linear;
                z-index: 10;
                pointer-events: none; 
            }

            @keyframes scanMove {
                0% { top: 5%; opacity: 0; }
                50% { opacity: 1; }
                90% { top: 90%; opacity: 0; }
                100% { top: 90%; opacity: 0; }
            }

            #implants-geno-preview {
                width: 150px;
                height: 150px;
                filter: drop-shadow(0 0 10px rgba(77, 208, 225, 0.4));
                z-index: 2;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .geno-lab-name {
                text-align: center;
                font-weight: bold;
                color: #fff;
                font-size: 14px;
                text-transform: uppercase;
                margin-bottom: 10px;
                word-break: break-word;
            }
            .geno-lab-name span { color: #4dd0e1; font-size: 11px; }
            
            .geno-lab-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                font-size: 12px;
                color: #80deea;
                text-align: center;
                gap: 8px;
                width: 100%;
            }
            .geno-lab-stats div {
                background: rgba(0,0,0,0.5);
                padding: 8px;
                border-radius: 6px;
                border: 1px solid #333;
            }

            .control-panel {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .lab-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 5px;
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
                font-size: 13px;
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
                padding: 12px;
                border-radius: 12px;
            }

            .implant-slot {
                background: #0d161c;
                border: 1px dashed #4dd0e1;
                padding: 12px;
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
                font-size: 12px;
                font-weight: bold;
            }

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
                z-index: 10000; 
                display: none;
                box-shadow: 0 0 100px rgba(0,0,0,0.9);
            }

            /* ========================================= */
            /* COMPRESIÓN PARA MÓVIL RESPETANDO TU APP-SCREEN */
            /* ========================================= */
            @media (max-width: 850px) {
                .implants-screen {
                    padding: 15px !important;
                }
                .implants-screen h2 {
                    font-size: 16px !important;
                    letter-spacing: 1px !important;
                    margin-bottom: 5px !important;
                }
                .lab-subtitle {
                    display: none !important; 
                }
                .lab-container {
                    gap: 10px !important;
                }
                .geno-scanner {
                    padding: 15px !important;
                    border-radius: 12px !important;
                }
                #implants-geno-preview {
                    width: 110px !important; 
                    height: 110px !important;
                }
                .geno-lab-name {
                    margin-bottom: 6px !important;
                    font-size: 12px !important;
                }
                .geno-lab-stats {
                    gap: 6px !important; 
                }
                .geno-lab-stats div {
                    padding: 6px !important; 
                    font-size: 11px !important;
                }
                .control-panel {
                    gap: 10px !important; 
                }
                .lab-tab {
                    padding: 10px !important; 
                    font-size: 12px !important;
                }
                .slot-grid {
                    padding: 10px !important;
                    gap: 10px !important;
                }
                .implant-slot {
                    padding: 10px !important; 
                    border-radius: 8px !important;
                }
                .implant-slot label {
                    font-size: 9px !important;
                    margin-bottom: 4px !important;
                }
                .implant-slot .item-name {
                    font-size: 11px !important; 
                }
                .btn-lab-back {
                    padding: 12px !important; 
                    margin: 15px auto 0 auto !important;
                    font-size: 12px !important;
                }
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
            <h2 style="text-align:center; color:#4dd0e1; letter-spacing:3px; margin-top:0;">LABORATORIO DE IMPLANTES</h2>
            <p class="lab-subtitle" style="text-align: center; color: #888; font-size: 12px; margin-bottom: 15px;">Instala Módulos de Combate y Mejoras Físicas.</p>
            
            <div class="lab-container">
                <div class="geno-scanner">
                    <div class="preview-wrapper">
                        <div class="scanner-line"></div>
                        <div id="implants-geno-preview"></div>
                    </div>
                    <div id="implants-geno-stats" style="margin-top:5px; width:100%;"></div>
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
                        <div class="implant-slot" style="border-color: #555; cursor: not-allowed;">
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
            </div>

            <div id="lab-inventory-selector">
                <h3 id="selector-title" style="color:#4dd0e1; margin-top:0;">Seleccionar Implante</h3>
                <div id="lab-inventory-list" style="max-height:300px; overflow-y:auto; margin-bottom:15px;"></div>
                <button onclick="ImplantsManager.closeSelector()" class="btn-secondary btn-lab-back" style="width:100%; position:relative; display:block; margin:0;">CERRAR</button>
            </div>

            <button onclick="ImplantsManager.closeLab()" class="btn-secondary btn-lab-back" style="position:relative; display:block; width: 100%; max-width: 600px; margin: 15px auto 10px auto;">VOLVER AL NEXO</button>
        `;
    }
};