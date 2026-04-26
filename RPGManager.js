// =========================================
// RPGManager.js - SISTEMA DE STATS Y PROGRESIÓN (V10.1 - MODAL CENTRADO Y BLUR)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const panelStats = document.getElementById("geno-stats-panel");
    const badgePuntos = document.getElementById("stat-points-badge");
    const btnsAddStat = document.querySelectorAll(".btn-add-stat");

    // Convertimos la función a global para que otras ventanas puedan llamarla
    window.verificarUmbralDespertar = function(g) {
        if (g.level >= 25 && window.tieneGenActivoV9 && window.tieneGenActivoV9(g, "umbral_despertar") && !g.umbralAplicado) {
            g.stats.hp += 5; g.stats.atk += 5; g.stats.def += 5; g.stats.spd += 5; g.stats.luk += 5;
            g.umbralAplicado = true;
            if(window.Sonidos) window.Sonidos.play("heal");
            alert("✨ ¡Gen Activado: Umbral del Despertar!\nLas estadísticas base de tu Geno han aumentado +5 de forma permanente.");
        }
    };

    window.actualizarPanelRPG = function() {
        if(!window.miMascota || window.miMascota.id === "temp") return;
        const g = window.miMascota;

        if(!g.level) g.level = 1;
        if(g.xp === undefined) g.xp = 0;
        if(!g.xpNeeded) g.xpNeeded = 100;
        if(!g.stats) g.stats = { hp: 50, atk: 15, def: 10, spd: 15, luk: 15 };
        if(g.statPoints === undefined) g.statPoints = 0;

        if (panelStats) {
            panelStats.style.minWidth = "260px";
        }

        const nameEl = document.getElementById("geno-name");
        if(nameEl) nameEl.innerText = g.name || "Geno";
        
        const lvlEl = document.getElementById("geno-level");
        if(lvlEl) lvlEl.innerText = `Nv. ${g.level}`;

        const xpText = document.getElementById("geno-xp-text");
        if(xpText) xpText.innerText = `${Math.floor(g.xp)}/${g.xpNeeded}`;

        const xpFill = document.getElementById("geno-xp-fill");
        if(xpFill) {
            let pct = (g.xp / g.xpNeeded) * 100;
            if(pct > 100) pct = 100;
            xpFill.style.width = pct + "%";
        }

        const rarityEl = document.getElementById("geno-rarity");
        if(rarityEl) {
            rarityEl.innerText = g.rarity || "Común";
            if (g.id && String(g.id).length > 10 && typeof window.generarNuevoID === 'function') g.id = window.generarNuevoID();
            let serialRow = document.getElementById("row-serial-id");
            if (!serialRow) {
                serialRow = document.createElement("div");
                serialRow.id = "row-serial-id";
                serialRow.style = "text-align: center; margin-top: 8px; margin-bottom: 12px; font-weight: bold; color: #00d2ff; font-family: monospace; letter-spacing: 2px; font-size: 15px;";
                rarityEl.parentNode.parentNode.insertBefore(serialRow, rarityEl.parentNode);
            }
            serialRow.innerText = g.id ? `#${g.id}` : "#000000";
        }

        const elementEl = document.getElementById("geno-element");
        if(elementEl) elementEl.innerText = (g.genes && g.genes.afinidad) ? g.genes.afinidad.dom : (g.element || "Normal");

        const qualityBadge = document.getElementById("geno-quality-badge");
        if (qualityBadge) {
            let rango = "D"; let pct = 0; let color = "#aaa";
            if (g.stats.rango && g.stats.calidadPorcentaje !== undefined) {
                rango = g.stats.rango; pct = g.stats.calidadPorcentaje;
            } else {
                const limites = (window.TABLA_IVS && window.TABLA_IVS[g.rarity]) ? window.TABLA_IVS[g.rarity] : { hp: [35, 55], atk: [10, 22], def: [5, 15], spd: [8, 25], luk: [5, 15] }; 
                let tMin = limites.hp[0] + limites.atk[0] + limites.def[0] + limites.spd[0] + limites.luk[0];
                let tMax = limites.hp[1] + limites.atk[1] + limites.def[1] + limites.spd[1] + limites.luk[1];
                let puntosInvertidos = (g.level - 1) * 3;
                let bonoUmbral = g.umbralAplicado ? 25 : 0; 
                let tObt = (g.stats.hp + g.stats.atk + g.stats.def + g.stats.spd + g.stats.luk) - puntosInvertidos - bonoUmbral;

                pct = Math.round(((tObt - tMin) / (tMax - tMin)) * 100);
                if (pct > 100) pct = 100; if (pct < 0) pct = 0;

                if (pct >= 95) rango = "S"; else if (pct >= 80) rango = "A"; else if (pct >= 50) rango = "B"; else if (pct >= 20) rango = "C"; else rango = "D";
            }

            if (rango === "S") color = "#ffcc00"; else if (rango === "A") color = "#4dd0e1"; else if (rango === "B") color = "#4CAF50"; else if (rango === "C") color = "#f0ad4e"; else color = "#d9534f"; 
            qualityBadge.innerText = `${rango} (${pct}%)`; qualityBadge.style.color = color;
            qualityBadge.style.textShadow = rango === "S" ? "0 0 10px rgba(255, 204, 0, 0.8)" : "none";
        }

        const shp = document.getElementById("stat-hp"); if(shp) shp.innerText = Math.floor(g.stats.hp);
        const satk = document.getElementById("stat-atk"); if(satk) satk.innerText = Math.floor(g.stats.atk);
        const sdef = document.getElementById("stat-def"); if(sdef) sdef.innerText = Math.floor(g.stats.def || 0);
        const sspd = document.getElementById("stat-spd"); if(sspd) sspd.innerText = Math.floor(g.stats.spd);
        const sluk = document.getElementById("stat-luk"); if(sluk) sluk.innerText = Math.floor(g.stats.luk);

        // UI DE GENES V9.0
        let structureContainer = document.getElementById("genetic-structure-container");
        
        if (!structureContainer) {
            let oldRecContainer = document.getElementById("geno-recessive");
            if (oldRecContainer) {
                structureContainer = oldRecContainer.parentNode;
                structureContainer.id = "genetic-structure-container";
            }
        }

        if(structureContainer) {
            structureContainer.style.display = "flex";
            structureContainer.style.flexDirection = "column";
            structureContainer.style.alignItems = "stretch";
            structureContainer.style.gap = "6px";
            structureContainer.style.marginTop = "15px";
            structureContainer.style.paddingTop = "15px";
            structureContainer.style.borderTop = "1px dashed rgba(77, 208, 225, 0.3)";
            structureContainer.style.width = "100%";
            
            if (!g.scanned) {
                structureContainer.innerHTML = `
                    <div style="font-size: 12px; color: #4dd0e1; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; letter-spacing: 1px; text-align: center;">Estructura Genética</div>
                    <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px dashed #555; text-align: center; color: #666; font-size: 12px;">
                        🔒 ADN Bloqueado<br>
                        <span style="font-size: 10px; color: #444; margin-top: 6px; display: inline-block;">Usa el escáner para revelar los genes.</span>
                    </div>
                `;
            } else {
                const hg = g.hidden_genes || { A: null, B: null, C: null };
                
                const buildSlot = (slotLabel, geneData, colorBox) => {
                    if (!geneData) return `<div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 6px; font-size: 11px; color: #555; border-left: 3px solid #333; display: flex; justify-content: space-between; align-items: center;"><span>${slotLabel}</span> <span style="font-size:10px; font-style:italic;">Vacío</span></div>`;
                    
                    return `
                        <div style="background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 6px; font-size: 11px; color: #fff; border-left: 3px solid ${colorBox}; display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: ${colorBox}; font-weight: bold; font-size: 10px; text-transform: uppercase;">${slotLabel}</span>
                                <span style="font-weight: bold;">${geneData.name}</span>
                            </div>
                            <div style="color: #aaa; font-size: 10px; line-height: 1.3;">${geneData.desc}</div>
                        </div>
                    `;
                };

                structureContainer.innerHTML = `
                    <div style="font-size: 12px; color: #4dd0e1; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; letter-spacing: 1px; text-align: center;">Estructura Genética</div>
                    ${buildSlot("Gen A (Cosmético)", hg.A, "#ffcc00")}
                    ${buildSlot("Gen B (Funcional)", hg.B, "#80deea")}
                    ${buildSlot("Gen C (Funcional)", hg.C, "#8A2BE2")}
                `;
            }
        }

        const btnScannerUI = document.getElementById("btn-use-scanner");
        if (btnScannerUI) {
            if (g.scanned) {
                btnScannerUI.style.display = "none";
            } else {
                btnScannerUI.style.display = "block";
                btnScannerUI.innerText = "Usar Escáner 🧬";
                btnScannerUI.style.background = ""; 
            }
        }

        const ptsBadge = document.getElementById("stat-points-badge");
        const addBtns = document.querySelectorAll(".btn-add-stat");
        if(g.statPoints > 0) {
            if(ptsBadge) { ptsBadge.innerText = `+${g.statPoints} Pts`; ptsBadge.classList.remove("hidden"); }
            addBtns.forEach(b => b.classList.remove("hidden"));
        } else {
            if(ptsBadge) ptsBadge.classList.add("hidden"); addBtns.forEach(b => b.classList.add("hidden"));
        }
        
        if (typeof window.guardarJuego === 'function') window.guardarJuego();
    };

    window.ganarXP = function(cantidad) {
        if (!window.miMascota || window.miMascota.id === "temp" || window.miMascota.level >= 50) return; 
        
        window.miMascota.xp += cantidad;
        
        if (window.miMascota.xp >= window.miMascota.xpNeeded) {
            window.miMascota.level++;
            window.miMascota.xp -= window.miMascota.xpNeeded;
            window.miMascota.xpNeeded = Math.floor(window.miMascota.xpNeeded * 1.2); 
            window.miMascota.statPoints += 3; 
            
            const contenedor = document.getElementById("geno-container");
            if(contenedor) {
                contenedor.classList.remove("geno-idle");
                contenedor.classList.add("happy-jump");
                setTimeout(() => { contenedor.classList.remove("happy-jump"); contenedor.classList.add("geno-idle"); }, 500);
            }
            if(window.Sonidos) window.Sonidos.play("heal"); 
            alert(`¡Súper Evolución! 🌟\n${window.miMascota.name} ha alcanzado el Nivel ${window.miMascota.level}.\nTienes 3 Puntos de Atributo disponibles.`);

            window.verificarUmbralDespertar(window.miMascota);
        }
        window.actualizarPanelRPG();
    };

    document.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("btn-add-stat")) {
            const stat = e.target.getAttribute("data-stat");
            if (window.miMascota && window.miMascota.statPoints > 0) {
                if (stat === 'hp') window.miMascota.stats.hp += 5;
                if (stat === 'atk') window.miMascota.stats.atk += 1;
                if (stat === 'def') window.miMascota.stats.def += 1;
                if (stat === 'spd') window.miMascota.stats.spd += 1;
                if (stat === 'luk') window.miMascota.stats.luk += 1;
                window.miMascota.statPoints--;
                window.actualizarPanelRPG();
                if(window.guardarProgreso) window.guardarProgreso();
            }
        }
    });

    const btnStats = document.getElementById("btn-show-stats");
    const btnCloseStats = document.getElementById("close-stats-btn");
    const btnScanner = document.getElementById("btn-use-scanner");
    const btnRename = document.getElementById("btn-rename-geno");

    // ✨ FIX UI: CREAR EL FONDO DIFUMINADO PARA BLOQUEAR EL BOTÓN NEXO Y EL FONDO
    let statsBackdrop = document.getElementById("stats-backdrop");
    if (!statsBackdrop) {
        statsBackdrop = document.createElement("div");
        statsBackdrop.id = "stats-backdrop";
        statsBackdrop.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); z-index: 2500; display: none;";
        document.body.appendChild(statsBackdrop);

        // Si el jugador toca fuera del panel (en lo oscuro), se cierra solo
        statsBackdrop.addEventListener("click", () => {
            panelStats.classList.add("hidden");
            statsBackdrop.style.display = "none";
        });
    }

    if (btnStats) {
        btnStats.addEventListener("click", () => {
            panelStats.classList.remove("hidden");
            statsBackdrop.style.display = "block";
            
            // Transformamos el panel en un Modal Flotante Centrado Absoluto
            panelStats.style.position = "fixed";
            panelStats.style.top = "50%";
            panelStats.style.left = "50%";
            panelStats.style.transform = "translate(-50%, -50%)";
            panelStats.style.zIndex = "2501"; // Esto lo pone obligatoriamente por encima del FAB NEXO
            panelStats.style.maxHeight = "85vh";
            panelStats.style.overflowY = "auto";
            panelStats.style.boxShadow = "0 10px 30px rgba(0,0,0,0.9), 0 0 15px rgba(77, 208, 225, 0.3)";
        });
    }

    if (btnCloseStats) {
        btnCloseStats.addEventListener("click", () => {
            panelStats.classList.add("hidden");
            statsBackdrop.style.display = "none";
        });
    }

    // Gancho de seguridad: Si el juego navega a otra pantalla mientras está abierto, cerramos el fondo
    if (!window.rpgNavHooked) {
        const originalNavegarA = window.navegarA;
        window.navegarA = function(id) {
            if (originalNavegarA) originalNavegarA(id);
            if (panelStats) panelStats.classList.add("hidden");
            if (statsBackdrop) statsBackdrop.style.display = "none";
        };
        window.rpgNavHooked = true;
    }

    if (btnScanner) {
        btnScanner.addEventListener("click", () => {
            if (!window.miMascota) return;
            if (window.miMascota.scanned) { alert("El ADN ya ha sido decodificado."); return; }
            if (window.miInventario && window.miInventario.consumeItem("dna_scanner", 1)) {
                
                if (!window.miMascota.hidden_genes || !window.miMascota.hidden_genes.hasOwnProperty('A')) {
                    window.miMascota.hidden_genes = window.generarGenesV9(window.miMascota.rarity);
                }

                window.miMascota.scanned = true;
                window.verificarUmbralDespertar(window.miMascota);

                btnScanner.innerText = "ADN Revelado ✅";
                btnScanner.style.background = "#4CAF50";
                
                setTimeout(() => {
                    window.actualizarPanelRPG();
                    panelStats.style.boxShadow = "0 10px 30px rgba(0,0,0,0.9), 0 0 25px #8B5CF6";
                    if(window.guardarProgreso) window.guardarProgreso();
                }, 800);

            } else { alert("No tienes un Escáner de ADN en el inventario."); }
        });
    }

    if (btnRename) {
        btnRename.addEventListener("click", () => {
            if (!window.miMascota) return;
            btnRename.style.transform = "scale(0.8)";
            setTimeout(() => btnRename.style.transform = "scale(1)", 150);

            const costoEsencia = 50;
            let mensaje = window.miMascota.renames === 0 ? "Bautizo Genético:\nEl primer cambio de nombre es GRATUITO.\n\n¿Cómo quieres llamar a tu Geno?" : `Cambio de Identidad:\nRenombrar cuesta ${costoEsencia} ✨.\n\nNuevo nombre:`;

            if (window.miMascota.renames > 0 && (!window.miInventario || window.miInventario.vitalEssence < costoEsencia)) {
                alert(`No tienes suficiente Esencia Vital. Cuesta ${costoEsencia} ✨.`); return;
            }

            const nuevoNombre = prompt(mensaje);
            if (nuevoNombre && nuevoNombre.trim().length > 0) {
                if (nuevoNombre.trim().length > 15) { alert("El nombre es demasiado largo."); return; }
                if (window.miMascota.renames > 0) window.miInventario.addEssence(-costoEsencia);
                window.miMascota.name = nuevoNombre.trim(); window.miMascota.renames++;
                window.actualizarPanelRPG();
                if(window.guardarProgreso) window.guardarProgreso();
                
                const contenedor = document.getElementById("geno-container");
                if(contenedor) {
                    contenedor.classList.remove("geno-idle"); contenedor.classList.add("happy-jump");
                    setTimeout(() => { contenedor.classList.remove("happy-jump"); contenedor.classList.add("geno-idle"); }, 500);
                }
            }
        });
    }

    window.actualizarPanelRPG();
});