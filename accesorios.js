// =========================================
// accesorios.js - Anclajes y Complementos definitivos
// =========================================

const anclajes = {
    // Al frijol le sumamos +8 en X para compensar su asimetría hacia la derecha
    frijol:    { cabezaX: 80, cabezaY: 25, espaldaX: 88, espaldaY: 80 }, 
    hongo:     { cabezaX: 80, cabezaY: 45, espaldaX: 80, espaldaY: 90 }, 
    gota:      { cabezaX: 80, cabezaY: 35, espaldaX: 80, espaldaY: 85 }, 
    triangulo: { cabezaX: 80, cabezaY: 35, espaldaX: 80, espaldaY: 90 }, 
    circulo:   { cabezaX: 80, cabezaY: 32, espaldaX: 80, espaldaY: 88 },
    cuadrado:  { cabezaX: 80, cabezaY: 32, espaldaX: 80, espaldaY: 80 }
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
        <path d="M 0 0 Q -45 -45 -95 -55 Q -60 -15 -85 15 Q -40 10 -60 40 Q -20 20 0 0 Z" fill="#4a5568" stroke="#0f172a" stroke-width="3"/>
        
        <path d="M 0 0 Q 45 -45 95 -55 Q 60 -15 85 15 Q 40 10 60 40 Q 20 20 0 0 Z" fill="#2d3748" stroke="#0f172a" stroke-width="3" opacity="0.8"/>
    `,
    jetpack: `
        <rect x="-60" y="-10" width="120" height="20" rx="5" fill="#4a5568" stroke="#1a2a36" stroke-width="3"/>
        
        <rect x="-70" y="-20" width="25" height="40" rx="4" fill="#718096" stroke="#1a2a36" stroke-width="3"/>
        <rect x="-63" y="-15" width="11" height="8" rx="2" fill="#ef4444"/>
        <path d="M -65 20 L -57 40 L -50 20 Z" fill="#f97316" class="anim-flotar"/>
        
        <rect x="45" y="-20" width="25" height="40" rx="4" fill="#718096" stroke="#1a2a36" stroke-width="3"/>
        <rect x="52" y="-15" width="11" height="8" rx="2" fill="#ef4444"/>
        <path d="M 50 20 L 57 40 L 65 20 Z" fill="#f97316" class="anim-flotar"/>
    `
};