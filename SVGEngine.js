// =========================================
// SVGEngine.js - MEGA COLECCIÓN: 18 OJOS y 18 BOCAS (PvZ + CYBER)
// =========================================

function generarSvgGeno(genesVisuales) {
    const safeData = genesVisuales || {};

    if (safeData.isEgg) {
        return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><style>@keyframes huevoFlota { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }.huevo-anim { animation: huevoFlota 3s ease-in-out infinite; }</style><g class="huevo-anim"><ellipse cx="50" cy="55" rx="30" ry="40" fill="#fffacd" stroke="#d4af37" stroke-width="3" stroke-dasharray="4,4"/><text x="50" y="62" font-size="28" text-anchor="middle" font-family="sans-serif">❓</text></g></svg>`;
    }

    const color = safeData.base_color || "#77DD77";
    const shape = safeData.body_shape || "frijol"; 
    const rnd = Math.floor(Math.random() * 100000);
    const gradId = `grad-${shape}-${rnd}`;
    const shadowId = `shadow-${rnd}`;
    const bronzeId = `bronze-${rnd}`;
    const size = 190; 
    
    let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    svgContent += `<style>@keyframes respirar { 0%, 100% { transform: scaleY(1) scaleX(1); } 50% { transform: scaleY(0.97) scaleX(1.02); } }@keyframes parpadear { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.05); } }.geno-cuerpo { transform-origin: 80px 136px; animation: respirar 3.5s ease-in-out infinite; }.geno-ojos-parpado { transform-origin: 80px 85px; animation: parpadear 5s infinite; }</style>`;

    svgContent += `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#000000" stop-opacity="0" /><stop offset="100%" stop-color="#000000" stop-opacity="0.25" /></linearGradient><linearGradient id="${bronzeId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c58f65" /><stop offset="50%" stop-color="#e8cba5" /><stop offset="100%" stop-color="#8b5735" /></linearGradient><filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="4" flood-opacity="0.3" /></filter></defs>`;

    svgContent += `<g class="geno-cuerpo">`;

    let pathD = ""; let shineD = ""; 
    
    switch (shape) {
        case "gota": 
            pathD = "M 80 24 Q 28 80 28 108 A 52 52 0 0 0 132 108 Q 132 80 80 24 Z"; shineD = "M 65 50 Q 55 65 58 80 Q 62 70 70 55 Z"; break;
        case "hongo": 
            const talloOrganico = "M 72 100 C 72 120 60 130 55 135 C 50 148 65 150 80 150 C 95 150 110 148 105 135 C 100 130 88 120 88 100 Z";
            svgContent += `<path d="${talloOrganico}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round"/><path d="${talloOrganico}" fill="url(#${gradId})" />`;
            pathD = "M 15 90 C 15 20, 145 20, 145 90 C 145 110, 120 115, 80 115 C 40 115, 15 110, 15 90 Z"; shineD = "M 35 60 Q 45 38 70 38 Q 50 48 35 60 Z"; break;
        case "circulo": pathD = "M 24 88 A 56 56 0 1 0 136 88 A 56 56 0 1 0 24 88 Z"; shineD = "M 40 72 A 40 40 0 0 1 88 40 A 48 48 0 0 0 40 96 Z"; break;
        case "cuadrado": pathD = "M 32 48 Q 32 32 48 32 L 112 32 Q 128 32 128 48 L 128 112 Q 128 128 112 128 L 48 128 Q 32 128 32 112 Z"; shineD = "M 45 48 Q 45 45 56 45 L 96 45 Q 64 64 45 88 Z"; break;
        case "triangulo": pathD = "M 80 24 Q 88 24 96 40 L 136 120 Q 144 136 120 136 L 40 136 Q 16 136 24 120 L 64 40 Q 72 24 80 24 Z"; shineD = "M 72 48 L 48 104 Q 56 80 80 56 Z"; break;
        default: pathD = "M 56 32 C 16 32, 24 112, 56 136 C 88 160, 136 112, 128 72 C 120 32, 96 32, 56 32 Z"; shineD = "M 42 60 Q 36 75 45 90 Q 42 75 55 55 Z"; break;
    }

    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/><path d="${pathD}" fill="url(#${gradId})" /><path d="${shineD}" fill="#ffffff" opacity="0.4" />`;

    if (shape === "hongo") {
        svgContent += `<g transform="translate(100, 75)"><rect x="0" y="0" width="34" height="24" rx="8" fill="url(#${bronzeId})" stroke="#1a2a36" stroke-width="2.5"/><polygon points="12,6 12,18 24,12" fill="#1a2a36" stroke="#1a2a36" stroke-width="1.5" stroke-linejoin="round"/><polygon points="13,7 13,17 22,12" fill="#ffffff" opacity="0.3"/></g>`;
    }

    // ==========================================
    // 5. MEGA DICCIONARIO: 18 OJOS
    // ==========================================
    const dicOjos = {
        // --- ALEGRES Y PvZ CLÁSICO ---
        base_brillo: `<circle cx="60" cy="85" r="7" fill="#1a2a36"/><circle cx="61.5" cy="83.5" r="2.5" fill="#fff"/><circle cx="100" cy="85" r="7" fill="#1a2a36"/><circle cx="101.5" cy="83.5" r="2.5" fill="#fff"/>`,
        guisante_clasico: `<circle cx="55" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="55" cy="85" r="4.5" fill="#1a2a36"/><circle cx="53" cy="83" r="1.5" fill="#ffffff"/><circle cx="105" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="105" cy="85" r="4.5" fill="#1a2a36"/><circle cx="103" cy="83" r="1.5" fill="#ffffff"/>`,
        nuez_defensa: `<circle cx="58" cy="85" r="8" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="87" r="4.5" fill="#1a2a36"/><circle cx="102" cy="85" r="8" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="86" r="4" fill="#1a2a36"/>`,
        girasol_feliz: `<path d="M 48 85 Q 60 70 72 85" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><circle cx="45" cy="88" r="4" fill="#ff6b6b" opacity="0.5"/><path d="M 88 85 Q 100 70 112 85" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><circle cx="115" cy="88" r="4" fill="#ff6b6b" opacity="0.5"/>`,
        
        // --- AGRESIVOS Y FURIA ---
        feroz_jalapeno: `<line x1="42" y1="78" x2="72" y2="72" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 48 84 A 10 10 0 0 0 68 84 L 68 80 L 48 80 Z" fill="#fff"/><circle cx="58" cy="85" r="4" fill="#1a2a36"/><line x1="88" y1="72" x2="118" y2="78" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 92 84 A 10 10 0 0 0 112 84 L 112 80 L 92 80 Z" fill="#fff"/><circle cx="102" cy="85" r="4" fill="#1a2a36"/>`,
        furia_roja: `<circle cx="58" cy="88" r="10" fill="#ff4d4d" stroke="#1a2a36" stroke-width="3"/><circle cx="58" cy="88" r="4" fill="#1a2a36"/><circle cx="59.5" cy="86.5" r="1.5" fill="#fff"/><line x1="45" y1="70" x2="70" y2="80" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/><circle cx="102" cy="88" r="10" fill="#ff4d4d" stroke="#1a2a36" stroke-width="3"/><circle cx="102" cy="88" r="4" fill="#1a2a36"/><circle cx="103.5" cy="86.5" r="1.5" fill="#fff"/><line x1="115" y1="70" x2="90" y2="80" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/>`,
        amenaza_toxica: `<path d="M 46 80 L 68 76 L 68 84 A 10 10 0 0 1 48 84 Z" fill="#4ade80" stroke="#1a2a36" stroke-width="3"/><ellipse cx="58" cy="85" rx="2" ry="4" fill="#1a2a36"/><line x1="42" y1="78" x2="72" y2="72" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 114 80 L 92 76 L 92 84 A 10 10 0 0 0 112 84 Z" fill="#4ade80" stroke="#1a2a36" stroke-width="3"/><ellipse cx="102" cy="85" rx="2" ry="4" fill="#1a2a36"/><line x1="88" y1="72" x2="118" y2="78" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        berzerker: `<circle cx="58" cy="86" r="11" fill="#fff" stroke="#1a2a36" stroke-width="3"/><path d="M 48 86 Q 53 82 58 86" stroke="#ff4d4d" stroke-width="1.5" fill="none"/><circle cx="58" cy="86" r="2.5" fill="#1a2a36"/><circle cx="102" cy="86" r="11" fill="#fff" stroke="#1a2a36" stroke-width="3"/><path d="M 112 86 Q 107 82 102 86" stroke="#ff4d4d" stroke-width="1.5" fill="none"/><circle cx="102" cy="86" r="2.5" fill="#1a2a36"/>`,

        // --- DERPY Y RAROS ---
        picaro: `<path d="M 45 85 C 45 95, 60 95, 60 85 L 60 78 L 45 73 Z" fill="#fff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/><circle cx="55" cy="85" r="4.5" fill="#1a2a36"/><circle cx="53" cy="83" r="1.5" fill="#fff"/><path d="M 75 85 C 75 95, 90 95, 90 85 L 90 73 L 75 78 Z" fill="#fff" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/><circle cx="80" cy="85" r="4.5" fill="#1a2a36"/><circle cx="78" cy="83" r="1.5" fill="#fff"/>`,
        derpy_bizco: `<circle cx="54" cy="85" r="11" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="58" cy="85" r="3.5" fill="#1a2a36"/><circle cx="106" cy="85" r="7" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="103" cy="85" r="2" fill="#1a2a36"/>`,
        hipnotico_magico: `<circle cx="60" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2.5"/><circle cx="60" cy="85" r="2" fill="#00ffff"/><circle cx="100" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2.5"/><circle cx="100" cy="85" r="2" fill="#00ffff"/>`,
        cansado_ojeras: `<path d="M 48 85 A 10 10 0 0 0 68 85 Z" fill="#fff" stroke="#1a2a36" stroke-width="3"/><line x1="45" y1="85" x2="71" y2="85" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><path d="M 48 88 Q 58 98 68 88" fill="none" stroke="#8a2be2" stroke-width="2" opacity="0.5"/><path d="M 92 85 A 10 10 0 0 0 112 85 Z" fill="#fff" stroke="#1a2a36" stroke-width="3"/><line x1="89" y1="85" x2="115" y2="85" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><path d="M 92 88 Q 102 98 112 88" fill="none" stroke="#8a2be2" stroke-width="2" opacity="0.5"/>`,

        // --- CYBER, ROBÓTICA Y ESPECIALES ---
        cyber_visor: `<rect x="40" y="78" width="80" height="16" rx="6" fill="#1a2a36" stroke="#1a2a36" stroke-width="2"/><rect x="43" y="81" width="74" height="10" rx="3" fill="#00ffff" opacity="0.8"/><circle cx="60" cy="86" r="2" fill="#fff"/><circle cx="100" cy="86" r="2" fill="#fff"/>`,
        robot_ojo_rojo: `<circle cx="60" cy="85" r="9" fill="#1a2a36" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="4" fill="#ff0000"/><circle cx="60" cy="85" r="1.5" fill="#fff"/><circle cx="100" cy="85" r="9" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="4" fill="#1a2a36"/>`,
        monoculo_tactico: `<circle cx="60" cy="85" r="12" fill="url(#${bronzeId})" stroke="#d4af37" stroke-width="4"/><line x1="60" y1="73" x2="60" y2="60" stroke="#d4af37" stroke-width="2"/><circle cx="60" cy="85" r="3" fill="#ff4d4d"/><circle cx="100" cy="85" r="7" fill="#1a2a36"/><circle cx="101.5" cy="83.5" r="2.5" fill="#fff"/>`,
        foco_luminoso: `<circle cx="60" cy="85" r="12" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="7" fill="#fffc00"/><circle cx="61.5" cy="83.5" r="2" fill="#fff"/><circle cx="100" cy="85" r="12" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="7" fill="#fffc00"/><circle cx="101.5" cy="83.5" r="2" fill="#fff"/>`,
        ninja_sombra: `<rect x="30" y="75" width="100" height="22" fill="#1a2a36" rx="5"/><ellipse cx="60" cy="86" rx="5" ry="3" fill="#fff"/><ellipse cx="100" cy="86" rx="5" ry="3" fill="#fff"/>`,
        felino_cazador: `<ellipse cx="60" cy="85" rx="8" ry="11" fill="#fdfd96" stroke="#1a2a36" stroke-width="3"/><rect x="58.5" y="78" width="3" height="14" fill="#1a2a36" rx="1.5"/><circle cx="60" cy="81" r="1.5" fill="#fff"/><ellipse cx="100" cy="85" rx="8" ry="11" fill="#fdfd96" stroke="#1a2a36" stroke-width="3"/><rect x="98.5" y="78" width="3" height="14" fill="#1a2a36" rx="1.5"/><circle cx="100" cy="81" r="1.5" fill="#fff"/>`
    };

    // ==========================================
    // 6. MEGA DICCIONARIO: 18 BOCAS
    // ==========================================
    const dicBocas = {
        // --- ALEGRES Y PvZ CLÁSICO ---
        sonrisa_base: `<path d="M 67 108 Q 80 124 93 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><circle cx="64" cy="106" r="2" fill="#1a2a36" opacity="0.3"/><circle cx="96" cy="106" r="2" fill="#1a2a36" opacity="0.3"/>`,
        abierta_feliz: `<path d="M 62 102 C 62 125, 98 125, 98 102 Z" fill="#1a2a36" stroke="#1a2a36" stroke-width="3"/><path d="M 70 112 C 70 122, 90 122, 90 112 Z" fill="#ff6b6b"/>`,
        risita_gato: `<path d="M 70 108 Q 75 115 80 108 Q 85 115 90 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        canon_guisante: `<ellipse cx="80" cy="110" rx="11" ry="11" fill="#1a2a36" stroke="#1a2a36" stroke-width="2"/><ellipse cx="80" cy="110" rx="7" ry="7" fill="#000"/>`,

        // --- AGRESIVAS Y FURIA ---
        depredador_carnivora: `<path d="M 52 105 Q 80 118 108 105" fill="none" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/><polygon points="60,105 65,116 70,107" fill="#fff" stroke="#1a2a36" stroke-width="2"/><polygon points="75,108 80,119 85,109" fill="#fff" stroke="#1a2a36" stroke-width="2"/><polygon points="90,107 95,116 100,105" fill="#fff" stroke="#1a2a36" stroke-width="2"/>`,
        grunido_colmillos: `<path d="M 60 102 Q 80 115 100 102 Z" fill="#1a2a36"/><polygon points="65,103 70,113 75,104" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="95,103 90,113 85,104" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><path d="M 75 108 Q 80 104 85 108" fill="none" stroke="#ff6b6b" stroke-width="2"/>`,
        apretado_furia: `<rect x="65" y="105" width="30" height="12" rx="3" fill="#fff" stroke="#1a2a36" stroke-width="3"/><line x1="65" y1="111" x2="95" y2="111" stroke="#1a2a36" stroke-width="2"/><line x1="75" y1="105" x2="75" y2="117" stroke="#1a2a36" stroke-width="2"/><line x1="85" y1="105" x2="85" y2="117" stroke="#1a2a36" stroke-width="2"/><path d="M 60 102 L 65 105 L 60 108" fill="none" stroke="#1a2a36" stroke-width="2"/><path d="M 100 102 L 95 105 L 100 108" fill="none" stroke="#1a2a36" stroke-width="2"/>`,
        grito_batalla: `<path d="M 60 105 L 100 105 L 90 120 L 70 120 Z" fill="#1a2a36" stroke="#1a2a36" stroke-width="3"/><polygon points="62,106 66,112 68,106" fill="#fff"/><polygon points="98,106 94,112 92,106" fill="#fff"/><path d="M 70 118 Q 80 112 90 118 Z" fill="#ff6b6b"/>`,

        // --- DERPY Y RARAS ---
        derpy_lengua: `<path d="M 65 108 Q 80 115 95 108" fill="none" stroke="#1a2a36" stroke-width="4.5" stroke-linecap="round"/><path d="M 82 111 L 90 111 Q 90 120 86 120 Q 82 120 82 111 Z" fill="#ff6b6b" stroke="#1a2a36" stroke-width="2"/>`,
        diente_solitario: `<path d="M 65 108 Q 80 118 95 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><rect x="76" y="108" width="8" height="9" fill="#fff" stroke="#1a2a36" stroke-width="2.5" rx="1"/>`,
        boca_O_sorpresa: `<ellipse cx="80" cy="112" rx="6" ry="8" fill="none" stroke="#1a2a36" stroke-width="4.5"/>`,
        trompa_hielo: `<circle cx="80" cy="110" r="8" fill="#e0f7fa" stroke="#1a2a36" stroke-width="3"/><circle cx="80" cy="110" r="3" fill="#1a2a36"/>`,

        // --- CYBER Y ESPECIALES ---
        rejilla_robot: `<rect x="65" y="105" width="30" height="10" rx="2" fill="#333" stroke="#1a2a36" stroke-width="3"/><line x1="70" y1="105" x2="70" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="75" y1="105" x2="75" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="80" y1="105" x2="80" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="85" y1="105" x2="85" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="90" y1="105" x2="90" y2="115" stroke="#00ffff" stroke-width="1.5"/>`,
        mandibula_mecha: `<path d="M 60 106 L 100 106 L 95 116 L 65 116 Z" fill="#1a2a36" stroke="#1a2a36" stroke-width="2"/><line x1="65" y1="111" x2="95" y2="111" stroke="#00ffff" stroke-width="2"/>`,
        vampiro_noble: `<path d="M 62 108 L 98 108" fill="none" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><polygon points="70,108 73,116 76,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="84,108 87,116 90,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>`,
        barba_ruda: `<path d="M 60 105 Q 80 128 100 105" fill="#1a2a36" opacity="0.3"/><line x1="68" y1="110" x2="92" y2="110" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/>`,
        torcida_esceptico: `<path d="M 65 113 L 95 105" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        triste_puchero: `<path d="M 68 114 Q 80 104 92 114" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 94 108 Q 96 114 94 116 Q 92 114 94 108" fill="#00ffff" opacity="0.8"/>`
    };

    // --- SORTEO ALEATORIO GEN-0 ---
    const nombresOjos = Object.keys(dicOjos);
    const nombresBocas = Object.keys(dicBocas);
    const ojoSeleccionado = safeData.eye_type ? dicOjos[safeData.eye_type] : dicOjos[nombresOjos[Math.floor(Math.random() * nombresOjos.length)]];
    const bocaSeleccionada = safeData.mouth_type ? dicBocas[safeData.mouth_type] : dicBocas[nombresBocas[Math.floor(Math.random() * nombresBocas.length)]];

    // INYECCIÓN AL SVG
    svgContent += `
        <g class="geno-ojos-parpado">
            ${ojoSeleccionado}
        </g>
        <g class="geno-boca">
            ${bocaSeleccionada}
        </g>
    `;

    svgContent += `</g></svg>`;
    
    return svgContent;
}