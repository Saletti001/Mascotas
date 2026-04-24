// =========================================
// ColiseumUI.js - VISTA (CSS, Barras de HP y Animaciones)
// =========================================

window.ColiseumUI = {
    inyectarCSS: function() {
        if (document.getElementById("coliseum-styles")) return;
        const style = document.createElement("style");
        style.id = "coliseum-styles";
        style.innerHTML = `
            .coliseum-cyan-theme { background-color: #31c4d8 !important; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.06) 2px, rgba(0, 0, 0, 0.06) 4px) !important; min-height: 100vh !important; padding-top: 20px !important; }
            @keyframes arenaGlow { 0% { box-shadow: 0 0 20px rgba(77,208,225,0.6); } 50% { box-shadow: 0 0 40px rgba(77,208,225,1); } 100% { box-shadow: 0 0 20px rgba(77,208,225,0.6); } }
            #battle-area { background: rgba(13,22,30,0.95) !important; border: 2px solid #4dd0e1 !important; border-radius: 16px !important; padding: 20px !important; width: 92% !important; max-width: 500px !important; margin: 0 auto !important; animation: arenaGlow 3s infinite ease-in-out !important; }
            .coliseum-title-inside { color: #4dd0e1 !important; text-align: center !important; font-size: 18px !important; margin: 0 0 20px 0 !important; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; border-bottom: 1px dashed rgba(77,208,225,0.3); padding-bottom: 10px; width: 100%; display: block; }
            
            .fighters-wrapper { display: flex !important; justify-content: space-between !important; width: calc(100% + 40px) !important; margin: 0 -20px 15px -20px !important; }
            .fighter-panel { background: rgba(45,65,85,0.6) !important; padding: 15px 10px !important; width: 44% !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: flex-end !important; min-height: 230px !important; border: 1px solid rgba(255,255,255,0.15) !important; backdrop-filter: blur(2px); }
            .player-panel { border-top: 3px solid #4dd0e1 !important; border-bottom: 3px solid #4dd0e1 !important; border-radius: 0 12px 12px 0 !important; border-left: none !important; }
            .enemy-panel { border-top: 3px solid #ff6b6b !important; border-bottom: 3px solid #ff6b6b !important; border-radius: 12px 0 0 12px !important; border-right: none !important; }
            
            .visual-box { width: 120px !important; height: 120px !important; margin-bottom: auto !important; }
            .visual-box svg { width: 100% !important; height: 100% !important; overflow: visible !important; transition: 0.2s; }
            
            @keyframes animarBoca { 0% { transform: scale(1); } 50% { transform: scale(1.6); } 100% { transform: scale(1); } }
            .anim-gritar [id*="boca"], .anim-gritar [class*="boca"] { transform-origin: center !important; transform-box: fill-box !important; animation: animarBoca 0.4s ease-in-out !important; }
            
            .name-text { font-size: 13px !important; text-transform: uppercase; text-align: center !important; margin-top: 15px !important; width: 100% !important; }
            .player-name { color: #4dd0e1 !important; } .enemy-name { color: #ff6b6b !important; }
            .stats-text { color: #aaa; font-size: 10px; font-weight: normal; display: block; }
            
            .hp-bar-bg { background: #000 !important; border: 1px solid #333 !important; height: 12px !important; border-radius: 6px !important; width: 90% !important; margin: 8px auto 0 auto !important; }
            .hp-fill-p { background: linear-gradient(90deg, #00d2ff, #4dd0e1) !important; height: 100%; border-radius: 6px; transition: width 0.3s; }
            .hp-fill-e { background: linear-gradient(90deg, #ff6b6b, #d9534f) !important; height: 100%; border-radius: 6px; transition: width 0.3s; }
            .hp-text { font-size: 11px !important; color: #fff !important; font-weight: bold; text-align: center; width: 100%; margin-top: 4px; }

            #battle-log { background: #0d161c !important; border: 1px solid #1e3a5f !important; border-left: 4px solid #4dd0e1 !important; border-right: 4px solid #ff6b6b !important; color: #00ffcc !important; border-radius: 8px !important; font-family: 'Courier New', monospace; font-size: 12px !important; padding: 15px !important; height: 130px !important; overflow-y: auto !important; width: 100%; box-sizing: border-box; }
            #battle-log::-webkit-scrollbar { display: none !important; }

            #battle-controls { width: 100% !important; display: flex; gap: 8px !important; justify-content: center !important; margin-top: 15px !important; }
            .battle-btn { flex: 1 !important; padding: 10px 5px !important; border-radius: 8px !important; text-transform: uppercase !important; font-weight: 900 !important; font-size: 11px !important; color: white !important; cursor: pointer !important; border: 1px solid transparent !important; transition: 0.2s !important; }
            .atk-btn { background: linear-gradient(90deg, #ff5722, #d84315) !important; border-color: #ff9800 !important; }
            .special-btn { background: linear-gradient(90deg, #9c27b0, #6a1b9a) !important; border-color: #e040fb !important; }
            .buff-btn { background: linear-gradient(90deg, #009688, #00695c) !important; border-color: #26a69a !important; }
            .battle-btn:active { transform: scale(0.95) !important; }
            .battle-btn:disabled { background: #333 !important; border-color: #555 !important; color: #888 !important; cursor: not-allowed !important; }

            .btn-start { background: linear-gradient(90deg, #E91E63, #C2185B) !important; border: 1px solid #F48FB1 !important; color: white !important; border-radius: 8px !important; padding: 15px 30px !important; font-weight: bold !important; cursor: pointer; width: 100%; margin-top: 15px !important; text-transform: uppercase; }
            .btn-leave { background-color: #111b24 !important; border: 1px solid #1e3a5f !important; color: #4dd0e1 !important; padding: 15px 30px !important; border-radius: 8px !important; text-transform: uppercase !important; font-weight: bold !important; cursor: pointer !important; margin: 20px auto !important; display: block !important; width: max-content !important; }
            .btn-leave:hover { background-color: #1e3a5f !important; color: #fff !important; }

            .hit-effect { filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5); transform: scale(0.90) translateX(5px); transition: 0.1s; }
            .shake-effect { animation: shake 0.4s; }
            @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        `;
        document.head.appendChild(style);
    },

    actualizarGenos: function(p, e) {
        // Fuerza bruta para cambiar los nombres sin importar las clases viejas
        document.querySelectorAll('.fighter-left .fighter-name, #battle-player-name').forEach(el => {
            el.innerHTML = `<strong>${p.nombre}</strong><br><span class="stats-text">(Nv. ${p.adn.level || 1})</span>`;
            el.classList.add("player-name", "name-text");
        });
        document.querySelectorAll('.fighter-right .fighter-name, #battle-enemy-name').forEach(el => {
            el.innerHTML = `<strong>${e.nombre}</strong><br><span class="stats-text">${e.rareza} - ${e.element}</span>`;
            el.classList.add("enemy-name", "name-text");
        });

        // Actualizar SVGs
        const pBox = document.querySelector('.fighter-left .fighter-sprite') || document.getElementById('player-visual-box');
        const eBox = document.querySelector('.fighter-right .fighter-sprite') || document.getElementById('enemy-visual-box');
        if(pBox && typeof generarSvgGeno === 'function') pBox.innerHTML = generarSvgGeno(p.adn);
        if(eBox && typeof generarSvgGeno === 'function') eBox.innerHTML = generarSvgGeno(e.adn);
    },

    actualizarHP: function(p, e) {
        const pctP = Math.max(0, (p.hp / p.maxHp) * 100);
        const pctE = Math.max(0, (e.hp / e.maxHp) * 100);
        
        document.querySelectorAll('.hp-bar-fill-green, #player-hp-bar').forEach(el => el.style.width = `${pctP}%`);
        document.querySelectorAll('.hp-bar-fill-red, #enemy-hp-bar').forEach(el => el.style.width = `${pctE}%`);
        
        document.querySelectorAll('.fighter-left .hp-text, #player-hp-text').forEach(el => el.innerText = `${Math.floor(p.hp)} / ${p.maxHp}`);
        document.querySelectorAll('.fighter-right .hp-text, #enemy-hp-text').forEach(el => el.innerText = `${Math.floor(e.hp)} / ${e.maxHp}`);
    },

    agregarLog: function(texto) {
        const logBox = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
        if (logBox) {
            logBox.innerHTML += `<div style="margin-top: 6px;">${texto}</div>`;
            logBox.scrollTop = logBox.scrollHeight;
        }
    },

    flashAtaque: function(esJugador) {
        const selector = esJugador ? '.fighter-left .fighter-sprite, #player-visual-box' : '.fighter-right .fighter-sprite, #enemy-visual-box';
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add("anim-gritar");
            setTimeout(() => el.classList.remove("anim-gritar"), 500);
        });
    },

    flashDano: function(esJugador) {
        const selector = esJugador ? '.fighter-left .fighter-sprite, #player-visual-box' : '.fighter-right .fighter-sprite, #enemy-visual-box';
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add("hit-effect");
            setTimeout(() => el.classList.remove("hit-effect"), 150);
        });
        const area = document.getElementById("battle-area");
        if(area) {
            area.classList.remove("shake-effect");
            void area.offsetWidth;
            area.classList.add("shake-effect");
        }
    }
};