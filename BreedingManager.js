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

    function actualizarPolUI() {
        const polText = document.getElementById("pol-amount");
        if(polText && window.miWallet) {
            polText.innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
        }
    }

    function normalizarGenos() {
        if(!window.misGenos) window.misGenos = [];
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
        if(selectorContainer) selectorContainer.classList.add("hidden");
        window.renderizarIncubadora(); 
        actualizarPolUI();
    }

    function actualizarSlots() {
        normalizarGenos();
        
        [slot1, slot2].forEach((slot, index) => {
            if(!slot) return;
            const padre = index === 0 ? padre1 : padre2;
            if (padre) {
                const pColor = padre.color || padre.visual_genes?.base_color || padre.base_color || "#ccc";
                const pShape = (padre.genes && padre.genes.cuerpo) ? padre.genes.cuerpo.dom : (padre.shape || padre.visual_genes?.body_shape || padre.body_shape || "gota");
                const pWing = (padre.genes && padre.genes.espalda) ? padre.genes.espalda.dom : (padre.wing_type || "ninguno");

                slot.innerHTML = typeof generarSvgGeno === 'function' 
                    ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false })
                    : '<span>Geno</span>';
                
                const svg = slot.querySelector("svg");
                if(svg) { svg.style.width = "50px"; svg.style.height = "50px"; }
                
                // Estilo "Tech" cuando HAY un Geno
                slot.style.border = "2px solid #00d2ff";
                slot.style.background = "#0f172a";
                slot.style.boxShadow = "0 0 15px rgba(0, 210, 255, 0.2)";
            } else {
                // Estilo "Tech" cuando está VACÍO
                slot.innerHTML = '<span style="color: #00d2ff; font-size: 28px;">+</span>';
                slot.style.border = "2px dashed #00d2ff";
                slot.style.background = "#1e293b";
                slot.style.boxShadow = "inset 0 0 10px rgba(0,210,255,0.1)";
            }
        });

        let tieneEsencia = true; 
        if (window.miInventario && typeof window.miInventario.vitalEssence !== 'undefined') {
            tieneEsencia = window.miInventario.vitalEssence >= 500;
        }

        if(btnBreeding) {
            btnBreeding.disabled = !(padre1 && padre2 && tieneEsencia);
            if(!btnBreeding.disabled) {
                btnBreeding.style.opacity = "1";
                btnBreeding.style.cursor = "pointer";
            } else {
                btnBreeding.style.opacity = "0.5";
                btnBreeding.style.cursor = "not-allowed";
            }
        }
    }

    function abrirSelector(numPadre) {
        seleccionandoPara = numPadre;
        if(selectorContainer) selectorContainer.classList.remove("hidden");
        if(listContainer) listContainer.innerHTML = "";

        const todosMisGenos = [];
        if(window.miMascota) todosMisGenos.push(window.miMascota);
        if(window.misGenos) todosMisGenos.push(...window.misGenos);
        
        const genosValidos = todosMisGenos.filter(g => {
            if(!g) return false;
            const yaSeleccionado = (padre1 && padre1.id === g.id) || (padre2 && padre2.id === g.id);
            return g.level >= 10 && g.breedCount < 7 && !yaSeleccionado && !g.isEgg;
        });

        if (genosValidos.length === 0) {
            if(listContainer) listContainer.innerHTML = '<div style="font-size: 11px; color: #ef4444; width:100%; text-align:center;">No hay Genos aptos en la base de datos.</div>';
            return;
        }

        genosValidos.forEach(geno => {
            const btn = document.createElement("div");
            btn.style = "padding: 8px; border: 1px solid #334155; border-radius: 8px; cursor: pointer; background: #1e293b; font-size: 11px; display: flex; flex-direction: column; align-items: center; width: 65px; transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.3);";
            
            btn.onmouseover = () => btn.style.borderColor = "#00d2ff";
            btn.onmouseout = () => btn.style.borderColor = "#334155";

            const pColor = geno.color || geno.visual_genes?.base_color || geno.base_color || "#ccc";
            const pShape = (geno.genes && geno.genes.cuerpo) ? geno.genes.cuerpo.dom : (geno.shape || geno.visual_genes?.body_shape || geno.body_shape || "gota");
            const pWing = (geno.genes && geno.genes.espalda) ? geno.genes.espalda.dom : (geno.wing_type || "ninguno");

            btn.innerHTML = `
                ${typeof generarSvgGeno === 'function' ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false }) : ''}
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center; color: #fff; margin-top: 4px;">Lv.${geno.level}</span>
                <span style="color: #00d2ff; font-weight: bold;">${7 - (geno.breedCount||0)} crías</span>
            `;
            
            const svg = btn.querySelector("svg");
            if(svg) { svg.style.width = "35px"; svg.style.height = "35px"; }

            btn.addEventListener("click", () => {
                if(seleccionandoPara === 1) padre1 = geno;
                if(seleccionandoPara === 2) padre2 = geno;
                if(selectorContainer) selectorContainer.classList.add("hidden");
                actualizarSlots();
            });
            if(listContainer) listContainer.appendChild(btn);
        });
    }

    if(slot1) slot1.addEventListener("click", () => abrirSelector(1));
    if(slot2) slot2.addEventListener("click", () => abrirSelector(2));

    if(btnBreeding) {
        btnBreeding.addEventListener("click", () => {
            if(!padre1 || !padre2) return;

            if(window.miInventario && typeof window.miInventario.addEssence === 'function') {
                window.miInventario.addEssence(-500); 
            }
            
            padre1.breedCount++;
            padre2.breedCount++;

            btnBreeding.disabled = true;
            btnBreeding.innerText = "Secuenciando ADN...";
            
            let toggle = false;
            const anim = setInterval(() => {
                toggle = !toggle;
                slot1.style.transform = toggle ? "scale(1.1)" : "scale(0.9)";
                slot2.style.transform = !toggle ? "scale(1.1)" : "scale(0.9)";
                slot1.style.borderColor = toggle ? "#8b5cf6" : "#00d2ff";
                slot2.style.borderColor = !toggle ? "#8b5cf6" : "#00d2ff";
            }, 150);

            setTimeout(() => {
                clearInterval(anim);
                slot1.style.transform = "scale(1)";
                slot2.style.transform = "scale(1)";
                slot1.style.borderColor = "#00d2ff";
                slot2.style.borderColor = "#00d2ff";

                const genHijo = Math.max(padre1.generation || 0, padre2.generation || 0) + 1;
                
                // Si la función de heredar está en otro archivo (motorGenetico.js), la usamos:
                let genesHijo, statsHijo;
                if(typeof heredarRasgo === 'function') {
                    genesHijo = {
                        cuerpo: { dom: heredarRasgo(padre1, padre2, 'cuerpo'), rec: heredarRasgo(padre1, padre2, 'cuerpo') },
                        ojos: { dom: heredarRasgo(padre1, padre2, 'ojos'), rec: heredarRasgo(padre1, padre2, 'ojos') },
                        boca: { dom: heredarRasgo(padre1, padre2, 'boca'), rec: heredarRasgo(padre1, padre2, 'boca') },
                        espalda: { dom: heredarRasgo(padre1, padre2, 'espalda'), rec: heredarRasgo(padre1, padre2, 'espalda') },
                        cabeza: { dom: heredarRasgo(padre1, padre2, 'cabeza'), rec: heredarRasgo(padre1, padre2, 'cabeza') },
                        afinidad: { dom: heredarRasgo(padre1, padre2, 'afinidad'), rec: heredarRasgo(padre1, padre2, 'afinidad') }
                    };
                    statsHijo = calcularIVs(padre1.stats, padre2.stats);
                } else {
                    // Fallback seguro por si no cargó el motor
                    genesHijo = { cuerpo: {dom:"gota", rec:"gota"}, ojos: {dom:"estandar", rec:"estandar"}, boca: {dom:"colmillos", rec:"colmillos"}, espalda: {dom:"ninguno", rec:"ninguno"}, cabeza: {dom:"ninguno", rec:"ninguno"}, afinidad: {dom:"Biomutante", rec:"Biomutante"} };
                    statsHijo = {hp: 50, atk: 15, spd: 15, luk: 15};
                }

                const pColor1 = padre1.color || padre1.base_color || "#77DD77";
                const pColor2 = padre2.color || padre2.base_color || "#77DD77";
                const colorHijo = Math.random() > 0.5 ? pColor1 : pColor2;

                const hijo = {
                    id: Date.now(),
                    name: "Huevo Misterioso",
                    isEgg: true, 
                    hatchTime: Date.now() + 120000, 
                    generation: genHijo,
                    breedCount: 0,
                    level: 1,
                    xp: 0,
                    xpNeeded: 100,
                    genes: genesHijo,
                    stats: statsHijo,
                    body_shape: genesHijo.cuerpo.dom,
                    eye_type: genesHijo.ojos.dom,
                    mouth_type: genesHijo.boca.dom,
                    wing_type: genesHijo.espalda.dom,
                    hat_type: genesHijo.cabeza.dom,
                    element: genesHijo.afinidad.dom,
                    base_color: colorHijo,
                    color: colorHijo,
                    reward: 100
                };

                if (typeof generarSvgGeno === 'function') {
                    hijo.svg = generarSvgGeno(hijo);
                }

                if(!window.misGenos) window.misGenos = [];
                window.misGenos.push(hijo);
                btnBreeding.innerText = "Iniciar Secuencia";
                window.iniciarSelectorCrianza(); 
            }, 2000);
        });
    }

    window.renderizarIncubadora = function() {
        const grid = document.getElementById("incubator-grid");
        if(!grid) return;
        
        const huevos = (window.misGenos || []).filter(g => g.isEgg);
        grid.innerHTML = "";

        if(huevos.length === 0) {
            grid.innerHTML = '<div style="margin: auto; color: #64748b; font-size: 12px; font-style: italic;">La incubadora está vacía.</div>';
            return;
        }

        huevos.forEach(huevo => {
            const card = document.createElement("div");
            card.style = "min-width: 95px; background: #1e293b; border: 1px solid #3b82f6; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); position: relative;";
            
            card.innerHTML = `
                ${typeof generarSvgGeno === 'function' ? generarSvgGeno(huevo) : '<span>Huevo</span>'}
                <div id="timer-${huevo.id}" style="font-size: 12px; font-weight: bold; color: #00d2ff; margin-top: 8px; letter-spacing: 1px;">Calc...</div>
                <button id="btn-skip-${huevo.id}" style="margin-top: 8px; font-size: 10px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; border: none; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4); text-transform: uppercase;">⚡ 0.5 POL</button>
            `;
            
            const svg = card.querySelector("svg");
            if(svg) { svg.style.width = "45px"; svg.style.height = "45px"; }

            const btnSkip = card.querySelector(`#btn-skip-${huevo.id}`);
            if(btnSkip) {
                btnSkip.addEventListener("click", () => {
                    if(window.miWallet && window.miWallet.pol >= 0.5) {
                        window.miWallet.pol -= 0.5;
                        actualizarPolUI();
                        
                        huevo.isEgg = false;
                        if (typeof generarSvgGeno === 'function') huevo.svg = generarSvgGeno(huevo); 
                        
                        alert(`⚡ ¡Sobrecarga Activada!\nEl Huevo eclosionó instantáneamente.\nBienvenido al mundo: [Gen ${huevo.generation}].\nForma: ${huevo.body_shape}`);
                        window.renderizarIncubadora();
                        if(window.actualizarPanelRPG) window.actualizarPanelRPG();
                    } else {
                        alert("No tienes suficiente POL en tu billetera conectada.");
                    }
                });
            }

            grid.appendChild(card);
        });
    }

    setInterval(() => {
        const huevos = (window.misGenos || []).filter(g => g.isEgg);
        let requiereActualizacion = false;

        huevos.forEach(huevo => {
            const restante = huevo.hatchTime - Date.now();
            const label = document.getElementById(`timer-${huevo.id}`);
            
            if (restante <= 0) {
                huevo.isEgg = false;
                if (typeof generarSvgGeno === 'function') huevo.svg = generarSvgGeno(huevo); 
                requiereActualizacion = true;
                alert(`🐣 ¡Atención!\nUn huevo acaba de eclosionar.\nForma resultante: ${huevo.body_shape}`);
            } else {
                if(label) {
                    const min = Math.floor(restante / 60000);
                    const sec = Math.floor((restante % 60000) / 1000);
                    const secStr = sec < 10 ? "0" + sec : sec;
                    label.innerText = `${min}:${secStr}`;
                }
            }
        });

        if(requiereActualizacion) {
            window.renderizarIncubadora();
            if(window.actualizarPanelRPG) window.actualizarPanelRPG();
        }
    }, 1000);
});