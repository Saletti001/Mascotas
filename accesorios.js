// =========================================
// accesorios.js - Anclajes y Complementos definitivos
// =========================================

const anclajes = {
    frijol:    { cabezaX: 80, cabezaY: 25, espaldaX: 88, espaldaY: 80 }, 
    hongo:     { cabezaX: 80, cabezaY: 45, espaldaX: 80, espaldaY: 90 }, 
    gota:      { cabezaX: 80, cabezaY: 35, espaldaX: 80, espaldaY: 85 }, 
    triangulo: { cabezaX: 80, cabezaY: 35, espaldaX: 80, espaldaY: 90 }, 
    circulo:   { cabezaX: 80, cabezaY: 32, espaldaX: 80, espaldaY: 88 },
    cuadrado:  { cabezaX: 80, cabezaY: 32, espaldaX: 80, espaldaY: 80 },
    // ✨ NUEVAS FORMAS AÑADIDAS
    estrella:  { cabezaX: 80, cabezaY: 35, espaldaX: 80, espaldaY: 90 }, // Misma lógica que el triángulo
    nube:      { cabezaX: 80, cabezaY: 45, espaldaX: 80, espaldaY: 85 },
    pentagono: { cabezaX: 80, cabezaY: 30, espaldaX: 80, espaldaY: 85 },
    chili:     { cabezaX: 80, cabezaY: 25, espaldaX: 80, espaldaY: 90 },
    rayo:      { cabezaX: 80, cabezaY: 30, espaldaX: 80, espaldaY: 85 }
};

const dicSombreros = {
    ninguno: ``,
    corona_rey: `<path d="M -18 0 L -24 -28 L -6 -16 L 0 -34 L 6 -16 L 24 -28 L 18 0 Z" fill="#facc15" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/><circle cx="-24" cy="-28" r="3.5" fill="#ef4444"/><circle cx="0" cy="-34" r="3.5" fill="#06b6d4"/><circle cx="24" cy="-28" r="3.5" fill="#ef4444"/><rect x="-18" y="-6" width="36" height="6" fill="#ca8a04"/>`,
    cuerno_mutante: `<path d="M -10 0 Q -20 -30 10 -45 Q 8 -20 10 0 Z" fill="#f8fafc" stroke="#1a2a36" stroke-width="3" stroke-linejoin="round"/><path d="M -3 0 Q -8 -30 14 -38 Q 10 -15 10 0 Z" fill="#cbd5e1"/>`,
    halo_neon: `<ellipse cx="0" cy="-25" rx="22" ry="7" fill="none" stroke="#ef4444" stroke-width="4" filter="drop-shadow(0 0 5px #ff0000)" class="anim-flotar"/>`
};

const dicAlas = {
    ninguno: ``,
    alas_murcielago: `
        <path d="M 0 -5 C -20 -8, -35 -10, -50 -10 Q -70 -40 -90 -50 Q -75 -15 -95 0 Q -70 0 -85 20 Q -60 10 -50 10 C -35 10, -20 8, 0 5 Z" fill="#4a5568" stroke="#0f172a" stroke-width="3"/>
        <path d="M 0 -5 C 20 -8, 35 -10, 50 -10 Q 70 -40 90 -50 Q 75 -15 95 0 Q 70 0 85 20 Q 60 10 50 10 C 35 10, 20 8, 0 5 Z" fill="#2d3748" stroke="#0f172a" stroke-width="3" opacity="0.8"/>
    `,
    jetpack: `
        <rect x="-60" y="-10" width="120" height="20" rx="5" fill="#4a5568" stroke="#1a2a36" stroke-width="3"/>
        
        <g transform="translate(-75, -15)">
            <rect width="25" height="40" rx="4" fill="#718096" stroke="#1a2a36" stroke-width="3"/>
            <rect x="7" y="5" width="11" height="8" rx="2" fill="#ef4444"/>
            <g class="anim-fuego" style="transform-origin: 12px 40px;">
                <path d="M 5 40 L 12 55 L 20 40 Z" fill="#f97316"/>
                <path d="M 8 40 L 12 50 L 16 40 Z" fill="#facc15"/>
            </g>
        </g>
        
        <g transform="translate(50, -15)">
            <rect width="25" height="40" rx="4" fill="#718096" stroke="#1a2a36" stroke-width="3"/>
            <rect x="7" y="5" width="11" height="8" rx="2" fill="#ef4444"/>
            <g class="anim-fuego" style="transform-origin: 12px 40px;">
                <path d="M 5 40 L 12 55 L 20 40 Z" fill="#f97316"/>
                <path d="M 8 40 L 12 50 L 16 40 Z" fill="#facc15"/>
            </g>
        </g>
    `
};