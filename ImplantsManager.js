// =========================================
// ImplantsManager.js - LÓGICA DEL LABORATORIO
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
        if (window.miMascota && typeof generarSvgGeno === 'function') {
            preview.innerHTML = generarSvgGeno(window.miMascota);
            
            // Render de Stats
            const stats = window.miMascota.stats;
            document.getElementById("implants-geno-stats").innerHTML = `
                <div style="display:grid; grid-template-columns: 1fr 1fr; font-size:11px; color:#80deea; text-align:center; gap:5px;">
                    <div style="background:rgba(0,0,0,0.3); padding:5px;">VIT: ${stats.hp}</div>
                    <div style="background:rgba(0,0,0,0.3); padding:5px;">FUE: ${stats.atk}</div>
                    <div style="background:rgba(0,0,0,0.3); padding:5px;">AGI: ${stats.spd}</div>
                    <div style="background:rgba(0,0,0,0.3); padding:5px;">SUE: ${stats.luk}</div>
                </div>
            `;
        }
    },

    openSelector: function(slot) {
        this.targetSlot = slot;
        const selector = document.getElementById('lab-inventory-selector');
        const listContainer = document.getElementById('lab-inventory-list');
        selector.style.display = 'block';
        
        listContainer.innerHTML = `<p style="font-size:12px; color:#aaa;">Buscando en tu mochila...</p>`;

        // Aquí conectaremos con InventoryManager para mostrar los items tipo MT o Cosméticos
        // Por ahora, simulamos una lista vacía
        setTimeout(() => {
            listContainer.innerHTML = `<p style="text-align:center; color:#888; font-size:13px;">No tienes implantes compatibles en tu inventario.</p>`;
        }, 500);
    },

    closeSelector: function() {
        document.getElementById('lab-inventory-selector').style.display = 'none';
    }
};

// Conexión con el sistema de navegación
window.navegarA_Original = window.navegarA;
window.navegarA = function(id) {
    if (id === 'implants-area') {
        ImplantsManager.init();
    }
    window.navegarA_Original(id);
};