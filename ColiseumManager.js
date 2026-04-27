// =========================================
// ColiseumManager.js - CONTROLADOR V11.1 (ESCÁNER PERSONALIZADO CON NOMBRES)
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
        
        const p = ColiseumLogic.player;
        const e = ColiseumLogic.enemy;

        let calidadEnemigo = "C";
        if (e.adn && e.adn.stats && e.adn.stats.pureza) {
            let pureza = e.adn.stats.pureza;
            if (pureza >= 90) calidadEnemigo = "S"; else if (pureza >= 80) calidadEnemigo = "A";
            else if (pureza >= 60) calidadEnemigo = "B"; else if (pureza >= 40) calidadEnemigo = "C"; else calidadEnemigo = "D";
        } else {
            const prob = Math.random();
            if (e.rareza === "Legendario" || e.rareza === "Épico") calidadEnemigo = prob > 0.5 ? "S" : "A";
            else if (e.rareza === "Raro") calidadEnemigo = prob > 0.5 ? "A" : "B";
            else calidadEnemigo = prob > 0.7 ? "B" : (prob > 0.3 ? "C" : "D");
        }

        // ✨ FIX: Nombres personalizados inyectados directamente en el reporte de inicio
        ColiseumUI.agregarLog(`<span style="color:#b19cd9;">> 🧬 Escáner detecta Genética de ${ColiseumLogic.cName(e)}: Calidad [${calidadEnemigo}].</span>`);
        const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };

        if (ventajas[p.element] === e.element) {
            ColiseumUI.agregarLog(`<span style="color:#4CAF50; font-weight:bold;">> ⚔️ Matchup: ¡VENTAJA! El elemento de ${ColiseumLogic.cName(p)} (${p.element}) domina al de ${ColiseumLogic.cName(e)} (${e.element}). Harás +50% Daño.</span>`);
        } else if (ventajas[e.element] === p.element) {
            ColiseumUI.agregarLog(`<span style="color:#ff5722; font-weight:bold;">> ⚠️ Matchup: ¡PELIGRO! El elemento de ${ColiseumLogic.cName(e)} (${e.element}) domina al de ${ColiseumLogic.cName(p)} (${p.element}). Recibirás +50% Daño.</span>`);
        } else {
            ColiseumUI.agregarLog(`<span style="color:#80deea;">> ⚖️ Matchup: Neutral (${p.element} vs ${e.element}). Terreno equilibrado entre ${ColiseumLogic.cName(p)} y ${ColiseumLogic.cName(e)}.</span>`);
        }
        ColiseumUI.agregarLog(`<br>`);

        ColiseumUI.actualizarGraficos(ColiseumLogic.player, ColiseumLogic.enemy);
        ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
        actualizarBotones();
    }

    function procesarRonda(accionJugador) {
        ColiseumUI.agregarLog(`<br><span style="color:#4dd0e1; font-weight:bold; letter-spacing: 1px;">[ --- TURNO ${ColiseumLogic.turno} --- ]</span>`);
        bloquearBotones(true);

        const p = ColiseumLogic.player;
        const e = ColiseumLogic.enemy;

        let accionEnemigo = "ataque";
        let acts = Object.keys(e.ataquesEquipados).filter(k => e.ataquesEquipados[k] !== null);
        
        if (acts.includes("tactica") && e.cooldowns.tactica === 0 && e.hp <= e.maxHp * 0.4 && Math.random() < 0.7) {
            accionEnemigo = "tactica";
        } else if (acts.includes("definitivo") && e.cooldowns.definitivo === 0 && Math.random() < 0.2) {
            accionEnemigo = "definitivo";
        } else if (acts.includes("especial") && e.cooldowns.especial === 0 && Math.random() < 0.4) {
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
                ColiseumUI.agregarLog(`<span style="color:#555;">&nbsp;&nbsp;♦ ♦ ♦</span>`); 
                ejecutarAccionYAnimar(ejecutor2, ejecutor1, accion2);
                setTimeout(() => { finalizarRonda(); }, 1500);
            }, 1500); 
        } else {
            setTimeout(() => { finalizarRonda(); }, 1500);
        }
    }

    function ejecutarAccionYAnimar(atacante, defensor, accionElegida) {
        if (atacante.hp <= 0 || defensor.hp <= 0) return;
        
        const ataqueUsado = atacante.ataquesEquipados[accionElegida];
        const resultado = ColiseumLogic.ejecutarAtaqueCompleto(atacante, defensor, accionElegida);
        
        resultado.logs.forEach(log => ColiseumUI.agregarLog(log));

        let potenciaEfectiva = 0;
        if (ataqueUsado) {
            potenciaEfectiva = ataqueUsado.potencia || (ataqueUsado.potenciaBase ? ataqueUsado.potenciaBase * 100 : 0);
            if (potenciaEfectiva > 0 && potenciaEfectiva < 10) potenciaEfectiva *= 100;
        }

        if (potenciaEfectiva > 0 && resultado.anims.detalleGolpes && resultado.anims.detalleGolpes.length > 0) {
            resultado.anims.detalleGolpes.forEach((golpe, idx) => {
                setTimeout(() => {
                    if (resultado.anims.atacanteGrita) ColiseumUI.animarAtaque(atacante.isPlayer, ataqueUsado, accionElegida);
                    
                    if (golpe.dmg > 0) {
                        ColiseumUI.animarDano(!atacante.isPlayer, ataqueUsado, accionElegida);
                        if (golpe.critico) ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, "CRÍTICO!", "text-crit");
                        ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, `-${golpe.dmg}`, "text-dmg");
                        if(window.Sonidos) window.Sonidos.play("hit");
                    } else if (golpe.bloqueado) {
                        ColiseumUI.animarSoporte(!atacante.isPlayer, {escudo: true}); 
                        ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, "BLOCKED!", "text-block");
                    } else if (golpe.evadido) {
                        ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, "EVADED!", "text-evade");
                    }

                    ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
                }, idx * 400);
            });
        } else if (potenciaEfectiva === 0 && ataqueUsado) {
            ColiseumUI.animarSoporte(atacante.isPlayer, ataqueUsado);
        }
        
        if (resultado.anims.curacionAtacante > 0) {
            ColiseumUI.animarCuracion(atacante.isPlayer);
            ColiseumUI.mostrarTextoFlotante(atacante.isPlayer, `+${resultado.anims.curacionAtacante}`, "text-heal");
        }
    }

    function finalizarRonda() {
        const p = ColiseumLogic.player;
        const e = ColiseumLogic.enemy;

        let resP = ColiseumLogic.procesarEfectosFinTurno(p);
        let resE = ColiseumLogic.procesarEfectosFinTurno(e);
        let huboEfectos = resP.logs.length > 0 || resE.logs.length > 0;

        if (huboEfectos) {
            ColiseumUI.agregarLog(`<span style="color:#777; font-style:italic;">[Efectos y Condiciones]</span>`);
            
            resP.logs.forEach(l => ColiseumUI.agregarLog(l));
            if(resP.anims.heal > 0) { ColiseumUI.animarCuracion(true); ColiseumUI.mostrarTextoFlotante(true, `+${resP.anims.heal}`, "text-heal"); }
            if(resP.anims.dmg > 0) { ColiseumUI.animarDano(true); ColiseumUI.mostrarTextoFlotante(true, `-${resP.anims.dmg}`, "text-dmg"); }

            resE.logs.forEach(l => ColiseumUI.agregarLog(l));
            if(resE.anims.heal > 0) { ColiseumUI.animarCuracion(false); ColiseumUI.mostrarTextoFlotante(false, `+${resE.anims.heal}`, "text-heal"); }
            if(resE.anims.dmg > 0) { ColiseumUI.animarDano(false); ColiseumUI.mostrarTextoFlotante(false, `-${resE.anims.dmg}`, "text-dmg"); }
        }

        if (p.cooldowns.especial > 0) p.cooldowns.especial--;
        if (p.cooldowns.tactica > 0) p.cooldowns.tactica--;
        if (p.cooldowns.definitivo > 0) p.cooldowns.definitivo--;

        if (e.cooldowns.especial > 0) e.cooldowns.especial--;
        if (e.cooldowns.tactica > 0) e.cooldowns.tactica--;
        if (e.cooldowns.definitivo > 0) e.cooldowns.definitivo--;

        ColiseumUI.actualizarHP(p, e);
        ColiseumLogic.turno++;
        
        let pausaFinal = huboEfectos ? 1100 : 400;

        setTimeout(() => {
            if (p.hp <= 0 || e.hp <= 0) terminarCombate();
            else actualizarBotones();
        }, pausaFinal);
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
            if(btnStart) { btnStart.style.setProperty("display", "block", "important"); btnStart.innerText = "Buscar otro rival"; }
            if(btnLeave) btnLeave.style.setProperty("display", "block", "important"); 
        }, 1000);
    }

    function actualizarBotones() {
        if (typeof ColiseumUI.actualizarBotonesAtaque === 'function') {
            ColiseumUI.actualizarBotonesAtaque(window.miMascota);
        }
        
        bloquearBotones(false);
        const p = ColiseumLogic.player;
        const equipados = p.ataquesEquipados;

        const btn2 = document.getElementById("btn-atk-2");
        if (btn2 && equipados.especial && p.cooldowns.especial > 0) {
            btn2.disabled = true;
            btn2.innerText = `ESPERA (${p.cooldowns.especial})`;
        }
        
        const btn3 = document.getElementById("btn-atk-3");
        if (btn3 && equipados.tactica && p.cooldowns.tactica > 0) {
            btn3.disabled = true;
            btn3.innerText = `ESPERA (${p.cooldowns.tactica})`;
        }

        const btn4 = document.getElementById("btn-atk-4");
        if (btn4 && equipados.definitivo && p.cooldowns.definitivo > 0 && !btn4.innerText.includes("NV. 25")) {
            btn4.disabled = true;
            btn4.innerText = `ESPERA (${p.cooldowns.definitivo})`;
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