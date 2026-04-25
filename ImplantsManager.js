// =========================================
// ImplantsManager.js - LÓGICA DE INSTALACIÓN V14 (ESCÁNER DE INVENTARIO INFALIBLE)
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
        
        const s = window.miMascota.stats || {hp:0, atk:0, spd:0, luk:0};
        statsBox.innerHTML = `
            <div class="geno-lab-name">${window.miMascota.name || "Geno"} <span>(Nv. ${window.miMascota.level || 1})</span></div>
            <div class="geno-lab-stats">
                <div>❤️ ${s.hp}</div><div>⚔️ ${s.atk}</div><div>⚡ ${s.spd}</div><div>🍀 ${s.luk}</div>
            </div>
        `;
    },

    updateSlotLabels: function() {
        if (!window.miMascota) return;
        if (!window.miMascota.ataques) {
            window.miMascota.ataques = { atk_1: null, atk_2: null, atk_3: null, atk_4: null };
        }
        
        for (let i = 1; i <= 3; i++) {
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
    },

    openSelector: function(slot) {
        this.targetSlot = slot;
        const selector = document.getElementById('lab-inventory-selector');
        const listContainer = document.getElementById('lab-inventory-list');
        if(!selector || !listContainer) return;
        
        selector.style.display = 'block';
        
        // =========================================
        // FIX: ESCÁNER A PRUEBA DE BALAS
        // =========================================
        let invArray = [];
        if (window.miInventario) {
            // Busca en ambas listas posibles por si el guardado las movió
            invArray = window.miInventario.slots || window.miInventario.items || [];
        }

        // Filtra buscando "MT", "mt", o si simplemente el objeto tiene la propiedad 'id_ataque'
        const modulos = invArray
            .map((item, originalIndex) => ({ ...item, originalIndex }))
            .filter(item => item.type === "MT" || item.type === "mt" || typeof item.id_ataque !== 'undefined');

        if (modulos.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align:center; color:#888; padding:20px;">
                    No tienes Módulos de Combate (MT) en tu mochila.
                </div>`;
            return;
        }

        listContainer.innerHTML = "";
        modulos.forEach(item => {
            const compatible = this.checkCompatibility(item, slot);
            const costo = this.calculateCost(item);
            
            const itemDiv = document.createElement("div");
            itemDiv.style = `
                background: rgba(255,255,255,0.05); padding: 10px; margin-bottom: 8px; border-radius: 6px;
                border: 1px solid ${compatible ? '#00acc1' : '#555'};
                opacity: ${compatible ? '1' : '0.5'};
                cursor: ${compatible ? 'pointer' : 'not-allowed'};
            `;

            itemDiv.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#fff; font-size:12px;">${item.name || 'MT Desconocida'}</strong>
                    <span style="color:#ffd700; font-size:11px;">${costo} ✨ EV</span>
                </div>
                <div style="font-size:10px; color:#aaa; margin-top:4px;">${item.description || item.desc || ''}</div>
                ${!compatible ? '<div style="color:#ff6b6b; font-size:9px; margin-top:2px;">Incompatible con este Slot o Elemento</div>' : ''}
            `;

            if (compatible) {
                itemDiv.onclick = () => this.installModule(item, item.originalIndex);
            }
            listContainer.appendChild(itemDiv);
        });
    },

    checkCompatibility: function(item, slot) {
        const geno = window.miMascota;
        if (!geno) return false;
        
        // Slot 4 solo Definitivos del mismo elemento
        if (slot === 'atk_4') {
            return item.subType === "Definitivo" && item.element === geno.element;
        }
        
        // Regla de penalización para elementos contrarios
        const contrarios = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
        if (contrarios[item.element] === geno.element) {
             return item.tier === "Básico" || item.subType === "Básico"; // Failsafe adicional
        }
        return true;
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

    installModule: function(item, originalIndex) {
        if (!window.miInventario) return;
        
        const costo = this.calculateCost(item);
        let currentEV = window.miInventario.vitalEssence || 0;
        
        if (currentEV < costo) {
            alert(`No tienes suficiente Esencia Vital (✨ EV). Tienes ${currentEV} y necesitas ${costo}.`);
            return;
        }

        if (confirm(`¿Instalar ${item.name} por ${costo} ✨ EV? El módulo se consumirá.`)) {
            
            // 1. Cobrar EV y actualizar visualmente de forma estricta
            window.miInventario.vitalEssence -= costo;
            window.miInventario.updateUI(); 
            
            const domEl = document.getElementById("vital-essence-amount");
            if (domEl) domEl.innerText = `✨ ${window.miInventario.vitalEssence}`;

            // 2. Equipar el ataque al Geno
            if (!window.miMascota.ataques) window.miMascota.ataques = {};
            window.miMascota.ataques[this.targetSlot] = {
                id: item.id_ataque || item.id,
                nombre: item.name,
                element: item.element,
                power: item.power || 0
            };

            // 3. Eliminar el disco de la mochila
            window.miInventario.removeItem(originalIndex, 1);

            // 4. Guardar Partida 
            if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

            alert("¡Módulo instalado con éxito!");
            this.closeSelector();
            this.updateSlotLabels();
        }
    },

    closeSelector: function() {
        let sel = document.getElementById('lab-inventory-selector');
        if(sel) sel.style.display = 'none';
    },

    closeLab: function() {
        const impScreen = document.getElementById('implants-area');
        if(impScreen) {
            impScreen.classList.add('hidden');
        }
        if (typeof window.navegarA === 'function') {
            window.navegarA('room-area');
        }
    }
};

// HOOK DE NAVEGACIÓN
if (!window.implantsNavHooked) {
    window.navegarA_Original_Implants = window.navegarA;
    window.navegarA = function(id) {
        if (typeof window.navegarA_Original_Implants === 'function') {
            window.navegarA_Original_Implants(id);
        }
        
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