// =========================================
// ImplantsManager.js - LÓGICA DEL LABORATORIO V7 (FIX ESTILOS DUROS)
// =========================================

window.ImplantsManager = {
    currentTab: 'combat',
    targetSlot: null,

    init: function() {
        ImplantsUI.inyectarCSS();
        ImplantsUI.renderBase();
        this.refreshPreview();
    },

    setTab: function(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.lab-tab').forEach(t => t.classList.remove('active'));
        if(typeof event !== 'undefined' && event.target) {
            event.target.classList.add('active');
        }

        document.getElementById('combat-slots').style.display = tab === 'combat' ? 'grid' : 'none';
        document.getElementById('cosmetic-slots').style.display = tab === 'cosmetic' ? 'grid' : 'none';
    },

    refreshPreview: function() {
        const preview = document.getElementById("implants-geno-preview");
        const statsBox = document.getElementById("implants-geno-stats");
        
        if (!preview || !statsBox) return;

        if (window.miMascota && typeof generarSvgGeno === 'function') {
            let svgStr = generarSvgGeno(window.miMascota);
            
            preview.innerHTML = svgStr;
            let svgNode = preview.querySelector("svg");
            if (svgNode) {
                svgNode.setAttribute("width", "100%");
                svgNode.setAttribute("height", "100%");
                svgNode.setAttribute("viewBox", "-20 -10 200 180");
            }
            
            const stats = window.miMascota.stats || {hp:0, atk:0, spd:0, luk:0};
            
            // FIX: Usamos las clases CSS limpias para que el modo móvil pueda ajustarlas
            statsBox.innerHTML = `
                <div class="geno-lab-name">
                    ${window.miMascota.name || "Geno"} <span>(Nv. ${window.miMascota.level || 1})</span>
                </div>
                <div class="geno-lab-stats">
                    <div>❤️ ${stats.hp}</div>
                    <div>⚔️ ${stats.atk}</div>
                    <div>⚡ ${stats.spd}</div>
                    <div>🍀 ${stats.luk}</div>
                </div>
            `;
        }
    },

    openSelector: function(slot) {
        this.targetSlot = slot;
        const selector = document.getElementById('lab-inventory-selector');
        const listContainer = document.getElementById('lab-inventory-list');
        
        if(!selector || !listContainer) return;
        
        selector.style.display = 'block';
        listContainer.innerHTML = `<p style="font-size:12px; color:#aaa; text-align:center;">Buscando en tu mochila...</p>`;

        setTimeout(() => {
            listContainer.innerHTML = `
                <div style="text-align:center; color:#888; font-size:13px; padding:20px; background:rgba(0,0,0,0.3); border-radius:8px;">
                    No tienes módulos compatibles en tu inventario.
                </div>`;
        }, 400);
    },

    closeSelector: function() {
        let sel = document.getElementById('lab-inventory-selector');
        if(sel) sel.style.display = 'none';
    },

    closeLab: function() {
        const impScreen = document.getElementById('implants-area');
        if(impScreen) {
            impScreen.classList.add('hidden');
            impScreen.style.setProperty('display', 'none', 'important');
        }
        window.navegarA('room-area');
    }
};

// HOOK DE NAVEGACIÓN
if (!window.implantsNavHooked) {
    window.navegarA_Original_Implants = window.navegarA;
    window.navegarA = function(id) {
        const impScreen = document.getElementById('implants-area');
        if (impScreen) {
            if (id === 'implants-area') {
                impScreen.classList.remove('hidden');
                impScreen.style.setProperty('display', 'block', 'important');
                ImplantsManager.init();
            } else {
                impScreen.classList.add('hidden');
                impScreen.style.setProperty('display', 'none', 'important');
            }
        }
        if (typeof window.navegarA_Original_Implants === 'function') {
            window.navegarA_Original_Implants(id);
        }
    };
    window.implantsNavHooked = true;
}