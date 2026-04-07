const formasGeno = {
    gota: `<path d="M50,15 C50,15 15,60 15,85 C15,105 85,105 85,85 C85,60 50,15 50,15 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`,
    frijol: `<path d="M25,50 C25,15 75,15 75,50 C75,70 65,65 55,80 C45,95 25,90 25,50 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`,
    estrella: `<path d="M50,10 L60,40 L90,40 L65,60 L75,90 L50,70 L25,90 L35,60 L10,40 L40,40 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>` // Nueva forma para el Raro
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

// BBDD GLOBAL DE TUS GENOS (Para que Santuario y Alquimia compartan datos)
window.misGenos = [
    { id: 1, name: "Geno Base 1", rarity: "Común", element: "🦠 Viral", shape: "gota", color: "#FFB6C1", reward: 50 },
    { id: 2, name: "Geno Base 2", rarity: "Común", element: "🧫 Sintético", shape: "frijol", color: "#ADD8E6", reward: 50 },
    { id: 3, name: "Geno Base 3", rarity: "Común", element: "⚙️ Cibernético", shape: "gota", color: "#D3D3D3", reward: 50 },
    { id: 4, name: "Geno Base 4", rarity: "Común", element: "🔥 Ígneo", shape: "frijol", color: "#ffcccb", reward: 50 },
    { id: 5, name: "Geno Base 5", rarity: "Común", element: "💧 Acuático", shape: "gota", color: "#e0ffff", reward: 50 },
    { id: 6, name: "Geno Falla", rarity: "Común", element: "🧪 Tóxico", shape: "frijol", color: "#98FB98", reward: 50 }
];

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

    // Renderizar Geno en Laboratorio
    const contenedor = document.getElementById("geno-container");
    if (contenedor) contenedor.innerHTML = generarSvgGeno(miMascota.visual_genes);

    // Renderizar Stats
    document.getElementById("geno-rarity").innerText = miMascota.rarity;
    document.getElementById("geno-element").innerText = miMascota.element;

    // Panel de Stats y Escáner
    const btnStats = document.getElementById("btn-show-stats");
    const panelStats = document.getElementById("geno-stats-panel");
    const btnCloseStats = document.getElementById("close-stats-btn");
    const btnScanner = document.getElementById("btn-use-scanner");

    if (btnStats) btnStats.addEventListener("click", () => panelStats.classList.toggle("hidden"));
    if (btnCloseStats) btnCloseStats.addEventListener("click", () => panelStats.classList.add("hidden"));

    if (btnScanner) {
        btnScanner.addEventListener("click", () => {
            if (miMascota.scanned) { alert("El ADN ya ha sido decodificado."); return; }
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
                alert("No tienes un Escáner de ADN.");
            }
        });
    }

    // =========================================
    // NUEVO SISTEMA DE MENÚ DESPLEGABLE
    // =========================================
    const fabMenu = document.getElementById("fab-menu");
    const drawerMenu = document.getElementById("drawer-menu");
    const closeDrawer = document.getElementById("close-drawer");

    const screenRoom = document.getElementById("room-area");
    const screenArcade = document.getElementById("arcade-menu");
    const screenSanctuary = document.getElementById("sanctuary-screen");
    const screenAlchemy = document.getElementById("alchemy-screen");
    const screens = [screenRoom, screenArcade, screenSanctuary, screenAlchemy];

    // Abrir / Cerrar Menú
    fabMenu.addEventListener("click", () => drawerMenu.classList.remove("hidden"));
    closeDrawer.addEventListener("click", () => drawerMenu.classList.add("hidden"));

    // Función para cambiar de pantalla y cerrar el menú
    function goToScreen(targetScreen) {
        screens.forEach(s => s.classList.add("hidden"));
        targetScreen.classList.remove("hidden");
        drawerMenu.classList.add("hidden"); // Cierra el cajón
        if(panelStats) panelStats.classList.add("hidden");
        fabMenu.classList.toggle("hidden", targetScreen !== screenRoom); // Oculta el FAB si no estás en el lab
    }

    // Botones de "Volver al Laboratorio" en cada pantalla
    document.querySelectorAll(".btn-go-home").forEach(btn => {
        btn.addEventListener("click", () => goToScreen(screenRoom));
    });

    // Eventos de los iconos del menú
    document.getElementById("btn-feed").addEventListener("click", () => {
        if (window.miInventario && window.miInventario.consumeItem("apple_01", 1)) {
            drawerMenu.classList.add("hidden");
            contenedor.classList.add("happy-jump");
            setTimeout(() => contenedor.classList.remove("happy-jump"), 500);
        } else {
            alert("No tienes manzanas.");
        }
    });
    document.getElementById("btn-sanctuary").addEventListener("click", () => { goToScreen(screenSanctuary); renderizarSantuario(); });
    document.getElementById("btn-arcade").addEventListener("click", () => goToScreen(screenArcade));
    document.getElementById("btn-alchemy").addEventListener("click", () => { goToScreen(screenAlchemy); renderizarAlquimia(); });

    // =========================================
    // LÓGICA DEL SANTUARIO
    // =========================================
    let dailyReleases = 0;
    const maxDailyReleases = 3;

    function renderizarSantuario() {
        const grid = document.getElementById("sanctuary-grid");
        document.getElementById("daily-release-count").innerText = dailyReleases;
        grid.innerHTML = "";

        if (window.misGenos.length === 0) {
            grid.innerHTML = `<p style="grid-column: span 2; text-align: center; color: #888;">No tienes Genos almacenados.</p>`;
            return;
        }

        window.misGenos.forEach(geno => {
            const card = document.createElement("div");
            card.className = "geno-card";
            card.innerHTML = `
                ${generarSvgGeno({ body_shape: geno.shape, base_color: geno.color })}
                <h4>${geno.name}</h4>
                <p>${geno.rarity}</p>
                <div class="geno-reward">✨ +${geno.reward}</div>
                <button class="btn-liberar-geno" data-id="${geno.id}" ${dailyReleases >= maxDailyReleases ? 'disabled' : ''}>Liberar</button>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll(".btn-liberar-geno").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if (dailyReleases >= maxDailyReleases) return;
                const genoId = parseInt(e.target.getAttribute("data-id"));
                const geno = window.misGenos.find(g => g.id === genoId);
                
                if (confirm(`¿Liberar a ${geno.name}?`)) {
                    window.misGenos = window.misGenos.filter(g => g.id !== genoId);
                    if (window.miInventario) window.miInventario.addEssence(geno.reward);
                    dailyReleases++;
                    alert(`Ganaste ✨ ${geno.reward}`);
                    renderizarSantuario();
                }
            });
        });
    }

    // =========================================
    // LÓGICA DE ALQUIMIA (FUSIÓN)
    // =========================================
    function renderizarAlquimia() {
        // Contamos cuántos genos 'Comunes' tiene el jugador
        const comunes = window.misGenos.filter(g => g.rarity === "Común");
        const countDisplay = document.getElementById("alchemy-common-count");
        const btnFuse = document.getElementById("btn-fuse-genos");
        
        countDisplay.innerText = comunes.length;
        
        // Habilitar botón solo si tiene 5 o más comunes y 100 de esencia
        const tieneGenos = comunes.length >= 5;
        const tieneEsencia = window.miInventario && window.miInventario.vitalEssence >= 100;
        
        btnFuse.disabled = !(tieneGenos && tieneEsencia);
    }

    document.getElementById("btn-fuse-genos").addEventListener("click", () => {
        const comunes = window.misGenos.filter(g => g.rarity === "Común");
        
        if (comunes.length >= 5 && window.miInventario && window.miInventario.vitalEssence >= 100) {
            
            // 1. Cobrar la Esencia (Hacemos un hack agregando esencia negativa)
            window.miInventario.addEssence(-100);
            
            // 2. Eliminar 5 Genos Comunes de la lista
            let borrados = 0;
            window.misGenos = window.misGenos.filter(g => {
                if (g.rarity === "Común" && borrados < 5) { borrados++; return false; }
                return true;
            });
            
            // 3. Crear el nuevo Geno Raro
            const nuevoGeno = {
                id: Date.now(),
                name: "Geno Evolucionado",
                rarity: "Raro",
                element: "🌌 Cósmico",
                shape: "estrella", // Nueva forma!
                color: "#FFD700",
                reward: 250
            };
            window.misGenos.push(nuevoGeno);
            
            alert("¡FUSIÓN EXITOSA! 🌟\nHas obtenido un [Geno Evolucionado] Raro.");
            renderizarAlquimia(); // Actualizar panel
        }
    });

    // Truco: Dar recursos para probar
    setTimeout(() => {
        if (window.miInventario) {
            window.miInventario.addItem({ id: "dna_scanner", name: "Escáner ADN", icon: "🧬", type: "consumible", maxStack: 20 }, 1);
            window.miInventario.addEssence(150); // Te regalo 150 para que pruebes la fusión
        }
    }, 500);

});