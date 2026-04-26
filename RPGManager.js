// =========================================
// RPGManager.js - SISTEMA DE STATS Y PROGRESIÓN (CALIDAD FIJA + TOTAL AMARILLO)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const overlayStats = document.getElementById("stats-modal-overlay");
    const panelStats = document.getElementById("geno-stats-panel");
    const badgePuntos = document.getElementById("stat-points-badge");
    const btnsAddStat = document.querySelectorAll(".btn-add-stat");

    window.verificarUmbralDespertar = function(g) {
        if (g.level >= 25 && window.tieneGenActivoV9 && window.tieneGenActivoV9(g, "umbral_despertar") && !g.umbralAplicado) {
            g.stats.hp += 5; g.stats.atk += 5; g.stats.def += 5; g.stats.spd += 5; g.stats.luk += 5;
            
            // Si el gen se despierta, esto se considera una mutación BASE.
            if(g.baseStats) {
                g.baseStats.hp += 5; g.baseStats.atk += 5; g.baseStats.def += 5; g.baseStats.spd += 5; g.baseStats.luk += 5;
            }
            
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

        // Guardar permanentemente los Stats Originales (Base) con los que nació
        if(!g.baseStats) {
            g.baseStats = {
                hp: g.stats.hp,
                atk: g.stats.atk,
                def: g.stats.def !== undefined ? g.stats.def : 0,
                spd: g.stats.spd,
                luk: g.stats.luk
            };
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
                let bonoUmbral = g.umbralAplicado ? 25 : 0; 
                
                // ✨ LA CALIDAD ES ESTRICTAMENTE FIJA BASADA EN EL NACIMIENTO (Ignoramos puntos dados)
                let tObt = (g.baseStats.hp + g.baseStats.atk + g.baseStats.def + g.baseStats.spd + g.baseStats.luk) - bonoUmbral;

                pct = Math.round(((tObt - tMin) / (tMax - tMin)) * 100);
                if (pct > 100) pct = 100; if (pct < 0) pct = 0;

                if (pct >= 95) rango = "S"; else if (pct >= 80) rango = "A"; else if (pct >= 50) rango = "B"; else if (pct >= 20) rango = "C"; else rango = "D";
            }

            if (rango === "S") color = "#ffcc00"; else if (rango === "A") color = "#4dd0e1"; else if (rango === "B") color = "#4CAF50"; else if (rango === "C") color = "#f0ad4e"; else color = "#d9534f"; 
            qualityBadge.innerText = `${rango} (${pct}%)`; qualityBadge.style.color = color;
            qualityBadge.style.textShadow = rango === "S" ? "0 0 10px rgba(255, 204, 0, 0.8)" : "none";
        }

        // ✨ LÓGICA DE DIBUJO: Formato BASE (+Añadido) TOTAL
        const drawStat = (statName) => {
            const baseEl = document.getElementById(`stat-${statName}-base`);
            const addedEl = document.getElementById(`stat-${statName}-added`);
            const totalEl = document.getElementById(`stat-${statName}-total`);
            
            if(baseEl && g.stats[statName] !== undefined) {
                if(g.baseStats && g.baseStats[statName] !== undefined) {
                    const baseVal = Math.floor(g.baseStats[statName]);
                    const totalVal = Math.floor(g.stats[statName]);
                    const diff = totalVal - baseVal;
                    
                    baseEl.innerText = baseVal; // SIEMPRE muestra el base aquí (fijo)
                    
                    if(diff > 0) {
                        if(addedEl) addedEl.innerText = `(+${diff})`;
                        if(totalEl) totalEl.innerText = `${totalVal}`;
                    } else {
                        if(addedEl) addedEl.innerText = '';
                        if(totalEl) totalEl.innerText = '';
                    }
                } else {
                    // Fallback de seguridad
                    baseEl.innerText = Math.floor(g.stats[statName]);
                    if(addedEl) addedEl.innerText = '';
                    if(totalEl) totalEl.innerText = '';
                }
            }
        };

        drawStat('hp');
        drawStat('atk');
        drawStat('def');
        drawStat('spd');
        drawStat('luk');

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

    // ==========================================
    // LÓGICA DE APERTURA/CIERRE DEL MODAL DE STATS
    // ==========================================
    const statsOverlay = document.getElementById("stats-modal-overlay");

    function blurFab() {
        const fab = document.getElementById("fab-menu");
        if(fab) { fab.style.pointerEvents = "none"; fab.style.filter = "blur(4px) opacity(0.6)"; }
    }
    
    function unblurFab() {
        const fab = document.getElementById("fab-menu");
        if(fab) { fab.style.pointerEvents = "auto"; fab.style.filter = "none"; }
    }

    if (btnStats && statsOverlay) {
        btnStats.addEventListener("click", () => {
            statsOverlay.classList.remove("hidden");
            blurFab();
        });
    }

    if (btnCloseStats && statsOverlay) {
        btnCloseStats.addEventListener("click", () => {
            statsOverlay.classList.add("hidden");
            unblurFab();
        });
    }

    if (statsOverlay) {
        statsOverlay.addEventListener("click", (e) => {
            if (e.target === statsOverlay) {
                statsOverlay.classList.add("hidden");
                unblurFab();
            }
        });
    }

    if (!window.rpgNavHooked) {
        const originalNavegarA = window.navegarA;
        window.navegarA = function(id) {
            if (originalNavegarA) originalNavegarA(id);
            if (statsOverlay) statsOverlay.classList.add("hidden");
        };
        window.rpgNavHooked = true;
    }

    document.addEventListener("click", () => {
        setTimeout(() => {
            const mGenos = document.getElementById("geno-swap-modal");
            const mInv = document.getElementById("inventory-modal");
            const mId = document.getElementById("geno-id-card-modal");

            if (mId && !mId.classList.contains("hidden")) { blurFab(); return; }

            const algunModalAbierto = 
                (statsOverlay && !statsOverlay.classList.contains("hidden")) ||
                (mGenos && !mGenos.classList.contains("hidden")) ||
                (mInv && !mInv.classList.contains("hidden"));

            if (!algunModalAbierto) unblurFab();
        }, 50);
    });

    const btnGenos = document.getElementById("btn-show-genos");
    const btnInv = document.getElementById("backpack-icon");
    if(btnGenos) btnGenos.addEventListener("click", blurFab);
    if(btnInv) btnInv.addEventListener("click", blurFab);

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