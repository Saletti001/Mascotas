// =========================================
// app.js - CONTROLADOR PRINCIPAL Y NAVEGACIÓN
// =========================================

// 🎒 INVENTARIO VACÍO: Simulamos a un jugador nuevo.
window.misGenos = []; 
window.miMascota = null; 

document.addEventListener("DOMContentLoaded", () => {
    
    // ✨ COMPROBAR JUGADOR NUEVO: Si no tiene Genos, iniciamos la secuencia de ADN
    setTimeout(() => {
        if (window.misGenos.length === 0 && !window.miMascota) {
            iniciarSecuenciaBienvenida();
        }
    }, 500);

    const fabMenu = document.getElementById("fab-menu");
    const drawerMenu = document.getElementById("drawer-menu");
    const closeDrawer = document.getElementById("close-drawer");

    // REFERENCIAS A LAS PANTALLAS
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

    // FUNCIÓN DE NAVEGACIÓN GLOBAL
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

    // ENRUTADORES DEL MENÚ NEXO
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
                // Llamadas a funciones específicas de cada pantalla si existen
                if(btnId === 'btn-sanctuary' && window.renderizarSantuario) window.renderizarSantuario();
                if(btnId === 'btn-alchemy' && window.renderizarAlquimia) window.renderizarAlquimia();
                if(btnId === 'btn-breeding' && window.iniciarSelectorCrianza) window.iniciarSelectorCrianza();
                if(btnId === 'btn-coliseum' && window.iniciarColiseo) window.iniciarColiseo();
                if(btnId === 'btn-market' && window.iniciarMercado) window.iniciarMercado();
            };
        }
    }

    // BOTÓN DE ALIMENTAR (MANZANA)
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

    // BOTÓN DE MÚSICA
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

    // REGALOS INICIALES DEL JUEGO
    setTimeout(() => {
        if(!window.miWallet) window.miWallet = { pol: 10.0 };
        if (window.miInventario) window.miInventario.addItem({ id: "dna_scanner", name: "Escáner ADN", icon: "🧬", type: "consumible", maxStack: 20 }, 5);
    }, 500);
});

// =========================================
// VISOR DE GENOS MAESTRO (INVENTARIO)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const btnMisGenosMain = document.getElementById("btn-show-genos");
    const modalSwap = document.getElementById("geno-swap-modal");
    const btnCloseSwap = document.getElementById("close-swap-modal");
    const gridSwap = document.getElementById("geno-swap-grid");
    const pedestal = document.getElementById("geno-container");

    if (btnMisGenosMain) {
        btnMisGenosMain.addEventListener("click", () => {
            if (!gridSwap || !modalSwap) return;
            
            gridSwap.innerHTML = ""; // Limpiamos la cuadrícula
            
            // Juntamos a la mascota actual y a los Genos almacenados
            const todos = [];
            if (window.miMascota) todos.push(window.miMascota);
            if (window.misGenos) todos.push(...window.misGenos);

            if (todos.length === 0) {
                gridSwap.innerHTML = '<div style="color: #ccc; grid-column: span 2; text-align: center;">No tienes Genos en tu base de datos.</div>';
            }

            todos.forEach(geno => {
                if (geno.isEgg) return; // Ocultamos los huevos de este menú

                const card = document.createElement("div");
                card.style = "background: #1a2a36; border: 1px solid #4dd0e1; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.3);";
                
                card.onmouseover = () => card.style.boxShadow = "0 0 15px rgba(77, 208, 225, 0.4)";
                card.onmouseout = () => card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

                const pColor = geno.color || geno.base_color || "#ccc";
                
                let svg = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '';
                svg = svg.replace(/<svg[^>]*>/, '<svg width="100%" height="100%" viewBox="-20 0 200 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">');
                
                card.innerHTML = `
                    <div style="width: 70px; height: 70px; color: ${pColor}; display: flex; justify-content: center; align-items: center;">
                        ${svg}
                    </div>
                    <span style="color: white; font-weight: bold; font-size: 12px; margin-top: 10px; text-align: center;">${geno.name || 'Sujeto'}</span>
                `;
                
                // Al hacer clic, se actualiza el laboratorio
                card.onclick = () => {
                    window.miMascota = geno;
                    
                    if (pedestal) {
                        const svgPedestal = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '';
                        
                        // Esto le devuelve sus coordenadas al centro exacto sin chocar con la animación de tu CSS
                        pedestal.innerHTML = `<div class="geno-idle" style="color: ${pColor}; top: 50%; left: 50%; display: flex; justify-content: center; align-items: center;">${svgPedestal}</div>`;
                    }
                    
                    const nameEl = document.getElementById('geno-name');
                    if (nameEl) nameEl.innerText = geno.name || 'Sujeto';
                    
                    if(typeof window.actualizarPanelRPG === 'function') window.actualizarPanelRPG();
                    modalSwap.classList.add("hidden");
                };
                
                gridSwap.appendChild(card);
            });
            
            modalSwap.classList.remove("hidden");
        });
    }

    if (btnCloseSwap && modalSwap) {
        btnCloseSwap.addEventListener("click", () => {
            modalSwap.classList.add("hidden");
        });
    }
});

