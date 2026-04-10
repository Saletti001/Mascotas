// =========================================
// SVGEngine.js - MOTOR VISUAL HD (EXPRESIONES IMPONENTES ESTILO PvZ)
// =========================================

function generarSvgGeno(genesVisuales) {
    const safeData = genesVisuales || {};

    if (safeData.isEgg) {
        return `
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
                <style>
                    @keyframes huevoFlota { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                    .huevo-anim { animation: huevoFlota 3s ease-in-out infinite; }
                </style>
                <g class="huevo-anim">
                    <ellipse cx="50" cy="55" rx="30" ry="40" fill="#fffacd" stroke="#d4af37" stroke-width="3" stroke-dasharray="4,4"/>
                    <text x="50" y="62" font-size="28" text-anchor="middle" font-family="sans-serif">❓</text>
                </g>
            </svg>
        `;
    }

    const color = safeData.base_color || "#77DD77";
    const shape = safeData.body_shape || "frijol"; 

    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${shape}-${rnd}`;
    const shadowId = `shadow-${rnd}`;
    const bronzeId = `bronze-${rnd}`;
    
    // TAMAÑO EXACTO: 190px
    const size = 190; 
    
    let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // 1. SISTEMA DE VIDA (Respiración y Parpadeo)
    svgContent += `
        <style>
            @keyframes respirar {
                0%, 100% { transform: scaleY(1) scaleX(1); }
                50% { transform: scaleY(0.97) scaleX(1.02); }
            }
            @keyframes parpadear {
                0%, 94%, 100% { transform: scaleY(1); }
                97% { transform: scaleY(0.05); }
            }
            .geno-cuerpo { transform-origin: 80px 136px; animation: respirar 3.5s ease-in-out infinite; }
            .geno-ojos-parpado { transform-origin: 80px 85px; animation: parpadear 5s infinite; }
        </style>
    `;

    // 2. DEGRADADOS Y SOMBRAS
    svgContent += `
        <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#000000" stop-opacity="0" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0.25" /> 
            </linearGradient>
            <linearGradient id="${bronzeId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#c58f65" />
                <stop offset="50%" stop-color="#e8cba5" />
                <stop offset="100%" stop-color="#8b5735" />
            </linearGradient>
            <filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="4" flood-opacity="0.3" />
            </filter>
        </defs>
    `;

    // INICIAMOS EL GRUPO DE RESPIRACIÓN
    svgContent += `<g class="geno-cuerpo">`;

    let pathD = "";
    let shineD = ""; 
    
    switch (shape) {
        case "gota": 
            pathD = "M 80 24 Q 28 80 28 108 A 52 52 0 0 0 132 108 Q 132 80 80 24 Z";
            shineD = "M 65 50 Q 55 65 58 80 Q 62 70 70 55 Z";
            break;
        case "circulo":
            pathD = "M 24 88 A 56 56 0 1 0 136 88 A 56 56 0 1 0 24 88 Z";
            shineD = "M 40 72 A 40 40 0 0 1 88 40 A 48 48 0 0 0 40 96 Z";
            break;
        case "cuadrado":
            pathD = "M 32 48 Q 32 32 48 32 L 112 32 Q 128 32 128 48 L 128 112 Q 128 128 112 128 L 48 128 Q 32 128 32 112 Z";
            shineD = "M 45 48 Q 45 45 56 45 L 96 45 Q 64 64 45 88 Z";
            break;
        case "triangulo":
            pathD = "M 80 24 Q 88 24 96 40 L 136 120 Q 144 136 120 136 L 40 136 Q 16 136 24 120 L 64 40 Q 72 24 80 24 Z";
            shineD = "M 72 48 L 48 104 Q 56 80 80 56 Z";
            break;
        case "hongo": 
            const talloOrganico = "M 72 100 C 72 120 60 130 55 135 C 50 148 65 150 80 150 C 95 150 110 148 105 135 C 100 130 88 120 88 100 Z";
            svgContent += `<path d="${talloOrganico}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round"/>`;
            svgContent += `<path d="${talloOrganico}" fill="url(#${gradId})" />`;
            pathD = "M 15 90 C 15 20, 145 20, 145 90 C 145 110, 120 115, 80 115 C 40 115, 15 110, 15 90 Z";
            shineD = "M 35 60 Q 45 38 70 38 Q 50 48 35 60 Z";
            break;
        case "frijol": 
        default:
            pathD = "M 56 32 C 16 32, 24 112, 56 136 C 88 160, 136 112, 128 72 C 120 32, 96 32, 56 32 Z";
            shineD = "M 42 60 Q 36 75 45 90 Q 42 75 55 55 Z";
            break;
    }

    // 3. RENDERIZADO DE CAPAS DEL CUERPO
    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/>`;
    svgContent += `<path d="${pathD}" fill="url(#${gradId})" />`;
    svgContent += `<path d="${shineD}" fill="#ffffff" opacity="0.4" />`;

    // 4. DISTINTIVO DE COMUNIDAD 
    if (shape === "hongo") {
        svgContent += `
            <g transform="translate(100, 75)">
                <rect x="0" y="0" width="34" height="24" rx="8" fill="url(#${bronzeId})" stroke="#1a2a36" stroke-width="2.5"/>
                <polygon points="12,6 12,18 24,12" fill="#1a2a36" stroke="#1a2a36" stroke-width="1.5" stroke-linejoin="round"/>
                <polygon points="13,7 13,17 22,12" fill="#ffffff" opacity="0.3"/>
            </g>
        `;
    }

    // ==========================================
    // 5. SISTEMA MODULAR IMPONENTE (NIVEL PvZ)
    // ==========================================
    
    const dicOjos = {
        // Base mejorada con brillo
        atento: `<circle cx="60" cy="85" r="7" fill="#1a2a36"/><circle cx="61.5" cy="83.5" r="2.5" fill="#fff"/><circle cx="100" cy="85" r="7" fill="#1a2a36"/><circle cx="101.5" cy="83.5" r="2.5" fill="#fff"/>`,
        
        // Estilo Lanzaguisantes (Grandes y decididos)
        tirador: `
            <circle cx="55" cy="83" r="11" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="58" cy="83" r="5" fill="#1a2a36"/>
            <circle cx="59.5" cy="81.5" r="2" fill="#ffffff"/>
            <circle cx="105" cy="83" r="11" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="102" cy="83" r="5" fill="#1a2a36"/>
            <circle cx="100.5" cy="81.5" r="2" fill="#ffffff"/>
        `,
        
        // Estilo Nuez (Ligeramente bizcos y asimétricos)
        defensor: `
            <circle cx="58" cy="85" r="9" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="60" cy="87" r="4.5" fill="#1a2a36"/>
            <circle cx="61" cy="86" r="1.5" fill="#ffffff"/>
            <circle cx="102" cy="83" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="100" cy="84" r="4" fill="#1a2a36"/>
            <circle cx="101" cy="83" r="1.5" fill="#ffffff"/>
        `,
        
        // Estilo Repetidora/Jalapeño (Esclerótica cortada por ceño fruncido)
        feroz: `
            <path d="M 48 84 A 10 10 0 0 0 68 84 L 68 76 L 46 80 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="58" cy="85" r="4" fill="#1a2a36"/>
            <circle cx="59" cy="84" r="1.5" fill="#ffffff"/>
            <line x1="42" y1="78" x2="72" y2="72" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            
            <path d="M 92 84 A 10 10 0 0 0 112 84 L 114 80 L 92 76 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="102" cy="85" r="4" fill="#1a2a36"/>
            <circle cx="103" cy="84" r="1.5" fill="#ffffff"/>
            <line x1="88" y1="72" x2="118" y2="78" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
        `,
        
        // Estilo Seta Hipnótica (Espirales concéntricas)
        hipnotico: `
            <circle cx="60" cy="85" r="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="60" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2.5"/>
            <circle cx="60" cy="85" r="2" fill="#e834eb"/>
            
            <circle cx="100" cy="85" r="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="100" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2.5"/>
            <circle cx="100" cy="85" r="2" fill="#e834eb"/>
        `,

        // Pícaro (Párpados a la mitad)
        picaro: `
            <path d="M 48 85 A 11 11 0 0 0 70 85 L 70 82 L 48 82 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="59" cy="86" r="4" fill="#1a2a36"/>
            <circle cx="60" cy="85" r="1.5" fill="#ffffff"/>
            <line x1="45" y1="81" x2="73" y2="81" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/>
            
            <path d="M 90 85 A 11 11 0 0 0 112 85 L 112 82 L 90 82 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
            <circle cx="101" cy="86" r="4" fill="#1a2a36"/>
            <circle cx="102" cy="85" r="1.5" fill="#ffffff"/>
            <line x1="87" y1="81" x2="115" y2="81" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/>
        `
    };

    const dicBocas = {
        base: `<path d="M 67 108 Q 80 124 93 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        
        // Estilo Lanzaguisantes (Círculo con profundidad negra)
        canon: `
            <ellipse cx="80" cy="112" rx="10" ry="10" fill="#1a2a36" stroke="#1a2a36" stroke-width="2"/>
            <ellipse cx="80" cy="112" rx="6" ry="6" fill="#000000"/>
        `,
        
        // Estilo Girasol (Boca muy grande con lengua roja)
        radiante: `
            <path d="M 62 102 C 62 125, 98 125, 98 102 Z" fill="#1a2a36" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/>
            <path d="M 70 112 C 70 122, 90 122, 90 112 Z" fill="#ff6b6b"/>
        `,
        
        // Estilo Planta Carnívora (Superposición de dientes afilados)
        depredador: `
            <path d="M 52 105 Q 80 118 108 105" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <polygon points="60,107 65,116 70,109" fill="#fff" stroke="#1a2a36" stroke-width="2.5" stroke-linejoin="round"/>
            <polygon points="75,110 80,119 85,111" fill="#fff" stroke="#1a2a36" stroke-width="2.5" stroke-linejoin="round"/>
            <polygon points="90,109 95,116 100,107" fill="#fff" stroke="#1a2a36" stroke-width="2.5" stroke-linejoin="round"/>
        `,
        
        // Estilo Nuez (Línea ondulada de tensión)
        tenso: `
            <path d="M 65 112 Q 72 105 80 112 Q 88 105 95 112" fill="none" stroke="#1a2a36" stroke-width="4.5" stroke-linecap="round"/>
        `,
        
        // Mueca ladeada
        torcida: `
            <path d="M 65 112 L 95 104" fill="none" stroke="#1a2a36" stroke-width="4.5" stroke-linecap="round"/>
        `
    };

    // --- ALEATORIEDAD GEN-0 SEGURA ---
    const nombresOjos = Object.keys(dicOjos);
    const nombresBocas = Object.keys(dicBocas);

    const ojoSeleccionado = safeData.eye_type ? dicOjos[safeData.eye_type] : dicOjos[nombresOjos[Math.floor(Math.random() * nombresOjos.length)]];
    const bocaSeleccionada = safeData.mouth_type ? dicBocas[safeData.mouth_type] : dicBocas[nombresBocas[Math.floor(Math.random() * nombresBocas.length)]];

    // Inyectamos todo en el SVG
    svgContent += `
        <g class="geno-ojos-parpado">
            ${ojoSeleccionado}
        </g>
        <g class="geno-boca">
            ${bocaSeleccionada}
        </g>
    `;

    svgContent += `</g>`; // FIN DEL GRUPO RESPIRACIÓN
    svgContent += `</svg>`;
    
    return svgContent;
}