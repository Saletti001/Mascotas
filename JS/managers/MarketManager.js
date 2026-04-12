// =========================================
// MarketManager.js - MERCADO NEGRO (WEB3)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Arrays locales para manejar el mercado
    window.mercadoNPC = [];
    window.misVentas = [];

    const tabBuy = document.getElementById("tab-market-buy");
    const tabSell = document.getElementById("tab-market-sell");
    const viewBuy = document.getElementById("market-buy-view");
    const viewSell = document.getElementById("market-sell-view");
    
    // Función para generar Genos aleatorios en el mercado
    function generarGenoNPC() {
        const rarities = ["Común", "Raro", "Épico"];
        const elements = ["🔥 Ígneo", "💧 Acuático", "🧪 Tóxico", "⚙️ Cibernético"];
        const r = rarities[Math.floor(Math.random() * rarities.length)];
        let price = r === "Común" ? (Math.random() * 2 + 1) : r === "Raro" ? (Math.random() * 5 + 5) : (Math.random() * 15 + 15);
        
        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: `Geno ${r} (NPC)`,
            rarity: r,
            element: elements[Math.floor(Math.random() * elements.length)],
            shape: Math.random() > 0.5 ? "gota" : "frijol",
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Color aleatorio
            pricePol: price.toFixed(1),
            level: Math.floor(Math.random() * 10) + 1,
            reward: 100
        };
    }

    // Inicializar el mercado con 4 Genos
    for(let i=0; i<4; i++) { window.mercadoNPC.push(generarGenoNPC()); }

    window.iniciarMercado = function() {
        renderizarMercado();
        renderizarMisVentas();
    };

    // Cambiar entre pestañas Comprar/Vender
    if(tabBuy) tabBuy.addEventListener("click", () => {
        tabBuy.style.background = "#8A2BE2"; tabBuy.style.color = "white";
        tabSell.style.background = "#eee"; tabSell.style.color = "#333";
        viewBuy.classList.remove("hidden"); viewSell.classList.add("hidden");
    });

    if(tabSell) tabSell.addEventListener("click", () => {
        tabSell.style.background = "#8A2BE2"; tabSell.style.color = "white";
        tabBuy.style.background = "#eee"; tabBuy.style.color = "#333";
        viewSell.classList.remove("hidden"); viewBuy.classList.add("hidden");
    });

    // RENDERIZAR: COMPRAR (Genos de NPCs)
    function renderizarMercado() {
        const grid = document.getElementById("market-buy-grid");
        if(!grid) return;
        grid.innerHTML = "";

        window.mercadoNPC.forEach(geno => {
            const card = document.createElement("div");
            card.className = "geno-card";
            card.style.borderColor = "#8A2BE2";
            card.innerHTML = `
                ${generarSvgGeno({ body_shape: geno.shape, base_color: geno.color })}
                <h4>${geno.name}</h4>
                <p>Nv. ${geno.level} | ${geno.rarity}</p>
                <div style="font-weight: bold; color: #8A2BE2; margin: 5px 0;">🔷 ${geno.pricePol} POL</div>
                <button class="btn-liberar-geno" style="background: #8A2BE2; color: white;" data-id="${geno.id}">Comprar</button>
            `;
            
            const btnCompra = card.querySelector("button");
            btnCompra.addEventListener("click", () => {
                const precio = parseFloat(geno.pricePol);
                if (window.miWallet && window.miWallet.pol >= precio) {
                    // Pagar
                    window.miWallet.pol -= precio;
                    document.getElementById("pol-amount").innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
                    
                    // Añadir al inventario del jugador
                    delete geno.pricePol;
                    window.misGenos.push(geno);
                    
                    // Quitar del mercado y generar uno nuevo
                    window.mercadoNPC = window.mercadoNPC.filter(g => g.id !== geno.id);
                    window.mercadoNPC.push(generarGenoNPC());
                    
                    alert(`¡Compra exitosa! Adquiriste a [${geno.name}] por ${precio} POL.`);
                    renderizarMercado();
                    if(window.guardarProgreso) window.guardarProgreso();
                } else {
                    alert("No tienes suficiente POL para comprar este Geno.");
                }
            });
            grid.appendChild(card);
        });
    }

    // RENDERIZAR: VENDER (Tus Genos)
    function renderizarMisVentas() {
        const grid = document.getElementById("market-sell-grid");
        const listContainer = document.getElementById("market-my-listed");
        if(!grid || !listContainer) return;
        
        // 1. Mostrar Genos disponibles para vender
        grid.innerHTML = "";
        const genosVendibles = window.misGenos.filter(g => !g.isEgg);
        
        if (genosVendibles.length === 0) {
            grid.innerHTML = '<p style="grid-column: span 2; text-align: center; color: #888;">No tienes Genos en tu Santuario para vender.</p>';
        } else {
            genosVendibles.forEach(geno => {
                const card = document.createElement("div");
                card.className = "geno-card";
                card.innerHTML = `
                    ${generarSvgGeno({ body_shape: geno.shape, base_color: geno.color })}
                    <h4>${geno.name}</h4>
                    <input type="number" id="price-${geno.id}" placeholder="Precio (POL)" style="width: 80%; padding: 5px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px; text-align: center;" step="0.1" min="0.1">
                    <button class="btn-liberar-geno" style="background: #4CAF50; color: white;" data-id="${geno.id}">Publicar</button>
                `;
                
                card.querySelector("button").addEventListener("click", () => {
                    const inputPrecio = document.getElementById(`price-${geno.id}`).value;
                    const precio = parseFloat(inputPrecio);
                    
                    if (isNaN(precio) || precio <= 0) {
                        alert("Por favor, introduce un precio válido mayor a 0.");
                        return;
                    }

                    // Mover de misGenos a misVentas
                    window.misGenos = window.misGenos.filter(g => g.id !== geno.id);
                    geno.pricePol = precio.toFixed(1);
                    window.misVentas.push(geno);
                    
                    alert(`Has publicado a [${geno.name}] en el mercado por ${geno.pricePol} POL.`);
                    renderizarMisVentas();
                    if(window.guardarProgreso) window.guardarProgreso();
                });
                grid.appendChild(card);
            });
        }

        // 2. Mostrar los Genos que ya están publicados
        listContainer.innerHTML = "";
        if (window.misVentas.length > 0) {
            listContainer.innerHTML = '<h4 style="width: 100%; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Publicados Actuálmente:</h4>';
            window.misVentas.forEach(geno => {
                const item = document.createElement("div");
                item.style = "display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px; border-radius: 6px; border: 1px dashed #8A2BE2; margin-bottom: 5px; font-size: 12px;";
                item.innerHTML = `
                    <span style="font-weight: bold;">${geno.name}</span>
                    <span style="color: #8A2BE2; font-weight: bold;">🔷 ${geno.pricePol} POL</span>
                    <button style="background: #d9534f; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer;">Cancelar</button>
                `;
                
                item.querySelector("button").addEventListener("click", () => {
                    // Retirar del mercado
                    window.misVentas = window.misVentas.filter(g => g.id !== geno.id);
                    delete geno.pricePol;
                    window.misGenos.push(geno);
                    renderizarMisVentas();
                });
                listContainer.appendChild(item);
            });
        }
    }

    // SIMULACIÓN DE COMPRADORES (Cada 10 segundos)
    setInterval(() => {
        if (window.misVentas.length > 0) {
            // Un 30% de probabilidad de que un NPC compre algo cada 10 seg
            if (Math.random() < 0.3) {
                // Elegir un Geno publicado al azar
                const index = Math.floor(Math.random() * window.misVentas.length);
                const genoVendido = window.misVentas[index];
                const ganancia = parseFloat(genoVendido.pricePol);

                // Quitarlo de mis ventas y dar el dinero
                window.misVentas.splice(index, 1);
                if (window.miWallet) {
                    window.miWallet.pol += ganancia;
                    const polText = document.getElementById("pol-amount");
                    if(polText) polText.innerText = `🔷 ${window.miWallet.pol.toFixed(1)} POL`;
                }

                alert(`💰 ¡Venta Exitosa!\nUn usuario anónimo acaba de comprar a tu [${genoVendido.name}].\nHas recibido ${ganancia} POL.`);
                renderizarMisVentas();
                if(window.guardarProgreso) window.guardarProgreso();
            }
        }
    }, 10000);
});