// =========================================
// app.js - CONTROLADOR PRINCIPAL Y NAVEGACIÓN
// =========================================

window.misGenos = window.misGenos || []; 
window.maxGenoSlots = window.maxGenoSlots || 6; 

// =========================================
// TABLA DE IVs (V8.0)
// =========================================
window.TABLA_IVS = {
    "Común": { hp: [35, 55], atk: [10, 22], spd: [8, 25], luk: [5, 15] },
    "Raro": { hp: [50, 75], atk: [18, 35], spd: [15, 40], luk: [10, 25] },
    "Épico": { hp: [70, 100], atk: [28, 50], spd: [25, 55], luk: [20, 35] },
    "Legendario": { hp: [95, 130], atk: [40, 70], spd: [35, 80], luk: [30, 50] },
    "Mítico": { hp: [120, 160], atk: [60, 100], spd: [50, 110], luk: [45, 70] }
};

window.generarStatsPorRareza = function(rareza) {
    const limites = window.TABLA_IVS[rareza] || window.TABLA_IVS["Común"];
    const randStat = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    return {
        hp: randStat(limites.hp[0], limites.hp[1]),
        atk: randStat(limites.atk[0], limites.atk[1]),
        spd: randStat(limites.spd[0], limites.spd[1]),
        luk: randStat(limites.luk[0], limites.luk[1])
    };
};

// =========================================
// BIBLIOTECA DE GENES OCULTOS (V8.0)
// =========================================
window.GENES_OCULTOS = {
    "resiliencia_ultima": { name: "Resiliencia Última", desc: "x1.4 ATK/SPD si HP < 15%" },
    "piel_cristal": { name: "Piel de Cristal", desc: "Primer golpe recibe 0 daño" },
    "velocidad_fantasma": { name: "Velocidad Fantasma", desc: "20% probabilidad de turno doble" },
    "reflejo_genetico": { name: "Reflejo Genético", desc: "Devuelve 30% del daño crítico" },
    "elemento_dual": { name: "Elemento Dual", desc: "Segundo elemento activable en combate" },
    "afinidad_latente": { name: "Afinidad Latente", desc: "Mitiga debilidad elemental a x0.75" },
    "fertilidad_pura": { name: "Fertilidad Pura", desc: "Límite de crías +2 (Total 9)" },
    "dominancia_genetica": { name: "Dominancia Genética", desc: "70% dominancia en herencia de rasgos" },
    "cooldown_acelerado": { name: "Cooldown Acelerado", desc: "-50% tiempo de descanso cría" },
    "catalizador_rareza": { name: "Catalizador de Rareza", desc: "+2% Éxito Crítico en Reactor" },
    "aprendiz_acelerado": { name: "Aprendiz Acelerado", desc: "x1.25 XP obtenida" },
    "umbral_despertar": { name: "Umbral del Despertar", desc: "+5 todos los IVs al Nv. 25" },
    "cromatico_latente": { name: "Cromático Latente", desc: "Desbloquea skin alternativa" },
    "aura_linaje": { name: "Aura de Linaje", desc: "Aureola visual inmutable" },
    "patron_holografico": { name: "Patrón Holográfico", desc: "Patrón de piel animado" },
    "esencia_concentrada": { name: "Esencia Concentrada", desc: "x2 Esencia Vital al liberar" },
    "resistencia_colapso": { name: "Resistencia al Colapso", desc: "Evita colapso total en Reactor" },
    "gen_mentor": { name: "Gen Mentor", desc: "+15% XP para becados" },
    "aura_liderazgo": { name: "Aura de Liderazgo", desc: "+10% ATK a todo el equipo" }
};

