// =========================================
// BreedingManager.js - UI DEL CENTRO DE CRIANZA Y BIO-NÚCLEOS
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
    const closeSelectorBtn = document.getElementById("close-breeding-selector");
    const idCardModal = document.getElementById("geno-id-card-modal");
    const closeIdCardBtn = document.getElementById("close-id-card");

    // 🔋 NUEVO: UI de Requerimientos Dinámico sobre el botón de crianza
    let reqDiv = document.getElementById("breeding-requirements");
    if (!reqDiv && btnBreeding) {
        reqDiv = document.createElement("div");
        reqDiv.id = "breeding-requirements";
        reqDiv.style = "text-align: center; margin-bottom: 10px; font-size: 12px; font-weight: bold; color: #aaa; letter-spacing: 1px;";
        btnBreeding.parentNode.insertBefore(reqDiv, btnBreeding);
    }

    if(closeSelectorBtn) closeSelectorBtn.addEventListener("click", () => selectorContainer?.classList.add("hidden"));
    if(closeIdCardBtn) closeIdCardBtn.addEventListener("click", () => {
        idCardModal?.classList.add("hidden");
        selectorContainer?.classList.remove("hidden");
    });

    function actualizarPolUI() {
        const polText = document.getElementById("pol-amount");
        if(polText && window.miWallet) polText.innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
        const essenceText = document.getElementById("vital-essence-amount");
        if(essenceText && window.miInventario) essenceText.innerText = `✨ ${window.miInventario.vitalEssence || 0}`;
    }

    function normalizarGenos() {
        if(!window.misGenos) window.misGenos = [];
        window.misGenos.forEach(g => {
            if(!g.level) g.level = 1;
            if(g.breedCount === undefined) g.breedCount = 0;
            if(g.generation === undefined) g.generation = 0;
            if(!g.stats) g.stats = { hp: 50, atk: 15, spd: 15, luk: 15 };
        });
        if(window.miMascota && window.miMascota.breedCount === undefined) window.miMascota.breedCount = 0;
    }

    window.iniciarSelectorCrianza = function() {
        padre1 = null; padre2 = null;
        actualizarSlots();
        selectorContainer?.classList.add("hidden");
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

                slot.innerHTML = typeof generarSvgGeno === 'function' ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false }) : '<span>Geno</span>';
                const svg = slot.querySelector("svg");
                if(svg) { svg.style.width = "50px"; svg.style.height = "50px"; svg.style.color = pColor; }
                slot.style.border = "2px solid #4dd0e1"; slot.style.background = "#1a2a36"; slot.style.boxShadow = "0 0 10px rgba(77, 208, 225, 0.4)";
            } else {
                slot.innerHTML = '<span style="color: #4dd0e1; font-size: 28px;">+</span>';
                slot.style.border = "2px dashed #4dd0e1"; slot.style.background = "#0d1a24"; slot.style.boxShadow = "none";
            }
        });

        if(btnBreeding) {
            btnBreeding.disabled = !(padre1 && padre2);
            if(!btnBreeding.disabled) {
                // 🔋 COMPROBACIÓN DE INVENTARIO: ¿Tiene Incubadora Térmica?
                let countInc = 0;
                if (window.miInventario && window.miInventario.items) {
                     const inc = window.miInventario.items.find(i => i.id === "incubator_01");
                     countInc = inc ? (inc.cantidad || inc.count || 0) : 0;
                }
                
                const colorInc = countInc > 0 ? "#4dd0e1" : "#ff6b6b";
                if (reqDiv) reqDiv.innerHTML = `COSTE: ✨ 500 Esencia | <span style="color: ${colorInc}">🔋 ${countInc}/1 Incubadora</span>`;

                if (countInc === 0) {
                    btnBreeding.innerText = "COMPRAR INCUBADORA (0.2 POL)";
                    btnBreeding.style.background = "linear-gradient(90deg, #ff9800, #ff5722)";
                    btnBreeding.dataset.action = "buy";
                } else {
                    btnBreeding.innerText = "SINTETIZAR BIO-NÚCLEO";
                    btnBreeding.style.background = "linear-gradient(90deg, #4dd0e1, #8A2BE2)";
                    btnBreeding.dataset.action = "breed";
                }
                
                btnBreeding.style.opacity = "1"; btnBreeding.style.cursor = "pointer";
            } else {
                if (reqDiv) reqDiv.innerHTML = "";
                btnBreeding.innerText = "SELECCIONA SUJETOS";
                btnBreeding.style.background = "#333"; btnBreeding.style.opacity = "0.5"; btnBreeding.style.cursor = "not-allowed";
                btnBreeding.dataset.action = "disabled";
            }
        }
    }

    function mostrarTarjetaGeno(g) {
        if(!idCardModal) return;
        if(selectorContainer) selectorContainer.classList.add("hidden");

        const pColor = g.color || g.visual_genes?.base_color || g.base_color || "#ccc";
        const pShape = (g.genes && g.genes.cuerpo) ? g.genes.cuerpo.dom : (g.shape || g.visual_genes?.body_shape || g.body_shape || "gota");
        const pWing = (g.genes && g.genes.espalda) ? g.genes.espalda.dom : (g.wing_type || "ninguno");

        const svgContainer = document.getElementById("id-card-svg");
        if(svgContainer) {
            svgContainer.innerHTML = typeof generarSvgGeno === 'function' ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false }) : '';
            const svg = svgContainer.querySelector("svg");
            if(svg) { svg.style.width = "90px"; svg.style.height = "90px"; svg.style.color = pColor; }
        }

        document.getElementById("id-card-name").innerText = g.name || `Sujeto`;
        const lvlEl = document.getElementById("id-card-level");
        if(lvlEl) lvlEl.innerText = `Nv. ${g.level || 1}`;

        document.getElementById("id-card-rarity").innerText = g.rarity || "Común";
        document.getElementById("id-card-element").innerText = (g.genes && g.genes.afinidad) ? g.genes.afinidad.dom : (g.element || "Normal");
        
        const criasEl = document.getElementById("id-card-breeds");
        if(criasEl) criasEl.innerText = `${7 - (g.breedCount || 0)} de 7`;

        document.getElementById("id-card-hp").innerText = Math.floor(g.stats?.hp || 50);
        document.getElementById("id-card-atk").innerText = Math.floor(g.stats?.atk || 15);
        document.getElementById("id-card-spd").innerText = Math.floor(g.stats?.spd || 15);
        document.getElementById("id-card-luk").innerText = Math.floor(g.stats?.luk || 15);

        const qualityEl = document.getElementById("id-card-quality");
        if(qualityEl && window.calcularCalidad && window.obtenerColorRango) {
            const statsActualizadas = window.calcularCalidad(g.stats, g.rarity || "Común", g.level || 1);
            const color = window.obtenerColorRango(statsActualizadas.rango);

            qualityEl.innerText = `${statsActualizadas.rango} (${statsActualizadas.calidadPorcentaje}%)`;
            qualityEl.style.color = color;
            qualityEl.style.textShadow = statsActualizadas.rango === "S" ? "0 0 10px rgba(255, 204, 0, 0.8)" : "none";
        }

        const secretGeneContainer = document.getElementById("id-card-secret-gene");
        const scanBtn = document.getElementById("btn-id-scan");
        const lockedText = document.getElementById("id-card-locked-text");
        const domText = document.getElementById("id-card-dom");
        const recText = document.getElementById("id-card-rec");

        if (secretGeneContainer) {
            if (g.scanned) {
                if (scanBtn) scanBtn.classList.add("hidden");
                if (lockedText) lockedText.classList.add("hidden");
                if (domText) { domText.innerHTML = `🧬 Dom: <span style="color:#fff;">${(g.genes && g.genes.afinidad) ? g.genes.afinidad.dom : (g.element || "Normal")}</span>`; domText.classList.remove("hidden"); }
                if (recText) { recText.innerHTML = `🔬 Rec: <span style="color:#80deea;">${(g.genes && g.genes.afinidad) ? g.genes.afinidad.rec : "Normal"}</span>`; recText.classList.remove("hidden"); }
            } else {
                if (scanBtn) {
                    scanBtn.classList.remove("hidden");
                    const newBtn = scanBtn.cloneNode(true);
                    scanBtn.parentNode.replaceChild(newBtn, scanBtn);
                    newBtn.addEventListener("click", () => {
                        if (window.miWallet && window.miWallet.pol >= 0.25) {
                            window.miWallet.pol -= 0.25; actualizarPolUI();
                            g.scanned = true; if(window.guardarJuego) window.guardarJuego();
                            newBtn.innerText = "ESCANEANDO..."; newBtn.style.background = "#fff"; newBtn.style.color = "#000";
                            setTimeout(() => mostrarTarjetaGeno(g), 1000);
                        } else { alert("No tienes suficiente POL (0.25) para usar el Escáner Molecular."); }
                    });
                }
                if (lockedText) lockedText.classList.remove("hidden");
                if (domText) domText.classList.add("hidden");
                if (recText) recText.classList.add("hidden");
            }
        }
        idCardModal.classList.remove("hidden");
    }

    function abrirSelector(numPadre) {
        seleccionandoPara = numPadre;
        if(selectorContainer) selectorContainer.classList.remove("hidden");
        if(listContainer) { listContainer.innerHTML = ""; listContainer.style.display = "flex"; listContainer.style.flexDirection = "column"; listContainer.style.gap = "12px"; }

        const todosMisGenos = [];
        if(window.miMascota) todosMisGenos.push(window.miMascota);
        if(window.misGenos) todosMisGenos.push(...window.misGenos);

        if (todosMisGenos.length === 0) {
            if(listContainer) listContainer.innerHTML = '<div style="font-size: 12px; color: #ef4444; width:100%; text-align:center; padding: 20px;">La base de datos está vacía.</div>';
            return;
        }

        todosMisGenos.forEach(geno => {
            if(!geno || geno.isEgg) return;
            const yaSeleccionado = (padre1 && padre1.id === geno.id) || (padre2 && padre2.id === geno.id);
            const cumpleRequisitos = ((geno.breedCount || 0) < 7) && !yaSeleccionado;

            const btn = document.createElement("div");
            let styleStr = "padding: 12px; border-radius: 14px; display: flex; align-items: center; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.4); transition: 0.2s;";
            if(cumpleRequisitos) {
                styleStr += " border: 1px solid #4dd0e1; background: #1a2a36; cursor: pointer;";
                btn.onmouseover = () => btn.style.boxShadow = "0 0 20px rgba(77, 208, 225, 0.4)";
                btn.onmouseout = () => btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
            } else { styleStr += " border: 1px solid #555; background: #0a1118; opacity: 0.6; cursor: not-allowed;"; }
            btn.style = styleStr;

            const pColor = geno.color || geno.visual_genes?.base_color || geno.base_color || "#ccc";
            const pShape = (geno.genes && geno.genes.cuerpo) ? geno.genes.cuerpo.dom : (geno.shape || geno.visual_genes?.body_shape || geno.body_shape || "gota");
            const pWing = (geno.genes && geno.genes.espalda) ? geno.genes.espalda.dom : (geno.wing_type || "ninguno");
            let svgContent = typeof generarSvgGeno === 'function' ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false }) : '<span>Geno</span>';

            let statusText = `<span style="color: #00d2ff; font-weight: bold; font-size: 11px;">${7 - (geno.breedCount||0)} crías disponibles</span>`;
            if(yaSeleccionado) statusText = `<span style="color: #f0ad4e; font-weight: bold; font-size: 11px;">⚠️ Ya está seleccionado</span>`;
            else if((geno.breedCount||0) >= 7) statusText = `<span style="color: #d9534f; font-weight: bold; font-size: 11px;">🔒 Límite de crías</span>`;

            btn.innerHTML = `
                <div style="width: 75px; height: 75px; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.4); border-radius: 10px; border: 1px solid #333; flex-shrink: 0; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); color: ${pColor};">${svgContent}</div>
                <div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1; padding-left: 15px;">
                    <span style="color: #fff; font-weight: 900; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 2px;">${geno.name || 'Sujeto'} <span style="color: #00d2ff; font-size: 11px;">Nv.${geno.level || 1}</span></span>
                    <span style="color: #aaa; font-size: 10px; margin-bottom: 6px; text-transform: uppercase;">Base: ${pShape}</span>
                    ${statusText}
                </div>
                <button class="btn-info-geno" style="background: rgba(77, 208, 225, 0.1); border: 1px solid #4dd0e1; color: #fff; width: 45px; height: 45px; border-radius: 8px; font-size: 22px; cursor: pointer; flex-shrink: 0; display: flex; justify-content: center; align-items: center; margin-left: 10px; transition: 0.2s; box-shadow: inset 0 0 5px rgba(77, 208, 225, 0.3);" title="Análisis Genético">🔬</button>
            `;

            const svg = btn.querySelector("svg"); if(svg) { svg.style.width = "65px"; svg.style.height = "65px"; } 

            const infoBtn = btn.querySelector('.btn-info-geno');
            if(infoBtn) { infoBtn.addEventListener("click", (e) => { e.stopPropagation(); mostrarTarjetaGeno(geno); }); }

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

    if(slot1) slot1.addEventListener("click", () => abrirSelector(1));
    if(slot2) slot2.addEventListener("click", () => abrirSelector(2));

    if(btnBreeding) {
        btnBreeding.addEventListener("click", () => {
            if(!padre1 || !padre2) return;

            // 🛒 ACCIÓN 1: COMPRAR INCUBADORA
            if (btnBreeding.dataset.action === "buy") {
                const costoIncubadora = 0.2;
                if (window.miWallet && window.miWallet.pol >= costoIncubadora) {
                    window.miWallet.pol -= costoIncubadora;
                    
                    // Añadir al inventario (Límite Stack 20)
                    if(window.miInventario && window.miInventario.addItem) {
                        window.miInventario.addItem({ id: "incubator_01", name: "Incubadora Térmica", icon: "🔋", type: "consumible", maxStack: 20 }, 1);
                    } else if (window.miInventario) {
                        if(!window.miInventario.items) window.miInventario.items = [];
                        window.miInventario.items.push({ id: "incubator_01", name: "Incubadora Térmica", icon: "🔋", type: "consumible", maxStack: 20, count: 1 });
                    }
                    actualizarPolUI();
                    actualizarSlots(); // Refresca el botón para permitir la síntesis
                } else {
                    alert("❌ No tienes suficiente $POL (0.2) para comprar una Incubadora Térmica.");
                }
                return;
            }
            
            // 🧬 ACCIÓN 2: SINTETIZAR BIO-NÚCLEO
            let esenciaActual = (window.miInventario && typeof window.miInventario.vitalEssence !== 'undefined') ? window.miInventario.vitalEssence : 9999; 
            if (esenciaActual < 500) { alert("⚠️ No tienes suficiente Esencia Vital (✨ 500)."); return; }
            
            // Cobro de recursos:
            if(window.miInventario && typeof window.miInventario.addEssence === 'function') { window.miInventario.addEssence(-500); }
            
            // Consumir la incubadora:
            if(window.miInventario && typeof window.miInventario.consumeItem === 'function') { 
                window.miInventario.consumeItem("incubator_01", 1); 
            } else if (window.miInventario && window.miInventario.items) {
                const inc = window.miInventario.items.find(i => i.id === "incubator_01");
                if(inc) inc.count = (inc.count || inc.cantidad) - 1;
            }
            
            actualizarPolUI();
            
            padre1.breedCount = (padre1.breedCount || 0) + 1; padre2.breedCount = (padre2.breedCount || 0) + 1;
            btnBreeding.disabled = true; btnBreeding.innerText = "PROCESANDO ADN..."; btnBreeding.style.background = "#8A2BE2"; btnBreeding.style.cursor = "wait";
            if (reqDiv) reqDiv.innerHTML = "Sintetizando nuevo material genético...";
            
            let toggle = false;
            const anim = setInterval(() => {
                toggle = !toggle;
                slot1.style.transform = toggle ? "scale(1.1)" : "scale(0.9)"; slot2.style.transform = !toggle ? "scale(1.1)" : "scale(0.9)";
                slot1.style.borderColor = toggle ? "#8b5cf6" : "#4dd0e1"; slot2.style.borderColor = !toggle ? "#8b5cf6" : "#4dd0e1";
            }, 150);

            setTimeout(() => {
                clearInterval(anim);
                slot1.style.transform = "scale(1)"; slot2.style.transform = "scale(1)";
                slot1.style.borderColor = "#4dd0e1"; slot2.style.borderColor = "#4dd0e1";

                const genHijo = Math.max(padre1.generation || 0, padre2.generation || 0) + 1;
                const p1Genes = padre1.genes || { cuerpo: {dom: padre1.body_shape||"gota", rec: padre1.body_shape||"gota"}, ojos: {dom: padre1.eye_type||"estandar", rec: padre1.eye_type||"estandar"}, boca: {dom: padre1.mouth_type||"feliz", rec: padre1.mouth_type||"feliz"}, espalda: {dom: padre1.wing_type||"ninguno", rec: padre1.wing_type||"ninguno"}, cabeza: {dom: padre1.hat_type||"ninguno", rec: padre1.hat_type||"ninguno"}, afinidad: {dom: padre1.element||"Normal", rec: padre1.element||"Normal"} };
                const p2Genes = padre2.genes || { cuerpo: {dom: padre2.body_shape||"gota", rec: padre2.body_shape||"gota"}, ojos: {dom: padre2.eye_type||"estandar", rec: padre2.eye_type||"estandar"}, boca: {dom: padre2.mouth_type||"feliz", rec: padre2.mouth_type||"feliz"}, espalda: {dom: padre2.wing_type||"ninguno", rec: padre2.wing_type||"ninguno"}, cabeza: {dom: padre2.hat_type||"ninguno", rec: padre2.hat_type||"ninguno"}, afinidad: {dom: padre2.element||"Normal", rec: padre2.element||"Normal"} };
                
                const genesHijo = {
                    cuerpo: window.cruzarRasgo(p1Genes.cuerpo, p2Genes.cuerpo, "gota"),
                    ojos: window.cruzarRasgo(p1Genes.ojos, p2Genes.ojos, "estandar"),
                    boca: window.cruzarRasgo(p1Genes.boca, p2Genes.boca, "feliz"),
                    espalda: window.cruzarRasgo(p1Genes.espalda, p2Genes.espalda, "ninguno"),
                    cabeza: window.cruzarRasgo(p1Genes.cabeza, p2Genes.cabeza, "ninguno"),
                    afinidad: window.cruzarRasgo(p1Genes.afinidad, p2Genes.afinidad, "Normal")
                };

                const statsHijo = {
                    hp: window.heredarStat(padre1.stats?.hp || 50, padre2.stats?.hp || 50),
                    atk: window.heredarStat(padre1.stats?.atk || 15, padre2.stats?.atk || 15),
                    spd: window.heredarStat(padre1.stats?.spd || 15, padre2.stats?.spd || 15),
                    luk: window.heredarStat(padre1.stats?.luk || 15, padre2.stats?.luk || 15)
                };

                const colorHijo = Math.random() > 0.5 ? (padre1.color || padre1.base_color || "#77DD77") : (padre2.color || padre2.base_color || "#77DD77");

                const hijo = {
                    id: Date.now(), name: "Bio-Núcleo Genético", isEgg: true, hatchTime: Date.now() + 120000, 
                    generation: genHijo, breedCount: 0, level: 1, xp: 0, xpNeeded: 100,
                    genes: genesHijo, stats: statsHijo,
                    body_shape: genesHijo.cuerpo.dom, eye_type: genesHijo.ojos.dom, mouth_type: genesHijo.boca.dom,
                    wing_type: genesHijo.espalda.dom, hat_type: genesHijo.cabeza.dom, element: genesHijo.afinidad.dom,
                    base_color: colorHijo, color: colorHijo, reward: 100
                };

                if (typeof generarSvgGeno === 'function') hijo.svg = generarSvgGeno(hijo);
                if(!window.misGenos) window.misGenos = []; window.misGenos.push(hijo);
                
                window.iniciarSelectorCrianza(); 
            }, 2000);
        });
    }

    window.renderizarIncubadora = function() {
        const grid = document.getElementById("incubator-grid");
        if(!grid) return;
        const huevos = (window.misGenos || []).filter(g => g.isEgg);
        grid.innerHTML = "";

        if(huevos.length === 0) { grid.innerHTML = '<div style="margin: auto; color: #64748b; font-size: 12px; font-style: italic;">La maquinaria está inactiva. Sintetiza un Bio-Núcleo para comenzar.</div>'; return; }

        huevos.forEach(huevo => {
            const card = document.createElement("div");
            card.style = "min-width: 95px; background: #1e293b; border: 1px solid #3b82f6; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); position: relative;";
            card.innerHTML = `
                <div style="color: ${huevo.color || huevo.base_color || '#ccc'}; width: 45px; height: 45px; display: flex; justify-content: center; align-items: center;">
                    ${typeof generarSvgGeno === 'function' ? generarSvgGeno(huevo) : '<span>ADN</span>'}
                </div>
                <div id="timer-${huevo.id}" style="font-size: 12px; font-weight: bold; color: #00d2ff; margin-top: 8px; letter-spacing: 1px;">Calc...</div>
                <button id="btn-skip-${huevo.id}" style="margin-top: 8px; font-size: 10px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; border: none; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4); text-transform: uppercase;">⚡ 0.5 POL</button>
            `;

            const btnSkip = card.querySelector(`#btn-skip-${huevo.id}`);
            if(btnSkip) {
                btnSkip.addEventListener("click", () => {
                    if(window.miWallet && window.miWallet.pol >= 0.5) {
                        window.miWallet.pol -= 0.5; actualizarPolUI();
                        huevo.isEgg = false; if (typeof generarSvgGeno === 'function') huevo.svg = generarSvgGeno(huevo); 
                        alert(`⚡ ¡Sobrecarga Térmica!\nEl Bio-Núcleo finalizó su síntesis instantáneamente.\nBienvenido al mundo: [Gen ${huevo.generation}].\nForma Base: ${huevo.body_shape}`);
                        window.renderizarIncubadora(); if(window.actualizarPanelRPG) window.actualizarPanelRPG();
                    } else { alert("No tienes suficiente POL en tu billetera conectada."); }
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
                huevo.isEgg = false; if (typeof generarSvgGeno === 'function') huevo.svg = generarSvgGeno(huevo); 
                requiereActualizacion = true; alert(`🧬 ¡Síntesis Completada!\nUn Bio-Núcleo ha terminado de procesarse.\nForma resultante: ${huevo.body_shape}`);
            } else {
                if(label) {
                    const min = Math.floor(restante / 60000); const sec = Math.floor((restante % 60000) / 1000);
                    label.innerText = `${min}:${sec < 10 ? "0" + sec : sec}`;
                }
            }
        });
        if(requiereActualizacion) { window.renderizarIncubadora(); if(window.actualizarPanelRPG) window.actualizarPanelRPG(); }
    }, 1000);
});