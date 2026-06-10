// PriceOracleManager.js
(function() {
    window.PriceOracleManager = {
        polUsdPrice: 0.50, // Default price
        lastUpdate: 0,
        REFRESH_MS: 5 * 60 * 1000, // 5 minutes

        init: async function() {
            console.log("[PriceOracleManager] Inicializando...");
            // Cargar precio cacheado
            const cachedPrice = localStorage.getItem('pol_usd_price');
            const cachedTime = localStorage.getItem('pol_usd_price_time');
            if (cachedPrice) {
                this.polUsdPrice = parseFloat(cachedPrice) || 0.50;
            }
            if (cachedTime) {
                this.lastUpdate = parseInt(cachedTime) || 0;
            }

            // Si ha pasado suficiente tiempo o no se ha actualizado nunca, actualizar
            const now = Date.now();
            if (now - this.lastUpdate > this.REFRESH_MS) {
                await this.refreshPrice();
            } else {
                console.log(`[PriceOracleManager] Usando precio cacheado: $${this.polUsdPrice} (Actualizado hace ${Math.round((now - this.lastUpdate)/1000)}s)`);
            }
        },

        refreshPrice: async function() {
            try {
                console.log("[PriceOracleManager] Solicitando precio de POL (MATIC) a CoinGecko...");
                const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && data["matic-network"] && typeof data["matic-network"].usd === 'number') {
                    this.polUsdPrice = data["matic-network"].usd;
                    this.lastUpdate = Date.now();
                    localStorage.setItem('pol_usd_price', this.polUsdPrice.toString());
                    localStorage.setItem('pol_usd_price_time', this.lastUpdate.toString());
                    console.log(`[PriceOracleManager] Precio actualizado: $${this.polUsdPrice} USD`);
                } else {
                    console.warn("[PriceOracleManager] Formato de respuesta de CoinGecko inesperado:", data);
                }
            } catch (error) {
                console.error("[PriceOracleManager] Error al obtener precio de CoinGecko, usando fallback:", error);
            }
        },

        usdToPol: function(usdAmount) {
            if (this.polUsdPrice <= 0) return 0;
            return usdAmount / this.polUsdPrice;
        },

        polToUsd: function(polAmount) {
            return polAmount * this.polUsdPrice;
        },

        formatPol: function(usdAmount) {
            const pol = this.usdToPol(usdAmount);
            return `${pol.toFixed(2)} 🔷`;
        },

        formatLabel: function(usdAmount) {
            const pol = this.usdToPol(usdAmount);
            return `${usdAmount.toFixed(2)} USDT (~${pol.toFixed(2)} 🔷 POL)`;
        }
    };

    // Auto-init al cargar el script
    window.PriceOracleManager.init();
})();
