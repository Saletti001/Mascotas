// =========================================
// ColiseumUI.js - VISTA Y ANIMACIONES V9.14 (FIX RESPONSIVO Y TAMAÑOS DE BOTONES)
// =========================================

window.ColiseumUI = {
    inyectarCSS: function() {
        if (document.getElementById("coliseum-final-polish-styles")) return;
        const style = document.createElement("style");
        style.id = "coliseum-final-polish-styles";
        style.innerHTML = `
            /* ========================================= */
            /* 1. ESTRUCTURA GLOBAL Y CAJA PRINCIPAL     */
            /* ========================================= */
            /* FIX: Eliminado el overflow-y: auto que generaba la barra espaciadora lateral */
            .coliseum-cyan-theme { background-color: #31c4d8 !important; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.06) 2px, rgba(0, 0, 0, 0.06) 4px) !important; background-size: auto !important; min-height: 100vh !important; padding-top: 20px !important; padding-bottom: 30px !important; box-sizing: border-box !important; overflow-x: hidden !important; }

            @keyframes arenaGlow { 0% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 0.6); } 50% { box-shadow: 0 0 40px rgba(77, 208, 225, 1), 0 0 10px rgba(255, 255, 255, 0.7), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 1); } 100% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 0.6); } }
            #battle-area { background-color: rgba(13, 22, 30, 0.95) !important; border: 2px solid #4dd0e1 !important; border-radius: 16px !important; padding: 25px 20px 20px 20px !important; position: relative; overflow: visible !important; display: flex !important; flex-direction: column !important; align-items: center !important; width: 88% !important; max-width: 480px !important; margin: 0 auto !important; box-sizing: border-box !important; animation: arenaGlow 3s infinite ease-in-out !important; }

            .coliseum-title-inside { color: #4dd0e1 !important; text-align: center !important; font-size: 18px !important; margin-top: 0 !important; margin-bottom: 25px !important; text-transform: uppercase !important; font-weight: bold !important; letter-spacing: 2px !important; width: 100% !important; border-bottom: 1px dashed rgba(77, 208, 225, 0.3); padding-bottom: 10px; display: block !important; }
            
            /* ========================================= */
            /* 2. PANELES FLOTANTES Y GENOS              */
            /* ========================================= */
            .fighters-wrapper { display: flex !important; align-items: center !important; justify-content: space-between !important; width: calc(100% + 60px) !important; margin: 0 -30px 15px -30px !important; position: relative; overflow: visible !important; z-index: 10; }

            #player-sprite-battle, #enemy-sprite-battle, .fighter-left, .fighter-right { background: rgba(20, 35, 48, 0.98) !important; padding: 20px 10px 15px 10px !important; width: 42% !important; position: relative; display: flex !important; flex-direction: column !important; justify-content: flex-end !important; align-items: center !important; min-height: 250px !important; backdrop-filter: blur(5px); overflow: visible !important; transition: 0.3s ease-out !important; border-radius: 12px !important; }
            
            @keyframes pulseGlowP { 0% { box-shadow: -8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(77,208,225,0.4); } 50% { box-shadow: -8px 8px 30px rgba(0,0,0,0.8), 0 0 25px rgba(77,208,225,0.8); } 100% { box-shadow: -8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(77,208,225,0.4); } }
            #player-sprite-battle, .fighter-left { border: 2px solid #4dd0e1 !important; animation: pulseGlowP 3s infinite ease-in-out !important; }
            #player-sprite-battle:hover, .fighter-left:hover { transform: translateY(-5px) scale(1.02) !important; }

            @keyframes pulseGlowE { 0% { box-shadow: 8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255,107,107,0.4); } 50% { box-shadow: 8px 8px 30px rgba(0,0,0,0.8), 0 0 25px rgba(255,107,107,0.8); } 100% { box-shadow: 8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255,107,107,0.4); } }
            #enemy-sprite-battle, .fighter-right { border: 2px solid #ff6b6b !important; animation: pulseGlowE 3s infinite ease-in-out !important; }
            #enemy-sprite-battle:hover, .fighter-right:hover { transform: translateY(-5px) scale(1.02) !important; }

            #player-visual-box, #enemy-visual-box, .fighter-sprite { width: 120px !important; height: 120px !important; margin: auto !important; display: flex; justify-content: center; align-items: center; position: relative; overflow: visible !important; filter: drop-shadow(0 8px 6px rgba(0,0,0,0.6)); transition: 0.2s ease-in-out; }
            #player-visual-box svg, #enemy-visual-box svg, .fighter-sprite svg { width: 100% !important; height: 100% !important; overflow: visible !important; transition: 0.2s; }
            #player-visual-box:hover, #enemy-visual-box:hover, .fighter-sprite:hover { transform: scale(1.1) !important; }

            .fighter-name { font-size: 13px !important; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px !important; text-align: center !important; width: 100% !important; line-height: 1.3 !important; }
            .fighter-left .fighter-name, #battle-player-name { color: #4dd0e1 !important; }
            .fighter-right .fighter-name, #battle-enemy-name { color: #ff6b6b !important; }

            .hp-bar-container, #player-sprite-battle > div:nth-child(3), #enemy-sprite-battle > div:nth-child(3) { background: #000 !important; border: 1px solid #333 !important; box-shadow: inset 0 0 5px rgba(0,0,0,0.8) !important; height: 12px !important; border-radius: 6px !important; width: 90% !important; margin: 8px auto 0 auto !important; }
            .hp-bar-fill-green, #player-hp-bar { background: linear-gradient(90deg, #00d2ff, #4dd0e1) !important; box-shadow: 0 0 10px rgba(77,208,225,0.6) !important; height: 100%; border-radius: 6px; transition: width 0.3s;}
            .hp-bar-fill-red, #enemy-hp-bar { background: linear-gradient(90deg, #ff6b6b, #d9534f) !important; box-shadow: 0 0 10px rgba(255,107,107,0.6) !important; height: 100%; border-radius: 6px; transition: width 0.3s;}
            .hp-text, #player-hp-text, #enemy-hp-text { font-size: 11px !important; color: #fff !important; font-weight: bold; margin-top: 4px !important; text-shadow: 0 1px 2px #000; text-align: center; width: 100%; }

            /* ========================================= */
            /* 3. ANIMACIÓN DEL VS                       */
            /* ========================================= */
            @keyframes vsPulse { 
                0% { transform: translate(-50%, -50%) scale(1); text-shadow: 0 0 10px rgba(255,204,0,0.6); } 
                50% { transform: translate(-50%, -50%) scale(1.3); text-shadow: 0 0 25px rgba(255,204,0,1); } 
                100% { transform: translate(-50%, -50%) scale(1); text-shadow: 0 0 10px rgba(255,204,0,0.6); } 
            }
            .vs-badge-battle { 
                position: absolute !important; 
                top: 45% !important; 
                left: 50% !important; 
                font-size: 26px !important; 
                font-weight: 900 !important; 
                font-style: italic !important; 
                color: #ffcc00 !important; 
                text-shadow: 0 0 20px rgba(255,0,0,0.8) !important; 
                z-index: 50 !important; 
                margin: 0 !important; 
                animation: vsPulse 2s infinite ease-in-out !important; 
            }

            /* ========================================= */
            /* 4. CONSOLA FLOTANTE                       */
            /* ========================================= */
            #battle-log, .battle-log-container { 
                background: rgba(13, 22, 30, 0.98) !important; 
                border: 1px solid rgba(255,255,255,0.1) !important; 
                border-left: 3px solid #4dd0e1 !important; 
                border-right: 3px solid #ff6b6b !important; 
                color: #00ffcc !important; 
                border-radius: 12px !important; 
                font-family: 'Courier New', monospace !important; 
                font-size: 12px !important; 
                padding: 15px !important; 
                height: 130px !important; 
                overflow-y: scroll !important; 
                -ms-overflow-style: none; 
                scrollbar-width: none; 
                box-sizing: border-box; 
                width: calc(100% + 60px) !important; 
                margin: 15px -30px 10px -30px !important; 
                box-shadow: 0 12px 25px rgba(0,0,0,0.8), -5px 0 15px rgba(77,208,225,0.15), 5px 0 15px rgba(255,107,107,0.15) !important; 
                position: relative; 
                z-index: 15; 
            }
            #battle-log::-webkit-scrollbar, .battle-log-container::-webkit-scrollbar { display: none !important; }

            /* ========================================= */
            /* 5. BOTONES NORMALIZADOS                   */
            /* ========================================= */
            #battle-controls, .controls-container { 
                width: 100% !important; 
                display: flex; gap: 8px !important; justify-content: center !important; 
                margin-top: 15px !important; 
            }
            .battle-btn { flex: 1 !important; padding: 10px 5px !important; border-radius: 8px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; transition: 0.2s !important; font-weight: 900 !important; font-size: 11px !important; color: white !important; cursor: pointer !important; border: 1px solid transparent !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important; }
            .atk-btn { background: linear-gradient(90deg, #ff5722, #d84315) !important; border-color: #ff9800 !important; box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3) !important; }
            .special-btn { background: linear-gradient(90deg, #9c27b0, #6a1b9a) !important; border-color: #e040fb !important; box-shadow: 0 4px 10px rgba(156, 39, 176, 0.3) !important; }
            .buff-btn { background: linear-gradient(90deg, #009688, #00695c) !important; border-color: #26a69a !important; box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3) !important; }
            .battle-btn:active { transform: scale(0.95) !important; }
            .battle-btn:disabled { background: #333 !important; border-color: #555 !important; box-shadow: none !important; color: #888 !important; transform: none !important; cursor: not-allowed !important; text-shadow: none !important; }

            /* FIX: BOTÓN ENTRAR/BUSCAR RIVAL (MÁS PEQUEÑO Y DEGRADADO CIAN-ROJO) */
            #btn-start-battle, .btn-primary { 
                background: linear-gradient(90deg, #4dd0e1, #ff6b6b) !important; /* Combina los colores de los Genos */
                box-shadow: 0 4px 10px rgba(0,0,0,0.4) !important; 
                border: 2px solid rgba(255,255,255,0.3) !important; 
                color: white !important; 
                border-radius: 8px !important; 
                text-transform: uppercase; 
                letter-spacing: 1px; 
                transition: 0.2s; 
                padding: 12px 20px !important; /* Reducido para no estorbar */
                font-weight: 900 !important; 
                font-size: 12px !important; /* Letra ajustada */
                cursor: pointer; 
                display: none; 
                width: 80% !important; /* Más angosto */
                margin: 15px auto 0 auto !important; /* Centrado */
            }
            #btn-start-battle:hover, .btn-primary:hover { transform: translateY(-2px) !important; filter: brightness(1.1); }
            
            /* FIX: BOTÓN RETIRARSE (POSICIÓN RELATIVA PARA NO MONTARSE) */
            #btn-leave-battle, .btn-secondary { 
                background-color: #111b24 !important; border: 1px solid #1e3a5f !important; color: #4dd0e1 !important; 
                padding: 12px 30px !important; border-radius: 8px !important; text-transform: uppercase !important; 
                font-weight: bold !important; letter-spacing: 1px !important; cursor: pointer !important; 
                display: block !important; transition: 0.2s !important; 
                width: max-content !important; min-width: 150px !important; box-shadow: none !important; animation: none !important; 
                position: relative !important; margin: 25px auto 10px auto !important; z-index: 100 !important; /* El margen empuja la pantalla hacia abajo fluidamente */
                left: auto !important; transform: none !important; bottom: auto !important;
            }
            #btn-leave-battle:hover, .btn-secondary:hover { background-color: #1e3a5f !important; color: #fff !important; }
            
            /* ========================================= */
            /* 6. ANIMACIONES DE ATAQUE Y TEXTOS FLOTANTES */
            /* ========================================= */
            @keyframes animarBoca { 0% { transform: scale(1); } 50% { transform: scale(1.6); } 100% { transform: scale(1); } }
            @keyframes animarEmbestida { 0% { transform: scale(1) translateY(0); } 50% { transform: scale(1.1) translateY(-10px); } 100% { transform: scale(1) translateY(0); } }
            .anim-gritar [id*="boca"], .anim-gritar [class*="boca"], .anim-gritar [id*="mouth"], .anim-gritar [class*="mouth"] { transform-origin: center !important; transform-box: fill-box !important; animation: animarBoca 0.4s ease-in-out !important; }
            .anim-gritar svg { animation: animarEmbestida 0.4s ease-in-out !important; }

            .hit-effect { filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5) !important; transform: scale(0.90) translateX(5px) !important; transition: 0.1s; }
            .heal-effect { filter: brightness(1.5) drop-shadow(0 0 15px #4CAF50) !important; transform: scale(1.05) !important; transition: 0.2s; }

            @keyframes floatUpFade { 
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); } 
                10% { transform: translate(-50%, calc(-50% - 15px)) scale(1.8); } 
                100% { opacity: 0; transform: translate(-50%, calc(-50% - 60px)) scale(1); } 
            }
            
            .floating-text { 
                position: absolute; 
                font-weight: 900; 
                z-index: 100; 
                pointer-events: none; 
                animation: floatUpFade 1.3s ease-out forwards; 
                text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 5px rgba(0,0,0,0.8); 
                white-space: nowrap !important;
            }
            
            .text-dmg { color: #ff3333; font-size: 28px; }
            .text-heal { color: #4CAF50; font-size: 24px; }
            .text-crit { 
                color: #ffcc00; 
                font-size: 38px !important; 
                font-style: italic; 
                text-transform: uppercase; 
                letter-spacing: 2px; 
                text-shadow: 2px 2px 0 #d32f2f, -2px -2px 0 #d32f2f, 2px -2px 0 #d32f2f, -2px 2px 0 #d32f2f, 0 0 15px rgba(255,0,0,1) !important; 
            }
            
            .shake-effect { animation: shake 0.4s; }
            @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        `;
        document.head.appendChild(style);
    },

    configurarDOM: function() {
        const area = document.querySelector(".coliseum-card") || document.getElementById("battle-area");
        if (!area) return;

        let currentScreen = area.closest('.screen, .coliseum-screen, .view') || area.parentElement;
        if(currentScreen) currentScreen.classList.add("coliseum-cyan-theme");

        let titles = currentScreen.querySelectorAll("h2, h1");
        titles.forEach(t => {
            if(t.innerText.toUpperCase().includes("COLISEO") && t.parentElement !== area) {
                t.classList.add("coliseum-title-inside");
                area.insertBefore(t, area.firstChild);
            }
        });

        const flexContainer = area.querySelector(".fighters-vs-container") || area.querySelector("div");
        if (flexContainer) {
            flexContainer.classList.add("fighters-wrapper");
            for (let i = 0; i < flexContainer.children.length; i++) {
                if (flexContainer.children[i].innerText.includes("VS")) {
                    flexContainer.children[i].className = "vs-badge-battle";
                }
            }
        }

        let controls = document.getElementById("battle-controls") || document.querySelector(".controls-container");
        if (controls) {
            area.appendChild(controls);
            controls.id = "battle-controls"; 
            controls.className = "controls-container";
            controls.innerHTML = `
                <button id="btn-atk" class="battle-btn atk-btn">⚔️ ATACAR</button>
                <button id="btn-special" class="battle-btn special-btn">✨ ESPECIAL</button>
                <button id="btn-buff" class="battle-btn buff-btn">🛡️ TÁCTICA</button>
            `;
            controls.style.setProperty("display", "none", "important");
        }

        let btnStart = document.getElementById("btn-start-battle") || document.querySelector(".btn-primary");
        if (btnStart) {
            btnStart.id = "btn-start-battle"; 
            btnStart.className = "btn-start";
            area.appendChild(btnStart);
            btnStart.style.setProperty("display", "block", "important");
        }

        let btnLeave = document.getElementById("btn-leave-battle") || document.querySelector(".btn-secondary");
        if (btnLeave && currentScreen) {
            btnLeave.id = "btn-leave-battle";
            btnLeave.className = "btn-leave";
            currentScreen.appendChild(btnLeave); 
        }

        let log = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
        if (log) log.id = "battle-log";
    },

    actualizarGraficos: function(p, e) {
        let pNameEl = document.getElementById("battle-player-name") || document.querySelector(".fighter-left .fighter-name");
        if (pNameEl) pNameEl.innerHTML = `<strong>${p.nombre}</strong><br><span style="color:#4dd0e1; font-size:10px; font-weight:normal;">(Nv. ${p.adn.level || 1})</span>`;
        
        let eNameEl = document.getElementById("battle-enemy-name") || document.querySelector(".fighter-right .fighter-name");
        if (eNameEl) eNameEl.innerHTML = `<strong>${e.nombre}</strong><br><span style="color:#ff6b6b; font-size:10px; font-weight:normal;">(${e.rareza} - ${e.element})</span>`;

        let pVisual = document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite");
        let eVisual = document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite");
        
        if (typeof generarSvgGeno === 'function') {
            if(pVisual) pVisual.innerHTML = this.inyectarSvgSeguro(p.adn);
            if(eVisual) eVisual.innerHTML = this.inyectarSvgSeguro(e.adn);
        }
    },

    actualizarHP: function(p, e) {
        const pctP = Math.max(0, (p.hp / p.maxHp) * 100);
        const pctE = Math.max(0, (e.hp / e.maxHp) * 100);
        
        let pBar = document.getElementById("player-hp-bar") || document.querySelector(".fighter-left [class*='hp-bar-fill']");
        let eBar = document.getElementById("enemy-hp-bar") || document.querySelector(".fighter-right [class*='hp-bar-fill']");
        if(pBar) { pBar.className = "hp-bar-fill-green"; pBar.style.width = `${pctP}%`; }
        if(eBar) { eBar.className = "hp-bar-fill-red"; eBar.style.width = `${pctE}%`; }

        let pTxt = document.getElementById("player-hp-text") || document.querySelector(".fighter-left .hp-text");
        let eTxt = document.getElementById("enemy-hp-text") || document.querySelector(".fighter-right .hp-text");
        if(pTxt) pTxt.innerText = `${Math.floor(p.hp)} / ${p.maxHp}`;
        if(eTxt) eTxt.innerText = `${Math.floor(e.hp)} / ${e.maxHp}`;

        let pSide = document.getElementById("player-sprite-battle") || document.querySelector(".fighter-left");
        let eSide = document.getElementById("enemy-sprite-battle") || document.querySelector(".fighter-right");
        if(pSide) pSide.style.filter = p.hp <= 0 ? "grayscale(1) brightness(0.3)" : "none";
        if(eSide) eSide.style.filter = e.hp <= 0 ? "grayscale(1) brightness(0.3)" : "none";
    },

    agregarLog: function(texto) {
        const logBox = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
        if (logBox) {
            logBox.innerHTML += `<div style="margin-top: 6px;">${texto}</div>`;
            logBox.scrollTop = logBox.scrollHeight;
        }
    },

    limpiarLog: function() {
        const logBox = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
        if (logBox) logBox.innerHTML = "";
    },

    animarAtaque: function(esJugador) {
        const el = esJugador ? (document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite")) : (document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite"));
        if(el) { el.classList.add("anim-gritar"); setTimeout(() => el.classList.remove("anim-gritar"), 500); }
    },

    animarDano: function(esJugador) {
        const el = esJugador ? (document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite")) : (document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite"));
        if(el) { el.classList.add("hit-effect"); setTimeout(() => el.classList.remove("hit-effect"), 150); }
        const area = document.getElementById("battle-area") || document.querySelector(".coliseum-card");
        if(area) { area.classList.remove("shake-effect"); void area.offsetWidth; area.classList.add("shake-effect"); }
    },

    animarCuracion: function(esJugador) {
        const el = esJugador ? (document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite")) : (document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite"));
        if(el) { el.classList.add("heal-effect"); setTimeout(() => el.classList.remove("heal-effect"), 500); }
    },

    mostrarTextoFlotante: function(esJugador, texto, claseAdicional) {
        const sideEl = esJugador ? (document.getElementById("player-sprite-battle") || document.querySelector(".fighter-left")) : (document.getElementById("enemy-sprite-battle") || document.querySelector(".fighter-right"));
        if(!sideEl) return;

        const floater = document.createElement("div");
        floater.className = `floating-text ${claseAdicional}`;
        floater.innerText = texto;
        
        let offsetX = (Math.random() - 0.5) * 40; 
        let offsetY = (Math.random() - 0.5) * 20; 

        let baseTop = "15%"; 
        let baseLeft = "50%"; 
        let targetContainer = sideEl; 

        if (claseAdicional.includes("text-crit")) {
            targetContainer = document.querySelector(".fighters-wrapper") || document.getElementById("battle-area"); 
            baseTop = "-25px"; 
            baseLeft = "50%";  
            offsetX = 0; 
            floater.style.zIndex = "1000"; 
        }

        floater.style.top = `calc(${baseTop} + ${offsetY}px)`;
        floater.style.left = `calc(${baseLeft} + ${offsetX}px)`;
        
        targetContainer.appendChild(floater);
        setTimeout(() => floater.remove(), 1300);
    },

    inyectarSvgSeguro: function(adnData) {
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
};