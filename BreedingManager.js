// =========================================
// BreedingManager.js - ALGORITMO GENÉTICO
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    
    let padre1 = null;
    let padre2 = null;
    let seleccionandoPara = 1; // 1 o 2

    const slot1 = document.getElementById("slot-parent-1");
    const slot2 = document.getElementById("slot-parent-2");
    const btnBreeding = document.getElementById("btn-start-breeding");
    const selectorContainer = document.getElementById("breeding-selector");
    const listContainer = document.getElementById("breeding-list");

    // Limpia los datos de los Genos de prueba para que funcionen con la Crianza
    function normalizarGenos() {
        window.misGenos.forEach(g => {
            if(!g.level) g.level = 10; // Forzamos Nv 10 a los de prueba para que puedas probar
            if(g.breedCount === undefined) g.breedCount = 0;
            if(g.generation === undefined) g.generation = 0;
            if(!g.stats) g.stats = { hp: 50, atk: 15, spd: 15, luk: 15 };
        });
        // Asegurar que el Geno Base también esté normalizado
        if(window.miMascota && window.miMascota.breedCount === undefined) window.miMascota.breedCount = 0;
    }

    window.iniciarSelectorCrianza = function() {
        padre1 = null;
        padre2 = null;
        actualizarSlots();
        selectorContainer.classList.add("hidden");
    }

    function actualizarSlots() {
        normalizarGenos();
        
        [slot1, slot2].forEach((slot, index) => {
            const padre = index === 0 ? padre1 : padre2;
            if (padre) {
                let color = padre.color || padre.visual_genes?.base_color || "#ccc";
                let shape = padre.shape || padre.visual_genes?.body_shape || "gota";
                slot.innerHTML = generarSvgGeno({ body_shape: shape, base_color: color });
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

        // Unir el Geno Principal + Los Genos del Almacén
        const todosMisGenos = [window.miMascota, ...window.misGenos].filter(g => g !== undefined);

        const genosValidos = todosMisGenos.filter(g => {
            const yaSeleccionado = (padre1 && padre1.id === g.id) || (padre2 && padre2.id === g.id);
            return g.level >= 10 && g.breedCount < 7 && !yaSeleccionado;
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
                ${generarSvgGeno({ body_shape: shape, base_color: color })}
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

            window.miInventario.addEssence(-500); // Cobrar Esencia
            padre1.breedCount++;
            padre2.breedCount++;

            btnBreeding.disabled = true;
            btnBreeding.innerText = "Mezclando ADN...";
            
            // Animación de mezcla
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

                // ALGORITMO MENDELIANO BÁSICO
                const genHijo = Math.max(padre1.generation || 0, padre2.generation || 0) + 1;
                
                // Mezcla visual (elige forma de uno y color del otro para prototipo)
                const shapeHijo = Math.random() > 0.5 ? (padre1.shape || padre1.visual_genes.body_shape) : (padre2.shape || padre2.visual_genes.body_shape);
                const colorHijo = Math.random() > 0.5 ? (padre1.color || padre1.visual_genes.base_color) : (padre2.color || padre2.visual_genes.base_color);
                
                // Promedio de Stats + un factor de mutación (0.9 a 1.1)
                const mutacion = () => (Math.random() * 0.2) + 0.9;
                const statsHijo = {
                    hp: Math.floor(((padre1.stats.hp + padre2.stats.hp) / 2) * mutacion()),
                    atk: Math.floor(((padre1.stats.atk + padre2.stats.atk) / 2) * mutacion()),
                    spd: Math.floor(((padre1.stats.spd + padre2.stats.spd) / 2) * mutacion()),
                    luk: Math.floor(((padre1.stats.luk + padre2.stats.luk) / 2) * mutacion())
                };

                // Crear el Hijo
                const hijo = {
                    id: Date.now(),
                    name: "Recién Nacido",
                    generation: genHijo,
                    breedCount: 0,
                    level: 1,
                    xp: 0,
                    xpNeeded: 100,
                    rarity: padre1.rarity, // En una versión avanzada, dependerá de los stats
                    element: padre1.element,
                    shape: shapeHijo,
                    color: colorHijo,
                    stats: statsHijo,
                    reward: 100
                };

                window.misGenos.push(hijo);

                alert(`¡Ha nacido un nuevo Geno! 🐣\n\nNombre: Recién Nacido [Gen ${genHijo}]\nSe ha enviado al Santuario/Almacén.`);
                
                btnBreeding.innerText = "Iniciar Crianza";
                window.iniciarSelectorCrianza(); // Reset

            }, 2000);
        });
    }
});