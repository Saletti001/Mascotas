const formasBlandi = {
    gota: `<path d="M50,15 C50,15 15,60 15,85 C15,105 85,105 85,85 C85,60 50,15 50,15 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`,
    frijol: `<path d="M25,50 C25,15 75,15 75,50 C75,70 65,65 55,80 C45,95 25,90 25,50 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
};

function generarSvgBlandi(genesVisuales) {
    let cuerpoSvg = formasBlandi[genesVisuales.body_shape] || formasBlandi.gota;
    cuerpoSvg = cuerpoSvg.replace("COLOR_AQUI", genesVisuales.base_color);
    return `
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${cuerpoSvg}
            <circle cx="38" cy="55" r="4" fill="#222"/>
            <circle cx="62" cy="55" r="4" fill="#222"/>
            <path d="M42,68 Q50,78 58,68" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/>
        </svg>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    // Generar Blandi
    const miMascota = { visual_genes: { body_shape: "frijol", base_color: "#77DD77" } };
    const contenedor = document.getElementById("blandi-container");
    if (contenedor) contenedor.innerHTML = generarSvgBlandi(miMascota.visual_genes);

    // Sistema de Pantallas
    const screenRoom = document.getElementById("room-area");
    const screenArcadeMenu = document.getElementById("arcade-menu");
    
    // Botones
    const btnFeed = document.getElementById("btn-feed");
    const btnArcade = document.getElementById("btn-arcade");
    const btnBackLab = document.getElementById("btn-back-from-menu");

    // Lógica Alimentar
    if (btnFeed) {
        btnFeed.addEventListener("click", () => {
            if (window.miInventario && window.miInventario.consumeItem("apple_01", 1)) {
                contenedor.classList.add("happy-jump");
                setTimeout(() => contenedor.classList.remove("happy-jump"), 500);
            } else {
                alert("No tienes manzanas. Ve al Arcade 🕹️ para conseguir más.");
            }
        });
    }

    // Navegación
    if (btnArcade && screenRoom && screenArcadeMenu) {
        btnArcade.addEventListener("click", () => {
            screenRoom.classList.add("hidden");
            screenArcadeMenu.classList.remove("hidden");
        });
    }

    if (btnBackLab) {
        btnBackLab.addEventListener("click", () => {
            screenArcadeMenu.classList.add("hidden");
            screenRoom.classList.remove("hidden");
        });
    }
});