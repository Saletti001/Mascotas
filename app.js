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
    // LÓGICA DEL REACTOR GENÉTICO (NIVELES 1, 2 Y 3)
    // =========================================
    
    // Diccionario de Reglas de la V7.0
    const reactorRules = {
        "1": { 
            reqRarity: "Común", cost: 100, 
            probCrit: 3, probNorm: 35, probStag: 35, // Colapso es el resto (27%)
            resCrit: { rarity: "Épico", name: "Mutante Primordial", color: "#8A2BE2", shape: "estrella" },
            resNorm: { rarity: "Raro", name: "Geno Evolucionado", color: "#4169E1", shape: "frijol" },
            resStag: { rarity: "Común+", name: "Superviviente", color: "#32CD32", shape: "gota" }
        },
        "2": { 
            reqRarity: "Raro", cost: 500, // Costo mayor para Nivel 2
            probCrit: 0.5, probNorm: 25, probStag: 35, // Colapso es el resto (39.5%)
            resCrit: { rarity: "Legendario", name: "Anomalía Leyenda", color: "#FFD700", shape: "estrella" },
            resNorm: { rarity: "Épico", name: "Geno Superior", color: "#8A2BE2", shape: "estrella" },
            resStag: { rarity: "Raro+", name: "Veterano Raro", color: "#4169E1", shape: "frijol" }
        },
        "3": { 
            reqRarity: "Épico", cost: 2500, // Costo extremo para Nivel 3
            probCrit: 0.1, probNorm: 5, probStag: 40, // Colapso es el resto (54.9%)
            resCrit: { rarity: "Mítico", name: "Dios Primigenio", color: "#111111", shape: "estrella" },
            resNorm: { rarity: "Legendario", name: "Mito Viviente", color: "#FFD700", shape: "estrella" },
            resStag: { rarity: "Épico+", name: "Titán Épico", color: "#8A2BE2", shape: "estrella" }
        }
    };

    const selectNivel = document.getElementById("reactor-level-select");
    
    // Actualizar pantalla cuando el jugador cambia de nivel en el selector
    selectNivel.addEventListener("change", renderizarAlquimia);

    function renderizarAlquimia() {
        const nivel = selectNivel.value;
        const reglas = reactorRules[nivel];
        
        // Actualizar textos de la UI
        document.getElementById("reactor-req-name").innerText = reglas.reqRarity + "s";
        document.getElementById("reactor-cost-display").innerText = reglas.cost + " ✨";

        // Contar los Genos de la rareza exacta solicitada
        const genosValidos = window.misGenos.filter(g => g.rarity === reglas.reqRarity);
        document.getElementById("alchemy-common-count").innerText = genosValidos.length;
        
        const btnFuse = document.getElementById("btn-fuse-genos");
        const tieneGenos = genosValidos.length >= 5;
        const tieneEsencia = window.miInventario && window.miInventario.vitalEssence >= reglas.cost;
        
        btnFuse.disabled = !(tieneGenos && tieneEsencia);
    }

    document.getElementById("btn-fuse-genos").addEventListener("click", () => {
        const nivel = selectNivel.value;
        const reglas = reactorRules[nivel];
        const genosValidos = window.misGenos.filter(g => g.rarity === reglas.reqRarity);
        
        if (genosValidos.length >= 5 && window.miInventario && window.miInventario.vitalEssence >= reglas.cost) {
            
            const btnFuse = document.getElementById("btn-fuse-genos");
            const visual = document.getElementById("alchemy-visual");
            
            // 1. Cobrar la Esencia
            window.miInventario.addEssence(-reglas.cost);
            
            // 2. Quemar los 5 Genos específicos
            let borrados = 0;
            window.misGenos = window.misGenos.filter(g => {
                if (g.rarity === reglas.reqRarity && borrados < 5) { borrados++; return false; }
                return true;
            });

            // 3. ANIMACIÓN DE SOBRECARGA
            btnFuse.disabled = true;
            btnFuse.innerText = "Sintetizando ADN...";
            visual.style.transition = "all 0.2s";
            
            let toggle = false;
            const animacionReactor = setInterval(() => {
                toggle = !toggle;
                visual.innerHTML = toggle ? "⚡ 🧬 ⚡ 🧬 ⚡" : "🧬 ⚡ 🧬 ⚡ 🧬";
                visual.style.backgroundColor = toggle ? "#f3e8ff" : "#e0eaf5";
                visual.style.color = toggle ? "#8B5CF6" : "#333";
                visual.style.transform = toggle ? "scale(1.02)" : "scale(0.98)";
            }, 150);

            // 4. RESOLUCIÓN DE PROBABILIDADES
            setTimeout(() => {
                clearInterval(animacionReactor);
                visual.style.transform = "scale(1)";
                
                const tirada = Math.random() * 100;
                let mensaje = "";
                
                // Límites acumulativos para la ruleta
                const limiteCritico = reglas.probCrit;
                const limiteNormal = limiteCritico + reglas.probNorm;
                const limiteEstancada = limiteNormal + reglas.probStag;

                if (tirada < limiteCritico) {
                    // ÉXITO CRÍTICO
                    window.misGenos.push({ id: Date.now(), name: reglas.resCrit.name, rarity: reglas.resCrit.rarity, element: "🌌 Cósmico", shape: reglas.resCrit.shape, color: reglas.resCrit.color, reward: 1500 });
                    mensaje = `¡ÉXITO CRÍTICO! 🌟\nEl Reactor ha creado una anomalía: [Geno ${reglas.resCrit.rarity}].`;
                    visual.innerHTML = `🌟 ${reglas.resCrit.rarity.toUpperCase()} 🌟`;
                    visual.style.backgroundColor = "#fff0f5";
                    visual.style.color = reglas.resCrit.color;

                } else if (tirada < limiteNormal) { 
                    // ÉXITO NORMAL
                    window.misGenos.push({ id: Date.now(), name: reglas.resNorm.name, rarity: reglas.resNorm.rarity, element: "⚙️ Cibernético", shape: reglas.resNorm.shape, color: reglas.resNorm.color, reward: 500 });
                    mensaje = `¡FUSIÓN ESTABLE! ✨\nHas obtenido un [Geno ${reglas.resNorm.rarity}].`;
                    visual.innerHTML = `✨ ${reglas.resNorm.rarity.toUpperCase()} ✨`;
                    visual.style.backgroundColor = "#e6f2ff";
                    visual.style.color = reglas.resNorm.color;

                } else if (tirada < limiteEstancada) { 
                    // MUTACIÓN ESTANCADA
                    window.misGenos.push({ id: Date.now(), name: reglas.resStag.name, rarity: reglas.resStag.rarity, element: "🧪 Tóxico", shape: reglas.resStag.shape, color: reglas.resStag.color, reward: 150 });
                    mensaje = `MUTACIÓN ESTANCADA ⚠️\nRecuperas 1 [Geno ${reglas.resStag.rarity}].`;
                    visual.innerHTML = `⚠️ ${reglas.resStag.rarity.toUpperCase()} ⚠️`;
                    visual.style.backgroundColor = "#f0fff0";
                    visual.style.color = reglas.resStag.color;

                } else {
                    // COLAPSO GENÉTICO
                    const compensacion = reglas.cost * 1.5; // Te devuelve un 50% extra de lo que gastaste
                    window.miInventario.addEssence(compensacion);
                    mensaje = `¡COLAPSO DEL REACTOR! 💥\nLos 5 Genos se desintegraron. Recuperas ${compensacion} ✨ de los restos.`;
                    visual.innerHTML = "💥 COLAPSO 💥";
                    visual.style.backgroundColor = "#ffeeee";
                    visual.style.color = "#d9534f";
                }

                setTimeout(() => {
                    alert(mensaje);
                    visual.innerHTML = "🧬 + 🧬 + 🧬 + 🧬 + 🧬 = 🌟";
                    visual.style.backgroundColor = "#f8f9fa";
                    visual.style.color = "#333";
                    visual.style.boxShadow = "none";
                    btnFuse.innerText = "Activar Reactor";
                    renderizarAlquimia();
                }, 100);

            }, 2500);
        }
    });

    // ---------------------------------------------------------
    // HACK DE DESARROLLADOR: INYECCIÓN DE RECURSOS PARA PRUEBAS
    // ---------------------------------------------------------
    setTimeout(() => {
        if (window.miInventario) {
            window.miInventario.addItem({ id: "dna_scanner", name: "Escáner ADN", icon: "🧬", type: "consumible", maxStack: 20 }, 5);
            window.miInventario.addEssence(10000); // 10k de Esencia para que quemes sin piedad
        }
        
        // Inyectar 5 Raros para probar Nivel 2
        for(let i=0; i<5; i++) {
            window.misGenos.push({ id: 100+i, name: "Sujeto Raro", rarity: "Raro", element: "💧 Acuático", shape: "frijol", color: "#4169E1", reward: 100 });
        }
        // Inyectar 5 Épicos para probar Nivel 3
        for(let i=0; i<5; i++) {
            window.misGenos.push({ id: 200+i, name: "Sujeto Épico", rarity: "Épico", element: "🌌 Cósmico", shape: "estrella", color: "#8A2BE2", reward: 200 });
        }
    }, 500);

}); // Fin del evento DOMContentLoaded