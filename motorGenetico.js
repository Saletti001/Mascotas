// =========================================
// motorGenetico.js - LÓGICA MATEMÁTICA Y HERENCIA
// =========================================

function randomFrom(array) { 
    return array[Math.floor(Math.random() * array.length)]; 
}

function heredarRasgo(padreA, padreB, categoria) {
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
        return randomFrom(GenomaBBDD[cat]); 
    };

    if (roll <= 70) return Math.random() > 0.5 ? getGenSeguro(padreA, categoria, 'dom') : getGenSeguro(padreB, categoria, 'dom');
    else if (roll <= 95) return Math.random() > 0.5 ? getGenSeguro(padreA, categoria, 'rec') : getGenSeguro(padreB, categoria, 'rec');
    else return randomFrom(GenomaBBDD[categoria]); 
}

function calcularIVs(statsA, statsB) {
    const sA = statsA || { hp: 50, atk: 15, spd: 15, luk: 15 };
    const sB = statsB || { hp: 50, atk: 15, spd: 15, luk: 15 };
    const calc = (a, b) => Math.max(1, Math.min(31, Math.floor((a + b) / 2) + (Math.floor(Math.random() * 7) - 2)));
    return { hp: calc(sA.hp, sB.hp), atk: calc(sA.atk, sB.atk), spd: calc(sA.spd, sB.spd), luk: calc(sA.luk, sB.luk) };
}

// DICCIONARIO DE LÍMITES POR RAREZA (Actualizado con desacople y mayor overlap)
const ESCALA_RAREZAS = {
    "Común":      { hp: [35, 55],  atk: [10, 22], spd: [8, 25],   luk: [5, 15] },
    "Raro":       { hp: [50, 75],  atk: [18, 35], spd: [15, 40],  luk: [10, 25] },
    "Épico":      { hp: [70, 100], atk: [28, 50], spd: [25, 55],  luk: [20, 35] },
    "Legendario": { hp: [95, 130], atk: [40, 70], spd: [35, 80],  luk: [30, 50] },
    "Mítico":     { hp: [120, 160],atk: [60, 100],spd: [50, 110], luk: [45, 70] }
};

// FUNCIÓN PARA TIRAR LOS DADOS (Número aleatorio entre min y max)
function aleatorioEnRango(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// FUNCIÓN PRINCIPAL DE NACIMIENTO
function generarStatsPorRareza(rareza) {
    const limites = ESCALA_RAREZAS[rareza] || ESCALA_RAREZAS["Común"];

    const stats = {
        hp: aleatorioEnRango(limites.hp[0], limites.hp[1]),
        atk: aleatorioEnRango(limites.atk[0], limites.atk[1]),
        spd: aleatorioEnRango(limites.spd[0], limites.spd[1]),
        luk: aleatorioEnRango(limites.luk[0], limites.luk[1])
    };

    // CALCULAR LA CALIDAD DEL GENO (El algoritmo se adapta automáticamente a los nuevos rangos)
    let totalMin = limites.hp[0] + limites.atk[0] + limites.spd[0] + limites.luk[0];
    let totalMax = limites.hp[1] + limites.atk[1] + limites.spd[1] + limites.luk[1];
    let totalObtenido = stats.hp + stats.atk + stats.spd + stats.luk;

    // Porcentaje de perfección (0% = todo al mínimo, 100% = stats perfectas)
    let porcentajeCalidad = ((totalObtenido - totalMin) / (totalMax - totalMin)) * 100;
    stats.calidadPorcentaje = Math.round(porcentajeCalidad);

    // Asignar una letra (Tier) para mostrar en la interfaz
    if (stats.calidadPorcentaje >= 95) stats.rango = "S";
    else if (stats.calidadPorcentaje >= 80) stats.rango = "A";
    else if (stats.calidadPorcentaje >= 50) stats.rango = "B";
    else if (stats.calidadPorcentaje >= 20) stats.rango = "C";
    else stats.rango = "D"; 

    return stats;
}