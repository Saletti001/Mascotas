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