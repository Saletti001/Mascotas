// =========================================
// app.js - CONTROLADOR PRINCIPAL Y NAVEGACIÓN
// =========================================

window.misGenos = [
    { id: 1, name: "Geno Base 1", rarity: "Común", element: "🦠 Viral", shape: "gota", color: "#FFB6C1", reward: 50 },
    { id: 2, name: "Geno Base 2", rarity: "Común", element: "🧫 Sintético", shape: "frijol", color: "#ADD8E6", reward: 50 }
];

document.addEventListener("DOMContentLoaded", () => {
    
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

    function goToScreen(targetScreen) {
        screens.forEach(s => { if(s) s.classList.add("hidden"); });
        if(targetScreen) targetScreen.classList.remove("hidden");
        if(drawerMenu) drawerMenu.classList.add("hidden"); 
        const panelStats = document.getElementById("geno-stats-panel");
        if(panelStats) panelStats.classList.add("hidden");
        if(fabMenu) fabMenu.classList.toggle("hidden", targetScreen !== screenRoom); 
    }

    document.querySelectorAll(".btn-go-home").forEach(btn => {
        btn.addEventListener("click", () => goToScreen(screenRoom));
    });

    // ENRUTADORES DEL MENÚ
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

    const btnSanctuary = document.getElementById("btn-sanctuary");
    if(btnSanctuary) btnSanctuary.addEventListener("click", () => { goToScreen(screenSanctuary); if(window.renderizarSantuario) window.renderizarSantuario(); });

    const btnArcade = document.getElementById("btn-arcade");
    if(btnArcade) btnArcade.addEventListener("click", () => goToScreen(screenArcade));

    const btnAlchemy = document.getElementById("btn-alchemy");
    if(btnAlchemy) btnAlchemy.addEventListener("click", () => { goToScreen(screenAlchemy); if(window.renderizarAlquimia) window.renderizarAlquimia(); });

    const btnBreeding = document.getElementById("btn-breeding");
    if(btnBreeding) btnBreeding.addEventListener("click", () => { goToScreen(screenBreeding); if(window.iniciarSelectorCrianza) window.iniciarSelectorCrianza(); });

    const btnColiseum = document.getElementById("btn-coliseum");
    if(btnColiseum) btnColiseum.addEventListener("click", () => { goToScreen(screenColiseum); if(window.iniciarColiseo) window.iniciarColiseo(); });

    const btnMarket = document.getElementById("btn-market");
    if(btnMarket) btnMarket.addEventListener("click", () => { goToScreen(screenMarket); if(window.iniciarMercado) window.iniciarMercado(); });

    // ==========================================
    // NUEVO ENRUTADOR: BOTÓN DE MÚSICA
    // ==========================================
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
    // ==========================================

    setTimeout(() => {
        if(!window.miWallet) window.miWallet = { pol: 10.0 };
        if (window.miInventario) window.miInventario.addItem({ id: "dna_scanner", name: "Escáner ADN", icon: "🧬", type: "consumible", maxStack: 20 }, 5);
    }, 500);
});

// =========================================
// SISTEMA DE PRUEBA: VISOR DE FORMAS BASE
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnShowGenos = document.getElementById('btn-show-genos');
    const modalSwap = document.getElementById('geno-swap-modal');
    const btnCloseSwap = document.getElementById('close-swap-modal');
    const gridSwap = document.getElementById('geno-swap-grid');
    const pedestal = document.getElementById('geno-container');

    // Las 6 formas base para probar
    const genosDePrueba = [
        { shape: "frijol", color: "#77DD77", face: "cute", name: "Frijol Base" },
        { shape: "gota", color: "#4dd0e1", face: "angry", name: "Gota Agua" },
        { shape: "circulo", color: "#fdfd96", face: "sleepy", name: "Círculo Luz" },
        { shape: "cuadrado", color: "#b19cd9", face: "surprised", name: "Cubo Morado" },
        { shape: "triangulo", color: "#ff6b6b", face: "angry", name: "Triángulo Fuego" },
        { shape: "hongo", color: "#2E8B57", face: "cute", name: "Hongo Gen-0" } // Deep Teal
    ];

    // Abrir el modal
    if(btnShowGenos) {
        btnShowGenos.addEventListener('click', () => {
            modalSwap.classList.remove('hidden');
            gridSwap.innerHTML = ''; // Limpiar

            // Crear las tarjetas para cada Geno
            genosDePrueba.forEach(geno => {
                const card = document.createElement('div');
                card.style.cssText = "background: #1a2a36; border: 1px solid #4dd0e1; border-radius: 10px; padding: 10px; cursor: pointer; text-align: center; transition: transform 0.2s;";
                
                // Generar el SVG usando nuestro motor
                const svgCode = generarSvgGeno({
                    body_shape: geno.shape,
                    base_color: geno.color,
                    face: geno.face
                });

                card.innerHTML = `
                    <div style="width: 80px; height: 80px; margin: 0 auto;">${svgCode}</div>
                    <div style="font-size: 11px; font-weight: bold; margin-top: 5px; color: #fff;">${geno.name}</div>
                `;

                // Al hacer clic, cambiar el Geno principal
                card.addEventListener('click', () => {
                    // Ponerlo en el pedestal central
                    pedestal.innerHTML = `<div class="geno-idle">${svgCode}</div>`;
                    // Cambiar el nombre en los Stats
                    document.getElementById('geno-name').innerText = geno.name;
                    // Cerrar modal
                    modalSwap.classList.add('hidden');
                });
                
                // Efecto hover
                card.addEventListener('mouseover', () => card.style.transform = 'scale(1.05)');
                card.addEventListener('mouseout', () => card.style.transform = 'scale(1)');

                gridSwap.appendChild(card);
            });
        });
    }

    // Cerrar modal
    if(btnCloseSwap) {
        btnCloseSwap.addEventListener('click', () => modalSwap.classList.add('hidden'));
    }
});

