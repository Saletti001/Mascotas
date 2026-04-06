class InventoryManager {
    constructor() {
        this.maxSlots = 10; 
        this.slots = []; // Ahora guardará objetos complejos con cantidades
        this.stackLimits = {
            basic: 99,
            consumable: 20, // Las manzanas usarán este límite
            equipment: 1
        };
    }

    // NUEVA FUNCIÓN: La inteligencia del inventario
    addItem(newItem) {
        let limit = this.stackLimits[newItem.type] || 1;
        
        // 1. Buscamos si ya tenemos este objeto y si aún no llega al límite de 20
        let existingSlot = this.slots.find(slot => slot.id === newItem.id && slot.count < limit);

        if (existingSlot) {
            // Si existe y hay espacio, sumamos 1 a ese montón
            existingSlot.count++;
        } else {
            // 2. Si no existe o el montón de 20 está lleno, intentamos usar un nuevo espacio vacío
            if (this.slots.length < this.maxSlots) {
                // Clonamos el objeto y le ponemos cantidad 1
                this.slots.push({ ...newItem, count: 1 });
            } else {
                // 3. Si no hay espacios vacíos, la mochila está llena
                alert("¡Bolsillos Rotos al límite! Debes liberar espacio.");
                return false; 
            }
        }
        
        // Refrescamos los gráficos
        this.updateUI();
        this.renderGrid();
        return true;
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

    renderGrid() {
        const grid = document.getElementById("inventory-grid");
        if (!grid) return;
        
        grid.innerHTML = ""; 

        for (let i = 0; i < this.maxSlots; i++) {
            const slotDiv = document.createElement("div");
            slotDiv.className = "inventory-slot";
            
            // Si hay un objeto guardado en esta posición del array
            if (this.slots[i]) {
                const item = this.slots[i];
                // Dibujamos el emoji
                slotDiv.innerHTML = item.icon;
                slotDiv.style.borderStyle = "solid";
                slotDiv.style.borderColor = "#999";
                
                // Si hay más de 1, dibujamos el numerito en la esquina
                if (item.count > 1) {
                    const countSpan = document.createElement("span");
                    countSpan.className = "item-count";
                    countSpan.innerText = item.count;
                    slotDiv.appendChild(countSpan);
                }
            }
            
            grid.appendChild(slotDiv);
        }
    }

    setupEvents() {
        const backpackBtn = document.getElementById("inventory-ui");
        const modal = document.getElementById("inventory-modal");
        const closeBtn = document.getElementById("close-inventory");
        const testBtn = document.getElementById("test-add-apple"); // NUEVO BOTÓN

        if (backpackBtn && modal && closeBtn) {
            backpackBtn.addEventListener("click", () => {
                this.renderGrid(); 
                modal.classList.remove("hidden"); 
            });

            closeBtn.addEventListener("click", () => {
                modal.classList.add("hidden"); 
            });
        }

        // Lógica al hacer clic en el botón de prueba
        if (testBtn) {
            testBtn.addEventListener("click", () => {
                // Definimos cómo es una Manzana para el código
                const manzana = { 
                    id: "apple_01", 
                    icon: "🍎", 
                    type: "consumable" 
                };
                this.addItem(manzana);
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