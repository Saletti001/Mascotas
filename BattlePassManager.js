// ========================================================
// BattlePassManager.js - GESTOR DE PASE DE BATALLA NEXO
// ========================================================

window.BattlePassManager = {
    pp: 0,
    level: 1,
    premiumUnlocked: false,
    claimedFree: [],      // niveles reclamados (ej. [2, 4])
    claimedPremium: [],   // niveles reclamados (ej. [1, 2])

    // Recompensas del Pase de Batalla
    freeRewards: {},
    premiumRewards: {},

    init: function() {
        this.cargarConfiguracionRecompensas();
        this.inyectarModal();
    },

    // Retorna nivel actual basado en PP (cada nivel requiere 30 PP)
    obtenerNivelPorPP: function(puntos) {
        return Math.min(50, Math.floor(puntos / 30) + 1);
    },

    // Sumar puntos de pase (PP)
    addPP: function(cantidad) {
        const nivelAnterior = this.level;
        this.pp += cantidad;
        this.level = this.obtenerNivelPorPP(this.pp);

        console.log(`[BATTLE PASS] +${cantidad} PP. Total PP: ${this.pp}. Nivel: ${this.level}`);

        if (this.level > nivelAnterior) {
            console.log(`[BATTLE PASS] ¡SUBIDA DE NIVEL! Nuevo Nivel: ${this.level}`);
            if (window.Sonidos) {
                window.Sonidos.play("heal");
            }
            alert(`🧬 ¡ASCENSO EN EL PASE NEXO! 🌟\nHas alcanzado el Nivel ${this.level} del Pase de Batalla.\n¡Revisa tu Terminal para reclamar nuevos premios!`);
        }

        if (typeof window.guardarProgreso === 'function') {
            window.guardarProgreso();
        }

        if (document.getElementById("battle-pass-modal") && document.getElementById("battle-pass-modal").style.display === "flex") {
            this.renderBattlePass();
        }
    },

    // Comprar Pase Premium por 5 POL
    buyPremium: function() {
        if (this.premiumUnlocked) {
            alert("[INFO] Ya has desbloqueado la Ruta Premium.");
            return;
        }

        // Validar billetera Web3 vinculada
        if (!window.miWallet || !window.miWallet.address) {
            alert("[CONEXIÓN NECESARIA] Debes vincular tu billetera Web3 (MetaMask o Privy) desde el HUD superior para poder comprar el Pase Premium.");
            return;
        }

        const precioPOL = 0.1;
        const polDisponibles = window.miWallet.pol || 0;

        if (polDisponibles < precioPOL) {
            alert(`[FONDOS INSUFICIENTES] Necesitas ${precioPOL} POL para desbloquear el Pase Premium. Tienes: ${polDisponibles.toFixed(2)} POL.`);
            return;
        }

        if (confirm(`¿Confirmas la compra del Pase de Batalla Premium por ${precioPOL} POL?`)) {
            window.miWallet.pol -= precioPOL;
            this.premiumUnlocked = true;

            // Actualizar HUD superior del Wallet
            if (window.WalletManager && typeof window.WalletManager.actualizarBoton === 'function') {
                window.WalletManager.actualizarBoton();
            }

            if (window.Sonidos) {
                window.Sonidos.play("heal");
            }

            alert("🔥 ¡ACCESO PREMIUM AUTORIZADO! 🌟\nFelicidades, has desbloqueado la fila de recompensas premium del Pase Nexo.");

            if (typeof window.guardarProgreso === 'function') {
                window.guardarProgreso();
            }

            this.renderBattlePass();
        }
    },

    // Cargar y guardar estado
    getSaveData: function() {
        return {
            pp: this.pp,
            level: this.level,
            premiumUnlocked: this.premiumUnlocked,
            claimedFree: this.claimedFree,
            claimedPremium: this.claimedPremium
        };
    },

    loadSaveData: function(data) {
        if (!data) return;
        if (data.pp !== undefined) this.pp = data.pp;
        if (data.level !== undefined) this.level = data.level;
        if (data.premiumUnlocked !== undefined) this.premiumUnlocked = data.premiumUnlocked;
        if (data.claimedFree !== undefined) this.claimedFree = data.claimedFree;
        if (data.claimedPremium !== undefined) this.claimedPremium = data.claimedPremium;

        // Validar nivel
        this.level = this.obtenerNivelPorPP(this.pp);
    },

    // Configurar el mapa de recompensas (niveles 1 a 50)
    cargarConfiguracionRecompensas: function() {
        const svgApple = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none"><path d="M12 2C11.5 2 11 2.5 11 3s.5 1 1 1c2.5 0 4 2 4 4s.5 1 1 1 1-.5 1-1-2.5-6-6-6Z" fill="#FFA726"/><path d="M12 6c-3 0-6 2.5-6 6s3 7.5 6 7.5 6-3.5 6-7.5-3-6-6-6Z" fill="#EF5350"/></svg>`;
        const svgShower = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none"><rect x="3" y="10" width="18" height="11" rx="3" stroke="#00E5FF" stroke-width="2"/><circle cx="7" cy="13" r="1.5" fill="#00E5FF"/><circle cx="12" cy="15" r="2" fill="#00E5FF"/><path d="M12 2v8" stroke="#00E5FF" stroke-width="2"/></svg>`;
        const svgEssence = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none"><path d="M12 1L14.5 8.5L22 11L14.5 13.5L12 21L9.5 13.5L2 11L9.5 8.5L12 1Z" fill="#FFD700"/></svg>`;
        
        // Estabilizador Atómico SVG
        const svgStabilizer = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#e040fb" stroke-width="2"><circle cx="12" cy="12" r="9" stroke-dasharray="4 2"/><circle cx="12" cy="12" r="3" fill="#e040fb"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke-linecap="round"/></svg>`;
        
        // Cosméticos Planos SVG
        const svgBlueprint = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#ffd54f" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9M15 21V9"/></svg>`;

        // Rellenar Ruta Gratis
        for (let l = 1; l <= 50; l++) {
            if (l === 25) {
                this.freeRewards[l] = {
                    id: "estabilizador_atomico",
                    name: "Estabilizador",
                    desc: "Evita el colapso del Reactor en fusiones Nivel 2 y 3.",
                    svg: svgStabilizer,
                    type: "basic",
                    count: 1
                };
            } else if (l === 50) {
                this.freeRewards[l] = {
                    id: "vital_essence",
                    name: "500 EV",
                    desc: "Esencia Vital de recompensa final.",
                    svg: svgEssence,
                    type: "essence",
                    count: 500
                };
            } else if (l % 2 === 0) {
                // Alternar recompensas cada 2 niveles
                const mod = (l / 2) % 3;
                if (mod === 1) {
                    this.freeRewards[l] = {
                        id: "vital_essence",
                        name: "200 EV",
                        desc: "Esencia Vital primordial.",
                        svg: svgEssence,
                        type: "essence",
                        count: 200
                    };
                } else if (mod === 2) {
                    this.freeRewards[l] = {
                        id: "apple_01",
                        name: "Manzana Nexo",
                        desc: "Restaura 20% de hambre de tu criatura.",
                        svg: svgApple,
                        type: "consumable",
                        count: 1
                    };
                } else {
                    this.freeRewards[l] = {
                        id: "plasma_shower",
                        name: "Ducha Plasma",
                        desc: "Baño de plasma de alta pureza.",
                        svg: svgShower,
                        type: "consumable",
                        count: 1
                    };
                }
            }
        }

        // Rellenar Ruta Premium
        for (let l = 1; l <= 50; l++) {
            if (l === 10) {
                this.premiumRewards[l] = {
                    id: "plano_cyber_visor",
                    name: "Cyber Visor",
                    desc: "Plano estético exclusivo de Visor Cyberpunk.",
                    svg: svgBlueprint,
                    type: "cosmetic_plan",
                    count: 1
                };
            } else if (l === 20) {
                this.premiumRewards[l] = {
                    id: "plano_aura_neon",
                    name: "Aura de Neón",
                    desc: "Plano estético exclusivo de Aura de Neón.",
                    svg: svgBlueprint,
                    type: "cosmetic_plan",
                    count: 1
                };
            } else if (l === 30) {
                this.premiumRewards[l] = {
                    id: "plano_cyber_alas",
                    name: "Cyber Alas",
                    desc: "Plano estético exclusivo de Alas Cibernéticas.",
                    svg: svgBlueprint,
                    type: "cosmetic_plan",
                    count: 1
                };
            } else if (l === 40) {
                this.premiumRewards[l] = {
                    id: "plano_corona_caos",
                    name: "Corona Caos",
                    desc: "Plano estético exclusivo de Corona del Caos.",
                    svg: svgBlueprint,
                    type: "cosmetic_plan",
                    count: 1
                };
            } else if (l === 50) {
                this.premiumRewards[l] = {
                    id: "skin_lab_cyberpunk",
                    name: "Lab Cyberpunk",
                    desc: "Skin para personalizar visualmente tu Laboratorio.",
                    svg: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#e040fb" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" opacity="0.4"/></svg>`,
                    type: "skin_lab",
                    count: 1
                };
            } else {
                this.premiumRewards[l] = {
                    id: "vital_essence",
                    name: "1000 EV",
                    desc: "Inyección masiva de Esencia Vital.",
                    svg: svgEssence,
                    type: "essence",
                    count: 1000
                };
            }
        }
    },

    inyectarModal: function() {
        if (document.getElementById("battle-pass-modal")) return;

        const html = `
            <div id="battle-pass-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(6, 8, 16, 0.7); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:4000; justify-content:center; align-items:center; font-family:'Outfit', sans-serif;">
                <style>
                    #bp-levels-grid::-webkit-scrollbar {
                        display: none !important;
                    }
                    #bp-levels-grid {
                        scrollbar-width: none !important;
                        -ms-overflow-style: none !important;
                    }
                    @keyframes bp-pulse-glow {
                        0% { box-shadow: 0 0 6px #00e5ff; }
                        50% { box-shadow: 0 0 20px #00e5ff, 0 0 6px #00e5ff; }
                        100% { box-shadow: 0 0 6px #00e5ff; }
                    }
                    .bp-glow-free {
                        animation: bp-pulse-glow 1.5s infinite ease-in-out;
                        border-color: #00e5ff !important;
                    }
                    @keyframes bp-pulse-glow-premium {
                        0% { box-shadow: 0 0 6px #e040fb; }
                        50% { box-shadow: 0 0 20px #e040fb, 0 0 6px #e040fb; }
                        100% { box-shadow: 0 0 6px #e040fb; }
                    }
                    .bp-glow-premium {
                        animation: bp-pulse-glow-premium 1.5s infinite ease-in-out;
                        border-color: #e040fb !important;
                    }
                </style>
                <div style="background:#1e2235; border:2.5px solid #00e5ff; border-radius:20px; width:92%; max-width:360px; height:85%; display:flex; flex-direction:column; box-sizing:border-box; padding:18px 18px 0 18px; color:#ffffff; box-shadow:0 8px 32px rgba(0, 229, 255, 0.15); position:relative; overflow:hidden;">
                    
                    <!-- Header Banner -->
                    <div style="background: #151824; margin: -18px -18px 10px -18px; padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #aa00ff; position: relative; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                        <div style="display: flex; flex-direction: column; gap: 2px;">
                            <h2 style="margin: 0; font-size: 16px; font-family: 'Orbitron', sans-serif; font-weight: 900; color: #00e5ff; text-shadow: 0 0 8px rgba(0,229,255,0.6); letter-spacing: 1px;">PASE NEXO</h2>
                            <span style="font-size: 8px; color: #e040fb; font-weight: bold; font-family: 'Orbitron', sans-serif; letter-spacing: 0.5px; text-shadow: 0 0 4px rgba(224,64,251,0.4);">TEMPORADA ACTIVA</span>
                        </div>
                        <button onclick="window.BattlePassManager.closeModal()" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">✕</button>
                    </div>

                    <!-- Progress and PP Info -->
                    <div style="background: #252a45; border: 1.5px solid #00e5ff; border-radius: 12px; padding: 8px 12px; margin-bottom: 10px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px;">
                        <!-- Level badge -->
                        <div id="bp-level-badge" style="width: 28px; height: 28px; background: #aa00ff; border: 2px solid #00e5ff; border-radius: 50%; color: #fff; font-weight: 900; font-size: 11px; display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; box-shadow: 0 0 8px rgba(0,229,255,0.4); flex-shrink: 0;">
                            --
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                <span style="font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: bold; color: #b0c4de;">PROGRESO</span>
                                <span id="bp-pp-tracker" style="font-family: 'Orbitron', sans-serif; font-size: 9px; color: #00e5ff; font-weight: bold;">-- / 30 PP</span>
                            </div>
                            <!-- Progress bar -->
                            <div style="background: rgba(0,0,0,0.3); height: 8px; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); position: relative;">
                                <div id="bp-progress-fill" style="background: linear-gradient(90deg, #aa00ff, #00e5ff); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Sticky Columns Headers -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; margin-bottom: 6px; flex-shrink: 0; gap: 10px;">
                        <div style="flex: 1; background: rgba(0, 229, 255, 0.1); color: #00e5ff; padding: 4px 8px; border-radius: 6px; font-weight: 900; font-size: 10px; font-family: 'Orbitron', sans-serif; text-transform: uppercase; text-align: center; border: 1px solid #00e5ff; box-shadow: 0 0 6px rgba(0,229,255,0.2);">GRATIS</div>
                        <!-- spacing spacer for level badge -->
                        <div style="width: 30px;"></div>
                        <div style="flex: 1; background: rgba(224, 64, 251, 0.1); color: #e040fb; padding: 4px 8px; border-radius: 6px; font-weight: 900; font-size: 10px; font-family: 'Orbitron', sans-serif; text-transform: uppercase; text-align: center; border: 1px solid #e040fb; box-shadow: 0 0 6px rgba(224,64,251,0.2);">AVANZADO</div>
                    </div>

                    <!-- Levels List Grid Container -->
                    <div id="bp-levels-grid" style="flex: 1; overflow-y: auto; margin-bottom: 5px; display: flex; flex-direction: column; gap: 0; background: linear-gradient(to right, #252836 0%, #252836 50%, #2c253d 50%, #2c253d 100%); border-radius: 10px; border: 1.5px solid #32395c; position: relative;">
                        <!-- dynamic rows -->
                    </div>

                    <!-- Bottom Footer -->
                    <div id="bp-footer" style="background: #151824; border-top: 2.5px solid #aa00ff; border-bottom-left-radius: 17px; border-bottom-right-radius: 17px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; margin: 5px -18px 0 -18px; box-shadow: 0 -4px 15px rgba(0,0,0,0.3);">
                        <!-- will be populated dynamically -->
                    </div>

                </div>
            </div>
        `;
        const container = document.getElementById("game-container") || document.body;
        container.insertAdjacentHTML("beforeend", html);
    },

    openModal: function() {
        const modal = document.getElementById("battle-pass-modal");
        if (!modal) return;

        // Cerrar cajón lateral
        const drawer = document.getElementById("side-drawer");
        const arrow = document.getElementById("drawer-handle-arrow");
        if (drawer && drawer.style.left === "0px") {
            drawer.style.left = "-145px";
            if (arrow) arrow.style.transform = "rotate(0deg)";
        }

        modal.style.display = "flex";
        this.renderBattlePass();

        if (window.Sonidos) window.Sonidos.play("click");
    },

    closeModal: function() {
        const modal = document.getElementById("battle-pass-modal");
        if (modal) modal.style.display = "none";

        if (window.Sonidos) window.Sonidos.play("click");
    },

    renderBattlePass: function() {
        const lvlBadge = document.getElementById("bp-level-badge");
        const ppTracker = document.getElementById("bp-pp-tracker");
        const progressFill = document.getElementById("bp-progress-fill");
        const grid = document.getElementById("bp-levels-grid");

        if (!ppTracker || !progressFill || !grid) return;

        // 1. Cabecera y Progresión
        if (lvlBadge) lvlBadge.innerText = this.level;
        const currentPPInLevel = this.pp - ((this.level - 1) * 30);
        
        if (this.level >= 50) {
            ppTracker.innerText = "MAX NIVEL";
            progressFill.style.width = "100%";
        } else {
            ppTracker.innerText = `${currentPPInLevel} / 30 PP`;
            progressFill.style.width = `${(currentPPInLevel / 30) * 100}%`;
        }

        // 2. Grid de Niveles
        grid.innerHTML = "";

        for (let l = 1; l <= 50; l++) {
            const hasFree = !!this.freeRewards[l];
            const hasPremium = !!this.premiumRewards[l];

            const freeReward = this.freeRewards[l];
            const premiumReward = this.premiumRewards[l];

            const freeClaimed = this.claimedFree.includes(l);
            const premiumClaimed = this.claimedPremium.includes(l);

            const isLvlUnlocked = (this.level >= l);

            // Fila contenedora para el nivel
            const row = document.createElement("div");
            row.style = "display: flex; align-items: center; justify-content: space-between; position: relative; width: 100%; box-sizing: border-box; min-height: 90px; border-bottom: 1px solid rgba(0, 0, 0, 0.04);";

            // Columna 1: Gratis Box
            let freeBoxHtml = "";
            if (!hasFree) {
                freeBoxHtml = `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 10px 10px 15px; box-sizing: border-box; gap: 4px;">
                        <div style="width:60px; height:60px; background:rgba(0,0,0,0.25); border:1.5px dashed rgba(255,255,255,0.15); border-radius:12px; display:flex; align-items:center; justify-content:center;">
                            <span style="font-size:12px; color:rgba(255,255,255,0.3); font-family:'Orbitron',sans-serif;">-</span>
                        </div>
                        <span style="font-size: 8px; color: #b0c4de; font-weight: bold; text-align: center; max-width: 70px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.7;">Sin Recom.</span>
                    </div>
                `;
            } else {
                let cardStyle = "";
                let glowClass = "";
                let overlayHtml = "";
                let clickAction = "";
                let iconFilter = "";

                if (freeClaimed) {
                    cardStyle = "background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.4); opacity:0.7;";
                    iconFilter = "filter: grayscale(80%) drop-shadow(0 2px 3px rgba(0,0,0,0.2));";
                    overlayHtml = `
                        <div style="position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; background: #00e676; border-radius: 50%; border: 1.5px solid #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px rgba(0, 230, 118, 0.45);">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#fff" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                    `;
                } else if (isLvlUnlocked) {
                    cardStyle = "background: radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, rgba(30, 34, 53, 0) 75%), #1e2235; border:2.5px solid #00e5ff; cursor:pointer; box-shadow: 0 0 10px rgba(0, 229, 255, 0.45);";
                    iconFilter = "filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.85));";
                    glowClass = "bp-glow-free";
                    clickAction = `onclick="window.BattlePassManager.claimFree(${l})"`;
                } else {
                    cardStyle = "background: radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(30, 34, 53, 0) 75%), #1e2235; border: 1.5px solid rgba(0, 229, 255, 0.7); box-shadow: 0 0 6px rgba(0, 229, 255, 0.25), inset 0 0 4px rgba(0, 229, 255, 0.15);";
                    iconFilter = "opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 229, 255, 0.45));";
                    overlayHtml = `
                        <div style="position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; background: #252836; border-radius: 50%; border: 1.5px solid #00e5ff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px rgba(0, 229, 255, 0.65);">
                            <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#00e5ff" stroke-width="3.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                    `;
                }

                freeBoxHtml = `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 10px 10px 15px; box-sizing: border-box; gap: 4px;">
                        <div class="${glowClass}" ${clickAction} style="width: 60px; height: 60px; border-radius: 12px; position: relative; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.2); ${cardStyle}">
                            <div style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; ${iconFilter}">${freeReward.svg}</div>
                            ${overlayHtml}
                        </div>
                        <span style="font-size: 8px; color: #ffffff; text-shadow: 0 0 4px rgba(0,0,0,0.6); font-weight: bold; text-align: center; max-width: 70px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${freeReward.name}">
                            ${freeReward.name}
                        </span>
                    </div>
                `;
            }

            // Columna 2: Premium Box
            let premiumBoxHtml = "";
            if (!hasPremium) {
                premiumBoxHtml = `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 15px 10px 10px; box-sizing: border-box; gap: 4px;">
                        <div style="width:60px; height:60px; background:rgba(0,0,0,0.25); border:1.5px dashed rgba(255,255,255,0.15); border-radius:12px; display:flex; align-items:center; justify-content:center;">
                            <span style="font-size:12px; color:rgba(255,255,255,0.3); font-family:'Orbitron',sans-serif;">-</span>
                        </div>
                        <span style="font-size: 8px; color: #b0c4de; font-weight: bold; text-align: center; max-width: 70px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.7;">Sin Recom.</span>
                    </div>
                `;
            } else {
                let cardStyle = "";
                let glowClass = "";
                let overlayHtml = "";
                let clickAction = "";
                let iconFilter = "";

                if (premiumClaimed) {
                    cardStyle = "background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.4); opacity:0.7;";
                    iconFilter = "filter: grayscale(80%) drop-shadow(0 2px 3px rgba(0,0,0,0.2));";
                    overlayHtml = `
                        <div style="position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; background: #00e676; border-radius: 50%; border: 1.5px solid #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px rgba(0, 230, 118, 0.45);">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#fff" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                    `;
                } else if (!this.premiumUnlocked) {
                    cardStyle = "background: radial-gradient(circle, rgba(224, 64, 251, 0.12) 0%, rgba(30, 34, 53, 0) 75%), #1e2235; border: 1.5px solid rgba(224, 64, 251, 0.75); cursor:pointer; box-shadow: 0 0 6px rgba(224, 64, 251, 0.3), inset 0 0 4px rgba(224, 64, 251, 0.15);";
                    iconFilter = "opacity: 0.6; filter: drop-shadow(0 0 4px rgba(224, 64, 251, 0.45));";
                    clickAction = `onclick="window.BattlePassManager.buyPremium()"`;
                    overlayHtml = `
                        <div style="position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; background: #252836; border-radius: 50%; border: 1.5px solid #e040fb; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px rgba(224, 64, 251, 0.65);">
                            <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#e040fb" stroke-width="3.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                    `;
                } else if (isLvlUnlocked) {
                    cardStyle = "background: radial-gradient(circle, rgba(224, 64, 251, 0.25) 0%, rgba(30, 34, 53, 0) 75%), #1e2235; border:2.5px solid #e040fb; cursor:pointer; box-shadow: 0 0 10px rgba(224, 64, 251, 0.45);";
                    iconFilter = "filter: drop-shadow(0 0 8px rgba(224, 64, 251, 0.85));";
                    glowClass = "bp-glow-premium";
                    clickAction = `onclick="window.BattlePassManager.claimPremium(${l})"`;
                } else {
                    cardStyle = "background: radial-gradient(circle, rgba(224, 64, 251, 0.12) 0%, rgba(30, 34, 53, 0) 75%), #1e2235; border: 1.5px solid rgba(224, 64, 251, 0.7); box-shadow: 0 0 6px rgba(224, 64, 251, 0.25), inset 0 0 4px rgba(224, 64, 251, 0.15);";
                    iconFilter = "opacity: 0.6; filter: drop-shadow(0 0 4px rgba(224, 64, 251, 0.45));";
                    overlayHtml = `
                        <div style="position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; background: #252836; border-radius: 50%; border: 1.5px solid #e040fb; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px rgba(224, 64, 251, 0.65);">
                            <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#e040fb" stroke-width="3.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                    `;
                }

                premiumBoxHtml = `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 15px 10px 10px; box-sizing: border-box; gap: 4px;">
                        <div class="${glowClass}" ${clickAction} style="width: 60px; height: 60px; border-radius: 12px; position: relative; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.2); ${cardStyle}">
                            <div style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; ${iconFilter}">${premiumReward.svg}</div>
                            ${overlayHtml}
                        </div>
                        <span style="font-size: 8px; color: #ffffff; text-shadow: 0 0 4px rgba(0,0,0,0.6); font-weight: bold; text-align: center; max-width: 70px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${premiumReward.name}">
                            ${premiumReward.name}
                        </span>
                    </div>
                `;
            }

            // Central level divider
            const centerHtml = `
                <div style="width: 30px; align-self: stretch; display: flex; justify-content: center; align-items: center; position: relative;">
                    <!-- vertical line segment -->
                    <div style="position: absolute; top: 0; bottom: 0; width: 6px; background: linear-gradient(180deg, #aa00ff, #00e5ff); z-index: 1; box-shadow: 0 0 6px rgba(0, 229, 255, 0.35);"></div>
                    <!-- level badge hexagon -->
                    <div style="z-index: 2; width: 22px; height: 22px; background: #aa00ff; border: 2px solid #00e5ff; color: #ffffff; font-weight: 900; font-size: 9px; display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); box-shadow: 0 0 8px rgba(0,229,255,0.4);">
                        ${l}
                    </div>
                </div>
            `;

            row.innerHTML = `
                ${freeBoxHtml}
                ${centerHtml}
                ${premiumBoxHtml}
            `;
            grid.appendChild(row);
        }

        // 3. Actualizar el Footer
        const footer = document.getElementById("bp-footer");
        if (footer) {
            const commonBtnStyle = "height: 36px; padding: 0 16px; border-radius: 6px; font-size: 11px; font-family: 'Orbitron', sans-serif; font-weight: 900; line-height: 1; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid rgba(255, 255, 255, 0.25); box-sizing: border-box; width: 46%; text-transform: uppercase; text-align: center; box-shadow: 0 3px 6px rgba(0,0,0,0.15); transition: transform 0.2s;";

            let buyBtnHtml = "";
            if (this.premiumUnlocked) {
                buyBtnHtml = `
                    <div style="${commonBtnStyle} background: #aa00ff; color: #fff; cursor: default; box-shadow: 0 0 10px rgba(170, 0, 255, 0.3);">PREMIUM ACTIVO</div>
                `;
            } else {
                buyBtnHtml = `
                    <button onclick="window.BattlePassManager.buyPremium()" style="${commonBtnStyle} background: #e040fb; color: #fff; cursor: pointer; box-shadow: 0 0 10px rgba(224, 64, 251, 0.3);" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='none'">COMPRAR PREMIUM</button>
                `;
            }

            footer.innerHTML = `
                <button onclick="window.BattlePassManager.claimAll()" style="${commonBtnStyle} background: #00e676; color: #fff; cursor: pointer; box-shadow: 0 0 10px rgba(0, 230, 118, 0.3);" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='none'">RECLAMAR TODO</button>
                ${buyBtnHtml}
            `;
        }

        // Auto Scroll hasta el nivel del jugador
        setTimeout(() => {
            const unlockedRows = grid.children;
            const targetIndex = Math.max(0, this.level - 2);
            if (unlockedRows[targetIndex]) {
                grid.scrollTop = unlockedRows[targetIndex].offsetTop - 20;
            }
        }, 100);
    },

    // Otorgar un ítem al inventario
    entregarPremioBP: function(reward) {
        if (!window.miInventario) {
            alert("❌ Error: El sistema de inventario no está cargado.");
            return false;
        }

        if (reward.type === "essence") {
            if (typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(reward.count);
            } else {
                window.miInventario.vitalEssence = (window.miInventario.vitalEssence || 0) + reward.count;
                if (typeof window.miInventario.updateUI === 'function') window.miInventario.updateUI();
            }
            if (typeof window.registrarLogEconomia === "function") {
                window.registrarLogEconomia('reward', reward.count, 'battle_pass');
            }
            return true;
        }

        // Es un ítem de inventario (manzana, ducha, plano o skin)
        const type = (reward.id === "apple_01" || reward.id === "plasma_shower") ? "consumable" : "basic";
        const maxStack = type === "consumable" ? 20 : 99;

        const itemObj = {
            id: reward.id,
            name: reward.name,
            icon: reward.svg,
            type: type,
            maxStack: maxStack,
            desc: reward.desc,
            count: reward.count
        };

        if (typeof window.miInventario.addItem === "function") {
            return window.miInventario.addItem(itemObj);
        } else {
            if (!window.miInventario.items) window.miInventario.items = [];
            window.miInventario.items.push(itemObj);
            return true;
        }
    },

    claimFree: function(lvl) {
        if (this.level < lvl) return;
        if (this.claimedFree.includes(lvl)) return;

        const reward = this.freeRewards[lvl];
        if (!reward) return;

        const exito = this.entregarPremioBP(reward);
        if (exito) {
            this.claimedFree.push(lvl);
            
            if (window.Sonidos) window.Sonidos.play("heal");
            alert(`✨ ¡Felicidades! Has reclamado tu recompensa Gratis Nivel ${lvl}: ${reward.name}.`);

            if (typeof window.guardarProgreso === 'function') {
                window.guardarProgreso();
            }
            this.renderBattlePass();
        }
    },

    claimPremium: function(lvl) {
        if (!this.premiumUnlocked) return;
        if (this.level < lvl) return;
        if (this.claimedPremium.includes(lvl)) return;

        const reward = this.premiumRewards[lvl];
        if (!reward) return;

        const exito = this.entregarPremioBP(reward);
        if (exito) {
            this.claimedPremium.push(lvl);
            
            if (window.Sonidos) window.Sonidos.play("heal");
            alert(`✨ ¡Felicidades! Has reclamado tu recompensa Premium Nivel ${lvl}: ${reward.name}.`);

            if (typeof window.guardarProgreso === 'function') {
                window.guardarProgreso();
            }
            this.renderBattlePass();
        }
    },

    claimAll: function() {
        let claimedAny = false;
        let itemsClaimed = [];

        for (let l = 1; l <= this.level; l++) {
            // Reclamar gratis
            if (this.freeRewards[l] && !this.claimedFree.includes(l)) {
                if (this.entregarPremioBP(this.freeRewards[l])) {
                    this.claimedFree.push(l);
                    itemsClaimed.push(`${this.freeRewards[l].name} (Gratis Nivel ${l})`);
                    claimedAny = true;
                }
            }
            // Reclamar premium
            if (this.premiumUnlocked && this.premiumRewards[l] && !this.claimedPremium.includes(l)) {
                if (this.entregarPremioBP(this.premiumRewards[l])) {
                    this.claimedPremium.push(l);
                    itemsClaimed.push(`${this.premiumRewards[l].name} (Premium Nivel ${l})`);
                    claimedAny = true;
                }
            }
        }

        if (claimedAny) {
            if (window.Sonidos) window.Sonidos.play("heal");
            alert(`✨ ¡RECLAMO MASIVO COMPLETADO! ✨\nHas recibido:\n- ${itemsClaimed.join("\n- ")}`);
            if (typeof window.guardarProgreso === 'function') {
                window.guardarProgreso();
            }
            this.renderBattlePass();
        } else {
            alert("No tienes recompensas pendientes por reclamar en tus niveles actuales.");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.BattlePassManager.init();
});
