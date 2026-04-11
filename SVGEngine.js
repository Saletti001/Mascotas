// =========================================
// SVGEngine.js - Motor de Ensamblaje y Lógica
// =========================================

function generarSvgGeno(genesVisuales) {
    const safeData = genesVisuales || {};

    if (safeData.isEgg) {
        return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><style>@keyframes huevoFlota { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }.huevo-anim { animation: huevoFlota 3s ease-in-out infinite; }</style><g class="huevo-anim"><ellipse cx="50" cy="55" rx="30" ry="40" fill="#fffacd" stroke="#d4af37" stroke-width="3" stroke-dasharray="4,4"/><text x="50" y="62" font-size="28" text-anchor="middle" font-family="sans-serif">❓</text></g></svg>`;
    }

    const color = safeData.base_color || "#77DD77";
    const formasPosibles = ["hongo", "frijol", "gota"];
    const shape = safeData.body_shape || formasPosibles[Math.floor(Math.random() * formasPosibles.length)];
    
    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${shape}-${rnd}`;
    const shadowId = `shadow-${rnd}`;
    const bronzeId = `bronze-${rnd}`;
    const size = 190; 

    // Leemos del diccionario de anclajes (que está en el otro archivo)
    const anclajeActual = anclajes[shape] || anclajes['frijol'];
    
    let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // ... [AQUÍ VA TODO EL BLOQUE DE <style> QUE YA TIENES] ...
    // ... [AQUÍ VA EL switch(shape) QUE DIBUJA EL CUERPO] ...

    // SORTEO DE PIEZAS (Leyendo de los diccionarios globales)
    const nombresOjos = Object.keys(dicOjos);
    const nombresBocas = Object.keys(dicBocas);
    const nombresSombreros = Object.keys(dicSombreros);
    const nombresAlas = Object.keys(dicAlas);
    
    const nombreOjoElegido = safeData.eye_type ? safeData.eye_type : nombresOjos[Math.floor(Math.random() * nombresOjos.length)];
    const nombreBocaElegida = safeData.mouth_type ? safeData.mouth_type : nombresBocas[Math.floor(Math.random() * nombresBocas.length)];
    const nombreSombreroElegido = safeData.hat_type ? safeData.hat_type : nombresSombreros[Math.floor(Math.random() * nombresSombreros.length)];
    const nombreAlaElegida = safeData.wing_type ? safeData.wing_type : nombresAlas[Math.floor(Math.random() * nombresAlas.length)];

    const ojoSeleccionado = dicOjos[nombreOjoElegido];
    const bocaSeleccionada = dicBocas[nombreBocaElegida];
    const sombreroSeleccionado = dicSombreros[nombreSombreroElegido];
    const alaSeleccionada = dicAlas[nombreAlaElegida];

    // INYECCIÓN DE LAS 4 CAPAS (Fondo, Cuerpo, Rostro, Frente)
    svgContent += `<g class="geno-accesorio-espalda" transform="translate(${anclajeActual.espaldaX}, ${anclajeActual.espaldaY})">${alaSeleccionada}</g>`;
    svgContent += `<g class="geno-cuerpo">`;
    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/><path d="${pathD}" fill="url(#${gradId})" /><path d="${shineD}" fill="#ffffff" opacity="0.4" />`;
    
    if (shape === "hongo") {
        svgContent += `<g fill="#d5d0a9" opacity="0.6"><circle cx="40" cy="70" r="6" /><ellipse cx="60" cy="45" rx="7" ry="4" transform="rotate(-20 60 45)" /><circle cx="100" cy="50" r="7" /><ellipse cx="120" cy="75" rx="5" ry="8" transform="rotate(15 120 75)" /><circle cx="50" cy="90" r="4" /></g>`;
    }

    svgContent += `<g class="geno-ojos-parpado">${ojoSeleccionado}</g><g class="geno-boca">${bocaSeleccionada}</g>`;
    svgContent += `<g class="geno-accesorio-cabeza" transform="translate(${anclajeActual.cabezaX}, ${anclajeActual.cabezaY})">${sombreroSeleccionado}</g>`;
    svgContent += `</g></svg>`;
    
    return svgContent;
}