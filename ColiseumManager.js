// =========================================
// ColiseumManager.js - CONTROLADOR DE EVENTOS Y TURNOS V9.2
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

        // Asignar funciones garantizando los IDs
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
        let controls = document.getElementById("battle-controls");
        
        if(btnStart) btnStart.style.setProperty("display", "none", "important");
        if(controls) controls.style.setProperty("display", "flex", "important");

        ColiseumUI.limpiarLog();
        ColiseumUI.agregarLog(`<span style="color:#4dd0e1">> INICIALIZANDO SECUENCIA DE COMBATE...</span>`);
        ColiseumUI.agregarLog(`<br><span style="color:#ffcc00; font-weight:bold;">--- BATTLE START ---</span>`);

        ColiseumLogic.prepararJugador(window.miMascota);
        ColiseumLogic.generarRivalProcedural(window.miMascota.level || 1);
        
        ColiseumUI.actualizarGraficos(ColiseumLogic.player, ColiseumLogic.enemy);
        
        // --- SOBRESCRIBIR EL HTML PARA MOSTRAR RAREZA Y ELEMENTO ---
        // Selector para tu panel (id o clase)
        let playerPanel = document.getElementById("player-sprite-battle") || document.querySelector(".fighter-left");
        let enemyPanel = document.getElementById("enemy-sprite-battle") || document.querySelector(".fighter-right");

        // Actualizar info Jugador (Nv y Elemento si quieres equilibrar)
        if (playerPanel) {
            let p = ColiseumLogic.player;
            let nameEl = playerPanel.querySelector(".fighter-name");
            if (nameEl) nameEl.innerHTML = `<strong>${p.nombre}</strong><br><span style="color:#aaa; font-size:10px; font-weight:normal;">(Nv. ${p.adn.level || 1})</span>`;
        }

        // Actualizar info Rival (Nombre aleatorio y Elemento|Rareza)
        if (enemyPanel) {
            let e = ColiseumLogic.enemy;
            let nameEl = enemyPanel.querySelector(".fighter-name");
            // ESTO ELIMINA "SUJETO PRUEBA" Y PONE LA INFO CORRECTA
            if (nameEl) nameEl.innerHTML = `<strong>${e.nombre}</strong><br><span style="color:#aaa; font-size:10px; font-weight:normal;">${e.rareza} - ${e.element}</span>`;
        }

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

        ejecutarAccion(ejecutor1, ejecutor2, accion1);
        
        if (ejecutor2.hp > 0) {
            setTimeout(() => {
                ejecutarAccion(ejecutor2, ejecutor1, accion2);
                finalizarRonda();
            }, 800);
        } else {
            finalizarRonda();
        }
    }

    function ejecutarAccion(atacante, defensor, accionElegida) {
        if (atacante.hp <= 0 || defensor.hp <= 0) return;

        ColiseumUI.animarAtaque(atacante.isPlayer);

        if (accionElegida === "tactica") {
            ColiseumUI.agregarLog(`<span style="color:#26a69a">> ¡${atacante.nombre} aplica una TÁCTICA!</span>`);
            let cura = Math.floor(atacante.maxHp * 0.15); 
            if (cura < 1) cura = 1;
            atacante.hp = Math.min(atacante.maxHp, atacante.hp + cura);
            ColiseumUI.mostrarTextoFlotante(atacante.isPlayer, `+${cura}`, "text-heal");
            ColiseumUI.agregarLog(`<span style="color:#4CAF50">* Recupera ${cura} HP y prepara su estrategia.</span>`);
        } else {
            let mult = (accionElegida === "especial") ? 1.5 : 1;
            if (accionElegida === "especial") {
                ColiseumLogic.cooldownEspecial = 3;
                ColiseumUI.agregarLog(`<span style="color:#e040fb">> ¡${atacante.nombre} usa un ATAQUE ESPECIAL!</span>`);
            }

            const resultado = ColiseumLogic.calcularDano(atacante, defensor, mult);
            ColiseumUI.animarDano(!atacante.isPlayer); 
            
            let tipoGolpe = "";
            if (resultado.multElem === 1.5) tipoGolpe = ` <span style="color:#4CAF50; font-weight:bold;">(¡Súper Efectivo!)</span>`;
            else if (resultado.multElem === 0.5) tipoGolpe = ` <span style="color:#888; font-weight:bold;">(Poco efectivo...)</span>`;

            if (resultado.isCrit) {
                ColiseumUI.agregarLog(`> 💥 <span style="color:#ff0000; font-weight:bold;">¡CRÍTICO!</span> ${atacante.nombre} causa <span style="color:#ff6b6b; font-weight:bold;">${resultado.dmg} de daño</span>.${tipoGolpe}`);
                ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, "CRITICAL!", "text-crit");
                ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, `-${resultado.dmg}`, "text-dmg", 150);
            } else {
                ColiseumUI.agregarLog(`> ${atacante.nombre} causa <span style="color:#ff6b6b">${resultado.dmg} de daño</span>.${tipoGolpe}`);
                if (resultado.dmg > 0) ColiseumUI.mostrarTextoFlotante(!atacante.isPlayer, `-${resultado.dmg}`, "text-dmg");
            }
        }
        
        ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
    }

    function finalizarRonda() {
        setTimeout(() => {
            if (ColiseumLogic.cooldownEspecial > 0) ColiseumLogic.cooldownEspecial--;
            ColiseumLogic.turno++;
            
            if (ColiseumLogic.player.hp <= 0 || ColiseumLogic.enemy.hp <= 0) {
                terminarCombate();
            } else {
                actualizarBotones();
            }
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
            
            if(controls) controls.style.setProperty("display", "none", "important");
            if(btnStart) {
                btnStart.style.setProperty("display", "block", "important");
                btnStart.innerText = "Buscar otro rival";
            }
        }, 1000);
    }

    function actualizarBotones() {
        bloquearBotones(false);
        const btnSpecial = document.getElementById("btn-special");
        if (btnSpecial) {
            if (ColiseumLogic.cooldownEspecial > 0) {
                btnSpecial.disabled = true;
                btnSpecial.innerText = `⏳ ESPERA (${ColiseumLogic.cooldownEspecial})`;
            } else {
                btnSpecial.disabled = false;
                btnSpecial.innerText = `✨ ESPECIAL`;
            }
        }
    }

    function bloquearBotones(bloquear) {
        ["btn-atk", "btn-special", "btn-buff"].forEach(id => {
            let btn = document.getElementById(id);
            if(btn) btn.disabled = bloquear;
        });
    }
});