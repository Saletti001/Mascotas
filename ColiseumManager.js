// =========================================
// ColiseumManager.js - MOTOR DE COMBATE V9.1 (BLINDADO)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    // Inyectar CSS para animaciones flotantes
    if (!document.getElementById("combat-styles")) {
        const style = document.createElement("style");
        style.id = "combat-styles";
        style.innerHTML = `
            @keyframes floatUpFade {
                0% { opacity: 1; transform: translateY(0) scale(1.5); }
                10% { transform: translateY(-10px) scale(1.8); }
                100% { opacity: 0; transform: translateY(-80px) scale(1); }
            }
            .floating-text {
                position: absolute; font-weight: 900; z-index: 100; pointer-events: none;
                animation: floatUpFade 1.3s ease-out forwards;
                text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 5px rgba(0,0,0,0.8);
            }
            .text-dmg { color: #ff3333; font-size: 28px; }
            .text-heal { color: #4CAF50; font-size: 24px; }
            .text-crit { color: #ffcc00; font-size: 32px; font-style: italic; text-transform: uppercase; letter-spacing: 2px; }
            .hit-effect { filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5); transform: scale(0.95); transition: 0.1s; }
            #player-sprite-battle, #enemy-sprite-battle { position: relative; transition: 0.3s; }
        `;
        document.head.appendChild(style);
    }

    const logCombate = document.getElementById("battle-log");
    const btnStart = document.getElementById("btn-start-battle");
    const btnLeave = document.getElementById("btn-leave-battle");
    const battleControls = document.getElementById("battle-controls");
    const battleArea = document.getElementById("battle-area"); 
    
    const btnAtk = document.getElementById("btn-action-atk");
    const btnItem = document.getElementById("btn-action-item");
    const btnSkill = document.getElementById("btn-action-skill");

    let playerCombat = null;
    let enemyCombat = null;
    let numeroTurno = 1;

    // =========================================
    // NUEVA FUNCIÓN: INYECCIÓN DE SVG SIN DESTRUIR CLASES
    // =========================================
    function inyectarSvgSeguro(mascotaData, size) {
        if (typeof generarSvgGeno !== 'function') return '';
        let svgString = generarSvgGeno(mascotaData);
        
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgString;
        
        let svgEl = tempDiv.querySelector('svg');
        if (svgEl) {
            svgEl.setAttribute('width', size);
            svgEl.setAttribute('height', size);
            svgEl.setAttribute('viewBox', '-20 0 200 160');
            svgEl.style.overflow = 'visible';
        }
        return tempDiv.innerHTML;
    }

    // =========================================
    // FUNCIONES DE "JUGO" (VISUALES Y SONIDO)
    // =========================================
    function scrollToBottom() { logCombate.scrollTop = logCombate.scrollHeight; }
    function addLog(text) { logCombate.innerHTML += `<div style="margin-top: 4px;">${text}</div>`; scrollToBottom(); }

    function sacudirPantalla() {
        if(battleArea) {
            battleArea.classList.remove("shake-effect");
            void battleArea.offsetWidth; 
            battleArea.classList.add("shake-effect");
            setTimeout(() => battleArea.classList.remove("shake-effect"), 400);
        }
    }

    function efectoCuracion(elementId) {
        const el = document.getElementById(elementId);
        if(el) {
            el.classList.remove("heal-effect");
            void el.offsetWidth;
            el.classList.add("heal-effect");
            setTimeout(() => el.classList.remove("heal-effect"), 600);
        }
    }

    function mostrarTextoFlotante(esJugador, texto, claseAdicional, delayMs = 0) {
        const sideId = esJugador ? "player-sprite-battle" : "enemy-sprite-battle";
        const sideEl = document.getElementById(sideId);
        if(!sideEl) return;
        
        setTimeout(() => {
            const floater = document.createElement("div");
            floater.className = `floating-text ${claseAdicional}`;
            floater.innerText = texto;
            const offsetX = (Math.random() - 0.5) * 80; 
            const offsetY = (Math.random() - 0.5) * 40;
            floater.style.top = `calc(30% + ${offsetY}px)`;
            floater.style.left = `calc(50% + ${offsetX}px)`;
            floater.style.transform = "translate(-50%, -50%)";
            sideEl.appendChild(floater);
            setTimeout(() => floater.remove(), 1300);
        }, delayMs);
    }

    function flashDamage(esJugador) {
        const sideId = esJugador ? "player-visual-box" : "enemy-visual-box";
        const el = document.getElementById(sideId);
        if(el) {
            el.classList.add("hit-effect"); 
            setTimeout(() => el.classList.remove("hit-effect"), 150);
        }
    }

    function actualizarBotonManzana() {
        let manzanas = 0;
        if (window.miInventario && window.miInventario.slots) {
            const item = window.miInventario.slots.find(i => i.id === "apple_01");
            if (item) manzanas = item.cantidad || item.count || 0;
        }
        btnItem.innerText = `🍎 Curar (+25 HP) [x${manzanas}]`;
        btnItem.disabled = manzanas <= 0;
    }

    function actualizarUICombate(p, esJugador) {
        const prefix = esJugador ? "player" : "enemy";
        const max = (p && p.maxHp > 0) ? p.maxHp : 1; 
        const current = (p && p.hp >= 0) ? p.hp : 0;
        
        const hpPct = Math.max(0, (current / max) * 100);
        const fillBar = document.getElementById(`${prefix}-hp-bar`);
        
        if (fillBar) {
            fillBar.style.width = `${hpPct}%`;
            if (hpPct > 50) fillBar.style.background = "#4CAF50";
            else if (hpPct > 20) fillBar.style.background = "#ffeb3b";
            else fillBar.style.background = "#f44336";
        }
        
        const txtHp = document.getElementById(`${prefix}-hp-text`);
        if (txtHp) txtHp.innerText = `${Math.floor(current)} / ${Math.floor(max)}`;

        const sprite = document.getElementById(`${prefix}-sprite-battle`);
        if (sprite) {
            if (current <= 0) sprite.style.filter = "grayscale(1) brightness(0.5)";
            else sprite.style.filter = "none";
        }
    }

    function obtenerMultiplicadorElemental(atkElement, defElement) {
        const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
        if (ventajas[atkElement] === defElement) return 1.5; 
        if (ventajas[defElement] === atkElement) return 0.5; 
        return 1.0; 
    }

    // =========================================
    // INICIALIZACIÓN DE LA ARENA
    // =========================================
    window.iniciarColiseo = function() {
        if (!window.miMascota || window.miMascota.id === "temp") {
            alert("No tienes un Geno activo para combatir.");
            window.navegarA("room-area");
            return;
        }

        document.getElementById("player-visual-box").innerHTML = "";
        document.getElementById("enemy-visual-box").innerHTML = "";
        
        const pNameEl = document.getElementById("battle-player-name");
        if(pNameEl) pNameEl.innerText = "Tu Geno";
        
        const eNameEl = document.getElementById("battle-enemy-name");
        if(eNameEl) eNameEl.innerText = "---";
        else {
            const enemyBox = document.getElementById("enemy-sprite-battle");
            if (enemyBox) {
                const textDivs = enemyBox.querySelectorAll("div");
                if (textDivs.length > 1) textDivs[1].innerText = "---";
            }
        }

        document.getElementById("player-hp-bar").style.width = "100%";
        document.getElementById("enemy-hp-bar").style.width = "100%";
        document.getElementById("player-hp-text").innerText = "HP";
        document.getElementById("enemy-hp-text").innerText = "HP";
        
        logCombate.innerHTML = "¡Bienvenido a la Arena Nexo!<br>Prepárate para combatir.";
        btnStart.style.display = "block";
        btnStart.innerText = "Entrar a la Arena";
        btnLeave.style.display = "inline-block";
        btnLeave.disabled = false;
        battleControls.classList.add("hidden");
        
        btnAtk.disabled = false;
        btnItem.disabled = false;
        if(btnSkill) btnSkill.style.display = "none"; 

        actualizarBotonManzana();
    };

    btnStart.onclick = () => {
        try {
            logCombate.innerHTML = "";
            addLog(`<span style="color:#4dd0e1">> INICIALIZANDO SECUENCIA DE COMBATE...</span>`);
            
            document.getElementById("player-sprite-battle").style.filter = "none";
            document.getElementById("enemy-sprite-battle").style.filter = "none";
            numeroTurno = 1;

            btnAtk.disabled = false;
            actualizarBotonManzana();

            // JUGADOR
            const pMascota = window.miMascota;
            const pElemento = (pMascota.genes && pMascota.genes.afinidad) ? pMascota.genes.afinidad.dom : (pMascota.element || "Normal");
            
            let pGenB = "ninguno"; let pGenC = "ninguno";
            if (pMascota.hidden_genes) {
                if (pMascota.hidden_genes.B) pGenB = pMascota.hidden_genes.B.id;
                if (pMascota.hidden_genes.C) pGenC = pMascota.hidden_genes.C.id;
            }
            
            const pStats = pMascota.stats || {hp: 80, atk: 15, spd: 15, luk: 10};

            playerCombat = {
                nombre: pMascota.name || "Tu Geno",
                isPlayer: true,
                maxHp: pStats.hp, hp: pStats.hp, atk: pStats.atk, spd: pStats.spd, luk: pStats.luk,
                element: pElemento,
                genesId: [pGenB, pGenC],
                crystalSkin: pGenB === "piel_cristal" || pGenC === "piel_cristal",
                resilienciaUsada: false, barreraUsada: false,
                ultimoElementoRecibido: null, sangreFriaUsada: false,
                escudoCibernetico: pElemento === "Cibernético", estados: []
            };

            // ENEMIGO PROCEDURAL
            const eRareza = pMascota.rarity || "Común";
            const eStats = window.generarStatsPorRareza ? window.generarStatsPorRareza(eRareza) : {hp: 50, atk: 15, spd: 15, luk: 15};
            const elementosBase = ["Biomutante", "Viral", "Cibernético", "Radiactivo", "Tóxico", "Sintético"];
            const eElemento = elementosBase[Math.floor(Math.random() * elementosBase.length)];
            
            const formasCuerpo = ["gota", "frijol", "circulo", "cuadrado", "triangulo", "hongo", "estrella", "pentagono", "nube", "chili", "rayo"];
            const coloresRival = ["#ff6b6b", "#4dd0e1", "#fdfd96", "#b19cd9", "#77DD77", "#ff9800", "#ffb347", "#a8e6cf"];
            const eColor = coloresRival[Math.floor(Math.random() * coloresRival.length)];
            const eForma = formasCuerpo[Math.floor(Math.random() * formasCuerpo.length)];

            let eHiddenGenes = {A: null, B: null, C: null};
            if (typeof window.generarGenesV9 === 'function') eHiddenGenes = window.generarGenesV9(eRareza);

            const eAdn = { 
                id: 888, scanned: true, rarity: eRareza, stats: eStats, element: eElemento,
                body_shape: eForma, base_color: eColor, color: eColor,
                eye_type: "angry", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno",
                hidden_genes: eHiddenGenes 
            };

            const eGenB_id = eHiddenGenes.B ? eHiddenGenes.B.id : "ninguno";
            const eGenC_id = eHiddenGenes.C ? eHiddenGenes.C.id : "ninguno";

            enemyCombat = {
                nombre: "Rival Salvaje", isPlayer: false,
                maxHp: eAdn.stats.hp, hp: eAdn.stats.hp, atk: eAdn.stats.atk, spd: eAdn.stats.spd, luk: eAdn.stats.luk,
                element: eAdn.element,
                genesId: [eGenB_id, eGenC_id],
                crystalSkin: eGenB_id === "piel_cristal" || eGenC_id === "piel_cristal",
                resilienciaUsada: false, barreraUsada: false,
                ultimoElementoRecibido: null, sangreFriaUsada: false,
                escudoCibernetico: eElemento === "Cibernético", estados: []
            };

            // RENDER VISUAL CON LA NUEVA FUNCIÓN SEGURA
            document.getElementById("player-visual-box").innerHTML = inyectarSvgSeguro(pMascota, "90px");
            document.getElementById("player-visual-box").style.color = pMascota.color || pMascota.base_color;
            
            document.getElementById("enemy-visual-box").innerHTML = inyectarSvgSeguro(eAdn, "90px");
            document.getElementById("enemy-visual-box").style.color = eAdn.color;

            const pNameEl = document.getElementById("battle-player-name");
            if(pNameEl) pNameEl.innerText = `${playerCombat.nombre} (Nv. ${pMascota.level || 1})`;
            
            const eNameEl = document.getElementById("battle-enemy-name");
            if(eNameEl) eNameEl.innerText = `Rival ${eRareza}`;
            else {
                const enemyBox = document.getElementById("enemy-sprite-battle");
                if (enemyBox) {
                    const textDivs = enemyBox.querySelectorAll("div");
                    if (textDivs.length > 1) textDivs[1].innerText = `Rival ${eRareza}`;
                }
            }

            actualizarUICombate(playerCombat, true);
            actualizarUICombate(enemyCombat, false);

            btnStart.style.display = "none";
            btnLeave.style.display = "none";
            battleControls.classList.remove("hidden");
            
            addLog(`<br><span style="color:#8A2BE2; font-weight:bold;">--- LISTOS PARA COMBATE ---</span>`);
            
        } catch (error) {
            console.error("Error crítico al iniciar combate:", error);
            addLog(`<span style="color:#ff3333">> ERROR DEL SISTEMA. Revisa la consola F12.</span>`);
        }
    };

    // =========================================
    // LÓGICA CENTRAL DE TURNOS
    // =========================================
    function procesarAtaque(atacante, defensor) {
        if (atacante.hp <= 0 || defensor.hp <= 0) return;

        let ataques = 1;
        if (atacante.genesId.includes("velocidad_fantasma") && Math.random() <= 0.20) {
            ataques = 2;
            addLog(`<span style="color:#b19cd9">* [Velocidad Fantasma] ¡${atacante.nombre} ataca rápido dos veces!</span>`);
        }

        for(let i=0; i<ataques; i++) {
            if (defensor.hp <= 0) break;

            let dmg = Math.floor(atacante.atk * (i === 1 ? 0.5 : 1) * (0.85 + Math.random() * 0.3));
            let multElem = obtenerMultiplicadorElemental(atacante.element, defensor.element);
            dmg = Math.floor(dmg * multElem);

            let probCrit = 0.05 + (atacante.luk * 0.002);
            if (atacante.element === "Sintético") probCrit += 0.15;
            let isCrit = Math.random() <= probCrit;
            if (isCrit) dmg = Math.floor(dmg * 1.5);

            if (defensor.escudoCibernetico) {
                dmg = Math.floor(dmg * 0.9);
                defensor.escudoCibernetico = false;
                addLog(`<span style="color:#00d2ff">* [Escudo Cibernético] ${defensor.nombre} absorbe 10% del impacto.</span>`);
            }

            if (defensor.genesId.includes("armadura_adaptativa")) {
                if (defensor.ultimoElementoRecibido === atacante.element) {
                    dmg = Math.floor(dmg * 0.6);
                    addLog(`<span style="color:#77DD77">* [Armadura Adaptativa] ¡Resiste el ataque de ${atacante.element}! (-40% Daño)</span>`);
                }
                defensor.ultimoElementoRecibido = atacante.element;
            }

            if (defensor.crystalSkin) {
                dmg = 0; defensor.crystalSkin = false;
                addLog(`<span style="color:#80deea">* [Piel de Cristal] ${defensor.nombre} absorbió el impacto (Daño: 0).</span>`);
            } else {
                
                if (defensor.hp - dmg <= 0 && defensor.genesId.includes("barrera_limite") && !defensor.barreraUsada) {
                    dmg = defensor.hp - 1; 
                    defensor.barreraUsada = true;
                    addLog(`<span style="color:#ff5722">* [Barrera Límite] ¡${defensor.nombre} sobrevive a un golpe fatal con 1 HP!</span>`);
                }

                defensor.hp -= dmg;
                if(defensor.hp < 0) defensor.hp = 0;
                
                let tipoGolpe = "";
                if (multElem === 1.5) tipoGolpe = ` <span style="color:#4CAF50; font-weight:bold;">(¡Súper Efectivo!)</span>`;
                else if (multElem === 0.5) tipoGolpe = ` <span style="color:#888; font-weight:bold;">(Poco efectivo...)</span>`;

                if (isCrit) {
                    addLog(`> 💥 <span style="color:#ff0000; font-weight:bold;">¡CRÍTICO!</span> ${atacante.nombre} causa <span style="color:#ff6b6b; font-weight:bold;">${dmg} de daño</span>.${tipoGolpe}`);
                    mostrarTextoFlotante(defensor.isPlayer, "CRITICAL!", "text-crit");
                    mostrarTextoFlotante(defensor.isPlayer, `-${dmg}`, "text-dmg", 150);
                    if(window.Sonidos) window.Sonidos.play("hit"); 
                    sacudirPantalla(); 
                } else {
                    addLog(`> ${atacante.nombre} causa <span style="color:#ff6b6b">${dmg} de daño</span>.${tipoGolpe}`);
                    if (dmg > 0) {
                        mostrarTextoFlotante(defensor.isPlayer, `-${dmg}`, "text-dmg");
                        if(window.Sonidos) window.Sonidos.play("hit"); 
                        sacudirPantalla(); 
                    }
                }
                
                if (dmg > 0) flashDamage(defensor.isPlayer);

                if (dmg > 0) {
                    let efectoAplicar = null;
                    if (atacante.element === "Radiactivo" && Math.random() <= 0.25) efectoAplicar = "Quemadura";
                    if (atacante.element === "Tóxico" && Math.random() <= 0.25) efectoAplicar = "Debilidad";
                    if (atacante.element === "Viral" && Math.random() <= 0.25) efectoAplicar = "Infección";

                    if (efectoAplicar) {
                        if (defensor.genesId.includes("sangre_fria") && !defensor.sangreFriaUsada) {
                            defensor.sangreFriaUsada = true;
                            addLog(`<span style="color:#00d2ff">* [Sangre Fría] ¡${defensor.nombre} inmuniza el estado alterado!</span>`);
                        } else if (!defensor.estados.includes(efectoAplicar)) {
                            defensor.estados.push(efectoAplicar);
                            addLog(`<span style="color:#ff9800">* ${defensor.nombre} sufre ${efectoAplicar}.</span>`);
                            if (efectoAplicar === "Debilidad") defensor.atk = Math.floor(defensor.atk * 0.8);
                            if (efectoAplicar === "Infección") defensor.spd = Math.floor(defensor.spd * 0.8);
                        }
                    }
                }

                let roboVida = 0;
                if (atacante.genesId.includes("vampirismo_genetico") && dmg > 0) {
                    roboVida = Math.floor(dmg * 0.15);
                    if (roboVida < 1) roboVida = 1;
                    atacante.hp += roboVida;
                    if (atacante.hp > atacante.maxHp) atacante.hp = atacante.maxHp;
                    addLog(`<span style="color:#e0b0ff">* [Vampirismo] ${atacante.nombre} se cura ${roboVida} HP.</span>`);
                    mostrarTextoFlotante(atacante.isPlayer, `+${roboVida}`, "text-heal", 200);
                    efectoCuracion(atacante.isPlayer ? "player-sprite-battle" : "enemy-sprite-battle");
                }

                if (isCrit && defensor.genesId.includes("reflejo_genetico") && dmg > 0) {
                    let danoReflejado = Math.floor(dmg * 0.30);
                    if (danoReflejado < 1) danoReflejado = 1;
                    atacante.hp -= danoReflejado;
                    if (atacante.hp < 0) atacante.hp = 0;
                    addLog(`<span style="color:#ffcc00">* [Reflejo] ¡${defensor.nombre} devuelve ${danoReflejado} de daño!</span>`);
                    mostrarTextoFlotante(atacante.isPlayer, `-${danoReflejado}`, "text-dmg", 300);
                    flashDamage(atacante.isPlayer);
                }
            }

            if (defensor.hp > 0 && defensor.hp <= (defensor.maxHp * 0.15) && defensor.genesId.includes("resiliencia_ultima") && !defensor.resilienciaUsada) {
                defensor.resilienciaUsada = true;
                defensor.atk = Math.floor(defensor.atk * 1.4); defensor.spd = Math.floor(defensor.spd * 1.4);
                addLog(`<span style="color:#ffcc00">* [Resiliencia Última] ¡${defensor.nombre} entra en modo Berserker!</span>`);
            }
        }
        actualizarUICombate(atacante, atacante.isPlayer);
        actualizarUICombate(defensor, defensor.isPlayer);
    }

    function procesarEfectosFinTurno(fighter) {
        if (fighter.hp <= 0) return;
        if (fighter.element === "Biomutante" && fighter.hp < fighter.maxHp) {
            let regen = Math.floor(fighter.maxHp * 0.03);
            if (regen < 1) regen = 1;
            fighter.hp += regen;
            if (fighter.hp > fighter.maxHp) fighter.hp = fighter.maxHp;
            mostrarTextoFlotante(fighter.isPlayer, `+${regen}`, "text-heal", 500);
            efectoCuracion(fighter.isPlayer ? "player-sprite-battle" : "enemy-sprite-battle");
        }
        if (fighter.estados.includes("Quemadura")) {
            let burnDmg = Math.floor(fighter.maxHp * 0.02);
            if (burnDmg < 1) burnDmg = 1;
            fighter.hp -= burnDmg;
            if (fighter.hp < 0) fighter.hp = 0;
            addLog(`<span style="color:#ff9800">🔥 [Quemadura] ${fighter.nombre} pierde ${burnDmg} HP.</span>`);
            mostrarTextoFlotante(fighter.isPlayer, `-${burnDmg}`, "text-dmg", 700);
            flashDamage(fighter.isPlayer);
        }
        actualizarUICombate(fighter, fighter.isPlayer);
    }

    // =========================================
    // ACCIONES DE BOTONES
    // =========================================
    btnItem.onclick = () => {
        if (!playerCombat || playerCombat.hp <= 0) return;
        if (window.miInventario && window.miInventario.consumeItem("apple_01", 1)) {
            playerCombat.hp += 25;
            if (playerCombat.hp > playerCombat.maxHp) playerCombat.hp = playerCombat.maxHp;
            addLog(`<span style="color:#4CAF50">🍎 Has usado una Manzana. Recuperas 25 HP.</span>`);
            mostrarTextoFlotante(true, "+25", "text-heal");
            
            if(window.Sonidos) window.Sonidos.play("heal"); 
            efectoCuracion("player-sprite-battle");
            
            actualizarUICombate(playerCombat, true);
            actualizarBotonManzana();
            btnAtk.disabled = true; btnItem.disabled = true;
            
            setTimeout(() => {
                if (enemyCombat.hp > 0) {
                    procesarAtaque(enemyCombat, playerCombat);
                    setTimeout(() => {
                        procesarEfectosFinTurno(playerCombat);
                        procesarEfectosFinTurno(enemyCombat);
                        checkEndGame();
                    }, 800);
                }
            }, 800);
        }
    };

    btnAtk.onclick = () => {
        addLog(`<br><span style="color:#4dd0e1">[TURNO ${numeroTurno}]</span>`);
        btnAtk.disabled = true; btnItem.disabled = true;
        
        let primero = playerCombat; let segundo = enemyCombat;
        if (enemyCombat.spd > playerCombat.spd) { primero = enemyCombat; segundo = playerCombat; } 
        else if (enemyCombat.spd === playerCombat.spd && Math.random() > 0.5) { primero = enemyCombat; segundo = playerCombat; }

        procesarAtaque(primero, segundo);
        
        if (segundo.hp > 0) {
            setTimeout(() => {
                procesarAtaque(segundo, primero);
                setTimeout(() => {
                    procesarEfectosFinTurno(primero);
                    procesarEfectosFinTurno(segundo);
                    checkEndGame();
                }, 800);
            }, 800); 
        } else { checkEndGame(); }
        numeroTurno++;
    };

    function checkEndGame() {
        if (playerCombat.hp <= 0 || enemyCombat.hp <= 0) {
            btnAtk.disabled = true; btnItem.disabled = true;
            addLog(`<br><span style="color:#ffcc00; font-size: 16px; font-weight: bold;">--- FIN DEL COMBATE ---</span>`);
            
            if (playerCombat.hp > 0) {
                addLog(`<span style="color:#4CAF50">🏆 ¡VICTORIA!</span>`, "#ffd54f");
                const xpGanada = 50 + (window.miMascota.level * 10);
                const evGanada = 15;
                addLog(`<span style="color:#aaa">Ganaste ${xpGanada} XP y ${evGanada} ✨.</span>`);
                
                if(window.Sonidos) window.Sonidos.play("coin"); 
                if (window.ganarXP) window.ganarXP(xpGanada);
                if (window.miInventario && typeof window.miInventario.addEssence === 'function') window.miInventario.addEssence(evGanada);
                
            } else if (enemyCombat.hp > 0) {
                addLog(`<span style="color:#f44336">💀 DERROTA. Tu Geno debe descansar.</span>`);
            } else {
                addLog(`<span style="color:#aaa">🤝 DOBLE K.O. Empate técnico.</span>`);
            }

            if(window.guardarProgreso) window.guardarProgreso();

            setTimeout(() => {
                btnStart.style.display = "inline-block";
                btnStart.innerText = "Buscar otro rival";
                btnLeave.style.display = "inline-block";
            }, 1000);
        } else {
            btnAtk.disabled = false;
            actualizarBotonManzana();
        }
    }
});