class InventoryManager {
    constructor() {
        this.maxSlots = 10; 
        this.slots = []; 
        this.stackLimits = {
            basic: 99,
            consumable: 20,
            equipment: 1
        };
        this.selectedIndex = null; 
    }

    addItem(newItem) {
        let limit = this.stackLimits[newItem.type] || 1;
        let existingSlot = this.slots.find(slot => slot.id === newItem.id && slot.count < limit);

        if (existingSlot) {
            existingSlot.count++;
        } else {
            if (this.slots.length < this.maxSlots) {
                this.slots.push({ ...newItem, count: 1 });
            } else {
                alert("¡Bolsillos Rotos al límite! Debes liberar espacio.");
                return false; 
            }
        }
        
        this.updateUI();
        this.renderGrid();
        return true;
    }

    // NUEVA FUNCIÓN: Consumir objetos desde el exterior (ej. Alimentar)
    consumeItem(itemId, amount = 1) {
        // Buscamos si tenemos el objeto
        let index = this.slots.findIndex(slot => slot.id === itemId);
        
        // Si existe y tenemos cantidad suficiente
        if (index !== -1 && this.slots[index].count >= amount) {
            this.removeItem(index, amount);
            return true; // Éxito
        }
        return false; // Fallo (no hay objeto)
    }

    removeItem(index, amount) {
        if (this.slots[index]) {
            this.slots[index].count -= amount;
            
            if (this.slots[index].count <= 0) {
                this.slots.splice(index, 1); 
                this.selectedIndex = null; 
                const actions = document.getElementById("item-actions");
                if(actions) actions.classList.add("hidden");
            }
            
            this.updateUI();
            this.renderGrid();
        }
    }

    updateUI() {
        const counter = document.getElementById("slot-counter");
        if (counter) {
            counter.innerHTML = `${this.slots.length}/${this.maxSlots}<br>SLOTS`;
            counter.style.color = this.slots.length >= this.maxSlots ? "#d9534f" : "#444";
        }
    }

    renderGrid() {
        const grid = document.getElementById("inventory-grid");
        const actionsPanel = document.getElementById("item-actions");
        const infoText = document.getElementById("selected-item-info");

        if (!grid) return;
        grid.innerHTML = ""; 

        for (let i = 0; i < this.maxSlots; i++) {
            const slotDiv = document.createElement("div");
            slotDiv.className = "inventory-slot";
            
            if (this.slots[i]) {
                const item = this.slots[i];
                slotDiv.innerHTML = item.icon;
                slotDiv.style.borderStyle = "solid";
                slotDiv.style.borderColor = "#999";
                
                if (item.count > 1) {
                    const countSpan = document.createElement("span");
                    countSpan.className = "item-count";
                    countSpan.innerText = item.count;
                    slotDiv.appendChild(countSpan);
                }

                slotDiv.addEventListener("click", () => {
                    this.selectedIndex = i;
                    this.renderGrid(); 
                    
                    if(infoText) infoText.innerText = `Seleccionado: ${item.icon} (Cant: ${item.count})`;
                    if(actionsPanel) actionsPanel.classList.remove("hidden");
                });

                if (this.selectedIndex === i) {
                    slotDiv.classList.add("selected");
                }
            }
            
            grid.appendChild(slotDiv);
        }
    }

    setupEvents() {
        const backpackBtn = document.getElementById("inventory-ui");
        const modal = document.getElementById("inventory-modal");
        const closeBtn = document.getElementById("close-inventory");
        const testBtn = document.getElementById("test-add-apple"); 
        const btnReleaseOne = document.getElementById("btn-release-one");
        const btnReleaseAll = document.getElementById("btn-release-all");

        if (backpackBtn && modal && closeBtn) {
            backpackBtn.addEventListener("click", () => {
                this.renderGrid(); 
                modal.classList.remove("hidden"); 
            });

            closeBtn.addEventListener("click", () => {
                modal.classList.add("hidden"); 
                const actions = document.getElementById("item-actions");
                if(actions) actions.classList.add("hidden");
                this.selectedIndex = null;
            });
        }

        if (testBtn) {
            testBtn.addEventListener("click", () => {
                this.addItem({ id: "apple_01", icon: "🍎", type: "consumable" });
            });
        }

        if (btnReleaseOne) {
            btnReleaseOne.addEventListener("click", () => {
                if (this.selectedIndex !== null) this.removeItem(this.selectedIndex, 1);
            });
        }

        if (btnReleaseAll) {
            btnReleaseAll.addEventListener("click", () => {
                if (this.selectedIndex !== null) this.removeItem(this.selectedIndex, this.slots[this.selectedIndex].count);
            });
        }
    }

    init() {
        this.updateUI();
        this.setupEvents();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // NUEVO: La hacemos "window." para que app.js pueda hablar con el inventario
    window.miInventario = new InventoryManager();
    window.miInventario.init();
});