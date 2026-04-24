// =========================================
// ImplantsManager.js - LÓGICA DEL LABORATORIO V2
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
        event.target.classList.add('active');

        document.getElementById('combat-slots').style.display = tab === 'combat' ? 'grid' : 'none';
        document.getElementById('cosmetic-slots').style.display = tab === 'cosmetic' ? 'grid' : 'none';
    },

    refreshPreview: function() {
        const preview = document.getElementById("implants-geno-preview");
        const statsBox = document.getElementById("implants-geno-stats");
        
        if (!preview || !statsBox) return; // Seguro anti-crasheo

        if (window.miMascota && typeof generarSvgGeno === 'function') {
            let svgStr = generarSvgGeno(window.miMascota);
            
            // Renderizamos el SVG y lo forzamos a ocupar el 100% de su contenedor
            preview.innerHTML = svgStr;
            let svgNode = preview.querySelector("svg");
            if (svgNode) {
                svgNode.setAttribute("width", "100%");
                svgNode.setAttribute("height", "100%");
                svgNode.setAttribute("viewBox", "-20 -10 200 180");
            }
            
            // Render de Stats Básicas
            const stats = window.miMascota.stats || {hp:0, atk:0, spd:0, luk:0};
            statsBox.innerHTML = `
                <div style="text-align:center; font-weight:bold; color:#fff; margin-bottom:10px; font-size:14px; text-transform:uppercase;">
                    ${window.miMascota.name || "Geno"} <span style="color:#4dd0e1; font-size:11px;">(Nv. ${window.miMascota.level || 1})</span>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; font-size:12px; color:#80deea; text-align:center; gap:8px;">
                    <div style="background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; border:1px solid #333;">❤️ ${stats.hp}</div>
                    <div style="background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; border:1px solid #333;">⚔️ ${stats.atk}</div>
                    <div style="background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; border:1px solid #333;">⚡ ${stats.spd}</div>
                    <div style="background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; border:1px solid #333;">🍀 ${stats.luk}</div>
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

        // Aquí conectaremos con InventoryManager.js en el futuro
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
    }
};

// =========================================
// HOOK DE NAVEGACIÓN SEGURO
// =========================================
if (!window.implantsNavHooked) {
    window.navegarA_Original_Implants = window.navegarA;
    window.navegarA = function(id) {
        // Primero ejecutamos la navegación normal del juego (que oculta las pantallas)
        if (typeof window.navegarA_Original_Implants === 'function') {
            window.navegarA_Original_Implants(id);
        }
        
        // Si el destino es Implantes, inicializamos el renderizado
        if (id === 'implants-area') {
            ImplantsManager.init();
        }
    };
    window.implantsNavHooked = true;
}