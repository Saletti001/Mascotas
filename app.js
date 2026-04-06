// Diccionario de coordenadas SVG (Formas base)
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
    // 1. Cargamos el Blandi
    const miMascota = { visual_genes: { body_shape: "frijol", base_color: "#77DD77" } };
    const contenedor = document.getElementById("blandi-container");
    
    if (contenedor) {
        contenedor.innerHTML = generarSvgBlandi(miMascota.visual_genes);
    }

    // 2. NUEVO: Lógica del Botón "Alimentar"
    const btnFeed = document.getElementById("btn-feed");
    
    if (btnFeed) {
        btnFeed.addEventListener("click", () => {
            // Verificamos si la variable global del inventario existe y tiene manzanas
            if (window.miInventario && window.miInventario.consumeItem("apple_01", 1)) {
                
                // Si la manzana se consumió con éxito, el Blandi salta
                contenedor.classList.add("happy-jump");
                
                // Le quitamos la clase de salto medio segundo después para que vuelva a respirar tranquilo
                setTimeout(() => {
                    contenedor.classList.remove("happy-jump");
                }, 500);

            } else {
                // Si no hay manzanas
                alert("No tienes manzanas en tus Bolsillos Rotos. Usa el botón + 🍎 para recolectar.");
            }
        });
    }
});