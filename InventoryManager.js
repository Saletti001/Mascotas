// =========================================
// InventoryManager.js - SISTEMA DE ALMACÉN Y EMERGENCIA
// =========================================

class InventoryManager {
    constructor() {
        this.maxSlots = 10; 
        this.overflowSlots = 2; // NUEVO: 2 Slots de Emergencia
        this.items = []; // Renombrado de 'slots' a 'items' para compatibilidad global
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
            }
            .emergency-slot::after {
                content: "⚠️"; position: absolute; top: -5px; right: -5px; font-size: 12px;
            }
            .inventory-slot { position: relative; margin-bottom: 15px; } /* Espacio para el timer */
        `;
        document.head.appendChild(style);
    }

    addEssence(amount) {
        this.vitalEssence += amount;
        this.updateUI();
    }

    addItem(newItem) {
        if (newItem.id === "vital_essence") {
            this.addEssence(newItem.count || 1);
            return true;
        }

        let limit = this.stackLimits[newItem.type] || 1;
        
        // Buscar si ya existe el ítem y no está lleno (y que no esté en zona de emergencia)
        let existingSlot = this.items.find(slot => slot.id === newItem.id && slot.count < limit && !slot.isOverflow);

        if (existingSlot) {
            existingSlot.count += (newItem.count || 1);
        } else {
            const totalCapacity = this.maxSlots + this.overflowSlots;
            
            if (this.items.length < this.maxSlots) {
                // Hay espacio normal
                this.items.push({ ...newItem, count: newItem.count || 1 });
            } else if (this.items.length < totalCapacity) {
                // Está lleno, va a emergencia (24 horas)
                this.items.push({ 
                    ...newItem, 
                    count: newItem.count || 1,
                    isOverflow: true,
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas en milisegundos
                });
            } else {
                alert("🎒 ¡Almacén y Espacios de Emergencia LLENOS!\nDebes destruir algo para hacer espacio.");
                return false; 
            }
        }
        
        this.reorganize(); // Revisa si puede salvar ítems
        this.updateUI();
        this.renderGrid();
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
            this.reorganize(); // Si liberamos espacio, salvamos ítems de emergencia
            this.updateUI();
            this.renderGrid();
        }
    }

    // ✨ NUEVO: Si liberas espacio, los ítems en emergencia se mueven a la zona segura
    reorganize() {
        for(let i = 0; i < this.items.length; i++) {
            if (i < this.maxSlots && this.items[i].isOverflow) {
                // ¡El ítem entró a la zona segura!
                delete this.items[i].isOverflow;
                delete this.items[i].expiresAt;
            }
        }
    }

    updateUI() {
        const counter = document.getElementById("slot-counter");
        if (counter) {
            let color = "#444";
            if (this.items.length >= this.maxSlots) color = "#ff9800"; // Naranja si usa emergencia
            if (this.items.length >= (this.maxSlots + this.overflowSlots)) color = "#d9534f"; // Rojo si está full full
            
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
            
            // Si es un slot de emergencia (> 9)
            if (i >= this.maxSlots) {
                slotDiv.classList.add("emergency-slot");
            }
            
            if (this.items[i]) {
                const item = this.items[i];
                slotDiv.innerHTML = item.icon;
                
                if (item.count > 1) {
                    const countSpan = document.createElement("span");
                    countSpan.className = "item-count";
                    countSpan.innerText = item.count;
                    slotDiv.appendChild(countSpan);
                }

                // ✨ NUEVO: Mostrar el temporizador si está en emergencia
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

        // ✨ NUEVO: MOTOR DE CADUCIDAD EN TIEMPO REAL (Corre cada segundo)
        setInterval(() => {
            let hasExpiredItems = false;
            
            this.items.forEach((item, index) => {
                if (item.isOverflow && item.expiresAt) {
                    const restante = item.expiresAt - Date.now();
                    
                    if (restante <= 0) {
                        hasExpiredItems = true; // Se acabó el tiempo
                    } else {
                        // Actualizar UI del contador si el inventario está abierto
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

            // Si alguien expiró, lo borramos de la matriz principal
            if (hasExpiredItems) {
                const prevCount = this.items.length;
                this.items = this.items.filter(item => !item.isOverflow || !item.expiresAt || item.expiresAt > Date.now());
                
                if (this.items.length < prevCount) {
                    this.selectedIndex = null;
                    this.updateUI();
                    this.renderGrid();
                    // Opcional: Sonido de error o alerta
                    console.log("⚠️ Un ítem en la zona de emergencia ha sido destruido por falta de espacio.");
                }
            }
        }, 1000);
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