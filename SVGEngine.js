class SVGEngine {
    static generateGenoSVG(genoData = {}) {
        const size = 100;
        const color = genoData.color || "#77DD77";
        const shape = genoData.shape || "frijol"; 
        
        // SOLUCIÓN AL BUG: Tamaño fijo en píxeles (160x160) en lugar de porcentajes
        let svgContent = `<svg width="160" height="160" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
        
        // 1. DEFINICIÓN DE DEGRADADOS Y SOMBRAS
        svgContent += `
            <defs>
                <linearGradient id="grad-${shape}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${color}; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#000000; stop-opacity:0.3" /> 
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="5" stdDeviation="3" flood-opacity="0.3" />
                </filter>
            </defs>
        `;

        // 2. DEFINICIÓN DE LAS FORMAS BASE
        let pathD = "";
        let shineD = ""; 
        
        switch (shape) {
            case "gota":
                pathD = "M50 10 Q20 50 20 75 A30 30 0 0 0 80 75 Q80 50 50 10 Z";
                shineD = "M40 25 Q28 45 28 65 A20 20 0 0 1 35 30 Z";
                break;
            case "circulo":
                pathD = "M 15 55 A 35 35 0 1 0 85 55 A 35 35 0 1 0 15 55 Z";
                shineD = "M 25 45 A 25 25 0 0 1 55 25 A 30 30 0 0 0 25 60 Z";
                break;
            case "cuadrado":
                pathD = "M 20 30 Q 20 20 30 20 L 70 20 Q 80 20 80 30 L 80 70 Q 80 80 70 80 L 30 80 Q 20 80 20 70 Z";
                shineD = "M 28 30 Q 28 28 35 28 L 60 28 Q 40 40 28 55 Z";
                break;
            case "triangulo":
                pathD = "M 50 15 Q 55 15 60 25 L 85 75 Q 90 85 75 85 L 25 85 Q 10 85 15 75 L 40 25 Q 45 15 50 15 Z";
                shineD = "M 45 30 L 30 65 Q 35 50 50 35 Z";
                break;
            case "hongo":
                svgContent += `<path d="M35 50 L35 80 Q50 95 65 80 L65 50 Z" fill="url(#grad-${shape})" stroke="#1a2a36" stroke-width="4" stroke-linejoin="round"/>`;
                pathD = "M 10 55 Q 50 5 90 55 Q 95 65 85 65 L 15 65 Q 5 65 10 55 Z";
                shineD = "M 20 45 Q 40 20 70 25 Q 40 30 20 55 Z";
                break;
            case "frijol":
            default:
                pathD = "M 35 20 C 10 20, 15 70, 35 85 C 55 100, 85 70, 80 45 C 75 20, 60 20, 35 20 Z";
                shineD = "M 25 40 C 20 55, 25 70, 35 80 C 28 65, 30 45, 45 30 C 35 25, 28 30, 25 40 Z";
                break;
        }

        // 3. DIBUJAR EL CUERPO Y EL BRILLO
        svgContent += `<path d="${pathD}" fill="url(#grad-${shape})" stroke="#1a2a36" stroke-width="4" stroke-linejoin="round" filter="url(#shadow)"/>`;
        svgContent += `<path d="${shineD}" fill="#ffffff" opacity="0.4" />`;

        // 4. DIBUJAR LA CARA (Expresiones)
        const face = genoData.face || "cute";
        
        if (face === "angry") {
            svgContent += `
                <line x1="30" y1="48" x2="42" y2="55" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>
                <line x1="70" y1="48" x2="58" y2="55" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>
                <circle cx="38" cy="58" r="4" fill="#1a2a36"/>
                <circle cx="62" cy="58" r="4" fill="#1a2a36"/>
                <path d="M 40 68 Q 50 75 60 68" fill="none" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>
                <polygon points="42,70 46,70 44,76" fill="#fff" stroke="#1a2a36" stroke-width="1"/>
            `;
        } else if (face === "sleepy") {
            svgContent += `
                <line x1="32" y1="55" x2="44" y2="55" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>
                <line x1="68" y1="55" x2="56" y2="55" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>
                <line x1="45" y1="68" x2="55" y2="68" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>
            `;
        } else if (face === "surprised") {
            svgContent += `
                <circle cx="38" cy="55" r="3" fill="#1a2a36"/>
                <circle cx="62" cy="55" r="3" fill="#1a2a36"/>
                <circle cx="50" cy="70" r="5" fill="#1a2a36"/>
            `;
        } else {
            svgContent += `
                <circle cx="38" cy="55" r="4" fill="#1a2a36"/>
                <circle cx="62" cy="55" r="4" fill="#1a2a36"/>
                <path d="M 42 68 Q 50 78 58 68" fill="none" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>
            `;
        }

        svgContent += `</svg>`;
        return svgContent;
    }
}