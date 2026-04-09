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
        document.getElementById("geno-name").innerText = `${window.miMascota.name} [Gen ${window.miMascota.generation}]`;
        document.getElementById("geno-rarity").innerText = window.miMascota.rarity;
        document.getElementById("geno-element").innerText = window.miMascota.element;
        
        document.getElementById("geno-level").innerText = `Nv. ${window.miMascota.level}`;
        document.getElementById("geno-xp-text").innerText = `${window.miMascota.xp}/${window.miMascota.xpNeeded}`;
        const xpPorcentaje = Math.min((window.miMascota.xp / window.miMascota.xpNeeded) * 100, 100);
        document.getElementById("geno-xp-fill").style.width = xpPorcentaje + "%";

        document.getElementById("stat-hp").innerText = window.miMascota.stats.hp;
        document.getElementById("stat-atk").innerText = window.miMascota.stats.atk;
        document.getElementById("stat-spd").innerText = window.miMascota.stats.spd;
        document.getElementById("stat-luk").innerText = window.miMascota.stats.luk;

        if (window.miMascota.statPoints > 0) {
            badgePuntos.innerText = `+${window.miMascota.statPoints} Pts`;
            badgePuntos.classList.remove("hidden");
            btnsAddStat.forEach(btn => btn.classList.remove("hidden"));
        } else {
            badgePuntos.classList.add("hidden");
            btnsAddStat.forEach(btn => btn.classList.add("hidden"));
        }

        document.getElementById("geno-recessive").innerText = window.miMascota.scanned ? window.miMascota.recessive_gene : "???";
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
                contenedor.classList.add("happy-jump");
                setTimeout(() => contenedor.classList.remove("happy-jump"), 500);
            }
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
            }
        });
    });

    // Inicializar UI (Nombre, Botones, Escáner)
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
                
                const contenedor = document.getElementById("geno-container");
                if(contenedor) {
                    contenedor.classList.add("happy-jump");
                    setTimeout(() => contenedor.classList.remove("happy-jump"), 500);
                }
            }
        });
    }

    // Dibujar el Geno principal al arrancar
    const contenedor = document.getElementById("geno-container");
    if (contenedor) contenedor.innerHTML = generarSvgGeno(window.miMascota.visual_genes);
    window.actualizarPanelRPG();
});