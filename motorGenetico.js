// =========================================
// motorGenetico.js - LÓGICA MATEMÁTICA Y HERENCIA (ACTUALIZADO V14/V15)
// =========================================

// 1. DICCIONARIO DE RAREZAS UNIFICADO (Ahora incluye Defensa y HP actualizado)
window.ESCALA_RAREZAS = {
    "Común":      { hp: [70, 110], atk: [10, 22], def: [5, 15],  spd: [8, 25],   luk: [5, 15] },
    "Raro":       { hp: [100, 150],atk: [18, 35], def: [10, 22], spd: [15, 40],  luk: [10, 25] },
    "Épico":      { hp: [140, 200],atk: [28, 50], def: [18, 35], spd: [25, 55],  luk: [20, 35] },
    "Legendario": { hp: [190, 260],atk: [40, 70], def: [25, 50], spd: [35, 80],  luk: [30, 50] },
    "Mítico":     { hp: [240, 320],atk: [60, 100],def: [40, 70], spd: [50, 110], luk: [45, 70] }
};

window.randomFrom = function(array) { 
    return array[Math.floor(Math.random() * array.length)]; 
};

// 2. LÓGICA AVANZADA DE HERENCIA DE RASGOS
window.heredarRasgo = function(padreA, padreB, categoria) {
    const roll = Math.random() * 100;
    
    const getGenSeguro = (padre, cat, tipo) => {
        if (padre.genes && padre.genes[cat] && padre.genes[cat][tipo]) {
            return padre.genes[cat][tipo]; 
        }
        if (tipo === 'dom') {
            if (cat === 'cuerpo') return padre.shape || padre.visual_genes?.body_shape || padre.body_shape || "gota";
            if (cat === 'ojos') return padre.eye_type || "estandar";
            if (cat === 'boca') return padre.mouth_type || "colmillos";
            if (cat === 'espalda') return padre.wing_type || "ninguno";
            if (cat === 'cabeza') return padre.hat_type || "ninguno";
            if (cat === 'afinidad') return padre.element || "Biomutante";
        }
        return window.GenomaBBDD ? window.randomFrom(window.GenomaBBDD[cat]) : "gota"; 
    };

    if (roll <= 70) return Math.random() > 0.5 ? getGenSeguro(padreA, categoria, 'dom') : getGenSeguro(padreB, categoria, 'dom');
    else if (roll <= 95) return Math.random() > 0.5 ? getGenSeguro(padreA, categoria, 'rec') : getGenSeguro(padreB, categoria, 'rec');
    else return window.GenomaBBDD ? window.randomFrom(window.GenomaBBDD[categoria]) : "gota"; 
};

// 3. CÁLCULO DE IVS (Ahora incluye mutación de Defensa)
window.calcularIVs = function(statsA, statsB) {
    const sA = statsA || { hp: 70, atk: 15, def: 10, spd: 15, luk: 15 };
    const sB = statsB || { hp: 70, atk: 15, def: 10, spd: 15, luk: 15 };
    
    const calc = (a, b) => {
        let base = Math.floor((a + b) / 2);
        let mutacion = Math.floor(base * 0.05); 
        if (mutacion < 1) mutacion = 1; 
        
        let resultado = base + (Math.floor(Math.random() * (mutacion * 2 + 1)) - mutacion);
        return Math.max(1, resultado); 
    };
    
    return { 
        hp: calc(sA.hp, sB.hp), 
        atk: calc(sA.atk, sB.atk), 
        def: calc(sA.def || 10, sB.def || 10), 
        spd: calc(sA.spd, sB.spd), 
        luk: calc(sA.luk, sB.luk) 
    };
};

window.aleatorioEnRango = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 4. GENERACIÓN DESDE CERO (Para la Incubadora)
window.generarStatsPorRareza = function(rareza) {
    const limites = window.ESCALA_RAREZAS[rareza] || window.ESCALA_RAREZAS["Común"];

    const stats = {
        hp: window.aleatorioEnRango(limites.hp[0], limites.hp[1]),
        atk: window.aleatorioEnRango(limites.atk[0], limites.atk[1]),
        def: window.aleatorioEnRango(limites.def[0], limites.def[1]), // Añadida Defensa
        spd: window.aleatorioEnRango(limites.spd[0], limites.spd[1]),
        luk: window.aleatorioEnRango(limites.luk[0], limites.luk[1])
    };

    return stats;
};


// =========================================
// FUNCIONES DE INTERFAZ (UI) PARA LA TARJETA
// =========================================

// Calcula el Rango S-D compensando el nivel del Geno (Sincronizado con app.js)
window.calcularCalidad = function(stats, rareza, nivel = 1) {
    const limites = window.ESCALA_RAREZAS[rareza] || window.ESCALA_RAREZAS["Común"];
    
    let tMin = limites.hp[0] + limites.atk[0] + limites.def[0] + limites.spd[0] + limites.luk[0];
    let tMax = limites.hp[1] + limites.atk[1] + limites.def[1] + limites.spd[1] + limites.luk[1];

    let statsUsar = stats;
    let bonoUmbral = 0;
    
    if (stats) {
        if (stats.stats && (stats.baseStats || stats.stats)) {
            // Es un objeto Geno completo
            statsUsar = stats.baseStats || stats.stats;
            if (stats.umbralAplicado) bonoUmbral = 25;
        } else {
            // Es un objeto de estadísticas (stats o baseStats)
            if (stats.baseStats) statsUsar = stats.baseStats;
            if (stats.umbralAplicado) bonoUmbral = 25;
        }
    }
    
    let currentTotal = (statsUsar.hp || 0) + (statsUsar.atk || 0) + (statsUsar.def || 0) + (statsUsar.spd || 0) + (statsUsar.luk || 0) - bonoUmbral;

    let pct = Math.round(((currentTotal - tMin) / (tMax - tMin)) * 100);
    if (pct > 100) pct = 100;
    if (pct < 0) pct = 0;

    let rango = "D";
    if (pct >= 90) rango = "S";
    else if (pct >= 75) rango = "A";
    else if (pct >= 50) rango = "B";
    else if (pct >= 25) rango = "C";

    return {
        rango: rango,
        calidadPorcentaje: pct
    };
};

// Devuelve el color hexadecimal exacto para la Tarjeta de Identificación
window.obtenerColorRango = function(rango) {
    if (rango === "S") return "#ffcc00"; // Oro Brillante
    if (rango === "A") return "#00d2ff"; // Cian Nexo
    if (rango === "B") return "#4CAF50"; // Verde Saludable
    if (rango === "C") return "#f0ad4e"; // Naranja Advertencia
    return "#d9534f"; // Rojo Peligro (D)
};


// =========================================
// ADAPTADORES DE COMPATIBILIDAD (Seguridad)
// =========================================
window.cruzarRasgo = function(rP1, rP2, def) { 
    return { dom: Math.random() < 0.5 ? rP1.dom : rP2.dom, rec: Math.random() < 0.5 ? rP1.rec : rP2.rec }; 
};
window.heredarStat = function(s1, s2) { 
    const hack = window.calcularIVs({hp: s1, atk:0, def:0, spd:0, luk:0}, {hp: s2, atk:0, def:0, spd:0, luk:0});
    return hack.hp;
};