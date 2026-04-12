// =========================================
// BreedingManager.js - ALGORITMO GENÉTICO E INCUBADORA
// =========================================

// --- BASE DE DATOS MAESTRA DE GENES ---
const GenomaBBDD = {
    cuerpo: ["frijol", "hongo", "gota", "triangulo", "circulo", "cuadrado"],
    ojos: ["estandar", "visor_mecha", "ojos_araña", "hipno_espiral"],
    boca: ["colmillos", "fauces_anilladas", "babeo_acido", "rejilla"],
    espalda: ["ninguno", "alas_murcielago", "jetpack", "tentaculos", "tubos_quimicos"],
    cabeza: ["ninguno", "corona_rey", "halo_neon", "cuerno_mutante", "cerebro_expuesto", "hongo_parasito"],
    afinidad: ["Biomutante", "Viral", "Cibernético", "Radiactivo", "Tóxico", "Sintético"]
};

// --- FUNCIONES MATEMÁTICAS DE HERENCIA ---
function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function heredarRasgo(padreA, padreB, categoria) {
    const roll = Math.random() * 100;
    
    // Función auxiliar para leer con seguridad los genes antiguos o nuevos
    const getGenSeguro = (padre, cat, tipo) => {
        if (padre.genes && padre.genes[cat] && padre.genes[cat][tipo]) {
            return padre.genes[cat][tipo]; // Formato Nuevo
        }
        // Compatibilidad con Genos Antiguos (Generación 0)
        if (tipo === 'dom') {
            if (cat === 'cuerpo') return padre.shape || padre.visual_genes?.body_shape || "gota";
            if (cat === 'ojos') return padre.eye_type || "estandar";
            if (cat === 'boca') return padre.mouth_type || "colmillos";
            if (cat === 'espalda') return padre.wing_type || "ninguno";
            if (cat === 'cabeza') return padre.hat_type || "ninguno";
            if (cat === 'afinidad') return padre.element || "Biomutante";
        }
        // Si no tienen gen recesivo, asumen uno al azar de su categoría
        return randomFrom(GenomaBBDD[cat]); 
    };

    if (roll <= 70) {
        return Math.random() > 0.5 ? getGenSeguro(padreA, categoria, 'dom') : getGenSeguro(padreB, categoria, 'dom');
    } else if (roll <= 95) {
        return Math.random() > 0.5 ? getGenSeguro(padreA, categoria, 'rec') : getGenSeguro(padreB, categoria, 'rec');
    } else {
        return randomFrom(GenomaBBDD[categoria]); // MUTACIÓN 5%
    }
}

