// =========================================
// SVGEngine.js - MOTOR VISUAL HD (TAMAÑO INCREMENTADO Y CAPAS SÓLIDAS)
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
    const face = safeData.face || "cute";

    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${shape}-${rnd}`;
    const shadowId = `shadow-${rnd}`;
    const bronzeId = `bronze-${rnd}`;
    
    // --- TAMAÑO INCREMENTADO EN UN 35% ---
    // El tamaño original era 160. 160 * 1.35 = 216.
    // Mantenemos el viewBox en 160x160 para no tener que recalcular todos los trazados,
    // pero el tamaño de renderizado (width/height) se incrementa.
    const size = 216; 
    
    let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // 1. SISTEMA DE VIDA (Animaciones de Respiración y Parpadeo)
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
            .geno-ojos { transform-origin: 80px 85px; animation: parpadear 5s infinite; }
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
            pathD = "M80 16 Q32 80 32 120 A48 48 0 0 0 128 120 Q128 80 80 16 Z";
            shineD = "M64 40 Q45 72 45 104 A32 32 0 0 1 56 48 Z";
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
            // TALLO (Capa Sólida y Capa de Volumen)
            svgContent += `<path d="M64 100 L64 136 Q80 148 96 136 L96 100 Z" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round"/>`;
            svgContent += `<path d="M64 100 L64 136 Q80 148 96 136 L96 100 Z" fill="url(#${gradId})" />`;
            // CÚPULA ANCHA Y RECHONCHA (Estilo Premium)
            pathD = "M 15 90 C 15 20, 145 20, 145 90 C 145 110, 120 115, 80 115 C 40 115, 15 110, 15 90 Z";
            shineD = "M 32 70 C 40 30, 80 35, 110 40 C 70 50, 40 50, 32 70 Z";
            break;
        case "frijol":
        default:
            pathD = "M 56 32 C 16 32, 24 112, 56 136 C 88 160, 136 112, 128 72 C 120 32, 96 32, 56 32 Z";
            shineD = "M 40 64 C 32 88, 40 112, 56 128 C 45 104, 48 72, 72 48 C 56 40, 45 48, 40 64 Z";
            break;
    }

    // 3. RENDERIZADO DE CAPAS DEL CUERPO (Sistema Sólido)
    // Capa Base Sólida (Opaca)
    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/>`;
    // Capa de Volumen (Sombra inferior suave)
    svgContent += `<path d="${pathD}" fill="url(#${gradId})" />`;
    // Capa de Brillo
    svgContent += `<path d="${shineD}" fill="#ffffff" opacity="0.4" />`;

    // 4. DISTINTIVO DE COMUNIDAD (Logo YouTube para el Hongo)
    if (shape === "hongo") {
        svgContent += `
            <g transform="translate(100, 75)">
                <rect x="0" y="0" width="34" height="24" rx="8" fill="url(#${bronzeId})" stroke="#1a2a36" stroke-width="2.5" filter="url(#${shadowId})"/>
                <polygon points="12,6 12,18 24,12" fill="#1a2a36" stroke="#1a2a36" stroke-width="1.5" stroke-linejoin="round"/>
                <polygon points="13,7 13,17 22,12" fill="#ffffff" opacity="0.3"/>
            </g>
        `;
    }

    // 5. CARAS (Con Parpadeo Animado)
    svgContent += `<g class="geno-ojos">`;

    if (shape === "hongo") {
        // CARA DE ALTA FIDELIDAD (Específica del Hongo Premium)
        svgContent += `
            <path d="M 45 85 C 45 95, 60 95, 60 85 L 60 78 L 45 73 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="55" cy="85" r="4.5" fill="#1a2a36"/>
            <circle cx="53" cy="83" r="1.5" fill="#ffffff"/>
            <path d="M 75 85 C 75 95, 90 95, 90 85 L 90 73 L 75 78 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="80" cy="85" r="4.5" fill="#1a2a36"/>
            <circle cx="78" cy="83" r="1.5" fill="#ffffff"/>
        `;
    } else if (face === "angry") {
        svgContent += `
            <line x1="48" y1="76" x2="67" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <line x1="112" y1="76" x2="93" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="92" r="6" fill="#1a2a36"/>
            <circle cx="100" cy="92" r="6" fill="#1a2a36"/>
        `;
    } else if (face === "sleepy") {
        svgContent += `
            <line x1="51" y1="88" x2="70" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <line x1="109" y1="88" x2="90" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
        `;
    } else if (face === "surprised") {
        svgContent += `
            <circle cx="60" cy="88" r="5" fill="#1a2a36"/>
            <circle cx="100" cy="88" r="5" fill="#1a2a36"/>
        `;
    } else { // Cute
        svgContent += `
            <circle cx="60" cy="88" r="6" fill="#1a2a36"/>
            <circle cx="100" cy="88" r="6" fill="#1a2a36"/>
        `;
    }
    
    svgContent += `</g>`; // FIN DEL GRUPO OJOS (Parpadeo)

    // BOCA (Fuera del grupo de ojos)
    if (shape === "hongo") {
        // Sonrisa pícara de lado
        svgContent += `<path d="M 55 98 Q 70 105 85 93" fill="none" stroke="#1a2a36" stroke-width="3.5" stroke-linecap="round"/>`;
    } else if (face === "angry") {
        svgContent += `
            <path d="M 64 108 Q 80 120 96 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <polygon points="67,112 73,112 70,121" fill="#fff" stroke="#1a2a36" stroke-width="2"/>
        `;
    } else if (face === "sleepy") {
        svgContent += `<line x1="72" y1="108" x2="88" y2="108" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`;
    } else if (face === "surprised") {
        svgContent += `<circle cx="80" cy="112" r="8" fill="#1a2a36"/>`;
    } else { // Cute
        svgContent += `<path d="M 67 108 Q 80 124 93 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`;
    }

    svgContent += `</g>`; // FIN DEL GRUPO RESPIRACIÓN
    svgContent += `</svg>`;
    
    return svgContent;
}