window.generarGenOculto = function() {
    const keys = Object.keys(window.GENES_OCULTOS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return { id: randomKey, ...window.GENES_OCULTOS[randomKey] };
};

document.addEventListener("DOMContentLoaded", () => {
    
    setTimeout(() => {
        const noHayPartida = !localStorage.getItem("proyecto_genos_save_v1");
        
        if (noHayPartida) {
            const pedestal = document.getElementById("geno-container");
            if (pedestal) pedestal.innerHTML = "";
            iniciarSecuenciaBienvenida();
        }
    }, 100);

    const fabMenu = document.getElementById("fab-menu");
    const drawerMenu = document.getElementById("drawer-menu");
    const closeDrawer = document.getElementById("close-drawer");

    const screenRoom = document.getElementById("room-area");
    const screenArcade = document.getElementById("arcade-menu");
    const screenSanctuary = document.getElementById("sanctuary-screen");
    const screenAlchemy = document.getElementById("alchemy-screen");
    const screenBreeding = document.getElementById("breeding-screen");
    const screenColiseum = document.getElementById("coliseum-screen");
    const screenMarket = document.getElementById("market-screen"); 
    
    const screens = [screenRoom, screenArcade, screenSanctuary, screenAlchemy, screenBreeding, screenColiseum, screenMarket]; 

    if(fabMenu) fabMenu.addEventListener("click", () => drawerMenu.classList.remove("hidden"));
    if(closeDrawer) closeDrawer.addEventListener("click", () => drawerMenu.classList.add("hidden"));

    window.navegarA = function(idPantalla) {
        screens.forEach(s => { if(s) s.classList.add("hidden"); });
        const destino = document.getElementById(idPantalla);
        if(destino) destino.classList.remove("hidden");
        
        if(drawerMenu) drawerMenu.classList.add("hidden"); 
        
        const panelStats = document.getElementById("geno-stats-panel");
        if(panelStats) panelStats.classList.add("hidden");
        
        if(fabMenu) fabMenu.classList.toggle("hidden", destino !== screenRoom); 
    }

    document.querySelectorAll(".btn-go-home").forEach(btn => {
        btn.addEventListener("click", () => window.navegarA("room-area"));
    });

    const botonesNexo = {
        'btn-sanctuary': 'sanctuary-screen',
        'btn-alchemy': 'alchemy-screen',
        'btn-breeding': 'breeding-screen',
        'btn-arcade': 'arcade-menu',
        'btn-coliseum': 'coliseum-screen',
        'btn-market': 'market-screen'
    };

    for (const [btnId, pantallaId] of Object.entries(botonesNexo)) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = () => {
                window.navegarA(pantallaId);
                if(btnId === 'btn-sanctuary' && window.renderizarSantuario) window.renderizarSantuario();
                if(btnId === 'btn-alchemy' && window.renderizarAlquimia) window.renderizarAlquimia();
                if(btnId === 'btn-breeding' && window.iniciarSelectorCrianza) window.iniciarSelectorCrianza();
                if(btnId === 'btn-coliseum' && window.iniciarColiseo) window.iniciarColiseo();
                if(btnId === 'btn-market' && window.iniciarMercado) window.iniciarMercado();
            };
        }
    }

    const btnFeed = document.getElementById("btn-feed");
    if(btnFeed) {
        btnFeed.addEventListener("click", () => {
            if (window.miInventario && window.miInventario.consumeItem("apple_01", 1)) {
                drawerMenu.classList.add("hidden");
                const contenedor = document.getElementById("geno-container");
                if(contenedor) {
                    contenedor.classList.add("happy-jump");
                    setTimeout(() => contenedor.classList.remove("happy-jump"), 500);
                }
                if(window.ganarXP) window.ganarXP(25);
            } else {
                alert("No tienes manzanas en tu mochila.");
            }
        });
    }

    const contenedorGenoMain = document.getElementById("geno-container");
    if (contenedorGenoMain) {
        contenedorGenoMain.addEventListener("click", (e) => {
            if (!window.miMascota || window.miMascota.id === "temp") return;

            if (window.Sonidos) window.Sonidos.play("click");
            
            contenedorGenoMain.classList.remove("geno-idle");
            contenedorGenoMain.classList.add("happy-jump");
            setTimeout(() => {
                contenedorGenoMain.classList.remove("happy-jump");
                contenedorGenoMain.classList.add("geno-idle");
            }, 300);

            const heart = document.createElement("div");
            heart.className = "heart-particle";
            heart.innerText = "❤️";
            
            const rect = contenedorGenoMain.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            
            contenedorGenoMain.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        });
    }

    const btnMusic = document.getElementById("btn-toggle-music");
    const musicIcon = document.getElementById("music-icon");
    const musicText = document.getElementById("music-text");
    
    if(btnMusic) {
        btnMusic.addEventListener("click", () => {
            if(window.Sonidos) {
                const estaSonando = window.Sonidos.toggleMusica();
                if(estaSonando) {
                    musicIcon.innerText = "🔊";
                    musicText.innerText = "Música: ON";
                    btnMusic.style.background = "#e0f7fa";
                } else {
                    musicIcon.innerText = "🎵";
                    musicText.innerText = "Música: OFF";
                    btnMusic.style.background = "transparent";
                }
            }
        });
    }

    setTimeout(() => {
        if(!window.miWallet) window.miWallet = { pol: 10.0 };
        const regaloDado = localStorage.getItem("regaloInicialDado");
        if (!regaloDado && window.miInventario) {
            window.miInventario.addItem({ id: "dna_scanner", name: "Escáner ADN", icon: "🧬", type: "consumible", maxStack: 20 }, 5);
            localStorage.setItem("regaloInicialDado", "true");
        }
    }, 500);
});

