// =========================================
// SanctuaryManager.js - LÓGICA DEL SANTUARIO V8.0
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const maxDailyReleases = 3;

    // --- MANEJO DE LÍMITE DIARIO EN LOCALSTORAGE ---
    function getDailyData() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('sanctuary_date');
        let count = parseInt(localStorage.getItem('sanctuary_count') || '0');

        // Si cambió de día, reiniciamos el contador
        if (savedDate !== today) {
            count = 0;
            localStorage.setItem('sanctuary_date', today);
            localStorage.setItem('sanctuary_count', count);
        }
        return count;
    }

    function incrementDailyData() {
        const count = getDailyData() + 1;
        localStorage.setItem('sanctuary_count', count);
        return count;
    }

    // --- CÁLCULO DE RECOMPENSA V8.0 ---
    function calcularRecompensa(geno) {
        let base = 100;
        switch(geno.rarity) {
            case "Común": base = 100; break;
            case "Raro": base = 300; break;
            case "Épico": base = 1000; break;
            case "Legendario": base = 5000; break;
            case "Mítico": base = 15000; break;
            default: base = 100;
        }
        
        // Multiplicador del Gen Oculto ("Esencia Concentrada")
        const multiplicador = typeof window.getMultiplicadorEsencia === 'function' ? window.getMultiplicadorEsencia(geno) : 1.0;
        return Math.floor(base * multiplicador);
    }

    // --- RENDERIZADO DEL SANTUARIO ---
    window.renderizarSantuario = function() {
        const grid = document.getElementById("sanctuary-grid");
        if (!grid) return;
        
        const dailyReleases = getDailyData();
        const countDisplay = document.getElementById("daily-release-count");
        if (countDisplay) {
            countDisplay.innerText = dailyReleases;
            if(dailyReleases >= maxDailyReleases) countDisplay.style.color = "#d9534f"; // Rojo si llegó al límite
            else countDisplay.style.color = "#4CAF50"; // Verde
        }
        
        grid.innerHTML = "";

        // Filtramos: No huevos y No mascota activa actual
        const idMascota = window.miMascota ? String(window.miMascota.id) : null;
        const genosDisponibles = (window.misGenos || []).filter(g => !g.isEgg && String(g.id) !== idMascota);

        if (genosDisponibles.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #64748b; padding: 20px; font-size: 13px; font-style: italic;">No tienes Genos disponibles en la Base de Datos.<br>(No puedes liberar huevos ni a tu mascota principal).</div>`;
            return;
        }

        genosDisponibles.forEach(geno => {
            // Anti-bot Cooldown: Validar 48h desde que nació/se fusionó (Asumimos 0 para los genos antiguos)
            const ageMs = Date.now() - (geno.birthDate || 0);
            const cooldownMs = 48 * 60 * 60 * 1000;
            const isCoolingDown = ageMs < cooldownMs;

            const reward = calcularRecompensa(geno);
            const pColor = geno.color || geno.base_color || "#ccc";
            let svg = typeof generarSvgGeno === 'function' ? generarSvgGeno(geno) : '🧬';
            
            const card = document.createElement("div");
            card.style = "background: #1a2a36; border: 1px solid #4CAF50; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); position: relative; overflow: hidden;";
            
            let overlayHtml = '';
            let btnHtml = '';

            // Bloqueos visuales y de botón
            if (isCoolingDown) {
                const horasRestantes = Math.ceil((cooldownMs - ageMs) / (1000 * 60 * 60));
                overlayHtml = `
                    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.75); display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 10;">
                        <span style="font-size: 24px; filter: drop-shadow(0 0 5px #ff9800);">⏳</span>
                        <span style="color: #ff9800; font-size: 11px; font-weight: bold; text-align: center; margin-top: 5px; text-transform: uppercase;">Madurando<br>${horasRestantes}h restantes</span>
                    </div>`;
                btnHtml = `<button disabled style="margin-top: 10px; width: 100%; padding: 8px; border-radius: 6px; border: none; background: #333; color: #777; font-weight: bold; cursor: not-allowed;">Bloqueado</button>`;
            } else if (dailyReleases >= maxDailyReleases) {
                btnHtml = `<button disabled style="margin-top: 10px; width: 100%; padding: 8px; border-radius: 6px; border: none; background: rgba(217, 83, 79, 0.2); border: 1px solid #d9534f; color: #d9534f; font-weight: bold; cursor: not-allowed;">Límite Diario Alcanzado</button>`;
            } else {
                btnHtml = `<button class="btn-liberar-geno" data-id="${geno.id}" style="margin-top: 10px; width: 100%; padding: 8px; border-radius: 6px; border: none; background: rgba(76, 175, 80, 0.15); border: 1px solid #4CAF50; color: #4CAF50; font-weight: bold; cursor: pointer; transition: 0.2s;">Liberar ✨</button>`;
            }

            // Etiqueta Gen Oculto
            const extraBadge = (typeof window.getMultiplicadorEsencia === 'function' && window.getMultiplicadorEsencia(geno) > 1) 
                ? `<div style="font-size: 9px; background: linear-gradient(90deg, #8A2BE2, #ffcc00); color: white; padding: 3px 8px; border-radius: 4px; position: absolute; top: -2px; right: -2px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.8); z-index: 5;">x2 ESENCIA</div>` 
                : '';

            card.innerHTML = `
                ${overlayHtml}
                ${extraBadge}
                <div style="width: 70px; height: 70px; display: flex; justify-content: center; align-items: center; color: ${pColor};">
                    ${svg}
                </div>
                <h4 style="margin: 10px 0 5px 0; color: white; font-size: 14px; text-transform: uppercase; text-align: center;">${geno.name || 'Sujeto'}</h4>
                <p style="margin: 0 0 10px 0; font-size: 11px; color: #aaa; text-transform: uppercase;">${geno.rarity || 'Común'}</p>
                <div style="background: rgba(0,0,0,0.5); border: 1px solid #333; border-radius: 6px; padding: 5px 10px; width: 100%; box-sizing: border-box; text-align: center;">
                    <span style="color: #ffcc00; font-weight: bold; font-size: 14px; text-shadow: 0 0 5px rgba(255,204,0,0.5);">✨ +${reward}</span>
                </div>
                ${btnHtml}
            `;

            // Fix al SVG
            const svgEl = card.querySelector("svg");
            if (svgEl) { 
                svgEl.style.width = "100%"; 
                svgEl.style.height = "100%"; 
            }

            // Lógica del Botón
            if (!isCoolingDown && dailyReleases < maxDailyReleases) {
                const btn = card.querySelector(".btn-liberar-geno");
                if (btn) {
                    btn.addEventListener("click", () => {
                        if (confirm(`⚠️ ALERTA DEL SANTUARIO\n\nEstás a punto de liberar a ${geno.name} en la naturaleza.\nEsta acción es PERMANENTE y el Geno se perderá para siempre.\n\n¿Estás seguro de proceder a cambio de ✨ ${reward} Esencia Vital?`)) {
                            
                            // Borrar el Geno de la base de datos
                            window.misGenos = window.misGenos.filter(g => String(g.id) !== String(geno.id));
                            
                            // Entregar Esencia
                            if (window.miInventario && typeof window.miInventario.addEssence === 'function') {
                                window.miInventario.addEssence(reward);
                            }
                            
                            // Sumar al límite local diario
                            incrementDailyData();
                            
                            alert(`🕊️ ${geno.name} ha sido liberado con éxito.\nLa Red Nexo te recompensa con ✨ ${reward} Esencia Vital.`);
                            
                            window.renderizarSantuario();
                            
                            // Forzar guardado
                            if (typeof window.guardarProgreso === 'function') window.guardarProgreso();
                        }
                    });
                    
                    // Hover states
                    btn.onmouseover = () => { btn.style.background = "#4CAF50"; btn.style.color = "white"; btn.style.boxShadow = "0 0 10px rgba(76, 175, 80, 0.5)"; };
                    btn.onmouseout = () => { btn.style.background = "rgba(76, 175, 80, 0.15)"; btn.style.color = "#4CAF50"; btn.style.boxShadow = "none"; };
                }
            }
            grid.appendChild(card);
        });
    };
});