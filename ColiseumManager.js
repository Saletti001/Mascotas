// =========================================
// ColiseumManager.js - CONTROLADOR (Une Lógica e Interfaz)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    ColiseumUI.inyectarCSS();

    window.iniciarColiseo = function() {
        if (!window.miMascota || window.miMascota.id === "temp") {
            alert("No tienes un Geno activo para combatir.");
            return;
        }

        // Estructurar UI inicial
        const area = document.querySelector(".coliseum-card") || document.getElementById("battle-area");
        if(area && area.parentElement) area.parentElement.classList.add("coliseum-cyan-theme");
        
        let title = document.querySelector("h2, h1");
        if(title && area && title.parentElement !== area) {
            title.className = "coliseum-title-inside";
            area.insertBefore(title, area.firstChild);
        }

        // Asegurar que existan los contenedores
        let controls = document.getElementById("battle-controls") || document.querySelector(".controls-container");
        if(controls && area) {
            area.appendChild(controls);
            controls.innerHTML = `
                <button id="btn-atk" class="battle-btn atk-btn">⚔️ ATACAR</button>
                <button id="btn-special" class="battle-btn special-btn">✨ ESPECIAL</button>
                <button id="btn-buff" class="battle-btn buff-btn">🛡️ TÁCTICA</button>
            `;
            controls.style.setProperty("display", "none", "important");

            // Eventos de botones
            document.getElementById("btn-atk").onclick = () => procesarRonda("ataque");
            document.getElementById("btn-special").onclick = () => procesarRonda("especial");
            document.getElementById("btn-buff").onclick = () => procesarRonda("tactica");
        }

        let btnStart = document.getElementById("btn-start-battle") || document.querySelector(".btn-primary");
        if(btnStart) {
            btnStart.className = "btn-start";
            btnStart.innerText = "Entrar a la Arena";
            btnStart.style.setProperty("display", "block", "important");
            if(area) area.appendChild(btnStart);
            
            // EL EVENTO DE INICIAR PELEA
            btnStart.onclick = iniciarPelea;
        }

        let btnLeave = document.getElementById("btn-leave-battle") || document.querySelector(".btn-secondary");
        if(btnLeave && area && area.parentElement) {
            btnLeave.className = "btn-leave";
            btnLeave.innerText = "Retirarse";
            area.parentElement.appendChild(btnLeave);
        }

        const logBox = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
        if(logBox) logBox.innerHTML = `<span style="color:#aaa;">> Conectando con los servidores...</span><br><span style="color:#4dd0e1">> Arena lista.</span>`;
    };

    function iniciarPelea() {
        document.querySelector(".btn-start").style.setProperty("display", "none", "important");
        document.querySelector(".controls-container, #battle-controls").style.setProperty("display", "flex", "important");
        
        ColiseumLogic.prepararJugador(window.miMascota);
        ColiseumLogic.generarRivalProcedural(window.miMascota.level);
        
        ColiseumUI.actualizarGenos(ColiseumLogic.player, ColiseumLogic.enemy);
        ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
        
        const logBox = document.getElementById("battle-log") || document.querySelector(".battle-log-container");
        if(logBox) logBox.innerHTML = `<span style="color:#4dd0e1">> INICIALIZANDO COMBATE...</span><br><span style="color:#ffcc00; font-weight:bold;">--- BATTLE START ---</span>`;
        
        actualizarBotones();
    }

    function procesarRonda(accionJugador) {
        ColiseumUI.agregarLog(`<br><span style="color:#4dd0e1">[TURNO ${ColiseumLogic.turno}]</span>`);
        bloquearBotones(true);

        const p = ColiseumLogic.player;
        const e = ColiseumLogic.enemy;

        // Jugador Ataca
        ejecutarAccion(p, e, accionJugador);

        // Enemigo Ataca (si sobrevive)
        if (e.hp > 0) {
            setTimeout(() => {
                ejecutarAccion(e, p, "ataque");
                finalizarTurno();
            }, 800);
        } else {
            finalizarTurno();
        }
    }

    function ejecutarAccion(atacante, defensor, accion) {
        ColiseumUI.flashAtaque(atacante.isPlayer);
        
        if (accion === "tactica") {
            ColiseumUI.agregarLog(`<span style="color:#26a69a">> ¡${atacante.nombre} usa TÁCTICA! (+15% HP)</span>`);
            atacante.hp = Math.min(atacante.maxHp, atacante.hp + Math.floor(atacante.maxHp * 0.15));
        } 
        else {
            let mult = (accion === "especial") ? 1.5 : 1;
            if(accion === "especial") {
                ColiseumLogic.cooldownEspecial = 3;
                ColiseumUI.agregarLog(`<span style="color:#e040fb">> ¡${atacante.nombre} usa ATAQUE ESPECIAL!</span>`);
            }

            const resultado = ColiseumLogic.calcularDano(atacante, defensor, mult);
            ColiseumUI.flashDano(!atacante.isPlayer);
            
            let extra = resultado.isCrit ? " 💥 ¡CRÍTICO!" : "";
            ColiseumUI.agregarLog(`> ${atacante.nombre} causa <span style="color:#ff6b6b">${resultado.dmg} daño</span>.${extra}`);
        }
        
        ColiseumUI.actualizarHP(ColiseumLogic.player, ColiseumLogic.enemy);
    }

    function finalizarTurno() {
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
        ColiseumUI.agregarLog(`<br><span style="color:#ffcc00; font-weight: bold;">--- FIN DEL COMBATE ---</span>`);
        
        if (ColiseumLogic.player.hp > 0) {
            ColiseumUI.agregarLog(`<span style="color:#4CAF50">🏆 ¡VICTORIA!</span>`);
            if (window.ganarXP) window.ganarXP(50 + (ColiseumLogic.player.adn.level * 10));
        } else {
            ColiseumUI.agregarLog(`<span style="color:#f44336">💀 DERROTA.</span>`);
        }

        setTimeout(() => {
            document.querySelector(".controls-container, #battle-controls").style.setProperty("display", "none", "important");
            let btnStart = document.querySelector(".btn-start");
            if(btnStart) {
                btnStart.innerText = "Buscar otro rival";
                btnStart.style.setProperty("display", "block", "important");
            }
        }, 1500);
    }

    function actualizarBotones() {
        bloquearBotones(false);
        const btnSpecial = document.getElementById("btn-special");
        if(btnSpecial) {
            if (ColiseumLogic.cooldownEspecial > 0) {
                btnSpecial.disabled = true;
                btnSpecial.innerText = `⏳ ESPERA (${ColiseumLogic.cooldownEspecial})`;
            } else {
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