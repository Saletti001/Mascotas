// ========================================================
// ProfileManager.js - GESTOR DE PERFIL DE USUARIO Y METRICAS
// ========================================================

window.ProfileManager = {
    inicializado: false,

    init: function() {
        if (!this.inicializado) {
            this.inyectarEstructura();
            this.hookActualizarVistaBaul();
            this.inicializado = true;
        }
        this.renderPerfil();
    },

    inyectarEstructura: function() {
        const contenedor = document.getElementById("profile-screen");
        if (!contenedor) return;

        // Limpiamos estilos previos
        contenedor.style.background = "";
        contenedor.style.backgroundColor = "";
        contenedor.style.backgroundImage = "";

        const styleId = "profile-styles-neon";
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                #profile-screen {
                    background-color: #4dd0e1 !important;
                    background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px) !important;
                }
                .perfil-scroll-area::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
                .perfil-scroll-area { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                
                .profile-card-neon {
                    background: linear-gradient(180deg, #2A3B4C 0%, #1A2A36 100%);
                    border: 1px solid #384a5e; border-radius: 12px; padding: 18px 12px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.05);
                    width: 100%; box-sizing: border-box;
                    margin-bottom: 15px;
                    position: relative;
                    overflow: hidden;
                }

                .profile-card-neon::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
                    background: var(--card-glow-color, #D500F9); transition: 0.3s;
                }
            `;
            document.head.appendChild(style);
        }

        contenedor.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding-top: 15px; position: relative;">
                <div style="background: #111e28; border-radius: 16px; width: calc(100% - 30px); height: calc(100% - 100px); display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.5); overflow: hidden;">
                    <div style="padding: 25px 15px 0 15px; flex-shrink: 0; border-bottom: 1px solid #384a5e;">
                        <h2 class="screen-title" style="color: #D500F9; text-align: center; text-shadow: none; margin: 0 0 20px 0; font-weight: 900; letter-spacing: 2px;">PERFIL DE USUARIO</h2>
                    </div>
                    <div class="perfil-scroll-area" id="profile-content-area" style="flex: 1; overflow-y: auto; padding: 15px 15px 20px 15px;">
                        <!-- dynamic content -->
                    </div>
                </div>
                <div class="fab-btn btn-go-home" onclick="window.navegarA('room-area')" style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 70%; max-width: 300px; z-index: 100;">
                    <div class="fab-content" style="font-size: 13px; cursor: pointer; padding: 12px 0; text-align: center;">VOLVER AL LABORATORIO</div>
                </div>
            </div>
        `;
    },

    hookActualizarVistaBaul: function() {
        const originalActualizarVistaBaul = window.actualizarVistaBaul;
        window.actualizarVistaBaul = function() {
            if (typeof originalActualizarVistaBaul === 'function') {
                originalActualizarVistaBaul();
            }
            // También refresca la pantalla de perfil si está activa
            const profileScreen = document.getElementById("profile-screen");
            if (profileScreen && !profileScreen.classList.contains("hidden")) {
                window.ProfileManager.renderPerfil();
            }
        };
    },

    formatearNumero: function(valor, decimales = 1) {
        const num = parseFloat(valor || 0);
        const partes = num.toFixed(decimales).split('.');
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return partes.join(',');
    },

    renderPerfil: function() {
        const area = document.getElementById("profile-content-area");
        if (!area) return;

        // Calcular liberaciones del Santuario
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('sanctuary_date');
        let dailyReleases = parseInt(localStorage.getItem('sanctuary_count') || '0');
        if (savedDate !== today) {
            dailyReleases = 0;
        }

        const totalGenos = window.misGenos ? window.misGenos.filter(g => !g.isEgg).length : 0;
        const totalEggs = window.misGenos ? window.misGenos.filter(g => g.isEgg).length : 0;

        const isWalletConnected = window.miWallet && window.miWallet.address;
        const addressText = isWalletConnected ? window.miWallet.address : "No Vinculada";
        const shortAddress = isWalletConnected ? (addressText.substring(0, 6) + "..." + addressText.substring(addressText.length - 4)) : "No Vinculada";
        const walletBalance = isWalletConnected && window.miWallet.pol !== undefined ? window.miWallet.pol : 0.0;
        const pendingBalance = window.TournamentManager ? (window.TournamentManager.saldosPendientes || 0.0) : 0.0;

        const xpNeeded = typeof window.obtenerXPRequeridaLaboratorio === 'function' ? window.obtenerXPRequeridaLaboratorio(window.labLevel || 1) : 100;
        const xpPercent = Math.min(100, Math.max(0, ((window.labXP || 0) / xpNeeded) * 100));

        // Estadísticas de combate
        const arenaBattles = window.arenaBattlesPlayed || 0;
        const arenaWinsVal = window.arenaWins || 0;
        const arenaLossesVal = window.arenaLosses || 0;
        const maxFloorVal = window.maxFloor || 0;

        const savedAvatarIdx = parseInt(localStorage.getItem("player_avatar_idx") || "0");
        const evFormateada = this.formatearNumero(window.miInventario?.vitalEssence || 0, 1);

        // --- EXTRAS DE DISEÑADOR DE JUEGOS EXPERTO ---
        // 1. Títulos del Criador
        let tituloCientifico = "Auxiliar de Laboratorio";
        if (window.labLevel >= 30) tituloCientifico = "Científico Supremo";
        else if (window.labLevel >= 20) tituloCientifico = "Biólogo Avanzado";
        else if (window.labLevel >= 10) tituloCientifico = "Investigador Élite";
        else if (window.labLevel >= 5) tituloCientifico = "Técnico de Campo";

        let tituloCombate = "Aspirante de la Arena";
        if (maxFloorVal >= 60) tituloCombate = "Conquistador del Caos";
        else if (maxFloorVal >= 40) tituloCombate = "Defensor del Nexo";
        else if (maxFloorVal >= 20) tituloCombate = "Gladiador de la Torre";
        else if (maxFloorVal >= 10) tituloCombate = "Luchador de la Arena";

        // 2. Conteo de Afinidades Elementales en la colección
        const conteoAfinidades = {
            "Biomutante": 0,
            "Viral": 0,
            "Cibernético": 0,
            "Radiactivo": 0,
            "Tóxico": 0,
            "Sintético": 0
        };
        if (window.misGenos) {
            window.misGenos.forEach(g => {
                if (!g.isEgg) {
                    const elem = (g.genes && g.genes.afinidad) ? g.genes.afinidad.dom : (g.element || "Normal");
                    const elemClean = elem.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '').trim();
                    if (conteoAfinidades[elemClean] !== undefined) {
                        conteoAfinidades[elemClean]++;
                    }
                }
            });
        }

        // Renderizar el desglose de afinidades
        let afinidadesHtml = "";
        for (const [af, count] of Object.entries(conteoAfinidades)) {
            let iconSvg = "";
            if (typeof window.getIconoElemento === 'function') {
                iconSvg = window.getIconoElemento(af).replace('margin-right: 6px;', 'margin-right: 0;');
            }
            if (count > 0) {
                afinidadesHtml += `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 4px 8px; display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: bold;">
                        <span style="display:flex; width: 14px; height: 14px;">${iconSvg}</span>
                        <span style="color:#a0aec0;">${af}:</span>
                        <span style="color:#fff;">${count}</span>
                    </div>
                `;
            }
        }
        if (!afinidadesHtml) {
            afinidadesHtml = `<div style="color: #64748b; font-style: italic; font-size: 10px;">Sin Genos en la colección activa.</div>`;
        }

        // 3. Gestión de Cuenta (Sustituye al compañero activo y se agrupa con Identidad)
        let gestionCuentaSeccionHtml = "";
        if (window.miUsuarioCloud) {
            const userEmail = window.miUsuarioCloud.email || "Correo no disponible";
            gestionCuentaSeccionHtml = `
                <!-- DETALLES DE CUENTA -->
                <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="font-size: 11px; color: #cbd5e1; display: flex; flex-direction: column; gap: 4px;">
                        <span style="color: #94a3b8; font-size: 9px; text-transform: uppercase;">Cuenta Activa (Nexo Cloud)</span>
                        <span style="font-family: monospace; font-weight: bold; word-break: break-all; color: #fff;">${userEmail}</span>
                    </div>

                    <!-- Cambiar Contraseña -->
                    <div style="display: flex; flex-direction: column; gap: 8px; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 10px;">
                        <span style="color: #80deea; font-size: 9px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Actualizar Contraseña</span>
                        
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <input type="password" id="profile-input-pass" placeholder="Nueva Contraseña (mín. 6)" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(77, 208, 225, 0.3); background: rgba(0,0,0,0.4); color: white; outline: none; font-family: monospace; box-sizing: border-box; font-size: 11px; transition: 0.3s;" onfocus="this.style.borderColor='#00e5ff';" onblur="this.style.borderColor='rgba(77, 208, 225, 0.3)';">
                            <input type="password" id="profile-input-pass-confirm" placeholder="Confirmar Nueva Contraseña" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(77, 208, 225, 0.3); background: rgba(0,0,0,0.4); color: white; outline: none; font-family: monospace; box-sizing: border-box; font-size: 11px; transition: 0.3s;" onfocus="this.style.borderColor='#00e5ff';" onblur="this.style.borderColor='rgba(77, 208, 225, 0.3)';">
                            <button id="profile-btn-update-pass" style="width: 100%; padding: 8px; background: rgba(213, 0, 249, 0.1); border: 1.5px solid #D500F9; color: #D500F9; border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(213, 0, 249, 0.25)';" onmouseout="this.style.background='rgba(213, 0, 249, 0.1)';">
                                Guardar Contraseña
                            </button>
                        </div>
                        <div id="profile-pass-msg" style="font-size: 10px; text-transform: uppercase; font-weight: bold; min-height: 12px; margin-top: 2px;"></div>
                    </div>

                    <!-- Respaldo Manual y Cerrar Sesión -->
                    <div style="display: flex; gap: 8px; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 12px;">
                        <button id="profile-btn-backup" style="flex: 1; padding: 8px; background: rgba(128, 222, 234, 0.05); border: 1.5px solid #80deea; color: #80deea; border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(128, 222, 234, 0.15)';" onmouseout="this.style.background='rgba(128, 222, 234, 0.05)';">
                            Respaldo Nube
                        </button>
                        <button id="profile-btn-logout" style="flex: 1; padding: 8px; background: rgba(255, 82, 82, 0.05); border: 1.5px solid #ff5252; color: #ff5252; border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255, 82, 82, 0.15)';" onmouseout="this.style.background='rgba(255, 82, 82, 0.05)';">
                            Cerrar Sesión
                        </button>
                    </div>
                    <div id="profile-backup-msg" style="font-size: 10px; text-transform: uppercase; font-weight: bold; text-align: center; min-height: 12px; margin-top: 4px;"></div>
                </div>
            `;
        } else {
            gestionCuentaSeccionHtml = `
                <!-- DETALLES DE CUENTA (OFFLINE) -->
                <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="background: rgba(255, 82, 82, 0.1); border: 1px solid rgba(255, 82, 82, 0.3); border-radius: 6px; padding: 10px; font-size: 10px; color: #ffbcbc; line-height: 1.4; text-transform: uppercase; font-family: monospace;">
                        ⚠️ Estás jugando en modo local offline. Tus datos se guardan solo en este dispositivo. Conéctate a la Red Nexo para activar el almacenamiento en la nube, el comercio Web3 y la recuperación de tu cuenta.
                    </div>

                    <button id="profile-btn-login-prompt" style="width: 100%; padding: 10px; background: rgba(0, 229, 255, 0.05); border: 1.5px solid #00e5ff; color: #00e5ff; border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0, 229, 255, 0.15)';" onmouseout="this.style.background='rgba(0, 229, 255, 0.05)';">
                        Conectarse a la Red Nexo
                    </button>
                </div>
            `;
        }

        let honorificTitleHtml = "";
        if (window.AchievementsManager && window.AchievementsManager.data.nexoVeterano.claimed) {
            honorificTitleHtml = `
                <span style="color:#ffd700; display:flex; align-items:center; gap:3px; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 4px; padding: 1px 4.5px;" title="Título Honorífico">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Veterano del Nexo
                </span>
            `;
        }

        let achievementsCardHtml = "";
        if (window.AchievementsManager) {
            achievementsCardHtml = window.AchievementsManager.renderTarjetaLogros();
        }

        area.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 15px; color: #fff;">
                
                <!-- TARJETA 1: IDENTIDAD Y GESTIÓN DE CUENTA -->
                <div class="profile-card-neon" style="--card-glow-color: #D500F9; display: flex; flex-direction: column; gap: 15px; position: relative;">
                    <!-- Cabecera / Fila superior de identidad -->
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div id="profile-avatar-box" onclick="window.abrirSelectorAvatar()" style="background: rgba(213, 0, 249, 0.1); border: 2px solid #D500F9; border-radius: 50%; width: 56px; height: 56px; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 15px rgba(213, 0, 249, 0.3); flex-shrink: 0; cursor: pointer; position: relative;" title="Cambiar Avatar">
                            ${window.AVATAR_SVGS[savedAvatarIdx]}
                            <div style="position: absolute; bottom: -2px; right: -2px; background: #D500F9; border-radius: 50%; width: 18px; height: 18px; display: flex; justify-content: center; align-items: center; border: 1.5px solid #111e28;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/>
                                </svg>
                            </div>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <h3 id="profile-username" onclick="window.cambiarNombreJugador()" style="margin: 0; font-size: 15px; font-weight: bold; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="Editar Nombre">
                                    ${window.playerName || "Criador Sin Nombre"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#80deea" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.7;">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/>
                                    </svg>
                                </h3>
                                <span style="background: ${window.miUsuarioCloud ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}; border: 1px solid ${window.miUsuarioCloud ? '#4CAF50' : '#f44336'}; color: ${window.miUsuarioCloud ? '#69F0AE' : '#ff5252'}; font-size: 8px; font-weight: 900; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${window.miUsuarioCloud ? 'Conectado' : 'Offline'}
                                </span>
                            </div>
                            
                            <!-- Rango / Título del Criador -->
                            <div style="display:flex; align-items:center; gap:6px; margin-top:4px; font-size:9px; font-weight:bold; letter-spacing:0.5px; flex-wrap: wrap;">
                                <span style="color:#80deea; display:flex; align-items:center; gap:3px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#80deea" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M9 3v6.34a6 6 0 0 0 1.76 4.24l3.48 3.48A6 6 0 0 1 16 21v0H8v0a6 6 0 0 1 1.76-4.24l3.48-3.48A6 6 0 0 0 15 9.34V3"/></svg>
                                    ${tituloCientifico}
                                </span>
                                <span style="color:#ff5252; display:flex; align-items:center; gap:3px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/></svg>
                                    ${tituloCombate}
                                </span>
                                ${honorificTitleHtml}
                                <span id="btn-toggle-ranks-info" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: rgba(255,255,255,0.08); border-radius: 50%; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'" title="Explicación de Rangos">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#80deea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="16" x2="12" y2="12"/>
                                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                                    </svg>
                                </span>
                            </div>
                            
                            <!-- PANEL INFORMATIVO DE RANGOS (DESPLEGABLE) -->
                            <div id="profile-ranks-info" style="display: none; background: rgba(0,0,0,0.5); border: 1.5px solid rgba(128,222,234,0.15); border-radius: 8px; padding: 10px; margin-top: 8px; font-size: 10px; line-height: 1.4; color: #cbd5e1; flex-direction: column; gap: 8px;">
                                <div>
                                    <strong style="color: #80deea; display: flex; align-items: center; gap: 4px; font-size: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#80deea" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M9 3v6.34a6 6 0 0 0 1.76 4.24l3.48 3.48A6 6 0 0 1 16 21v0H8v0a6 6 0 0 1 1.76-4.24l3.48-3.48A6 6 0 0 0 15 9.34V3"/></svg>
                                        RANGO CIENTÍFICO
                                    </strong>
                                    <span style="font-size: 9px; color: #888;">Calculado según tu Nivel de Laboratorio actual:</span>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-top: 4px; font-family: monospace; font-size: 9px;">
                                        <div>Nv. 1-4:</div><div style="color:#fff;">Auxiliar de Lab.</div>
                                        <div>Nv. 5-9:</div><div style="color:#fff;">Técnico de Campo</div>
                                        <div>Nv. 10-19:</div><div style="color:#fff;">Investigador Élite</div>
                                        <div>Nv. 20-29:</div><div style="color:#fff;">Biólogo Avanzado</div>
                                        <div>Nv. 30+:</div><div style="color:#fff;">Científico Supremo</div>
                                    </div>
                                </div>
                                <div style="border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px;">
                                    <strong style="color: #ff5252; display: flex; align-items: center; gap: 4px; font-size: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/></svg>
                                        RANGO DE COMBATE
                                    </strong>
                                    <span style="font-size: 9px; color: #888;">Calculado según el piso máx. de la Torre de Mutación:</span>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-top: 4px; font-family: monospace; font-size: 9px;">
                                        <div>Piso &lt; 10:</div><div style="color:#fff;">Aspirante de la Arena</div>
                                        <div>Piso 10-19:</div><div style="color:#fff;">Luchador de la Arena</div>
                                        <div>Piso 20-39:</div><div style="color:#fff;">Gladiador de la Torre</div>
                                        <div>Piso 40-59:</div><div style="color:#fff;">Defensor del Nexo</div>
                                        <div>Piso 60+:</div><div style="color:#fff;">Conquistador del Caos</div>
                                    </div>
                                </div>
                            </div>
    
                            <div style="font-family: monospace; font-size: 10px; color: #888; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ID: ${window.playerUniqueID || "Desconocido"}
                            </div>
                        </div>
                    </div>
    
                    <!-- SECCIÓN DE GESTIÓN DE CUENTA ACOPLADA -->
                    ${gestionCuentaSeccionHtml}
                </div>

                <!-- TARJETA 2: PROGRESO DEL LABORATORIO -->
                <div class="profile-card-neon" style="--card-glow-color: #80deea; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#80deea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #80deea);">
                            <path d="M6 3h12"/>
                            <path d="M9 3v6.34a6 6 0 0 0 1.76 4.24l3.48 3.48A6 6 0 0 1 16 21v0H8v0a6 6 0 0 1 1.76-4.24l3.48-3.48A6 6 0 0 0 15 9.34V3"/>
                        </svg>
                        <span style="font-size: 11px; color: #80deea; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Nivel de Laboratorio</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 24px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.2);">
                            Nv. ${window.labLevel || 1}
                        </span>
                        <span style="font-size: 12px; color: #cbd5e1; font-weight: bold; font-family: monospace;">
                            ${Math.floor(window.labXP || 0)} / ${xpNeeded} XP
                        </span>
                    </div>

                    <!-- Barra de Progreso XP -->
                    <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; border: 1px solid #2d3748;">
                        <div style="width: ${xpPercent}%; height: 100%; background: linear-gradient(90deg, #4dd0e1, #00acc1); box-shadow: 0 0 8px #00e5ff; border-radius: 4px; transition: width 0.4s ease;"></div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11px;">
                        <span style="color: #94a3b8;">Permiso de Comercio:</span>
                        <span style="color: ${window.comercioDesbloqueado ? '#69F0AE' : '#ff5252'}; font-weight: bold;">
                            ${window.comercioDesbloqueado ? 'ADQUIRIDO' : 'BLOQUEADO'}
                        </span>
                    </div>
                </div>

                <!-- TARJETA 3: ACTIVOS Y COLECCIÓN -->
                <div class="profile-card-neon" style="--card-glow-color: #ffcc00; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffcc00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #ffcc00);">
                            <circle cx="12" cy="12" r="8"/>
                            <path d="M12 16v-8"/>
                            <path d="M8 12h8"/>
                        </svg>
                        <span style="font-size: 11px; color: #ffcc00; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Activos y Colección</span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Genos</div>
                            <div style="font-size: 18px; font-weight: bold; color: #fff;">${totalGenos}</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Bio-Núcleos</div>
                            <div style="font-size: 18px; font-weight: bold; color: #fff;">${totalEggs}</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Esencia Vital</div>
                            <div style="font-size: 15px; font-weight: bold; color: #ffcc00; text-shadow: 0 0 5px rgba(255, 204, 0, 0.3); display: flex; align-items: center; justify-content: center; gap: 4px;">
                                ${evFormateada} <span style="font-size: 9px; color: #a1a1aa;">EV</span>
                            </div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Mochila</div>
                            <div style="font-size: 16px; font-weight: bold; color: #fff;">
                                ${window.miInventario?.slots?.length || 0}/${window.miInventario?.maxSlots || 10}
                            </div>
                        </div>
                    </div>

                    <!-- DESGLOSE DE AFINIDADES -->
                    <div style="margin-top: 5px;">
                        <div style="font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: bold;">
                            Afinidades en Colección
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            ${afinidadesHtml}
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 8px; font-size: 11px;">
                        <span style="color: #94a3b8;">Liberados hoy (Santuario):</span>
                        <span style="color: #fff; font-weight: bold;">${dailyReleases} / 3</span>
                    </div>
                </div>

                <!-- TARJETA 4: MONEDERO WEB3 (VINCULACION REFINADA) -->
                <div class="profile-card-neon" style="--card-glow-color: #00e5ff; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #00e5ff);">
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <path d="M16 8h.01"/>
                            <path d="M12 12h8"/>
                            <path d="M12 16h8"/>
                        </svg>
                        <span style="font-size: 11px; color: #00e5ff; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Monedero Web3</span>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                            <span style="color: #94a3b8;">Estado:</span>
                            <span style="color: ${isWalletConnected ? '#69F0AE' : '#ff007f'}; font-weight: 900; letter-spacing: 0.5px;">
                                ${isWalletConnected ? 'SINCRO VINCULADA' : 'NO VINCULADA'}
                            </span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                            <span style="color: #94a3b8;">Dirección:</span>
                            <span style="font-family: monospace; color: ${isWalletConnected ? '#00e5ff' : '#888'}; font-weight: bold;">
                                ${shortAddress}
                            </span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                            <span style="color: #94a3b8;">Saldo Wallet:</span>
                            <span style="color: #fff; font-weight: bold;">
                                ${walletBalance.toFixed(2)} POL
                            </span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                            <span style="color: #94a3b8;">Saldo del Baúl (Coliseo):</span>
                            <span style="color: #ffd700; font-weight: bold;">
                                ${pendingBalance.toFixed(2)} POL
                            </span>
                        </div>
                    </div>

                    ${!isWalletConnected ? `
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 5px; align-items: center;">
                            <button id="profile-btn-connect-metamask" style="background: rgba(0, 229, 255, 0.05); border: 1.5px solid #00e5ff; color: #00e5ff; border-radius: 6px; padding: 8px 16px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 6px rgba(0, 229, 255, 0.15); display: inline-block;" onmouseover="this.style.background='rgba(0, 229, 255, 0.15)'; this.style.boxShadow='0 0 10px rgba(0, 229, 255, 0.35)';" onmouseout="this.style.background='rgba(0, 229, 255, 0.05)'; this.style.boxShadow='0 0 6px rgba(0, 229, 255, 0.15)';">
                                Conectar MetaMask
                            </button>
                            <div style="text-align: center; margin-top: 2px;">
                                <a href="#" id="profile-link-connect-privy" style="font-size: 9px; color: #a0aec0; text-decoration: underline; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ¿No tienes wallet? Usar cuenta social (Privy)
                                </a>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- TARJETA 5: REGISTRO DE COMBATE -->
                <div class="profile-card-neon" style="--card-glow-color: #ff5252; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #ff5252);">
                            <path d="M14.5 17.5 3 6V3h3l11.5 11.5"/>
                            <path d="m13 19 6-6"/>
                            <path d="m16 16 4 4"/>
                            <path d="m19 21 2-2"/>
                        </svg>
                        <span style="font-size: 11px; color: #ff5252; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Registro de Combate Arena (PvP)</span>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #94a3b8;">Combates Ronda Actual:</span>
                            <span style="color: #fff; font-weight: bold;">${arenaBattles} / 5</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #94a3b8;">Victorias / Derrotas Ronda:</span>
                            <span style="color: #fff; font-weight: bold;">
                                <span style="color: #69f0ae;">${arenaWinsVal}V</span> - <span style="color: #ff5252;">${arenaLossesVal}D</span>
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #94a3b8;">Torre de Mutación (Max Piso):</span>
                            <span style="color: #ffd700; font-weight: bold;">Piso ${maxFloorVal}</span>
                        </div>
                    </div>

                    <div style="font-size: 10px; color: #888; text-transform: uppercase; margin-top: 5px; font-weight: bold; letter-spacing: 0.5px; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 4px;">
                        Rango y PR por Liga
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 10px;">
                        <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 6px 8px; border-radius: 4px;">
                            <span style="color: #cd7f32; font-weight: bold;">Bronce</span>
                            <span style="color: #fff; font-weight: bold;">${window.prBronce || 0} PR</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 6px 8px; border-radius: 4px;">
                            <span style="color: #c0c0c0; font-weight: bold;">Plata</span>
                            <span style="color: #fff; font-weight: bold;">${window.prPlata || 0} PR</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 6px 8px; border-radius: 4px;">
                            <span style="color: #ffd700; font-weight: bold;">Oro</span>
                            <span style="color: #fff; font-weight: bold;">${window.prOro || 0} PR</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 6px 8px; border-radius: 4px;">
                            <span style="color: #e5e5e5; font-weight: bold; text-shadow: 0 0 5px rgba(255,255,255,0.5);">Diamante</span>
                            <span style="color: #fff; font-weight: bold;">${window.prDiamante || 0} PR</span>
                        </div>
                    </div>
                </div>

                <!-- TARJETA 6: LOGROS DE LA CUENTA -->
                ${achievementsCardHtml}

            </div>
        `;

        // Lógica para desplegar panel de rangos
        const btnToggleRanks = document.getElementById("btn-toggle-ranks-info");
        const ranksInfoBox = document.getElementById("profile-ranks-info");
        if (btnToggleRanks && ranksInfoBox) {
            btnToggleRanks.onclick = (e) => {
                e.stopPropagation();
                if (ranksInfoBox.style.display === "none" || !ranksInfoBox.style.display) {
                    ranksInfoBox.style.display = "flex";
                } else {
                    ranksInfoBox.style.display = "none";
                }
            };
        }

        // Lógica de Gestión de Cuenta (si está online)
        if (window.miUsuarioCloud) {
            const btnUpdatePass = document.getElementById("profile-btn-update-pass");
            const inputPass = document.getElementById("profile-input-pass");
            const inputPassConfirm = document.getElementById("profile-input-pass-confirm");
            const msgPass = document.getElementById("profile-pass-msg");

            if (btnUpdatePass) {
                btnUpdatePass.onclick = async () => {
                    const pass = inputPass.value;
                    const confirmPass = inputPassConfirm.value;

                    if (!pass) {
                        msgPass.style.color = "#ff5252";
                        msgPass.innerText = "Escribe una contraseña";
                        return;
                    }
                    if (pass.length < 6) {
                        msgPass.style.color = "#ff5252";
                        msgPass.innerText = "Mínimo 6 caracteres";
                        return;
                    }
                    if (pass !== confirmPass) {
                        msgPass.style.color = "#ff5252";
                        msgPass.innerText = "Las contraseñas no coinciden";
                        return;
                    }

                    btnUpdatePass.innerText = "ACTUALIZANDO...";
                    btnUpdatePass.disabled = true;

                    try {
                        const { error } = await window.supabaseClient.auth.updateUser({ password: pass });
                        if (error) {
                            msgPass.style.color = "#ff5252";
                            msgPass.innerText = "Error: " + error.message;
                        } else {
                            msgPass.style.color = "#69f0ae";
                            msgPass.innerText = "Contraseña actualizada";
                            inputPass.value = "";
                            inputPassConfirm.value = "";
                        }
                    } catch (err) {
                        msgPass.style.color = "#ff5252";
                        msgPass.innerText = "Error de conexión";
                    } finally {
                        btnUpdatePass.innerText = "GUARDAR CONTRASEÑA";
                        btnUpdatePass.disabled = false;
                    }
                };
            }

            const btnBackup = document.getElementById("profile-btn-backup");
            const msgBackup = document.getElementById("profile-backup-msg");

            if (btnBackup) {
                btnBackup.onclick = async () => {
                    btnBackup.innerText = "GUARDANDO...";
                    btnBackup.disabled = true;
                    msgBackup.innerText = "";

                    try {
                        await window.respaldarEnNube();
                        msgBackup.style.color = "#69f0ae";
                        msgBackup.innerText = "Progreso guardado en la nube";
                    } catch (err) {
                        msgBackup.style.color = "#ff5252";
                        msgBackup.innerText = "Error al guardar en nube";
                    } finally {
                        btnBackup.innerText = "RESPALDO NUBE";
                        btnBackup.disabled = false;
                    }
                };
            }

            const btnLogout = document.getElementById("profile-btn-logout");
            if (btnLogout) {
                btnLogout.onclick = async () => {
                    if (confirm("¿Seguro que deseas cerrar la sesión en la Red Nexo? El juego se reiniciará.")) {
                        try {
                            await window.supabaseClient.auth.signOut();
                        } catch (e) {
                            console.error("Error al desloguear:", e);
                        }
                        window.miUsuarioCloud = null;
                        window.location.reload();
                    }
                };
            }
        } else {
            // Modo offline
            const btnLoginPrompt = document.getElementById("profile-btn-login-prompt");
            if (btnLoginPrompt) {
                btnLoginPrompt.onclick = () => {
                    if (window.LoginUI && typeof window.LoginUI.mostrar === 'function') {
                        window.LoginUI.mostrar();
                    }
                };
            }
        }

        // Lógica del botón de conectar MetaMask
        const btnConnectMetaMask = document.getElementById("profile-btn-connect-metamask");
        if (btnConnectMetaMask) {
            btnConnectMetaMask.onclick = async () => {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const address = accounts[0];
                        
                        if(!window.miWallet) window.miWallet = { pol: 10.0 };
                        window.miWallet.address = address;
                        window.miWallet.isSimulated = false; // Billetera Web3 real activa
                        
                        if (window.WalletManager && typeof window.WalletManager.actualizarBoton === 'function') {
                            window.WalletManager.actualizarBoton();
                        }
                        if (typeof window.actualizarVistaBaul === 'function') {
                            window.actualizarVistaBaul();
                        }
                        if (typeof window.guardarProgreso === 'function') {
                            window.guardarProgreso();
                        }
                        alert("¡Billetera MetaMask vinculada exitosamente!");
                        window.ProfileManager.renderPerfil();
                    } catch (error) {
                        alert("Conexión cancelada.");
                    }
                } else {
                    alert("No se detectó MetaMask. Por favor, instala la extensión en tu navegador.");
                }
            };
        }

        // Lógica del enlace de conectar Privy
        const linkConnectPrivy = document.getElementById("profile-link-connect-privy");
        if (linkConnectPrivy) {
            linkConnectPrivy.onclick = (e) => {
                e.preventDefault();
                if (window.WalletManager && typeof window.WalletManager.lazyLoadPrivy === 'function') {
                    window.WalletManager.lazyLoadPrivy("perfil");
                }
            };
        }

        // Lógica del botón de reclamar logros
        const claimBtns = area.querySelectorAll(".btn-achievement-claim");
        claimBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const achievementId = btn.getAttribute("data-id");
                if (window.AchievementsManager) {
                    window.AchievementsManager.reclamarRecompensa(achievementId);
                }
            };
        });
    }
};
