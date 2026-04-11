function generarSvgGeno(genesVisuales) {
    const safeData = genesVisuales || {};
    if (safeData.isEgg) {
        return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><style>@keyframes huevoFlota { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }.huevo-anim { animation: huevoFlota 3s ease-in-out infinite; }</style><g class="huevo-anim"><ellipse cx="50" cy="55" rx="30" ry="40" fill="#fffacd" stroke="#d4af37" stroke-width="3" stroke-dasharray="4,4"/><text x="50" y="62" font-size="28" text-anchor="middle" font-family="sans-serif">❓</text></g></svg>`;
    }

    const color = safeData.base_color || "#77DD77";
    const shape = safeData.body_shape || "frijol";
    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${rnd}`;

    // 1. Cargamos el anclaje base del diccionario
    let safeAnclaje = (typeof anclajes !== 'undefined' && anclajes[shape]) 
        ? {...anclajes[shape]} 
        : { cabezaX: 80, cabezaY: 25, espaldaX: 80, espaldaY: 80 };

    // 2. MAGIA GENÉTICA: Los mutantes sobrescriben el anclaje con su ADN
    if (safeData.mutated_espaldaX) safeAnclaje.espaldaX = safeData.mutated_espaldaX;
    if (safeData.mutated_espaldaY) safeAnclaje.espaldaY = safeData.mutated_espaldaY;
    if (safeData.mutated_cabezaX) safeAnclaje.cabezaX = safeData.mutated_cabezaX;
    if (safeData.mutated_cabezaY) safeAnclaje.cabezaY = safeData.mutated_cabezaY;
    
    const obtenerPieza = (dic, gen) => {
        if (typeof dic === 'undefined' || Object.keys(dic).length === 0) return '';
        return gen ? (dic[gen] || '') : dic[Object.keys(dic)[Math.floor(Math.random() * Object.keys(dic).length)]];
    };

    const ojo = obtenerPieza(typeof dicOjos !== 'undefined' ? dicOjos : {}, safeData.eye_type);
    const boca = obtenerPieza(typeof dicBocas !== 'undefined' ? dicBocas : {}, safeData.mouth_type);
    const hat = obtenerPieza(typeof dicSombreros !== 'undefined' ? dicSombreros : {}, safeData.hat_type);
    const wing = obtenerPieza(typeof dicAlas !== 'undefined' ? dicAlas : {}, safeData.wing_type);

    let pathD = "", shineD = "", extras = ""; 
    switch (shape) {
        case "gota": 
            pathD = "M 80 24 Q 28 80 28 108 A 52 52 0 0 0 132 108 Q 132 80 80 24 Z"; 
            shineD = "M 65 50 Q 55 65 58 80 Q 62 70 70 55 Z"; break;
        case "hongo": 
            const tallo = "M 72 100 C 72 120 60 130 55 135 C 50 148 65 150 80 150 C 95 150 110 148 105 135 C 100 130 88 120 88 100 Z";
            pathD = "M 15 90 C 15 20, 145 20, 145 90 C 145 110, 120 115, 80 115 C 40 115, 15 110, 15 90 Z"; 
            shineD = "M 40 55 Q 50 40 70 40 Q 55 48 40 55 Z"; 
            extras = `<path d="${tallo}" fill="${color}" stroke="#1a2a36" stroke-width="5"/><path d="${tallo}" fill="url(#${gradId})"/><g fill="#d5d0a9" opacity="0.6"><circle cx="40" cy="70" r="6"/><circle cx="100" cy="50" r="7"/><circle cx="50" cy="90" r="4"/></g>`;
            break;
        case "triangulo": 
            pathD = "M 80 24 Q 88 24 96 40 L 136 120 Q 144 136 120 136 L 40 136 Q 16 136 24 120 L 64 40 Q 72 24 80 24 Z"; 
            shineD = "M 72 48 L 48 104 Q 56 80 80 56 Z"; break;
        case "circulo": 
            pathD = "M 24 88 A 56 56 0 1 0 136 88 A 56 56 0 1 0 24 88 Z"; 
            shineD = "M 40 72 A 40 40 0 0 1 88 40 A 48 48 0 0 0 40 96 Z"; break;
        case "cuadrado": 
            pathD = "M 32 48 Q 32 32 48 32 L 112 32 Q 128 32 128 48 L 128 112 Q 128 128 112 128 L 48 128 Q 32 128 32 112 Z"; 
            shineD = "M 45 48 Q 45 45 56 45 L 96 45 Q 64 64 45 88 Z"; break;
        default: 
            pathD = "M 65 25 C 110 20, 135 50, 135 85 C 135 125, 105 145, 75 145 C 35 145, 25 115, 35 75 C 40 50, 35 30, 65 25 Z"; 
            shineD = "M 45 48 Q 60 38 75 40 Q 55 52 50 75 Q 40 60 45 48 Z"; break;
    }

    return `
    <svg width="200" height="190" viewBox="-20 0 200 160" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.25"/></linearGradient>
        </defs>
        <style>
            @keyframes respirar { 0%, 100% { transform: scale(1); } 50% { transform: scaleY(0.97) scaleX(1.02); } }
            @keyframes parpadear { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.05); } }
            .g-cuerpo { transform-origin: 80px 136px; animation: respirar 3.5s ease-in-out infinite; }
            .g-ojos { transform-origin: 80px 85px; animation: parpadear 5s infinite; }
            .anim-flotar { animation: respirar 3s ease-in-out infinite; }
        </style>
        
        <g class="g-cuerpo">
            <g transform="translate(${safeAnclaje.espaldaX}, ${safeAnclaje.espaldaY})">
                ${wing}
            </g>

            ${extras}
            <path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5"/>
            <path d="${pathD}" fill="url(#${gradId})"/>
            <path d="${shineD}" fill="#fff" opacity="0.4"/>
            <g class="g-ojos">${ojo}</g>
            <g class="g-boca">${boca}</g>
            <g transform="translate(${safeAnclaje.cabezaX}, ${safeAnclaje.cabezaY})">${hat}</g>
        </g>
    </svg>`;
}