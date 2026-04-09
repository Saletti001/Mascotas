// =========================================
// app.js - CONTROLADOR PRINCIPAL Y NAVEGACIÓN
// =========================================

// BASE DE DATOS GLOBAL
window.misGenos = [
    { id: 1, name: "Geno Base 1", rarity: "Común", element: "🦠 Viral", shape: "gota", color: "#FFB6C1", reward: 50 },
    { id: 2, name: "Geno Base 2", rarity: "Común", element: "🧫 Sintético", shape: "frijol", color: "#ADD8E6", reward: 50 },
    { id: 3, name: "Geno Base 3", rarity: "Común", element: "⚙️ Cibernético", shape: "gota", color: "#D3D3D3", reward: 50 },
    { id: 4, name: "Geno Base 4", rarity: "Común", element: "🔥 Ígneo", shape: "frijol", color: "#ffcccb", reward: 50 },
    { id: 5, name: "Geno Base 5", rarity: "Común", element: "💧 Acuático", shape: "gota", color: "#e0ffff", reward: 50 },
    { id: 6, name: "Geno Falla", rarity: "Común", element: "🧪 Tóxico", shape: "frijol", color: "#98FB98", reward: 50 }
];

document.addEventListener("DOMContentLoaded", () => {
    
    // NAVEGACIÓN Y MENÚS
    const fabMenu = document.getElementById("fab-menu");
    const drawerMenu = document.getElementById("drawer-menu");
    const closeDrawer = document.getElementById("close-drawer");

    const screenRoom = document.getElementById("room-area");
    const screenArcade = document.getElementById("arcade-menu");
    const screenSanctuary = document.getElementById("sanctuary-screen");
    const screenAlchemy = document.getElementById("alchemy-screen");
    const screens = [screenRoom, screenArcade, screenSanctuary, screenAlchemy];

    // Abrir / Cerrar Menú Nexo
    if(fabMenu) fabMenu.addEventListener("click", () => drawerMenu.classList.remove("hidden"));
    if(closeDrawer) closeDrawer.addEventListener("click", () => drawerMenu.classList.add("hidden"));

    function goToScreen(targetScreen) {
        screens.forEach(s => s.classList.add("hidden"));
        targetScreen.classList.remove("hidden");
        if(drawerMenu) drawerMenu.classList.add("hidden"); 
        
        const panelStats = document.getElementById("geno-stats-panel");
        if(panelStats) panelStats.classList.add("hidden");
        
        if(fabMenu) fabMenu.classList.toggle("hidden", targetScreen !== screenRoom); 
    }

    // Botones "Volver"
    document.querySelectorAll(".btn-go-home").forEach(btn => {
        btn.addEventListener("click", () => goToScreen(screenRoom));
    });

    // Enrutadores del Menú Nexo
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
    if(btnSanctuary) {
        btnSanctuary.addEventListener("click", () => { 
            goToScreen(screenSanctuary); 
            if(window.renderizarSantuario) window.renderizarSantuario(); 
        });
    }

    const btnArcade = document.getElementById("btn-arcade");
    if(btnArcade) btnArcade.addEventListener("click", () => goToScreen(screenArcade));

    const btnAlchemy = document.getElementById("btn-alchemy");
    if(btnAlchemy) {
        btnAlchemy.addEventListener("click", () => { 
            goToScreen(screenAlchemy); 
            if(window.renderizarAlquimia) window.renderizarAlquimia(); 
        });
    }

    // HACKS DE DESARROLLADOR (Recursos iniciales)
    setTimeout(() => {
        if (window.miInventario) {
            window.miInventario.addItem({ id: "dna_scanner", name: "Escáner ADN", icon: "🧬", type: "consumible", maxStack: 20 }, 5);
            window.miInventario.addEssence(10000);
        }
        for(let i=0; i<5; i++) {
            window.misGenos.push({ id: 100+i, name: "Sujeto Raro", rarity: "Raro", element: "💧 Acuático", shape: "frijol", color: "#4169E1", reward: 100 });
            window.misGenos.push({ id: 200+i, name: "Sujeto Épico", rarity: "Épico", element: "🌌 Cósmico", shape: "estrella", color: "#8A2BE2", reward: 200 });
        }
    }, 500);

});