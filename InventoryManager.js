class InventoryManager {
    constructor() {
        this.maxSlots = 10; 
        this.slots = []; 
        this.stackLimits = {
            basic: 99,
            consumable: 20,
            equipment: 1
        };
    }

    updateUI() {
        const counter = document.getElementById("slot-counter");
        if (counter) {
            counter.innerHTML = `${this.slots.length}/${this.maxSlots}<br>SLOTS`;
            
            if (this.slots.length >= this.maxSlots) {
                counter.style.color = "#d9534f"; 
            } else {
                counter.style.color = "#444";
            }
        }
    }

    // Dibuja los cuadritos en blanco dentro de la ventana
    renderGrid() {
        const grid = document.getElementById("inventory-grid");
        if (!grid) return;
        
        grid.innerHTML = ""; // Limpiamos antes de redibujar

        for (let i = 0; i < this.maxSlots; i++) {
            const slotDiv = document.createElement("div");
            slotDiv.className = "inventory-slot";
            
            // Si en el futuro hay un objeto en este slot, lo dibujamos
            if (this.slots[i]) {
                slotDiv.innerHTML = this.slots[i].icon;
                slotDiv.style.borderStyle = "solid";
                slotDiv.style.borderColor = "#999";
            }
            
            grid.appendChild(slotDiv);
        }
    }

    // Configura los clics de los botones
    setupEvents() {
        const backpackBtn = document.getElementById("inventory-ui");
        const modal = document.getElementById("inventory-modal");
        const closeBtn = document.getElementById("close-inventory");

        if (backpackBtn && modal && closeBtn) {
            // Al hacer clic en el icono de la mochila
            backpackBtn.addEventListener("click", () => {
                this.renderGrid(); 
                modal.classList.remove("hidden"); // Muestra la ventana
            });

            // Al hacer clic en la X
            closeBtn.addEventListener("click", () => {
                modal.classList.add("hidden"); // Oculta la ventana
            });
        }
    }

    init() {
        this.updateUI();
        this.setupEvents();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const miInventario = new InventoryManager();
    miInventario.init();
});