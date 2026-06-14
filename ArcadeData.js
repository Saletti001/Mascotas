// ArcadeData.js - La base de datos de tus minijuegos (3 juegos listos) con iconos SVG premium
const ARCADE_GAMES_DATABASE = [
    { 
        id: 'catch', 
        title: 'Lluvia de Manzanas', 
        icon: `<svg class="cyber-icon svg-apple" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ff007f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(255,0,127,0.5));"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6c0-2 1-3 1-3 M9.5 8C8.5 7 8 5.5 8 5.5"/></svg>`, 
        desc: 'Atrapa manzanas y EV cayendo del cielo. ¡Evita las bombas!', 
        locked: false 
    },
    { 
        id: 'flappy', 
        title: 'Flappy Geno', 
        icon: `<svg class="cyber-icon svg-bird" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(255,215,0,0.5));"><path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5C4 22 6 21 7.5 19.5L18 9l-3-3L4.5 16.5z"/><path d="M12 5l3 3M19 5l-2.5 2.5"/></svg>`, 
        desc: 'Aletea y esquiva los tubos de ensayo para conseguir la puntuación más alta.', 
        locked: false 
    },
    { 
        id: 'memory', 
        title: 'Memoria ADN', 
        icon: `<svg class="cyber-icon svg-dna" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" style="filter: drop-shadow(0 0 5px rgba(0,229,255,0.5));"><path d="M4.5 10.5c3-6 12-6 15 0m-15 3c3 6 12 6 15 0"/><path d="M6 8v8m4-9v10m4-10v10m4-9v8"/></svg>`, 
        desc: 'Encuentra las parejas de genes compatibles antes de que se agote el tiempo.', 
        locked: false 
    },
    { 
        id: 'g4', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g5', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g6', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g7', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g8', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g9', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g10', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g11', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    },
    { 
        id: 'g12', 
        title: 'Próximamente', 
        icon: `<svg class="cyber-icon svg-lock" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d500f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(213,0,249,0.5));"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, 
        desc: 'Nuevo minijuego en desarrollo.', 
        locked: true 
    }
];