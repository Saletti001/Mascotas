// =========================================
// ShopManager.js - BAZAR, DOJO Y PREMIUM
// =========================================

window.ShopManager = {
    inicializado: false,
    
    // Iconos para los elementos
    iconosElemento: { "Biomutante": "🌿", "Viral": "🦠", "Cibernético": "🤖", "Radiactivo": "☢️", "Tóxico": "☣️", "Sintético": "⚙️" },

    init: function() {
        if (!this.inicializado) {
            this.inyectarEstructura();
            this.inicializado = true;
        }
        this.renderBazar();
        this.cambiarPestana('bazar');
    },

    inyectarEstructura: function() {
        const contenedor = document.getElementById("shop-screen");
        if (!contenedor) return;

        contenedor.innerHTML = `
            <h2 class="screen-title" style="color: #4dd0e1;">Tienda Nexo</h2>
            
            <div style="display: flex; justify-content: center; margin-bottom: 15px; border-radius: 8px; overflow: hidden;">
                <button id="tab-shop-bazar" class="btn-shop-tab" style="background: #4CAF50; color: white; border: 1px solid #4CAF50; padding: 8px 15px; font-weight: bold; cursor: pointer; border-right: none;">Bazar (EV)</button>
                <button id="tab-shop-dojo" class="btn-shop-tab" style="background: #eee; color: #333; border: 1px solid #ccc; padding: 8px 15px; font-weight: bold; cursor: pointer; border-right: none;">Dojo MTs (EV)</button>
                <button id="tab-shop-premium" class="btn-shop-tab" style="background: #eee; color: #333; border: 1px solid #ccc; padding: 8px 15px; font-weight: bold; cursor: pointer;">Premium ($POL)</button>
            </div>
            
            <div id="shop-bazar-view" class="shop-view">
                <p style="text-align: center; color: #666; font-size: 12px; margin-bottom: 15px;">Consumibles y herramientas de supervivencia.</p>
                <div id="shop-bazar-grid" class="sanctuary-grid"></div>
            </div>
            
            <div id="shop-dojo-view" class="shop-view hidden">
                <p style="text-align: center; color: #666; font-size: 12px; margin-bottom: 15px;">Módulos de Técnica. Límite: 1 por MT en la mochila.</p>
                <div id="shop-dojo-grid" class="sanctuary-grid"></div>
            </div>
            
            <div id="shop-premium-view" class="shop-view hidden">
                <p style="text-align: center; color: #666; font-size: 12px; margin-bottom: 15px;">Mejoras de infraestructura permanentes.</p>
                <div id="shop-premium-grid" class="sanctuary-grid"></div>
            </div>
            
            <button class="back-btn btn-go-home" onclick="navegarA('room-area')">Volver al Laboratorio</button>
        `;

        // Lógica de pestañas
        document.getElementById("tab-shop-bazar").addEventListener("click", () => this.cambiarPestana('bazar'));
        document.getElementById("tab-shop-dojo").addEventListener("click", () => this.cambiarPestana('dojo'));
        document.getElementById("tab-shop-premium").addEventListener("click", () => this.cambiarPestana('premium'));
    },

    cambiarPestana: function(pestana) {
        // Reiniciar estilos de botones
        const coloresActivos = { 'bazar': '#4CAF50', 'dojo': '#00d2ff', 'premium': '#8A2BE2' };
        
        ['bazar', 'dojo', 'premium'].forEach(tab => {
            const btn = document.getElementById(`tab-shop-${tab}`);
            const view = document.getElementById(`shop-${tab}-view`);
            
            if (tab === pestana) {
                btn.style.background = coloresActivos[tab];
                btn.style.color = "white";
                btn.style.borderColor = coloresActivos[tab];
                view.classList.remove("hidden");
                
                // Renderizar vista actual
                if(tab === 'bazar') this.renderBazar();
                if(tab === 'dojo') this.renderDojo();
                if(tab === 'premium') this.renderPremium();
            } else {
                btn.style.background = "#eee";
                btn.style.color = "#333";
                btn.style.borderColor = "#ccc";
                view.classList.add("hidden");
            }
        });
    },

    crearTarjeta: function(item, colorBorde, colorBoton, tipoMoneda) {
        const div = document.createElement("div");
        div.className = "geno-card";
        div.style.borderColor = colorBorde;
        
        let precioTag = tipoMoneda === "EV" ? `<div style="font-weight: bold; color: ${colorBoton}; margin: 5px 0;">✨ ${item.price.toFixed(2)} EV</div>` : `<div style="font-weight: bold; color: ${colorBoton}; margin: 5px 0;">🔷 ${item.price.toFixed(2)} POL</div>`;

        div.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 5px;">${item.icon}</div>
            <h4 style="margin: 5px 0; font-size: 13px;">${item.name}</h4>
            <p style="font-size: 10px; color: #888; margin: 0 0 5px 0; height: 30px;">${item.desc}</p>
            ${precioTag}
            <button class="btn-liberar-geno" style="background: ${colorBoton}; color: white; width: 100%; border-radius: 6px;">Comprar</button>
        `;

        div.querySelector("button").addEventListener("click", () => this.procesarCompra(item));
        return div;
    },

    procesarCompra: function(item) {
        // Validar economía EV
        if (item.currency === "EV") {
            if (window.miInventario.vitalEssence < item.price) {
                alert(`❌ No tienes suficiente Esencia Vital. Necesitas ${item.price.toFixed(2)} ✨`);
                return;
            }
            
            // Intentar añadir el ítem (El InventoryManager gestiona los límites automáticamente)
            let itemParaInventario = { id: item.id, name: item.name, icon: item.icon, type: item.type, desc: item.desc, maxStack: window.miInventario.stackLimits[item.type] };
            
            // Atributos extra para MTs
            if(item.type === "MT") {
                itemParaInventario.subType = item.subType;
                itemParaInventario.element = item.element;
                itemParaInventario.id_ataque = item.id_ataque;
                itemParaInventario.power = item.power;
            }

            let agregadoExitosamente = window.miInventario.addItem(itemParaInventario);
            
            if (agregadoExitosamente) {
                window.miInventario.vitalEssence -= item.price;
                window.miInventario.updateUI();
                alert(`✅ Has comprado: ${item.name}`);
                if(window.guardarJuego) window.guardarJuego();
            }

        // Validar economía POL
        } else if (item.currency === "POL") {
            if (!window.miWallet) window.miWallet = { pol: 0 };
            if (window.miWallet.pol < item.price) {
                alert(`❌ No tienes suficiente $POL. Necesitas ${item.price.toFixed(2)} 🔷`);
                return;
            }

            if (item.type === "expansion") {
                if (window.miInventario.maxSlots >= item.value) {
                    alert("⚠️ Ya tienes una mochila de este tamaño o superior.");
                    return;
                }
                
                window.miWallet.pol -= item.price;
                window.miInventario.maxSlots = item.value;
                document.getElementById("pol-amount").innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
                window.miInventario.updateUI();
                
                alert(`🎒 ¡Mochila expandida permanentemente a ${item.value} ranuras!`);
                this.renderPremium(); // Refrescar para deshabilitar botón
                if(window.guardarJuego) window.guardarJuego();
            }
        }
    },

    renderBazar: function() {
        const grid = document.getElementById("shop-bazar-grid");
        grid.innerHTML = "";
        
        const items = [
            { id: "escaner_basico", name: "Escáner Básico", icon: "🔍", type: "basic", price: 0.15, currency: "EV", desc: "Revela slots activos." },
            { id: "escaner_completo", name: "Escáner Completo", icon: "🧬", type: "basic", price: 0.50, currency: "EV", desc: "Revela genética exacta." },
            { id: "antidoto_uni", name: "Antídoto Universal", icon: "🧪", type: "consumable", price: 0.10, currency: "EV", desc: "Limpia estados alterados." }
        ];

        items.forEach(item => grid.appendChild(this.crearTarjeta(item, "#4CAF50", "#4CAF50", "EV")));
    },

    renderDojo: function() {
        const grid = document.getElementById("shop-dojo-grid");
        grid.innerHTML = "";

        if(!window.AttackCatalog) return;

        let dojoItems = [];
        for (const [elemento, ramas] of Object.entries(window.AttackCatalog.ataquesPorElemento)) {
            const icono = this.iconosElemento[elemento] || "💿";
            
            const agregarRama = (rama, subType, price) => {
                if(rama) {
                    rama.forEach(atk => {
                        dojoItems.push({ 
                            id: "mt_" + atk.id, name: "MT " + atk.nombre, icon: icono, type: "MT", subType: subType, element: elemento, 
                            id_ataque: atk.id, power: atk.potencia || 0, price: price, currency: "EV", desc: atk.descripcion 
                        });
                    });
                }
            };

            // Precios según la categoría del Documento Maestro
            agregarRama(ramas.especiales, "Especial", 2.50);
            agregarRama(ramas.soportes, "Soporte", 2.00);
            agregarRama(ramas.definitivos, "Definitivo", 5.00);
        }

        dojoItems.forEach(item => grid.appendChild(this.crearTarjeta(item, "#00d2ff", "#00d2ff", "EV")));
    },

    renderPremium: function() {
        const grid = document.getElementById("shop-premium-grid");
        grid.innerHTML = "";

        const items = [
            { id: "exp_20", name: "Bolsillos Nv. 2", icon: "🎒", type: "expansion", value: 20, price: 2.00, currency: "POL", desc: "Expande el inventario a 20 ranuras." },
            { id: "exp_30", name: "Bolsillos Nv. 3", icon: "🧳", type: "expansion", value: 30, price: 5.00, currency: "POL", desc: "Expande el inventario a 30 ranuras." },
            { id: "exp_40", name: "Caja Fuerte Nv. 4", icon: "🗄️", type: "expansion", value: 40, price: 10.00, currency: "POL", desc: "Expande el inventario a 40 ranuras." }
        ];

        items.forEach(item => {
            let tarjeta = this.crearTarjeta(item, "#8A2BE2", "#8A2BE2", "POL");
            
            // Si el jugador ya tiene una mochila de este tamaño o mayor, marcarla como comprada
            if (window.miInventario && window.miInventario.maxSlots >= item.value) {
                let btn = tarjeta.querySelector("button");
                btn.innerText = "Adquirido";
                btn.style.background = "#555";
                btn.style.cursor = "not-allowed";
                tarjeta.style.opacity = "0.5";
            }
            grid.appendChild(tarjeta);
        });
    }
};