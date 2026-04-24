// =========================================
// ColiseumUI.js - VISTA (CSS, DOM y Animaciones) CORREGIDA
// =========================================

window.ColiseumUI = {
    inyectarCSS: function() {
        if (document.getElementById("coliseum-final-polish-styles")) return;
        const style = document.createElement("style");
        style.id = "coliseum-final-polish-styles";
        style.innerHTML = `
            /* FONDO TURQUESA GLOBAL */
            .coliseum-cyan-theme { background-color: #31c4d8 !important; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.06) 2px, rgba(0, 0, 0, 0.06) 4px) !important; background-size: auto !important; min-height: 100vh !important; padding-top: 20px !important; box-sizing: border-box !important; }

            /* CAJA OSCURA PRINCIPAL Y NEÓN */
            @keyframes arenaGlow { 0% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 0.6); } 50% { box-shadow: 0 0 40px rgba(77, 208, 225, 1), 0 0 10px rgba(255, 255, 255, 0.7), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 1); } 100% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8); border-color: rgba(77, 208, 225, 0.6); } }
            #battle-area { background-color: rgba(13, 22, 30, 0.95) !important; border: 2px solid #4dd0e1 !important; border-radius: 16px !important; padding: 20px !important; position: relative; overflow: hidden !important; display: flex !important; flex-direction: column !important; align-items: center !important; width: 92% !important; max-width: 500px !important; margin: 0 auto !important; box-sizing: border-box !important; animation: arenaGlow 3s infinite ease-in-out !important; }

            /* TÍTULO Y PANELES PEGADOS */
            .coliseum-title-inside { color: #4dd0e1 !important; text-align: center !important; font-size: 18px !important; margin-top: 0 !important; margin-bottom: 20px !important; text-transform: uppercase !important; font-weight: bold !important; letter-spacing: 2px !important; width: 100% !important; border-bottom: 1px dashed rgba(77, 208, 225, 0.3); padding-bottom: 10px; display: block !important; }
            .fighters-wrapper { display: flex !important; align-items: center !important; justify-content: space-between !important; width: calc(100% + 40px) !important; margin: 0 -20px 15px -20px !important; }

            #player-sprite-battle, #enemy-sprite-battle, .fighter-left, .fighter-right { background: rgba(45, 65, 85, 0.6) !important; padding: 15px 10px !important; width: 44% !important; position: relative; transition: 0.3s; border: 1px solid rgba(255,255,255,0.15) !important; display: flex !important; flex-direction: column !important; justify-content: flex-end !important; align-items: center !important; min-height: 230px !important; backdrop-filter: blur(2px); }
            #player-sprite-battle, .fighter-left { border-top: 3px solid #4dd0e1 !important; border-bottom: 3px solid #4dd0e1 !important; border-radius: 0 12px 12px 0 !important; border-left: none !important; }
            #enemy-sprite-battle, .fighter-right { border-top: 3px solid #ff6b6b !important; border-bottom: 3px solid #ff6b6b !important; border-radius: 12px 0 0 12px !important; border-right: none !important; }
            
            #player-visual-box, #enemy-visual-box, .fighter-sprite { width: 120px !important; height: 120px !important; margin: 0 auto auto auto !important; display: flex; justify-content: center; align-items: center; position: relative; overflow: visible !important; }
            #player-visual-box svg, #enemy-visual-box svg, .fighter-sprite svg { width: 100% !important; height: 100% !important; overflow: visible !important; transition: 0.2s; }

            /* NOMBRES Y HP */
            #battle-player-name, #battle-enemy-name, .fighter-name { font-size: 13px !important; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px !important; text-align: center !important; width: 100% !important; line-height: 1.3 !important; }
            #battle-player-name, .fighter-left .fighter-name { color: #4dd0e1 !important; }
            #battle-enemy-name, .fighter-right .fighter-name { color: #ff6b6b !important; }

            .hp-bar-container, #player-sprite-battle > div:nth-child(3), #enemy-sprite-battle > div:nth-child(3) { background: #000 !important; border: 1px solid #333 !important; box-shadow: inset 0 0 5px rgba(0,0,0,0.8) !important; height: 12px !important; border-radius: 6px !important; width: 90% !important; margin: 8px auto 0 auto !important; }
            .hp-bar-fill-green, #player-hp-bar { background: linear-gradient(90deg, #00d2ff, #4dd0e1) !important; box-shadow: 0 0 10px rgba(77,208,225,0.6) !important; height: 100%; border-radius: 6px; transition: width 0.3s;}
            .hp-bar-fill-red, #enemy-hp-bar { background: linear-gradient(90deg, #ff6b6b, #d9534f) !important; box-shadow: 0 0 10px rgba(255,107,107,0.6) !important; height: 100%; border-radius: 6px; transition: width 0.3s;}
            .hp-text, #player-hp-text, #enemy-hp-text { font-size: 11px !important; color: #fff !important; font-weight: bold; margin-top: 4px !important; text-shadow: 0 1px 2px #000; text-align: center; width: 100%; }

            /* LOG Y BOTONES */
            #battle-log, .battle-log-container { background: #0d161c !important; border: 1px solid #1e3a5f !important; border-left: 4px solid #4dd0e1 !important; border-right: 4px solid #ff6b6b !important; color: #00ffcc !important; border-radius: 8px !important; font-family: 'Courier New', monospace !important; font-size: 12px !important; padding: 15px !important; box-shadow: inset 0 0 15px rgba(0,0,0,0.8) !important; margin-top: 10px !important; height: 130px !important; overflow-y: scroll !important; -ms-overflow-style: none; scrollbar-width: none; width: 100%; box-sizing: border-box; }
            #battle-log::-webkit-scrollbar, .battle-log-container::-webkit-scrollbar { display: none !important; }

            #battle-controls, .controls-container { width: 100% !important; display: flex; gap: 8px !important; justify-content: center !important; margin-top: 15px !important; }
            .battle-btn { flex: 1 !important; padding: 10px 5px !important; border-radius: 8px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; transition: 0.2s !important; font-weight: 900 !important; font-size: 11px !important; color: white !important; cursor: pointer !important; border: 1px solid transparent !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important; }
            .atk-btn { background: linear-gradient(90deg, #ff5722, #d84315) !important; border-color: #ff9800 !important; box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3) !important; }
            .special-btn { background: linear-gradient(90deg, #9c27b0, #6a1b9a) !important; border-color: #e040fb !important; box-shadow: 0 4px 10px rgba(156, 39, 176, 0.3) !important; }
            .buff-btn { background: linear-gradient(90deg, #009688, #00695c) !important; border-color: #26a69a !important; box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3) !important; }
            .battle-btn:active { transform: scale(0.95) !important; }
            .battle-btn:disabled { background: #333 !important; border-color: #555 !important; box-shadow: none !important; color: #888 !important; transform: none !important; cursor: not-allowed !important; text-shadow: none !important; }

            #btn-start-battle, .btn-primary { background: linear-gradient(90deg, #E91E63, #C2185B) !important; box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4) !important; border: 1px solid #F48FB1 !important; color: white !important; border-radius: 8px !important; text-transform: uppercase; letter-spacing: 1px; transition: 0.2s; padding: 15px 30px !important; font-weight: bold !important; cursor: pointer; width: 100%; margin-top: 15px !important; display: none; }
            #btn-leave-battle, .btn-secondary { background-color: #111b24 !important; border: 1px solid #1e3a5f !important; color: #4dd0e1 !important; padding: 15px 30px !important; border-radius: 8px !important; text-transform: uppercase !important; font-weight: bold !important; letter-spacing: 1px !important; cursor: pointer !important; margin: 20px auto !important; display: block !important; transition: 0.2s !important; width: max-content !important; box-shadow: none !important; animation: none !important; }
            #btn-leave-battle:hover, .btn-secondary:hover { background-color: #1e3a5f !important; color: #fff !important; }
            
            /* ANIMACIONES COMPLEJAS */
            @keyframes animarBoca { 0% { transform: scale(1); } 50% { transform: scale(1.6); } 100% { transform: scale(1); } }
            @keyframes animarEmbestida { 0% { transform: scale(1) translateY(0); } 50% { transform: scale(1.1) translateY(-10px); } 100% { transform: scale(1) translateY(0); } }
            .anim-gritar [id*="boca"], .anim-gritar [class*="boca"], .anim-gritar [id*="mouth"], .anim-gritar [class*="mouth"] { transform-origin: center !important; transform-box: fill-box !important; animation: animarBoca 0.4s ease-in-out !important; }
            .anim-gritar svg { animation: animarEmbestida 0.4s ease-in-out !important; }

            @keyframes floatUpFade { 0% { opacity: 1; transform: translateY(0) scale(1.5); } 10% { transform: translateY(-10px) scale(1.8); } 100% { opacity: 0; transform: translateY(-80px) scale(1); } }
            .floating-text { position: absolute; font-weight: 900; z-index: 100; pointer-events: none; animation: floatUpFade 1.3s ease-out forwards; text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 5px rgba(0,0,0,0.8); }
            .text-dmg { color: #ff3333; font-size: 28px; }
            .text-heal { color: #4CAF50; font-size: 24px; }
            .text-crit { color: #ffcc00; font-size: 32px; font-style: italic; text-transform: uppercase; letter-spacing: 2px; }
            .hit-effect { filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5); transform: scale(0.90) translateX(5px); transition: 0.1s; }
            
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
        if (flexContainer) flexContainer.classList.add("fighters-wrapper");

        let controls = document.querySelector(".controls-container") || document.getElementById("battle-controls");
        if (controls) {
            area.appendChild(controls);
            controls.id = "battle-controls"; 
            controls.innerHTML = `
                <button id="btn-atk" class="battle-btn atk-btn">⚔️ ATACAR</button>
                <button id="btn-special" class="battle-btn special-btn">✨ ESPECIAL</button>
                <button id="btn-buff" class="battle-btn buff-btn">🛡️ TÁCTICA</button>
            `;
            controls.style.setProperty("display", "none", "important");
        }

        let btnStart = document.querySelector(".btn-primary") || document.getElementById("btn-start-battle");
        if (btnStart) {
            btnStart.id = "btn-start-battle"; 
            area.appendChild(btnStart);
            btnStart.style.setProperty("display", "block", "important");
        }

        let btnLeave = document.querySelector(".btn-secondary") || document.getElementById("btn-leave-battle");
        if (btnLeave && currentScreen) {
            btnLeave.id = "btn-leave-battle";
            currentScreen.appendChild(btnLeave); 
        }

        let log = document.querySelector(".battle-log-container") || document.getElementById("battle-log");
        if (log) log.id = "battle-log";
    },

    actualizarGraficos: function(p, e) {
        // Encontrar nombres usando ID o Clase asegurando no fallar
        let pNameEl = document.getElementById("battle-player-name") || document.querySelector(".fighter-left .fighter-name");
        if (pNameEl) {
            pNameEl.innerHTML = `<strong>${p.nombre}</strong><br><span style="color:#4dd0e1; font-size:10px; font-weight:normal;">(Nv. ${p.adn.level || 1})</span>`;
        }
        
        let eNameEl = document.getElementById("battle-enemy-name") || document.querySelector(".fighter-right .fighter-name");
        if (eNameEl) {
            eNameEl.innerHTML = `<strong>${e.nombre}</strong><br><span style="color:#ff6b6b; font-size:10px; font-weight:normal;">(${e.rareza} - ${e.element})</span>`;
        }

        // Encontrar contenedores SVG
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
        if(pBar) pBar.style.width = `${pctP}%`;
        if(eBar) eBar.style.width = `${pctE}%`;

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
        const logBox = document.getElementById("battle-log");
        if (logBox) {
            logBox.innerHTML += `<div style="margin-top: 6px;">${texto}</div>`;
            logBox.scrollTop = logBox.scrollHeight;
        }
    },

    limpiarLog: function() {
        const logBox = document.getElementById("battle-log");
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

    mostrarTextoFlotante: function(esJugador, texto, claseAdicional) {
        const sideEl = esJugador ? (document.getElementById("player-sprite-battle") || document.querySelector(".fighter-left")) : (document.getElementById("enemy-sprite-battle") || document.querySelector(".fighter-right"));
        if(!sideEl) return;
        const floater = document.createElement("div");
        floater.className = `floating-text ${claseAdicional}`;
        floater.innerText = texto;
        floater.style.top = `calc(20% + ${(Math.random() - 0.5) * 40}px)`;
        floater.style.left = `calc(50% + ${(Math.random() - 0.5) * 80}px)`;
        floater.style.transform = "translate(-50%, -50%)";
        sideEl.appendChild(floater);
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