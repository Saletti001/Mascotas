// =========================================
// RPGManager.js - SISTEMA DE STATS Y PROGRESIÓN
// =========================================

// ESTADO GLOBAL DEL GENO PRINCIPAL (RPG)
window.miMascota = { 
    name: "Geno Base", 
    generation: 0,
    renames: 0,
    visual_genes: { body_shape: "frijol", base_color: "#77DD77" },
    rarity: "Común",
    element: "🧪 Tóxico",
    level: 1,
    xp: 0,
    xpNeeded: 100,
    statPoints: 0,
    stats: {
        hp: Math.floor(Math.random() * 6) + 40,
        atk: Math.floor(Math.random() * 6) + 10,
        spd: Math.floor(Math.random() * 6) + 10,
        luk: Math.floor(Math.random() * 6) + 10
    },
    recessive_gene: "🔥 Ígneo (Recesivo)",
    scanned: false
};

document.addEventListener("DOMContentLoaded", () => {
    const panelStats = document.getElementById("geno-stats-panel");
    const badgePuntos = document.getElementById("stat-points-badge");
    const btnsAddStat = document.querySelectorAll(".btn-add-stat");

    window.actualizarPanelRPG = function() {
        if(!window.miMascota) return;
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
        if(rarityEl) rarityEl.innerText = g.rarity || "Común";

        const elementEl = document.getElementById("geno-element");
        if(elementEl) elementEl.innerText = (g.genes && g.genes.afinidad) ? g.genes.afinidad.dom : (g.element || "Normal");

        // --- NUEVA LÓGICA: CALIDAD GENÉTICA ---
        const qualityBadge = document.getElementById("geno-quality-badge");
        if (qualityBadge) {
            let rango = "D";
            let pct = 0;
            let color = "#aaa"; // Gris por defecto

            // Si el Geno nació con el nuevo sistema y ya tiene su rango guardado
            if (g.stats.rango && g.stats.calidadPorcentaje !== undefined) {
                rango = g.stats.rango;
                pct = g.stats.calidadPorcentaje;
            } else {
                // Si es un Geno antiguo, se lo calculamos al vuelo asumiendo que es Común
                const limites = { hp: [35, 55], atk: [10, 22], spd: [8, 25], luk: [5, 15] }; // Limites de Común
                let tMin = limites.hp[0] + limites.atk[0] + limites.spd[0] + limites.luk[0];
                let tMax = limites.hp[1] + limites.atk[1] + limites.spd[1] + limites.luk[1];
                
                // Restamos los puntos ganados por subir de nivel para ver su "stat base real"
                let puntosInvertidos = (g.level - 1) * 3;
                let tObt = (g.stats.hp + g.stats.atk + g.stats.spd + g.stats.luk) - puntosInvertidos;

                pct = Math.round(((tObt - tMin) / (tMax - tMin)) * 100);
                if (pct > 100) pct = 100;
                if (pct < 0) pct = 0;

                if (pct >= 95) rango = "S";
                else if (pct >= 80) rango = "A";
                else if (pct >= 50) rango = "B";
                else if (pct >= 20) rango = "C";
                else rango = "D";
            }

            // Asignamos colores según el rango para que sea MUY visual
            if (rango === "S") color = "#ffcc00"; // Oro/Amarillo
            else if (rango === "A") color = "#4dd0e1"; // Cian
            else if (rango === "B") color = "#4CAF50"; // Verde
            else if (rango === "C") color = "#f0ad4e"; // Naranja
            else color = "#d9534f"; // Rojo (Basura)

            qualityBadge.innerText = `${rango} (${pct}%)`;
            qualityBadge.style.color = color;
            
            // Si es S, le ponemos un brillito especial
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

        const recEl = document.getElementById("geno-recessive");
        if(recEl) {
            if(g.scanned) {
                recEl.innerText = (g.genes && g.genes.afinidad) ? g.genes.afinidad.rec : "Normal";
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
        if (window.miMascota.level >= 50) return; 
        
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
            if(window.Sonidos) window.Sonidos.play("heal"); // Sonido de Level Up
            alert(`¡Súper Evolución! 🌟\n${window.miMascota.name} ha alcanzado el Nivel ${window.miMascota.level}.\nTienes 3 Puntos de Atributo disponibles.`);
        }
        window.actualizarPanelRPG();
    };

    btnsAddStat.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const stat = e.target.getAttribute("data-stat");
            if (window.miMascota.statPoints > 0) {
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
            if (window.miMascota.scanned) { alert("El ADN recesivo ya ha sido decodificado."); return; }
            if (window.miInventario && window.miInventario.consumeItem("dna_scanner", 1)) {
                window.miMascota.scanned = true;
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

    // =========================================
    // RENDERIZADO Y MASCOTA INTERACTIVA
    // =========================================
    const contenedor = document.getElementById("geno-container");
    if (contenedor) {
        // Dibujar el Geno y añadirle la clase de respiración
        contenedor.innerHTML = generarSvgGeno(window.miMascota.visual_genes);
        contenedor.classList.add("geno-idle");
        
        // INTERACCIÓN: Acariciar al Geno
        contenedor.addEventListener("click", (e) => {
            // 1. Sonido de cariño (si tienes el audio activado)
            if(window.Sonidos) window.Sonidos.play("click");
            
            // 2. Efecto de Saltito
            contenedor.classList.remove("geno-idle");
            contenedor.classList.add("happy-jump");
            setTimeout(() => {
                contenedor.classList.remove("happy-jump");
                contenedor.classList.add("geno-idle");
            }, 300);

            // 3. Crear Partícula de Corazón
            const heart = document.createElement("div");
            heart.className = "heart-particle";
            heart.innerText = "❤️";
            
            // Posicionar el corazón donde hiciste clic
            const rect = contenedor.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            
            contenedor.appendChild(heart);
            
            // Eliminar el corazón del HTML cuando termine la animación
            setTimeout(() => heart.remove(), 1000);
        });
    }

    window.actualizarPanelRPG();
});