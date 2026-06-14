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
        const svgApple = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 2C11.5 2 11 2.5 11 3s.5 1 1 1c2.5 0 4 2 4 4s.5 1 1 1 1-.5 1-1-2.5-6-6-6Z" fill="#FFA726"/><path d="M12 6c-3 0-6 2.5-6 6s3 7.5 6 7.5 6-3.5 6-7.5-3-6-6-6Z" fill="#EF5350"/></svg>`;
        const svgShower = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="3" y="10" width="18" height="11" rx="3" stroke="#00E5FF" stroke-width="2"/><circle cx="7" cy="13" r="1.5" fill="#00E5FF"/><circle cx="12" cy="15" r="2" fill="#00E5FF"/><path d="M12 2v8" stroke="#00E5FF" stroke-width="2"/></svg>`;
        const svgEssence = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 1L14.5 8.5L22 11L14.5 13.5L12 21L9.5 13.5L2 11L9.5 8.5L12 1Z" fill="#FFD700"/></svg>`;
        
        // Estabilizador Atómico SVG
        const svgStabilizer = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#e040fb" stroke-width="2"><circle cx="12" cy="12" r="9" stroke-dasharray="4 2"/><circle cx="12" cy="12" r="3" fill="#e040fb"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke-linecap="round"/></svg>`;
        
        // Cosméticos Planos SVG
        const svgBlueprint = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffd54f" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9M15 21V9"/></svg>`;

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
                    svg: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#e040fb" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" opacity="0.4"/></svg>`,
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

    // Inyectar HTML del modal
    inyectarModal: function() {
        if (document.getElementById("battle-pass-modal")) return;

        const html = `
            <div id="battle-pass-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(6, 8, 16, 0.65); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:4000; justify-content:center; align-items:center; font-family:'Outfit', sans-serif;">
                <style>
                    #bp-levels-grid::-webkit-scrollbar {
                        display: none !important;
                    }
                    #bp-levels-grid {
                        scrollbar-width: none !important;
                        -ms-overflow-style: none !important;
                    }
                </style>
                <div style="background:linear-gradient(135deg, rgba(22, 14, 36, 0.95), rgba(10, 6, 18, 0.98)); border:2px solid rgba(224, 64, 251, 0.35); border-radius:16px; width:90%; max-width:350px; max-height:90%; display:flex; flex-direction:column; box-sizing:border-box; padding:20px; color:white; box-shadow:0 0 30px rgba(224,64,251,0.15), inset 0 0 15px rgba(0, 0, 0, 0.6); position:relative;">
                    
                    <!-- Header -->
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px; margin-bottom:15px; flex-shrink:0;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#e040fb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px rgba(224,64,251,0.4));">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            <h2 style="margin:0; font-size:16px; font-family:'Orbitron', sans-serif; letter-spacing:1px; color:#e040fb; font-weight:900;">PASE NEXO TEMPORADA</h2>
                        </div>
                        <button onclick="window.BattlePassManager.closeModal()" style="background:transparent; border:none; color:#888; font-size:16px; font-weight:bold; cursor:pointer; transition:0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">✕</button>
                    </div>

                    <!-- Progress and PP Info -->
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; flex-shrink:0;">
                        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
                            <span id="bp-level-title" style="font-family:'Orbitron', sans-serif; font-size:14px; font-weight:bold; color:#e040fb;">Nivel --</span>
                            <span id="bp-pp-tracker" style="font-family:'Orbitron', sans-serif; font-size:11px; color:#aaa;">-- / 30 PP</span>
                        </div>
                        <!-- Progress bar -->
                        <div style="background:rgba(255,255,255,0.06); height:8px; border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,0.02); margin-bottom:4px;">
                            <div id="bp-progress-fill" style="background:#e040fb; width:0%; height:100%; border-radius:4px; box-shadow:0 0 8px #e040fb; transition:width 0.3s ease;"></div>
                        </div>
                        <div style="font-size:9px; color:#666; text-transform:uppercase; text-align:right;">30 Puntos de Pase para el siguiente nivel</div>
                    </div>

                    <!-- Upgrade to Premium Banner -->
                    <div id="bp-premium-banner" style="background:linear-gradient(90deg, rgba(224, 64, 251, 0.12), rgba(123, 31, 162, 0.15)); border:1px solid rgba(224, 64, 251, 0.4); border-radius:12px; padding:12px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 0 15px rgba(224, 64, 251, 0.05); flex-shrink:0;">
                        <div>
                            <h4 style="margin:0; font-size:11px; font-weight:bold; color:#e040fb; font-family:'Orbitron', sans-serif; letter-spacing:0.5px;">HABILITAR RUTA PREMIUM</h4>
                            <p style="margin:3px 0 0 0; font-size:9px; color:#ccc; line-height:1.2;">+1,000 EV extra por nivel, cosméticos y auras exclusivas.</p>
                        </div>
                        <button id="btn-buy-bp-premium" onclick="window.BattlePassManager.buyPremium()" style="background:#e040fb; color:#101424; border:none; border-radius:6px; padding:6px 12px; font-size:10px; font-weight:bold; cursor:pointer; font-family:'Orbitron', sans-serif; transition:0.2s; box-shadow:0 0 10px rgba(224,64,251,0.4);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">0.1 POL</button>
                    </div>

                    <!-- Levels List Grid Container -->
                    <div id="bp-levels-grid" style="flex:1; min-height:100px; max-height:240px; overflow-y:auto; padding-right:6px; margin-bottom:10px; display:flex; flex-direction:column; gap:10px;">
                        <!-- dynamic rows -->
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
        const lvlTitle = document.getElementById("bp-level-title");
        const ppTracker = document.getElementById("bp-pp-tracker");
        const progressFill = document.getElementById("bp-progress-fill");
        const premiumBanner = document.getElementById("bp-premium-banner");
        const grid = document.getElementById("bp-levels-grid");

        if (!lvlTitle || !ppTracker || !progressFill || !grid) return;

        // 1. Cabecera y Progresión
        lvlTitle.innerText = `Nivel ${this.level}`;
        const currentPPInLevel = this.pp - ((this.level - 1) * 30);
        
        if (this.level >= 50) {
            ppTracker.innerText = "MAX NIVEL";
            progressFill.style.width = "100%";
        } else {
            ppTracker.innerText = `${currentPPInLevel} / 30 PP`;
            progressFill.style.width = `${(currentPPInLevel / 30) * 100}%`;
        }

        // 2. Banner Premium
        if (this.premiumUnlocked) {
            premiumBanner.style.background = "linear-gradient(90deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.15))";
            premiumBanner.style.borderColor = "rgba(76, 175, 80, 0.4)";
            premiumBanner.innerHTML = `
                <div>
                    <h4 style="margin:0; font-size:11px; font-weight:bold; color:#4caf50; font-family:'Orbitron', sans-serif; letter-spacing:0.5px;">✓ MÓDULO PREMIUM ACTIVO</h4>
                    <p style="margin:2px 0 0 0; font-size:9px; color:#aaa;">Todas las recompensas de la fila inferior están desbloqueadas.</p>
                </div>
                <div style="font-size:10px; font-weight:bold; color:#4caf50; font-family:'Orbitron', sans-serif; letter-spacing:0.5px; border:1px solid rgba(76,175,80,0.5); padding:4px 8px; border-radius:4px; background:rgba(76,175,80,0.1);">ACTIVO</div>
            `;
        }

        // 3. Grid de Niveles
        grid.innerHTML = "";

        // Mostrar del nivel actual y superiores/inferiores ordenados descendentemente (para mayor visibilidad)
        // o ascendentemente (de 1 a 50). Ascendente de 1 a 50 con autoscroll al nivel actual es la mejor experiencia.
        for (let l = 1; l <= 50; l++) {
            const hasFree = !!this.freeRewards[l];
            const hasPremium = !!this.premiumRewards[l];

            const freeReward = this.freeRewards[l];
            const premiumReward = this.premiumRewards[l];

            const freeClaimed = this.claimedFree.includes(l);
            const premiumClaimed = this.claimedPremium.includes(l);

            const isLvlUnlocked = (this.level >= l);

            const row = document.createElement("div");
            row.style = "background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255,255,255,0.05); border-radius:10px; display:flex; gap:10px; padding:10px; align-items:center; box-sizing:border-box; position:relative;";

            if (isLvlUnlocked) {
                row.style.borderColor = "rgba(224, 64, 251, 0.18)";
            }

            // Nivel insignia a la izquierda
            let badgeBg = "rgba(255,255,255,0.04)";
            let badgeBorder = "1px solid rgba(255,255,255,0.1)";
            let badgeColor = "#aaa";

            if (isLvlUnlocked) {
                badgeBg = "rgba(224, 64, 251, 0.15)";
                badgeBorder = "1px solid #e040fb";
                badgeColor = "#e040fb";
            }

            const badgeHtml = `
                <div style="width:38px; height:38px; background:${badgeBg}; border:${badgeBorder}; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 0 6px rgba(224, 64, 251, ${isLvlUnlocked ? '0.1' : '0'});">
                    <span style="font-size:7px; color:#666; font-weight:bold; text-transform:uppercase;">Nivel</span>
                    <span style="font-family:'Orbitron', sans-serif; font-size:14px; font-weight:900; color:${badgeColor}; line-height:1.1;">${l}</span>
                </div>
            `;

            // Fila gratis (arriba) y premium (abajo) en el centro
            let freeBlockHtml = `<div style="flex:1; display:flex; justify-content:center; align-items:center; color:#666; font-size:9px;">VACÍO</div>`;
            if (hasFree) {
                let freeBtnHtml = "";
                let freeColor = "#fff";

                if (freeClaimed) {
                    freeBtnHtml = `<span style="font-size:9px; color:#4caf50; font-weight:bold; font-family:'Orbitron', sans-serif;">RECLAMADO</span>`;
                    freeColor = "#888";
                } else if (isLvlUnlocked) {
                    freeBtnHtml = `<button onclick="window.BattlePassManager.claimFree(${l})" style="background:#00e5ff; color:#101424; border:none; border-radius:4px; padding:3px 6px; font-size:8px; font-weight:bold; cursor:pointer; font-family:'Orbitron', sans-serif;">RECLAMAR</button>`;
                } else {
                    freeBtnHtml = `<span style="font-size:8px; color:#555; font-family:'Orbitron', sans-serif;">BLOQUEADO</span>`;
                }

                freeBlockHtml = `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <div style="width:20px; height:20px; display:flex; align-items:center; justify-content:center;">${freeReward.svg}</div>
                            <span style="font-size:10px; color:${freeColor}; font-weight:bold; max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${freeReward.name}">${freeReward.name}</span>
                        </div>
                        ${freeBtnHtml}
                    </div>
                `;
            }

            let premiumBlockHtml = "";
            let premiumBtnHtml = "";
            let premiumColor = "#fff";

            if (premiumClaimed) {
                premiumBtnHtml = `<span style="font-size:9px; color:#4caf50; font-weight:bold; font-family:'Orbitron', sans-serif;">RECLAMADO</span>`;
                premiumColor = "#888";
            } else if (!this.premiumUnlocked) {
                premiumBtnHtml = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#e040fb" stroke-width="2.5" style="filter:drop-shadow(0 0 3px rgba(224,64,251,0.5));" title="Recompensa Premium Bloqueada"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
                premiumColor = "#f8bbd0"; // Bright readable pink
            } else if (isLvlUnlocked) {
                premiumBtnHtml = `<button onclick="window.BattlePassManager.claimPremium(${l})" style="background:#e040fb; color:#101424; border:none; border-radius:4px; padding:3px 6px; font-size:8px; font-weight:bold; cursor:pointer; font-family:'Orbitron', sans-serif;">RECLAMAR</button>`;
                premiumColor = "#fff";
            } else {
                premiumBtnHtml = `<span style="font-size:8px; color:#555; font-family:'Orbitron', sans-serif;">BLOQUEADO</span>`;
                premiumColor = "#aaa";
            }

            premiumBlockHtml = `
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%;">
                    <div style="display:flex; align-items:center; gap:6px;">
                        <div style="width:20px; height:20px; display:flex; align-items:center; justify-content:center; opacity:1;">${premiumReward.svg}</div>
                        <span style="font-size:10px; color:${premiumColor}; font-weight:bold; max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${premiumReward.name}">${premiumReward.name}</span>
                    </div>
                    ${premiumBtnHtml}
                </div>
            `;

            row.appendChild(badgeHtml);
            
            // Contenedor central de dos filas (Gratuito arriba, Premium abajo)
            const rewardsColumn = document.createElement("div");
            rewardsColumn.style = "flex:1; display:flex; flex-direction:column; gap:6px; border-left:1px solid rgba(255,255,255,0.04); padding-left:10px;";
            
            rewardsColumn.innerHTML = `
                <!-- Fila Gratis -->
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:7px; color:#00e5ff; font-weight:bold; text-transform:uppercase; font-family:'Orbitron', sans-serif; letter-spacing:0.5px; width:45px;">Gratis</span>
                    <div style="flex:1; display:flex; align-items:center; justify-content:flex-end;">
                        ${freeBlockHtml}
                    </div>
                </div>
                
                <!-- Divisor -->
                <div style="height:1px; background:rgba(255,255,255,0.03); width:100%;"></div>

                <!-- Fila Premium -->
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:7px; color:#e040fb; font-weight:bold; text-transform:uppercase; font-family:'Orbitron', sans-serif; letter-spacing:0.5px; width:45px;">Premium</span>
                    <div style="flex:1; display:flex; align-items:center; justify-content:flex-end;">
                        ${premiumBlockHtml}
                    </div>
                </div>
            `;

            row.appendChild(rewardsColumn);
            grid.appendChild(row);
        }

        // Auto Scroll hasta el nivel del jugador (para que el nivel desbloqueado actual esté a la vista)
        setTimeout(() => {
            const unlockedRows = grid.children;
            const targetIndex = Math.max(0, this.level - 2); // centrar un poco el nivel actual
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
            const exito = window.miInventario.addItem(itemObj);
            return exito;
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

        // Entregar premio
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

        // Entregar premio
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
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.BattlePassManager.init();
});
