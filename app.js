// =========================================
// app.js - CONTROLADOR PRINCIPAL Y NAVEGACIÓN
// =========================================

window.misGenos = [
    { id: 1, name: "Gota de Agua", rarity: "Épico", element: "Biomutante", body_shape: "gota", color: "#4dd0e1", base_color: "#4dd0e1", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 2, name: "Frijol Base", rarity: "Épico", element: "Biomutante", body_shape: "frijol", color: "#77DD77", base_color: "#77DD77", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 3, name: "Círculo Luz", rarity: "Épico", element: "Biomutante", body_shape: "circulo", color: "#fdfd96", base_color: "#fdfd96", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 4, name: "Cubo Morado", rarity: "Épico", element: "Biomutante", body_shape: "cuadrado", color: "#b19cd9", base_color: "#b19cd9", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 5, name: "Triángulo Fuego", rarity: "Épico", element: "Biomutante", body_shape: "triangulo", color: "#ff6b6b", base_color: "#ff6b6b", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 6, name: "Hongo Gen-0", rarity: "Épico", element: "Biomutante", body_shape: "hongo", color: "#2E8B57", base_color: "#2E8B57", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 7, name: "Estrella Nova", rarity: "Épico", element: "Biomutante", body_shape: "estrella", color: "#ffeb3b", base_color: "#ffeb3b", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 8, name: "Pentágono Geo", rarity: "Épico", element: "Biomutante", body_shape: "pentagono", color: "#e91e63", base_color: "#e91e63", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 9, name: "Nube Tóxica", rarity: "Épico", element: "Biomutante", body_shape: "nube", color: "#00bcd4", base_color: "#00bcd4", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 10, name: "Chili Picante", rarity: "Épico", element: "Biomutante", body_shape: "chili", color: "#f44336", base_color: "#f44336", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 },
    { id: 11, name: "Rayo Veloz", rarity: "Épico", element: "Biomutante", body_shape: "rayo", color: "#ff9800", base_color: "#ff9800", eye_type: "estandar", mouth_type: "colmillos", wing_type: "ninguno", hat_type: "ninguno", level: 10, breedCount: 0 }
];

window.miMascota = window.misGenos[0]; // Fuerza a la Gota a ser tu mascota inicial

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
                
                // 🛠️ FIX: Forzamos al SVG a encajar perfectamente en el centro de la tarjeta pequeña
                let svg = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '';
                svg = svg.replace(/<svg[^>]*>/, '<svg width="100%" height="100%" viewBox="-20 0 200 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">');
                
                card.innerHTML = `
                    <div style="width: 70px; height: 70px; color: ${pColor}; display: flex; justify-content: center; align-items: center;">
                        ${svg}
                    </div>
                    <span style="color: white; font-weight: bold; font-size: 12px; margin-top: 10px; text-align: center;">${geno.name || 'Sujeto'}</span>
                `;
                
                // Al hacer clic, se actualiza el laboratorio
                // Al hacer clic, se actualiza el laboratorio
                card.onclick = () => {
                    window.miMascota = geno;
                    
                    if (pedestal) {
                        const svgPedestal = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '';
                        // ✅ Limpieza total: Solo le pasamos tu clase original y el color. 
                        // Tu CSS se encargará de centrarlo y animarlo suavemente como al inicio.
                        // ✅ VERSIÓN LIMPIA: Sin forzar el centro vertical
                        pedestal.innerHTML = `<div class="geno-idle" style="color: ${pColor}; width: 100%; text-align: center; margin-top: auto;">${svgPedestal}</div>`;
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