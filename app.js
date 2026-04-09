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