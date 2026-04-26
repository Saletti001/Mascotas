// =========================================
// ColiseumManager.js - CONTROLADOR V9.12 (ESTABLE Y CONECTADO)
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

        let btnAtk = document.getElementById("btn-atk");
        if (btnAtk) btnAtk.onclick = () => procesarRonda("ataque");
        
        let btnSpecial = document.getElementById("btn-special");
        if (btnSpecial) btnSpecial.onclick = () => procesarRonda("especial");

        let btnBuff = document.getElementById("btn-buff");
        if (btnBuff) btnBuff.onclick = () => procesarRonda("tactica");
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
        
        ColiseumUI.actualizarGraficos(ColiseumLogic.player, ColiseumLogic.enemy);
        ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
        
        actualizarBotones();
    }

    function procesarRonda(accionJugador) {
        ColiseumUI.agregarLog(`<br><span style="color:#4dd0e1">[TURNO ${ColiseumLogic.turno}]</span>`);
        bloquearBotones(true);

        const p = ColiseumLogic.player;
        const e = ColiseumLogic.enemy;

        let playerGoesFirst = p.spd >= e.spd;
        if (p.spd === e.spd) playerGoesFirst = Math.random() > 0.5;

        let ejecutor1 = playerGoesFirst ? p : e;
        let ejecutor2 = playerGoesFirst ? e : p;
        let accion1 = playerGoesFirst ? accionJugador : "ataque";
        let accion2 = playerGoesFirst ? "ataque" : accionJugador;

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
        
        if (accionElegida === "tactica") {
            ColiseumUI.agregarLog(`<span style="color:#26a69a">> ¡${atacante.nombre} aplica una TÁCTICA!</span>`);
            let cura = Math.floor(atacante.maxHp * 0.15); 
            if (cura < 1) cura = 1;
            atacante.hp = Math.min(atacante.maxHp, atacante.hp + cura);
            
            ColiseumUI.animarAtaque(atacante.isPlayer);
            ColiseumUI.animarCuracion(atacante.isPlayer); 
            ColiseumUI.mostrarTextoFlotante(atacante.isPlayer, `+${cura}`, "text-heal");
            ColiseumUI.agregarLog(`<span style="color:#4CAF50">* Recupera ${cura} HP y prepara su estrategia.</span>`);
        } else {
            const resultado = ColiseumLogic.ejecutarAtaqueCompleto(atacante, defensor, accionElegida);
            
            if (resultado.anims.atacanteGrita) ColiseumUI.animarAtaque(atacante.isPlayer);
            
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
        bloquearBotones(false);
        const btnSpecial = document.getElementById("btn-special");
        if (btnSpecial) {
            if (ColiseumLogic.cooldownEspecial > 0) {
                btnSpecial.disabled = true;
                btnSpecial.innerText = `ESPERA (${ColiseumLogic.cooldownEspecial})`;
            } else {
                btnSpecial.disabled = false;
                btnSpecial.innerText = `TÉCNICA`;
            }
        }
    }

    function bloquearBotones(bloquear) {
        ["btn-atk", "btn-special", "btn-buff", "btn-ultimate"].forEach(id => {
            let btn = document.getElementById(id);
            if(btn) btn.disabled = bloquear;
        });
    }
});