const fs = require('fs');

// 1. Mock de DOM y objetos globales
global.window = global;
global.alert = () => {};
global.confirm = () => true;
global.localStorage = {
    getItem: (key) => null,
    setItem: (key, val) => {},
    removeItem: (key) => {}
};
global.document = {
    addEventListener: (event, callback) => {},
    getElementById: (id) => {
        return {
            innerText: '',
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            parentNode: {
                insertBefore: () => {},
                parentNode: {}
            },
            innerHTML: '',
            style: {
                setProperty: () => {},
                width: ''
            },
            addEventListener: () => {},
            onclick: null,
            appendChild: () => {},
            remove: () => {}
        };
    },
    createElement: (tag) => {
        return {
            innerText: '',
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            parentNode: {
                insertBefore: () => {},
                parentNode: {}
            },
            innerHTML: '',
            style: {},
            addEventListener: () => {},
            onclick: null,
            appendChild: () => {},
            remove: () => {}
        };
    },
    querySelector: () => {
        return {
            insertBefore: () => {},
            appendChild: () => {},
            classList: { add: () => {}, remove: () => {} },
            querySelectorAll: () => []
        };
    },
    head: {
        appendChild: () => {}
    }
};

global.labLevel = 1;
global.dailyLoginData = { lastClaimDate: "", currentDayStreak: 0, streakDays: 0 };
global.miUsuarioCloud = null;

// Mock de inventario
global.miInventario = {
    vitalEssence: 0,
    slots: [],
    addEssence: function(amount) {
        this.vitalEssence += amount;
    },
    addItem: function(item) {
        this.slots.push(item);
        return true;
    }
};

// Cargar DailyRewardsCatalog.js
const catalogPath = 'c:/Users/STT/Documents/GitHub/Mascotas/DailyRewardsCatalog.js';
const catalogCode = fs.readFileSync(catalogPath, 'utf8');
eval(catalogCode);

// Cargar DailyLoginManager.js
const loginPath = 'c:/Users/STT/Documents/GitHub/Mascotas/DailyLoginManager.js';
const loginCode = fs.readFileSync(loginPath, 'utf8');
eval(loginCode);

console.log("=== INICIANDO PRUEBAS DE CALENDARIO DE CONEXIÓN DIARIA ===\n");

// ----------------------------------------------------
// TEST 1: Rotación de Semanas del Catálogo
// ----------------------------------------------------
console.log("--- Prueba 1: Ciclo de Rotación del Catálogo ---");
const week = DailyRewardsCatalog.getCicloSemana();
console.log(`Semana actual del ciclo: ${week}`);
if (week >= 1 && week <= 4) {
    console.log(">> TEST CICLO SEMANAL: PASADO");
} else {
    console.error(">> TEST CICLO SEMANAL: FALLIDO");
}

// ----------------------------------------------------
// TEST 2: Premios Dinámicos y Escalabilidad
// ----------------------------------------------------
console.log("\n--- Prueba 2: Premios Escalados por Nivel de Laboratorio ---");
window.labLevel = 3; // Nivel del Laboratorio (rango) = 3
console.log(`Nivel de Laboratorio establecido: ${window.labLevel}`);

const rewardsWeek1 = DailyLoginManager.getRewards(); // Cargar la lista para la semana actual
// Los días 1, 2, 4, 5 deben estar multiplicados por labLevel (3)
const day1 = rewardsWeek1[0];
const day2 = rewardsWeek1[1];
const day4 = rewardsWeek1[3];
const day5 = rewardsWeek1[4];

console.log(`Día 1 Recompensa: ${day1.name} (Amount: ${day1.amount})`);
console.log(`Día 2 Recompensa: ${day2.name} (Amount: ${day2.amount})`);
console.log(`Día 4 Recompensa: ${day4.name} (Amount: ${day4.amount})`);
console.log(`Día 5 Recompensa: ${day5.name} (Amount: ${day5.amount})`);

const isScaledOk = (day1.amount === 15 * 3) && (day2.amount === 1 * 3) && (day4.amount === 25 * 3) && (day5.amount === 2 * 3);
if (isScaledOk) {
    console.log(">> TEST MULTIPLICADOR DE NIVEL: PASADO");
} else {
    console.error(">> TEST MULTIPLICADOR DE NIVEL: FALLIDO");
}

// ----------------------------------------------------
// TEST 3: Drop-rate de Herramientas Genéticas
// ----------------------------------------------------
console.log("\n--- Prueba 3: Drop-rate de Herramientas Genéticas (Día 3 y 6) ---");
const trials = 10000;
let basicoCount = 0;
let completoCount = 0;

for (let i = 0; i < trials; i++) {
    const rolled = DailyLoginManager.obtenerItemAleatorio("HERRAMIENTAS_GENETICAS");
    if (rolled.id === "escaner_basico") {
        basicoCount++;
    } else if (rolled.id === "escaner_completo") {
        completoCount++;
    }
}

const basicoRatio = basicoCount / trials;
const completoRatio = completoCount / trials;
console.log(`De ${trials} intentos:`);
console.log(`- Escáner Básico: ${basicoCount} (${(basicoRatio * 100).toFixed(2)}%) [Esperado ~70%]`);
console.log(`- Escáner Completo: ${completoCount} (${(completoRatio * 100).toFixed(2)}%) [Esperado ~30%]`);

const isDropRateOk = Math.abs(basicoRatio - 0.70) < 0.02 && Math.abs(completoRatio - 0.30) < 0.02;
if (isDropRateOk) {
    console.log(">> TEST DROP-RATE EQUILIBRADO: PASADO");
} else {
    console.error(">> TEST DROP-RATE EQUILIBRADO: FALLIDO");
}

// ----------------------------------------------------
// TEST 4: Simulación de Reclamación Offline / Fallback local
// ----------------------------------------------------
console.log("\n--- Prueba 4: Reclamación y Avance de Streak (Offline Fallback) ---");
window.dailyLoginData = { lastClaimDate: "", currentDayStreak: 0, streakDays: 0 };
window.miUsuarioCloud = null;

// Reclamar Día 1 (Índice 0)
console.log("Reclamando Día 1...");
DailyLoginManager.claimReward().then(() => {
    console.log("Esencia Vital acumulada:", miInventario.vitalEssence);
    console.log("Streak actual en datos de juego (próximo índice):", dailyLoginData.currentDayStreak);

    // Reclamar Día 2 (Índice 1)
    console.log("Reclamando Día 2...");
    // Forzar fecha para que nos deje reclamar localmente
    window.dailyLoginData.lastClaimDate = "fecha_anterior";
    return DailyLoginManager.claimReward();
}).then(() => {
    console.log("Items en inventario:", miInventario.slots.map(s => s.name));
    console.log("Streak actual en datos de juego (próximo índice):", dailyLoginData.currentDayStreak);

    const localClaimOk = miInventario.vitalEssence === 45 && miInventario.slots.some(s => s.id === "apple_01") && dailyLoginData.currentDayStreak === 2;
    if (localClaimOk) {
        console.log(">> TEST RECLAMO Y AVANCE LOCAL: PASADO");
    } else {
        console.error(">> TEST RECLAMO Y AVANCE LOCAL: FALLIDO");
    }

    console.log("\n=== PRUEBAS CONCLUIDAS CON ÉXITO ===");
    process.exit((isScaledOk && isDropRateOk && localClaimOk) ? 0 : 1);
}).catch(err => {
    console.error("Test failed with error:", err);
    process.exit(1);
});
