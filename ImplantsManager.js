// =========================================
// ImplantsManager.js - LÓGICA DE INSTALACIÓN V11 (FIX NAVEGACIÓN)
// =========================================

window.ImplantsManager = {
    currentTab: 'combat',
    targetSlot: null,

    init: function() {
        ImplantsUI.inyectarCSS();
        ImplantsUI.renderBase();
        this.refreshPreview();
        this.updateSlotLabels();
    },

    setTab: function(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.lab-tab').forEach(t => t.classList.remove('active'));
        if(typeof event !== 'undefined' && event.target) event.target.classList.add('active');

        document.getElementById('combat-slots').style.display = tab === 'combat' ? 'grid' : 'none';
        document.getElementById('cosmetic-slots').style.display = tab === 'cosmetic' ? 'grid' : 'none';
    },

    refreshPreview: function() {
        const preview = document.getElementById("implants-geno-preview");
        const statsBox = document.getElementById("implants-geno-stats");
        if (!preview || !statsBox || !window.miMascota) return;

        preview.innerHTML = generarSvgGeno(window.miMascota);
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
        
        let inv = window.inventory || window.inventario || [];
        const modulos = inv.filter(item => item.type === "MT");

        if (modulos.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align:center; color:#888; padding:20px;">
                    No tienes Módulos de Combate (MT) en tu mochila.
                </div>`;
            return;
        }

        listContainer.innerHTML = "";
        modulos.forEach((item, index) => {
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
                    <strong style="color:#fff; font-size:12px;">${item.name}</strong>
                    <span style="color:#ffd700; font-size:11px;">${costo} ✨ EV</span>
                </div>
                <div style="font-size:10px; color:#aaa; margin-top:4px;">${item.description}</div>
                ${!compatible ? '<div style="color:#ff6b6b; font-size:9px; margin-top:2px;">Incompatible con este Slot o Elemento</div>' : ''}
            `;

            if (compatible) {
                itemDiv.onclick = () => this.installModule(item, index);
            }
            listContainer.appendChild(itemDiv);
        });
    },

    checkCompatibility: function(item, slot) {
        const geno = window.miMascota;
        if (slot === 'atk_4') {
            return item.subType === "Definitivo" && item.element === geno.element;
        }
        const contrarios = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
        if (contrarios[item.element] === geno.element) {
             return item.tier === "Básico";
        }
        return true;
    },

    calculateCost: function(item) {
        let base = item.evCost || 100;
        const geno = window.miMascota;
        const contrarios = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };

        if (item.element === geno.element) return Math.floor(base * 0.7); 
        if (contrarios[item.element] === geno.element) return Math.floor(base * 1.2); 
        return base;
    },

    installModule: function(item, inventoryIndex) {
        const costo = this.calculateCost(item);
        
        // FIX: Variable temporal de Esencia, se actualizará cuando me compartas el archivo correcto.
        let currentEV = window.vitalEssence || window.esenciaVital || 0;
        
        if (currentEV < costo) {
            alert(`No tienes suficiente Esencia Vital (✨ EV). Necesitas ${costo}.`);
            return;
        }

        if (confirm(`¿Instalar ${item.name} por ${costo} ✨ EV? El módulo se consumirá.`)) {
            if(window.vitalEssence !== undefined) window.vitalEssence -= costo;
            else if(window.esenciaVital !== undefined) window.esenciaVital -= costo;
            
            if (window.updateHUD) window.updateHUD();

            window.miMascota.ataques[this.targetSlot] = {
                id: item.id_ataque,
                nombre: item.name,
                element: item.element,
                power: item.power
            };

            let inv = window.inventory || window.inventario || [];
            inv.splice(inventoryIndex, 1);
            if (window.saveGame) window.saveGame();

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
        window.navegarA('room-area');
    }
};