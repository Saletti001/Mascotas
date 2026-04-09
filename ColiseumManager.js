// =========================================
// ColiseumManager.js - COMBATE TÁCTICO POR TURNOS
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const log = document.getElementById("battle-log");
    const btnStart = document.getElementById("btn-start-battle");
    const btnLeave = document.getElementById("btn-leave-battle");
    const battleControls = document.getElementById("battle-controls");
    
    // Botones de acción
    const btnAtk = document.getElementById("btn-action-atk");
    const btnSkill = document.getElementById("btn-action-skill");
    const btnItem = document.getElementById("btn-action-item");

    let playerHP, maxPlayerHP, enemyHP, maxEnemyHP;
    let inBattle = false;
    let isPlayerTurn = true;
    let skillCooldown = 0; // Turnos para volver a usar habilidad

    window.iniciarColiseo = function() {
        if(inBattle) return;
        
        document.getElementById("player-visual-box").innerHTML = generarSvgGeno(window.miMascota.visual_genes);
        document.getElementById("enemy-visual-box").innerHTML = generarSvgGeno({ body_shape: "gota", base_color: "#555" });
        
        const svgs = document.querySelectorAll("#battle-area svg");
        svgs.forEach(s => { s.style.width = "70px"; s.style.height = "70px"; });

        document.getElementById("battle-player-name").innerText = window.miMascota.name;
        log.innerHTML = "¡Bienvenido a la Arena Nexo!<br>Prepárate para combatir.";
        
        document.getElementById("player-hp-bar").style.width = "100%";
        document.getElementById("enemy-hp-bar").style.width = "100%";
        document.getElementById("player-hp-text").innerText = "HP";
        document.getElementById("enemy-hp-text").innerText = "HP";
        
        btnStart.classList.remove("hidden");
        battleControls.classList.add("hidden");
        btnLeave.disabled = false;
    }

    function addLog(msg, color = "#fff") {
        log.innerHTML += `<div style="color: ${color}; margin-top: 4px;">${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    }

    function actualizarBarras() {
        const pPerc = Math.max(0, (playerHP / maxPlayerHP) * 100);
        const ePerc = Math.max(0, (enemyHP / maxEnemyHP) * 100);
        document.getElementById("player-hp-bar").style.width = pPerc + "%";
        document.getElementById("enemy-hp-bar").style.width = ePerc + "%";
        document.getElementById("player-hp-text").innerText = `${Math.floor(playerHP)} / ${maxPlayerHP}`;
        document.getElementById("enemy-hp-text").innerText = `${Math.floor(enemyHP)} / ${maxEnemyHP}`;
    }

    function blockControls(block) {
        btnAtk.disabled = block;
        btnSkill.disabled = block || skillCooldown > 0;
        btnItem.disabled = block;
        if(!block && skillCooldown > 0) {
            btnSkill.innerText = `⏳ Recargando (${skillCooldown})`;
            btnSkill.style.background = "#555";
        } else if (!block) {
            btnSkill.innerText = `✨ ${window.miMascota.element}`;
            btnSkill.style.background = "#7b1fa2";
        }
    }

    // INICIO DE BATALLA
    btnStart.addEventListener("click", () => {
        inBattle = true;
        btnStart.classList.add("hidden");
        battleControls.classList.remove("hidden");
        btnLeave.disabled = true; // No puedes huir cobardemente
        log.innerHTML = "";
        
        maxPlayerHP = window.miMascota.stats.hp;
        playerHP = maxPlayerHP;
        
        maxEnemyHP = 40 + (window.miMascota.level * 8);
        enemyHP = maxEnemyHP;
        skillCooldown = 0;

        addLog(`⚔️ ¡Aparece un Sujeto de Prueba Nv.${window.miMascota.level}!`, "#ffcc00");
        actualizarBarras();
        blockControls(false);
    });

    // TURNO DEL JUGADOR: ATACAR
    btnAtk.addEventListener("click", () => {
        blockControls(true);
        const pAtk = window.miMascota.stats.atk;
        const pLuk = window.miMascota.stats.luk;
        
        let daño = Math.floor(pAtk * (0.9 + Math.random() * 0.2));
        let esCritico = Math.random() * 100 < pLuk;
        if(esCritico) { daño *= 2; addLog("⭐ ¡GOLPE CRÍTICO!", "#ffea00"); }
        
        enemyHP -= daño;
        addLog(`👉 Atacas y causas ${daño} de daño.`, "#64b5f6");
        
        if(skillCooldown > 0) skillCooldown--;
        verificarEstado();
    });

    // TURNO DEL JUGADOR: HABILIDAD ELEMENTAL
    btnSkill.addEventListener("click", () => {
        blockControls(true);
        skillCooldown = 3; // Tarda 3 turnos en recargar
        
        const elemento = window.miMascota.element;
        const pAtk = window.miMascota.stats.atk;

        addLog(`✨ ¡Tu Geno usa poder ${elemento}!`, "#e040fb");
        
        if (elemento.includes("Tóxico")) {
            let daño = Math.floor(pAtk * 1.5);
            enemyHP -= daño;
            addLog(`El ácido corroe al enemigo por ${daño} de daño.`, "#69f0ae");
        } else if (elemento.includes("Acuático")) {
            let cura = Math.floor(maxPlayerHP * 0.3);
            playerHP = Math.min(maxPlayerHP, playerHP + cura);
            addLog(`El agua sanadora restaura ${cura} HP.`, "#18ffff");
        } else {
            // Habilidad por defecto (Daño masivo)
            let daño = Math.floor(pAtk * 1.8);
            enemyHP -= daño;
            addLog(`Un impacto elemental causa ${daño} de daño masivo.`, "#ff5252");
        }
        
        verificarEstado();
    });

    // TURNO DEL JUGADOR: USAR MANZANA
    btnItem.addEventListener("click", () => {
        if (window.miInventario && window.miInventario.consumeItem("apple_01", 1)) {
            blockControls(true);
            playerHP = Math.min(maxPlayerHP, playerHP + 25);
            addLog("🍎 Te comes una manzana y recuperas 25 HP.", "#81c784");
            
            if(skillCooldown > 0) skillCooldown--;
            verificarEstado();
        } else {
            alert("No tienes manzanas en tu mochila. ¡Ve al Arcade a recolectar!");
        }
    });

    // LÓGICA DE RESOLUCIÓN
    function verificarEstado() {
        actualizarBarras();
        
        if (enemyHP <= 0) {
            terminarBatalla(true);
        } else {
            // Turno del Enemigo tras 1 segundo de pausa
            setTimeout(turnoEnemigo, 1000);
        }
    }

    function turnoEnemigo() {
        const eAtk = 8 + (window.miMascota.level * 2);
        let daño = Math.floor(eAtk * (0.8 + Math.random() * 0.4));
        
        // Si el Geno es rápido, hay chance de esquivar
        let chanceEsquivar = window.miMascota.stats.spd * 0.5; // Ej: 20 Spd = 10% chance
        if (Math.random() * 100 < chanceEsquivar) {
            addLog(`💨 ¡Tu Geno es muy ágil y ESQUIVÓ el ataque!`, "#b2dfdb");
        } else {
            playerHP -= daño;
            addLog(`💀 El enemigo te golpea por ${daño} de daño.`, "#ef5350");
        }
        
        actualizarBarras();

        if (playerHP <= 0) {
            terminarBatalla(false);
        } else {
            blockControls(false); // Devolver el turno al jugador
        }
    }

    function terminarBatalla(victoria) {
        inBattle = false;
        battleControls.classList.add("hidden");
        btnStart.classList.remove("hidden");
        btnLeave.disabled = false;

        if (victoria) {
            addLog("🏆 ¡VICTORIA!", "#ffd54f");
            const xpGanada = 50 + (window.miMascota.level * 10);
            addLog(`Ganaste ${xpGanada} puntos de Experiencia.`, "#4CAF50");
            if(window.ganarXP) window.ganarXP(xpGanada);
            btnStart.innerText = "Buscar otro rival";
        } else {
            addLog("❌ DERROTA...", "#e53935");
            addLog("Tu Geno está agotado. Aliméntalo para recuperar fuerzas.", "#aaa");
            btnStart.innerText = "Revancha";
        }
        
        // Guardar progreso automáticamente
        if(window.guardarProgreso) window.guardarProgreso();
    }
});