// =========================================
// VISOR DE GENOS MAESTRO (INVENTARIO CON SLOTS)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    if (!window.maxGenoSlots) window.maxGenoSlots = 6;

    const btnMisGenosMain = document.getElementById("btn-show-genos");
    const modalSwap = document.getElementById("geno-swap-modal");
    const btnCloseSwap = document.getElementById("close-swap-modal");
    const gridSwap = document.getElementById("geno-swap-grid");
    const pedestal = document.getElementById("geno-container");

    function renderizarInventarioGenos() {
        if (!gridSwap || !modalSwap) return;
        
        gridSwap.innerHTML = ""; 
        
        const todos = [];
        
        if (window.misGenos) {
            const idMascotaActual = window.miMascota ? String(window.miMascota.id) : null;
            
            const mascota = window.misGenos.find(g => String(g.id) === idMascotaActual);
            if (mascota && !mascota.isEgg) todos.push(mascota);
            
            const otros = window.misGenos.filter(g => String(g.id) !== idMascotaActual);
            otros.forEach(g => {
                if (!g.isEgg) todos.push(g);
            });
        }

        const slotsOcupados = todos.length;

        const infoCard = document.createElement("div");
        infoCard.style = "grid-column: 1 / -1; text-align: center; margin-bottom: 5px; padding-bottom: 10px; border-bottom: 1px solid #333;";
        const colorTexto = slotsOcupados > window.maxGenoSlots ? "#ff6b6b" : "#4dd0e1";
        infoCard.innerHTML = `<span style="color: ${colorTexto}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Capacidad: ${slotsOcupados} / ${window.maxGenoSlots}</span>`;
        gridSwap.appendChild(infoCard);

        todos.forEach(geno => {
            const card = document.createElement("div");
            card.style = "background: #1a2a36; border: 1px solid #4dd0e1; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.3);";
            
            if (window.miMascota && String(window.miMascota.id) === String(geno.id)) {
                card.style.border = "2px solid #ffcc00";
                card.style.boxShadow = "0 0 15px rgba(255, 204, 0, 0.4)";
            } else {
                card.onmouseover = () => card.style.boxShadow = "0 0 15px rgba(77, 208, 225, 0.4)";
                card.onmouseout = () => card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
            }

            const pColor = geno.color || geno.base_color || "#ccc";
            
            let svg = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '';
            svg = svg.replace(/<svg[^>]*>/, '<svg width="100%" height="100%" viewBox="-20 0 200 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">');
            
            card.innerHTML = `
                <div style="width: 70px; height: 70px; color: ${pColor}; display: flex; justify-content: center; align-items: center;">
                    ${svg}
                </div>
                <span style="color: white; font-weight: bold; font-size: 12px; margin-top: 10px; text-align: center;">${geno.name || 'Sujeto'}</span>
            `;
            
            card.onclick = () => {
                window.miMascota = geno;
                if (pedestal) {
                    const svgPedestal = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '';
                    pedestal.innerHTML = `<div class="geno-idle" style="color: ${pColor}; top: 50%; left: 50%; display: flex; justify-content: center; align-items: center;">${svgPedestal}</div>`;
                }
                const nameEl = document.getElementById('geno-name');
                if (nameEl) nameEl.innerText = geno.name || 'Sujeto';
                
                if(typeof window.actualizarPanelRPG === 'function') window.actualizarPanelRPG();
                modalSwap.classList.add("hidden");
                if (typeof window.guardarJuego === 'function') window.guardarJuego();
                else if (typeof window.guardarProgreso === 'function') window.guardarProgreso();
            };
            
            gridSwap.appendChild(card);
        });

        const slotsLibres = Math.max(0, window.maxGenoSlots - slotsOcupados);

        for (let i = 0; i < slotsLibres; i++) {
            const emptyCard = document.createElement("div");
            emptyCard.style = "background: rgba(26, 42, 54, 0.5); border: 1px dashed #4dd0e1; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.5;";
            emptyCard.innerHTML = `
                <div style="width: 70px; height: 70px; display: flex; justify-content: center; align-items: center; font-size: 24px; color: #4dd0e1;">
                    🧬
                </div>
                <span style="color: #4dd0e1; font-weight: bold; font-size: 12px; margin-top: 10px; text-align: center;">Vacío</span>
            `;
            gridSwap.appendChild(emptyCard);
        }

        const costoExpansion = parseFloat((0.5 + (window.maxGenoSlots - 6) * 0.1).toFixed(2));
        const siguienteSlot = window.maxGenoSlots + 1;

        const buyCard = document.createElement("div");
        buyCard.style = "background: rgba(138, 43, 226, 0.1); border: 1px solid #8A2BE2; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;";
        buyCard.onmouseover = () => buyCard.style.boxShadow = "0 0 15px rgba(138, 43, 226, 0.4)";
        buyCard.onmouseout = () => buyCard.style.boxShadow = "none";
        
        buyCard.innerHTML = `
            <div style="width: 70px; height: 70px; display: flex; justify-content: center; align-items: center; font-size: 30px; color: #e0b0ff;">
                ➕
            </div>
            <span style="color: white; font-weight: bold; font-size: 12px; margin-top: 5px; text-align: center;">Comprar Slot #${siguienteSlot}</span>
            <span style="color: #e0b0ff; font-weight: bold; font-size: 11px; margin-top: 5px; text-align: center;">${costoExpansion} POL</span>
        `;

        buyCard.onclick = () => {
            if (window.miWallet && window.miWallet.pol >= costoExpansion) {
                window.miWallet.pol -= costoExpansion;
                window.maxGenoSlots += 1;
                
                if(typeof window.actualizarHUD === 'function') window.actualizarHUD();
                renderizarInventarioGenos(); 
                if (typeof window.guardarJuego === 'function') window.guardarJuego();
                else if (typeof window.guardarProgreso === 'function') window.guardarProgreso();
            } else {
                alert("No tienes suficiente $POL para expandir tu inventario. ¡Consigue más jugando o recargando!");
            }
        };

        gridSwap.appendChild(buyCard);
    }

    if (btnMisGenosMain) {
        btnMisGenosMain.addEventListener("click", () => {
            renderizarInventarioGenos(); 
            modalSwap.classList.remove("hidden");
        });
    }

    if (btnCloseSwap && modalSwap) {
        btnCloseSwap.addEventListener("click", () => {
            modalSwap.classList.add("hidden");
        });
    }
});