// =========================================
// SECUENCIA DE INICIO: LA CÁPSULA DE ADN
// =========================================
function iniciarSecuenciaBienvenida() {
    // 1. DICCIONARIO LIMITADO: Solo las 5 formas base para el primer Geno
    const formasBase = ["gota", "frijol", "circulo", "cuadrado", "triangulo"];
    const coloresBase = ["#ff6b6b", "#4dd0e1", "#fdfd96", "#b19cd9", "#77DD77", "#ff9800", "#ffb347", "#a8e6cf"];

    // Función para sacar una cara o boca aleatoria de tus diccionarios globales
    const obtenerClaveAleatoria = (dic) => {
        if (!dic || Object.keys(dic).length === 0) return "estandar";
        const keys = Object.keys(dic);
        return keys[Math.floor(Math.random() * keys.length)];
    };

    // 2. CREAMOS EL GENO (Totalmente aleatorio pero legal)
    const miPrimerGeno = {
        id: Date.now(), // Usamos la fecha como ID único irrompible
        name: "Sujeto Alfa", // Nombre por defecto
        rarity: "Común",
        element: "Biomutante",
        body_shape: formasBase[Math.floor(Math.random() * formasBase.length)], // Solo de las 5 base
        color: coloresBase[Math.floor(Math.random() * coloresBase.length)],
        base_color: "", 
        eye_type: obtenerClaveAleatoria(typeof dicOjos !== 'undefined' ? dicOjos : {}),
        mouth_type: obtenerClaveAleatoria(typeof dicBocas !== 'undefined' ? dicBocas : {}),
        wing_type: "ninguno", // Un inicial nace sin accesorios
        hat_type: "ninguno",
        level: 1,
        breedCount: 0
    };
    miPrimerGeno.base_color = miPrimerGeno.color;

    // 3. CREAMOS LA INTERFAZ VISUAL DE LA CÁPSULA (Pantalla negra por encima de todo)
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "dna-startup-modal";
    modalOverlay.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(10, 20, 30, 0.98); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; color: white; font-family: sans-serif;";

    modalOverlay.innerHTML = `
        <div id="dna-capsule" style="font-size: 100px; animation: respirar 2s infinite; cursor: pointer; transition: 0.3s; user-select: none;">🧬</div>
        <h2 id="dna-text" style="margin-top: 30px; font-weight: bold; color: #4dd0e1; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Código de ADN Encontrado</h2>
        <p id="dna-subtext" style="color: #aaa; text-align: center; max-width: 350px; line-height: 1.5; margin-top: 10px;">Toca la secuencia para sintetizar a tu primer Geno.</p>
        
        <div id="dna-result" style="display: none; flex-direction: column; align-items: center;">
            <div id="dna-svg-container" style="width: 200px; height: 200px; margin: 20px 0;"></div>
            <button id="btn-claim-geno" style="background: #4dd0e1; color: #1a2a36; border: none; padding: 15px 30px; font-size: 18px; font-weight: bold; border-radius: 12px; cursor: pointer; margin-top: 10px; box-shadow: 0 4px 15px rgba(77, 208, 225, 0.5); transition: 0.2s;">Integrar al Laboratorio</button>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // 4. LÓGICA DE LA ANIMACIÓN Y EL BOTÓN
    const capsule = document.getElementById("dna-capsule");
    const text = document.getElementById("dna-text");
    const subtext = document.getElementById("dna-subtext");
    const resultDiv = document.getElementById("dna-result");
    const svgContainer = document.getElementById("dna-svg-container");
    const btnClaim = document.getElementById("btn-claim-geno");

    // Efecto hover para el botón
    btnClaim.onmouseover = () => btnClaim.style.transform = "scale(1.05)";
    btnClaim.onmouseout = () => btnClaim.style.transform = "scale(1)";

    // Al hacer clic en el ADN
    capsule.onclick = () => {
        capsule.onclick = null; // Prevenir doble clic
        
        // Animación de "cargando" (reusamos la animación de las llamas de tu SVG)
        capsule.style.animation = "propulsor 0.1s infinite alternate ease-in-out"; 
        text.innerText = "Sintetizando...";
        subtext.innerText = "Combinando biomoléculas...";

        // Esperamos 2 segundos para dar suspenso
        setTimeout(() => {
            capsule.style.display = "none";
            text.innerText = "¡Tu primer Geno ha nacido!";
            subtext.innerText = "Cuidalo bien y llévalo a la gloria.";

            // Renderizamos al Geno usando tu SVGEngine
            let svg = typeof generarSvgGeno === 'function' ? generarSvgGeno(miPrimerGeno) : '';
            svg = svg.replace(/<svg[^>]*>/, '<svg width="100%" height="100%" viewBox="-20 0 200 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">');
            svgContainer.innerHTML = svg;
            
            resultDiv.style.display = "flex"; // Mostramos al Geno
        }, 2000);
    };

    // Al hacer clic en "Integrar al Laboratorio"
    btnClaim.onclick = () => {
        // 1. Guardamos el Geno en la Base de Datos / Inventario
        window.misGenos.push(miPrimerGeno);
        window.miMascota = miPrimerGeno;

        // 2. Lo dibujamos en el Pedestal de tu pantalla principal
        const pedestal = document.getElementById("geno-container");
        if (pedestal) {
            const svgPedestal = typeof generarSvgGeno === 'function' ? generarSvgGeno(miPrimerGeno) : '';
            pedestal.innerHTML = `<div class="geno-idle" style="color: ${miPrimerGeno.color}; top: 50%; left: 50%; display: flex; justify-content: center; align-items: center;">${svgPedestal}</div>`;
        }
        
        // 3. Actualizamos el nombre en pantalla
        const nameEl = document.getElementById('geno-name');
        if (nameEl) nameEl.innerText = miPrimerGeno.name;

        // 4. Destruimos la pantalla de bienvenida y el jugador empieza el juego
        modalOverlay.remove();
        if(typeof window.actualizarPanelRPG === 'function') window.actualizarPanelRPG();
    };
}