// ========================================================
// AchievementsManager.js - GESTOR DE LOGROS DE CUENTA
// ========================================================

window.AchievementsManager = {
    data: {
        despertarBiologico: { unlocked: false, claimed: false },
        combustionMasiva: { count: 0, unlocked: false, claimed: false },
        nexoVeterano: { unlocked: false, claimed: false }
    },

    init: function() {
        this.escanearColeccionActiva();
    },

    getSaveData: function() {
        return this.data;
    },

    loadSaveData: function(savedData) {
        if (savedData) {
            this.data = {
                despertarBiologico: savedData.despertarBiologico || { unlocked: false, claimed: false },
                combustionMasiva: savedData.combustionMasiva || { count: 0, unlocked: false, claimed: false },
                nexoVeterano: savedData.nexoVeterano || { unlocked: false, claimed: false }
            };
        }
        // Ejecutamos escaneo para desbloquear por retrocompatibilidad si es necesario
        this.escanearColeccionActiva();
    },

    escanearColeccionActiva: function() {
        // 1. Despertar Biológico (primer Geno Raro o superior)
        if (!this.data.despertarBiologico.unlocked) {
            const tieneRaro = window.misGenos && window.misGenos.some(g => 
                !g.isEgg && ["Raro", "Épico", "Legendario", "Mítico"].includes(g.rarity)
            );
            if (tieneRaro) {
                this.data.despertarBiologico.unlocked = true;
            }
        }

        // 2. Veterano del Nexo (Piso 25 de la Torre)
        if (!this.data.nexoVeterano.unlocked) {
            const maxFloorVal = window.maxFloor || 0;
            if (maxFloorVal >= 25) {
                this.data.nexoVeterano.unlocked = true;
            }
        }

        // 3. Combustión Masiva (Auto-unlock si se alcanza el total requerido por alguna discrepancia)
        if (!this.data.combustionMasiva.unlocked && this.data.combustionMasiva.count >= 50) {
            this.data.combustionMasiva.unlocked = true;
        }
    },

    unlock: function(id) {
        if (this.data[id] && !this.data[id].unlocked) {
            this.data[id].unlocked = true;
            if (window.Sonidos) window.Sonidos.play("levelup");
            
            // Guardamos localmente
            if (typeof window.guardarLocalSilencioso === 'function') window.guardarLocalSilencioso();
        }
    },

    registrarConsumoGenos: function(cantidad) {
        if (!this.data.combustionMasiva.unlocked) {
            this.data.combustionMasiva.count += cantidad;
            if (this.data.combustionMasiva.count >= 50) {
                this.data.combustionMasiva.count = 50;
                this.data.combustionMasiva.unlocked = true;
                if (window.Sonidos) window.Sonidos.play("levelup");
            }
            if (typeof window.guardarLocalSilencioso === 'function') window.guardarLocalSilencioso();
        }
    },

    registrarNacimientoRarity: function(rarity) {
        if (!this.data.despertarBiologico.unlocked) {
            if (["Raro", "Épico", "Legendario", "Mítico"].includes(rarity)) {
                this.unlock("despertarBiologico");
            }
        }
    },

    verificarAlturaTorre: function(piso) {
        if (!this.data.nexoVeterano.unlocked && piso >= 25) {
            this.unlock("nexoVeterano");
        }
    },

    reclamarRecompensa: function(id) {
        const logro = this.data[id];
        if (!logro || !logro.unlocked || logro.claimed) return;

        logro.claimed = true;

        // Otorgar 5,000 EV
        if (window.miInventario) {
            if (typeof window.miInventario.addEssence === 'function') {
                window.miInventario.addEssence(5000);
            } else {
                window.miInventario.vitalEssence += 5000;
                if (typeof window.miInventario.updateUI === 'function') window.miInventario.updateUI();
            }
        }
        if (typeof window.registrarLogEconomia === "function") {
            window.registrarLogEconomia('reward', 5000, 'achievement');
        }

        // Efectos e Interfaz
        if (window.Sonidos) window.Sonidos.play("heal");

        // Alerta Cyberpunk
        let msgAdicional = "";
        if (id === "nexoVeterano") {
            msgAdicional = "\n\n🏆 ¡Has desbloqueado el Título Honorífico 'Veterano del Nexo' en tu perfil!";
        }
        alert(`🌟 ¡RECOMPENSA RECLAMADA! 🌟\n───────────────────────────────\nHas completado con éxito este logro histórico.\n\nRecompensa: ✨ +5.000 Esencia Vital${msgAdicional}`);

        // Guardar progreso
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        // Refrescar el perfil
        if (window.ProfileManager && window.ProfileManager.inicializado) {
            window.ProfileManager.renderPerfil();
        }
    },

    renderTarjetaLogros: function() {
        const d = this.data;

        // SVGs Cyberpunk
        const dnaSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e040fb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px rgba(224, 64, 251, 0.4));"><path d="M4.5 10.5C4.5 7.46 6.96 5 10 5s5.5 2.46 5.5 5.5S13.04 16 10 16s-5.5-2.46-5.5-5.5z"/><path d="M10 2v3M10 16v6M3.3 7l2.6 1.5M14.1 12l2.6 1.5M16.7 7l-2.6 1.5M5.9 12l-2.6 1.5"/></svg>`;
        const fireSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px rgba(255, 152, 0, 0.4));"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
        const trophySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.4));"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a4 4 0 0 1 4 4v7H8V6a4 4 0 0 1 4-4z"/></svg>`;

        // Construir fila de logros
        const buildLogroRow = (id, icon, name, desc, progressHtml, isUnlocked, isClaimed) => {
            let btnClass = "btn-achievement-claim";
            let btnText = "Bloqueado";
            let btnStyle = "background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #64748b; cursor: not-allowed;";
            
            if (isClaimed) {
                btnText = "Reclamado";
                btnStyle = "background: rgba(76, 175, 80, 0.08); border: 1.5px solid rgba(76, 175, 80, 0.25); color: #69f0ae; cursor: not-allowed;";
            } else if (isUnlocked) {
                btnText = "Reclamar";
                btnStyle = "background: rgba(213, 0, 249, 0.12); border: 1.5px solid #D500F9; color: #fff; cursor: pointer; text-shadow: 0 0 3px #D500F9; font-weight: bold; animation: pulseGlow 1.5s infinite;";
            } else {
                btnText = "En Progreso";
                btnStyle = "background: rgba(255, 152, 0, 0.05); border: 1px solid rgba(255, 152, 0, 0.2); color: #ff9800; cursor: not-allowed;";
            }

            return `
                <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                        <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: rgba(255,255,255,0.04); border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.08);">
                            ${icon}
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; text-align: left;">
                            <span style="font-size: 12px; font-weight: bold; color: #fff; letter-spacing: 0.5px;">${name}</span>
                            <span style="font-size: 10px; color: #94a3b8; line-height: 1.25; margin-top: 2px;">${desc}</span>
                        </div>
                    </div>
                    
                    ${progressHtml}

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.06); padding-top: 8px; margin-top: 2px;">
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: bold; color: #ffcc00;">
                            <span>Recompensa:</span>
                            <span style="display:inline-block; width:12px; height:12px; transform:translateY(-1px);">${window.iconoEV || ''}</span>
                            <span>5.000 EV</span>
                            ${id === "nexoVeterano" ? '<span style="color:#a855f7; font-size:9px;">+ 🏆 Título</span>' : ''}
                        </div>
                        <button class="${btnClass}" data-id="${id}" style="padding: 6px 12px; border-radius: 5px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; box-sizing: border-box; ${btnStyle}" ${(!isUnlocked || isClaimed) ? 'disabled' : ''}>
                            ${btnText}
                        </button>
                    </div>
                </div>
            `;
        };

        // 1. Despertar Biológico (Raro en Reactor)
        const p1Status = d.despertarBiologico.unlocked ? `<span style="color:#69f0ae;">✔ Completado</span>` : `<span style="color:#94a3b8; font-style:italic;">Huevo o reactor pendiente...</span>`;
        const p1Html = `<div style="font-size: 9px; display: flex; justify-content: space-between; font-family: monospace;"><span>Estado:</span> ${p1Status}</div>`;

        // 2. Combustión Masiva (50 sacrificios)
        const count = d.combustionMasiva.count || 0;
        const countPct = Math.min(100, (count / 50) * 100);
        const p2Html = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="font-size: 9px; display: flex; justify-content: space-between; font-family: monospace; color:#cbd5e1;">
                    <span>Progreso Sacrificios:</span>
                    <span style="font-weight: bold; color: #ff9800;">${count} / 50</span>
                </div>
                <div style="width: 100%; height: 5px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: ${countPct}%; height: 100%; background: linear-gradient(90deg, #ff9800, #ff5722); border-radius: 3px; box-shadow: 0 0 5px rgba(255, 152, 0, 0.4); transition: width 0.3s;"></div>
                </div>
            </div>
        `;

        // 3. Veterano del Nexo (Piso 25)
        const maxFloorVal = window.maxFloor || 0;
        const floorPct = Math.min(100, (maxFloorVal / 25) * 100);
        const p3Html = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="font-size: 9px; display: flex; justify-content: space-between; font-family: monospace; color:#cbd5e1;">
                    <span>Piso Máximo Alcanzado:</span>
                    <span style="font-weight: bold; color: #ffd700;">Piso ${maxFloorVal} / 25</span>
                </div>
                <div style="width: 100%; height: 5px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: ${floorPct}%; height: 100%; background: linear-gradient(90deg, #ffd700, #ffb300); border-radius: 3px; box-shadow: 0 0 5px rgba(255, 215, 0, 0.4); transition: width 0.3s;"></div>
                </div>
            </div>
        `;

        // Animación de pulso css
        const pulseAnimStyle = `
            @keyframes pulseGlow {
                0% { box-shadow: 0 0 5px rgba(213, 0, 249, 0.4); transform: scale(1); }
                50% { box-shadow: 0 0 15px rgba(213, 0, 249, 0.8); transform: scale(1.02); }
                100% { box-shadow: 0 0 5px rgba(213, 0, 249, 0.4); transform: scale(1); }
            }
        `;
        let styleTag = document.getElementById("achievements-pulse-style");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "achievements-pulse-style";
            styleTag.innerHTML = pulseAnimStyle;
            document.head.appendChild(styleTag);
        }

        return `
            <!-- TARJETA: LOGROS DE LA CUENTA -->
            <div class="profile-card-neon" style="--card-glow-color: #a855f7; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #a855f7);">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span style="font-size: 11px; color: #a855f7; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Logros de la Cuenta (Achievements)</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${buildLogroRow("despertarBiologico", dnaSvg, "Despertar Biológico", "Sintetizar tu primer Geno de rareza Rara o superior en el Reactor.", p1Html, d.despertarBiologico.unlocked, d.despertarBiologico.claimed)}
                    ${buildLogroRow("combustionMasiva", fireSvg, "Combustión Masiva", "Quemar un acumulado histórico de 50 Genos en fisiones del Reactor.", p2Html, d.combustionMasiva.unlocked, d.combustionMasiva.claimed)}
                    ${buildLogroRow("nexoVeterano", trophySvg, "Veterano del Nexo", "Registrar el código del Piso 25 de la Torre de Mutación en tu cuenta.", p3Html, d.nexoVeterano.unlocked, d.nexoVeterano.claimed)}
                </div>
            </div>
        `;
    }
};