window.generarNuevoID = function() {
    let count = parseInt(localStorage.getItem('genoGlobalCounter') || '0');
    count++;
    localStorage.setItem('genoGlobalCounter', count);
    return String(count).padStart(6, '0'); 
};

// =========================================
// SECUENCIA DE INICIO: EL BIO-NÚCLEO ALFA
// =========================================
function iniciarSecuenciaBienvenida() {
    const formasBase = ["gota", "frijol", "circulo", "cuadrado", "triangulo"];
    const coloresBase = ["#ff6b6b", "#4dd0e1", "#fdfd96", "#b19cd9", "#77DD77", "#ff9800", "#ffb347", "#a8e6cf"];
    const elementosBase = ["Biomutante", "Viral", "Cibernético", "Radiactivo", "Tóxico", "Sintético"];

    const obtenerClaveAleatoria = (dic) => {
        if (!dic || Object.keys(dic).length === 0) return "estandar";
        const keys = Object.keys(dic);
        return keys[Math.floor(Math.random() * keys.length)];
    };

    const shapeRandom = formasBase[Math.floor(Math.random() * formasBase.length)];
    const colorRandom = coloresBase[Math.floor(Math.random() * coloresBase.length)];
    const eyeRandom = obtenerClaveAleatoria(typeof dicOjos !== 'undefined' ? dicOjos : {});
    const mouthRandom = obtenerClaveAleatoria(typeof dicBocas !== 'undefined' ? dicBocas : {});
    const elementoRandom = elementosBase[Math.floor(Math.random() * elementosBase.length)];
    const recElementoRandom = elementosBase[Math.floor(Math.random() * elementosBase.length)];

    const prefijos = ["Neo", "Bio", "Geno", "Cyto", "Viro", "Rad", "Syn", "Evo", "Nexo", "Mut"];
    const sufijos = ["-X", "-Prime", "morph", "cyte", "tron", "plasm", "-7", "core", "gen", "-Z"];
    const nombreAleatorio = prefijos[Math.floor(Math.random() * prefijos.length)] + sufijos[Math.floor(Math.random() * sufijos.length)];

    const esGordo = Math.random() <= 0.001; 
    const rarezaInicial = esGordo ? "Legendario" : "Común";
    const statsV8 = window.generarStatsPorRareza(rarezaInicial);

    const miPrimerGeno = {
        id: window.generarNuevoID(),
        name: nombreAleatorio,
        rarity: rarezaInicial,
        element: elementoRandom, 
        body_shape: shapeRandom, 
        color: colorRandom,
        base_color: colorRandom, 
        eye_type: eyeRandom,
        mouth_type: mouthRandom,
        wing_type: "ninguno", 
        hat_type: "ninguno",
        level: 1,
        xp: 0,
        xpNeeded: 100,
        breedCount: 0,
        stats: statsV8, 
        hidden_gene: window.generarGenOculto(), // ✨ INYECCIÓN DEL GEN OCULTO V8.0
        scanned: false,
        genes: {
            cuerpo: { dom: shapeRandom, rec: formasBase[Math.floor(Math.random() * formasBase.length)] },
            ojos: { dom: eyeRandom, rec: obtenerClaveAleatoria(typeof dicOjos !== 'undefined' ? dicOjos : {}) },
            boca: { dom: mouthRandom, rec: obtenerClaveAleatoria(typeof dicBocas !== 'undefined' ? dicBocas : {}) },
            espalda: { dom: "ninguno", rec: "ninguno" },
            cabeza: { dom: "ninguno", rec: "ninguno" },
            afinidad: { dom: elementoRandom, rec: recElementoRandom } 
        }
    };

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "dna-startup-modal";
    modalOverlay.style = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 20, 30, 0.98); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; color: white; font-family: sans-serif;";

    const svgBioNucleo = typeof generarSvgGeno === 'function' ? generarSvgGeno({ isEgg: true, color: miPrimerGeno.color, id: "genesis" }) : '🧬';

    modalOverlay.innerHTML = `
        <div id="dna-capsule" style="width: 180px; height: 180px; cursor: pointer; transition: 0.3s; user-select: none;">
            ${svgBioNucleo}
        </div>
        <h2 id="dna-text" style="margin-top: 20px; font-weight: bold; color: #4dd0e1; text-align: center; text-transform: uppercase; letter-spacing: 2px;">¡Bio-Núcleo Encontrado!</h2>
        <p id="dna-subtext" style="color: #aaa; text-align: center; max-width: 300px; line-height: 1.5; margin-top: 10px; font-size: 14px;">Detectada secuencia de origen. Toca para sintetizar tu primer espécimen.</p>
        
        <div id="dna-result" style="display: none; flex-direction: column; align-items: center;">
            <div id="dna-svg-container" style="width: 200px; height: 200px; margin: 20px 0;"></div>
            <button id="btn-claim-geno" style="background: #4dd0e1; color: #1a2a36; border: none; padding: 15px 30px; font-size: 18px; font-weight: bold; border-radius: 12px; cursor: pointer; margin-top: 10px; box-shadow: 0 4px 15px rgba(77, 208, 225, 0.5); transition: 0.2s;">Integrar al Laboratorio</button>
        </div>
    `;

    const gameContainer = document.getElementById("game-container") || document.body;
    gameContainer.appendChild(modalOverlay);

    const capsule = document.getElementById("dna-capsule");
    const text = document.getElementById("dna-text");
    const subtext = document.getElementById("dna-subtext");
    const resultDiv = document.getElementById("dna-result");
    const svgContainer = document.getElementById("dna-svg-container");
    const btnClaim = document.getElementById("btn-claim-geno");

    capsule.onclick = () => {
        capsule.onclick = null; 
        capsule.style.animation = "propulsor 0.1s infinite alternate ease-in-out"; 
        text.innerText = "Sintetizando Bio-Núcleo...";
        subtext.innerText = "Secuenciando cadena de aminoácidos...";

        setTimeout(() => {
            capsule.style.display = "none";
            text.innerText = `¡${miPrimerGeno.name} Sintetizado!`;
            if(esGordo) subtext.innerHTML = "<span style='color: #ffcc00; font-weight:bold;'>¡EVENTO GORDO! Has obtenido un espécimen Legendario.</span>";
            else subtext.innerText = "Estable e integrado. Listo para la investigación.";

            let svg = typeof generarSvgGeno === 'function' ? generarSvgGeno(miPrimerGeno) : '';
            svg = svg.replace(/<svg[^>]*>/, '<svg width="100%" height="100%" viewBox="-20 0 200 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">');
            svgContainer.innerHTML = svg;
            resultDiv.style.display = "flex"; 
        }, 2500);
    };

    btnClaim.onclick = () => {
        window.miMascota = miPrimerGeno;
        
        if(!window.misGenos) window.misGenos = [];
        window.misGenos.push(miPrimerGeno);

        const pedestal = document.getElementById("geno-container");
        if (pedestal) {
            pedestal.style.display = "block";
            const svgPedestal = typeof generarSvgGeno === 'function' ? generarSvgGeno(miPrimerGeno) : '';
            pedestal.innerHTML = `<div class="geno-idle" style="color: ${miPrimerGeno.color}; top: 50%; left: 50%; display: flex; justify-content: center; align-items: center;">${svgPedestal}</div>`;
        }
        
        const nameEl = document.getElementById('geno-name');
        if (nameEl) nameEl.innerText = `${miPrimerGeno.name} #${miPrimerGeno.id}`;

        modalOverlay.remove();
        if(typeof window.actualizarPanelRPG === 'function') window.actualizarPanelRPG();
        if(typeof window.guardarProgreso === 'function') window.guardarProgreso();
    };
}