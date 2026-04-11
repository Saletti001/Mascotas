// =========================================
// accesorios.js - Anclajes y Complementos
// =========================================

const anclajes = {
    frijol:    { cabezaX: 80, cabezaY: 25, espaldaX: 35, espaldaY: 80 },
    hongo:     { cabezaX: 80, cabezaY: 35, espaldaX: 20, espaldaY: 90 }, 
    gota:      { cabezaX: 72, cabezaY: 20, espaldaX: 30, espaldaY: 85 }, 
    triangulo: { cabezaX: 72, cabezaY: 20, espaldaX: 45, espaldaY: 90 }, 
    circulo:   { cabezaX: 80, cabezaY: 32, espaldaX: 24, espaldaY: 88 },
    cuadrado:  { cabezaX: 80, cabezaY: 32, espaldaX: 32, espaldaY: 80 }
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
        <g transform="scale(-1, 1) translate(10, 0)"><path d="M 0 0 Q 25 -35 50 -45 Q 30 -10 55 10 Q 25 10 40 30 Q 15 20 0 0 Z" fill="#2d3748" stroke="#0f172a" stroke-width="3" opacity="0.8"/></g>
        <path d="M 0 0 Q -25 -35 -50 -45 Q -30 -10 -55 10 Q -25 10 -40 30 Q -15 20 0 0 Z" fill="#334155" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    `,
    jetpack: `
        <g transform="translate(40, 10) scale(0.9)"><rect x="-35" y="-20" width="25" height="40" rx="5" fill="#718096" stroke="#1a2a36" stroke-width="3"/><path d="M -28 20 L -22 35 L -16 20 Z" fill="#f97316" class="anim-flotar" opacity="0.8"/></g>
        <rect x="-35" y="-20" width="25" height="40" rx="5" fill="#94a3b8" stroke="#1a2a36" stroke-width="3"/><rect x="-30" y="-15" width="15" height="10" rx="2" fill="#ef4444"/><path d="M -28 20 L -22 35 L -16 20 Z" fill="#f97316" class="anim-flotar"/>
    `
};