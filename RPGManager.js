// =========================================
// RPGManager.js - SISTEMA DE STATS Y PROGRESIÓN
// =========================================

// Ya no inyectamos el "Geno Base" falso aquí.
// window.miMascota se manejará exclusivamente desde SaveManager.js o app.js (Tutorial).

document.addEventListener("DOMContentLoaded", () => {
    const panelStats = document.getElementById("geno-stats-panel");
    const badgePuntos = document.getElementById("stat-points-badge");
    const btnsAddStat = document.querySelectorAll(".btn-add-stat");

    // ✨ LÓGICA V8.0: Gen "Umbral del Despertar"
    function verificarUmbralDespertar(g) {
        if (g.level >= 25 && window.tieneGenActivo && window.tieneGenActivo(g, "umbral_despertar") && !g.umbralAplicado) {
            g.stats.hp += 5;
            g.stats.atk += 5;
            g.stats.spd += 5;
            g.stats.luk += 5;
            g.umbralAplicado = true;
            if(window.Sonidos) window.Sonidos.play("heal");
            alert("✨ ¡Gen Activado: Umbral del Despertar!\nLas estadísticas base de tu Geno han aumentado +5 de forma permanente.");
        }
    }

    window.actualizarPanelRPG = function() {
        if(!window.miMascota || window.miMascota.id === "temp") return; // No actualizamos UI si es el fantasma del tutorial
        const g = window.miMascota;

        if(!g.level) g.level = 1;
        if(g.xp === undefined) g.xp = 0;
        if(!g.xpNeeded) g.xpNeeded = 100;
        if(!g.stats) g.stats = { hp: 50, atk: 15, spd: 15, luk: 15 };
        if(g.statPoints === undefined) g.statPoints = 0;

        // Actualizamos textos básicos
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
            
            // 🛠️ AUTO-PARCHE: Si el ID es viejo y gigante (Date.now), lo convertimos al formato nuevo corto
            if (g.id && String(g.id).length > 10 && typeof window.generarNuevoID === 'function') {
                g.id = window.generarNuevoID();
            }

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

        // --- LÓGICA: CALIDAD GENÉTICA (ACTUALIZADO A V8.0) ---
        const qualityBadge = document.getElementById("geno-quality-badge");
        if (qualityBadge) {
            let rango = "D";
            let pct = 0;
            let color = "#aaa";

            if (g.stats.rango && g.stats.calidadPorcentaje !== undefined) {
                rango = g.stats.rango;
                pct = g.stats.calidadPorcentaje;
            } else {
                // ✨ AHORA LEE LA TABLA OFICIAL SEGÚN SU RAREZA
                const limites = (window.TABLA_IVS && window.TABLA_IVS[g.rarity]) ? window.TABLA_IVS[g.rarity] : { hp: [35, 55], atk: [10, 22], spd: [8, 25], luk: [5, 15] }; 
                let tMin = limites.hp[0] + limites.atk[0] + limites.spd[0] + limites.luk[0];
                let tMax = limites.hp[1] + limites.atk[1] + limites.spd[1] + limites.luk[1];
                
                let puntosInvertidos = (g.level - 1) * 3;
                
                // Descontar el bono del Umbral del Despertar si está aplicado
                let bonoUmbral = g.umbralAplicado ? 20 : 0; 
                let tObt = (g.stats.hp + g.stats.atk + g.stats.spd + g.stats.luk) - puntosInvertidos - bonoUmbral;

                pct = Math.round(((tObt - tMin) / (tMax - tMin)) * 100);
                if (pct > 100) pct = 100;
                if (pct < 0) pct = 0;

                if (pct >= 95) rango = "S";
                else if (pct >= 80) rango = "A";
                else if (pct >= 50) rango = "B";
                else if (pct >= 20) rango = "C";
                else rango = "D";
            }

            if (rango === "S") color = "#ffcc00"; 
            else if (rango === "A") color = "#4dd0e1"; 
            else if (rango === "B") color = "#4CAF50"; 
            else if (rango === "C") color = "#f0ad4e"; 
            else color = "#d9534f"; 

            qualityBadge.innerText = `${rango} (${pct}%)`;
            qualityBadge.style.color = color;
            
            if (rango === "S") {
                qualityBadge.style.textShadow = "0 0 10px rgba(255, 204, 0, 0.8)";
            } else {
                qualityBadge.style.textShadow = "none";
            }
        }
        // ----------------------------------------

        const shp = document.getElementById("stat-hp");
        if(shp) shp.innerText = Math.floor(g.stats.hp);
        const satk = document.getElementById("stat-atk");
        if(satk) satk.innerText = Math.floor(g.stats.atk);
        const sspd = document.getElementById("stat-spd");
        if(sspd) sspd.innerText = Math.floor(g.stats.spd);
        const sluk = document.getElementById("stat-luk");
        if(sluk) sluk.innerText = Math.floor(g.stats.luk);

        // ✨ NUEVO: REVELACIÓN DEL GEN OCULTO V8.0
        const recEl = document.getElementById("geno-recessive");
        if(recEl) {
            if(g.scanned) {
                const genOcultoName = g.hidden_gene ? g.hidden_gene.name : ((g.genes && g.genes.afinidad) ? g.genes.afinidad.rec : "Normal");
                recEl.innerText = genOcultoName;
                recEl.style.color = "#80deea";
                recEl.style.textShadow = "0 0 5px rgba(128,222,234,0.5)";
            } else {
                recEl.innerText = "???";
                recEl.style.color = "#555";
                recEl.style.textShadow = "none";
            }
        }

        const ptsBadge = document.getElementById("stat-points-badge");
        const addBtns = document.querySelectorAll(".btn-add-stat");
        
        if(g.statPoints > 0) {
            if(ptsBadge) {
                ptsBadge.innerText = `+${g.statPoints} Pts`;
                ptsBadge.classList.remove("hidden");
            }
            addBtns.forEach(b => b.classList.remove("hidden"));
        } else {
            if(ptsBadge) ptsBadge.classList.add("hidden");
            addBtns.forEach(b => b.classList.add("hidden"));
        }
        
        if (typeof window.guardarJuego === 'function') {
            window.guardarJuego();
        }
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
                setTimeout(() => {
                    contenedor.classList.remove("happy-jump");
                    contenedor.classList.add("geno-idle");
                }, 500);
            }
            if(window.Sonidos) window.Sonidos.play("heal"); 
            alert(`¡Súper Evolución! 🌟\n${window.miMascota.name} ha alcanzado el Nivel ${window.miMascota.level}.\nTienes 3 Puntos de Atributo disponibles.`);

            // Comprobamos si ha desbloqueado el Umbral del Despertar al subir de nivel
            verificarUmbralDespertar(window.miMascota);
        }
        window.actualizarPanelRPG();
    };

    btnsAddStat.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const stat = e.target.getAttribute("data-stat");
            if (window.miMascota && window.miMascota.statPoints > 0) {
                if (stat === 'hp') window.miMascota.stats.hp += 5;
                if (stat === 'atk') window.miMascota.stats.atk += 1;
                if (stat === 'spd') window.miMascota.stats.spd += 1;
                if (stat === 'luk') window.miMascota.stats.luk += 1;
                window.miMascota.statPoints--;
                window.actualizarPanelRPG();
                if(window.guardarProgreso) window.guardarProgreso();
            }
        });
    });

    const btnStats = document.getElementById("btn-show-stats");
    const btnCloseStats = document.getElementById("close-stats-btn");
    const btnScanner = document.getElementById("btn-use-scanner");
    const btnRename = document.getElementById("btn-rename-geno");

    if (btnStats) btnStats.addEventListener("click", () => panelStats.classList.toggle("hidden"));
    if (btnCloseStats) btnCloseStats.addEventListener("click", () => panelStats.classList.add("hidden"));

    if (btnScanner) {
        btnScanner.addEventListener("click", () => {
            if (!window.miMascota) return;
            if (window.miMascota.scanned) { alert("El ADN recesivo ya ha sido decodificado."); return; }
            if (window.miInventario && window.miInventario.consumeItem("dna_scanner", 1)) {
                window.miMascota.scanned = true;
                
                // Si el Geno ya era nivel 25+ y lo acaba de escanear, recibe el bono retroactivamente.
                verificarUmbralDespertar(window.miMascota);

                window.actualizarPanelRPG();
                panelStats.style.boxShadow = "0 0 20px #8B5CF6";
                btnScanner.innerText = "Gen Revelado ✅";
                btnScanner.style.background = "#4CAF50";
                if(window.guardarProgreso) window.guardarProgreso();
            } else { alert("No tienes un Escáner de ADN en el inventario."); }
        });
    }

    if (btnRename) {
        btnRename.addEventListener("click", () => {
            if (!window.miMascota) return;
            btnRename.style.transform = "scale(0.8)";
            setTimeout(() => btnRename.style.transform = "scale(1)", 150);

            const costoEsencia = 50;
            let mensaje = window.miMascota.renames === 0 
                ? "Bautizo Genético:\nEl primer cambio de nombre es GRATUITO.\n\n¿Cómo quieres llamar a tu Geno?" 
                : `Cambio de Identidad:\nRenombrar cuesta ${costoEsencia} ✨.\n\nNuevo nombre:`;

            if (window.miMascota.renames > 0 && (!window.miInventario || window.miInventario.vitalEssence < costoEsencia)) {
                alert(`No tienes suficiente Esencia Vital. Cuesta ${costoEsencia} ✨.`);
                return;
            }

            const nuevoNombre = prompt(mensaje);
            if (nuevoNombre && nuevoNombre.trim().length > 0) {
                if (nuevoNombre.trim().length > 15) { alert("El nombre es demasiado largo."); return; }

                if (window.miMascota.renames > 0) window.miInventario.addEssence(-costoEsencia);
                
                window.miMascota.name = nuevoNombre.trim();
                window.miMascota.renames++;
                window.actualizarPanelRPG();
                if(window.guardarProgreso) window.guardarProgreso();
                
                const contenedor = document.getElementById("geno-container");
                if(contenedor) {
                    contenedor.classList.remove("geno-idle");
                    contenedor.classList.add("happy-jump");
                    setTimeout(() => {
                        contenedor.classList.remove("happy-jump");
                        contenedor.classList.add("geno-idle");
                    }, 500);
                }
            }
        });
    }

    window.actualizarPanelRPG();
});