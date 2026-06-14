// ========================================================
// DailyLoginManager.js - GESTOR DE RECOMPENSAS DIARIAS DINÁMICAS
// ========================================================

window.DailyLoginManager = {
    // 1. Obtiene la lista de recompensas de la semana actual del ciclo
    getRewards: function() {
        return [
            { day: 1, name: "100 EV", type: "essence", amount: 100, iconName: "essence", desc: "Esencia Vital" },
            { day: 2, name: "150 EV", type: "essence", amount: 150, iconName: "essence", desc: "Esencia Vital" },
            { day: 3, name: "200 EV + Ración", type: "dual", amount: 200, id: "apple_01", amountItem: 1, iconName: "apple", desc: "200 EV y 1 Ración de Comida Básica" },
            { day: 4, name: "250 EV", type: "essence", amount: 250, iconName: "essence", desc: "Esencia Vital" },
            { day: 5, name: "300 EV", type: "essence", amount: 300, iconName: "essence", desc: "Esencia Vital" },
            { day: 6, name: "400 EV + Ducha", type: "dual", amount: 400, id: "plasma_shower", amountItem: 1, iconName: "plasma_shower", desc: "400 EV y 1 Ducha de Plasma" },
            { day: 7, name: "1000 EV + Escáner", type: "dual", amount: 1000, id: "escaner_basico", amountItem: 1, iconName: "escaner_basico", desc: "1000 EV y 1 Caja de Escáner de ADN Básico" }
        ];
    },

    // 2. Resolver los iconos SVG
    getSVG: function(name) {
        if (window.DailyRewardsCatalog) {
            return window.DailyRewardsCatalog.getSVG(name);
        }
        return "🎁";
    },

    // 3. Comprobar elegibilidad (localmente)
    checkEligibility: function() {
        const todayStr = new Date().toDateString();
        return !window.dailyLoginData || window.dailyLoginData.lastClaimDate !== todayStr;
    },

    // 4. Obtener un item aleatorio por categoría
    obtenerItemAleatorio: function(pool) {
        if (!window.DailyRewardsCatalog) return null;
        const items = window.DailyRewardsCatalog[pool];
        if (!items) return null;

        if (pool === "HERRAMIENTAS_GENETICAS") {
            // Drop-rate equilibrado: 70% Básico, 30% Completo
            const roll = Math.random();
            return roll < 0.70 ? { ...items[0] } : { ...items[1] };
        } else if (pool === "ITEMS_COMPETITIVOS") {
            // Tinta de habilidad (100% de la categoría)
            return { ...items[0] };
        }
        // Fallback genérico
        return { ...items[Math.floor(Math.random() * items.length)] };
    },

    // Auxiliares de tipo e inventario
    obtenerTipoDeItemPorId: function(id) {
        if (id === "apple_01" || id === "ration_auto" || id === "pocion_energia" || id === "plasma_shower") {
            return "consumable";
        }
        return "basic";
    },

    obtenerMaxStackPorId: function(id) {
        if (id === "apple_01" || id === "ration_auto" || id === "pocion_energia" || id === "plasma_shower") {
            return 20;
        }
        return 99;
    },

    // 5. Entregar la recompensa localmente en el inventario
    entregarRecompensaLocal: function(reward) {
        if (reward.type === "essence") {
            if (window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(reward.amount);
                if (typeof window.registrarLogEconomia === "function") {
                    window.registrarLogEconomia('reward', reward.amount, 'checkin');
                }
                alert(`✨ ¡Felicidades! Has reclamado tu recompensa de Día ${reward.day}: +${reward.amount} Esencia Vital.`);
            } else {
                alert("❌ Error: El sistema de inventario no está listo.");
            }
        } else if (reward.type === "item") {
            if (window.miInventario && typeof window.miInventario.addItem === "function") {
                const itemObj = {
                    id: reward.id,
                    name: reward.name,
                    icon: this.getSVG(reward.iconName),
                    type: this.obtenerTipoDeItemPorId(reward.id),
                    maxStack: this.obtenerMaxStackPorId(reward.id),
                    desc: reward.desc,
                    count: reward.amount || 1
                };
                const exito = window.miInventario.addItem(itemObj);
                if (exito) {
                    alert(`✨ ¡Felicidades! Has reclamado tu recompensa de Día ${reward.day}: ${reward.name}.`);
                }
            } else {
                alert("❌ Error: El sistema de inventario no está listo.");
            }
        } else if (reward.type === "dual") {
            let exitoEssence = false;
            let exitoItem = false;

            if (window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(reward.amount);
                if (typeof window.registrarLogEconomia === "function") {
                    window.registrarLogEconomia('reward', reward.amount, 'checkin');
                }
                exitoEssence = true;
            }

            if (window.miInventario && typeof window.miInventario.addItem === "function") {
                const nombreItem = reward.id === "apple_01" ? "Manzana Nexo" : (reward.id === "plasma_shower" ? "Ducha de Plasma" : "Escáner ADN Básico");
                const itemObj = {
                    id: reward.id,
                    name: nombreItem,
                    icon: this.getSVG(reward.iconName),
                    type: this.obtenerTipoDeItemPorId(reward.id),
                    maxStack: this.obtenerMaxStackPorId(reward.id),
                    desc: reward.desc,
                    count: reward.amountItem || 1
                };
                exitoItem = window.miInventario.addItem(itemObj);
            }

            if (exitoEssence && exitoItem) {
                alert(`✨ ¡Felicidades! Has reclamado tu recompensa de Día ${reward.day}: +${reward.amount} Esencia Vital y ${reward.id === "apple_01" ? "1 Manzana Nexo" : (reward.id === "plasma_shower" ? "1 Ducha de Plasma" : "1 Escáner ADN Básico")}.`);
            } else if (exitoEssence) {
                alert(`✨ ¡Reclamado! Recibiste +${reward.amount} Esencia Vital, pero tu mochila está llena para el ítem.`);
            } else {
                alert("❌ Error: El sistema de inventario no está listo.");
            }
        } else if (reward.type === "random") {
            const rolled = this.obtenerItemAleatorio(reward.pool);
            if (rolled) {
                const amount = (reward.multiplier || 1) * (rolled.baseAmount || 1);
                if (window.miInventario && typeof window.miInventario.addItem === "function") {
                    const itemObj = {
                        id: rolled.id,
                        name: rolled.name + (amount > 1 ? ` x${amount}` : ""),
                        icon: this.getSVG(rolled.iconName),
                        type: this.obtenerTipoDeItemPorId(rolled.id),
                        maxStack: this.obtenerMaxStackPorId(rolled.id),
                        desc: rolled.desc,
                        count: amount
                    };
                    const exito = window.miInventario.addItem(itemObj);
                    if (exito) {
                        alert(`✨ ¡Felicidades! Abriste tu Caja Sorpresa del Día ${reward.day} y obtuviste: ${itemObj.name}.`);
                    }
                } else {
                    alert("❌ Error: El sistema de inventario no está listo.");
                }
            }
        }
    },

    // 6. Ejecutar reclamo
    claimReward: async function() {
        if (!this.checkEligibility()) {
            alert("🔒 Ya has reclamado tu recompensa de hoy. ¡Vuelve mañana!");
            return;
        }

        const btnClaim = document.getElementById("btn-claim-daily");
        if (btnClaim) btnClaim.disabled = true;

        // Si está conectado a la nube (Supabase)
        if (window.miUsuarioCloud && window.supabaseClient) {
            try {
                const { data, error } = await window.supabaseClient.rpc('claim_daily_checkin', {
                    player_id: window.miUsuarioCloud.id
                });

                if (error) {
                    alert("❌ Error al procesar reclamo en el servidor: " + error.message);
                    if (btnClaim) btnClaim.disabled = false;
                    return;
                }

                const res = data && data[0];
                if (!res || !res.success) {
                    alert("🔒 " + (res ? res.message : "No cumples con las condiciones para reclamar."));
                    if (btnClaim) btnClaim.disabled = false;
                    return;
                }

                // Obtener recompensa resuelta del día reclamado (new_streak = 1 a 7)
                const streakDay = res.new_streak;
                const rewards = this.getRewards();
                const reward = rewards[streakDay - 1];

                // Entregar el premio en el inventario local
                this.entregarRecompensaLocal(reward);

                // Sincronizar datos locales con estampa del servidor
                window.dailyLoginData.lastClaimDate = new Date(res.last_check_in).toDateString();
                window.dailyLoginData.currentDayStreak = streakDay % 7; // Próximo índice de día
                window.dailyLoginData.streakDays = streakDay;

                // Forzar sincronización de progreso en Supabase (upsert de datos_juego)
                if (typeof window.guardarProgreso === "function") {
                    window.guardarProgreso();
                } else if (typeof window.autoGuardar === "function") {
                    window.autoGuardar();
                }

                // Efecto de sonido
                if (window.Sonidos) {
                    window.Sonidos.play("heal");
                }

                // Refrescar UI del modal
                this.renderGrid();
                this.updateClaimButton();
                if (typeof window.checkPendingClaims === "function") {
                    window.checkPendingClaims();
                }

            } catch (err) {
                console.error("Error al reclamar en Supabase:", err);
                alert("❌ Error de comunicación con la base de datos.");
            } finally {
                if (btnClaim) btnClaim.disabled = false;
            }
        } else {
            // Modo Offline / Local Fallback
            const currentStreak = window.dailyLoginData ? window.dailyLoginData.currentDayStreak : 0;
            const rewards = this.getRewards();
            const reward = rewards[currentStreak];

            this.entregarRecompensaLocal(reward);

            // Guardar localmente
            window.dailyLoginData.lastClaimDate = new Date().toDateString();
            window.dailyLoginData.currentDayStreak = (currentStreak + 1) % 7;
            window.dailyLoginData.streakDays = currentStreak + 1;

            if (typeof window.guardarProgreso === "function") {
                window.guardarProgreso();
            }

            if (window.Sonidos) {
                window.Sonidos.play("heal");
            }

            this.renderGrid();
            this.updateClaimButton();
            if (typeof window.checkPendingClaims === "function") {
                window.checkPendingClaims();
            }
            if (btnClaim) btnClaim.disabled = false;
        }
    },

    // 7. Renderizar cuadrícula
    renderGrid: function() {
        const grid = document.getElementById("daily-rewards-grid");
        if (!grid) return;

        grid.innerHTML = "";
        const hasClaimedToday = !this.checkEligibility();
        const currentStreak = window.dailyLoginData ? window.dailyLoginData.currentDayStreak : 0;
        const rewards = this.getRewards();

        rewards.forEach((reward, index) => {
            let status = "locked"; // claimed, available, locked
            if (hasClaimedToday && currentStreak === 0) {
                // Acaba de reclamar el Día 7 y se reinició el streak
                status = "claimed";
            } else {
                if (index < currentStreak) {
                    status = "claimed";
                } else if (index === currentStreak) {
                    status = hasClaimedToday ? "locked" : "available";
                } else {
                    status = "locked";
                }
            }

            let cardBg = "rgba(255, 255, 255, 0.02)";
            let borderStyle = "1px dashed rgba(0, 229, 255, 0.15)";
            let glowShadow = "none";
            let statusText = "Bloqueado";
            let statusColor = "#6b7280";
            let iconColor = "rgba(255, 255, 255, 0.3)";
            const isDay7 = (index === 6);

            if (status === "claimed") {
                cardBg = "rgba(76, 175, 80, 0.08)";
                borderStyle = "1.5px solid rgba(76, 175, 80, 0.35)";
                statusText = "Reclamado ✓";
                statusColor = "#4caf50";
                iconColor = "#a5d6a7";
            } else if (status === "available") {
                cardBg = "rgba(0, 229, 255, 0.08)";
                borderStyle = "1.5px solid #00e5ff";
                glowShadow = "0 0 12px rgba(0, 229, 255, 0.25)";
                statusText = "Disponible";
                statusColor = "#00e5ff";
                iconColor = "#00e5ff";
            }

            const gridSpan = isDay7 ? "grid-column: span 2;" : "";
            const paddingStyle = isDay7 ? "padding: 10px 8px;" : "padding: 8px 6px;";

            const card = document.createElement("div");
            card.style = `background: ${cardBg}; border: ${borderStyle}; border-radius: 12px; box-shadow: ${glowShadow}; ${gridSpan} ${paddingStyle} display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.2s ease; box-sizing: border-box;`;
            
            if (status === "available") {
                card.style.cursor = "pointer";
                card.onclick = () => this.claimReward();
            }

            card.innerHTML = `
                <span style="font-size: 8px; color: ${status === "available" ? "#00e5ff" : "#94a3b8"}; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">Día ${reward.day}</span>
                <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: ${iconColor}; filter: ${status === "available" ? "drop-shadow(0 0 4px rgba(0,229,255,0.4))" : "none"}; margin-bottom: 2px;">
                    ${this.getSVG(reward.iconName)}
                </div>
                <span style="font-size: 10px; font-weight: bold; color: #fff; text-align: center; margin-bottom: 1px;">${reward.name}</span>
                <span style="font-size: 8px; color: #94a3b8; text-align: center; opacity: 0.8; margin-bottom: 3px;">${reward.desc}</span>
                <span style="font-size: 8px; font-weight: bold; color: ${statusColor}; text-transform: uppercase; letter-spacing: 0.5px;">${statusText}</span>
            `;
            grid.appendChild(card);
        });
    },

    // 8. Actualizar botón principal
    updateClaimButton: function() {
        const btn = document.getElementById("btn-claim-daily");
        if (!btn) return;

        if (this.checkEligibility()) {
            btn.innerText = "Reclamar Recompensa";
            btn.style.background = "linear-gradient(90deg, #00d2ff, #008be2)";
            btn.style.cursor = "pointer";
            btn.disabled = false;
            btn.style.opacity = "1";
        } else {
            btn.innerText = "Mañana Siguiente Recompensa";
            btn.style.background = "rgba(255, 255, 255, 0.08)";
            btn.style.border = "1px solid rgba(255, 255, 255, 0.1)";
            btn.style.cursor = "not-allowed";
            btn.disabled = true;
            btn.style.opacity = "0.6";
        }
    },

    // 9. Inicializar
    init: function() {
        const btnOpen = document.getElementById("btn-daily-login");
        const btnClose = document.getElementById("close-daily-login");
        const btnClaim = document.getElementById("btn-claim-daily");
        const modal = document.getElementById("daily-login-modal");

        if (btnOpen && modal) {
            btnOpen.onclick = () => {
                modal.classList.remove("hidden");
                this.renderGrid();
                this.updateClaimButton();
            };
        }

        if (btnClose && modal) {
            btnClose.onclick = () => {
                modal.classList.add("hidden");
            };
        }

        if (btnClaim) {
            btnClaim.onclick = () => {
                this.claimReward();
            };
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.DailyLoginManager.init();
});
