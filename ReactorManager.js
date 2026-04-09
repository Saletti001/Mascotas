// =========================================
// ReactorManager.js - FUSIONES Y MUTACIONES
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const reactorRules = {
        "1": { 
            reqRarity: "Común", cost: 100, probCrit: 3, probNorm: 35, probStag: 35, 
            resCrit: { rarity: "Épico", name: "Mutante Primordial", color: "#8A2BE2", shape: "estrella" },
            resNorm: { rarity: "Raro", name: "Geno Evolucionado", color: "#4169E1", shape: "frijol" },
            resStag: { rarity: "Común+", name: "Superviviente", color: "#32CD32", shape: "gota" }
        },
        "2": { 
            reqRarity: "Raro", cost: 500, probCrit: 0.5, probNorm: 25, probStag: 35, 
            resCrit: { rarity: "Legendario", name: "Anomalía Leyenda", color: "#FFD700", shape: "estrella" },
            resNorm: { rarity: "Épico", name: "Geno Superior", color: "#8A2BE2", shape: "estrella" },
            resStag: { rarity: "Raro+", name: "Veterano Raro", color: "#4169E1", shape: "frijol" }
        },
        "3": { 
            reqRarity: "Épico", cost: 2500, probCrit: 0.1, probNorm: 5, probStag: 40, 
            resCrit: { rarity: "Mítico", name: "Dios Primigenio", color: "#111111", shape: "estrella" },
            resNorm: { rarity: "Legendario", name: "Mito Viviente", color: "#FFD700", shape: "estrella" },
            resStag: { rarity: "Épico+", name: "Titán Épico", color: "#8A2BE2", shape: "estrella" }
        }
    };

    const selectNivel = document.getElementById("reactor-level-select");
    window.genosEnReactor = []; 
    
    if(selectNivel) {
        selectNivel.addEventListener("change", () => {
            window.genosEnReactor = []; 
            window.renderizarAlquimia();
        });
    }

    window.renderizarAlquimia = function() {
        if(!selectNivel) return;
        const nivel = selectNivel.value;
        const reglas = reactorRules[nivel];
        
        document.getElementById("reactor-description").innerText = `Fusiona 5 Genos ${reglas.reqRarity}s para intentar crear 1 Geno ${reglas.resNorm.rarity}.`;
        document.getElementById("reactor-req-name").innerText = reglas.reqRarity + "s";
        document.getElementById("reactor-cost-display").innerText = reglas.cost + " ✨";

        const genosDisponibles = window.misGenos.filter(g => g.rarity === reglas.reqRarity);
        document.getElementById("alchemy-common-count").innerText = genosDisponibles.length;
        
        const containerSlots = document.getElementById("reactor-slots-container");
        containerSlots.innerHTML = "";
        
        for(let i=0; i<5; i++) {
            const slot = document.createElement("div");
            slot.style = "width: 50px; height: 50px; border: 2px dashed #ccc; border-radius: 8px; display: flex; justify-content: center; align-items: center; background: #fff; cursor: pointer; position: relative; transition: all 0.2s;";
            
            if (window.genosEnReactor[i]) {
                const geno = window.genosEnReactor[i];
                slot.innerHTML = generarSvgGeno({ body_shape: geno.shape, base_color: geno.color });
                const svg = slot.querySelector("svg");
                if(svg) { svg.style.width = "40px"; svg.style.height = "40px"; }
                slot.style.border = "2px solid #8B5CF6";
                slot.style.background = "#f3e8ff";
                
                slot.addEventListener("click", () => {
                    window.genosEnReactor.splice(i, 1);
                    window.renderizarAlquimia();
                });
            } else {
                slot.innerHTML = '<span style="color: #ccc; font-size: 24px;">+</span>';
            }
            containerSlots.appendChild(slot);
        }

        const containerDisponibles = document.getElementById("reactor-available-genos");
        containerDisponibles.innerHTML = "";
        
        const genosLibres = genosDisponibles.filter(g => !window.genosEnReactor.find(enR => enR.id === g.id));
        
        if (genosLibres.length === 0) {
            containerDisponibles.innerHTML = '<span style="color: #aaa; font-size: 12px; margin: auto;">No tienes Genos libres.</span>';
        } else {
            genosLibres.forEach(geno => {
                const card = document.createElement("div");
                card.style = "min-width: 45px; height: 45px; background: #fff; border: 1px solid #ddd; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.1s;";
                card.innerHTML = generarSvgGeno({ body_shape: geno.shape, base_color: geno.color });
                const svg = card.querySelector("svg");
                if(svg) { svg.style.width = "35px"; svg.style.height = "35px"; }
                
                card.addEventListener("mousedown", () => card.style.transform = "scale(0.9)");
                card.addEventListener("mouseup", () => card.style.transform = "scale(1)");
                
                card.addEventListener("click", () => {
                    if (window.genosEnReactor.length < 5) {
                        window.genosEnReactor.push(geno);
                        window.renderizarAlquimia();
                    }
                });
                containerDisponibles.appendChild(card);
            });
        }

        const btnFuse = document.getElementById("btn-fuse-genos");
        const tieneEsencia = window.miInventario && window.miInventario.vitalEssence >= reglas.cost;
        const estanLos5 = window.genosEnReactor.length === 5;
        btnFuse.disabled = !(estanLos5 && tieneEsencia);
    }

    const btnFuseGenos = document.getElementById("btn-fuse-genos");
    if(btnFuseGenos) {
        btnFuseGenos.addEventListener("click", () => {
            const nivel = selectNivel.value;
            const reglas = reactorRules[nivel];
            
            if (window.genosEnReactor.length === 5 && window.miInventario && window.miInventario.vitalEssence >= reglas.cost) {
                const btnFuse = document.getElementById("btn-fuse-genos");
                const containerSlots = document.getElementById("reactor-slots-container");
                
                window.miInventario.addEssence(-reglas.cost);
                
                const idsABorrar = window.genosEnReactor.map(g => g.id);
                window.misGenos = window.misGenos.filter(g => !idsABorrar.includes(g.id));
                
                btnFuse.disabled = true;
                btnFuse.innerText = "Sintetizando ADN...";
                
                let toggle = false;
                const animacionReactor = setInterval(() => {
                    toggle = !toggle;
                    containerSlots.style.transform = toggle ? "scale(1.05)" : "scale(0.95)";
                    containerSlots.style.filter = toggle ? "drop-shadow(0 0 10px #8B5CF6) brightness(1.2)" : "none";
                }, 100);

                setTimeout(() => {
                    clearInterval(animacionReactor);
                    containerSlots.style.transform = "scale(1)";
                    containerSlots.style.filter = "none";
                    
                    const tirada = Math.random() * 100;
                    let mensaje = "";
                    
                    const limiteCritico = reglas.probCrit;
                    const limiteNormal = limiteCritico + reglas.probNorm;
                    const limiteEstancada = limiteNormal + reglas.probStag;

                    if (tirada < limiteCritico) {
                        window.misGenos.push({ id: Date.now(), name: reglas.resCrit.name, rarity: reglas.resCrit.rarity, element: "🌌 Cósmico", shape: reglas.resCrit.shape, color: reglas.resCrit.color, reward: 1500 });
                        mensaje = `¡ÉXITO CRÍTICO! 🌟\nEl Reactor ha creado una anomalía: [Geno ${reglas.resCrit.rarity}].`;
                    } else if (tirada < limiteNormal) { 
                        window.misGenos.push({ id: Date.now(), name: reglas.resNorm.name, rarity: reglas.resNorm.rarity, element: "⚙️ Cibernético", shape: reglas.resNorm.shape, color: reglas.resNorm.color, reward: 500 });
                        mensaje = `¡FUSIÓN ESTABLE! ✨\nHas obtenido un [Geno ${reglas.resNorm.rarity}].`;
                    } else if (tirada < limiteEstancada) { 
                        window.misGenos.push({ id: Date.now(), name: reglas.resStag.name, rarity: reglas.resStag.rarity, element: "🧪 Tóxico", shape: reglas.resStag.shape, color: reglas.resStag.color, reward: 150 });
                        mensaje = `MUTACIÓN ESTANCADA ⚠️\nRecuperas 1 [Geno ${reglas.resStag.rarity}].`;
                    } else {
                        const compensacion = reglas.cost * 1.5; 
                        window.miInventario.addEssence(compensacion);
                        mensaje = `¡COLAPSO DEL REACTOR! 💥\nLos 5 Genos se desintegraron. Recuperas ${compensacion} ✨ de los restos.`;
                    }

                    setTimeout(() => {
                        alert(mensaje);
                        window.genosEnReactor = []; 
                        btnFuse.innerText = "Activar Reactor";
                        window.renderizarAlquimia();
                    }, 100);
                }, 2500);
            }
        });
    }
});