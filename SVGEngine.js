// =========================================
// SVGEngine.js - MOTOR VISUAL HD (CAPAS SÓLIDAS)
// =========================================

function generarSvgGeno(genesVisuales) {
    const safeData = genesVisuales || {};

    if (safeData.isEgg) {
        return `
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
                <ellipse cx="50" cy="55" rx="30" ry="40" fill="#fffacd" stroke="#d4af37" stroke-width="3" stroke-dasharray="4,4"/>
                <text x="50" y="62" font-size="28" text-anchor="middle" font-family="sans-serif">❓</text>
            </svg>
        `;
    }

    const color = safeData.base_color || "#77DD77";
    const shape = safeData.body_shape || "frijol"; 
    const face = safeData.face || "cute";

    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${shape}-${rnd}`;
    const shadowId = `shadow-${rnd}`;
    const size = 160; 
    
    let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // DEGRADADO CORREGIDO: Va de "Totalmente Transparente" a "Negro Suave"
    svgContent += `
        <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#000000" stop-opacity="0" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0.25" /> 
            </linearGradient>
            <filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="4" flood-opacity="0.3" />
            </filter>
        </defs>
    `;

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
            // Tallo con Capas: Primero el color sólido, luego el degradado
            svgContent += `<path d="M64 100 L64 136 Q80 146 96 136 L96 100 Z" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round"/>`;
            svgContent += `<path d="M64 100 L64 136 Q80 146 96 136 L96 100 Z" fill="url(#${gradId})" />`;
            
            // Sombrero
            pathD = "M 20 100 Q 80 20 140 100 Q 148 110 130 110 L 30 110 Q 12 110 20 100 Z";
            shineD = "M 36 80 Q 60 40 108 50 Q 64 60 36 90 Z";
            break;
        case "frijol":
        default:
            pathD = "M 56 32 C 16 32, 24 112, 56 136 C 88 160, 136 112, 128 72 C 120 32, 96 32, 56 32 Z";
            shineD = "M 40 64 C 32 88, 40 112, 56 128 C 45 104, 48 72, 72 48 C 56 40, 45 48, 40 64 Z";
            break;
    }

    // 1. CAPA BASE SÓLIDA (Asegura que el color sea 100% vibrante y opaco)
    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/>`;
    
    // 2. CAPA DE VOLUMEN (Solo agrega la sombra oscura inferior)
    svgContent += `<path d="${pathD}" fill="url(#${gradId})" />`;
    
    // 3. CAPA DE BRILLO
    svgContent += `<path d="${shineD}" fill="#ffffff" opacity="0.3" />`;

    // CARAS
    if (face === "angry") {
        svgContent += `
            <line x1="48" y1="76" x2="67" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <line x1="112" y1="76" x2="93" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <circle cx="60" cy="92" r="6" fill="#1a2a36"/>
            <circle cx="100" cy="92" r="6" fill="#1a2a36"/>
            <path d="M 64 108 Q 80 120 96 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <polygon points="67,112 73,112 70,121" fill="#fff" stroke="#1a2a36" stroke-width="2"/>
        `;
    } else if (face === "sleepy") {
        svgContent += `
            <line x1="51" y1="88" x2="70" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <line x1="109" y1="88" x2="90" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
            <line x1="72" y1="108" x2="88" y2="108" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
        `;
    } else if (face === "surprised") {
        svgContent += `
            <circle cx="60" cy="88" r="5" fill="#1a2a36"/>
            <circle cx="100" cy="88" r="5" fill="#1a2a36"/>
            <circle cx="80" cy="112" r="8" fill="#1a2a36"/>
        `;
    } else {
        svgContent += `
            <circle cx="60" cy="88" r="6" fill="#1a2a36"/>
            <circle cx="100" cy="88" r="6" fill="#1a2a36"/>
            <path d="M 67 108 Q 80 124 93 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>
        `;
    }

    svgContent += `</svg>`;
    return svgContent;
}