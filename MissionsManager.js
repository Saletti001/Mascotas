// ========================================================
// MissionsManager.js - GESTOR DE MISIONES DIARIAS Y SEMANALES
// ========================================================

window.MissionsManager = {
    lastResetDate: "",
    lastResetWeek: "",
    
    // Progresos y reclamos
    dailyProgress: [0, 0, 0],
    dailyClaimed: [false, false, false],
    dailyBonusClaimed: false,
    
    weeklyProgress: [0, 0, 0],
    weeklyClaimed: [false, false, false],

    activeTab: "daily", // "daily" | "weekly"
    timerInterval: null,

    // Configuración de Misiones
    dailyConfig: [
        {
            title: "EL BUEN CREADOR",
            desc: "Satisface las necesidades de higiene o alimentación de 3 Genos en el menú de Cuidado.",
            goal: 3,
            rewardEV: 100,
            rewardPP: 10,
            svg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>`
        },
        {
            title: "REY DEL ARCADE",
            desc: "Completa con éxito 3 partidas en cualquiera de los minijuegos activos del Arcade.",
            goal: 3,
            rewardEV: 100,
            rewardPP: 10,
            svg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/></svg>`
        },
        {
            title: "SANGRE EN LA ARENA",
            desc: "Cierra con victoria 2 combates contra la IA en el Coliseo Estándar (1v1).",
            goal: 2,
            rewardEV: 100,
            rewardPP: 10,
            svg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21h2v-2"/></svg>`
        }
    ],

    weeklyConfig: [
        {
            title: "ESCALADOR TÁCTICO",
            desc: "Supera 5 pisos nuevos no bloqueados en la Torre de Mutación.",
            goal: 5,
            rewardEV: 500,
            rewardPP: 50,
            svg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18l-7-4-7 4z"/></svg>`
        },
        {
            title: "MAESTRO GENÉTICO",
            desc: "Ejecuta de forma válida 1 proceso de fusión en el Reactor (quemar 5 criaturas).",
            goal: 1,
            rewardEV: 500,
            rewardPP: 50,
            svg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/></svg>`
        },
        {
            title: "INVERSIONISTA DEL LAB",
            desc: "Intercambia un mínimo de 2,000 EV dentro del Laboratorio de Implantes (Dojo) o Bazar.",
            goal: 2000,
            rewardEV: 500,
            rewardPP: 50,
            svg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
        }
    ],

    // Auxiliar para obtener el lunes de la semana actual
    obtenerLunesActual: function() {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // lunes es 1
        const lunes = new Date(d.setDate(diff));
        return lunes.toDateString();
    },

    // Comprobar y reiniciar progresos si corresponde
    verificarResets: function() {
        const hoyStr = new Date().toDateString();
        const lunesStr = this.obtenerLunesActual();

        let cambio = false;

        // Reinicio diario
        if (this.lastResetDate !== hoyStr) {
            this.lastResetDate = hoyStr;
            this.dailyProgress = [0, 0, 0];
            this.dailyClaimed = [false, false, false];
            this.dailyBonusClaimed = false;
            cambio = true;
            console.log("[MISSIONS] Reseteadas misiones diarias.");
        }

        // Reinicio semanal
        if (this.lastResetWeek !== lunesStr) {
            this.lastResetWeek = lunesStr;
            this.weeklyProgress = [0, 0, 0];
            this.weeklyClaimed = [false, false, false];
            cambio = true;
            console.log("[MISSIONS] Reseteadas misiones semanales.");
        }

        if (cambio && typeof window.guardarLocalSilencioso === 'function') {
            window.guardarLocalSilencioso();
        }
    },

    // Métodos para sumar progresos
    trackCare: function() {
        this.verificarResets();
        const index = 0;
        if (this.dailyProgress[index] < this.dailyConfig[index].goal) {
            this.dailyProgress[index]++;
            this.logProgreso(this.dailyConfig[index].title, this.dailyProgress[index], this.dailyConfig[index].goal);
            this.autoSaveAndRefresh();
        }
    },

    trackArcade: function() {
        this.verificarResets();
        const index = 1;
        if (this.dailyProgress[index] < this.dailyConfig[index].goal) {
            this.dailyProgress[index]++;
            this.logProgreso(this.dailyConfig[index].title, this.dailyProgress[index], this.dailyConfig[index].goal);
            this.autoSaveAndRefresh();
        }
    },

    trackArena: function() {
        this.verificarResets();
        const index = 2;
        if (this.dailyProgress[index] < this.dailyConfig[index].goal) {
            this.dailyProgress[index]++;
            this.logProgreso(this.dailyConfig[index].title, this.dailyProgress[index], this.dailyConfig[index].goal);
            this.autoSaveAndRefresh();
        }
    },

    trackTorre: function() {
        this.verificarResets();
        const index = 0;
        if (this.weeklyProgress[index] < this.weeklyConfig[index].goal) {
            this.weeklyProgress[index]++;
            this.logProgreso(this.weeklyConfig[index].title, this.weeklyProgress[index], this.weeklyConfig[index].goal);
            this.autoSaveAndRefresh();
        }
    },

    trackFusion: function() {
        this.verificarResets();
        const index = 1;
        if (this.weeklyProgress[index] < this.weeklyConfig[index].goal) {
            this.weeklyProgress[index]++;
            this.logProgreso(this.weeklyConfig[index].title, this.weeklyProgress[index], this.weeklyConfig[index].goal);
            this.autoSaveAndRefresh();
        }
    },

    trackSpend: function(amount) {
        this.verificarResets();
        const index = 2;
        const parsed = Math.floor(parseFloat(amount) || 0);
        if (parsed <= 0) return;
        
        if (this.weeklyProgress[index] < this.weeklyConfig[index].goal) {
            this.weeklyProgress[index] = Math.min(this.weeklyConfig[index].goal, this.weeklyProgress[index] + parsed);
            this.logProgreso(this.weeklyConfig[index].title, this.weeklyProgress[index], this.weeklyConfig[index].goal);
            this.autoSaveAndRefresh();
        }
    },

    logProgreso: function(title, val, goal) {
        console.log(`[MISIÓN PROGRESO] ${title}: ${val}/${goal}`);
        if (val === goal) {
            console.log(`[MISIÓN COMPLETADA] ¡Has completado "${title}"!`);
            if (window.Sonidos) {
                window.Sonidos.play("click");
            }
        }
    },

    autoSaveAndRefresh: function() {
        if (typeof window.guardarProgreso === 'function') {
            window.guardarProgreso();
        }
        if (document.getElementById("missions-modal") && document.getElementById("missions-modal").style.display === "flex") {
            this.renderMissions();
        }
    },

    // Cargar y guardar estado
    getSaveData: function() {
        return {
            lastResetDate: this.lastResetDate,
            lastResetWeek: this.lastResetWeek,
            dailyProgress: this.dailyProgress,
            dailyClaimed: this.dailyClaimed,
            dailyBonusClaimed: this.dailyBonusClaimed,
            weeklyProgress: this.weeklyProgress,
            weeklyClaimed: this.weeklyClaimed
        };
    },

    loadSaveData: function(data) {
        if (!data) return;
        if (data.lastResetDate !== undefined) this.lastResetDate = data.lastResetDate;
        if (data.lastResetWeek !== undefined) this.lastResetWeek = data.lastResetWeek;
        if (data.dailyProgress !== undefined) this.dailyProgress = data.dailyProgress;
        if (data.dailyClaimed !== undefined) this.dailyClaimed = data.dailyClaimed;
        if (data.dailyBonusClaimed !== undefined) this.dailyBonusClaimed = data.dailyBonusClaimed;
        if (data.weeklyProgress !== undefined) this.weeklyProgress = data.weeklyProgress;
        if (data.weeklyClaimed !== undefined) this.weeklyClaimed = data.weeklyClaimed;

        this.verificarResets();
    },

    init: function() {
        this.verificarResets();
        this.inyectarModal();
    },

    // Inyectar HTML del modal
    inyectarModal: function() {
        if (document.getElementById("missions-modal")) return;

        const html = `
            <div id="missions-modal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(6, 8, 16, 0.65); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:4000; justify-content:center; align-items:center; font-family:'Outfit', sans-serif;">
                <style>
                    #missions-list-container::-webkit-scrollbar {
                        display: none !important;
                    }
                    #missions-list-container {
                        scrollbar-width: none !important;
                        -ms-overflow-style: none !important;
                    }
                </style>
                <div style="background:linear-gradient(135deg, rgba(16, 20, 36, 0.95), rgba(8, 10, 18, 0.98)); border:2px solid rgba(0, 229, 255, 0.35); border-radius:16px; width:90%; max-width:350px; max-height:90%; display:flex; flex-direction:column; box-sizing:border-box; padding:20px; color:white; box-shadow:0 0 30px rgba(0,229,255,0.15), inset 0 0 15px rgba(0, 0, 0, 0.6); position:relative;">
                    
                    <!-- Header -->
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px; margin-bottom:15px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ff9800" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px rgba(255,152,0,0.4));">
                                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                            </svg>
                            <h2 style="margin:0; font-size:16px; font-family:'Orbitron', sans-serif; letter-spacing:1px; color:#ff9800; font-weight:900;">TERMINAL DE MISIONES</h2>
                        </div>
                        <button onclick="window.MissionsManager.closeModal()" style="background:transparent; border:none; color:#888; font-size:16px; font-weight:bold; cursor:pointer; transition:0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">✕</button>
                    </div>

                    <!-- Tabs -->
                    <div style="display:flex; background:rgba(0,0,0,0.3); border-radius:8px; padding:3px; gap:4px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.05);">
                        <button id="btn-tab-daily-missions" onclick="window.MissionsManager.setTab('daily')" style="flex:1; background:rgba(255, 152, 0, 0.15); border:1px solid rgba(255, 152, 0, 0.3); border-radius:6px; color:#ff9800; padding:8px 0; font-weight:bold; font-size:11px; cursor:pointer; font-family:'Orbitron', sans-serif; transition:0.2s; letter-spacing:0.5px; text-transform:uppercase;">Diarias</button>
                        <button id="btn-tab-weekly-missions" onclick="window.MissionsManager.setTab('weekly')" style="flex:1; background:transparent; border:1px solid transparent; border-radius:6px; color:#aaa; padding:8px 0; font-weight:bold; font-size:11px; cursor:pointer; font-family:'Orbitron', sans-serif; transition:0.2s; letter-spacing:0.5px; text-transform:uppercase;">Semanales</button>
                    </div>

                    <!-- Reset Countdown -->
                    <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:6px 12px; text-align:center; font-size:10px; color:#888; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="text-transform:uppercase; font-size:9px; letter-spacing:0.5px;">ESTADO DE LA RED</span>
                        <span id="missions-reset-timer" style="font-weight:bold; color:#00e5ff; font-family:'Orbitron', sans-serif; letter-spacing:0.5px;">Reseteo en --:--:--</span>
                    </div>

                    <!-- Missions List -->
                    <div id="missions-list-container" style="flex:1; min-height:100px; max-height:240px; overflow-y:auto; padding-right:4px; margin-bottom:15px; display:flex; flex-direction:column; gap:10px;">
                        <!-- dynamic items -->
                    </div>

                    <!-- Daily Bonus Box (Only for daily tab) -->
                    <div id="missions-daily-bonus-container" style="background:rgba(0, 229, 255, 0.05); border:1.5px dashed rgba(0, 229, 255, 0.3); border-radius:12px; padding:12px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 0 10px rgba(0,229,255,0.02); flex-shrink:0;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="width:32px; height:32px; background:rgba(0, 229, 255, 0.1); border-radius:8px; display:flex; align-items:center; justify-content:center; color:#00e5ff;">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 2v9M7 5l5 6 5-6"/></svg>
                            </div>
                            <div>
                                <h4 style="margin:0; font-size:11px; font-weight:bold; color:#00e5ff; font-family:'Orbitron', sans-serif; letter-spacing:0.5px;">COFRE DE BONO DIARIO</h4>
                                <p style="margin:2px 0 0 0; font-size:9px; color:#aaa;">Completa 3/3 diarias para desbloquear.</p>
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                            <span style="font-size:11px; font-weight:bold; color:#ffd700; font-family:'Orbitron', sans-serif;">+300 EV</span>
                            <button id="btn-claim-daily-bonus" onclick="window.MissionsManager.claimBonusChest()" style="background:#334; color:#888; border:1px solid #445; border-radius:6px; padding:5px 10px; font-size:9px; font-weight:bold; cursor:not-allowed; transition:0.2s; font-family:'Orbitron', sans-serif;" disabled>BLOQUEADO</button>
                        </div>
                    </div>

                </div>
            </div>
        `;
        const container = document.getElementById("game-container") || document.body;
        container.insertAdjacentHTML("beforeend", html);
    },

    openModal: function() {
        this.verificarResets();
        const modal = document.getElementById("missions-modal");
        if (!modal) return;
        
        // Cerrar cajón lateral
        const drawer = document.getElementById("side-drawer");
        const arrow = document.getElementById("drawer-handle-arrow");
        if (drawer && drawer.style.left === "0px") {
            drawer.style.left = "-145px";
            if (arrow) arrow.style.transform = "rotate(0deg)";
        }
        
        modal.style.display = "flex";
        this.renderMissions();
        
        // Iniciar temporizador
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => this.updateTimerUI(), 1000);
        this.updateTimerUI();

        if (window.Sonidos) window.Sonidos.play("click");
    },

    closeModal: function() {
        const modal = document.getElementById("missions-modal");
        if (modal) modal.style.display = "none";
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (window.Sonidos) window.Sonidos.play("click");
    },

    setTab: function(tab) {
        this.activeTab = tab;
        const btnDaily = document.getElementById("btn-tab-daily-missions");
        const btnWeekly = document.getElementById("btn-tab-weekly-missions");

        if (tab === "daily") {
            btnDaily.style.background = "rgba(255, 152, 0, 0.15)";
            btnDaily.style.border = "1px solid rgba(255, 152, 0, 0.3)";
            btnDaily.style.color = "#ff9800";

            btnWeekly.style.background = "transparent";
            btnWeekly.style.border = "1px solid transparent";
            btnWeekly.style.color = "#aaa";
        } else {
            btnWeekly.style.background = "rgba(0, 229, 255, 0.15)";
            btnWeekly.style.border = "1px solid rgba(0, 229, 255, 0.3)";
            btnWeekly.style.color = "#00e5ff";

            btnDaily.style.background = "transparent";
            btnDaily.style.border = "1px solid transparent";
            btnDaily.style.color = "#aaa";
        }

        this.renderMissions();
        this.updateTimerUI();

        if (window.Sonidos) window.Sonidos.play("click");
    },

    updateTimerUI: function() {
        const timerEl = document.getElementById("missions-reset-timer");
        if (!timerEl) return;

        const ahora = new Date();

        if (this.activeTab === "daily") {
            const manana = new Date();
            manana.setHours(24, 0, 0, 0); // medianoche siguiente
            const diff = manana.getTime() - ahora.getTime();

            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const segs = Math.floor((diff / 1000) % 60);

            const hh = String(hrs).padStart(2, '0');
            const mm = String(mins).padStart(2, '0');
            const ss = String(segs).padStart(2, '0');

            timerEl.innerText = `RESET EN ${hh}:${mm}:${ss}`;
            timerEl.style.color = "#ff9800";
        } else {
            const lunesProximo = new Date();
            const day = lunesProximo.getDay();
            const diffDays = (day === 0 ? 1 : 8 - day);
            lunesProximo.setDate(lunesProximo.getDate() + diffDays);
            lunesProximo.setHours(0, 0, 0, 0);

            const diff = lunesProximo.getTime() - ahora.getTime();
            const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);

            timerEl.innerText = `RESET EN ${dias}D ${hrs}H ${mins}M`;
            timerEl.style.color = "#00e5ff";
        }
    },

    renderMissions: function() {
        const container = document.getElementById("missions-list-container");
        const bonusContainer = document.getElementById("missions-daily-bonus-container");
        if (!container) return;

        container.innerHTML = "";

        const isWeekly = (this.activeTab === "weekly");
        const config = isWeekly ? this.weeklyConfig : this.dailyConfig;
        const progressArr = isWeekly ? this.weeklyProgress : this.dailyProgress;
        const claimedArr = isWeekly ? this.weeklyClaimed : this.dailyClaimed;

        const mainColor = isWeekly ? "#00e5ff" : "#ff9800";

        config.forEach((m, idx) => {
            const prog = progressArr[idx];
            const pct = Math.min(100, (prog / m.goal) * 100);
            const isCompleted = (prog >= m.goal);
            const isClaimed = claimedArr[idx];

            let buttonHtml = "";
            let cardBg = "rgba(255, 255, 255, 0.02)";
            let borderStyle = "1px solid rgba(255, 255, 255, 0.06)";
            let shadow = "none";

            if (isClaimed) {
                cardBg = "rgba(76, 175, 80, 0.04)";
                borderStyle = "1px solid rgba(76, 175, 80, 0.25)";
                buttonHtml = `
                    <button style="background:rgba(76, 175, 80, 0.1); border:1px solid rgba(76, 175, 80, 0.3); color:#4caf50; border-radius:6px; padding:6px 12px; font-size:10px; font-weight:bold; font-family:'Orbitron', sans-serif; cursor:not-allowed;" disabled>RECLAMADO</button>
                `;
            } else if (isCompleted) {
                cardBg = `rgba(${isWeekly ? '0, 229, 255' : '255, 152, 0'}, 0.08)`;
                borderStyle = `1px solid ${mainColor}`;
                shadow = `0 0 10px rgba(${isWeekly ? '0, 229, 255' : '255, 152, 0'}, 0.15)`;
                buttonHtml = `
                    <button onclick="window.MissionsManager.claimMission(${idx}, ${isWeekly})" style="background:${mainColor}; border:none; color:#101424; border-radius:6px; padding:6px 12px; font-size:10px; font-weight:bold; font-family:'Orbitron', sans-serif; cursor:pointer; box-shadow:0 0 10px ${mainColor}44; transition:0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">RECLAMAR</button>
                `;
            } else {
                buttonHtml = `
                    <button style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#666; border-radius:6px; padding:6px 12px; font-size:10px; font-weight:bold; font-family:'Orbitron', sans-serif; cursor:not-allowed;" disabled>${prog}/${m.goal}</button>
                `;
            }

            const itemCard = document.createElement("div");
            itemCard.style = `background:${cardBg}; border:${borderStyle}; box-shadow:${shadow}; border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:8px; box-sizing:border-box;`;
            
            itemCard.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                    <div style="display:flex; align-items:center; gap:8px; flex:1;">
                        <div style="color:${isClaimed ? '#4caf50' : mainColor}; width:24px; height:24px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            ${m.svg}
                        </div>
                        <div>
                            <h3 style="margin:0; font-size:11px; font-weight:bold; color:${isClaimed ? '#4caf50' : '#fff'}; font-family:'Orbitron', sans-serif; letter-spacing:0.5px;">${m.title}</h3>
                            <p style="margin:2px 0 0 0; font-size:9.5px; color:#aaa; line-height:1.3;">${m.desc}</p>
                        </div>
                    </div>
                </div>

                <!-- Prog bar and buttons row -->
                <div style="display:flex; align-items:center; justify-content:space-between; gap:15px; margin-top:4px;">
                    <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                        <!-- Bar background -->
                        <div style="background:rgba(255,255,255,0.06); height:6px; border-radius:3px; overflow:hidden; border:1px solid rgba(255,255,255,0.02);">
                            <div style="background:${isClaimed ? '#4caf50' : mainColor}; width:${pct}%; height:100%; border-radius:3px; box-shadow:0 0 5px ${isClaimed ? '#4caf50' : mainColor}; transition:width 0.3s ease;"></div>
                        </div>
                        <!-- Rewards Text -->
                        <div style="display:flex; gap:10px; font-size:9px; font-weight:bold; font-family:'Orbitron', sans-serif;">
                            <span style="color:#ffd700;">+${m.rewardEV} EV</span>
                            <span style="color:#e040fb;">+${m.rewardPP} PP</span>
                        </div>
                    </div>
                    ${buttonHtml}
                </div>
            `;
            container.appendChild(itemCard);
        });

        // Manejar el cofre de bono diario
        if (isWeekly) {
            bonusContainer.style.display = "none";
        } else {
            bonusContainer.style.display = "flex";
            const completadas = this.dailyProgress.filter((p, i) => p >= this.dailyConfig[i].goal).length;
            const btnBonus = document.getElementById("btn-claim-daily-bonus");
            
            if (this.dailyBonusClaimed) {
                bonusContainer.style.background = "rgba(76, 175, 80, 0.04)";
                bonusContainer.style.borderColor = "rgba(76, 175, 80, 0.25)";
                if (btnBonus) {
                    btnBonus.innerText = "RECLAMADO";
                    btnBonus.style.background = "rgba(76, 175, 80, 0.1)";
                    btnBonus.style.border = "1px solid rgba(76, 175, 80, 0.3)";
                    btnBonus.style.color = "#4caf50";
                    btnBonus.style.cursor = "not-allowed";
                    btnBonus.disabled = true;
                }
            } else if (completadas >= 3) {
                bonusContainer.style.background = "rgba(0, 229, 255, 0.08)";
                bonusContainer.style.borderColor = "#00e5ff";
                bonusContainer.style.boxShadow = "0 0 10px rgba(0, 229, 255, 0.15)";
                if (btnBonus) {
                    btnBonus.innerText = "RECLAMAR";
                    btnBonus.style.background = "#00e5ff";
                    btnBonus.style.border = "none";
                    btnBonus.style.color = "#101424";
                    btnBonus.style.cursor = "pointer";
                    btnBonus.style.boxShadow = "0 0 10px rgba(0, 229, 255, 0.3)";
                    btnBonus.disabled = false;
                }
            } else {
                bonusContainer.style.background = "rgba(0, 229, 255, 0.03)";
                bonusContainer.style.borderColor = "rgba(0, 229, 255, 0.15)";
                bonusContainer.style.boxShadow = "none";
                if (btnBonus) {
                    btnBonus.innerText = `BLOQUEADO (${completadas}/3)`;
                    btnBonus.style.background = "#222533";
                    btnBonus.style.border = "1px solid rgba(255,255,255,0.06)";
                    btnBonus.style.color = "#666";
                    btnBonus.style.cursor = "not-allowed";
                    btnBonus.disabled = true;
                }
            }
        }
    },

    claimMission: function(index, isWeekly) {
        this.verificarResets();

        const config = isWeekly ? this.weeklyConfig : this.dailyConfig;
        const progressArr = isWeekly ? this.weeklyProgress : this.dailyProgress;
        const claimedArr = isWeekly ? this.weeklyClaimed : this.dailyClaimed;

        const m = config[index];
        const prog = progressArr[index];
        const claimed = claimedArr[index];

        if (prog < m.goal || claimed) {
            alert("No cumples con las condiciones para reclamar esta recompensa.");
            return;
        }

        // Marcar como reclamada
        claimedArr[index] = true;

        // Otorgar EV
        if (window.miInventario) {
            if (typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(m.rewardEV);
            } else {
                window.miInventario.vitalEssence = (window.miInventario.vitalEssence || 0) + m.rewardEV;
                if (typeof window.miInventario.updateUI === 'function') window.miInventario.updateUI();
            }
            if (typeof window.registrarLogEconomia === "function") {
                window.registrarLogEconomia('reward', m.rewardEV, 'missions');
            }
        }

        // Otorgar PP al Battle Pass
        if (window.BattlePassManager) {
            window.BattlePassManager.addPP(m.rewardPP);
        }

        if (window.Sonidos) {
            window.Sonidos.play("heal");
        }

        alert(`✨ ¡Felicidades! Has completado "${m.title}":\n+${m.rewardEV} Esencia Vital\n+${m.rewardPP} Puntos de Pase (PP).`);

        this.autoSaveAndRefresh();
    },

    claimBonusChest: function() {
        this.verificarResets();

        const completadas = this.dailyProgress.filter((p, i) => p >= this.dailyConfig[i].goal).length;
        if (completadas < 3 || this.dailyBonusClaimed) {
            alert("No has completado todas las misiones del día o ya has reclamado este cofre.");
            return;
        }

        // Marcar como reclamado
        this.dailyBonusClaimed = true;

        // Recompensa
        const bonusAmount = 300;
        if (window.miInventario) {
            if (typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(bonusAmount);
            } else {
                window.miInventario.vitalEssence = (window.miInventario.vitalEssence || 0) + bonusAmount;
                if (typeof window.miInventario.updateUI === 'function') window.miInventario.updateUI();
            }
            if (typeof window.registrarLogEconomia === "function") {
                window.registrarLogEconomia('reward', bonusAmount, 'missions_daily_bonus');
            }
        }

        if (window.Sonidos) {
            window.Sonidos.play("heal");
        }

        alert(`✨ ¡Felicidades! Has reclamado tu Cofre de Bono Diario:\n+${bonusAmount} Esencia Vital.`);

        this.autoSaveAndRefresh();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.MissionsManager.init();
});
