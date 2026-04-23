// =========================================
// ColiseumManager.js - MOTOR DE COMBATE V9.2.4 (SISTEMA DE HABILIDADES Y COOLDOWNS)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. INYECTAR ESTILOS GLOBALES
    if (!document.getElementById("coliseum-final-polish-styles")) {
        const style = document.createElement("style");
        style.id = "coliseum-final-polish-styles";
        style.innerHTML = `
            /* FONDO TURQUESA GLOBAL */
            .coliseum-cyan-theme {
                background-color: #31c4d8 !important;
                background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.06) 2px, rgba(0, 0, 0, 0.06) 4px) !important;
                background-size: auto !important;
                min-height: 100vh !important;
                padding-top: 20px !important; 
                box-sizing: border-box !important;
            }

            /* ANIMACIÓN DE LUZ DE NEÓN PARA LA ARENA */
            @keyframes arenaGlow {
                0% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 0.6); }
                50% { box-shadow: 0 0 40px rgba(77, 208, 225, 1), 0 0 10px rgba(255, 255, 255, 0.7), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 1); }
                100% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 0.6); }
            }

            /* CAJA OSCURA PRINCIPAL */
            #battle-area {
                background-color: rgba(13, 22, 30, 0.95) !important; 
                border: 2px solid #4dd0e1 !important; 
                border-radius: 16px !important;
                padding: 20px !important; 
                position: relative;
                overflow: hidden !important; 
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                width: 92% !important; 
                max-width: 500px !important;
                margin: 0 auto !important; 
                box-sizing: border-box !important;
                animation: arenaGlow 3s infinite ease-in-out !important; 
            }

            /* TÍTULO DENTRO DE LA CAJA */
            .coliseum-title-inside {
                color: #4dd0e1 !important;
                text-align: center !important;
                font-size: 18px !important;
                margin-top: 0 !important;
                margin-bottom: 20px !important;
                text-transform: uppercase !important;
                font-weight: bold !important;
                letter-spacing: 2px !important;
                width: 100% !important;
                border-bottom: 1px dashed rgba(77, 208, 225, 0.3);
                padding-bottom: 10px;
                display: block !important;
            }
            
            /* PANELES DE LOS LUCHADORES */
            .fighters-wrapper {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                width: calc(100% + 40px) !important; 
                margin: 0 -20px 15px -20px !important; 
            }

            #player-sprite-battle, #enemy-sprite-battle { 
                background: rgba(45, 65, 85, 0.6) !important; 
                padding: 15px 10px !important; 
                width: 44% !important; 
                position: relative; 
                transition: 0.3s; 
                border: 1px solid rgba(255,255,255,0.15) !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-end !important;
                align-items: center !important;
                min-height: 230px !important; 
                backdrop-filter: blur(2px);
            }
            
            #player-sprite-battle { 
                border-top: 3px solid #4dd0e1 !important; 
                border-bottom: 3px solid #4dd0e1 !important; 
                border-radius: 0 12px 12px 0 !important; 
                border-left: none !important;
            }
            #enemy-sprite-battle { 
                border-top: 3px solid #ff6b6b !important; 
                border-bottom: 3px solid #ff6b6b !important; 
                border-radius: 12px 0 0 12px !important; 
                border-right: none !important;
            }
            
            /* CAJAS DE LOS GENOS */
            #player-visual-box, #enemy-visual-box {
                width: 120px !important; 
                height: 120px !important; 
                margin: 0 auto auto auto !important; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                position: relative;
                overflow: visible !important; 
            }
            #player-visual-box svg, #enemy-visual-box svg { width: 100% !important; height: 100% !important; overflow: visible !important; }

            /* TIPOGRAFÍA DE NOMBRES */
            #battle-player-name, #battle-enemy-name { 
                font-size: 13px !important; 
                text-transform: uppercase; 
                letter-spacing: 1px; 
                margin-top: 15px !important; 
                text-align: center !important;
                width: 100% !important;
                line-height: 1.3 !important;
            }
            #battle-player-name { color: #4dd0e1 !important; }
            #battle-enemy-name { color: #ff6b6b !important; }

            /* BARRAS DE HP NEON */
            #player-sprite-battle > div:nth-child(3), #enemy-sprite-battle > div:nth-child(3) {
                background: #000 !important;
                border: 1px solid #333 !important;
                box-shadow: inset 0 0 5px rgba(0,0,0,0.8) !important;
                height: 12px !important;
                border-radius: 6px !important;
                width: 90% !important;
                margin: 8px auto 0 auto !important;
            }
            #player-hp-bar { background: linear-gradient(90deg, #00d2ff, #4dd0e1) !important; box-shadow: 0 0 10px rgba(77,208,225,0.6) !important; }
            #enemy-hp-bar { background: linear-gradient(90deg, #ff6b6b, #d9534f) !important; box-shadow: 0 0 10px rgba(255,107,107,0.6) !important; }
            #player-hp-text, #enemy-hp-text { font-size: 11px !important; color: #fff !important; font-weight: bold; margin-top: 4px !important; text-shadow: 0 1px 2px #000; text-align: center; width: 100%; }

            /* LOG DE BATALLA HACKER */
            #battle-log { 
                background: #0d161c !important; 
                border: 1px solid #1e3a5f !important; 
                border-left: 4px solid #4dd0e1 !important; 
                border-right: 4px solid #ff6b6b !important; 
                color: #00ffcc !important; 
                border-radius: 8px !important; 
                font-family: 'Courier New', monospace !important; 
                font-size: 12px !important; 
                padding: 15px !important; 
                box-shadow: inset 0 0 15px rgba(0,0,0,0.8) !important; 
                margin-top: 10px !important;
                height: 130px !important;
                overflow-y: scroll !important;
                -ms-overflow-style: none;  
                scrollbar-width: none;  
                width: 100%;
                box-sizing: border-box;
            }
            #battle-log::-webkit-scrollbar { display: none !important; }

            /* CONTENEDOR DE BOTONES DINÁMICO */
            #battle-controls {
                width: 100% !important;
                display: flex; 
                gap: 8px !important;
                justify-content: center !important;
                margin-top: 15px !important;
            }

            /* NUEVOS BOTONES DE COMBATE (RECTANGULARES Y MÁS PEQUEÑOS) */
            .battle-btn {
                flex: 1 !important;
                padding: 10px 5px !important; /* Mitad de tamaño vertical */
                border-radius: 8px !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
                transition: 0.2s !important;
                font-weight: 900 !important;
                font-size: 11px !important;
                color: white !important;
                cursor: pointer !important;
                border: 1px solid transparent !important;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important;
            }
            .atk-btn { background: linear-gradient(90deg, #ff5722, #d84315) !important; border-color: #ff9800 !important; box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3) !important; }
            .special-btn { background: linear-gradient(90deg, #9c27b0, #6a1b9a) !important; border-color: #e040fb !important; box-shadow: 0 4px 10px rgba(156, 39, 176, 0.3) !important; }
            .buff-btn { background: linear-gradient(90deg, #009688, #00695c) !important; border-color: #26a69a !important; box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3) !important; }
            
            .battle-btn:active { transform: scale(0.95) !important; }
            .battle-btn:disabled { background: #333 !important; border-color: #555 !important; box-shadow: none !important; color: #888 !important; transform: none !important; cursor: not-allowed !important; text-shadow: none !important; }

            #btn-start-battle { 
                background: linear-gradient(90deg, #E91E63, #C2185B) !important; 
                box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4) !important; 
                border: 1px solid #F48FB1 !important; 
                color: white !important; 
                border-radius: 8px !important; 
                text-transform: uppercase; 
                letter-spacing: 1px; 
                transition: 0.2s; 
                padding: 15px 30px !important; 
                font-weight: bold !important; 
                cursor: pointer; 
                width: 100%; 
                margin-top: 15px !important;
                display: none;
            }

            /* BOTÓN DE RETIRADA (ESTILO COHERENTE CON CRIANZA) */
            #btn-leave-battle {
                background-color: #111b24 !important; 
                border: 1px solid #1e3a5f !important; 
                color: #4dd0e1 !important; 
                padding: 15px 30px !important;
                border-radius: 8px !important;
                text-transform: uppercase !important;
                font-weight: bold !important;
                letter-spacing: 1px !important;
                cursor: pointer !important;
                margin: 20px auto !important; 
                display: block !important;
                transition: 0.2s !important;
                width: max-content !important;
                box-shadow: none !important; 
                animation: none !important; 
            }
            #btn-leave-battle:hover { background-color: #1e3a5f !important; color: #fff !important; }
            
            /* ANIMACIONES Y EFECTOS FLOTANTES */
            @keyframes floatUpFade { 0% { opacity: 1; transform: translateY(0) scale(1.5); } 10% { transform: translateY(-10px) scale(1.8); } 100% { opacity: 0; transform: translateY(-80px) scale(1); } }
            .floating-text { position: absolute; font-weight: 900; z-index: 100; pointer-events: none; animation: floatUpFade 1.3s ease-out forwards; text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 5px rgba(0,0,0,0.8); }
            .text-dmg { color: #ff3333; font-size: 28px; }
            .text-heal { color: #4CAF50; font-size: 24px; }
            .text-crit { color: #ffcc00; font-size: 32px; font-style: italic; text-transform: uppercase; letter-spacing: 2px; }
            .hit-effect { filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5); transform: scale(0.90); transition: 0.1s; }
            .vs-badge-battle { font-size: 28px !important; font-weight: 900 !important; font-style: italic !important; color: #ffcc00 !important; text-shadow: 0 0 20px rgba(255,0,0,0.8) !important; z-index: 2; margin: 0 10px !important; }
        `;
        document.head.appendChild(style);
    }

    // VARIABLES GLOBALES DE COMBATE
    let playerCombat = null;
    let enemyCombat = null;
    let numeroTurno = 1;
    let cooldownEspecial = 0; // NUEVO: Contador de turnos para el ataque especial

    // =========================================
    // OBTENER ELEMENTOS DE LA UI DE FORMA SEGURA
    // =========================================
    function getUI() {
        return {
            log: document.getElementById("battle-log"),
            btnStart: document.getElementById("btn-start-battle"),
            btnLeave: document.getElementById("btn-leave-battle"),
            controls: document.getElementById("battle-controls"),
            area: document.getElementById("battle-area"),
        };
    }

    function scrollToBottom() { const ui = getUI(); if(ui.log) ui.log.scrollTop = ui.log.scrollHeight; }
    function addLog(text) { const ui = getUI(); if(ui.log) { ui.log.innerHTML += `<div style="margin-top: 6px;">${text}</div>`; scrollToBottom(); } }

    function sacudirPantalla() {
        const ui = getUI();
        if(ui.area) {
            ui.area.classList.remove("shake-effect");
            void ui.area.offsetWidth; 
            ui.area.classList.add("shake-effect");
            setTimeout(() => ui.area.classList.remove("shake-effect"), 400);
        }
    }

    function efectoCuracion(elementId) {
        const el = document.getElementById(elementId);
        if(el) {
            el.classList.remove("heal-effect");
            void el.offsetWidth;
            el.classList.add("heal-effect");
            setTimeout(() => el.classList.remove("heal-effect"), 600);
        }
    }

    function mostrarTextoFlotante(esJugador, texto, claseAdicional, delayMs = 0) {
        const sideId = esJugador ? "player-sprite-battle" : "enemy-sprite-battle";
        const sideEl = document.getElementById(sideId);
        if(!sideEl) return;
        
        setTimeout(() => {
            const floater = document.createElement("div");
            floater.className = `floating-text ${claseAdicional}`;
            floater.innerText = texto;
            const offsetX = (Math.random() - 0.5) * 80; 
            const offsetY = (Math.random() - 0.5) * 40;
            floater.style.top = `calc(20% + ${offsetY}px)`;
            floater.style.left = `calc(50% + ${offsetX}px)`;
            floater.style.transform = "translate(-50%, -50%)";
            sideEl.appendChild(floater);
            setTimeout(() => floater.remove(), 1300);
        }, delayMs);
    }

    function flashDamage(esJugador) {
        const sideId = esJugador ? "player-visual-box" : "enemy-visual-box";
        const el = document.getElementById(sideId);
        if(el) {
            el.classList.add("hit-effect"); 
            setTimeout(() => el.classList.remove("hit-effect"), 150);
        }
    }

    function actualizarUICombate(p, esJugador) {
        const prefix = esJugador ? "player" : "enemy";
        const max = (p && p.maxHp > 0) ? p.maxHp : 1; 
        const current = (p && p.hp >= 0) ? p.hp : 0;
        
        const hpPct = Math.max(0, (current / max) * 100);
        const fillBar = document.getElementById(`${prefix}-hp-bar`);
        
        if (fillBar) {
            fillBar.style.width = `${hpPct}%`;
            if (hpPct > 50) fillBar.style.background = esJugador ? "linear-gradient(90deg, #00d2ff, #4dd0e1)" : "linear-gradient(90deg, #ff6b6b, #d9534f)";
            else if (hpPct > 20) fillBar.style.background = "linear-gradient(90deg, #ffca28, #f57f17)";
            else fillBar.style.background = "linear-gradient(90deg, #f44336, #b71c1c)";
        }
        
        const txtHp = document.getElementById(`${prefix}-hp-text`);
        if (txtHp) txtHp.innerText = `${Math.floor(current)} / ${Math.floor(max)}`;

        const sprite = document.getElementById(`${prefix}-sprite-battle`);
        if (sprite) {
            if (current <= 0) sprite.style.filter = "grayscale(1) brightness(0.3)";
            else sprite.style.filter = "none";
        }
    }

    function obtenerMultiplicadorElemental(atkElement, defElement) {
        const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
        if (ventajas[atkElement] === defElement) return 1.5; 
        if (ventajas[defElement] === atkElement) return 0.5; 
        return 1.0; 
    }

    function inyectarSvgSeguro(adnData) {
        if (typeof generarSvgGeno !== 'function') return '';
        let svgString = generarSvgGeno(adnData);
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgString;
        let svgEl = tempDiv.querySelector('svg');
        if (svgEl) {
            svgEl.setAttribute('width', '100%');
            svgEl.setAttribute('height', '100%');
            svgEl.setAttribute('viewBox', '-20 0 200 160');
            svgEl.style.overflow = 'visible';
        }
        return tempDiv.innerHTML;
    }

    // =========================================
    // INICIALIZACIÓN PRINCIPAL (ESTADO 1: ESPERANDO)
    // =========================================
    window.iniciarColiseo = function() {
        const ui = getUI();

        if (!window.miMascota || window.miMascota.id === "temp") {
            alert("No tienes un Geno activo para combatir.");
            window.navegarA("room-area");
            return;
        }

        // --- APLICAR DISEÑO Y UNIFICAR ELEMENTOS ---
        if (ui.area) {
            let currentScreen = ui.area.closest('.screen, .coliseum-screen, .view') || ui.area.parentElement;
            if (currentScreen) {
                currentScreen.classList.add("coliseum-cyan-theme");
                let title = currentScreen.querySelector("h2, h1");
                if(title && title.id !== "battle-player-name" && title.id !== "battle-enemy-name" && title.parentElement !== ui.area) {
                    title.classList.add("coliseum-title-inside");
                    ui.area.insertBefore(title, ui.area.firstChild);
                }
            }

            const flexContainer = ui.area.querySelector("div");
            if (flexContainer) {
                flexContainer.classList.add("fighters-wrapper");
                for (let i = 0; i < flexContainer.children.length; i++) {
                    if (flexContainer.children[i].innerText.includes("VS")) {
                        flexContainer.children[i].className = "vs-badge-battle";
                    }
                }
            }

            if (ui.controls && ui.controls.parentElement !== ui.area) {
                ui.area.appendChild(ui.controls);
            }
            if (ui.btnStart && ui.btnStart.parentElement !== ui.area) {
                ui.area.appendChild(ui.btnStart);
            }
            if (ui.btnLeave && currentScreen && ui.btnLeave.parentElement !== currentScreen) {
                currentScreen.appendChild(ui.btnLeave); // Botón salir fuera
            }
        }

        // --- INYECCIÓN DINÁMICA DE LOS 3 BOTONES DE COMBATE ---
        if (ui.controls) {
            ui.controls.innerHTML = `
                <button id="btn-action-atk" class="battle-btn atk-btn">⚔️ ATACAR</button>
                <button id="btn-action-special" class="battle-btn special-btn">✨ ESPECIAL</button>
                <button id="btn-action-buff" class="battle-btn buff-btn">🛡️ TÁCTICA</button>
            `;
            // Asignar Event Listeners directamente
            document.getElementById("btn-action-atk").onclick = () => ejecutarRonda("ataque");
            document.getElementById("btn-action-special").onclick = () => ejecutarRonda("especial");
            document.getElementById("btn-action-buff").onclick = () => ejecutarRonda("tactica");
        }
        // --------------------------------------------------------

        document.getElementById("player-visual-box").innerHTML = "";
        document.getElementById("enemy-visual-box").innerHTML = "";
        
        const pNameEl = document.getElementById("battle-player-name");
        if(pNameEl) pNameEl.innerText = "Tu Geno";
        
        const eNameEl = document.getElementById("battle-enemy-name");
        if(eNameEl) eNameEl.innerText = "---";
        else {
            const enemyBox = document.getElementById("enemy-sprite-battle");
            if (enemyBox) {
                const textDivs = enemyBox.querySelectorAll("div");
                if (textDivs.length > 1) textDivs[1].innerText = "---";
            }
        }

        document.getElementById("player-hp-bar").style.width = "100%";
        document.getElementById("enemy-hp-bar").style.width = "100%";
        document.getElementById("player-hp-text").innerText = "HP";
        document.getElementById("enemy-hp-text").innerText = "HP";
        
        if(ui.log) ui.log.innerHTML = `<span style="color:#aaa;">> Conectando con los servidores del Coliseo...</span><br><span style="color:#4dd0e1">> Arena lista. Esperando combatientes.</span>`;
        
        // --- MOSTRAR START Y OCULTAR CONTROLES FORZOSAMENTE ---
        if(ui.btnStart) ui.btnStart.style.setProperty("display", "block", "important");
        if(ui.btnLeave) ui.btnLeave.style.setProperty("display", "block", "important");
        if(ui.controls) ui.controls.style.setProperty("display", "none", "important");
        
        cooldownEspecial = 0; // Reiniciar estado
    };

    // =========================================
    // INICIAR COMBATE (ESTADO 2: PELEANDO)
    // =========================================
    const btnStartElement = document.getElementById("btn-start-battle");
    if(btnStartElement) {
        btnStartElement.addEventListener("click", () => {
            const ui = getUI();
            try {
                if(ui.log) ui.log.innerHTML = "";
                addLog(`<span style="color:#4dd0e1">> INICIALIZANDO SECUENCIA DE COMBATE...</span>`);
                
                document.getElementById("player-sprite-battle").style.filter = "none";
                document.getElementById("enemy-sprite-battle").style.filter = "none";
                numeroTurno = 1;
                cooldownEspecial = 0;

                actualizarBotonesCombate(); // Habilitar botones nuevos

                // JUGADOR
                const pMascota = window.miMascota;
                const pElemento = (pMascota.genes && pMascota.genes.afinidad) ? pMascota.genes.afinidad.dom : (pMascota.element || "Normal");
                
                let pGenB = "ninguno"; let pGenC = "ninguno";
                if (pMascota.hidden_genes) {
                    if (pMascota.hidden_genes.B) pGenB = pMascota.hidden_genes.B.id;
                    if (pMascota.hidden_genes.C) pGenC = pMascota.hidden_genes.C.id;
                }
                
                const pStats = pMascota.stats || {hp: 80, atk: 15, spd: 15, luk: 10};

                playerCombat = {
                    nombre: pMascota.name || "Tu Geno",
                    isPlayer: true,
                    maxHp: pStats.hp, hp: pStats.hp, atk: pStats.atk, spd: pStats.spd, luk: pStats.luk,
                    element: pElemento,
                    genesId: [pGenB, pGenC],
                    crystalSkin: pGenB === "piel_cristal" || pGenC === "piel_cristal",
                    resilienciaUsada: false, barreraUsada: false,
                    ultimoElementoRecibido: null, sangreFriaUsada: false,
                    escudoCibernetico: pElemento === "Cibernético", estados: []
                };

                // ENEMIGO PROCEDURAL
                const eRareza = pMascota.rarity || "Común";
                const eStats = window.generarStatsPorRareza ? window.generarStatsPorRareza(eRareza) : {hp: 50, atk: 15, spd: 15, luk: 15};
                const elementosBase = ["Biomutante", "Viral", "Cibernético", "Radiactivo", "Tóxico", "Sintético"];
                const eElemento = elementosBase[Math.floor(Math.random() * elementosBase.length)];
                
                const formasCuerpo = ["gota", "frijol", "circulo", "cuadrado", "triangulo", "hongo", "estrella", "pentagono", "nube", "chili", "rayo"];
                const coloresRival = ["#ff6b6b", "#4dd0e1", "#fdfd96", "#b19cd9", "#77DD77", "#ff9800", "#ffb347", "#a8e6cf"];
                const eColor = coloresRival[Math.floor(Math.random() * coloresRival.length)];
                const eForma = formasCuerpo[Math.floor(Math.random() * formasCuerpo.length)];

                let eHiddenGenes = {A: null, B: null, C: null};
                if (typeof window.generarGenesV9 === 'function') eHiddenGenes = window.generarGenesV9(eRareza);

                const eAdn = { 
                    id: 888, scanned: true, rarity: eRareza, stats: eStats, element: eElemento,
                    body_shape: eForma, base_color: eColor, color: eColor,
                    eye_type: "angry", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno",
                    hidden_genes: eHiddenGenes 
                };

                const eGenB_id = eHiddenGenes.B ? eHiddenGenes.B.id : "ninguno";
                const eGenC_id = eHiddenGenes.C ? eHiddenGenes.C.id : "ninguno";

                enemyCombat = {
                    nombre: "Rival Salvaje", isPlayer: false,
                    maxHp: eAdn.stats.hp, hp: eAdn.stats.hp, atk: eAdn.stats.atk, spd: eAdn.stats.spd, luk: eAdn.stats.luk,
                    element: eAdn.element,
                    genesId: [eGenB_id, eGenC_id],
                    crystalSkin: eGenB_id === "piel_cristal" || eGenC_id === "piel_cristal",
                    resilienciaUsada: false, barreraUsada: false,
                    ultimoElementoRecibido: null, sangreFriaUsada: false,
                    escudoCibernetico: eElemento === "Cibernético", estados: []
                };

                document.getElementById("player-visual-box").innerHTML = inyectarSvgSeguro(pMascota);
                document.getElementById("enemy-visual-box").innerHTML = inyectarSvgSeguro(eAdn);

                const pNameEl = document.getElementById("battle-player-name");
                if(pNameEl) pNameEl.innerHTML = `<strong>${playerCombat.nombre}</strong><br><span style="color:#aaa; font-size:10px;">(Nv. ${pMascota.level || 1})</span>`;
                
                const eNameEl = document.getElementById("battle-enemy-name");
                if(eNameEl) eNameEl.innerHTML = `<strong>Rival ${eRareza}</strong><br><span style="color:#aaa; font-size:10px;">(${eElemento})</span>`;
                else {
                    const enemyBox = document.getElementById("enemy-sprite-battle");
                    if (enemyBox) {
                        const textDivs = enemyBox.querySelectorAll("div");
                        if (textDivs.length > 1) textDivs[1].innerHTML = `<strong>Rival ${eRareza}</strong><br><span style="color:#aaa; font-size:10px;">(${eElemento})</span>`;
                    }
                }

                actualizarUICombate(playerCombat, true);
                actualizarUICombate(enemyCombat, false);

                // --- MOSTRAR CONTROLES Y OCULTAR BOTÓN DE INICIO FORZOSAMENTE ---
                if(ui.btnStart) ui.btnStart.style.setProperty("display", "none", "important");
                if(ui.controls) ui.controls.style.setProperty("display", "flex", "important");
                
                addLog(`<br><span style="color:#ffcc00; font-weight:bold;">--- BATTLE START ---</span>`);
                
            } catch (error) {
                console.error("Error crítico al iniciar combate:", error);
                addLog(`<span style="color:#ff3333">> ERROR DEL SISTEMA. Revisa la consola.</span>`);
            }
        });
    }

    // =========================================
    // LÓGICA DE TURNOS Y HABILIDADES
    // =========================================
    
    function actualizarBotonesCombate() {
        const btnAtk = document.getElementById("btn-action-atk");
        const btnSpecial = document.getElementById("btn-action-special");
        const btnBuff = document.getElementById("btn-action-buff");

        if (btnAtk) btnAtk.disabled = false;
        if (btnBuff) btnBuff.disabled = false;

        if (btnSpecial) {
            if (cooldownEspecial > 0) {
                btnSpecial.disabled = true;
                btnSpecial.innerText = `⏳ ESPERA (${cooldownEspecial})`;
            } else {
                btnSpecial.disabled = false;
                btnSpecial.innerText = `✨ ESPECIAL`;
            }
        }
    }

    function deshabilitarBotones() {
        ["btn-action-atk", "btn-action-special", "btn-action-buff"].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = true;
        });
    }

    function ejecutarRonda(accionJugador) {
        addLog(`<br><span style="color:#4dd0e1">[TURNO ${numeroTurno}]</span>`);
        deshabilitarBotones();
        
        let playerGoesFirst = playerCombat.spd >= enemyCombat.spd;
        if (playerCombat.spd === enemyCombat.spd) playerGoesFirst = Math.random() > 0.5;

        let ejecutor1 = playerGoesFirst ? playerCombat : enemyCombat;
        let ejecutor2 = playerGoesFirst ? enemyCombat : playerCombat;
        let accion1 = playerGoesFirst ? accionJugador : "ataque";
        let accion2 = playerGoesFirst ? "ataque" : accionJugador;

        ejecutarAccion(ejecutor1, ejecutor2, accion1);
        
        if (ejecutor2.hp > 0) {
            setTimeout(() => {
                ejecutarAccion(ejecutor2, ejecutor1, accion2);
                finalizarRonda();
            }, 800);
        } else {
            finalizarRonda();
        }

        function finalizarRonda() {
            setTimeout(() => {
                procesarEfectosFinTurno(playerCombat);
                procesarEfectosFinTurno(enemyCombat);
                
                if (cooldownEspecial > 0) cooldownEspecial--;
                numeroTurno++;
                
                setTimeout(checkEndGame, 600);
            }, 800);
        }
    }

    function ejecutarAccion(atacante, defensor, accionElegida) {
        if (atacante.hp <= 0 || defensor.hp <= 0) return;

        if (atacante.isPlayer) {
            if (accionElegida === "especial") {
                cooldownEspecial = 3;
                addLog(`<span style="color:#e040fb">> ¡${atacante.nombre} usa un ATAQUE ESPECIAL!</span>`);
                let atkOriginal = atacante.atk;
                atacante.atk = Math.floor(atacante.atk * 1.5); // 50% extra dmg
                procesarAtaque(atacante, defensor);
                atacante.atk = atkOriginal;
            } else if (accionElegida === "tactica") {
                addLog(`<span style="color:#26a69a">> ¡${atacante.nombre} aplica una TÁCTICA!</span>`);
                // Placeholder buff: Cura un 15%
                let cura = Math.floor(atacante.maxHp * 0.15); 
                if (cura < 1) cura = 1;
                atacante.hp = Math.min(atacante.maxHp, atacante.hp + cura);
                mostrarTextoFlotante(true, `+${cura}`, "text-heal");
                addLog(`<span style="color:#4CAF50">* Recupera ${cura} HP y prepara su estrategia.</span>`);
                efectoCuracion("player-sprite-battle");
                actualizarUICombate(atacante, true);
            } else {
                procesarAtaque(atacante, defensor); // Ataque normal
            }
        } else {
            procesarAtaque(atacante, defensor); // Enemigo siempre ataca normal por ahora
        }
    }

    function procesarAtaque(atacante, defensor) {
        if (atacante.hp <= 0 || defensor.hp <= 0) return;

        let ataques = 1;
        if (atacante.genesId.includes("velocidad_fantasma") && Math.random() <= 0.20) {
            ataques = 2;
            addLog(`<span style="color:#b19cd9">* [Velocidad Fantasma] ¡${atacante.nombre} ataca rápido dos veces!</span>`);
        }

        for(let i=0; i<ataques; i++) {
            if (defensor.hp <= 0) break;

            let dmg = Math.floor(atacante.atk * (i === 1 ? 0.5 : 1) * (0.85 + Math.random() * 0.3));
            let multElem = obtenerMultiplicadorElemental(atacante.element, defensor.element);
            dmg = Math.floor(dmg * multElem);

            let probCrit = 0.05 + (atacante.luk * 0.002);
            if (atacante.element === "Sintético") probCrit += 0.15;
            let isCrit = Math.random() <= probCrit;
            if (isCrit) dmg = Math.floor(dmg * 1.5);

            if (defensor.escudoCibernetico) {
                dmg = Math.floor(dmg * 0.60);
                defensor.escudoCibernetico = false;
                addLog(`<span style="color:#00d2ff">* [Escudo Cibernético] ${defensor.nombre} absorbe 40% del primer impacto.</span>`);
            }

            if (defensor.genesId.includes("armadura_adaptativa")) {
                if (defensor.ultimoElementoRecibido === atacante.element) {
                    dmg = Math.floor(dmg * 0.6);
                    addLog(`<span style="color:#77DD77">* [Armadura Adaptativa] ¡Resiste el ataque de ${atacante.element}! (-40% Daño)</span>`);
                }
                defensor.ultimoElementoRecibido = atacante.element;
            }

            if (defensor.crystalSkin) {
                dmg = 0; defensor.crystalSkin = false;
                addLog(`<span style="color:#80deea">* [Piel de Cristal] ${defensor.nombre} absorbió el impacto (Daño: 0).</span>`);
            } else {
                
                if (defensor.hp - dmg <= 0 && defensor.genesId.includes("barrera_limite") && !defensor.barreraUsada) {
                    dmg = defensor.hp - 1; 
                    defensor.barreraUsada = true;
                    addLog(`<span style="color:#ff5722">* [Barrera Límite] ¡${defensor.nombre} sobrevive a un golpe fatal con 1 HP!</span>`);
                }

                defensor.hp -= dmg;
                if(defensor.hp < 0) defensor.hp = 0;
                
                let tipoGolpe = "";
                if (multElem === 1.5) tipoGolpe = ` <span style="color:#4CAF50; font-weight:bold;">(¡Súper Efectivo!)</span>`;
                else if (multElem === 0.5) tipoGolpe = ` <span style="color:#888; font-weight:bold;">(Poco efectivo...)</span>`;

                if (isCrit) {
                    addLog(`> 💥 <span style="color:#ff0000; font-weight:bold;">¡CRÍTICO!</span> ${atacante.nombre} causa <span style="color:#ff6b6b; font-weight:bold;">${dmg} de daño</span>.${tipoGolpe}`);
                    mostrarTextoFlotante(defensor.isPlayer, "CRITICAL!", "text-crit");
                    mostrarTextoFlotante(defensor.isPlayer, `-${dmg}`, "text-dmg", 150);
                    if(window.Sonidos) window.Sonidos.play("hit"); 
                    sacudirPantalla(); 
                } else {
                    addLog(`> ${atacante.nombre} causa <span style="color:#ff6b6b">${dmg} de daño</span>.${tipoGolpe}`);
                    if (dmg > 0) {
                        mostrarTextoFlotante(defensor.isPlayer, `-${dmg}`, "text-dmg");
                        if(window.Sonidos) window.Sonidos.play("hit"); 
                        sacudirPantalla(); 
                    }
                }
                
                if (dmg > 0) flashDamage(defensor.isPlayer);

                if (dmg > 0) {
                    let efectoAplicar = null;
                    if (atacante.element === "Radiactivo" && Math.random() <= 0.25) efectoAplicar = "Quemadura";
                    if (atacante.element === "Tóxico" && Math.random() <= 0.25) efectoAplicar = "Debilidad";
                    if (atacante.element === "Viral" && Math.random() <= 0.25) efectoAplicar = "Infección";

                    if (efectoAplicar) {
                        if (defensor.genesId.includes("sangre_fria") && !defensor.sangreFriaUsada) {
                            defensor.sangreFriaUsada = true;
                            addLog(`<span style="color:#00d2ff">* [Sangre Fría] ¡${defensor.nombre} inmuniza el estado alterado!</span>`);
                        } else if (!defensor.estados.includes(efectoAplicar)) {
                            defensor.estados.push(efectoAplicar);
                            
                            if (efectoAplicar === "Debilidad") {
                                let atkPerdido = defensor.atk - Math.floor(defensor.atk * 0.8);
                                defensor.atk = Math.floor(defensor.atk * 0.8);
                                addLog(`<span style="color:#ff9800">* ${defensor.nombre} sufre ${efectoAplicar} (-${atkPerdido} ATK).</span>`);
                            } else if (efectoAplicar === "Infección") {
                                let spdPerdida = defensor.spd - Math.floor(defensor.spd * 0.8);
                                defensor.spd = Math.floor(defensor.spd * 0.8);
                                addLog(`<span style="color:#ff9800">* ${defensor.nombre} sufre ${efectoAplicar} (-${spdPerdida} SPD).</span>`);
                            } else {
                                addLog(`<span style="color:#ff9800">* ${defensor.nombre} sufre ${efectoAplicar} (Daño continuo).</span>`);
                            }
                        }
                    }
                }

                let roboVida = 0;
                if (atacante.genesId.includes("vampirismo_genetico") && dmg > 0) {
                    roboVida = Math.floor(dmg * 0.15);
                    if (roboVida < 1) roboVida = 1;
                    atacante.hp += roboVida;
                    if (atacante.hp > atacante.maxHp) atacante.hp = atacante.maxHp;
                    addLog(`<span style="color:#e0b0ff">* [Vampirismo] ${atacante.nombre} se cura ${roboVida} HP.</span>`);
                    mostrarTextoFlotante(atacante.isPlayer, `+${roboVida}`, "text-heal", 200);
                    efectoCuracion(atacante.isPlayer ? "player-sprite-battle" : "enemy-sprite-battle");
                }

                if (isCrit && defensor.genesId.includes("reflejo_genetico") && dmg > 0) {
                    let danoReflejado = Math.floor(dmg * 0.30);
                    if (danoReflejado < 1) danoReflejado = 1;
                    atacante.hp -= danoReflejado;
                    if (atacante.hp < 0) atacante.hp = 0;
                    addLog(`<span style="color:#ffcc00">* [Reflejo] ¡${defensor.nombre} devuelve ${danoReflejado} de daño!</span>`);
                    mostrarTextoFlotante(atacante.isPlayer, `-${danoReflejado}`, "text-dmg", 300);
                    flashDamage(atacante.isPlayer);
                }
            }

            if (defensor.hp > 0 && defensor.hp <= (defensor.maxHp * 0.15) && defensor.genesId.includes("resiliencia_ultima") && !defensor.resilienciaUsada) {
                defensor.resilienciaUsada = true;
                defensor.atk = Math.floor(defensor.atk * 1.4); defensor.spd = Math.floor(defensor.spd * 1.4);
                addLog(`<span style="color:#ffcc00">* [Resiliencia Última] ¡${defensor.nombre} entra en modo Berserker!</span>`);
            }
        }
        actualizarUICombate(atacante, atacante.isPlayer);
        actualizarUICombate(defensor, defensor.isPlayer);
    }

    function procesarEfectosFinTurno(fighter) {
        if (fighter.hp <= 0) return;
        
        if (fighter.element === "Biomutante" && fighter.hp < fighter.maxHp) {
            let regen = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp += regen;
            if (fighter.hp > fighter.maxHp) fighter.hp = fighter.maxHp;
            mostrarTextoFlotante(fighter.isPlayer, `+${regen}`, "text-heal", 500);
            efectoCuracion(fighter.isPlayer ? "player-sprite-battle" : "enemy-sprite-battle");
        }
        
        if (fighter.estados.includes("Quemadura")) {
            let burnDmg = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp -= burnDmg;
            if (fighter.hp < 0) fighter.hp = 0;
            addLog(`<span style="color:#ff9800">🔥 [Quemadura] ${fighter.nombre} pierde ${burnDmg} HP.</span>`);
            mostrarTextoFlotante(fighter.isPlayer, `-${burnDmg}`, "text-dmg", 700);
            flashDamage(fighter.isPlayer);
        }
        actualizarUICombate(fighter, fighter.isPlayer);
    }

    function checkEndGame() {
        const ui = getUI();
        if (playerCombat.hp <= 0 || enemyCombat.hp <= 0) {
            deshabilitarBotones();
            addLog(`<br><span style="color:#ffcc00; font-size: 16px; font-weight: bold;">--- FIN DEL COMBATE ---</span>`);
            
            if (playerCombat.hp > 0) {
                addLog(`<span style="color:#4CAF50">🏆 ¡VICTORIA!</span>`, "#ffd54f");
                const xpGanada = 50 + (window.miMascota.level * 10);
                const evGanada = 15;
                addLog(`<span style="color:#aaa">Ganaste ${xpGanada} XP y ${evGanada} ✨.</span>`);
                
                if(window.Sonidos) window.Sonidos.play("coin"); 
                
                if (window.ganarXP) window.ganarXP(xpGanada);
                if (window.miInventario && typeof window.miInventario.addEssence === 'function') window.miInventario.addEssence(evGanada);
                
            } else if (enemyCombat.hp > 0) {
                addLog(`<span style="color:#f44336">💀 DERROTA. Tu Geno debe descansar.</span>`);
            } else {
                addLog(`<span style="color:#aaa">🤝 DOBLE K.O. Empate técnico.</span>`);
            }

            if(window.guardarProgreso) window.guardarProgreso();

            setTimeout(() => {
                // --- OCULTAR BOTONES DE ATAQUE Y MOSTRAR BUSCAR RIVAL ---
                if(ui.controls) ui.controls.style.setProperty("display", "none", "important");
                if(ui.btnStart) {
                    ui.btnStart.style.setProperty("display", "block", "important");
                    ui.btnStart.innerText = "Buscar otro rival";
                }
            }, 1000);
        } else {
            actualizarBotonesCombate(); // Reactivar al inicio del nuevo turno
        }
    }
});