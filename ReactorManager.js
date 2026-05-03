// =========================================
// ReactorManager.js - FUSIONES Y MUTACIONES (V14.0 - FIX ESTRUCTURA GENÉTICA Y UI)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    // Reglas actualizadas con Elementos compatibles con la base de datos moderna
    const reactorRules = {
        "1": { 
            reqRarity: "Común", cost: 100, probCrit: 3, probNorm: 35, probStag: 35, 
            resCrit: { rarity: "Épico", name: "Mutante Primordial", color: "#8A2BE2", shape: "estrella", element: "Sintético" },
            resNorm: { rarity: "Raro", name: "Geno Evolucionado", color: "#4169E1", shape: "frijol", element: "Cibernético" },
            resStag: { rarity: "Común", name: "Superviviente", color: "#32CD32", shape: "gota", element: "Biomutante" }
        },
        "2": { 
            reqRarity: "Raro", cost: 500, probCrit: 0.5, probNorm: 25, probStag: 35, 
            resCrit: { rarity: "Legendario", name: "Anomalía Leyenda", color: "#FFD700", shape: "estrella", element: "Radiactivo" },
            resNorm: { rarity: "Épico", name: "Geno Superior", color: "#8A2BE2", shape: "estrella", element: "Sintético" },
            resStag: { rarity: "Raro", name: "Veterano Raro", color: "#4169E1", shape: "frijol", element: "Cibernético" }
        },
        "3": { 
            reqRarity: "Épico", cost: 2500, probCrit: 0.1, probNorm: 5, probStag: 40, 
            resCrit: { rarity: "Mítico", name: "Dios Primigenio", color: "#ff4d4d", shape: "estrella", element: "Viral" },
            resNorm: { rarity: "Legendario", name: "Mito Viviente", color: "#FFD700", shape: "estrella", element: "Radiactivo" },
            resStag: { rarity: "Épico", name: "Titán Épico", color: "#8A2BE2", shape: "estrella", element: "Sintético" }
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
        
        const descEl = document.getElementById("reactor-description");
        if(descEl) descEl.innerText = `Fusiona 5 Genos ${reglas.reqRarity}s para intentar crear 1 Geno ${reglas.resNorm.rarity}.`;
        
        const reqNameEl = document.getElementById("reactor-req-name");
        if(reqNameEl) reqNameEl.innerText = reglas.reqRarity + "s";
        
        const costEl = document.getElementById("reactor-cost-display");
        if(costEl) costEl.innerText = reglas.cost + " ✨";

        const genosDisponibles = window.misGenos.filter(g => g.rarity === reglas.reqRarity && !g.isEgg && (!window.miMascota || window.miMascota.id !== g.id));
        
        const countEl = document.getElementById("alchemy-common-count");
        if(countEl) countEl.innerText = genosDisponibles.length;
        
        const containerSlots = document.getElementById("reactor-slots-container");
        if(containerSlots) {
            containerSlots.innerHTML = "";
            
            for(let i=0; i<5; i++) {
                const slot = document.createElement("div");
                // UI Modernizada (Neon/Dark)
                slot.style = "width: 50px; height: 50px; border: 2px dashed #384a5e; border-radius: 8px; display: flex; justify-content: center; align-items: center; background: rgba(26, 42, 54, 0.6); cursor: pointer; position: relative; transition: all 0.2s;";
                
                if (window.genosEnReactor[i]) {
                    const geno = window.genosEnReactor[i];
                    
                    // Renderizado SVG nativo y limpio
                    const pColor = geno.color || geno.base_color || "#ccc";
                    let svg = typeof window.generarSvgGeno === 'function' ? window.generarSvgGeno(geno) : '';
                    svg = svg.replace(/<svg[^>]*>/, '<svg width="100%" height="100%" viewBox="-20 0 200 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">');
                    
                    slot.innerHTML = `<div style="width: 40px; height: 40px; color: ${pColor}; display: flex; justify-content: center; align-items: center;">${svg}</div>`;
                    slot.style.border = "2px solid #8B5CF6";
                    slot.style.background = "rgba(139, 92, 246, 0.15)";
                    slot.style.boxShadow = "0 0 10px rgba(139, 92, 246, 0.4)";
                    
                    slot.addEventListener("click", () => {
                        window.genosEnReactor.splice(i, 1);
                        window.renderizarAlquimia();
                    });
                } else {
                    slot.innerHTML = '<span style="color: #384a5e; font-size: 24px; font-weight: bold;">+</span>';
                }
                containerSlots.appendChild(slot);
            }
        }

        const containerDisponibles = document.getElementById("reactor-available-genos");
        if(containerDisponibles) {
            containerDisponibles.innerHTML = "";
            
            const genosLibres = genosDisponibles.filter(g => !window.genosEnReactor.find(enR => enR.id === g.id));
            
            if (genosLibres.length === 0) {
                containerDisponibles.innerHTML = '<span style="color: #64748b; font-size: 12px; margin: auto; font-style: italic;">No hay sujetos disponibles.</span>';
            } else {
                genosLibres.forEach(geno => {
                    const card = document.createElement("div");
                    card.style = "min-width: 50px; height: 50px; background: #1a2a36; border: 1px solid #4dd0e1; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.1s;";
                    
                    const pColor = geno.color || geno.base_color || "#ccc";
                    let svg = typeof window.generarSvgGeno === 'function' ? window.generarSvgGeno(geno) : '';
                    svg = svg.replace(/<svg[^>]*>/, '<svg width="100%" height="100%" viewBox="-20 0 200 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">');
                    
                    card.innerHTML = `<div style="width: 40px; height: 40px; color: ${pColor}; display: flex; justify-content: center; align-items: center;">${svg}</div>`;
                    
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
        }

        const btnFuse = document.getElementById("btn-fuse-genos");
        if(btnFuse) {
            const tieneEsencia = window.miInventario && window.miInventario.vitalEssence >= reglas.cost;
            const estanLos5 = window.genosEnReactor.length === 5;
            btnFuse.disabled = !(estanLos5 && tieneEsencia);
            
            if(!btnFuse.disabled) {
                btnFuse.style.background = "linear-gradient(90deg, #8B5CF6, #D500F9)";
                btnFuse.style.opacity = "1";
                btnFuse.style.cursor = "pointer";
            } else {
                btnFuse.style.background = "#333";
                btnFuse.style.opacity = "0.5";
                btnFuse.style.cursor = "not-allowed";
            }
        }
    }

    const btnFuseGenos = document.getElementById("btn-fuse-genos");
    if(btnFuseGenos) {
        btnFuseGenos.addEventListener("click", () => {
            const nivel = selectNivel.value;
            const reglas = reactorRules[nivel];
            
            if (window.genosEnReactor.length === 5 && window.miInventario && window.miInventario.vitalEssence >= reglas.cost) {
                const btnFuse = document.getElementById("btn-fuse-genos");
                const containerSlots = document.getElementById("reactor-slots-container");
                
                // Consumir esencia
                if(typeof window.miInventario.addEssence === 'function') {
                    window.miInventario.addEssence(-reglas.cost);
                } else {
                    window.miInventario.vitalEssence -= reglas.cost;
                    if(typeof window.miInventario.updateUI === 'function') window.miInventario.updateUI();
                }
                
                // Destruir los 5 Genos sacrificados
                const idsABorrar = window.genosEnReactor.map(g => g.id);
                window.misGenos = window.misGenos.filter(g => !idsABorrar.includes(g.id));
                
                btnFuse.disabled = true;
                btnFuse.innerText = "SINTETIZANDO ADN...";
                btnFuse.style.background = "#D500F9";
                btnFuse.style.cursor = "wait";
                
                let toggle = false;
                const animacionReactor = setInterval(() => {
                    toggle = !toggle;
                    containerSlots.style.transform = toggle ? "scale(1.05)" : "scale(0.95)";
                    containerSlots.style.filter = toggle ? "drop-shadow(0 0 15px #8B5CF6) brightness(1.3)" : "none";
                }, 150);

                setTimeout(() => {
                    clearInterval(animacionReactor);
                    containerSlots.style.transform = "scale(1)";
                    containerSlots.style.filter = "none";
                    
                    const tirada = Math.random() * 100;
                    let mensaje = "";
                    
                    const limiteCritico = reglas.probCrit;
                    const limiteNormal = limiteCritico + reglas.probNorm;
                    const limiteEstancada = limiteNormal + reglas.probStag;

                    // Función Helper para crear el Geno con ADN moderno V14
                    const inyectarNuevoMutante = (resultado) => {
                        const statsBase = window.generarStatsPorRareza ? window.generarStatsPorRareza(resultado.rarity) : { hp: 50, atk: 15, def: 10, spd: 15, luk: 15 };
                        
                        const nuevoId = typeof window.generarNuevoID === 'function' ? window.generarNuevoID() : Date.now();
                        const prefijos = ["Neo", "Bio", "Geno", "Cyto", "Viro", "Rad", "Syn", "Evo", "Nexo", "Mut"];
                        const sufijos = ["-X", "-Prime", "morph", "cyte", "tron", "plasm", "-7", "core", "gen", "-Z"];
                        const nombreAleatorio = prefijos[Math.floor(Math.random() * prefijos.length)] + sufijos[Math.floor(Math.random() * sufijos.length)];
                        
                        const mutante = {
                            id: nuevoId,
                            name: resultado.name !== "Titán Épico" && resultado.name !== "Veterano Raro" ? resultado.name : nombreAleatorio,
                            rarity: resultado.rarity,
                            element: resultado.element,
                            base_color: resultado.color, color: resultado.color,
                            body_shape: resultado.shape, eye_type: "estandar", mouth_type: "feliz",
                            wing_type: "ninguno", hat_type: "ninguno",
                            level: 1, xp: 0, xpNeeded: 100, breedCount: 0, generation: 0,
                            stats: statsBase,
                            hidden_genes: window.generarGenesV9 ? window.generarGenesV9(resultado.rarity) : {A:null, B:null, C:null},
                            scanned: false,
                            genes: {
                                cuerpo: { dom: resultado.shape, rec: resultado.shape },
                                ojos: { dom: "estandar", rec: "estandar" },
                                boca: { dom: "feliz", rec: "feliz" },
                                espalda: { dom: "ninguno", rec: "ninguno" },
                                cabeza: { dom: "ninguno", rec: "ninguno" },
                                afinidad: { dom: resultado.element, rec: resultado.element }
                            }
                        };
                        window.misGenos.push(mutante);
                    };

                    if (tirada < limiteCritico) {
                        inyectarNuevoMutante(reglas.resCrit);
                        mensaje = `¡ÉXITO CRÍTICO! 🌟\nEl Reactor ha creado una anomalía: [Geno ${reglas.resCrit.rarity}].`;
                    } else if (tirada < limiteNormal) { 
                        inyectarNuevoMutante(reglas.resNorm);
                        mensaje = `¡FUSIÓN ESTABLE! ✨\nHas obtenido un [Geno ${reglas.resNorm.rarity}].`;
                    } else if (tirada < limiteEstancada) { 
                        inyectarNuevoMutante(reglas.resStag);
                        mensaje = `MUTACIÓN ESTANCADA ⚠️\nLa inestabilidad destruyó a 4, pero lograste recuperar 1 [Geno ${reglas.resStag.rarity}].`;
                    } else {
                        const compensacion = reglas.cost * 1.5; 
                        if(typeof window.miInventario.addEssence === 'function') {
                            window.miInventario.addEssence(compensacion);
                        } else {
                            window.miInventario.vitalEssence += compensacion;
                            if(typeof window.miInventario.updateUI === 'function') window.miInventario.updateUI();
                        }
                        mensaje = `¡COLAPSO DEL REACTOR! 💥\nLos 5 Genos se desintegraron. Recuperas ${compensacion} ✨ de los restos irradiados.`;
                    }

                    setTimeout(() => {
                        alert(mensaje);
                        window.genosEnReactor = []; 
                        btnFuse.innerText = "ACTIVAR REACTOR";
                        window.renderizarAlquimia();
                        
                        // Guardar siempre después del gacha
                        if (typeof window.guardarJuego === 'function') window.guardarJuego();
                        else if (typeof window.guardarProgreso === 'function') window.guardarProgreso();
                        
                    }, 100);
                }, 2500);
            }
        });
    }
});