// =========================================
// accesorios.js - Anclajes y Complementos
// =========================================

const anclajes = {
    frijol:    { cabezaX: 80, cabezaY: 25, espaldaX: 80, espaldaY: 85 },
    hongo:     { cabezaX: 80, cabezaY: 45, espaldaX: 80, espaldaY: 95 }, 
    gota:      { cabezaX: 80, cabezaY: 35, espaldaX: 80, espaldaY: 90 }, 
    triangulo: { cabezaX: 80, cabezaY: 35, espaldaX: 80, espaldaY: 95 }, 
    circulo:   { cabezaX: 80, cabezaY: 32, espaldaX: 80, espaldaY: 93 },
    cuadrado:  { cabezaX: 80, cabezaY: 32, espaldaX: 80, espaldaY: 85 }
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
        <path d="M 15 0 Q 40 -35 65 -45 Q 45 -10 70 10 Q 40 10 55 30 Q 30 20 15 0 Z" fill="#2d3748" stroke="#0f172a" stroke-width="3" opacity="0.8"/>
        <path d="M -15 0 Q -40 -35 -60 -45 Q -45 -10 -70 10 Q -40 10 -55 30 Q -30 20 -15 0 Z" fill="#4a5568" stroke="#0f172a" stroke-width="3"/>
    `,
    jetpack: `
        <g transform="translate(-60, -15)">
            <rect x="0" y="0" width="22" height="35" rx="5" fill="#718096" stroke="#1a2a36" stroke-width="3"/>
            <rect x="4" y="5" width="14" height="8" rx="2" fill="#ef4444" opacity="0.8"/>
            <path d="M 5 35 L 11 50 L 17 35 Z" fill="#f97316" class="anim-flotar"/>
        </g>
        
        <g transform="translate(40, -15)">
            <rect x="0" y="0" width="22" height="35" rx="5" fill="#94a3b8" stroke="#1a2a36" stroke-width="3"/>
            <rect x="4" y="5" width="14" height="8" rx="2" fill="#ef4444" opacity="0.8"/>
            <path d="M 5 35 L 11 50 L 17 35 Z" fill="#f97316" class="anim-flotar"/>
        </g>
    `,
};