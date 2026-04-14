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
                
                // Generamos el SVG y forzamos su tamaño al 100% con un reemplazo rápido (RegEx)
                let svg = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '';
                svg = svg.replace(/<svg width="\d+" height="\d+"/, '<svg width="100%" height="100%"');
                
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
                        pedestal.innerHTML = `<div class="geno-idle" style="display: flex; justify-content: center; align-items: center; color: ${pColor};">${svgPedestal}</div>`;
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