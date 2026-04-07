class InventoryManager {
    constructor() {
        this.maxSlots = 10; 
        this.slots = []; 
        this.vitalEssence = 0; // NUEVA MONEDA
        this.stackLimits = {
            basic: 99,
            consumable: 20,
            equipment: 1
        };
        this.selectedIndex = null; 
    }

    // NUEVA FUNCIÓN: Para añadir moneda
    addEssence(amount) {
        this.vitalEssence += amount;
        this.updateUI();
    }

    addItem(newItem) {
        // Si por error enviamos Esencia Vital aquí, la redirigimos
        if (newItem.id === "vital_essence") {
            this.addEssence(newItem.count || 1);
            return true;
        }

        let limit = this.stackLimits[newItem.type] || 1;
        let existingSlot = this.slots.find(slot => slot.id === newItem.id && slot.count < limit);

        if (existingSlot) {
            existingSlot.count += (newItem.count || 1); // Solucionado: Suma la cantidad exacta
        } else {
            if (this.slots.length < this.maxSlots) {
                this.slots.push({ ...newItem, count: newItem.count || 1 });
            } else {
                alert("¡Mochila llena! Debes tirar algo para hacer espacio.");
                return false; 
            }
        }
        
        this.updateUI();
        this.renderGrid();
        return true;
    }

    consumeItem(itemId, amount = 1) {
        let index = this.slots.findIndex(slot => slot.id === itemId);
        if (index !== -1 && this.slots[index].count >= amount) {
            this.removeItem(index, amount);
            return true;
        }
        return false;
    }

    removeItem(index, amount) {
        if (this.slots[index]) {
            this.slots[index].count -= amount;
            if (this.slots[index].count <= 0) {
                this.slots.splice(index, 1); 
                this.selectedIndex = null; 
                if(document.getElementById("item-actions")) document.getElementById("item-actions").classList.add("hidden");
            }
            this.updateUI();
            this.renderGrid();
        }
    }

    updateUI() {
        // Actualizar slots
        const counter = document.getElementById("slot-counter");
        if (counter) {
            counter.innerHTML = `${this.slots.length}/${this.maxSlots}<br>SLOTS`;
            counter.style.color = this.slots.length >= this.maxSlots ? "#d9534f" : "#444";
        }
        // Actualizar moneda
        const essenceDisplay = document.getElementById("vital-essence-amount");
        if (essenceDisplay) {
            essenceDisplay.innerText = `✨ ${this.vitalEssence}`;
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
                
                if (item.count > 1) {
                    const countSpan = document.createElement("span");
                    countSpan.className = "item-count";
                    countSpan.innerText = item.count;
                    slotDiv.appendChild(countSpan);
                }
                
                // LÓGICA DE SELECCIÓN Y DESELECCIÓN (TOGGLE)
                slotDiv.addEventListener("click", () => {
                    if (this.selectedIndex === i) {
                        // Si ya estaba seleccionado, lo deseleccionamos
                        this.selectedIndex = null;
                        if(actionsPanel) actionsPanel.classList.add("hidden");
                    } else {
                        // Si es uno nuevo, lo seleccionamos
                        this.selectedIndex = i;
                        if(actionsPanel) actionsPanel.classList.remove("hidden");
                        if(infoText) infoText.innerText = `Seleccionado: ${item.name}`;
                    }
                    this.renderGrid(); 
                });
                
                if (this.selectedIndex === i) {
                    slotDiv.classList.add("selected");
                    if(infoText) infoText.innerText = `Seleccionado: ${item.name}`;
                }
            }
            grid.appendChild(slotDiv);
        }

        // Si no hay nada seleccionado, ocultamos el panel por seguridad
        if (this.selectedIndex === null && actionsPanel) {
            actionsPanel.classList.add("hidden");
        }
    }

    setupEvents() {
        document.getElementById("inventory-ui").addEventListener("click", () => {
            this.renderGrid(); 
            document.getElementById("inventory-modal").classList.remove("hidden"); 
        });
        
        document.getElementById("close-inventory").addEventListener("click", () => {
            document.getElementById("inventory-modal").classList.add("hidden"); 
            this.selectedIndex = null;
            // Ocultar botones al cerrar con la X
            const actionsPanel = document.getElementById("item-actions");
            if(actionsPanel) actionsPanel.classList.add("hidden");
        });
        
        document.getElementById("btn-release-one").addEventListener("click", () => {
            if (this.selectedIndex !== null) this.removeItem(this.selectedIndex, 1);
        });
        
        document.getElementById("btn-release-all").addEventListener("click", () => {
            if (this.selectedIndex !== null) this.removeItem(this.selectedIndex, this.slots[this.selectedIndex].count);
        });
    }

    init() {
        this.updateUI();
        this.setupEvents();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.miInventario = new InventoryManager();
    window.miInventario.init();
});