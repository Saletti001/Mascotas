// =========================================
// InventoryManager.js - ALMACÉN CON EXPANSIÓN DEV AUTOMÁTICA
// =========================================

class InventoryManager {
    constructor() {
        this.maxSlots = 10;
        this.overflowSlots = 2; 
        this.slots = [];
        this.vitalEssence = 0; 
        this.stackLimits = {
            basic: 99,
            consumable: 20,
            equipment: 1,
            bio_nucleo: 1
        };
        this.selectedIndex = null; 

        const style = document.createElement('style');
        style.innerHTML = `
            .emergency-slot {
                border: 2px dashed #d9534f !important;
                background: rgba(217, 83, 79, 0.1) !important;
                box-shadow: inset 0 0 10px rgba(217, 83, 79, 0.2);
                position: relative;
            }
            .inventory-slot { position: relative; margin-bottom: 15px; } 
        `;
        document.head.appendChild(style);
    }

    guardarCambios() {
        if (typeof window.guardarJuego === 'function') window.guardarJuego();
        else if (typeof window.guardarProgreso === 'function') window.guardarProgreso();
    }

    addEssence(amount) {
        this.vitalEssence += amount;
        this.updateUI();
        this.guardarCambios();
    }

    addItem(newItem) {
        if (newItem.id === "vital_essence") {
            this.addEssence(newItem.count || 1);
            return true;
        }

        let limit = this.stackLimits[newItem.type] || 1;
        let existingSlot = this.slots.find(slot => slot && slot.id === newItem.id && slot.count < limit && !slot.isOverflow);
        
        if (existingSlot) {
            existingSlot.count += (newItem.count || 1);
        } else {
            const totalCapacity = this.maxSlots + this.overflowSlots;
            if (this.slots.length < this.maxSlots) {
                this.slots.push({ ...newItem, count: newItem.count || 1 });
            } else if (this.slots.length < totalCapacity) {
                this.slots.push({ 
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
        this.guardarCambios();
        return true;
    }

    consumeItem(itemId, amount = 1) {
        let index = this.slots.findIndex(item => item.id === itemId);
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
            this.reorganize(); 
            this.updateUI();
            this.renderGrid();
            this.guardarCambios();
        }
    }

    reorganize() {
        this.slots = this.slots.filter(s => s !== null && s !== undefined);
        for(let i = 0; i < this.slots.length; i++) {
            if (i < this.maxSlots && this.slots[i].isOverflow) {
                delete this.slots[i].isOverflow;
                delete this.slots[i].expiresAt;
            }
        }
    }

    updateUI() {
        const counter = document.getElementById("slot-counter");
        if (counter) {
            let color = "#444";
            if (this.slots.length >= this.maxSlots) color = "#ff9800"; 
            if (this.slots.length >= (this.maxSlots + this.overflowSlots)) color = "#d9534f"; 
            
            counter.innerHTML = `${this.slots.length}/${this.maxSlots}<br>SLOTS`;
            counter.style.color = color;
        }
        
        const essenceDisplay = document.getElementById("vital-essence-amount");
        if (essenceDisplay) {
            // Inyectamos solo el número, el SVG ya vive en el index.html
            essenceDisplay.innerText = this.vitalEssence;
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
            
            if (this.slots[i]) {
                const item = this.slots[i];
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
            if (this.selectedIndex !== null) this.removeItem(this.selectedIndex, this.slots[this.selectedIndex].count);
        });
        const btnUse = document.getElementById("btn-use-item");
        if (btnUse) {
            btnUse.addEventListener("click", () => {
                if (this.selectedIndex !== null) {
                    const item = this.slots[this.selectedIndex];
                    this.usarItem(item);
                }
            });
        }
        
        setInterval(() => {
            let hasExpiredItems = false;
            
            this.slots.forEach((item, index) => {
                if (!item) return;
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
                const prevCount = this.slots.length;
                this.slots = this.slots.filter(item => item && (!item.isOverflow || !item.expiresAt || item.expiresAt > Date.now()));
                if (this.slots.length < prevCount) {
                    this.selectedIndex = null;
                    this.updateUI();
                    this.renderGrid();
                    this.guardarCambios();
                    console.log("⚠️ Un ítem de emergencia ha sido destruido por falta de espacio.");
                }
            }
        }, 1000);
    }

    usarItem(item) {
        if (!item) return;

        if (item.id === "apple_01") {
            if (!window.miMascota || window.miMascota.id === "temp") {
                alert("❌ Debes tener un Geno seleccionado como Compañero activo para alimentarlo.");
                return;
            }
            if (window.miMascota.hambre === undefined) window.miMascota.hambre = 100;
            if (window.miMascota.amistad === undefined) window.miMascota.amistad = 0;
            
            window.miMascota.hambre = Math.min(100, window.miMascota.hambre + 20);
            
            const hoy = new Date().toDateString();
            if (!window.miMascota.registroAmistadDiaria) window.miMascota.registroAmistadDiaria = {};
            
            let gananciaExplicita = 0;
            if (window.miMascota.registroAmistadDiaria.alimentacion !== hoy) {
                window.miMascota.registroAmistadDiaria.alimentacion = hoy;
                gananciaExplicita = Math.floor(Math.random() * 3) + 1;
                window.miMascota.amistad = Math.min(100, (window.miMascota.amistad || 0) + gananciaExplicita);
            }
            
            // Sincronizar con misGenos
            if (window.misGenos) {
                const idx = window.misGenos.findIndex(g => String(g.id) === String(window.miMascota.id));
                if (idx !== -1) {
                    window.misGenos[idx].hambre = window.miMascota.hambre;
                    window.misGenos[idx].amistad = window.miMascota.amistad;
                    window.misGenos[idx].registroAmistadDiaria = window.miMascota.registroAmistadDiaria;
                }
            }
            
            this.consumeItem(item.id, 1);
            if (gananciaExplicita > 0) {
                alert(`🍱 Alimentaste a ${window.miMascota.name}. Hambre +20%, ¡Amistad +${gananciaExplicita}!`);
            } else {
                alert(`🍱 Alimentaste a ${window.miMascota.name}. Hambre +20%. (Amistad ya obtenida hoy)`);
            }
            
            if (window.NexoEnergyManager) window.NexoEnergyManager.actualizarUI();
            this.guardarCambios();
            
            // Reproducir efecto y animación
            const contenedor = document.getElementById("geno-container");
            if (contenedor) {
                contenedor.classList.remove("geno-idle");
                contenedor.classList.add("happy-jump");
                setTimeout(() => { contenedor.classList.remove("happy-jump"); contenedor.classList.add("geno-idle"); }, 500);
            }
            if (window.Sonidos) window.Sonidos.play("click");
        } 
        else if (item.id === "ration_auto") {
            window.rationAutoActiveUntil = Date.now() + 24 * 3600 * 1000;
            
            // Set hunger to 100 for all reserve Genos
            if (window.misGenos) {
                window.misGenos.forEach(g => {
                    const isActive = window.miMascota && String(window.miMascota.id) === String(g.id);
                    if (!isActive) {
                        g.hambre = 100;
                    }
                });
            }
            // Sincronizar miMascota
            if (window.miMascota && window.miMascota.id !== "temp" && window.misGenos) {
                const act = window.misGenos.find(g => String(g.id) === String(window.miMascota.id));
                if (act) {
                    window.miMascota.hambre = act.hambre;
                }
            }
            
            this.consumeItem(item.id, 1);
            alert(`🍱 Ración Automática activada por 24h. Todos los Genos en reserva han sido alimentados.`);
            
            if (window.NexoEnergyManager) window.NexoEnergyManager.actualizarUI();
            this.guardarCambios();
            if (window.Sonidos) window.Sonidos.play("click");
        } 
        else if (item.id === "plasma_shower") {
            // Set hygiene to 100 and Amistad (1-3) for all Genos once per day
            const hoy = new Date().toDateString();
            if (window.misGenos) {
                window.misGenos.forEach(g => {
                    g.higiene = 100;
                    if (!g.registroAmistadDiaria) g.registroAmistadDiaria = {};
                    if (g.registroAmistadDiaria.ducha !== hoy) {
                        g.registroAmistadDiaria.ducha = hoy;
                        const ganancia = Math.floor(Math.random() * 3) + 1;
                        g.amistad = Math.min(100, (g.amistad || 0) + ganancia);
                    }
                });
            }
            if (window.miMascota && window.miMascota.id !== "temp" && window.misGenos) {
                const act = window.misGenos.find(g => String(g.id) === String(window.miMascota.id));
                if (act) {
                    window.miMascota.higiene = act.higiene;
                    window.miMascota.amistad = act.amistad;
                    window.miMascota.registroAmistadDiaria = act.registroAmistadDiaria;
                }
            }
            
            this.consumeItem(item.id, 1);
            alert(`🧼 Ducha de Plasma activada. Higiene al 100% y Amistad (1-3 pts) para todos tus Genos elegibles hoy.`);
            
            if (window.NexoEnergyManager) window.NexoEnergyManager.actualizarUI();
            this.guardarCambios();
            if (window.Sonidos) window.Sonidos.play("heal");
        } 
        else {
            alert(`El objeto ${item.name} no se puede usar directamente.`);
        }
    }

    injectDebugButton() {
        const header = document.querySelector("#inventory-modal .modal-header");
        if (header && !document.getElementById("debug-tools-container")) {
            
            const debugContainer = document.createElement("div");
            debugContainer.id = "debug-tools-container";
            debugContainer.style = "display: flex; gap: 8px; margin-left: auto; margin-right: 15px;";
            
            const btnFill = document.createElement("button");
            btnFill.id = "btn-debug-fill";
            btnFill.innerText = "🧪 Llenar";
            btnFill.style = "background: #ff9800; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white; font-weight: bold;";
            btnFill.addEventListener("click", () => {
                let added = 0;
                while (this.slots.length < this.maxSlots) {
                    this.addItem({ id: "caja_test_" + Date.now() + Math.random(), name: "Caja de Suministros", icon: "📦", type: "basic", maxStack: 1, desc: "Ítem de relleno." });
                    added++;
                }
                if (added > 0) alert("🎒 Inventario lleno."); else alert("El inventario ya está lleno.");
            });

            const btnEssence = document.createElement("button");
            btnEssence.id = "btn-debug-essence";
            btnEssence.innerText = "🧪 +1000 ✨";
            btnEssence.style = "background: #8b5cf6; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white; font-weight: bold;";
            btnEssence.addEventListener("click", () => {
                this.addEssence(1000);
            });

            // ✨ BOTÓN 3: LA TIENDA DEV (Expande el Almacén y lee TODO el catálogo dinámicamente)
            const btnDevStore = document.createElement("button");
            btnDevStore.id = "btn-debug-devstore";
            btnDevStore.innerText = "🛒 Tienda Dev";
            btnDevStore.style = "background: #e91e63; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white; font-weight: bold;";
            btnDevStore.addEventListener("click", () => {
                
                // 1. Expandir almacén brutalmente para que todo quepa
                if (this.maxSlots < 100) {
                    this.maxSlots = 100;
                    this.overflowSlots = 10;
                }

                // 2. Base de cosméticos
                const devItems = [
                    { id: "cosm_corona", name: "Corona Rey", icon: "👑", type: "Cosmético", subType: "head", id_cosmetico: "corona_rey", evCost: 0, desc: "Símbolo de realeza.", maxStack: 1 },
                    { id: "cosm_jetpack", name: "Jetpack", icon: "🚀", type: "Cosmético", subType: "back", id_cosmetico: "jetpack", evCost: 0, desc: "Propulsores de combate.", maxStack: 1 },
                    { id: "cosm_dron", name: "Dron Centinela", icon: "🤖", type: "Cosmético", subType: "skin", id_cosmetico: "malla_cibernetica", evCost: 0, desc: "Asistente automatizado.", maxStack: 1 },
                    { id: "cosm_aura", name: "Fuego Solar", icon: "☀️", type: "Cosmético", subType: "aura", id_cosmetico: "fuego_solar", evCost: 0, desc: "Aura de plasma.", maxStack: 1 }
                ];

                // 3. Extraer MÁGICAMENTE los 54 ataques de tu AttackCatalog.js
                if (window.AttackCatalog && window.AttackCatalog.ataquesPorElemento) {
                    const cat = window.AttackCatalog.ataquesPorElemento;
                    for (const [elemento, ramas] of Object.entries(cat)) {
                        
                        if (ramas.especiales) {
                            ramas.especiales.forEach(atk => {
                                devItems.push({ id: "mt_" + atk.id, name: "MT " + atk.nombre, icon: "💿", type: "MT", subType: "Técnica", element: elemento, id_ataque: atk.id, power: atk.potencia || 0, evCost: 0, desc: atk.descripcion, maxStack: 1 });
                            });
                        }
                        if (ramas.soportes) {
                            ramas.soportes.forEach(atk => {
                                devItems.push({ id: "mt_" + atk.id, name: "MT " + atk.nombre, icon: "💿", type: "MT", subType: "Soporte", element: elemento, id_ataque: atk.id, power: atk.potencia || 0, evCost: 0, desc: atk.descripcion, maxStack: 1 });
                            });
                        }
                        if (ramas.definitivos) {
                            ramas.definitivos.forEach(atk => {
                                devItems.push({ id: "mt_" + atk.id, name: "MT " + atk.nombre, icon: "💿", type: "MT", subType: "Definitivo", element: elemento, id_ataque: atk.id, power: atk.potencia || 0, evCost: 0, desc: atk.descripcion, maxStack: 1 });
                            });
                        }
                    }
                } else {
                    alert("⚠️ No se encontró el AttackCatalog. Asegúrate de haberlo reemplazado primero.");
                }

                let added = 0;
                devItems.forEach(item => {
                    // Evitamos duplicados si ya tienes esa MT
                    if (!this.slots.find(s => s.id === item.id)) {
                        if (this.slots.length < this.maxSlots + this.overflowSlots) {
                            this.addItem(item);
                            added++;
                        }
                    }
                });
                
                if(added > 0) alert(`🛒 ¡Almacén expandido a 100 slots! Se inyectaron ${added} objetos únicos. Ve al Laboratorio a ver tu arsenal completo.`);
                else alert("Ya tienes todos los objetos de la Tienda Dev en tu inventario.");
                
                this.updateUI();
                this.renderGrid();
            });

            debugContainer.appendChild(btnDevStore);
            debugContainer.appendChild(btnFill);
            debugContainer.appendChild(btnEssence);
            header.insertBefore(debugContainer, document.getElementById("close-inventory"));
        }
    }

    init() {
        if (this.slots) this.slots = this.slots.filter(s => s !== null && s !== undefined);
        this.updateUI();
        this.setupEvents();
        this.injectDebugButton(); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const iniciarOReconstruir = () => {
        if (!window.miInventario || typeof window.miInventario.addItem !== 'function') {
            const datosGuardados = window.miInventario || {};
            window.miInventario = new InventoryManager();

            if (datosGuardados.slots) window.miInventario.slots = datosGuardados.slots;
            else if (datosGuardados.items) window.miInventario.slots = datosGuardados.items;
            
            if (datosGuardados.vitalEssence) window.miInventario.vitalEssence = datosGuardados.vitalEssence;
            
            // Si la partida tenía más de 10 objetos guardados (por haber usado la tienda Dev antes), mantenemos el límite alto
            if (window.miInventario.slots.length > 10) {
                window.miInventario.maxSlots = 100;
            }
            
            window.miInventario.init();
        }
    };
    iniciarOReconstruir();

    setInterval(() => {
        if (window.miInventario && typeof window.miInventario.addItem !== 'function') {
            Object.setPrototypeOf(window.miInventario, InventoryManager.prototype);
            if (!window.miInventario.slots) window.miInventario.slots = window.miInventario.items || [];
            window.miInventario.init();
        }
    }, 1000);
});