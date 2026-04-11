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
    
    svgContent += `
        <style>
            @keyframes respirar { 0%, 100% { transform: scaleY(1) scaleX(1); } 50% { transform: scaleY(0.97) scaleX(1.02); } }
            @keyframes parpadear { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.05); } }
            
            /* NUEVAS ANIMACIONES DE BOCA */
            @keyframes hablar { 
                0%, 100% { transform: scaleY(1) translateY(0); } 
                50% { transform: scaleY(1.3) translateY(2px); } 
            }
            @keyframes rugir { 
                0%, 100% { transform: scale(1) translateX(0); } 
                25% { transform: scale(1.05) translateX(-1px); }
                75% { transform: scale(1.05) translateX(1px); }
            }

            .geno-cuerpo { transform-origin: 80px 136px; animation: respirar 3.5s ease-in-out infinite; }
            .geno-ojos-parpado { transform-origin: 80px 85px; animation: parpadear 5s infinite; }
            
            /* El transform-origin (80px 110px) es el centro exacto de donde suelen estar las bocas */
            .geno-boca { transform-origin: 80px 110px; }
            
            /* Clases que activan las animaciones */
            .boca-hablando { animation: hablar 0.2s infinite; }
            .boca-rugiendo { animation: rugir 0.1s infinite; }
        </style>
    `;

    svgContent += `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#000000" stop-opacity="0" /><stop offset="100%" stop-color="#000000" stop-opacity="0.25" /></linearGradient><linearGradient id="${bronzeId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c58f65" /><stop offset="50%" stop-color="#e8cba5" /><stop offset="100%" stop-color="#8b5735" /></linearGradient><filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="4" flood-opacity="0.3" /></filter></defs>`;

    svgContent += `<g class="geno-cuerpo">`;

    let pathD = ""; let shineD = ""; 
    
    switch (shape) {
        case "gota": 
            pathD = "M 80 24 Q 28 80 28 108 A 52 52 0 0 0 132 108 Q 132 80 80 24 Z"; shineD = "M 65 50 Q 55 65 58 80 Q 62 70 70 55 Z"; break;
        case "hongo": 
            const talloOrganico = "M 72 100 C 72 120 60 130 55 135 C 50 148 65 150 80 150 C 95 150 110 148 105 135 C 100 130 88 120 88 100 Z";
            svgContent += `<path d="${talloOrganico}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round"/><path d="${talloOrganico}" fill="url(#${gradId})" />`;
            pathD = "M 15 90 C 15 20, 145 20, 145 90 C 145 110, 120 115, 80 115 C 40 115, 15 110, 15 90 Z"; 
            // Reflejo ajustado (más pequeño y alejado del borde)
            shineD = "M 40 55 Q 50 40 70 40 Q 55 48 40 55 Z"; 
            break;
        case "circulo": pathD = "M 24 88 A 56 56 0 1 0 136 88 A 56 56 0 1 0 24 88 Z"; shineD = "M 40 72 A 40 40 0 0 1 88 40 A 48 48 0 0 0 40 96 Z"; break;
        case "cuadrado": pathD = "M 32 48 Q 32 32 48 32 L 112 32 Q 128 32 128 48 L 128 112 Q 128 128 112 128 L 48 128 Q 32 128 32 112 Z"; shineD = "M 45 48 Q 45 45 56 45 L 96 45 Q 64 64 45 88 Z"; break;
        case "triangulo": pathD = "M 80 24 Q 88 24 96 40 L 136 120 Q 144 136 120 136 L 40 136 Q 16 136 24 120 L 64 40 Q 72 24 80 24 Z"; shineD = "M 72 48 L 48 104 Q 56 80 80 56 Z"; break;
        default: 
            // Forma de Frijol Premium (más suave, orgánica y redondita)
            pathD = "M 65 25 C 110 20, 135 50, 135 85 C 135 125, 105 145, 75 145 C 35 145, 25 115, 35 75 C 40 50, 35 30, 65 25 Z"; 
            shineD = "M 45 48 Q 60 38 75 40 Q 55 52 50 75 Q 40 60 45 48 Z"; 
            break;
    }

    svgContent += `<path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${shadowId})"/><path d="${pathD}" fill="url(#${gradId})" /><path d="${shineD}" fill="#ffffff" opacity="0.4" />`;

    if (shape === "hongo") {
        // Manchas orgánicas de hongo (reemplaza el antiguo logo de YT)
        svgContent += `
            <g fill="#d5d0a9" opacity="0.6">
                <circle cx="35" cy="85" r="6" />
                <ellipse cx="48" cy="65" rx="8" ry="5" transform="rotate(-20 48 65)" />
                <ellipse cx="115" cy="45" rx="12" ry="8" transform="rotate(15 115 45)" />
                <circle cx="130" cy="70" r="5" />
                <ellipse cx="118" cy="90" rx="7" ry="4" transform="rotate(-10 118 90)" />
                <circle cx="95" cy="30" r="5" />
            </g>
        `;
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

feliz_curva: `<path d="M 50 85 Q 60 75 70 85" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 90 85 Q 100 75 110 85" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        
        // --- AGRESIVOS Y FURIA ---
feroz_jalapeno: `<line x1="42" y1="78" x2="72" y2="72" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 48 84 A 10 10 0 0 0 68 84 L 68 80 L 48 80 Z" fill="#fff"/><circle cx="58" cy="85" r="4" fill="#1a2a36"/><line x1="88" y1="72" x2="118" y2="78" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 92 84 A 10 10 0 0 0 112 84 L 112 80 L 92 80 Z" fill="#fff"/><circle cx="102" cy="85" r="4" fill="#1a2a36"/>`,

furia_roja: `<circle cx="58" cy="88" r="10" fill="#ff4d4d" stroke="#1a2a36" stroke-width="3"/><circle cx="58" cy="88" r="4" fill="#1a2a36"/><circle cx="59.5" cy="86.5" r="1.5" fill="#fff"/><line x1="45" y1="70" x2="70" y2="80" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/><circle cx="102" cy="88" r="10" fill="#ff4d4d" stroke="#1a2a36" stroke-width="3"/><circle cx="102" cy="88" r="4" fill="#1a2a36"/><circle cx="103.5" cy="86.5" r="1.5" fill="#fff"/><line x1="115" y1="70" x2="90" y2="80" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/>`,

amenaza_toxica: `<path d="M 46 80 L 68 76 L 68 84 A 10 10 0 0 1 48 84 Z" fill="#4ade80" stroke="#1a2a36" stroke-width="3"/><ellipse cx="58" cy="85" rx="2" ry="4" fill="#1a2a36"/><line x1="42" y1="78" x2="72" y2="72" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 114 80 L 92 76 L 92 84 A 10 10 0 0 0 112 84 Z" fill="#4ade80" stroke="#1a2a36" stroke-width="3"/><ellipse cx="102" cy="85" rx="2" ry="4" fill="#1a2a36"/><line x1="88" y1="72" x2="118" y2="78" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,

berzerker: `<circle cx="58" cy="86" r="11" fill="#fff" stroke="#1a2a36" stroke-width="3"/><path d="M 48 86 Q 53 82 58 86" stroke="#ff4d4d" stroke-width="1.5" fill="none"/><circle cx="58" cy="86" r="2.5" fill="#1a2a36"/><circle cx="102" cy="86" r="11" fill="#fff" stroke="#1a2a36" stroke-width="3"/><path d="M 112 86 Q 107 82 102 86" stroke="#ff4d4d" stroke-width="1.5" fill="none"/><circle cx="102" cy="86" r="2.5" fill="#1a2a36"/>`,

furia_cejas_premium: `<line x1="45" y1="75" x2="75" y2="75" stroke="#1a2a36" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="90" r="5" fill="#1a2a36"/><line x1="85" y1="75" x2="115" y2="75" stroke="#1a2a36" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="90" r="5" fill="#1a2a36"/><circle cx="61.5" cy="88.5" r="1.5" fill="#fff"/><circle cx="101.5" cy="88.5" r="1.5" fill="#fff"/>`,

furia_ceno_premium: `<path d="M 42 78 L 72 72 L 72 82 A 10 10 0 0 1 48 82 Z" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="58" cy="85" r="4" fill="#ff4d4d"/><path d="M 118 78 L 88 72 L 88 82 A 10 10 0 0 0 112 82 Z" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="102" cy="85" r="4" fill="#ff4d4d"/><circle cx="59.5" cy="83.5" r="1.5" fill="#fff"/><circle cx="100.5" cy="83.5" r="1.5" fill="#fff"/>`,

rabia_dilatada_premium: `<circle cx="60" cy="85" r="12" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="9" fill="#1a2a36"/><circle cx="100" cy="85" r="12" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="9" fill="#1a2a36"/><circle cx="61.5" cy="83.5" r="2.5" fill="#fff"/><circle cx="101.5" cy="83.5" r="2.5" fill="#fff"/>`,

feroz: `<line x1="42" y1="78" x2="72" y2="72" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 48 84 A 10 10 0 0 0 68 84 L 68 80 L 48 80 Z" fill="#fff"/><circle cx="58" cy="85" r="4" fill="#1a2a36"/><line x1="88" y1="72" x2="118" y2="78" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><path d="M 92 84 A 10 10 0 0 0 112 84 L 112 80 L 92 80 Z" fill="#fff"/><circle cx="102" cy="85" r="4" fill="#1a2a36"/>`,

        // --- DERPY Y RAROS ---

derpy_bizco: `<circle cx="54" cy="85" r="11" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="58" cy="85" r="3.5" fill="#1a2a36"/><circle cx="106" cy="85" r="7" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="103" cy="85" r="2" fill="#1a2a36"/>`,

hipnotico_magico: `<circle cx="60" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2.5"/><circle cx="60" cy="85" r="2" fill="#00ffff"/><circle cx="100" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2.5"/><circle cx="100" cy="85" r="2" fill="#00ffff"/>`,

hipnotico: `<circle cx="60" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2"/><circle cx="100" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="6" fill="none" stroke="#e834eb" stroke-width="2"/>`,

cansado_ojeras: `<path d="M 48 85 A 10 10 0 0 0 68 85 Z" fill="#fff" stroke="#1a2a36" stroke-width="3"/><line x1="45" y1="85" x2="71" y2="85" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><path d="M 48 88 Q 58 98 68 88" fill="none" stroke="#8a2be2" stroke-width="2" opacity="0.5"/><path d="M 92 85 A 10 10 0 0 0 112 85 Z" fill="#fff" stroke="#1a2a36" stroke-width="3"/><line x1="89" y1="85" x2="115" y2="85" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><path d="M 92 88 Q 102 98 112 88" fill="none" stroke="#8a2be2" stroke-width="2" opacity="0.5"/>`,

derpy: `<circle cx="56" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="56" cy="85" r="4" fill="#1a2a36"/><circle cx="104" cy="88" r="6" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="104" cy="88" r="2.5" fill="#1a2a36"/>`,

cicatriz: `<line x1="48" y1="88" x2="72" y2="88" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/><line x1="52" y1="82" x2="68" y2="94" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><circle cx="102" cy="85" r="9" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="102" cy="85" r="4" fill="#1a2a36"/><line x1="85" y1="72" x2="115" y2="80" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,

sorprendido: `<circle cx="60" cy="88" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="88" r="3.5" fill="#1a2a36"/><circle cx="100" cy="88" r="8" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="88" r="3.5" fill="#1a2a36"/>`,

cansado: `<line x1="51" y1="88" x2="70" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><line x1="109" y1="88" x2="90" y2="88" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,

puntos: `<circle cx="60" cy="88" r="2.5" fill="#1a2a36"/><circle cx="100" cy="88" r="2.5" fill="#1a2a36"/>`,

ceja_levantada: `<circle cx="60" cy="90" r="5" fill="#1a2a36"/><path d="M 90 75 L 110 75" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="90" r="5" fill="#1a2a36"/>`,

pupila_vertical: `<ellipse cx="60" cy="88" rx="6" ry="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><rect x="58" y="82" width="4" height="12" fill="#1a2a36" rx="2"/><ellipse cx="100" cy="88" rx="6" ry="10" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><rect x="98" y="82" width="4" height="12" fill="#1a2a36" rx="2"/>`,

gafas: `<circle cx="60" cy="85" r="12" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="4" fill="#1a2a36"/><circle cx="100" cy="85" r="12" fill="#ffffff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="4" fill="#1a2a36"/><line x1="72" y1="85" x2="88" y2="85" stroke="#1a2a36" stroke-width="3"/>`,


// --- CYBER, ROBÓTICA Y ESPECIALES ---
cyber_visor: `<rect x="40" y="78" width="80" height="16" rx="6" fill="#1a2a36" stroke="#1a2a36" stroke-width="2"/><rect x="43" y="81" width="74" height="10" rx="3" fill="#00ffff" opacity="0.8"/><circle cx="60" cy="86" r="2" fill="#fff"/><circle cx="100" cy="86" r="2" fill="#fff"/>`,

robot_ojo_rojo: `<circle cx="60" cy="85" r="9" fill="#1a2a36" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="4" fill="#ff0000"/><circle cx="60" cy="85" r="1.5" fill="#fff"/><circle cx="100" cy="85" r="9" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="4" fill="#1a2a36"/>`,

monoculo_tactico: `<circle cx="60" cy="85" r="12" fill="url(#${bronzeId})" stroke="#d4af37" stroke-width="4"/><line x1="60" y1="73" x2="60" y2="60" stroke="#d4af37" stroke-width="2"/><circle cx="60" cy="85" r="3" fill="#ff4d4d"/><circle cx="100" cy="85" r="7" fill="#1a2a36"/><circle cx="101.5" cy="83.5" r="2.5" fill="#fff"/>`,

foco_luminoso: `<circle cx="60" cy="85" r="12" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="7" fill="#fffc00"/><circle cx="61.5" cy="83.5" r="2" fill="#fff"/><circle cx="100" cy="85" r="12" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="7" fill="#fffc00"/><circle cx="101.5" cy="83.5" r="2" fill="#fff"/>`,

foco: `<circle cx="60" cy="85" r="12" fill="#fdfd96" stroke="#d4af37" stroke-width="3"/><rect x="58" y="75" width="4" height="14" fill="#fff" rx="2"/><circle cx="100" cy="85" r="12" fill="#fdfd96" stroke="#d4af37" stroke-width="3"/><rect x="98" y="75" width="4" height="14" fill="#fff" rx="2"/>`,

ninja_sombra: `<rect x="30" y="75" width="100" height="22" fill="#1a2a36" rx="5"/><ellipse cx="60" cy="86" rx="5" ry="3" fill="#fff"/><ellipse cx="100" cy="86" rx="5" ry="3" fill="#fff"/>`,

ninja: `<rect x="25" y="75" width="110" height="20" fill="#1a2a36" rx="5"/><circle cx="60" cy="85" r="6" fill="#fff"/><circle cx="60" cy="85" r="3" fill="#1a2a36"/><circle cx="100" cy="85" r="6" fill="#fff"/><circle cx="100" cy="85" r="3" fill="#1a2a36"/>`,
        
felino_cazador: `<ellipse cx="60" cy="85" rx="8" ry="11" fill="#fdfd96" stroke="#1a2a36" stroke-width="3"/><rect x="58.5" y="78" width="3" height="14" fill="#1a2a36" rx="1.5"/><circle cx="60" cy="81" r="1.5" fill="#fff"/><ellipse cx="100" cy="85" rx="8" ry="11" fill="#fdfd96" stroke="#1a2a36" stroke-width="3"/><rect x="98.5" y="78" width="3" height="14" fill="#1a2a36" rx="1.5"/><circle cx="100" cy="81" r="1.5" fill="#fff"/>`,

felino: `<ellipse cx="60" cy="85" rx="8" ry="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><rect x="59" y="80" width="2" height="10" fill="#1a2a36"/><ellipse cx="100" cy="85" rx="8" ry="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><rect x="99" y="80" width="2" height="10" fill="#1a2a36"/>`,


// --- OJOS CYBER Y TÓXICOS ---

        // 32. Escáner de objetivo láser (Cyber/Militar)
        target_escaner: `<circle cx="60" cy="85" r="12" fill="none" stroke="#ef4444" stroke-width="2.5"/><line x1="60" y1="68" x2="60" y2="102" stroke="#ef4444" stroke-width="2"/><line x1="43" y1="85" x2="77" y2="85" stroke="#ef4444" stroke-width="2"/><circle cx="60" cy="85" r="3.5" fill="#ef4444"/><circle cx="100" cy="85" r="12" fill="none" stroke="#ef4444" stroke-width="2.5"/><line x1="100" y1="68" x2="100" y2="102" stroke="#ef4444" stroke-width="2"/><line x1="83" y1="85" x2="117" y2="85" stroke="#ef4444" stroke-width="2"/><circle cx="100" cy="85" r="3.5" fill="#ef4444"/>`,

        // 33. Visor blindado de combate (Serio/Industrial)
        visor_blindado: `<rect x="40" y="75" width="80" height="20" rx="4" fill="#334155" stroke="#0f172a" stroke-width="3"/><rect x="44" y="82" width="72" height="6" rx="2" fill="#22d3ee" opacity="0.9"/><line x1="45" y1="85" x2="115" y2="85" stroke="#fff" stroke-width="1.5" opacity="0.8"/>`,

        // 34. Ojos tóxicos derretidos (Radiactivo/Mutante)
        toxico_derretido: `<path d="M 50 85 C 50 70, 70 70, 70 85 C 70 95, 65 105, 60 105 C 55 105, 50 95, 50 85 Z" fill="#a3e635" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="87" r="3.5" fill="#1a2a36"/><path d="M 90 85 C 90 70, 110 70, 110 85 C 110 100, 105 95, 100 105 C 95 100, 90 95, 90 85 Z" fill="#a3e635" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="87" r="3.5" fill="#1a2a36"/><circle cx="62" cy="112" r="2" fill="#a3e635"/><circle cx="98" cy="112" r="2" fill="#a3e635"/>`,

        // 35. Mutación biológica asimétrica (Tétrico/Raro)
        mutacion_asimetrica: `<circle cx="55" cy="85" r="16" fill="#fff" stroke="#1a2a36" stroke-width="3"/><path d="M 43 76 Q 48 85 45 92" stroke="#ef4444" stroke-width="1.5" fill="none"/><path d="M 67 76 Q 62 85 65 92" stroke="#ef4444" stroke-width="1.5" fill="none"/><circle cx="55" cy="85" r="5" fill="#1a2a36"/><circle cx="56.5" cy="83.5" r="2" fill="#fff"/><circle cx="105" cy="85" r="6" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="105" cy="85" r="2" fill="#1a2a36"/>`,

        // 36. Anillos nucleares (Radiactivo)
        anillos_nucleares: `<circle cx="60" cy="85" r="12" fill="#1e293b" stroke="#eab308" stroke-width="3"/><circle cx="60" cy="85" r="7" fill="none" stroke="#eab308" stroke-width="2" stroke-dasharray="4 2"/><circle cx="60" cy="85" r="3" fill="#eab308"/><circle cx="100" cy="85" r="12" fill="#1e293b" stroke="#eab308" stroke-width="3"/><circle cx="100" cy="85" r="7" fill="none" stroke="#eab308" stroke-width="2" stroke-dasharray="4 2"/><circle cx="100" cy="85" r="3" fill="#eab308"/>`,

        // 37. Glitch digital roto (Cyber/Anomalía)
        glitch_digital: `<rect x="48" y="78" width="24" height="4" fill="#06b6d4"/><rect x="52" y="84" width="20" height="4" fill="#ef4444"/><rect x="46" y="90" width="26" height="4" fill="#06b6d4"/><rect x="88" y="78" width="24" height="4" fill="#ef4444"/><rect x="92" y="84" width="20" height="4" fill="#06b6d4"/><rect x="86" y="90" width="26" height="4" fill="#ef4444"/>`,

        // 38. Óptica hexagonal de dron (Tecno-orgánico)
        hex_optico: `<polygon points="60,73 70,79 70,91 60,97 50,91 50,79" fill="#0f172a" stroke="#a855f7" stroke-width="3"/><circle cx="60" cy="85" r="3" fill="#a855f7" filter="drop-shadow(0 0 3px #d8b4fe)"/><polygon points="100,73 110,79 110,91 100,97 90,91 90,79" fill="#0f172a" stroke="#a855f7" stroke-width="3"/><circle cx="100" cy="85" r="3" fill="#a855f7" filter="drop-shadow(0 0 3px #d8b4fe)"/>`,

        // 39. Ojos cosidos emitiendo luz (Horror/Mutante)
        ojos_cosidos: `<ellipse cx="60" cy="85" rx="12" ry="5" fill="#4ade80" opacity="0.6" filter="blur(2px)"/><path d="M 45 85 Q 60 92 75 85" fill="none" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="80" x2="52" y2="90" stroke="#1a2a36" stroke-width="2"/><line x1="60" y1="81" x2="58" y2="92" stroke="#1a2a36" stroke-width="2"/><line x1="70" y1="80" x2="72" y2="90" stroke="#1a2a36" stroke-width="2"/><ellipse cx="100" cy="85" rx="12" ry="5" fill="#4ade80" opacity="0.6" filter="blur(2px)"/><path d="M 85 85 Q 100 92 115 85" fill="none" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><line x1="90" y1="80" x2="92" y2="90" stroke="#1a2a36" stroke-width="2"/><line x1="100" y1="81" x2="98" y2="92" stroke="#1a2a36" stroke-width="2"/><line x1="110" y1="80" x2="112" y2="90" stroke="#1a2a36" stroke-width="2"/>`,

        // 40. Mirada de vacío oscuro (Serio/Anomalía)
        vacio_oscuro: `<circle cx="60" cy="85" r="12" fill="#020617" stroke="#1a2a36" stroke-width="2"/><circle cx="60" cy="85" r="2" fill="#eab308" filter="drop-shadow(0 0 2px #fef08a)"/><path d="M 56 97 Q 60 110 64 97 Z" fill="#020617" opacity="0.8"/><circle cx="100" cy="85" r="12" fill="#020617" stroke="#1a2a36" stroke-width="2"/><circle cx="100" cy="85" r="2" fill="#eab308" filter="drop-shadow(0 0 2px #fef08a)"/><path d="M 96 97 Q 100 110 104 97 Z" fill="#020617" opacity="0.8"/>`,

        // 41. Implante cyborg asimétrico (Cyber)
        cyborg_implante: `<circle cx="58" cy="85" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="58" cy="85" r="4" fill="#22d3ee"/><circle cx="59.5" cy="83.5" r="1.5" fill="#fff"/><rect x="88" y="75" width="24" height="20" rx="3" fill="#334155" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="5" fill="#ef4444"/><line x1="112" y1="85" x2="118" y2="85" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/><line x1="100" y1="75" x2="100" y2="70" stroke="#1a2a36" stroke-width="3" stroke-linecap="round"/>`,

// --- ANOMALÍAS Y TECNO-HORROR ---

        // 42. Agujeros negros succionadores (Cósmico/Tétrico)
        agujeros_negros: `<circle cx="60" cy="85" r="14" fill="#020617" filter="drop-shadow(0 0 5px #c084fc)"/><circle cx="60" cy="85" r="8" fill="#1e1b4b"/><circle cx="60" cy="85" r="3" fill="#000"/><circle cx="100" cy="85" r="14" fill="#020617" filter="drop-shadow(0 0 5px #c084fc)"/><circle cx="100" cy="85" r="8" fill="#1e1b4b"/><circle cx="100" cy="85" r="3" fill="#000"/>`,

        // 43. Ojos de mosca mutante (Insectoide/Radiactivo)
        mosca_mutante: `<ellipse cx="55" cy="85" rx="14" ry="18" fill="#14532d" stroke="#a3e635" stroke-width="2"/><circle cx="55" cy="85" r="2" fill="#a3e635" opacity="0.5"/><circle cx="50" cy="80" r="1" fill="#a3e635" opacity="0.5"/><circle cx="60" cy="90" r="1" fill="#a3e635" opacity="0.5"/><ellipse cx="105" cy="85" rx="14" ry="18" fill="#14532d" stroke="#a3e635" stroke-width="2"/><circle cx="105" cy="85" r="2" fill="#a3e635" opacity="0.5"/><circle cx="100" cy="80" r="1" fill="#a3e635" opacity="0.5"/><circle cx="110" cy="90" r="1" fill="#a3e635" opacity="0.5"/>`,

        // 44. Pantalla de error fatal (Cyber/Glitch)
        error_fatal: `<rect x="45" y="75" width="28" height="20" fill="#ef4444"/><text x="47" y="90" font-family="monospace" font-size="12" font-weight="bold" fill="#fff">ERR</text><rect x="87" y="75" width="28" height="20" fill="#ef4444"/><text x="89" y="90" font-family="monospace" font-size="12" font-weight="bold" fill="#fff">404</text><line x1="40" y1="85" x2="120" y2="85" stroke="#fff" stroke-width="1" opacity="0.5"/>`,

        // 45. Parásito cerebral expuesto (Mutante/Viscoso)
        parasito_cerebral: `<path d="M 45 85 C 45 70, 75 70, 75 85 C 75 100, 45 100, 45 85 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/><circle cx="60" cy="85" r="5" fill="#be185d"/><path d="M 55 80 Q 60 75 65 80" fill="none" stroke="#be185d" stroke-width="1.5"/><path d="M 85 85 C 85 70, 115 70, 115 85 C 115 100, 85 100, 85 85 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/><circle cx="100" cy="85" r="5" fill="#be185d"/><path d="M 95 80 Q 100 75 105 80" fill="none" stroke="#be185d" stroke-width="1.5"/>`,

        // 46. Espirales hipnóticas de neón (Magia/Cyber)
        espiral_neon: `<circle cx="60" cy="85" r="12" fill="#020617"/><path d="M 60 85 m 0 -10 a 10 10 0 1 1 -10 10 a 7 7 0 1 0 14 -7" fill="none" stroke="#22d3ee" stroke-width="2" filter="drop-shadow(0 0 2px #06b6d4)"/><circle cx="100" cy="85" r="12" fill="#020617"/><path d="M 100 85 m 0 -10 a 10 10 0 1 1 -10 10 a 7 7 0 1 0 14 -7" fill="none" stroke="#22d3ee" stroke-width="2" filter="drop-shadow(0 0 2px #06b6d4)"/>`,

        // 47. Ojo de cíclope mecánico (Robótico/Serio)
        ciclope_mecanico: `<circle cx="80" cy="85" r="18" fill="#334155" stroke="#0f172a" stroke-width="4"/><circle cx="80" cy="85" r="10" fill="#0f172a"/><circle cx="80" cy="85" r="4" fill="#eab308" filter="drop-shadow(0 0 3px #fef08a)"/><circle cx="82" cy="83" r="1.5" fill="#fff"/><line x1="62" y1="85" x2="50" y2="85" stroke="#0f172a" stroke-width="4"/><line x1="98" y1="85" x2="110" y2="85" stroke="#0f172a" stroke-width="4"/>`,

        // 48. Llorando líquido tóxico (Radiactivo/Triste)
        llanto_toxico: `<circle cx="60" cy="85" r="8" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="60" cy="85" r="3" fill="#1a2a36"/><path d="M 60 93 Q 63 105 60 115 Q 57 105 60 93 Z" fill="#4ade80" opacity="0.8"/><circle cx="100" cy="85" r="8" fill="#fff" stroke="#1a2a36" stroke-width="3"/><circle cx="100" cy="85" r="3" fill="#1a2a36"/><path d="M 100 93 Q 103 105 100 115 Q 97 105 100 93 Z" fill="#4ade80" opacity="0.8"/>`,

        // 49. Visor de rejilla cibernética (Cyber/Oculto)
        visor_rejilla: `<rect x="45" y="78" width="70" height="14" rx="2" fill="#0f172a" stroke="#334155" stroke-width="2"/><line x1="50" y1="78" x2="50" y2="92" stroke="#22d3ee" stroke-width="1"/><line x1="60" y1="78" x2="60" y2="92" stroke="#22d3ee" stroke-width="1"/><line x1="70" y1="78" x2="70" y2="92" stroke="#22d3ee" stroke-width="1"/><line x1="80" y1="78" x2="80" y2="92" stroke="#22d3ee" stroke-width="1"/><line x1="90" y1="78" x2="90" y2="92" stroke="#22d3ee" stroke-width="1"/><line x1="100" y1="78" x2="100" y2="92" stroke="#22d3ee" stroke-width="1"/><line x1="110" y1="78" x2="110" y2="92" stroke="#22d3ee" stroke-width="1"/>`,

        // 50. Ojos inyectados en sangre bioluminiscente (Mutante/Furia)
        sangre_bioluminiscente: `<circle cx="58" cy="88" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><path d="M 48 88 Q 53 84 58 88" stroke="#a855f7" stroke-width="1.5" fill="none"/><path d="M 68 88 Q 63 92 58 88" stroke="#a855f7" stroke-width="1.5" fill="none"/><circle cx="58" cy="88" r="4" fill="#a855f7" filter="drop-shadow(0 0 2px #d8b4fe)"/><circle cx="102" cy="88" r="10" fill="#fff" stroke="#1a2a36" stroke-width="3"/><path d="M 112 88 Q 107 84 102 88" stroke="#a855f7" stroke-width="1.5" fill="none"/><path d="M 92 88 Q 97 92 102 88" stroke="#a855f7" stroke-width="1.5" fill="none"/><circle cx="102" cy="88" r="4" fill="#a855f7" filter="drop-shadow(0 0 2px #d8b4fe)"/>`,

        // 51. Tres ojos asimétricos (Mutante)
        tres_ojos: `<circle cx="60" cy="85" r="7" fill="#fff" stroke="#1a2a36" stroke-width="2.5"/><circle cx="60" cy="85" r="3" fill="#1a2a36"/><circle cx="100" cy="85" r="7" fill="#fff" stroke="#1a2a36" stroke-width="2.5"/><circle cx="100" cy="85" r="3" fill="#1a2a36"/><circle cx="80" cy="72" r="6" fill="#fff" stroke="#1a2a36" stroke-width="2.5"/><circle cx="80" cy="72" r="2.5" fill="#ef4444"/>`,

    };

    // ==========================================
    // 6. MEGA DICCIONARIO: 18 BOCAS
    // ==========================================
    const dicBocas = {
        // --- ALEGRES Y PvZ CLÁSICO ---
        
base: `<path d="M 67 108 Q 80 124 93 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,
        
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
        
trompa_hielo: `<circle cx="80" cy="110" r="8" fill="#e0f7fa" stroke="#1a2a36" stroke-width="3"/><circle cx="80" cy="110" r="3" fill="#1a2a36"/>`,

torcida_esceptico: `<path d="M 65 113 L 95 105" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/>`,

diente_unico: `<path d="M 70 108 H 90" stroke="#1a2a36" stroke-width="4"/><rect x="76" y="108" width="8" height="7" fill="#fff" stroke="#1a2a36" stroke-width="2"/>`,

boca_X: `<line x1="75" y1="105" x2="85" y2="115" stroke="#1a2a36" stroke-width="4"/><line x1="85" y1="105" x2="75" y2="115" stroke="#1a2a36" stroke-width="4"/>`,

labios: `<path d="M 70 110 Q 80 102 90 110 Q 80 118 70 110" fill="#ff6b6b" stroke="#1a2a36" stroke-width="2"/>`,

        // --- CYBER Y ESPECIALES ---
        
rejilla_robot: `<rect x="65" y="105" width="30" height="10" rx="2" fill="#333" stroke="#1a2a36" stroke-width="3"/><line x1="70" y1="105" x2="70" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="75" y1="105" x2="75" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="80" y1="105" x2="80" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="85" y1="105" x2="85" y2="115" stroke="#00ffff" stroke-width="1.5"/><line x1="90" y1="105" x2="90" y2="115" stroke="#00ffff" stroke-width="1.5"/>`,
        
mandibula_mecha: `<path d="M 60 106 L 100 106 L 95 116 L 65 116 Z" fill="#1a2a36" stroke="#1a2a36" stroke-width="2"/><line x1="65" y1="111" x2="95" y2="111" stroke="#00ffff" stroke-width="2"/>`,
        
vampiro_noble: `<path d="M 62 108 L 98 108" fill="none" stroke="#1a2a36" stroke-width="4" stroke-linecap="round"/><polygon points="70,108 73,116 76,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="84,108 87,116 90,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>`,
        
barba_ruda: '<line x1="68" y1="110" x2="92" y2="110" stroke="#1a2a36" stroke-width="6" stroke-linecap="round"/>',
        
grunido: `<path d="M 60 102 Q 80 118 100 102 Z" fill="#1a2a36"/><polygon points="65,103 70,111 75,104" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="95,103 90,111 85,104" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>`,

apretado: `<rect x="65" y="105" width="30" height="10" rx="3" fill="#fff" stroke="#1a2a36" stroke-width="3"/><line x1="65" y1="110" x2="95" y2="110" stroke="#1a2a36" stroke-width="1.5"/><line x1="75" y1="105" x2="75" y2="115" stroke="#1a2a36" stroke-width="1.5"/><line x1="85" y1="105" x2="85" y2="115" stroke="#1a2a36" stroke-width="1.5"/>`,

vampiro_3_corregida: `<path d="M 62 108 L 98 108" fill="none" stroke="#1a2a36" stroke-width="5" stroke-linecap="round"/><polygon points="68,108 72,116 76,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="78,108 82,118 86,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="88,108 92,116 96,108" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>`,

canon: `<ellipse cx="80" cy="112" rx="10" ry="10" fill="#1a2a36"/><ellipse cx="80" cy="112" rx="6" ry="6" fill="#000"/>`,

recta_seria: `<line x1="70" y1="110" x2="90" y2="110" stroke="#1a2a36" stroke-width="7" stroke-linecap="round"/>`,

furia_ceno_boca_premium: `<path d="M 60 102 Q 80 118 100 102 Z" fill="#1a2a36" stroke="#1a2a36" stroke-width="3"/><polygon points="65,103 70,111 75,104" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/><polygon points="95,103 90,111 85,104" fill="#fff" stroke="#1a2a36" stroke-width="1.5"/>`,

// --- BOCAS CYBER Y TÓXICAS ---
        
        // 1. Rejilla de ventilación robótica (Cyber/Seria)
        rejilla_ventilacion: `<rect x="60" y="105" width="40" height="12" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="2"/><line x1="68" y1="105" x2="68" y2="117" stroke="#22d3ee" stroke-width="2"/><line x1="76" y1="105" x2="76" y2="117" stroke="#22d3ee" stroke-width="2"/><line x1="84" y1="105" x2="84" y2="117" stroke="#22d3ee" stroke-width="2"/><line x1="92" y1="105" x2="92" y2="117" stroke="#22d3ee" stroke-width="2"/>`,

        // 3. Costura quirúrgica o "boca cosida" (Serio/Tétrico)
        boca_cosida: `<line x1="60" y1="110" x2="100" y2="110" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><line x1="65" y1="105" x2="65" y2="115" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><line x1="75" y1="105" x2="75" y2="115" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><line x1="85" y1="105" x2="85" y2="115" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/><line x1="95" y1="105" x2="95" y2="115" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>`,

        // 6. Placa metálica remachada (Robótico/Serio)
        placa_remachada: `<path d="M 58 105 L 102 105 L 98 115 L 62 115 Z" fill="#94a3b8" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/><circle cx="63" cy="110" r="1.5" fill="#0f172a"/><circle cx="97" cy="110" r="1.5" fill="#0f172a"/><line x1="70" y1="110" x2="90" y2="110" stroke="#0f172a" stroke-width="2"/>`,

        // 7. Línea plana con conector lateral (Cyber/Serio)
        conector_plano: `<line x1="60" y1="110" x2="90" y2="110" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/><rect x="90" y="106" width="8" height="8" fill="#1e293b" stroke="#0f172a" stroke-width="2"/><circle cx="94" cy="110" r="1.5" fill="#22d3ee"/>`,

        // 8. Fauces alienígenas goteando (Tóxico/Radiactivo)
        fauces_toxicas: `<path d="M 60 105 Q 80 120 100 105 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/><polygon points="65,106 68,112 71,106" fill="#a855f7"/><polygon points="89,106 92,112 95,106" fill="#a855f7"/><path d="M 78 106 C 78 120, 82 120, 82 106 Z" fill="#d8b4fe"/>`,

        // 9. Visualizador de ecualizador (Cyber/Música)
        ecualizador_led: `<rect x="62" y="108" width="6" height="4" fill="#4ade80"/><rect x="70" y="104" width="6" height="8" fill="#4ade80"/><rect x="78" y="100" width="6" height="12" fill="#4ade80"/><rect x="86" y="106" width="6" height="6" fill="#4ade80"/><rect x="94" y="110" width="6" height="2" fill="#4ade80"/>`,

        // 10. Mandíbula encajada "Bulldog" (Serio/Robótico)
        mandibula_bulldog: `<path d="M 65 110 L 65 116 L 95 116 L 95 110" fill="none" stroke="#0f172a" stroke-width="5" stroke-linejoin="round"/><line x1="60" y1="110" x2="100" y2="110" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/><rect x="72" y="106" width="6" height="4" fill="#fff"/><rect x="82" y="106" width="6" height="4" fill="#fff"/>`,

// --- BOCAS MUTANTES Y TECNO-ORGÁNICAS ---

        // 11. Mandíbula trituradora de engranajes (Cyber/Industrial)
        trituradora_engranajes: `<path d="M 60 105 L 100 105 L 90 115 L 70 115 Z" fill="#334155" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/><polygon points="65,105 68,112 71,105" fill="#94a3b8" stroke="#0f172a" stroke-width="1"/><polygon points="75,105 78,112 81,105" fill="#94a3b8" stroke="#0f172a" stroke-width="1"/><polygon points="85,105 88,112 91,105" fill="#94a3b8" stroke="#0f172a" stroke-width="1"/>`,

        // 12. Cicatriz brillante de energía pura (Cyber/Mágico)
        cicatriz_energia: `<path d="M 60 110 Q 70 105 80 110 T 100 110" fill="none" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" filter="drop-shadow(0 0 4px #00ffff)"/><line x1="68" y1="105" x2="65" y2="115" stroke="#06b6d4" stroke-width="2"/><line x1="82" y1="105" x2="79" y2="115" stroke="#06b6d4" stroke-width="2"/>`,

        // 13. Sanguijuela alienígena (Mutante/Viscoso)
        sanguijuela_alien: `<ellipse cx="80" cy="110" rx="12" ry="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/><circle cx="80" cy="110" r="4" fill="none" stroke="#a855f7" stroke-width="2"/><line x1="80" y1="102" x2="80" y2="106" stroke="#d8b4fe" stroke-width="1.5"/><line x1="80" y1="114" x2="80" y2="118" stroke="#d8b4fe" stroke-width="1.5"/><line x1="72" y1="110" x2="76" y2="110" stroke="#d8b4fe" stroke-width="1.5"/><line x1="84" y1="110" x2="88" y2="110" stroke="#d8b4fe" stroke-width="1.5"/>`,

        // 14. Sonrisa derretida (Tóxico/Slime)
        sonrisa_derretida: `<path d="M 62 108 Q 80 120 98 108" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/><path d="M 70 112 C 70 125, 75 125, 75 112 Z" fill="#a3e635"/><path d="M 85 112 C 85 120, 90 120, 90 112 Z" fill="#a3e635"/><circle cx="72.5" cy="127" r="1.5" fill="#a3e635"/>`,

        // 15. Código de barras o pantalla LED rota (Cyber)
        pantalla_led_rota: `<rect x="60" y="106" width="40" height="8" fill="#0f172a"/><rect x="62" y="108" width="4" height="4" fill="#ef4444"/><rect x="68" y="108" width="8" height="4" fill="#ef4444"/><rect x="78" y="108" width="4" height="4" fill="#ef4444"/><rect x="88" y="108" width="10" height="4" fill="#ef4444"/>`,

        // 16. Mandíbula esquelética expuesta (Mutante/Serio)
        esqueleto_expuesto: `<line x1="60" y1="110" x2="100" y2="110" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/><rect x="65" y="104" width="4" height="12" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" rx="1"/><rect x="73" y="104" width="4" height="12" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" rx="1"/><rect x="81" y="104" width="4" height="12" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" rx="1"/><rect x="89" y="104" width="4" height="12" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" rx="1"/>`,

        // 17. Tubo de alimentación gástrica (Cyber/Tóxico)
        tubo_alimentacion: `<circle cx="80" cy="110" r="6" fill="#1e293b" stroke="#0f172a" stroke-width="2"/><path d="M 80 110 C 80 130, 95 135, 110 140" fill="none" stroke="#4ade80" stroke-width="3" stroke-linecap="round" opacity="0.8"/><circle cx="80" cy="110" r="3" fill="#0f172a"/>`,


        // 20. Cremallera metálica cerrada (Serio/Tétrico)
        cremallera_cerrada: `<line x1="60" y1="110" x2="100" y2="110" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><polygon points="95,108 102,110 95,112" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5"/><line x1="65" y1="108" x2="65" y2="112" stroke="#94a3b8" stroke-width="2"/><line x1="71" y1="108" x2="71" y2="112" stroke="#94a3b8" stroke-width="2"/><line x1="77" y1="108" x2="77" y2="112" stroke="#94a3b8" stroke-width="2"/><line x1="83" y1="108" x2="83" y2="112" stroke="#94a3b8" stroke-width="2"/><line x1="89" y1="108" x2="89" y2="112" stroke="#94a3b8" stroke-width="2"/>`,

// --- ANOMALÍAS Y TECNO-HORROR ---

        // 21. Sonrisa de Cheshire cibernética (Tétrico/Cyber)
        sonrisa_cheshire_cyber: `<path d="M 50 100 C 60 135, 100 135, 110 100" fill="none" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" filter="drop-shadow(0 0 3px #00ffff)"/><line x1="55" y1="105" x2="55" y2="115" stroke="#0f172a" stroke-width="3"/><line x1="65" y1="110" x2="65" y2="120" stroke="#0f172a" stroke-width="3"/><line x1="75" y1="113" x2="75" y2="123" stroke="#0f172a" stroke-width="3"/><line x1="85" y1="113" x2="85" y2="123" stroke="#0f172a" stroke-width="3"/><line x1="95" y1="110" x2="95" y2="120" stroke="#0f172a" stroke-width="3"/><line x1="105" y1="105" x2="105" y2="115" stroke="#0f172a" stroke-width="3"/>`,

        // 22. Mandíbula desencajada de zombi (Tétrico/Mutante)
        mandibula_zombi: `<path d="M 60 110 L 70 125 L 90 125 L 100 110" fill="#1e293b" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/><polygon points="65,110 68,118 71,110" fill="#f8fafc"/><polygon points="75,110 78,116 81,110" fill="#f8fafc"/><polygon points="85,110 88,118 91,110" fill="#f8fafc"/><polygon points="95,110 98,115 101,110" fill="#f8fafc"/><path d="M 72 125 Q 80 120 88 125" fill="#ef4444" opacity="0.8"/>`,

        // 23. Agujero negro tragaluz (Cósmico/Raro)
        agujero_negro: `<ellipse cx="80" cy="112" rx="15" ry="8" fill="#000" filter="drop-shadow(0 0 6px #a855f7)"/><ellipse cx="80" cy="112" rx="10" ry="4" fill="#0f172a"/><ellipse cx="80" cy="112" rx="5" ry="2" fill="#1e293b"/>`,

        // 24. Brackets metálicos exagerados (Serio/Industrial)
        brackets_metalicos: `<path d="M 60 108 Q 80 115 100 108" fill="none" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/><rect x="63" y="106" width="6" height="6" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5"/><rect x="73" y="107" width="6" height="6" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5"/><rect x="83" y="107" width="6" height="6" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5"/><rect x="93" y="106" width="6" height="6" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5"/>`,

        // 25. Fauces con múltiples hileras de dientes (Depredador extremo)
        fauces_multiples: `<path d="M 55 105 Q 80 125 105 105 Z" fill="#1a2a36" stroke="#0f172a" stroke-width="3"/><path d="M 60 106 L 63 112 L 66 106 Z M 70 107 L 73 114 L 76 107 Z M 80 108 L 83 116 L 86 108 Z M 90 107 L 93 114 L 96 107 Z M 100 106 L 97 112 L 94 106 Z" fill="#cbd5e1"/><path d="M 65 110 L 68 116 L 71 110 Z M 75 112 L 78 119 L 81 112 Z M 85 112 L 88 119 L 91 112 Z M 95 110 L 92 116 L 89 110 Z" fill="#94a3b8"/>`,

        // 26. Tubos de escape humeantes (Industrial/Tóxico)
        tubos_escape: `<rect x="65" y="105" width="10" height="12" fill="#475569" stroke="#0f172a" stroke-width="2"/><rect x="85" y="105" width="10" height="12" fill="#475569" stroke="#0f172a" stroke-width="2"/><ellipse cx="70" cy="103" rx="4" ry="2" fill="#0f172a"/><ellipse cx="90" cy="103" rx="4" ry="2" fill="#0f172a"/><circle cx="70" cy="98" r="3" fill="#cbd5e1" opacity="0.5" filter="blur(1px)"/><circle cx="90" cy="98" r="4" fill="#cbd5e1" opacity="0.4" filter="blur(2px)"/>`,

        // 29. Placa base al descubierto (Cyber/Robot)
        placa_base: `<rect x="60" y="105" width="40" height="14" rx="1" fill="#064e3b" stroke="#0f172a" stroke-width="2"/><circle cx="65" cy="112" r="3" fill="#eab308"/><circle cx="95" cy="112" r="3" fill="#eab308"/><line x1="72" y1="108" x2="88" y2="108" stroke="#34d399" stroke-width="1.5"/><line x1="72" y1="112" x2="88" y2="112" stroke="#34d399" stroke-width="1.5"/><line x1="72" y1="116" x2="88" y2="116" stroke="#34d399" stroke-width="1.5"/>`,

        // 30. Labios sellados con grapas (Tétrico/Serio)
        labios_grapados: `<path d="M 60 110 Q 80 116 100 110" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><path d="M 68 107 L 68 113 L 72 113 L 72 107" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/><path d="M 78 108 L 78 114 L 82 114 L 82 108" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/><path d="M 88 107 L 88 113 L 92 113 L 92 107" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>`,


    };

    // --- ALEATORIEDAD GEN-0 SEGURA ---
    const nombresOjos = Object.keys(dicOjos);
    const nombresBocas = Object.keys(dicBocas);
    
    // Guardamos los NOMBRES seleccionados (o los que venían en los genes)
    const nombreOjoElegido = safeData.eye_type ? safeData.eye_type : nombresOjos[Math.floor(Math.random() * nombresOjos.length)];
    const nombreBocaElegida = safeData.mouth_type ? safeData.mouth_type : nombresBocas[Math.floor(Math.random() * nombresBocas.length)];

    // Buscamos el código SVG correspondiente a esos nombres
    const ojoSeleccionado = dicOjos[nombreOjoElegido];
    const bocaSeleccionada = dicBocas[nombreBocaElegida];

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
    
    // AHORA DEVOLVEMOS UN OBJETO CON EL SVG Y LOS NOMBRES
    return svgContent;
}