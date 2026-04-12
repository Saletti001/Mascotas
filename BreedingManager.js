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

    // --- LÓGICA DEL BOTÓN CERRAR MODAL ---
    const closeSelectorBtn = document.getElementById("close-breeding-selector");
    if(closeSelectorBtn) {
        closeSelectorBtn.addEventListener("click", () => {
            if(selectorContainer) selectorContainer.classList.add("hidden");
        });
    }

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
                
                slot.style.border = "2px solid #4dd0e1"; 
                slot.style.background = "#1a2a36";      
                slot.style.boxShadow = "0 0 10px rgba(77, 208, 225, 0.4)";
            } else {
                slot.innerHTML = '<span style="color: #4dd0e1; font-size: 28px;">+</span>';
                slot.style.border = "2px dashed #4dd0e1";
                slot.style.background = "#0d1a24";
                slot.style.boxShadow = "none";
            }
        });

        // Validación para encender el botón de Iniciar Secuencia
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
        
        // FORZAMOS DISEÑO DE LISTA VERTICAL (Adiós a la cuadrícula pequeña)
        if(listContainer) {
            listContainer.innerHTML = "";
            listContainer.style.display = "flex";
            listContainer.style.flexDirection = "column";
            listContainer.style.gap = "12px";
        }

        const todosMisGenos = [];
        if(window.miMascota) todosMisGenos.push(window.miMascota);
        if(window.misGenos) todosMisGenos.push(...window.misGenos);

        if (todosMisGenos.length === 0) {
            if(listContainer) listContainer.innerHTML = '<div style="font-size: 12px; color: #ef4444; width:100%; text-align:center; padding: 20px;">La base de datos está vacía.</div>';
            return;
        }

        todosMisGenos.forEach(geno => {
            if(!geno || geno.isEgg) return; // Ocultamos los huevos

            // Validaciones
            const yaSeleccionado = (padre1 && padre1.id === geno.id) || (padre2 && padre2.id === geno.id);
            const cumpleRequisitos = (geno.level >= 10) && ((geno.breedCount || 0) < 7) && !yaSeleccionado;

            const btn = document.createElement("div");
            
            // ESTILO DE TARJETA HORIZONTAL (Imagen a la izq, texto a la der)
            let styleStr = "padding: 12px; border-radius: 14px; display: flex; align-items: center; gap: 15px; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.4); transition: 0.2s;";

            if(cumpleRequisitos) {
                // Estilo Activo
                styleStr += " border: 1px solid #4dd0e1; background: #1a2a36; cursor: pointer;";
                btn.onmouseover = () => btn.style.boxShadow = "0 0 20px rgba(77, 208, 225, 0.4)";
                btn.onmouseout = () => btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
            } else {
                // Estilo Deshabilitado
                styleStr += " border: 1px solid #555; background: #0a1118; opacity: 0.6; cursor: not-allowed;";
            }

            btn.style = styleStr;

            const pColor = geno.color || geno.visual_genes?.base_color || geno.base_color || "#ccc";
            const pShape = (geno.genes && geno.genes.cuerpo) ? geno.genes.cuerpo.dom : (geno.shape || geno.visual_genes?.body_shape || geno.body_shape || "gota");
            const pWing = (geno.genes && geno.genes.espalda) ? geno.genes.espalda.dom : (geno.wing_type || "ninguno");

            let svgContent = typeof generarSvgGeno === 'function' ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false }) : '<span>Geno</span>';

            // Textos de estado detallados
            let statusText = `<span style="color: #00d2ff; font-weight: bold; font-size: 12px;">${7 - (geno.breedCount||0)} crías disponibles</span>`;
            if(yaSeleccionado) statusText = `<span style="color: #f0ad4e; font-weight: bold; font-size: 12px;">⚠️ Ya está en la incubadora</span>`;
            else if(geno.level < 10) statusText = `<span style="color: #d9534f; font-weight: bold; font-size: 12px;">🔒 Bloqueado: Requiere Nivel 10</span>`;
            else if((geno.breedCount||0) >= 7) statusText = `<span style="color: #d9534f; font-weight: bold; font-size: 12px;">🔒 Bloqueado: Límite de crías</span>`;

            // Construcción del HTML interno de la tarjeta
            btn.innerHTML = `
                <div style="width: 75px; height: 75px; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.4); border-radius: 10px; border: 1px solid #333; flex-shrink: 0; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                    ${svgContent}
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; width: 100%;">
                    <span style="color: #fff; font-weight: 900; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 2px;">Especímen Nv. ${geno.level || 1}</span>
                    <span style="color: #aaa; font-size: 11px; margin-bottom: 6px; text-transform: uppercase;">Base: ${pShape}</span>
                    ${statusText}
                </div>
            `;

            // AUMENTAMOS EL TAMAÑO DEL SVG AL DOBLE
            const svg = btn.querySelector("svg");
            if(svg) { svg.style.width = "65px"; svg.style.height = "65px"; } 

            if(cumpleRequisitos) {
                btn.addEventListener("click", () => {
                    if(seleccionandoPara === 1) padre1 = geno;
                    if(seleccionandoPara === 2) padre2 = geno;
                    if(selectorContainer) selectorContainer.classList.add("hidden");
                    actualizarSlots();
                });
            }

            if(listContainer) listContainer.appendChild(btn);
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