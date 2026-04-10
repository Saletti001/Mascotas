// =========================================
// SVGEngine.js - MOTOR VISUAL HD (SISTEMA 16x16 + GOTAS Y HONGOS PREMIUM)
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
    
    const size = 190; // Tamaño fijo de visualización (pedestal/inventario)
    
    // Contenedor SVG principal con viewBox fijo para coordenadas internas consistentes
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

    // INICIAMOS EL GRUPO DE RESPIRACIÓN (Cuerpo completo)
    svgContent += `<g class="geno-cuerpo">`;

    let pathD = "";
    let shineD = ""; 
    
    // 3. GEOMETRÍA DEL CUERPO (Definición de Formas)
    switch (shape) {
        case "gota": // Gota Premium (base ancha, brillo pequeño)
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
        case "hongo": // Hongo Premium (tallo largo orgánico, brillo pequeño)
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

    // 4. RENDERIZADO DE CAPAS DEL CUERPO (Sistema Sólido Premium)
    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/>`;
    svgContent += `<path d="${pathD}" fill="url(#${gradId})" />`;
    svgContent += `<path d="${shineD}" fill="#ffffff" opacity="0.4" />`;

    // 5. DISTINTIVO DE COMUNIDAD (Logo YouTube Bronce) - Solo para Hongo
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
    // 6. SISTEMA DE RASGOS 16x16 ( Lego de Caras )
    // ==========================================
    
    const dicOjos = {
        // --- EXISTENTES (8) ---
        base: `<circle cx="60" cy="88" r="6" fill="#1a2a36"/><circle cx="100" cy="88" r="6" fill="#1a2a36"/>`,
        pvz_guisante: `<circle cx="55" cy="85" r="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="55" cy="85" r="4" fill="#1a2a36"/><circle cx="105" cy="85" r="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="105" cy="85" r="4" fill="#1a2a36"/>`,
        pvz_nuez: `<circle cx="58" cy="85" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="58" cy="85" r="5" fill="#1a2a36"/><circle cx="102" cy="85" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="102" cy="85" r="5" fill="#1a2a36"/>`,
        picaro: `<path d="M 45 85 C 45 95, 60 95, 60 85 L 60 78 L 45 73 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/><circle cx="55" cy="85" r="4.5" fill="#1a2a36"/><circle cx="53" cy="83" r="1.5" fill="#ffffff"/><path d="M 75 85 C 75 95, 90 95, 90 85 L 90 73 L 75 78 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/><circle cx="80" cy="85" r="4.5" fill="#1a2a36"/><circle cx="78" cy="83" r="1.5" fill="#ffffff"/>`,
        derpy: `<circle cx="56" cy="85" r="9" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="56" cy="85" r="4" fill="#1a2a36"/><circle cx="104" cy="88" r="5" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="104" cy="88" r="2" fill="#1a2a36"/>`,
        enojado_cejas: `<line x1="48" y1="76" x2="67" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><line x1="112" y1="76" x2="93" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="92" r="6" fill="#1a2a36"/><circle cx="100" cy="92" r="6" fill="#1a2a36"/>`,
        sorprendido: `<circle cx="60" cy="88" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="88" r="3.5" fill="#1a2a36"/><circle cx="100" cy="88" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="88" r="3.5" fill="#1a2a36"/>`,
        cansado: `<line x1="51" y1="88" x2="70" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><line x1="109" y1="88" x2="90" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        
        // --- NUEVOS (8) ---
        puntos: `<circle cx="60" cy="88" r="2.5" fill="#1a2a36"/><circle cx="100" cy="88" r="2.5" fill="#1a2a36"/>`,
        feliz_curva: `<path d="M 50 85 Q 60 75 70 85" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 90 85 Q 100 75 110 85" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        ceja_levantada: `<circle cx="60" cy="90" r="5" fill="#1a2a36"/><path d="M 90 75 L 110 75" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="90" r="5" fill="#1a2a36"/>`,
        gafas: `<circle cx="60" cy="88" r="10" fill="none" stroke="#1a2a36" stroke-width="4"/><circle cx="100" cy="88" r="10" fill="none" stroke="#1a2a36" stroke-width="4"/><line x1="70" y1="88" x2="90" y2="88" stroke="#1a2a36" stroke-width="4"/>`,
        ojos_X: `<line x1="52" y1="80" x2="68" y2="96" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><line x1="52" y1="96" x2="68" y2="80" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><line x1="92" y1="80" x2="108" y2="96" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><line x1="92" y1="96" x2="108" y2="80" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        pupila_vertical: `<ellipse cx="60" cy="88" rx="6" ry="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><rect x="58" y="82" width="4" height="12" fill="#1a2a36" rx="2"/><ellipse cx="100" cy="88" rx="6" ry="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><rect x="98" y="82" width="4" height="12" fill="#1a2a36" rx="2"/>`,
        mirada_intens: `<path d="M 48 88 A 12 12 0 0 1 72 88 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="4" fill="#1a2a36"/><path d="M 88 88 A 12 12 0 0 1 112 88 Z" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="4" fill="#1a2a36"/>`,
        cejas_gruesas: `<line x1="45" y1="75" x2="75" y2="75" stroke="#1a2a36" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="90" r="5" fill="#1a2a36"/><line x1="85" y1="75" x2="115" y2="75" stroke="#1a2a36" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="90" r="5" fill="#1a2a36"/>`
    };

    const dicBocas = {
        // --- EXISTENTES (8) ---
        base: `<path d="M 67 108 Q 80 124 93 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        pvz_guisante_boca: `<circle cx="80" cy="110" r="7" fill="#1a2a36"/>`,
        pvz_girasol_boca: `<path d="M 60 102 C 60 125, 100 125, 100 102 Z" fill="#1a2a36"/>`,
        pvz_carnivora_boca: `<path d="M 60 105 L 100 105" fill="none" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><polygon points="65,107 72,108 68,115" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="80,109 87,110 83,117" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="95,107 88,108 92,115" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>`,
        pvz_nuez_boca: `<path d="M 70 110 Q 80 115 90 110" fill="none" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/>`,
        torcida: `<path d="M 65 110 L 95 102" fill="none" stroke="#1a2a36" stroke-width="4.5" stroke-linecap="round"/>`,
        triste: `<path d="M 68 112 Q 80 100 92 112" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        diente_apretad: `<line x1="68" y1="108" x2="92" y2="108" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><rect x="76" y="108" width="8" height="8" fill="#fff" stroke="#1a2a36" stroke-width="2.5"/>`,
        
        // --- NUEVOS (8) ---
        sonrisa_grande: `<path d="M 55 105 Q 80 128 105 105 Z" fill="#fff" stroke="#1a2a36" stroke-width="3"/>`,
        recta_seria: `<line x1="70" y1="110" x2="90" y2="110" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/>`,
        boca_O: `<circle cx="80" cy="110" r="5" fill="none" stroke="#1a2a36" stroke-width="4"/>`,
        grunido_curvo: `<path d="M 65 112 Q 80 105 95 112" fill="none" stroke="#1a2a36" stroke-width="4.5" stroke-linecap="round"/>`,
        lengua_fuera: `<path d="M 70 108 Q 80 118 90 108" fill="none" stroke="#1a2a36" stroke-width="4"/><path d="M 76 110 L 84 110 A 4 5 0 0 1 76 110 Z" fill="#ff6b6b" stroke="#1a2a36" stroke-width="1.5"/>`,
        mueca_cat: `<path d="M 70 108 Q 75 115 80 108 Q 85 115 90 108" fill="none" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/>`,
        bigote_boca: `<path d="M 60 108 Q 70 100 80 108 Q 90 100 100 108" fill="none" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/><line x1="75" y1="112" x2="85" y2="112" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/>`,
        
        // --- CORREGIDO (1) ---
        // Expresión de image_7.png: Los 3 colmillos ahora nacen CORRECTAMENTE de la línea.
        vampiro_3_col: `
            <path d="M 62 108 L 98 108" fill="none" stroke="#1a2a36" stroke-width="4.5" stroke-linecap="round"/>
            <polygon points="68,108 72,116 76,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>
            <polygon points="78,108 82,118 86,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>
            <polygon points="88,108 92,116 96,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>
        `
    };

    // --- ALEATORIEDAD GEN-0 SEGURA ---
    // Extrae los nombres de los rasgos para el sorteo aleatorio
    const nombresOjos = Object.keys(dicOjos);
    const nombresBocas = Object.keys(dicBocas);

    // Sorteo aleatorio si no se especifican genes (comportamiento Gen-0)
    const ojoSeleccionado = safeData.eye_type ? dicOjos[safeData.eye_type] : dicOjos[nombresOjos[Math.floor(Math.random() * nombresOjos.length)]];
    const bocaSeleccionada = safeData.mouth_type ? dicBocas[safeData.mouth_type] : dicBocas[nombresBocas[Math.floor(Math.random() * nombresBocas.length)]];

    // Inyección de los Rasgos en el SVG
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