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
        id: 'runner', 
        title: 'Carrera del Nexo', 
        icon: `<svg class="cyber-icon svg-runner" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(0,229,255,0.5));"><path d="M3 22h18M5 14h3v8H5zm5-9h4v17h-4zm7 5h2.5V22H17z"/></svg>`, 
        desc: 'Corre de forma infinita por el laboratorio esquivando escombros y ácido. ¡Obtén Ducha de Plasma cada 50 metros!', 
        locked: false 
    },
    { 
        id: 'sorting', 
        title: 'Clasificador de ADN', 
        icon: `<svg class="cyber-icon svg-sorting" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#e040fb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(224,64,251,0.5));"><path d="M16 3H4v18h16V7l-4-4z"/><path d="M14 3v4h4 M8 12h8 M8 16h6"/></svg>`, 
        desc: `Clasifica los Bio-Núcleos antes de que toquen el suelo. (A/Flecha Izq para Bases Estables, D/Flecha Der para Taras Genéticas).

Botes Especiales:
• Dorados ($$): ¡Pagan doble Esencia Vital (EV) según tu combo multiplicador!
• Verdes (☣️): Botes de Toxina (deben ir a la Derecha). Si fallas o caen al suelo, explotan, restan -10 EV, restan 1 vida e invierten tus controles (A/D invertidos) durante 5 segundos.
• Rojos (Bomba): ¡Explotan si caen o se clasifican! Haz click/tap directo sobre ellas en el aire para desactivarlas (+2 EV de premio).

Comienzas con 3 vidas y el juego dura 45s. ¡Evita llegar a 0 vidas!`, 
        locked: false 
    },
    { 
        id: 'defense', 
        title: 'Defensa Inmune', 
        icon: `<svg class="cyber-icon svg-shield" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#aa00ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(170,0,255,0.5));"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, 
        desc: `Protege las cápsulas de cristal contra los virus invasores.

Reglas del Juego:
• Virus Morados: Haz tap/clic rápido sobre ellos antes de 1.2 segundos para eliminarlos (+10 EV por virus). Si escapan, dañan la cápsula.
• Anticuerpos: ¡No los pinches! Si tocas a un anticuerpo por error, sufres una penalización de -15 EV.
• Vidas (Defensa): El sistema colapsa tras 3 escapes de virus. ¡Evita llegar a 3 impactos!

La partida dura 45s con spawn acelerado progresivo.`, 
        locked: false 
    },
    { 
        id: 'stacker', 
        title: 'Apila-Núcleos', 
        icon: `<svg class="cyber-icon svg-crane" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ffeb3b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(255,235,59,0.5));"><path d="M2 22V2h10l4 4H4v16M8 8h14v4l-4 4H8v-8M15 12v6"/></svg>`, 
        desc: `Apila Bio-Núcleos para construir una torre estable.

Reglas del Juego:
• Lanzar Bloque: Haz clic/tap en la pantalla para soltar el bloque de la grúa oscilante.
• Apilamiento Perfecto (+25 EV): Alinea los centros geométricos del piso con tolerancia menor de 4px para un acoplamiento perfecto que estabiliza la torre.
• Aterrizaje Desalineado (+10 EV): Si se desvía, el bloque se cortará (perdiendo el sobrante) y la torre empezará a balancearse.
• Fin de Juego: Si el bloque cae completamente fuera de la base o el bloque inferior, se precipita al vacío y la partida termina de inmediato.`, 
        locked: false 
    },
    { 
        id: 'bubbles', 
        title: 'Burbujas Elementales', 
        icon: `<svg class="cyber-icon svg-bubbles" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#00e676" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(0,230,118,0.5));"><circle cx="8" cy="8" r="6"/><circle cx="16" cy="16" r="6"/><circle cx="8" cy="17" r="4"/></svg>`, 
        desc: `Apunta y dispara células elementales para agruparlas por tipo en la parte superior.

Reglas del Juego:
• Puntería y Rebotes: El cañón gira apuntando a tu dedo o cursor. Dispara con clic/tap. Las células rebotan en las paredes laterales.
• Reventar (+5 EV): Junta 3 o más células del mismo elemento para destruirlas.
• Reacción en Cadena (+15 EV): Al destruir células de soporte, las burbujas que queden colgadas sin conexión con el techo caerán, otorgando un gran bonus.
• Descenso de Techo: Cada 6 disparos, el techo de células baja una fila.
• Fin de Juego: Si las células cruzan la línea roja de peligro en la base, el sistema colapsa.`, 
        locked: false 
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