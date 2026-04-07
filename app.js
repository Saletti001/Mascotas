const formasBlandi = {
    gota: `<path d="M50,15 C50,15 15,60 15,85 C15,105 85,105 85,85 C85,60 50,15 50,15 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`,
    frijol: `<path d="M25,50 C25,15 75,15 75,50 C75,70 65,65 55,80 C45,95 25,90 25,50 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
};

function generarSvgBlandi(genesVisuales) {
    let cuerpoSvg = formasBlandi[genesVisuales.body_shape] || formasBlandi.gota;
    cuerpoSvg = cuerpoSvg.replace("COLOR_AQUI", genesVisuales.base_color);
    return `
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${cuerpoSvg}
            <circle cx="38" cy="55" r="4" fill="#222"/>
            <circle cx="62" cy="55" r="4" fill="#222"/>
            <path d="M42,68 Q50,78 58,68" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/>
        </svg>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ESTADO GLOBAL DEL BLANDI (Unificado visual y stats)
    const miMascota = { 
        visual_genes: { body_shape: "frijol", base_color: "#77DD77" },
        rarity: "Común",
        element: "🧪 Tóxico",
        stats: {
            hp: Math.floor(Math.random() * 6) + 5, // Rango 5 a 10
            atk: Math.floor(Math.random() * 6) + 5,
            spd: Math.floor(Math.random() * 6) + 5,
            luk: Math.floor(Math.random() * 6) + 5
        },
        scanned: false
    };

    // 2. RENDERIZADO VISUAL
    const contenedor = document.getElementById("blandi-container");
    if (contenedor) contenedor.innerHTML = generarSvgBlandi(miMascota.visual_genes);

    // 3. RENDERIZADO DE STATS (Panel)
    document.getElementById("blandi-rarity").innerText = miMascota.rarity;
    document.getElementById("blandi-element").innerText = miMascota.element;

    const btnStats = document.getElementById("btn-show-stats");
    const panelStats = document.getElementById("blandi-stats-panel");
    const btnScanner = document.getElementById("btn-use-scanner");

    if (btnStats && panelStats) {
        btnStats.addEventListener("click", () => {
            panelStats.classList.toggle("hidden");
        });
    }

    // 4. LÓGICA DEL ESCÁNER DE ADN
    if (btnScanner) {
        btnScanner.addEventListener("click", () => {
            if (miMascota.scanned) {
                alert("El ADN de este Blandi ya ha sido decodificado.");
                return;
            }

            // Verificamos si tiene el objeto en el inventario y consumimos 1
            if (window.miInventario && window.miInventario.consumeItem("dna_scanner", 1)) {
                
                // Revelar las estadísticas reales en el HTML
                document.getElementById("stat-hp").innerText = miMascota.stats.hp;
                document.getElementById("stat-atk").innerText = miMascota.stats.atk;
                document.getElementById("stat-spd").innerText = miMascota.stats.spd;
                document.getElementById("stat-luk").innerText = miMascota.stats.luk;
                
                // Cambios visuales para confirmar éxito
                panelStats.style.boxShadow = "0 0 20px #8B5CF6";
                btnScanner.innerText = "ADN Revelado ✅";
                btnScanner.style.background = "#4CAF50";
                
                miMascota.scanned = true;
                
            } else {
                alert("No tienes un 'Escáner de ADN' en tu inventario. Consigue uno jugando.");
            }
        });
    }

    // 5. NAVEGACIÓN Y SISTEMA DE PANTALLAS
    const screenRoom = document.getElementById("room-area");
    const screenArcadeMenu = document.getElementById("arcade-menu");
    
    const btnFeed = document.getElementById("btn-feed");
    const btnArcade = document.getElementById("btn-arcade");
    const btnBackLab = document.getElementById("btn-back-from-menu");

    // Lógica Alimentar
    if (btnFeed) {
        btnFeed.addEventListener("click", () => {
            if (window.miInventario && window.miInventario.consumeItem("apple_01", 1)) {
                contenedor.classList.add("happy-jump");
                setTimeout(() => contenedor.classList.remove("happy-jump"), 500);
            } else {
                alert("No tienes manzanas. Ve al Arcade 🕹️ para conseguir más.");
            }
        });
    }

    // Navegación Arcade
    if (btnArcade && screenRoom && screenArcadeMenu) {
        btnArcade.addEventListener("click", () => {
            screenRoom.classList.add("hidden");
            screenArcadeMenu.classList.remove("hidden");
        });
    }

    if (btnBackLab) {
        btnBackLab.addEventListener("click", () => {
            screenArcadeMenu.classList.add("hidden");
            screenRoom.classList.remove("hidden");
        });
    }

    // 6. TRUCO DE DESARROLLO: Añadir escáner inicial
    setTimeout(() => {
        if (window.miInventario && window.miInventario.addItem) {
            window.miInventario.addItem({ 
                id: "dna_scanner", 
                name: "Escáner ADN", 
                icon: "🧬", 
                type: "consumible", 
                maxStack: 20 
            }, 1);
        }
    }, 500);
});