function calcularIVs(statsA, statsB) {
    const sA = statsA || { hp: 50, atk: 15, spd: 15, luk: 15 };
    const sB = statsB || { hp: 50, atk: 15, spd: 15, luk: 15 };
    
    const calcularStat = (a, b) => {
        let final = Math.floor((a + b) / 2) + (Math.floor(Math.random() * 7) - 2);
        if (final < 1) final = 1;
        if (final > 31) final = 31;
        return final;
    };

    return {
        hp: calcularStat(sA.hp, sB.hp),
        atk: calcularStat(sA.atk, sB.atk),
        spd: calcularStat(sA.spd, sB.spd),
        luk: calcularStat(sA.luk, sB.luk)
    };
}


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
                // Compatibilidad con ambos formatos para renderizar en los slots
                const pColor = padre.color || padre.visual_genes?.base_color || padre.base_color || "#ccc";
                const pShape = (padre.genes && padre.genes.cuerpo) ? padre.genes.cuerpo.dom : (padre.shape || padre.visual_genes?.body_shape || padre.body_shape || "gota");
                const pWing = (padre.genes && padre.genes.espalda) ? padre.genes.espalda.dom : (padre.wing_type || "ninguno");

                slot.innerHTML = typeof generarSvgGeno === 'function' 
                    ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false })
                    : '<span>Geno</span>';
                
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
        if(btnBreeding) btnBreeding.disabled = !(padre1 && padre2 && tieneEsencia);
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
            if(listContainer) listContainer.innerHTML = '<div style="font-size: 11px; color: #d9534f; width:100%; text-align:center;">No hay Genos aptos (Requiere Nivel 10+ y crías disponibles).</div>';
            return;
        }

        genosValidos.forEach(geno => {
            const btn = document.createElement("div");
            btn.style = "padding: 5px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; background: #fafafa; font-size: 11px; display: flex; flex-direction: column; align-items: center; width: 60px;";
            
            const pColor = geno.color || geno.visual_genes?.base_color || geno.base_color || "#ccc";
            const pShape = (geno.genes && geno.genes.cuerpo) ? geno.genes.cuerpo.dom : (geno.shape || geno.visual_genes?.body_shape || geno.body_shape || "gota");
            const pWing = (geno.genes && geno.genes.espalda) ? geno.genes.espalda.dom : (geno.wing_type || "ninguno");

            btn.innerHTML = `
                ${typeof generarSvgGeno === 'function' ? generarSvgGeno({ body_shape: pShape, base_color: pColor, wing_type: pWing, isEgg: false }) : ''}
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center;">Lv.${geno.level}</span>
                <span style="color: #E91E63;">${7 - (geno.breedCount||0)} crías</span>
            `;
            
            const svg = btn.querySelector("svg");
            if(svg) { svg.style.width = "30px"; svg.style.height = "30px"; }

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
                
                // === LA MAGIA OCURRE AQUÍ: CALCULAR EL ADN DEL HIJO ===
                const genesHijo = {
                    cuerpo: { dom: heredarRasgo(padre1, padre2, 'cuerpo'), rec: heredarRasgo(padre1, padre2, 'cuerpo') },
                    ojos: { dom: heredarRasgo(padre1, padre2, 'ojos'), rec: heredarRasgo(padre1, padre2, 'ojos') },
                    boca: { dom: heredarRasgo(padre1, padre2, 'boca'), rec: heredarRasgo(padre1, padre2, 'boca') },
                    espalda: { dom: heredarRasgo(padre1, padre2, 'espalda'), rec: heredarRasgo(padre1, padre2, 'espalda') },
                    cabeza: { dom: heredarRasgo(padre1, padre2, 'cabeza'), rec: heredarRasgo(padre1, padre2, 'cabeza') },
                    afinidad: { dom: heredarRasgo(padre1, padre2, 'afinidad'), rec: heredarRasgo(padre1, padre2, 'afinidad') }
                };

                const statsHijo = calcularIVs(padre1.stats, padre2.stats);
                
                // Mezcla simple para el color base
                const pColor1 = padre1.color || padre1.base_color || "#aaa";
                const pColor2 = padre2.color || padre2.base_color || "#bbb";
                const colorHijo = Math.random() > 0.5 ? pColor1 : pColor2;

                // CREAR EL HUEVO CON ESTRUCTURA MODERNA
                const hijo = {
                    id: Date.now(),
                    name: "Huevo Misterioso",
                    isEgg: true, 
                    hatchTime: Date.now() + 120000, // 2 Minutos para pruebas
                    generation: genHijo,
                    breedCount: 0,
                    level: 1,
                    xp: 0,
                    xpNeeded: 100,
                    
                    // Nueva Estructura Genética
                    genes: genesHijo,
                    stats: statsHijo,
                    
                    // Variables directas para facilitar lectura rápida a SVGEngine
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

                // Si ya está eclosionado (para depuración, aunque nace como huevo)
                if (typeof generarSvgGeno === 'function') {
                    hijo.svg = generarSvgGeno(hijo);
                }

                if(!window.misGenos) window.misGenos = [];
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
        
        const huevos = (window.misGenos || []).filter(g => g.isEgg);
        grid.innerHTML = "";

        if(huevos.length === 0) {
            grid.innerHTML = '<div style="margin: auto; color: #999; font-size: 12px; font-style: italic;">La incubadora está vacía.</div>';
            return;
        }

        huevos.forEach(huevo => {
            const card = document.createElement("div");
            card.style = "min-width: 90px; background: #fff; border: 1px solid #f8bbd0; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: relative;";
            
            card.innerHTML = `
                ${typeof generarSvgGeno === 'function' ? generarSvgGeno(huevo) : '<span>Huevo</span>'}
                <div id="timer-${huevo.id}" style="font-size: 11px; font-weight: bold; color: #d81b60; margin-top: 5px;">Calculando...</div>
                <button id="btn-skip-${huevo.id}" style="margin-top: 5px; font-size: 10px; background: #8A2BE2; color: white; border: none; border-radius: 4px; padding: 3px 6px; cursor: pointer;">⚡ 0.5 POL</button>
            `;
            
            const svg = card.querySelector("svg");
            if(svg) { svg.style.width = "40px"; svg.style.height = "40px"; }

            const btnSkip = card.querySelector(`#btn-skip-${huevo.id}`);
            if(btnSkip) {
                btnSkip.addEventListener("click", () => {
                    if(window.miWallet && window.miWallet.pol >= 0.5) {
                        window.miWallet.pol -= 0.5;
                        actualizarPolUI();
                        
                        huevo.isEgg = false;
                        if (typeof generarSvgGeno === 'function') huevo.svg = generarSvgGeno(huevo); // Recalcular SVG tras eclosionar
                        
                        alert(`⚡ ¡Acelerador Activado!\nEl Huevo eclosionó instantáneamente.\nBienvenido al mundo: [Gen ${huevo.generation}].\nForma: ${huevo.body_shape}`);
                        window.renderizarIncubadora();
                        // Actualizar UI general si es necesario
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
                if (typeof generarSvgGeno === 'function') huevo.svg = generarSvgGeno(huevo); // Recalcular SVG
                requiereActualizacion = true;
                alert(`🐣 ¡Atención!\nUn huevo acaba de eclosionar.\nForma resultante: ${huevo.body_shape}`);
            } else {
                if(label) {
                    const min = Math.floor(restante / 60000);
                    const sec = Math.floor((restante % 60000) / 1000);
                    label.innerText = `${min}m ${sec}s`;
                }
            }
        });

        if(requiereActualizacion) {
            window.renderizarIncubadora();
            if(window.actualizarPanelRPG) window.actualizarPanelRPG();
        }
    }, 1000);
});