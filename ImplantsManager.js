// =========================================
// ImplantsManager.js - V22 (MOTOR DE EQUIPAR Y DESEQUIPAR REAL)
// =========================================

window.ImplantsManager = {
    currentTab: 'combat',
    targetSlot: null,

    init: function() {
        if(typeof ImplantsUI !== 'undefined') {
            ImplantsUI.inyectarCSS();
            ImplantsUI.renderBase();
        }
        this.refreshPreview();
        this.updateSlotLabels();
    },

    setTab: function(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.lab-tab').forEach(t => t.classList.remove('active'));
        if(typeof event !== 'undefined' && event.target) event.target.classList.add('active');

        const combatSlots = document.getElementById('combat-slots');
        const cosmeticSlots = document.getElementById('cosmetic-slots');
        if(combatSlots) combatSlots.style.display = tab === 'combat' ? 'grid' : 'none';
        if(cosmeticSlots) cosmeticSlots.style.display = tab === 'cosmetic' ? 'grid' : 'none';
    },

    refreshPreview: function() {
        const preview = document.getElementById("implants-geno-preview");
        const statsBox = document.getElementById("implants-geno-stats");
        if (!preview || !statsBox || !window.miMascota) return;

        preview.innerHTML = typeof generarSvgGeno === 'function' ? generarSvgGeno(window.miMascota) : '';
        let svgNode = preview.querySelector("svg");
        if (svgNode) {
            svgNode.setAttribute("width", "100%");
            svgNode.setAttribute("height", "100%");
            svgNode.setAttribute("viewBox", "-20 -10 200 180");
        }
        
        // FIX V22: Stats eliminados para diseño más limpio
        statsBox.innerHTML = `<div class="geno-lab-name">${window.miMascota.name || "Geno"} <span>(Nv. ${window.miMascota.level || 1})</span></div>`;
    },

    updateSlotLabels: function() {
        if (!window.miMascota) return;
        
        if (!window.miMascota.ataques) window.miMascota.ataques = { atk_1: null, atk_2: null, atk_3: null, atk_4: null };
        
        const ataquesBasicos = {
            "Biomutante": "PULSO VITAL", "Viral": "DESCARGA VIRAL", "Cibernético": "LÁSER DE PRECISIÓN",
            "Radiactivo": "PROYECTIL RADIACTIVO", "Tóxico": "COLMILLO VENENOSO", "Sintético": "RÁFAGA SINTÉTICA"
        };
        const el1 = document.getElementById(`slot-atk-1`);
        if (el1) el1.innerText = window.miMascota.element ? (ataquesBasicos[window.miMascota.element] || "GOLPE BÁSICO") : "GOLPE BÁSICO";

        for (let i = 2; i <= 3; i++) {
            const atk = window.miMascota.ataques[`atk_${i}`];
            let el = document.getElementById(`slot-atk-${i}`);
            if(el) el.innerText = atk ? atk.nombre.toUpperCase() : "VACÍO";
        }
        
        const def = window.miMascota.ataques.atk_4;
        const slot4 = document.getElementById(`slot-atk-4`);
        if (slot4 && window.miMascota.level >= 25) {
            slot4.innerText = def ? def.nombre.toUpperCase() : "VACÍO";
            slot4.parentElement.style.opacity = "1";
            slot4.parentElement.style.cursor = "pointer";
            slot4.parentElement.onclick = () => this.openSelector('atk_4');
        }

        const m = window.miMascota;
        const headEl = document.getElementById('slot-head');
        if(headEl) headEl.innerText = m.hat_type && m.hat_type !== "ninguno" ? m.hat_type.replace(/_/g, ' ').toUpperCase() : "VACÍO";
        
        const backEl = document.getElementById('slot-back');
        if(backEl) backEl.innerText = m.wing_type && m.wing_type !== "ninguno" ? m.wing_type.replace(/_/g, ' ').toUpperCase() : "VACÍO";
        
        const skinEl = document.getElementById('slot-skin');
        if(skinEl) skinEl.innerText = m.skin_type && m.skin_type !== "estandar" ? m.skin_type.replace(/_/g, ' ').toUpperCase() : "ESTÁNDAR";
        
        const auraEl = document.getElementById('slot-aura');
        if(auraEl) auraEl.innerText = m.aura_type && m.aura_type !== "ninguno" ? m.aura_type.replace(/_/g, ' ').toUpperCase() : "VACÍO";
    },

    // ✨ FIX V22: Busca qué hay equipado para devolverlo a la mochila
    getItemToUnequip: function(slot, isCosmetic) {
        if (!window.miMascota) return null;
        if (isCosmetic) {
            const propMap = { head: 'hat_type', back: 'wing_type', skin: 'skin_type', aura: 'aura_type' };
            const currentVal = window.miMascota[propMap[slot]];
            if (currentVal && currentVal !== 'ninguno' && currentVal !== 'estandar') {
                let item = window.miMascota.cosmeticos && window.miMascota.cosmeticos[slot];
                if (!item) {
                    // Si se equipó antes del update, lo reconstruimos para que no se pierda
                    item = { id: "cos_" + slot + "_" + Date.now(), name: currentVal.replace(/_/g, ' ').toUpperCase(), icon: "📦", type: "Cosmético", subType: slot, maxStack: 1, evCost: 0, id_cosmetico: currentVal };
                }
                return item;
            }
        } else {
            if (window.miMascota.ataques && window.miMascota.ataques[slot]) {
                const atk = window.miMascota.ataques[slot];
                let item = atk.itemData;
                if (!item) {
                    item = { id: atk.id + "_" + Date.now(), name: atk.nombre, icon: "💿", type: "MT", subType: slot === 'atk_4' ? "Definitivo" : (slot === 'atk_2' ? 'Técnica' : 'Soporte'), element: atk.element, maxStack: 1, id_ataque: atk.id, power: atk.power, evCost: 0 };
                }
                return item;
            }
        }
        return null;
    },

    // ✨ FIX V22: Desequipar un ítem de forma manual (Botón rojo)
    unequipCurrent: function(slot, isCosmetic) {
        if (!window.miInventario || !window.miMascota) return;

        const itemToReturn = this.getItemToUnequip(slot, isCosmetic);
        if (!itemToReturn) return;

        // Intentar añadir a la mochila
        const added = window.miInventario.addItem(itemToReturn);
        if (!added) return; // Si la mochila está llena, el addItem ya tiró el alert. Paramos aquí.

        // Si se añadió con éxito, limpiamos al Geno
        if (isCosmetic) {
            const propMap = { head: 'hat_type', back: 'wing_type', skin: 'skin_type', aura: 'aura_type' };
            window.miMascota[propMap[slot]] = (slot === 'skin' ? 'estandar' : 'ninguno');
            if (window.miMascota.cosmeticos) delete window.miMascota.cosmeticos[slot];
        } else {
            window.miMascota.ataques[slot] = null;
        }

        this.syncAndSave();
        this.closeSelector();
        this.updateSlotLabels();
        this.refreshPreview();
    },

    openSelector: function(slot) {
        this.targetSlot = slot;
        const selector = document.getElementById('lab-inventory-selector');
        const listContainer = document.getElementById('lab-inventory-list');
        if(!selector || !listContainer) return;
        
        selector.style.display = 'block';
        listContainer.innerHTML = "";
        
        const isCosmetic = ['head', 'back', 'skin', 'aura'].includes(slot);

        // ✨ FIX V22: Detectar si ya hay algo equipado para mostrar botón de "DESEQUIPAR"
        const itemEquipado = this.getItemToUnequip(slot, isCosmetic);
        if (itemEquipado && slot !== 'atk_1') {
            const unequipBtn = document.createElement("div");
            unequipBtn.style = "background: rgba(217, 83, 79, 0.2); padding: 10px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #d9534f; cursor: pointer; text-align: center; color: #ff6b6b; font-weight: bold; font-size: 12px; transition: 0.2s;";
            unequipBtn.innerText = "❌ DESEQUIPAR ACTUAL";
            unequipBtn.onmouseover = () => unequipBtn.style.background = "rgba(217, 83, 79, 0.4)";
            unequipBtn.onmouseout = () => unequipBtn.style.background = "rgba(217, 83, 79, 0.2)";
            unequipBtn.onclick = () => this.unequipCurrent(slot, isCosmetic);
            listContainer.appendChild(unequipBtn);
        }

        let invArray = window.miInventario ? (window.miInventario.slots || window.miInventario.items || []) : [];
        const modulos = invArray
            .map((item, originalIndex) => ({ ...item, originalIndex }))
            .filter(item => {
                if (isCosmetic) {
                    return (item.type === "Cosmético" || item.type === "cosmetico") && item.subType === slot;
                } else {
                    return item.type === "MT" || item.type === "mt" || typeof item.id_ataque !== 'undefined';
                }
            });

        if (modulos.length === 0) {
            const emptyMsg = document.createElement("div");
            emptyMsg.style = "text-align:center; color:#888; padding:20px;";
            emptyMsg.innerText = `No tienes ${isCosmetic ? 'Equipo compatible' : 'Módulos de Combate (MT)'} en tu Almacén Nexo.`;
            listContainer.appendChild(emptyMsg);
            return;
        }

        modulos.forEach(item => {
            const compatible = isCosmetic ? true : this.checkCompatibility(item, slot);
            const costo = item.evCost || 0; 
            const tipoEtiqueta = item.subType || 'MOD';
            const colorTipo = isCosmetic ? '#fbcfe8' : (tipoEtiqueta === 'Soporte' ? '#77DD77' : (tipoEtiqueta === 'Definitivo' ? '#ff9800' : '#b19cd9'));
            
            const itemDiv = document.createElement("div");
            itemDiv.style = `background: rgba(255,255,255,0.05); padding: 10px; margin-bottom: 8px; border-radius: 6px; border: 1px solid ${compatible ? '#00acc1' : '#555'}; opacity: ${compatible ? '1' : '0.5'}; cursor: ${compatible ? 'pointer' : 'not-allowed'};`;

            itemDiv.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                    <strong style="color:#fff; font-size:12px;">${item.name || 'Desconocido'}</strong>
                    <span style="color:#ffd700; font-size:11px; font-weight:bold;">${costo > 0 ? costo + ' ✨ EV' : 'GRATIS'}</span>
                </div>
                <div style="display:flex; gap: 5px; margin-bottom: 6px;">
                    ${item.element ? `<span style="background:rgba(0,172,193,0.2); color:#80deea; padding:2px 6px; border-radius:4px; font-size:9px; text-transform:uppercase; border: 1px solid rgba(0,172,193,0.5);">${item.element}</span>` : ''}
                    <span style="background:rgba(255,255,255,0.1); color:${colorTipo}; padding:2px 6px; border-radius:4px; font-size:9px; text-transform:uppercase; border: 1px solid ${colorTipo};">${tipoEtiqueta}</span>
                </div>
                <div style="font-size:10px; color:#aaa;">${item.description || item.desc || ''}</div>
                ${!compatible ? '<div style="color:#ff6b6b; font-size:9px; margin-top:4px;">Incompatible con este Slot o Elemento</div>' : ''}
            `;

            if (compatible) itemDiv.onclick = () => this.installModule(item, item.originalIndex, isCosmetic);
            listContainer.appendChild(itemDiv);
        });
    },

    checkCompatibility: function(item, slot) {
        const geno = window.miMascota;
        if (!geno) return false;

        // Slot 1: El ataque básico es innato, no se puede cambiar por inventario
        if (slot === 'atk_1') return false;

        // Slot 4: Definitivos. Regla estricta: Solo del mismo elemento y Geno Nivel 25+
        if (slot === 'atk_4') {
            return (item.subType === "Definitivo" && item.element === geno.element && geno.level >= 25);
        }

        // Slot 3: Soportes / Tácticas. Regla estricta: 100% Universales (Ignoran el elemento)
        if (slot === 'atk_3') {
            return (item.subType === "Soporte" || item.tier === "Soporte");
        }

        // Slot 2: Especiales. 
        if (slot === 'atk_2') {
            // No podemos equipar ni Soportes ni Definitivos en el slot de Especiales
            if (item.subType === "Soporte" || item.tier === "Soporte" || item.subType === "Definitivo") return false;

            // Regla del GDD: Los ataques Especiales del elemento CONTRARIO directo están prohibidos.
            const contrarios = { 
                "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", 
                "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" 
            };
            
            // Si el MT es la debilidad de tu Geno, o tu Geno es la debilidad del MT, es incompatible
            if (contrarios[item.element] === geno.element || contrarios[geno.element] === item.element) {
                return false; 
            }

            // Si es de su mismo elemento o de un elemento adyacente, sí es compatible
            return true;
        }

        return false;
    },

    calculateCost: function(item) {
        let base = item.evCost || 100;
        const geno = window.miMascota;
        if (!geno) return base;
        const contrarios = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
        if (item.element === geno.element) return Math.floor(base * 0.7); 
        if (contrarios[item.element] === geno.element) return Math.floor(base * 1.2); 
        return base;
    },

    syncAndSave: function() {
        if (window.misGenos) {
            const index = window.misGenos.findIndex(g => String(g.id) === String(window.miMascota.id));
            if (index !== -1) window.misGenos[index] = window.miMascota;
        }
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();
    },

    closeSelector: function() {
        let sel = document.getElementById('lab-inventory-selector');
        if(sel) sel.style.display = 'none';
    },

    closeLab: function() {
        const impScreen = document.getElementById('implants-area');
        if(impScreen) impScreen.classList.add('hidden');
        
        if (window.miMascota && typeof generarSvgGeno === 'function') {
            window.miMascota.svg = generarSvgGeno(window.miMascota);
            const pedestal = document.getElementById("geno-container");
            if (pedestal) {
                pedestal.innerHTML = `<div class="geno-idle" style="color: ${window.miMascota.color}; top: 50%; left: 50%; display: flex; justify-content: center; align-items: center;">${window.miMascota.svg}</div>`;
            }
        }

        if (typeof window.navegarA === 'function') window.navegarA('room-area');
    }
};

if (!window.implantsNavHooked) {
    window.navegarA_Original_Implants = window.navegarA;
    window.navegarA = function(id) {
        if (typeof window.navegarA_Original_Implants === 'function') window.navegarA_Original_Implants(id);
        const impScreen = document.getElementById('implants-area');
        if (impScreen) {
            if (id === 'implants-area') {
                impScreen.classList.remove('hidden');
                if (typeof ImplantsManager !== 'undefined') ImplantsManager.init();
            } else {
                impScreen.classList.add('hidden');
            }
        }
    };
    window.implantsNavHooked = true;
}