function generarSvgGeno(genesVisuales) {
    const safeData = genesVisuales || {};
    if (safeData.isEgg) {
        return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><style>@keyframes huevoFlota { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }.huevo-anim { animation: huevoFlota 3s ease-in-out infinite; }</style><g class="huevo-anim"><ellipse cx="50" cy="55" rx="30" ry="40" fill="#fffacd" stroke="#d4af37" stroke-width="3" stroke-dasharray="4,4"/><text x="50" y="62" font-size="28" text-anchor="middle" font-family="sans-serif">❓</text></g></svg>`;
    }

    const color = safeData.base_color || "#77DD77";
    const shape = safeData.body_shape || "frijol";
    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${rnd}`;

    let safeAnclaje = (typeof anclajes !== 'undefined' && anclajes[shape]) 
        ? {...anclajes[shape]} 
        : { cabezaX: 80, cabezaY: 25, espaldaX: 80, espaldaY: 80 };

    if (safeData.mutated_espaldaX) safeAnclaje.espaldaX = safeData.mutated_espaldaX;
    if (safeData.mutated_espaldaY) safeAnclaje.espaldaY = safeData.mutated_espaldaY;
    if (safeData.mutated_cabezaX) safeAnclaje.cabezaX = safeData.mutated_cabezaX;
    if (safeData.mutated_cabezaY) safeAnclaje.cabezaY = safeData.mutated_cabezaY;
    
    // 🧠 MEJORA: Cara Inteligente. Si no encuentra el ojo/boca, elige uno al azar.
    const obtenerPieza = (dic, gen) => {
        if (typeof dic === 'undefined' || Object.keys(dic).length === 0) return '';
        if (gen && dic[gen]) return dic[gen]; // Si existe, lo usa
        // Si no existe, saca uno aleatorio para que nunca queden sin cara
        const keys = Object.keys(dic);
        return dic[keys[Math.floor(Math.random() * keys.length)]];
    };

    const ojo = obtenerPieza(typeof dicOjos !== 'undefined' ? dicOjos : {}, safeData.eye_type);
    const boca = obtenerPieza(typeof dicBocas !== 'undefined' ? dicBocas : {}, safeData.mouth_type);
    const hat = obtenerPieza(typeof dicSombreros !== 'undefined' ? dicSombreros : {}, safeData.hat_type);
    const wing = obtenerPieza(typeof dicAlas !== 'undefined' ? dicAlas : {}, safeData.wing_type);

    // ✨ Declaramos todas las variables de dibujo, incluyendo la nueva de detallesFrente
    let pathD = "", shineD = "", extras = "", detallesFrente = ""; 
    
    switch (shape) {
        case "gota": 
            pathD = "M 80 24 Q 28 80 28 108 A 52 52 0 0 0 132 108 Q 132 80 80 24 Z"; 
            shineD = "M 65 50 Q 55 65 58 80 Q 62 70 70 55 Z"; break;
        case "hongo": 
            // 🍄 Hongo Rediseñado (Forma Intermedia + PARCHE MAESTRO DE CAPAS Y MÁSCARA)
            const tallo = "M 72 110 C 72 120 65 130 60 135 C 50 148 65 150 80 150 C 95 150 110 148 100 135 C 95 130 88 120 88 110 Z";
            pathD = "M 15 90 C 15 20, 145 20, 145 90 C 145 118, 122 122, 80 122 C 38 122, 15 118, 15 90 Z"; 
            shineD = "M 40 55 Q 50 40 70 40 Q 55 48 40 55 Z"; 

            // --- ⚪ SECCIÓN DE MANCHAS REALISTAS Y FIJAS (SEEDED RANDOM) ⚪ ---
            // 1. Creamos una "semilla" única basada en el ADN de este Geno específico.
            // Si el Geno tiene un ID único en el juego, lo usamos. Si no, usamos sus colores y partes.
            let seedStr = (safeData.id || "geno") + color + ojo + boca;
            let seed = 0;
            for (let i = 0; i < seedStr.length; i++) {
                seed = seedStr.charCodeAt(i) + ((seed << 5) - seed);
            }
            seed = Math.abs(seed);

            // 2. Generador pseudo-aleatorio. Siempre da el mismo resultado para la misma semilla.
            const randomFijo = () => {
                let x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            };

            let generatedManchas = `<g fill="#ffffff" opacity="0.6">`;
            const numManchas = 8; 
            for (let i = 0; i < numManchas; i++) {
                // Usamos randomFijo() en lugar de Math.random()
                const cx = 25 + randomFijo() * (135 - 25);
                const cy = 30 + randomFijo() * (110 - 30);
                const r = 3 + randomFijo() * (8 - 3);
                generatedManchas += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`;
            }
            generatedManchas += `</g>`;

            const manchasStr = generatedManchas;

            // El tallo va en 'extras' (por DETRÁS del cuerpo)
            extras = `
                <path d="${tallo}" fill="${color}" stroke="#1a2a36" stroke-width="5"/>
                <path d="${tallo}" fill="url(#${gradId})"/>
            `;
            
            // Las manchas van en 'detallesFrente' (por DELANTE del cuerpo, usando máscara)
            detallesFrente = `
                <defs>
                    <clipPath id="hongoMask-${rnd}">
                        <path d="${pathD}"/>
                    </clipPath>
                </defs>
                <g clip-path="url(#hongoMask-${rnd})">
                    ${manchasStr}
                </g>
            `;
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
        
        // 🚀 NUEVAS FORMAS
        case "estrella":
            // 🌟 Estrella movida exactamente +20px hacia abajo para alinear las puntas con los ojos fijos
            pathD = "M 80 35 Q 84 35 86 41 L 98 68 L 136 68 Q 142 68 139 74 L 110 98 L 119 142 Q 121 148 115 144 L 80 126 L 45 144 Q 39 148 41 142 L 50 98 L 21 74 Q 18 68 24 68 L 62 68 L 74 41 Q 76 35 80 35 Z";
            shineD = "M 70 60 L 55 95 Q 75 85 90 80 Z";
            break;
        case "pentagono":
            pathD = "M 80 25 Q 84 25 86 29 L 132 63 Q 135 66 134 70 L 112 125 Q 110 130 105 130 L 55 130 Q 50 130 48 125 L 26 70 Q 25 66 28 63 L 74 29 Q 76 25 80 25 Z";
            shineD = "M 70 45 L 45 80 Q 60 70 90 70 Z";
            break;
        case "nube":
            // ☁️ Nube "Intermedia": Base baja hasta Y:130, lados ajustados
            pathD = "M 45 130 C 20 130, 20 75, 50 70 C 55 25, 105 25, 110 70 C 140 75, 140 130, 115 130 Z";
            shineD = "M 55 60 Q 80 40 105 60 Q 80 50 55 60 Z";
            break;
        case "chili":
            pathD = "M 80 20 C 40 20, 30 70, 45 105 C 60 140, 80 145, 80 145 C 80 145, 100 140, 115 105 C 130 70, 120 20, 80 20 Z";
            shineD = "M 50 60 C 40 90, 60 120, 75 135 C 60 110, 50 80, 65 50 Z";
            break;
        case "rayo":
            pathD = "M 95 20 L 35 85 L 85 85 L 65 145 L 125 80 L 75 80 Z";
            shineD = "M 75 45 L 55 75 L 80 75 Z";
            break;
            
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
            @keyframes propulsor { 0% { transform: scaleY(1); opacity: 0.9; } 100% { transform: scaleY(1.5); opacity: 1; } }
            
            .g-cuerpo { transform-origin: 80px 136px; animation: respirar 3.5s ease-in-out infinite; }
            .g-ojos { transform-origin: 80px 85px; animation: parpadear 5s infinite; }
            .anim-flotar { animation: respirar 3s ease-in-out infinite; }
            .anim-fuego { animation: propulsor 0.1s infinite alternate ease-in-out; }
        </style>
        
        <g class="g-cuerpo">
            <g transform="translate(${safeAnclaje.espaldaX}, ${safeAnclaje.espaldaY})">
                ${wing}
            </g>

            ${extras} <path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5"/>
            <path d="${pathD}" fill="url(#${gradId})"/>
            
            ${detallesFrente} <path d="${shineD}" fill="#fff" opacity="0.4"/>
            <g class="g-ojos">${ojo}</g>
            <g class="g-boca">${boca}</g>
            <g transform="translate(${safeAnclaje.cabezaX}, ${safeAnclaje.cabezaY})">${hat}</g>
        </g>
    </svg>`;
}