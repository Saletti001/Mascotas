// =========================================
// SanctuaryManager.js - LÓGICA DEL SANTUARIO
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    let dailyReleases = 0;
    const maxDailyReleases = 3;

    window.renderizarSantuario = function() {
        const grid = document.getElementById("sanctuary-grid");
        document.getElementById("daily-release-count").innerText = dailyReleases;
        grid.innerHTML = "";

        if (window.misGenos.length === 0) {
            grid.innerHTML = `<p style="grid-column: span 2; text-align: center; color: #888;">No tienes Genos almacenados.</p>`;
            return;
        }

        window.misGenos.forEach(geno => {
            const card = document.createElement("div");
            card.className = "geno-card";
            card.innerHTML = `
                ${generarSvgGeno({ body_shape: geno.shape, base_color: geno.color })}
                <h4>${geno.name}</h4>
                <p>${geno.rarity}</p>
                <div class="geno-reward">✨ +${geno.reward}</div>
                <button class="btn-liberar-geno" data-id="${geno.id}" ${dailyReleases >= maxDailyReleases ? 'disabled' : ''}>Liberar</button>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll(".btn-liberar-geno").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if (dailyReleases >= maxDailyReleases) return;
                const genoId = parseInt(e.target.getAttribute("data-id"));
                const geno = window.misGenos.find(g => g.id === genoId);
                
                if (confirm(`¿Liberar a ${geno.name}?`)) {
                    window.misGenos = window.misGenos.filter(g => g.id !== genoId);
                    if (window.miInventario) window.miInventario.addEssence(geno.reward);
                    dailyReleases++;
                    alert(`Ganaste ✨ ${geno.reward}`);
                    window.renderizarSantuario();
                }
            });
        });
    }
});