// =========================================
// BreedingManager.js - ALGORITMO GENÉTICO E INCUBADORA
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    
    let padre1 = null;
    let padre2 = null;
    let seleccionandoPara = 1; 

    const slot1 = document.getElementById("slot-parent-1");
    const slot2 = document.getElementById("slot-parent-2");
    const btnBreeding = document.getElementById("btn-start-breeding");
    const selectorContainer = document.getElementById("breeding-selector");
    const listContainer = document.getElementById("breeding-list");

    // Función para actualizar la UI de POL
    function actualizarPolUI() {
        const polText = document.getElementById("pol-amount");
        if(polText && window.miWallet) {
            polText.innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
        }
    }

    function normalizarGenos() {
        window.misGenos.forEach(g => {
            if(!g.level) g.level = 10; 
            if(g.breedCount === undefined) g.breedCount = 0;
            if(g.generation === undefined) g.generation = 0;
            if(!g.stats) g.stats = { hp: 50, atk: 15, spd: 15, luk: 15 };
        });
        if(window.miMascota && window.miMascota.breedCount === undefined) window.miMascota.breedCount = 0;
    }

    window.iniciarSelectorCrianza = function() {
        padre1 = null;
        padre2 = null;
        actualizarSlots();
        selectorContainer.classList.add("hidden");
        window.renderizarIncubadora(); // Mostrar huevos
        actualizarPolUI();
    }

    function actualizarSlots() {
        normalizarGenos();
        
        [slot1, slot2].forEach((slot, index) => {
            const padre = index === 0 ? padre1 : padre2;
            if (padre) {
                let color = padre.color || padre.visual_genes?.base_color || "#ccc";
                let shape = padre.shape || padre.visual_genes?.body_shape || "gota";
                slot.innerHTML = generarSvgGeno({ body_shape: shape, base_color: color, isEgg: false });
                const svg = slot.querySelector("svg");
                if(svg) { svg.style.width = "50px"; svg.style.height = "50px"; }
                slot.style.border = "2px solid #E91E63";
                slot.style.background = "#fce4ec";
            } else {
                slot.innerHTML = '<span style="color: #E91E63; font-size: 24px;">+</span>';
                slot.style.border = "2px dashed #E91E63";
                slot.style.background = "#fff";
            }
        });

        const tieneEsencia = window.miInventario && window.miInventario.vitalEssence >= 500;
        btnBreeding.disabled = !(padre1 && padre2 && tieneEsencia);
    }

    function abrirSelector(numPadre) {
        seleccionandoPara = numPadre;
        selectorContainer.classList.remove("hidden");
        listContainer.innerHTML = "";

        const todosMisGenos = [window.miMascota, ...window.misGenos].filter(g => g !== undefined);
        const genosValidos = todosMisGenos.filter(g => {
            const yaSeleccionado = (padre1 && padre1.id === g.id) || (padre2 && padre2.id === g.id);
            return g.level >= 10 && g.breedCount < 7 && !yaSeleccionado && !g.isEgg; // No puedes criar con huevos
        });

        if (genosValidos.length === 0) {
            listContainer.innerHTML = '<div style="font-size: 11px; color: #d9534f;">No hay Genos aptos (Requiere Nivel 10+ y crías disponibles).</div>';
            return;
        }

        genosValidos.forEach(geno => {
            const btn = document.createElement("div");
            btn.style = "padding: 5px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; background: #fafafa; font-size: 11px; display: flex; flex-direction: column; align-items: center; width: 60px;";
            
            let color = geno.color || geno.visual_genes?.base_color || "#ccc";
            let shape = geno.shape || geno.visual_genes?.body_shape || "gota";
            
            btn.innerHTML = `
                ${generarSvgGeno({ body_shape: shape, base_color: color, isEgg: false })}
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center;">Lv.${geno.level}</span>
                <span style="color: #E91E63;">${7 - geno.breedCount} crías</span>
            `;
            
            const svg = btn.querySelector("svg");
            if(svg) { svg.style.width = "30px"; svg.style.height = "30px"; }

            btn.addEventListener("click", () => {
                if(seleccionandoPara === 1) padre1 = geno;
                if(seleccionandoPara === 2) padre2 = geno;
                selectorContainer.classList.add("hidden");
                actualizarSlots();
            });
            listContainer.appendChild(btn);
        });
    }

    if(slot1) slot1.addEventListener("click", () => abrirSelector(1));
    if(slot2) slot2.addEventListener("click", () => abrirSelector(2));

    if(btnBreeding) {
        btnBreeding.addEventListener("click", () => {
            if(!padre1 || !padre2) return;

            window.miInventario.addEssence(-500); 
            padre1.breedCount++;
            padre2.breedCount++;

            btnBreeding.disabled = true;
            btnBreeding.innerText = "Incubando...";
            
            let toggle = false;
            const anim = setInterval(() => {
                toggle = !toggle;
                slot1.style.transform = toggle ? "scale(1.1)" : "scale(0.9)";
                slot2.style.transform = !toggle ? "scale(1.1)" : "scale(0.9)";
            }, 150);

            setTimeout(() => {
                clearInterval(anim);
                slot1.style.transform = "scale(1)";
                slot2.style.transform = "scale(1)";

                const genHijo = Math.max(padre1.generation || 0, padre2.generation || 0) + 1;
                const shapeHijo = Math.random() > 0.5 ? (padre1.shape || padre1.visual_genes?.body_shape || "gota") : (padre2.shape || padre2.visual_genes?.body_shape || "frijol");
                const colorHijo = Math.random() > 0.5 ? (padre1.color || padre1.visual_genes?.base_color || "#aaa") : (padre2.color || padre2.visual_genes?.base_color || "#bbb");
                
                const mutacion = () => (Math.random() * 0.2) + 0.9;
                const statsHijo = {
                    hp: Math.floor(((padre1.stats.hp + padre2.stats.hp) / 2) * mutacion()),
                    atk: Math.floor(((padre1.stats.atk + padre2.stats.atk) / 2) * mutacion()),
                    spd: Math.floor(((padre1.stats.spd + padre2.stats.spd) / 2) * mutacion()),
                    luk: Math.floor(((padre1.stats.luk + padre2.stats.luk) / 2) * mutacion())
                };

                // CREAR EL HUEVO
                const tiempoIncubacion = 120000; // 2 Minutos para pruebas
                const hijo = {
                    id: Date.now(),
                    name: "Huevo Misterioso",
                    isEgg: true, // <--- ESTADO DE HUEVO
                    hatchTime: Date.now() + tiempoIncubacion, // <--- TEMPORIZADOR
                    generation: genHijo,
                    breedCount: 0,
                    level: 1,
                    xp: 0,
                    xpNeeded: 100,
                    rarity: padre1.rarity, 
                    element: padre1.element,
                    shape: shapeHijo,
                    color: colorHijo,
                    stats: statsHijo,
                    reward: 100
                };

                window.misGenos.push(hijo);
                btnBreeding.innerText = "Iniciar Crianza";
                window.iniciarSelectorCrianza(); 
            }, 2000);
        });
    }

    // ==========================================
    // SISTEMA DE INCUBADORA Y MICROPAGOS
    // ==========================================
    window.renderizarIncubadora = function() {
        const grid = document.getElementById("incubator-grid");
        if(!grid) return;
        
        const huevos = window.misGenos.filter(g => g.isEgg);
        grid.innerHTML = "";

        if(huevos.length === 0) {
            grid.innerHTML = '<div style="margin: auto; color: #999; font-size: 12px; font-style: italic;">La incubadora está vacía.</div>';
            return;
        }

        huevos.forEach(huevo => {
            const card = document.createElement("div");
            card.style = "min-width: 90px; background: #fff; border: 1px solid #f8bbd0; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: relative;";
            
            // Dibujar el Huevo
            card.innerHTML = `
                ${generarSvgGeno({ isEgg: true })}
                <div id="timer-${huevo.id}" style="font-size: 11px; font-weight: bold; color: #d81b60; margin-top: 5px;">Calculando...</div>
                <button id="btn-skip-${huevo.id}" style="margin-top: 5px; font-size: 10px; background: #8A2BE2; color: white; border: none; border-radius: 4px; padding: 3px 6px; cursor: pointer;">⚡ 0.5 POL</button>
            `;
            
            const svg = card.querySelector("svg");
            if(svg) { svg.style.width = "40px"; svg.style.height = "40px"; }

            // Lógica del Micropago (Acelerador POL)
            const btnSkip = card.querySelector(`#btn-skip-${huevo.id}`);
            btnSkip.addEventListener("click", () => {
                if(window.miWallet && window.miWallet.pol >= 0.5) {
                    window.miWallet.pol -= 0.5; // Cobrar POL
                    actualizarPolUI();
                    
                    // Forzar Eclosión
                    huevo.isEgg = false;
                    alert(`⚡ ¡Acelerador Activado!\nEl Huevo eclosionó instantáneamente.\nBienvenido al mundo: [Gen ${huevo.generation}].`);
                    window.renderizarIncubadora();
                } else {
                    alert("No tienes suficiente POL en tu billetera conectada.");
                }
            });

            grid.appendChild(card);
        });
    }

    // Bucle que verifica los tiempos de los huevos cada segundo
    setInterval(() => {
        const huevos = window.misGenos.filter(g => g.isEgg);
        let requiereActualizacion = false;

        huevos.forEach(huevo => {
            const restante = huevo.hatchTime - Date.now();
            const label = document.getElementById(`timer-${huevo.id}`);
            
            if (restante <= 0) {
                // El tiempo terminó naturalmente
                huevo.isEgg = false;
                requiereActualizacion = true;
                alert(`🐣 ¡Atención!\nUn huevo en la incubadora acaba de eclosionar.`);
            } else {
                // Actualizar el texto del temporizador
                if(label) {
                    const min = Math.floor(restante / 60000);
                    const sec = Math.floor((restante % 60000) / 1000);
                    label.innerText = `${min}m ${sec}s`;
                }
            }
        });

        if(requiereActualizacion) window.renderizarIncubadora();
    }, 1000);
});