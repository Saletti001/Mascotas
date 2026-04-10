// =========================================
// SVGEngine.js - MOTOR VISUAL HD (EXPRESIONES PvZ + BRILLOS DISCRETOS)
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
    
    // Capturamos la expresión (por defecto "cute")
    const expressionType = safeData.expression_type || safeData.face || "cute";

    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${shape}-${rnd}`;
    const shadowId = `shadow-${rnd}`;
    const bronzeId = `bronze-${rnd}`;
    
    // TAMAÑO: 190px (El tamaño perfecto que elegimos)
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
            /* Se aplica el parpadeo solo a los ojos para no deformar la boca */
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

    // 4. DISTINTIVO DE COMUNIDAD (Sin Sombra)
    if (shape === "hongo") {
        svgContent += `
            <g transform="translate(100, 75)">
                <rect x="0" y="0" width="34" height="24" rx="8" fill="url(#${bronzeId})" stroke="#1a2a36" stroke-width="2.5"/>
                <polygon points="12,6 12,18 24,12" fill="#1a2a36" stroke="#1a2a36" stroke-width="1.5" stroke-linejoin="round"/>
                <polygon points="13,7 13,17 22,12" fill="#ffffff" opacity="0.3"/>
            </g>
        `;
    }

    // 5. NUEVO SISTEMA DE EXPRESIONES (Estilo PvZ)
    const facialExpressions = {
        cute: { // Base, amigable
            eyes: `
                <circle cx="60" cy="88" r="6" fill="#1a2a36"/>
                <circle cx="100" cy="88" r="6" fill="#1a2a36"/>
            `,
            mouth: `<path d="M 67 108 Q 80 124 93 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`
        },
        mischievous: { // Pícara/Confiada (Ojos con párpados)
            eyes: `
                <path d="M 45 85 C 45 95, 60 95, 60 85 L 60 78 L 45 73 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/>
                <circle cx="55" cy="85" r="4.5" fill="#1a2a36"/>
                <circle cx="53" cy="83" r="1.5" fill="#ffffff"/>
                <path d="M 75 85 C 75 95, 90 95, 90 85 L 90 73 L 75 78 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/>
                <circle cx="80" cy="85" r="4.5" fill="#1a2a36"/>
                <circle cx="78" cy="83" r="1.5" fill="#ffffff"/>
            `,
            mouth: `<path d="M 55 98 Q 70 105 85 93" fill="none" stroke="#1a2a36" stroke-width="3.5" stroke-linecap="round"/>`
        },
        shocked: { // Sorprendida/Asustada (Ojos muy abiertos)
            eyes: `
                <circle cx="60" cy="85" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
                <circle cx="60" cy="85" r="3.5" fill="#1a2a36"/>
                <circle cx="100" cy="85" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
                <circle cx="100" cy="85" r="3.5" fill="#1a2a36"/>
            `,
            mouth: `<circle cx="80" cy="110" r="5" fill="#1a2a36"/>`
        },
        determination: { // Enojada/Combativa (Ojos en ángulo)
            eyes: `
                <line x1="48" y1="76" x2="67" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
                <line x1="112" y1="76" x2="93" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
                <circle cx="60" cy="92" r="6" fill="#1a2a36"/>
                <circle cx="100" cy="92" r="6" fill="#1a2a36"/>
            `,
            mouth: `
                <path d="M 64 108 Q 80 120 96 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
                <polygon points="67,112 73,112 70,121" fill="#fff" stroke="#1a2a36" stroke-width="2"/>
            `
        },
        derpy: { // Dispereja/Tonta (Un ojo más grande que otro)
            eyes: `
                <circle cx="58" cy="84" r="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
                <circle cx="58" cy="84" r="4" fill="#1a2a36"/>
                <circle cx="102" cy="88" r="6" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/>
                <circle cx="102" cy="88" r="2.5" fill="#1a2a36"/>
            `,
            mouth: `<path d="M 64 108 Q 80 120 96 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`
        },
        sleepy: { // Cansada/Dormida
            eyes: `
                <line x1="51" y1="88" x2="70" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
                <line x1="109" y1="88" x2="90" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            `,
            mouth: `<line x1="72" y1="108" x2="88" y2="108" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`
        }
    };

    // Selector automático de expresión
    let currentExp = facialExpressions.cute; // Valor por defecto
    
    // Si la carta tiene una expresión definida, la usa. Si no, usa unas por defecto según la forma.
    if (expressionType === "angry") currentExp = facialExpressions.determination;
    else if (expressionType === "surprised") currentExp = facialExpressions.shocked;
    else if (expressionType === "sleepy") currentExp = facialExpressions.sleepy;
    else if (expressionType === "derpy") currentExp = facialExpressions.derpy;
    else if (shape === "hongo") currentExp = facialExpressions.mischievous; // Los hongos premium son pícaros
    else if (shape === "gota") currentExp = facialExpressions.mischievous;  // Conservo la cara que ya tenías en la gota
    
    // Inyección de la Expresión en el SVG
    svgContent += `
        <g class="geno-ojos-parpado">
            ${currentExp.eyes}
        </g>
        <g class="geno-boca">
            ${currentExp.mouth}
        </g>
    `;

    svgContent += `</g>`; // FIN DEL GRUPO RESPIRACIÓN
    svgContent += `</svg>`;
    
    return svgContent;
}