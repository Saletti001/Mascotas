// =========================================
// ColiseumUI.js - VISTA Y ANIMACIONES V10.4 (BANDEJA DE ESTADOS Y EMOJIS)
// =========================================

window.ColiseumUI = {
    inyectarCSS: function() {
        if (document.getElementById("coliseum-final-polish-styles")) return;
        const style = document.createElement("style");
        style.id = "coliseum-final-polish-styles";
        style.innerHTML = `
            .coliseum-cyan-theme { background-color: #31c4d8 !important;
            background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.06) 2px, rgba(0, 0, 0, 0.06) 4px) !important; background-size: auto !important;
            min-height: 100vh !important; padding-top: 20px !important; padding-bottom: 20px !important; box-sizing: border-box !important;
            }

            @keyframes arenaGlow { 0% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8);
            border-color: rgba(77, 208, 225, 0.6); } 50% { box-shadow: 0 0 40px rgba(77, 208, 225, 1), 0 0 10px rgba(255, 255, 255, 0.7), inset 0 0 30px rgba(0,0,0,0.8);
            border-color: rgba(77, 208, 225, 1); } 100% { box-shadow: 0 0 20px rgba(77, 208, 225, 0.6), inset 0 0 30px rgba(0,0,0,0.8);
            border-color: rgba(77, 208, 225, 0.6); } }
            #battle-area { background-color: rgba(13, 22, 30, 0.95) !important;
            border: 2px solid #4dd0e1 !important; border-radius: 16px !important; padding: 25px 20px 20px 20px !important; position: relative; overflow: visible !important;
            display: flex !important; flex-direction: column !important; align-items: center !important; width: 88% !important; max-width: 480px !important; margin: 0 auto !important;
            box-sizing: border-box !important; animation: arenaGlow 3s infinite ease-in-out !important; }

            .coliseum-title-inside { color: #4dd0e1 !important;
            text-align: center !important; font-size: 18px !important; margin-top: 0 !important; margin-bottom: 25px !important; text-transform: uppercase !important; font-weight: bold !important;
            letter-spacing: 2px !important; width: 100% !important; border-bottom: 1px dashed rgba(77, 208, 225, 0.3); padding-bottom: 10px; display: block !important;
            }
            .fighters-wrapper { display: flex !important; align-items: center !important;
            justify-content: space-between !important; width: calc(100% + 60px) !important; margin: 0 -30px 15px -30px !important; position: relative; overflow: visible !important;
            z-index: 10; }

            #player-sprite-battle, #enemy-sprite-battle, .fighter-left, .fighter-right { background: rgba(45, 62, 79, 0.98) !important;
            padding: 20px 10px 15px 10px !important; width: 42% !important; position: relative; display: flex !important; flex-direction: column !important; justify-content: flex-end !important;
            align-items: center !important; min-height: 250px !important; backdrop-filter: blur(5px); overflow: visible !important; transition: 0.3s ease-out !important; border-radius: 12px !important;
            }
            
            @keyframes pulseGlowP { 0% { box-shadow: -8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(77,208,225,0.4);
            } 50% { box-shadow: -8px 8px 30px rgba(0,0,0,0.8), 0 0 25px rgba(77,208,225,0.8);
            } 100% { box-shadow: -8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(77,208,225,0.4);
            } }
            #player-sprite-battle, .fighter-left { border: 2px solid #4dd0e1 !important;
            animation: pulseGlowP 3s infinite ease-in-out !important; }
            #player-sprite-battle:hover, .fighter-left:hover { transform: translateY(-5px) scale(1.02) !important;
            }

            @keyframes pulseGlowE { 0% { box-shadow: 8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255,107,107,0.4);
            } 50% { box-shadow: 8px 8px 30px rgba(0,0,0,0.8), 0 0 25px rgba(255,107,107,0.8);
            } 100% { box-shadow: 8px 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255,107,107,0.4);
            } }
            #enemy-sprite-battle, .fighter-right { border: 2px solid #ff6b6b !important;
            animation: pulseGlowE 3s infinite ease-in-out !important; }
            #enemy-sprite-battle:hover, .fighter-right:hover { transform: translateY(-5px) scale(1.02) !important;
            }

            #player-visual-box, #enemy-visual-box, .fighter-sprite { width: 120px !important;
            height: 120px !important; margin: auto !important; display: flex; justify-content: center; align-items: center; position: relative; overflow: visible !important;
            filter: drop-shadow(0 8px 6px rgba(0,0,0,0.6)); transition: 0.2s ease-in-out; }
            #player-visual-box svg, #enemy-visual-box svg, .fighter-sprite svg { width: 100% !important;
            height: 100% !important; overflow: visible !important; transition: 0.2s; }

            .fighter-name { font-size: 13px !important;
            text-transform: uppercase; letter-spacing: 1px; margin-top: 10px !important; text-align: center !important; width: 100% !important; line-height: 1.3 !important;
            }
            .fighter-left .fighter-name, #battle-player-name { color: #4dd0e1 !important;
            }
            .fighter-right .fighter-name, #battle-enemy-name { color: #ff6b6b !important;
            }

            .hp-bar-container, #player-sprite-battle > div:nth-child(3), #enemy-sprite-battle > div:nth-child(3) { background: #000 !important;
            border: 1px solid #333 !important; box-shadow: inset 0 0 5px rgba(0,0,0,0.8) !important; height: 12px !important; border-radius: 6px !important;
            width: 90% !important; margin: 8px auto 0 auto !important; }
            .hp-bar-fill-green, #player-hp-bar { background: linear-gradient(90deg, #00d2ff, #4dd0e1) !important;
            box-shadow: 0 0 10px rgba(77,208,225,0.6) !important; height: 100%; border-radius: 6px;
            transition: width 0.3s;}
            .hp-bar-fill-red, #enemy-hp-bar { background: linear-gradient(90deg, #ff6b6b, #d9534f) !important;
            box-shadow: 0 0 10px rgba(255,107,107,0.6) !important; height: 100%; border-radius: 6px;
            transition: width 0.3s;}
            .hp-text, #player-hp-text, #enemy-hp-text { font-size: 11px !important;
            color: #fff !important; font-weight: bold; margin-top: 4px !important; text-shadow: 0 1px 2px #000; text-align: center; width: 100%;
            }

            @keyframes vsPulse { 0% { transform: scale(1);
            text-shadow: 0 0 10px rgba(255,204,0,0.6); } 50% { transform: scale(1.5); text-shadow: 0 0 30px rgba(255,204,0,1); } 100% { transform: scale(1);
            text-shadow: 0 0 10px rgba(255,204,0,0.6); } }
            .vs-badge-battle { position: relative !important;
            display: inline-block !important; font-size: 24px !important; font-weight: 900 !important; font-style: italic !important; color: #ffcc00 !important;
            text-shadow: 0 0 20px rgba(255,0,0,0.8) !important; z-index: 50 !important; margin: 0 !important; animation: vsPulse 1.5s infinite ease-in-out !important;
            }

            #battle-log, .battle-log-container { background: rgba(13, 22, 30, 0.98) !important;
            border: 1px solid rgba(255,255,255,0.1) !important; border-left: 3px solid #4dd0e1 !important; border-right: 3px solid #ff6b6b !important; color: #00ffcc !important;
            border-radius: 12px !important; font-family: 'Courier New', monospace !important; font-size: 12px !important; padding: 15px !important; height: 130px !important; overflow-y: scroll !important;
            -ms-overflow-style: none; scrollbar-width: none; box-sizing: border-box; width: calc(100% + 60px) !important; margin: 15px -30px 10px -30px !important;
            box-shadow: 0 12px 25px rgba(0,0,0,0.8), -5px 0 15px rgba(77,208,225,0.15), 5px 0 15px rgba(255,107,107,0.15) !important; position: relative; z-index: 15; transform: translateY(-5px);
            }
            #battle-log::-webkit-scrollbar, .battle-log-container::-webkit-scrollbar { display: none !important;
            }

            #battle-controls, .controls-container { width: 100% !important;
            display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important; margin-top: 15px !important;
            }
            .battle-btn { padding: 12px 5px !important;
            border-radius: 8px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; transition: 0.2s !important; font-weight: bold !important; font-size: 9px !important;
            cursor: pointer !important; background: #111b24 !important; box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important; text-shadow: none !important; width: 100% !important;
            box-sizing: border-box !important; }
            .slot-1 { border: 1px solid #4dd0e1 !important;
            color: #4dd0e1 !important; } .slot-2 { border: 1px solid #ff6b6b !important; color: #ff6b6b !important;
            } .slot-3 { border: 1px solid #4CAF50 !important; color: #4CAF50 !important; } .slot-4 { border: 1px solid #555 !important;
            color: #888 !important; background: #0a0f14 !important; } 
            .battle-btn:active { transform: scale(0.95) !important;
            } .battle-btn:disabled { opacity: 0.5 !important; cursor: not-allowed !important; transform: none !important; box-shadow: none !important;
            }

            #btn-start-battle, .btn-primary { background: linear-gradient(90deg, #00b4d8, #e53935) !important;
            box-shadow: 0 6px 15px rgba(0,0,0,0.5), -5px 0 15px rgba(0,180,219,0.3), 5px 0 15px rgba(229,57,53,0.3) !important; border: 2px solid rgba(255,255,255,0.2) !important;
            color: white !important; border-radius: 12px !important; text-transform: uppercase; letter-spacing: 1px !important; transition: 0.2s; padding: 12px 25px !important; font-weight: bold !important;
            font-size: 13px !important; cursor: pointer; width: max-content !important; min-width: 200px !important; margin: 15px auto 0 auto !important; display: none;
            }
            #btn-start-battle:hover, .btn-primary:hover { transform: translateY(-3px) !important; filter: brightness(1.2);
            }
            
            #btn-leave-battle, .btn-secondary { background-color: #111b24 !important;
            border: 1px solid #1e3a5f !important; color: #4dd0e1 !important; padding: 15px 30px !important; border-radius: 8px !important; text-transform: uppercase !important;
            font-size: 13px !important; font-weight: bold !important; letter-spacing: 1px !important; cursor: pointer !important; display: block; transition: 0.2s !important; width: 70% !important;
            max-width: 300px !important; box-shadow: none !important; animation: none !important; position: relative !important; margin: 20px auto 10px auto !important;
            z-index: 100 !important; }
            #btn-leave-battle:hover, .btn-secondary:hover { background-color: #1e3a5f !important;
            color: #fff !important; }
            
            /* ========================================= */
            /* KEYFRAMES MÁGICOS Y EMBESTIDAS */
            /* ========================================= */
            
            @keyframes animBasico { 0% { transform: scale(1);
            } 50% { transform: scale(1.1) translate(0, -5px); filter: brightness(1.3); } 100% { transform: scale(1);
            } }
            .anim-basico svg { animation: animBasico 0.3s ease-in-out !important;
            }
            .hit-basico { filter: brightness(1.5) !important;
            transform: scale(0.95) translateX(3px) !important; transition: 0.1s; }

            @keyframes animCastNuclear { 0%{transform: scale(1);} 50%{transform: scale(1.35) translateY(-10px);
            filter: drop-shadow(0 0 30px #ff3d00) brightness(1.5);} 100%{transform: scale(1);} }
            .anim-cast-nuclear svg { animation: animCastNuclear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            }
            @keyframes animCastLaser { 0%{transform: translateX(0);} 20%{transform: translateX(-15px) skewX(10deg);} 50%{transform: translateX(40px) skewX(-20deg) scale(1.1);
            filter: drop-shadow(0 0 20px #00e5ff) brightness(2);} 100%{transform: translateX(0);} }
            .anim-cast-laser svg { animation: animCastLaser 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            @keyframes animCastVenom { 0%{transform: scale(1);} 50%{transform: scaleX(1.2) scaleY(0.8);
            filter: drop-shadow(0 0 25px #d500f9) hue-rotate(90deg);} 100%{transform: scale(1);} }
            .anim-cast-venom svg { animation: animCastVenom 0.6s ease-in-out !important;
            }
            @keyframes animCastBio { 0%{transform: translateY(0);} 50%{transform: translateY(-20px) scaleY(1.2);
            filter: drop-shadow(0 0 20px #00e676) saturate(2);} 100%{transform: translateY(0);} }
            .anim-cast-bio svg { animation: animCastBio 0.5s ease-in-out !important;
            }
            @keyframes animarEmbestida { 0% { transform: scale(1) translateY(0);
            } 50% { transform: scale(1.1) translateY(-10px); } 100% { transform: scale(1) translateY(0);
            } }
            .anim-gritar svg { animation: animarEmbestida 0.35s ease-in-out !important;
            }

            .hit-nuclear { filter: brightness(2.5) sepia(1) hue-rotate(-30deg) saturate(10) drop-shadow(0 0 30px #ff3d00) !important;
            transform: scale(1.15) rotate(8deg) !important; transition: 0.1s; }
            .hit-laser { filter: brightness(3) drop-shadow(0 0 25px #00e5ff) !important;
            transform: skewX(-25deg) translateX(15px) !important; transition: 0.1s; }
            .hit-venom { filter: brightness(1.5) sepia(1) hue-rotate(250deg) saturate(5) drop-shadow(0 0 15px #aa00ff) !important;
            transform: scaleY(0.8) scaleX(1.1) translateY(10px) !important; transition: 0.1s; }
            .hit-bio { filter: brightness(1.3) sepia(1) hue-rotate(80deg) saturate(3) drop-shadow(0 0 15px #00e676) !important;
            transform: translateY(-15px) !important; transition: 0.1s; }
            .hit-effect { filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5) !important;
            transform: scale(0.90) translateX(5px) !important; transition: 0.1s; }

            @keyframes animVelocidad { 0% { transform: translateX(0) skewX(0);
            filter: drop-shadow(0 0 0 #00ffff); } 15% { transform: translateX(40px) skewX(-20deg) scaleY(0.9); filter: drop-shadow(-15px 0 15px #00ffff);
            } 30% { transform: translateX(-40px) skewX(20deg) scaleY(0.9); filter: drop-shadow(15px 0 15px #00ffff); } 45% { transform: translateX(20px) skewX(-10deg);
            filter: drop-shadow(-10px 0 10px #00ffff); } 60% { transform: translateX(-20px) skewX(10deg); filter: drop-shadow(10px 0 10px #00ffff);
            } 100% { transform: translateX(0) skewX(0); filter: drop-shadow(0 0 0 #00ffff);
            } }
            .anim-velocidad svg { animation: animVelocidad 0.6s ease-in-out !important;
            }
            @keyframes animFuerza { 0% { filter: drop-shadow(0 0 0px #ff3333);
            transform: scale(1); } 50% { filter: drop-shadow(0 0 30px #ff3333) drop-shadow(0 0 10px rgba(0,0,0,0.8)); transform: scale(1.2);
            } 100% { filter: drop-shadow(0 0 0px #ff3333); transform: scale(1);
            } }
            .anim-fuerza svg { animation: animFuerza 0.8s ease-in-out !important;
            }
            @keyframes animEscudo { 0% { filter: drop-shadow(0 0 0px #4dd0e1);
            transform: scale(1); } 50% { filter: drop-shadow(0 0 25px #4dd0e1) drop-shadow(0 0 10px rgba(0,0,0,0.8)); transform: scale(1.05);
            } 100% { filter: drop-shadow(0 0 0px #4dd0e1); transform: scale(1);
            } }
            .anim-escudo svg { animation: animEscudo 0.8s ease-in-out !important;
            }
            @keyframes animBuffGeneral { 0% { filter: drop-shadow(0 0 0px #80cbc4);
            transform: translateY(0); } 50% { filter: drop-shadow(0 0 20px #80cbc4); transform: translateY(-15px); } 100% { filter: drop-shadow(0 0 0px #80cbc4);
            transform: translateY(0); } }
            .anim-buff svg { animation: animBuffGeneral 0.8s ease-in-out !important;
            }

            .heal-effect { filter: brightness(1.5) drop-shadow(0 0 15px #4CAF50) !important;
            transform: scale(1.05) !important; transition: 0.2s; }
            
            .shake-effect { animation: shake 0.4s;
            }
            .shake-hard { animation: shakeHard 0.5s;
            }
            @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg);
            } 20% { transform: translate(-3px, 0px) rotate(1deg); } 40% { transform: translate(1px, -1px) rotate(1deg);
            } 60% { transform: translate(-3px, 1px) rotate(0deg); } 80% { transform: translate(-1px, -1px) rotate(1deg);
            } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
            @keyframes shakeHard { 0% { transform: translate(3px, 3px) rotate(0deg);
            } 20% { transform: translate(-5px, 0px) rotate(2deg); } 40% { transform: translate(3px, -3px) rotate(-2deg);
            } 60% { transform: translate(-5px, 3px) rotate(0deg); } 80% { transform: translate(3px, -3px) rotate(2deg);
            } 100% { transform: translate(0px, 0px) rotate(0deg); } }

            @keyframes floatUpFade { 0% { opacity: 1;
            transform: translate(-50%, -50%) scale(1.5); } 10% { transform: translate(-50%, calc(-50% - 15px)) scale(1.8); } 100% { opacity: 0;
            transform: translate(-50%, calc(-50% - 60px)) scale(1); } }
            .floating-text { position: absolute;
            font-weight: 900; z-index: 100; pointer-events: none; animation: floatUpFade 1.3s ease-out forwards;
            text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 5px rgba(0,0,0,0.8);
            white-space: nowrap !important; }
            
            /* ✨ ESTILOS PARA BLOQUEOS, EVASIÓN Y DAÑO */
            .text-dmg { color: #ff3333;
            font-size: 28px; } 
            .text-heal { color: #4CAF50;
            font-size: 24px; } 
            .text-block { color: #80deea;
            font-size: 26px; letter-spacing: 1px; } 
            .text-evade { color: #e0e0e0;
            font-size: 26px; font-style: italic; letter-spacing: 2px; } 
            .text-crit { color: #ffcc00;
            font-size: 38px !important; font-style: italic; text-transform: uppercase; letter-spacing: 2px; text-shadow: 2px 2px 0 #d32f2f, -2px -2px 0 #d32f2f, 2px -2px 0 #d32f2f, -2px 2px 0 #d32f2f, 0 0 15px rgba(255,0,0,1) !important;
            }
            
            /* ✨ NUEVOS ESTILOS PARA BANDEJA DE ESTADOS ALTERADOS */
            .status-tray {
                position: absolute;
                top: 15px;
                left: 15px;
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                max-width: 90px;
                z-index: 20;
            }
            .status-bubble {
                background: rgba(15, 23, 42, 0.85);
                border: 2px solid #888;
                border-radius: 50%;
                width: 26px;
                height: 26px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                box-shadow: 0 0 8px rgba(0,0,0,0.5);
                animation: status-pulse 1.5s infinite alternate;
                cursor: help;
            }
            .status-bubble.buff { border-color: #4CAF50; box-shadow: 0 0 6px #4CAF50; }
            .status-bubble.debuff { border-color: #f44336; box-shadow: 0 0 6px #f44336; }
            @keyframes status-pulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.15); }
            }
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
                if (flexContainer.children[i].innerText.includes("VS")) flexContainer.children[i].className = "vs-badge-battle";
            }
        }

        let controls = document.getElementById("battle-controls") ||
        document.querySelector(".controls-container");
        if (controls) {
            area.appendChild(controls); controls.id = "battle-controls";
            controls.className = "controls-container";
            controls.innerHTML = `
                <button id="btn-atk-1" class="battle-btn slot-1">BÁSICO</button>
                <button id="btn-atk-2" class="battle-btn slot-2">VACÍO</button>
                <button id="btn-atk-3" class="battle-btn slot-3">VACÍO</button>
                <button id="btn-atk-4" class="battle-btn slot-4" disabled>🔒 NV.
                25+</button>
            `;
            controls.style.setProperty("display", "none", "important");
        }

        let btnStart = document.getElementById("btn-start-battle") || document.querySelector(".btn-primary");
        if (btnStart) { btnStart.id = "btn-start-battle";
        btnStart.className = "btn-start"; area.appendChild(btnStart); btnStart.style.setProperty("display", "block", "important"); }

        let btnLeave = document.getElementById("btn-leave-battle") ||
        document.querySelector(".btn-secondary");
        if (btnLeave && currentScreen) { btnLeave.id = "btn-leave-battle"; btnLeave.className = "btn-leave"; currentScreen.appendChild(btnLeave);
        }

        let log = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
        if (log) log.id = "battle-log";
    },

    actualizarBotonesAtaque: function(mascota) {
        if (!mascota) return;
        const btn1 = document.getElementById("btn-atk-1"); const btn2 = document.getElementById("btn-atk-2"); const btn3 = document.getElementById("btn-atk-3"); const btn4 = document.getElementById("btn-atk-4");
        const ataquesBasicos = { "Biomutante": "PULSO VITAL", "Viral": "DESCARGA VIRAL", "Cibernético": "LÁSER DE PRECISIÓN", "Radiactivo": "PROYECTIL RADIACTIVO", "Tóxico": "COLMILLO VENENOSO", "Sintético": "RÁFAGA SINTÉTICA" };
        if (btn1) { btn1.innerText = mascota.element ? (ataquesBasicos[mascota.element] || "BÁSICO") : "BÁSICO"; btn1.disabled = false;
        }
        const equipados = mascota.ataques || {};
        if (btn2) { btn2.innerText = equipados.atk_2 ? equipados.atk_2.nombre.replace(/MT /gi, "").toUpperCase() : "VACÍO"; btn2.disabled = !equipados.atk_2; if(!equipados.atk_2) btn2.classList.add("slot-4"); else btn2.classList.remove("slot-4");
        }
        if (btn3) { btn3.innerText = equipados.atk_3 ? equipados.atk_3.nombre.replace(/MT /gi, "").toUpperCase() : "VACÍO";
        btn3.disabled = !equipados.atk_3; if(!equipados.atk_3) btn3.classList.add("slot-4"); else btn3.classList.remove("slot-4"); }
        if (btn4) {
            if (mascota.level < 25) { btn4.innerText = "🔒 NV. 25+";
            btn4.disabled = true; btn4.classList.add("slot-4"); }
            else { btn4.innerText = equipados.atk_4 ?
            equipados.atk_4.nombre.replace(/MT /gi, "").toUpperCase() : "VACÍO"; btn4.disabled = !equipados.atk_4;
                if(equipados.atk_4) { btn4.classList.remove("slot-4"); btn4.style.border = "1px solid #ff9800"; btn4.style.color = "#ff9800";
                }
                else { btn4.classList.add("slot-4");
                btn4.style.border = ""; btn4.style.color = ""; }
            }
        }
    },

    actualizarGraficos: function(p, e) {
        let pNameEl = document.getElementById("battle-player-name") ||
        document.querySelector(".fighter-left .fighter-name");
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
        if(pBar) { pBar.className = "hp-bar-fill-green"; pBar.style.width = `${pctP}%`;
        } if(eBar) { eBar.className = "hp-bar-fill-red"; eBar.style.width = `${pctE}%`; }
        let pTxt = document.getElementById("player-hp-text") ||
        document.querySelector(".fighter-left .hp-text"); let eTxt = document.getElementById("enemy-hp-text") || document.querySelector(".fighter-right .hp-text");
        if(pTxt) pTxt.innerText = `${Math.floor(p.hp)} / ${p.maxHp}`;
        if(eTxt) eTxt.innerText = `${Math.floor(e.hp)} / ${e.maxHp}`;
        let pSide = document.getElementById("player-sprite-battle") || document.querySelector(".fighter-left"); let eSide = document.getElementById("enemy-sprite-battle") || document.querySelector(".fighter-right");
        if(pSide) pSide.style.filter = p.hp <= 0 ? "grayscale(1) brightness(0.3)" : "none"; if(eSide) eSide.style.filter = e.hp <= 0 ?
        "grayscale(1) brightness(0.3)" : "none";
    },

    // ✨ NUEVO: MOTOR VISUAL DE ESTADOS Y BUFFS
    actualizarEstados: function(player, enemy) {
        const diccEstados = {
            "Veneno": "☠️", "Veneno Fuerte": "☠️",
            "Quemadura": "🔥", "Quemadura Crítica": "🔥",
            "Parálisis": "⚡", "Congelación": "❄️",
            "Visión Nublada": "🌫️", "Enredado": "🌿",
            "Corrosión": "⚗️", "Campo Radiactivo": "☢️",
            "Irradiación": "💢", "Regeneración": "✨",
            "Infección": "🦠", "Sobrecarga": "⚙️", "Sobrecarga del Sistema": "⚙️"
        };

        function renderizarTray(fighter, isPlayer) {
            // Buscamos dinámicamente las tarjetas (izquierda o derecha)
            let container = isPlayer ? 
                (document.getElementById("player-sprite-battle") || document.querySelector(".fighter-left")) : 
                (document.getElementById("enemy-sprite-battle") || document.querySelector(".fighter-right"));
            
            if (!container) return; 
            container.style.position = "relative";

            let tray = container.querySelector(".status-tray");
            if (!tray) {
                tray = document.createElement("div");
                tray.className = "status-tray";
                container.appendChild(tray);
            }

            tray.innerHTML = ""; // Limpiar iconos del turno anterior
            let mostrados = new Set(); 

            if (fighter.estados) {
                fighter.estados.forEach(estado => {
                    if (!mostrados.has(estado)) {
                        let iconDiv = document.createElement("div");
                        iconDiv.className = "status-bubble debuff"; 
                        if (estado === "Regeneración") iconDiv.className = "status-bubble buff"; 
                        
                        iconDiv.innerHTML = diccEstados[estado] || "⚠️";
                        iconDiv.title = estado; 
                        tray.appendChild(iconDiv);
                        mostrados.add(estado);
                    }
                });
            }

            if (fighter.efectosActivos) {
                fighter.efectosActivos.forEach(efecto => {
                    if (efecto.stat && efecto.stat !== "estado") {
                        let isBuff = efecto.valor > 0;
                        let statIcon = efecto.stat === "atk" ? "⚔️" : (efecto.stat === "spd" ? "💨" : (efecto.stat === "def" ? "🛡️" : "📈"));
                        let textId = efecto.stat + (isBuff ? "up" : "down");

                        if (!mostrados.has(textId)) {
                            let iconDiv = document.createElement("div");
                            iconDiv.className = "status-bubble " + (isBuff ? "buff" : "debuff");
                            iconDiv.innerHTML = statIcon; 
                            iconDiv.title = `${isBuff ? 'Aumento' : 'Reducción'} de ${efecto.stat.toUpperCase()}`;
                            tray.appendChild(iconDiv);
                            mostrados.add(textId);
                        }
                    }
                });
            }
        }

        renderizarTray(player, true); 
        renderizarTray(enemy, false);   
    },

    agregarLog: function(texto) {
        const logBox = document.getElementById("battle-log") ||
        document.querySelector(".battle-log-container");
        if (logBox) { logBox.innerHTML += `<div style="margin-top: 6px;">${texto}</div>`; logBox.scrollTop = logBox.scrollHeight;
        }
    },

    limpiarLog: function() { const logBox = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
    if (logBox) logBox.innerHTML = ""; },

    animarAtaque: function(esJugador, ataque, tipoAccion) {
        const el = esJugador ?
        (document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite")) : (document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite"));
        if(!el) return;

        let claseAnim = "anim-gritar";
        if (tipoAccion === "ataque") {
            claseAnim = "anim-basico";
        } 
        else if (ataque) {
            let n = (ataque.nombre || "").toLowerCase();
            let e = ataque.elemento || "";
            let isMulti = (ataque.hits && ataque.hits > 1) || n.includes("cadena") || n.includes("ráfaga") ||
            n.includes("descarga") || n.includes("múltiple");

            if (isMulti) claseAnim = "anim-gritar"; 
            else if (n.includes("nuclear") || n.includes("explosión") || n.includes("ardiente") || e === "Radiactivo") claseAnim = "anim-cast-nuclear";
            else if (n.includes("láser") || n.includes("plasma") || n.includes("corte") || e === "Cibernético" || e === "Sintético") claseAnim = "anim-cast-laser";
            else if (n.includes("veneno") || n.includes("infección") || n.includes("corrosión") || e === "Tóxico" || e === "Viral") claseAnim = "anim-cast-venom";
            else if (n.includes("raíz") || n.includes("espinas") || e === "Biomutante") claseAnim = "anim-cast-bio";
        }

        el.classList.remove("anim-gritar", "anim-cast-nuclear", "anim-cast-laser", "anim-cast-venom", "anim-cast-bio", "anim-basico");
        void el.offsetWidth; 
        el.classList.add(claseAnim);
        setTimeout(() => el.classList.remove(claseAnim), 600);
    },

    animarSoporte: function(esJugador, ataque) {
        const el = esJugador ?
        (document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite")) : (document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite"));
        if(!el) return;
        let claseAnim = "anim-buff"; 
        if (ataque.buffSpd) claseAnim = "anim-velocidad";
        else if (ataque.escudo) claseAnim = "anim-escudo";
        else if (ataque.buffAtk) claseAnim = "anim-fuerza";
        
        el.classList.remove("anim-buff", "anim-velocidad", "anim-escudo", "anim-fuerza");
        void el.offsetWidth;
        el.classList.add(claseAnim);
        setTimeout(() => el.classList.remove(claseAnim), 800);
    },

    animarDano: function(esJugador, ataque, tipoAccion) {
        const el = esJugador ?
        (document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite")) : (document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite"));
        const area = document.getElementById("battle-area") || document.querySelector(".coliseum-card");
        if(!el) return;
        let claseHit = "hit-effect"; 
        let shakeFuerte = false;

        if (tipoAccion === "ataque") {
            claseHit = "hit-basico";
            shakeFuerte = false;
        } else if (ataque) {
            let n = (ataque.nombre || "").toLowerCase();
            let e = ataque.elemento || "";
            let isMulti = (ataque.hits && ataque.hits > 1) || n.includes("cadena") || n.includes("ráfaga") ||
            n.includes("descarga") || n.includes("múltiple");

            if (isMulti) { claseHit = "hit-effect"; shakeFuerte = false;
            } 
            else if (n.includes("nuclear") || n.includes("explosión") || e === "Radiactivo") { claseHit = "hit-nuclear";
            shakeFuerte = true; }
            else if (n.includes("láser") || n.includes("plasma") || e === "Cibernético" || e === "Sintético") claseHit = "hit-laser";
            else if (n.includes("veneno") || n.includes("corrosión") || e === "Tóxico" || e === "Viral") claseHit = "hit-venom";
            else if (e === "Biomutante") claseHit = "hit-bio";
        }

        el.classList.remove("hit-effect", "hit-nuclear", "hit-laser", "hit-venom", "hit-bio", "hit-basico");
        void el.offsetWidth;
        el.classList.add(claseHit);
        setTimeout(() => el.classList.remove(claseHit), 400);

        if(area) { 
            area.classList.remove("shake-effect", "shake-hard");
            void area.offsetWidth; 
            area.classList.add(shakeFuerte ? "shake-hard" : "shake-effect"); 
        }
    },

    animarCuracion: function(esJugador) {
        const el = esJugador ?
        (document.getElementById("player-visual-box") || document.querySelector(".fighter-left .fighter-sprite")) : (document.getElementById("enemy-visual-box") || document.querySelector(".fighter-right .fighter-sprite"));
        if(el) { 
            el.classList.remove("heal-effect");
            void el.offsetWidth;
            el.classList.add("heal-effect"); setTimeout(() => el.classList.remove("heal-effect"), 500); 
        }
    },

    mostrarTextoFlotante: function(esJugador, texto, claseAdicional) {
        const sideEl = esJugador ?
        (document.getElementById("player-sprite-battle") || document.querySelector(".fighter-left")) : (document.getElementById("enemy-sprite-battle") || document.querySelector(".fighter-right"));
        if(!sideEl) return;
        const floater = document.createElement("div"); floater.className = `floating-text ${claseAdicional}`; floater.innerText = texto;
        let offsetX = (Math.random() - 0.5) * 40; let offsetY = (Math.random() - 0.5) * 20; let baseTop = "15%";
        let baseLeft = "50%"; let targetContainer = sideEl; 
        if (claseAdicional.includes("text-crit")) { targetContainer = document.querySelector(".fighters-wrapper") || document.getElementById("battle-area"); baseTop = "-25px";
        baseLeft = "50%"; offsetX = 0; floater.style.zIndex = "1000"; }
        floater.style.top = `calc(${baseTop} + ${offsetY}px)`;
        floater.style.left = `calc(${baseLeft} + ${offsetX}px)`; floater.style.transform = "translate(-50%, -50%)";
        targetContainer.appendChild(floater); setTimeout(() => floater.remove(), 1300);
    },

    inyectarSvgSeguro: function(adnData) {
        if (typeof generarSvgGeno !== 'function') return '';
        let svgString = generarSvgGeno(adnData); let tempDiv = document.createElement('div'); tempDiv.innerHTML = svgString; let svgEl = tempDiv.querySelector('svg');
        if (svgEl) { svgEl.setAttribute('width', '100%');
        svgEl.setAttribute('height', '100%'); svgEl.setAttribute('viewBox', '-20 -20 200 200'); svgEl.style.overflow = 'visible'; }
        return tempDiv.innerHTML;
    }
};