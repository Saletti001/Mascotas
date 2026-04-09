// =========================================
// ColiseumManager.js - SISTEMA DE COMBATE
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const log = document.getElementById("battle-log");
    const btnBattle = document.getElementById("btn-start-battle");
    
    let playerHP = 0;
    let enemyHP = 0;
    let inBattle = false;

    window.iniciarColiseo = function() {
        if(inBattle) return;
        
        // Preparar Visuales
        document.getElementById("player-visual-box").innerHTML = generarSvgGeno(window.miMascota.visual_genes);
        document.getElementById("enemy-visual-box").innerHTML = generarSvgGeno({ body_shape: "gota", base_color: "#555" });
        
        const svgs = document.querySelectorAll("#battle-area svg");
        svgs.forEach(s => { s.style.width = "80px"; s.style.height = "80px"; });

        document.getElementById("battle-player-name").innerText = window.miMascota.name;
        log.innerHTML = "¡Preparado para la batalla!";
        
        // Resetear Barras
        document.getElementById("player-hp-bar").style.width = "100%";
        document.getElementById("enemy-hp-bar").style.width = "100%";
        btnBattle.disabled = false;
        btnBattle.innerText = "Entrar a la Arena";
    }

    function addLog(msg, color = "#fff") {
        log.innerHTML += `<div style="color: ${color}">${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    }

    async function ejecutarBatalla() {
        inBattle = true;
        btnBattle.disabled = true;
        btnBattle.innerText = "Combatiendo...";
        log.innerHTML = "";
        
        // Stats del Jugador
        playerHP = window.miMascota.stats.hp;
        let pAtk = window.miMascota.stats.atk;
        let pSpd = window.miMascota.stats.spd;
        let pLuk = window.miMascota.stats.luk;

        // Stats del Enemigo (Escalan con el nivel del jugador)
        enemyHP = 40 + (window.miMascota.level * 5);
        let eAtk = 8 + (window.miMascota.level * 2);
        let eSpd = 5 + (window.miMascota.level);
        let maxEnemyHP = enemyHP;
        let maxPlayerHP = playerHP;

        addLog(`⚔️ Un enemigo nivel ${window.miMascota.level} aparece.`);

        while(playerHP > 0 && enemyHP > 0) {
            // Determinar orden del turno
            let primerAtacante = pSpd >= eSpd ? "player" : "enemy";
            
            // Turno 1
            await realizarAtaque(primerAtacante, pAtk, eAtk, pLuk);
            if(enemyHP <= 0 || playerHP <= 0) break;

            // Turno 2
            await realizarAtaque(primerAtacante === "player" ? "enemy" : "player", pAtk, eAtk, pLuk);
            await new Promise(r => setTimeout(r, 800));
        }

        if(playerHP > 0) {
            addLog("¡VICTORIA! 🏆", "#4CAF50");
            const xpGanada = 50 + (window.miMascota.level * 10);
            window.ganarXP(xpGanada);
        } else {
            addLog("DERROTA... 💀", "#d9534f");
            alert("Tu Geno ha caído. Necesita descansar para recuperar fuerzas.");
        }

        inBattle = false;
        btnBattle.innerText = "Volver a intentar";
        btnBattle.disabled = false;
    }

    async function realizarAtaque(quien, pAtk, eAtk, pLuk) {
        return new Promise(resolve => {
            setTimeout(() => {
                if(quien === "player") {
                    let esCritico = Math.random() * 100 < pLuk;
                    let daño = Math.floor(pAtk * (0.9 + Math.random() * 0.2));
                    if(esCritico) { daño *= 2; addLog("⭐ ¡GOLPE CRÍTICO!", "#ffcc00"); }
                    
                    enemyHP -= daño;
                    addLog(`Tu Geno causa ${daño} de daño.`, "#add8e6");
                    const perc = Math.max(0, (enemyHP / (40 + window.miMascota.level * 5)) * 100);
                    document.getElementById("enemy-hp-bar").style.width = perc + "%";
                } else {
                    let dañoEnemigo = Math.floor(eAtk * (0.8 + Math.random() * 0.2));
                    playerHP -= dañoEnemigo;
                    addLog(`El enemigo causa ${dañoEnemigo} de daño.`, "#ffb6c1");
                    const perc = Math.max(0, (playerHP / window.miMascota.stats.hp) * 100);
                    document.getElementById("player-hp-bar").style.width = perc + "%";
                }
                resolve();
            }, 600);
        });
    }

    if(btnBattle) btnBattle.addEventListener("click", ejecutarBatalla);
});