// =========================================
// SISTEMA DE COLECCIÓN DE GENOS (ALINEACIÓN PERFECTA Y ESCALADO)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnShowGenos = document.getElementById('btn-show-genos');
    const modalSwap = document.getElementById('geno-swap-modal');
    const btnCloseSwap = document.getElementById('close-swap-modal');
    const gridSwap = document.getElementById('geno-swap-grid');
    const pedestal = document.getElementById('geno-container');

    const genosDePrueba = [
        { shape: "frijol", color: "#77DD77", face: "cute", name: "Frijol Base" },
        { shape: "gota", color: "#4dd0e1", face: "angry", name: "Gota Agua" },
        { shape: "circulo", color: "#fdfd96", face: "sleepy", name: "Círculo Luz" },
        { shape: "cuadrado", color: "#b19cd9", face: "surprised", name: "Cubo Morado" },
        { shape: "triangulo", color: "#ff6b6b", face: "angry", name: "Triángulo Fuego" },
        { shape: "hongo", color: "#2E8B57", face: "cute", name: "Hongo Gen-0" } 
    ];

    if(btnShowGenos && modalSwap) {
        btnShowGenos.addEventListener('click', () => {
            modalSwap.classList.remove('hidden');
            gridSwap.innerHTML = ''; 

            genosDePrueba.forEach(geno => {
                const card = document.createElement('div');
                card.style.cssText = "background: #1a2a36; border: 1px solid #4dd0e1; border-radius: 10px; padding: 10px; cursor: pointer; text-align: center; transition: transform 0.2s;";
                
                let svgCodeMenu = generarSvgGeno({
                    body_shape: geno.shape,
                    base_color: geno.color,
                    face: geno.face
                });

                // ¡LA MAGIA ESTÁ AQUÍ! 
                // Forzamos la etiqueta principal del SVG a usar el 100% del contenedor en lugar de los 190px fijos.
                svgCodeMenu = svgCodeMenu.replace(/<svg width="\d+" height="\d+"/, '<svg width="100%" height="100%"');

                card.innerHTML = `
                    <div style="width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">${svgCodeMenu}</div>
                    <div style="font-size: 11px; font-weight: bold; margin-top: 8px; color: #fff;">${geno.name}</div>
                `;

                card.addEventListener('click', () => {
                    const svgCodePedestal = generarSvgGeno({
                        body_shape: geno.shape,
                        base_color: geno.color,
                        face: geno.face
                    });

                    if(pedestal) pedestal.innerHTML = `<div class="geno-idle" style="top: 50%; left: 50%; display: flex; justify-content: center; align-items: center;">${svgCodePedestal}</div>`;
                    
                    const nameEl = document.getElementById('geno-name');
                    if(nameEl) nameEl.innerText = geno.name;
                    
                    modalSwap.classList.add('hidden');
                });
                
                card.addEventListener('mouseover', () => {
                    card.style.transform = 'scale(1.05)';
                    card.style.borderColor = '#fff';
                });
                card.addEventListener('mouseout', () => {
                    card.style.transform = 'scale(1)';
                    card.style.borderColor = '#4dd0e1';
                });

                gridSwap.appendChild(card);
            });
        });
    }

    if(btnCloseSwap && modalSwap) {
        btnCloseSwap.addEventListener('click', () => {
            modalSwap.classList.add('hidden');
        });
    }
});