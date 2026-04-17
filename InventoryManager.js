// =========================================
// InventoryManager.js - SISTEMA DE ALMACÉN Y EMERGENCIA
// =========================================

class InventoryManager {
    constructor() {
        this.maxSlots = 10; 
        this.overflowSlots = 2; // 2 Slots de Emergencia
        this.items = []; 
        this.vitalEssence = 0; 
        this.stackLimits = {
            basic: 99,
            consumable: 20,
            equipment: 1,
            bio_nucleo: 1
        };
        this.selectedIndex = null; 

        // 🛠️ INYECCIÓN CSS PARA LOS SLOTS DE EMERGENCIA
        const style = document.createElement('style');
        style.innerHTML = `
            .emergency-slot {
                border: 2px dashed #d9534f !important;
                background: rgba(217, 83, 79, 0.1) !important;
                box-shadow: inset 0 0 10px rgba(217, 83, 79, 0.2);
                position: relative;
            }
            .inventory-slot { position: relative; margin-bottom: 15px; } /* Espacio para el timer */
        `;
        document.head.appendChild(style);
    }

    // ✨ NUEVO: Avisa al sistema de guardado (app.js o SaveManager.js) que hubo cambios
    guardarCambios() {
        if (typeof window.guardarJuego === 'function') window.guardarJuego();
        else if (typeof window.guardarProgreso === 'function') window.guardarProgreso();
    }

    addEssence(amount) {
        this.vitalEssence += amount;
        this.updateUI();
        this.guardarCambios(); // Guardar
    }

    addItem(newItem) {
        if (newItem.id === "vital_essence") {
            this.addEssence(newItem.count || 1);
            return true;
        }

        let limit = this.stackLimits[newItem.type] || 1;
        
        let existingSlot = this.items.find(slot => slot.id === newItem.id && slot.count < limit && !slot.isOverflow);

        if (existingSlot) {
            existingSlot.count += (newItem.count || 1);
        } else {
            const totalCapacity = this.maxSlots + this.overflowSlots;
            
            if (this.items.length < this.maxSlots) {
                this.items.push({ ...newItem, count: newItem.count || 1 });
            } else if (this.items.length < totalCapacity) {
                this.items.push({ 
                    ...newItem, 
                    count: newItem.count || 1,
                    isOverflow: true,
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000) 
                });
            } else {
                alert("🎒 ¡Almacén y Espacios de Emergencia LLENOS!\nDebes destruir algo para hacer espacio.");
                return false; 
            }
        }
        
