const formasGeno = {
    gota: `<path d="M50,15 C50,15 15,60 15,85 C15,105 85,105 85,85 C85,60 50,15 50,15 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`,
    frijol: `<path d="M25,50 C25,15 75,15 75,50 C75,70 65,65 55,80 C45,95 25,90 25,50 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
};

function generarSvgGeno(genesVisuales) {
    let cuerpoSvg = formasGeno[genesVisuales.body_shape] || formasGeno.gota;
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
    
    // 1. ESTADO GLOBAL DEL GENO PRINCIPAL
    const miMascota = { 
        visual_genes: { body_shape: "frijol", base_color: "#77DD77" },
        rarity: "Común",
        element: "🧪 Tóxico",
        stats: {
            hp: Math.floor(Math.random() * 6) + 5,
            atk: Math.floor(Math.random() * 6) + 5,
            spd: Math.floor(Math.random() * 6) + 5,
            luk: Math.floor(Math.random() * 6) + 5
        },
        scanned: false
    };

    // 2. RENDERIZADO VISUAL DEL GENO
    const contenedor = document.getElementById("geno-container");
    if (contenedor) contenedor.innerHTML = generarSvgGeno(miMascota.visual_genes);

    // 3. RENDERIZADO DE STATS (Panel)
    document.getElementById("geno-rarity").innerText = miMascota.rarity;
    document.getElementById("geno-element").innerText = miMascota.element;

    const btnStats = document.getElementById("btn-show-stats");
    const panelStats = document.getElementById("geno-stats-panel");
    const btnCloseStats = document.getElementById("close-stats-btn");
    const btnScanner = document.getElementById("btn-use-scanner");

    if (btnStats && panelStats) {
        btnStats.addEventListener("click", () => panelStats.classList.toggle("hidden"));
    }
    if (btnCloseStats && panelStats) {
        btnCloseStats.addEventListener("click", () => panelStats.classList.add("hidden"));
    }

    // Lógica del Escáner de ADN
    if (btnScanner) {
        btnScanner.addEventListener("click", () => {
            if (miMascota.scanned) {
                alert("El ADN de este Geno ya ha sido decodificado.");
                return;
            }
            if (window.miInventario && window.miInventario.consumeItem("dna_scanner", 1)) {
                document.getElementById("stat-hp").innerText = miMascota.stats.hp;
                document.getElementById("stat-atk").innerText = miMascota.stats.atk;
                document.getElementById("stat-spd").innerText = miMascota.stats.spd;
                document.getElementById("stat-luk").innerText = miMascota.stats.luk;
                
                panelStats.style.boxShadow = "0 0 20px #8B5CF6";
                btnScanner.innerText = "ADN Revelado ✅";
                btnScanner.style.background = "#4CAF50";
                miMascota.scanned = true;
            } else {
                alert("No tienes un 'Escáner de ADN' en tu inventario. Consigue uno jugando.");
            }
        });
    }

    // 4. SISTEMA DE NAVEGACIÓN
    const screenRoom = document.getElementById("room-area");
    const screenArcadeMenu = document.getElementById("arcade-menu");
    const screenSanctuary = document.getElementById("sanctuary-screen");
    
    const btnFeed = document.getElementById("btn-feed");
    const btnArcade = document.getElementById("btn-arcade");
    const btnSanctuary = document.getElementById("btn-sanctuary");
    
    const btnBackLab = document.getElementById("btn-back-from-menu");
    const btnBackSanctuary = document.getElementById("btn-back-from-sanctuary");

    // Alimentar
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

    // Navegar a Arcade
    if (btnArcade) {
        btnArcade.addEventListener("click", () => {
            screenRoom.classList.add("hidden");
            screenArcadeMenu.classList.remove("hidden");
            if (panelStats) panelStats.classList.add("hidden");
        });
    }
    if (btnBackLab) {
        btnBackLab.addEventListener("click", () => {
            screenArcadeMenu.classList.add("hidden");
            screenRoom.classList.remove("hidden");
        });
    }

    // Navegar al Santuario
    if (btnSanctuary) {
        btnSanctuary.addEventListener("click", () => {
            screenRoom.classList.add("hidden");
            screenSanctuary.classList.remove("hidden");
            if (panelStats) panelStats.classList.add("hidden");
            renderizarSantuario(); // Actualiza la lista al entrar
        });
    }
    if (btnBackSanctuary) {
        btnBackSanctuary.addEventListener("click", () => {
            screenSanctuary.classList.add("hidden");
            screenRoom.classList.remove("hidden");
        });
    }

    // Ocultar botones inventario al abrir
    const backpackIconUI = document.getElementById("backpack-icon");
    if (backpackIconUI) {
        backpackIconUI.addEventListener("click", () => {
            const itemActions = document.getElementById("item-actions");
            if (itemActions) itemActions.classList.add("hidden");
        });
    }

    // =========================================
    // 5. LÓGICA DEL SANTUARIO (QUEMA / BURN)
    // =========================================
    let dailyReleases = 0;
    const maxDailyReleases = 3;
    
    // Genos de prueba en tu "almacenamiento" para quemar
    let genosAlmacenados = [
        { id: 1, name: "Geno Falla", rarity: "Común", element: "🦠 Viral", shape: "gota", color: "#FFB6C1", reward: 50 },
        { id: 2, name: "Geno Débil", rarity: "Común", element: "🧫 Sintético", shape: "frijol", color: "#ADD8E6", reward: 50 },
        { id: 3, name: "Geno Lento", rarity: "Común", element: "⚙️ Cibernético", shape: "gota", color: "#D3D3D3", reward: 50 },
        { id: 4, name: "Geno Puro", rarity: "Raro", element: "☢️ Radiactivo", shape: "frijol", color: "#98FB98", reward: 150 }
    ];

    function renderizarSantuario() {
        const grid = document.getElementById("sanctuary-grid");
        const counter = document.getElementById("daily-release-count");
        grid.innerHTML = "";
        counter.innerText = dailyReleases;

        if (genosAlmacenados.length === 0) {
            grid.innerHTML = `<p style="grid-column: span 2; text-align: center; color: #888; margin-top: 20px;">No tienes más Genos almacenados.</p>`;
            return;
        }

        genosAlmacenados.forEach(geno => {
            const card = document.createElement("div");
            card.className = "geno-card";
            
            // Generar la imagen del Geno usando su ADN
            const miniSvg = generarSvgGeno({ body_shape: geno.shape, base_color: geno.color });
            
            card.innerHTML = `
                ${miniSvg}
                <h4>${geno.name}</h4>
                <p>${geno.rarity} | ${geno.element}</p>
                <div class="geno-reward">✨ +${geno.reward} Esencia</div>
                <button class="btn-liberar-geno" data-id="${geno.id}" ${dailyReleases >= maxDailyReleases ? 'disabled' : ''}>
                    ${dailyReleases >= maxDailyReleases ? 'Límite Alcanzado' : 'Liberar'}
                </button>
            `;
            grid.appendChild(card);
        });

        // Eventos para los botones de liberar
        document.querySelectorAll(".btn-liberar-geno").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if (dailyReleases >= maxDailyReleases) return; // Seguridad extra
                
                const genoId = parseInt(e.target.getAttribute("data-id"));
                const genoToRelease = genosAlmacenados.find(g => g.id === genoId);
                
                if (confirm(`¿Estás seguro de liberar a ${genoToRelease.name}? Esta acción es irreversible.`)) {
                    // 1. Quitar el Geno de la lista
                    genosAlmacenados = genosAlmacenados.filter(g => g.id !== genoId);
                    
                    // 2. Dar la recompensa
                    if (window.miInventario) window.miInventario.addEssence(genoToRelease.reward);
                    
                    // 3. Subir el contador diario
                    dailyReleases++;
                    
                    // 4. Actualizar la vista
                    alert(`Has liberado a ${genoToRelease.name}. Ganaste ✨ ${genoToRelease.reward} Esencia Vital.`);
                    renderizarSantuario();
                }
            });
        });
    }

    // 6. Añadir escáner inicial al inventario
    setTimeout(() => {
        if (window.miInventario && window.miInventario.addItem) {
            window.miInventario.addItem({ id: "dna_scanner", name: "Escáner ADN", icon: "🧬", type: "consumible", maxStack: 20 }, 1);
        }
    }, 500);
});