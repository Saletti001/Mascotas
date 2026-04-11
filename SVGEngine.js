// =========================================
// SVGEngine.js - Motor de Ensamblaje Modular
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

    // Leemos del diccionario de anclajes (que vive en diccionarios.js)
    const anclajeActual = (typeof anclajes !== 'undefined' && anclajes[shape]) ? anclajes[shape] : { cabezaX: 80, cabezaY: 25, espaldaX: 35, espaldaY: 80 };
    
    let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    svgContent += `
        <style>
            @keyframes respirar { 0%, 100% { transform: scaleY(1) scaleX(1); } 50% { transform: scaleY(0.97) scaleX(1.02); } }
            @keyframes parpadear { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.05); } }
            @keyframes hablar { 0%, 100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(1.3) translateY(2px); } }
            @keyframes rugir { 0%, 100% { transform: scale(1) translateX(0); } 25% { transform: scale(1.05) translateX(-1px); } 75% { transform: scale(1.05) translateX(1px); } }
            @keyframes flotarAccesorio { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }

            .geno-cuerpo { transform-origin: 80px 136px; animation: respirar 3.5s ease-in-out infinite; }
            .geno-ojos-parpado { transform-origin: 80px 85px; animation: parpadear 5s infinite; }
            .geno-boca { transform-origin: 80px 110px; }
            .boca-hablando { animation: hablar 0.2s infinite; }
            .boca-rugiendo { animation: rugir 0.1s infinite; }
            .anim-flotar { animation: flotarAccesorio 3s ease-in-out infinite; }
        </style>
    `;

    svgContent += `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#000000" stop-opacity="0" /><stop offset="100%" stop-color="#000000" stop-opacity="0.25" /></linearGradient><linearGradient id="${bronzeId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c58f65" /><stop offset="50%" stop-color="#e8cba5" /><stop offset="100%" stop-color="#8b5735" /></linearGradient><filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="4" flood-opacity="0.3" /></filter></defs>`;

    // SORTEO DE PIEZAS (Verificamos que los diccionarios existan)
    const safeOjos = (typeof dicOjos !== 'undefined') ? dicOjos : { base: `<circle cx="60" cy="85" r="5"/><circle cx="100" cy="85" r="5"/>` };
    const safeBocas = (typeof dicBocas !== 'undefined') ? dicBocas : { base: `<path d="M 70 110 H 90" stroke="#000" stroke-width="3"/>` };
    const safeSombreros = (typeof dicSombreros !== 'undefined') ? dicSombreros : { ninguno: `` };
    const safeAlas = (typeof dicAlas !== 'undefined') ? dicAlas : { ninguno: `` };

    const nombresOjos = Object.keys(safeOjos);
    const nombresBocas = Object.keys(safeBocas);
    const nombresSombreros = Object.keys(safeSombreros);
    const nombresAlas = Object.keys(safeAlas);
    
    const nombreOjoElegido = safeData.eye_type ? safeData.eye_type : nombresOjos[Math.floor(Math.random() * nombresOjos.length)];
    const nombreBocaElegida = safeData.mouth_type ? safeData.mouth_type : nombresBocas[Math.floor(Math.random() * nombresBocas.length)];
    const nombreSombreroElegido = safeData.hat_type ? safeData.hat_type : nombresSombreros[Math.floor(Math.random() * nombresSombreros.length)];
    const nombreAlaElegida = safeData.wing_type ? safeData.wing_type : nombresAlas[Math.floor(Math.random() * nombresAlas.length)];

    const ojoSeleccionado = safeOjos[nombreOjoElegido] || safeOjos[nombresOjos[0]];
    const bocaSeleccionada = safeBocas[nombreBocaElegida] || safeBocas[nombresBocas[0]];
    const sombreroSeleccionado = safeSombreros[nombreSombreroElegido] || safeSombreros[nombresSombreros[0]];
    const alaSeleccionada = safeAlas[nombreAlaElegida] || safeAlas[nombresAlas[0]];

    // CAPA 1: FONDO (Alas / Jetpacks)
    svgContent += `
        <g class="geno-accesorio-espalda" transform="translate(${anclajeActual.espaldaX}, ${anclajeActual.espaldaY})">
            ${alaSeleccionada}
        </g>
    `;

    // CAPA 2: CUERPO BASE ANIMADO
    svgContent += `<g class="geno-cuerpo">`;

    let pathD = ""; let shineD = ""; 
    switch (shape) {
        case "gota": 
            pathD = "M 80 24 Q 28 80 28 108 A 52 52 0 0 0 132 108 Q 132 80 80 24 Z"; shineD = "M 65 50 Q 55 65 58 80 Q 62 70 70 55 Z"; break;
        case "hongo": 
            const talloOrganico = "M 72 100 C 72 120 60 130 55 135 C 50 148 65 150 80 150 C 95 150 110 148 105 135 C 100 130 88 120 88 100 Z";
            svgContent += `<path d="${talloOrganico}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round"/><path d="${talloOrganico}" fill="url(#${gradId})" />`;
            pathD = "M 15 90 C 15 20, 145 20, 145 90 C 145 110, 120 115, 80 115 C 40 115, 15 110, 15 90 Z"; 
            shineD = "M 40 55 Q 50 40 70 40 Q 55 48 40 55 Z"; 
            break;
        case "circulo": pathD = "M 24 88 A 56 56 0 1 0 136 88 A 56 56 0 1 0 24 88 Z"; shineD = "M 40 72 A 40 40 0 0 1 88 40 A 48 48 0 0 0 40 96 Z"; break;
        case "cuadrado": pathD = "M 32 48 Q 32 32 48 32 L 112 32 Q 128 32 128 48 L 128 112 Q 128 128 112 128 L 48 128 Q 32 128 32 112 Z"; shineD = "M 45 48 Q 45 45 56 45 L 96 45 Q 64 64 45 88 Z"; break;
        case "triangulo": pathD = "M 80 24 Q 88 24 96 40 L 136 120 Q 144 136 120 136 L 40 136 Q 16 136 24 120 L 64 40 Q 72 24 80 24 Z"; shineD = "M 72 48 L 48 104 Q 56 80 80 56 Z"; break;
        default: 
            // Frijol Premium curvo
            pathD = "M 65 25 C 110 20, 135 50, 135 85 C 135 125, 105 145, 75 145 C 35 145, 25 115, 35 75 C 40 50, 35 30, 65 25 Z"; 
            shineD = "M 45 48 Q 60 38 75 40 Q 55 52 50 75 Q 40 60 45 48 Z"; 
            break;
    }

    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/><path d="${pathD}" fill="url(#${gradId})" /><path d="${shineD}" fill="#ffffff" opacity="0.4" />`;

    // Manchas del hongo
    if (shape === "hongo") {
        svgContent += `
            <g fill="#d5d0a9" opacity="0.6">
                <circle cx="40" cy="70" r="6" />
                <ellipse cx="60" cy="45" rx="7" ry="4" transform="rotate(-20 60 45)" />
                <circle cx="100" cy="50" r="7" />
                <ellipse cx="120" cy="75" rx="5" ry="8" transform="rotate(15 120 75)" />
                <circle cx="50" cy="90" r="4" />
            </g>
        `;
    }

    // CAPA 3: ROSTRO
    svgContent += `
        <g class="geno-ojos-parpado">${ojoSeleccionado}</g>
        <g class="geno-boca">${bocaSeleccionada}</g>
    `;

    // CAPA 4: FRENTE (Sombreros/Coronas)
    svgContent += `
        <g class="geno-accesorio-cabeza" transform="translate(${anclajeActual.cabezaX}, ${anclajeActual.cabezaY})">
            ${sombreroSeleccionado}
        </g>
    `;

    svgContent += `</g>`; // Cierra geno-cuerpo

    svgContent += `</svg>`;
    
    return svgContent;
}