        this.reorganize(); 
        this.updateUI();
        this.renderGrid();
        this.guardarCambios(); // Guardar
        return true;
    }

    consumeItem(itemId, amount = 1) {
        let index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1 && this.items[index].count >= amount) {
            this.removeItem(index, amount);
            return true;
        }
        return false;
    }

    removeItem(index, amount) {
        if (this.items[index]) {
            this.items[index].count -= amount;
            if (this.items[index].count <= 0) {
                this.items.splice(index, 1); 
                this.selectedIndex = null; 
                if(document.getElementById("item-actions")) document.getElementById("item-actions").classList.add("hidden");
            }
            this.reorganize(); 
            this.updateUI();
            this.renderGrid();
            this.guardarCambios(); // Guardar
        }
    }

    reorganize() {
        for(let i = 0; i < this.items.length; i++) {
            if (i < this.maxSlots && this.items[i].isOverflow) {
                delete this.items[i].isOverflow;
                delete this.items[i].expiresAt;
            }
        }
    }

    updateUI() {
        const counter = document.getElementById("slot-counter");
        if (counter) {
            let color = "#444";
            if (this.items.length >= this.maxSlots) color = "#ff9800"; 
            if (this.items.length >= (this.maxSlots + this.overflowSlots)) color = "#d9534f"; 
            
            counter.innerHTML = `${this.items.length}/${this.maxSlots}<br>SLOTS`;
            counter.style.color = color;
        }
        
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

        const totalSlotsToDraw = this.maxSlots + this.overflowSlots;

        for (let i = 0; i < totalSlotsToDraw; i++) {
            const slotDiv = document.createElement("div");
            slotDiv.className = "inventory-slot";
            
            if (i >= this.maxSlots) {
                slotDiv.classList.add("emergency-slot");
            }
            
            if (this.items[i]) {
                const item = this.items[i];
                slotDiv.innerHTML = item.icon;
                
                const svgInSlot = slotDiv.querySelector('svg');
                if (svgInSlot) {
                    svgInSlot.style.width = "100%";
                    svgInSlot.style.height = "100%";
                    svgInSlot.style.display = "block";
                    if (item.color) svgInSlot.style.color = item.color;
                }

                if (item.count > 1) {
                    const countSpan = document.createElement("span");
                    countSpan.className = "item-count";
                    countSpan.innerText = item.count;
                    slotDiv.appendChild(countSpan);
                }

                if (item.isOverflow && item.expiresAt) {
                    const timerSpan = document.createElement("div");
                    timerSpan.id = `timer-item-${i}`;
                    timerSpan.style = "position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); font-size: 9px; color: #ff6b6b; font-weight: bold; width: 100%; text-align: center; background: rgba(0,0,0,0.8); border-radius: 4px; padding: 2px; white-space: nowrap;";
                    slotDiv.appendChild(timerSpan);
                }
                
                slotDiv.addEventListener("click", () => {
                    if (this.selectedIndex === i) {
                        this.selectedIndex = null;
                        if(actionsPanel) actionsPanel.classList.add("hidden");
                    } else {
                        this.selectedIndex = i;
                        if(actionsPanel) actionsPanel.classList.remove("hidden");
                        if(infoText) infoText.innerText = `Seleccionado: ${item.name} ${item.isOverflow ? '(EMERGENCIA)' : ''}`;
                    }
                    this.renderGrid(); 
                });
                
                if (this.selectedIndex === i) {
                    slotDiv.classList.add("selected");
                    if(infoText) infoText.innerText = `Seleccionado: ${item.name} ${item.isOverflow ? '(EMERGENCIA)' : ''}`;
                }
            }
            grid.appendChild(slotDiv);
        }

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
            const actionsPanel = document.getElementById("item-actions");
            if(actionsPanel) actionsPanel.classList.add("hidden");
        });
        
        document.getElementById("btn-release-one").addEventListener("click", () => {
            if (this.selectedIndex !== null) this.removeItem(this.selectedIndex, 1);
        });
        
        document.getElementById("btn-release-all").addEventListener("click", () => {
            if (this.selectedIndex !== null) this.removeItem(this.selectedIndex, this.items[this.selectedIndex].count);
        });

        setInterval(() => {
            let hasExpiredItems = false;
            
            this.items.forEach((item, index) => {
                if (item.isOverflow && item.expiresAt) {
                    const restante = item.expiresAt - Date.now();
                    
                    if (restante <= 0) {
                        hasExpiredItems = true; 
                    } else {
                        const label = document.getElementById(`timer-item-${index}`);
                        if (label) {
                            const h = Math.floor(restante / 3600000);
                            const m = Math.floor((restante % 3600000) / 60000);
                            const s = Math.floor((restante % 60000) / 1000);
                            label.innerText = `${h}h ${m}m ${s}s`;
                        }
                    }
                }
            });

            if (hasExpiredItems) {
                const prevCount = this.items.length;
                this.items = this.items.filter(item => !item.isOverflow || !item.expiresAt || item.expiresAt > Date.now());
                
                if (this.items.length < prevCount) {
                    this.selectedIndex = null;
                    this.updateUI();
                    this.renderGrid();
                    this.guardarCambios(); // Guardar
                    console.log("⚠️ Un ítem en la zona de emergencia ha sido destruido por falta de espacio.");
                }
            }
        }, 1000);
    }

    injectDebugButton() {
        const header = document.querySelector("#inventory-modal .modal-header");
        if (header && !document.getElementById("btn-debug-fill")) {
            const btnFill = document.createElement("button");
            btnFill.id = "btn-debug-fill";
            btnFill.innerText = "🧪 Test Llenar";
            btnFill.style = "background: #ff9800; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white; font-weight: bold; margin-left: auto; margin-right: 15px;";
            
            header.insertBefore(btnFill, document.getElementById("close-inventory"));

            btnFill.addEventListener("click", () => {
                let added = 0;
                while (this.items.length < this.maxSlots) {
                    this.addItem({
                        id: "caja_test_" + Date.now() + Math.random(),
                        name: "Caja de Suministros",
                        icon: "📦",
                        type: "basic",
                        maxStack: 1,
                        desc: "Ítem de relleno para testear."
                    });
                    added++;
                }
                if (added > 0) {
                    alert("🎒 Inventario lleno. ¡Ve al Centro de Crianza y sintetiza un Bio-Núcleo para ver cómo entra en Emergencia!");
                } else {
                    alert("El inventario ya está lleno.");
                }
            });
        }
    }

    init() {
        this.updateUI();
        this.setupEvents();
        this.injectDebugButton(); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // ✨ NUEVO: Rescatamos los datos que SaveManager haya cargado previamente
    const datosGuardados = window.miInventario; 

    window.miInventario = new InventoryManager();

    // Re-inyectamos los ítems y la esencia si existían
    if (datosGuardados) {
        if (datosGuardados.items) window.miInventario.items = datosGuardados.items;
        if (datosGuardados.vitalEssence) window.miInventario.vitalEssence = datosGuardados.vitalEssence;
    }

    window.miInventario.init();
});