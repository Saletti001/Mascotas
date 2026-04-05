// 1. Diccionario de coordenadas SVG (Formas base)
const formasBlandi = {
    gota: `<path d="M50,15 C50,15 15,60 15,85 C15,105 85,105 85,85 C85,60 50,15 50,15 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`,
    frijol: `<path d="M25,50 C25,15 75,15 75,50 C75,70 65,65 55,80 C45,95 25,90 25,50 Z" fill="COLOR_AQUI" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
};

// 2. Función que ensambla las partes
function generarSvgBlandi(genesVisuales) {
    // Tomamos la forma según los genes, o por defecto la gota
    let cuerpoSvg = formasBlandi[genesVisuales.body_shape] || formasBlandi.gota;
    
    // Inyectamos el color del gen al cuerpo
    cuerpoSvg = cuerpoSvg.replace("COLOR_AQUI", genesVisuales.base_color);

    // Retornamos el SVG completo (Cuerpo + Ojos Neutros + Boca Sonrisa)
    return `
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${cuerpoSvg}
            <circle cx="38" cy="55" r="4" fill="#222"/>
            <circle cx="62" cy="55" r="4" fill="#222"/>
            <path d="M42,68 Q50,78 58,68" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/>
        </svg>
    `;
}

// 3. Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Simulamos que cargamos el JSON de la mascota del jugador
    const miMascota = {
        visual_genes: {
            body_shape: "frijol", // Cámbialo a "gota" para ver la magia
            base_color: "#77DD77" // Un verde bonito
        }
    };

    // Buscamos el contenedor en el HTML y le metemos el dibujo
    const contenedor = document.getElementById("blandi-container");
    if (contenedor) {
        contenedor.innerHTML = generarSvgBlandi(miMascota.visual_genes);
    }
});