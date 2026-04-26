// =========================================
// ColiseumManager.js - CONTROLADOR V10.1 (ESCÁNER DE COMBATE INICIAL)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    ColiseumUI.inyectarCSS();

    window.iniciarColiseo = function() {
        if (!window.miMascota || window.miMascota.id === "temp") {
            alert("No tienes un Geno activo para combatir.");
            window.navegarA("room-area");
            return;
        }

        ColiseumUI.configurarDOM();
        ColiseumUI.limpiarLog();
        ColiseumUI.agregarLog(`<span style="color:#aaa;">> Conectando con los servidores del Coliseo...</span><br><span style="color:#4dd0e1">> Arena lista. Esperando combatientes.</span>`);

        let btnStart = document.getElementById("btn-start-battle");
        if (btnStart) btnStart.onclick = iniciarPelea;

        let btnAtk1 = document.getElementById("btn-atk-1");
        if (btnAtk1) btnAtk1.onclick = () => procesarRonda("ataque");
        
        let btnAtk2 = document.getElementById("btn-atk-2");
        if (btnAtk2) btnAtk2.onclick = () => procesarRonda("especial");

        let btnAtk3 = document.getElementById("btn-atk-3");
        if (btnAtk3) btnAtk3.onclick = () => procesarRonda("tactica");

        let btnAtk4 = document.getElementById("btn-atk-4");
        if (btnAtk4) btnAtk4.onclick = () => procesarRonda("definitivo");
    };

    function iniciarPelea() {
        let btnStart = document.getElementById("btn-start-battle");
        let btnLeave = document.getElementById("btn-leave-battle"); 
        let controls = document.getElementById("battle-controls");
        
        if(btnStart) btnStart.style.setProperty("display", "none", "important");
        if(btnLeave) btnLeave.style.setProperty("display", "none", "important");
        if(controls) controls.style.setProperty("display", "grid", "important");
        
        ColiseumUI.limpiarLog();
        ColiseumUI.agregarLog(`<span style="color:#4dd0e1">> INICIALIZANDO SECUENCIA DE COMBATE...</span>`);
        ColiseumUI.agregarLog(`<br><span style="color:#ffcc00; font-weight:bold;">--- BATTLE START ---</span>`);

        ColiseumLogic.prepararJugador(window.miMascota);
        ColiseumLogic.generarRivalProcedural(window.miMascota.level || 1);
        
        // ✨ NUEVO: ESCÁNER TÁCTICO INICIAL
        const p = ColiseumLogic.player;
        const e = ColiseumLogic.enemy;

        // 1. Determinar la calidad genética del rival
        let calidadEnemigo = "C";
        if (e.adn && e.adn.stats && e.adn.stats.pureza) {
            let pureza = e.adn.stats.pureza;
            if (pureza >= 90) calidadEnemigo = "S";
            else if (pureza >= 80) calidadEnemigo = "A";
            else if (pureza >= 60) calidadEnemigo = "B";
            else if (pureza >= 40) calidadEnemigo = "C";
            else calidadEnemigo = "D";
        } else {
            // Si es un enemigo procedural puro, estimamos su calidad por su rareza
            const prob = Math.random();
            if (e.rareza === "Legendario" || e.rareza === "Épico") {
                calidadEnemigo = prob > 0.5 ? "S" : "A";
            } else if (e.rareza === "Raro") {
                calidadEnemigo = prob > 0.5 ? "A" : "B";
            } else {
                calidadEnemigo = prob > 0.7 ? "B" : (prob > 0.3 ? "C" : "D");
            }
        }

        ColiseumUI.agregarLog(`<span style="color:#b19cd9;">> 🧬 Escáner detecta Genética Rival: Calidad [${calidadEnemigo}].</span>`);

        // 2. Analizar ventajas elementales
        const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };

        if (ventajas[p.element] === e.element) {
            ColiseumUI.agregarLog(`<span style="color:#4CAF50; font-weight:bold;">> ⚔️ Matchup: ¡VENTAJA! (${p.element} domina a ${e.element}). Harás +50% Daño.</span>`);
        } else if (ventajas[e.element] === p.element) {
            ColiseumUI.agregarLog(`<span style="color:#ff5722; font-weight:bold;">> ⚠️ Matchup: ¡PELIGRO! (${e.element} domina a ${p.element}). Recibirás +50% Daño.</span>`);
        } else {
            ColiseumUI.agregarLog(`<span style="color:#80deea;">> ⚖️ Matchup: Neutral (${p.element} vs ${e.element}). Terreno equilibrado.</span>`);
        }
        ColiseumUI.agregarLog(`<br>`); // Espaciador antes del primer turno
        // -------------------------------------

        ColiseumUI.actualizarGraficos(ColiseumLogic.player, ColiseumLogic.enemy);
        ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
        
        actualizarBotones();
    }

    function procesarRonda(accionJugador) {
        ColiseumUI.agregarLog(`<br><span style="color:#4dd0e1">[TURNO ${ColiseumLogic.turno}]</span>`);
        bloquearBotones(true);

        const p = ColiseumLogic.player;
        const e = ColiseumLogic.enemy;

        let accionEnemigo = "ataque";
        let acts = Object.keys(e.ataquesEquipados).filter(k => e.ataquesEquipados[k] !== null);
        
        if (acts.includes("tactica") && e.hp <= e.maxHp * 0.4 && Math.random() < 0.7) {
            accionEnemigo = "tactica";
        } else if (acts.includes("definitivo") && Math.random() < 0.2) {
            accionEnemigo = "definitivo";
        } else if (acts.includes("especial") && Math.random() < 0.4) {
            accionEnemigo = "especial";
        }

        let playerGoesFirst = p.spd >= e.spd;
        if (p.spd === e.spd) playerGoesFirst = Math.random() > 0.5;

        let ejecutor1 = playerGoesFirst ? p : e;
        let ejecutor2 = playerGoesFirst ? e : p;
        let accion1 = playerGoesFirst ? accionJugador : accionEnemigo;
        let accion2 = playerGoesFirst ? accionEnemigo : accionJugador;

        ejecutarAccionYAnimar(ejecutor1, ejecutor2, accion1);
        
        if (ejecutor2.hp > 0) {
            setTimeout(() => {
                ejecutarAccionYAnimar(ejecutor2, ejecutor1, accion2);
                finalizarRonda();
            }, 900);
        } else {
            finalizarRonda();
        }
    }

    function ejecutarAccionYAnimar(atacante, defensor, accionElegida) {
        if (atacante.hp <= 0 || defensor.hp <= 0) return;
        
        const resultado = ColiseumLogic.ejecutarAtaqueCompleto(atacante, defensor, accionElegida);
        
        if (resultado.anims.atacanteGrita && atacante.ataquesEquipados[accionElegida] && atacante.ataquesEquipados[accionElegida].potencia > 0) {
            ColiseumUI.animarAtaque(atacante.isPlayer);
        }
        
        resultado.logs.forEach(log => ColiseumUI.agregarLog(log));

        if (resultado.anims.danoDefensor > 0) {
            ColiseumUI.animarDano(!atacante.isPlayer);
            if (resultado.anims.critico) ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, "CRITICAL!", "text-crit");
            ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, `-${resultado.anims.danoDefensor}`, "text-dmg");
            if(window.Sonidos) window.Sonidos.play("hit");
        }

        if (resultado.anims.curacionAtacante > 0) {
            ColiseumUI.animarCuracion(atacante.isPlayer);
            ColiseumUI.mostrarTextoFlotante(atacante.isPlayer, `+${resultado.anims.curacionAtacante}`, "text-heal");
        }

        if (resultado.anims.danoReflejo > 0) {
            ColiseumUI.animarDano(atacante.isPlayer);
            ColiseumUI.mostrarTextoFlotante(atacante.isPlayer, `-${resultado.anims.danoReflejo}`, "text-dmg");
        }
        
        ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
    }

    function finalizarRonda() {
        setTimeout(() => {
            let resP = ColiseumLogic.procesarEfectosFinTurno(ColiseumLogic.player);
            resP.logs.forEach(l => ColiseumUI.agregarLog(l));
            if(resP.anims.heal > 0) { ColiseumUI.animarCuracion(true); ColiseumUI.mostrarTextoFlotante(true, `+${resP.anims.heal}`, "text-heal"); }
            if(resP.anims.dmg > 0) { ColiseumUI.animarDano(true); ColiseumUI.mostrarTextoFlotante(true, `-${resP.anims.dmg}`, "text-dmg"); }

            let resE = ColiseumLogic.procesarEfectosFinTurno(ColiseumLogic.enemy);
            resE.logs.forEach(l => ColiseumUI.agregarLog(l));
            if(resE.anims.heal > 0) { ColiseumUI.animarCuracion(false); ColiseumUI.mostrarTextoFlotante(false, `+${resE.anims.heal}`, "text-heal"); }
            if(resE.anims.dmg > 0) { ColiseumUI.animarDano(false); ColiseumUI.mostrarTextoFlotante(false, `-${resE.anims.dmg}`, "text-dmg"); }

            ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
            if (ColiseumLogic.cooldownEspecial > 0) ColiseumLogic.cooldownEspecial--;
            ColiseumLogic.turno++;
            
            setTimeout(() => {
                if (ColiseumLogic.player.hp <= 0 || ColiseumLogic.enemy.hp <= 0) {
                    terminarCombate();
                } else {
                    actualizarBotones();
                }
            }, 600);
        }, 800);
    }

    function terminarCombate() {
        bloquearBotones(true);
        ColiseumUI.agregarLog(`<br><span style="color:#ffcc00; font-size: 16px; font-weight: bold;">--- FIN DEL COMBATE ---</span>`);
        
        if (ColiseumLogic.player.hp > 0) {
            ColiseumUI.agregarLog(`<span style="color:#4CAF50">🏆 ¡VICTORIA!</span>`, "#ffd54f");
            const xpGanada = 50 + (ColiseumLogic.player.adn.level * 10);
            ColiseumUI.agregarLog(`<span style="color:#aaa">Ganaste ${xpGanada} XP.</span>`);
            if (window.ganarXP) window.ganarXP(xpGanada);
        } else {
            ColiseumUI.agregarLog(`<span style="color:#f44336">💀 DERROTA. Tu Geno debe descansar.</span>`);
        }

        setTimeout(() => {
            let controls = document.getElementById("battle-controls");
            let btnStart = document.getElementById("btn-start-battle");
            let btnLeave = document.getElementById("btn-leave-battle"); 
            
            if(controls) controls.style.setProperty("display", "none", "important");
            if(btnStart) {
                btnStart.style.setProperty("display", "block", "important");
                btnStart.innerText = "Buscar otro rival";
            }
            if(btnLeave) {
                btnLeave.style.setProperty("display", "block", "important"); 
            }
        }, 1000);
    }

    function actualizarBotones() {
        if (typeof ColiseumUI.actualizarBotonesAtaque === 'function') {
            ColiseumUI.actualizarBotonesAtaque(window.miMascota);
        }
        
        bloquearBotones(false);

        const btnSpecial = document.getElementById("btn-atk-2");
        if (btnSpecial && !btnSpecial.disabled && btnSpecial.innerText !== "VACÍO") {
            if (ColiseumLogic.cooldownEspecial > 0) {
                btnSpecial.disabled = true;
                btnSpecial.innerText = `ESPERA (${ColiseumLogic.cooldownEspecial})`;
            }
        }
    }

    function bloquearBotones(bloquear) {
        ["btn-atk-1", "btn-atk-2", "btn-atk-3", "btn-atk-4"].forEach(id => {
            let btn = document.getElementById(id);
            if(btn && btn.innerText !== "VACÍO" && !btn.innerText.includes("NV. 25")) {
                btn.disabled = bloquear;
            }
        });
    }
});