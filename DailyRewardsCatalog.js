// ========================================================
// DailyRewardsCatalog.js - CATÁLOGO DE RECOMPENSAS DIARIAS
// ========================================================

window.DailyRewardsCatalog = {
    // 1. Categorías del Catálogo
    RECURSOS_BASICOS: [
        {
            id: "vital_essence",
            name: "Esencia Vital",
            type: "essence",
            desc: "Esencia primordial para crecimiento y fusiones.",
            baseAmount: 15,
            iconName: "essence"
        },
        {
            id: "apple_01",
            name: "Manzana Nexo",
            type: "consumable",
            desc: "Restaura 20% de Hambre de tu Geno activo.",
            baseAmount: 1,
            iconName: "apple"
        }
    ],

    CONSUMIBLES_TAMAGOTCHI: [
        {
            id: "pocion_energia",
            name: "Poción de Energía",
            type: "consumable",
            desc: "Recupera 50% de Resistencia de tu Geno activo.",
            baseAmount: 1,
            iconName: "pocion_energia"
        },
        {
            id: "ration_auto",
            name: "Ración Automática",
            type: "consumable",
            desc: "Alimenta en reserva a todos tus Genos por 24h.",
            baseAmount: 1,
            iconName: "ration"
        }
    ],

    HERRAMIENTAS_GENETICAS: [
        {
            id: "escaner_basico",
            name: "Escáner ADN Básico",
            type: "basic",
            desc: "Revela la presencia de genes ocultos de un Geno.",
            baseAmount: 1,
            iconName: "escaner_basico"
        },
        {
            id: "escaner_completo",
            name: "Escáner ADN Completo",
            type: "basic",
            desc: "Identifica con precisión genes y calidad S-D.",
            baseAmount: 1,
            iconName: "escaner_completo"
        }
    ],

    ITEMS_COMPETITIVOS: [
        {
            id: "tinta_habilidad",
            name: "Tinta de Habilidad",
            type: "basic",
            desc: "Permite re-escribir e implantar genes en el Laboratorio.",
            baseAmount: 1,
            iconName: "tinta_habilidad"
        }
    ],

    // 2. Iconos vectoriales premium
    getSVG: function(name) {
        if (name === "essence") {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L14.5 8.5L22 11L14.5 13.5L12 21L9.5 13.5L2 11L9.5 8.5L12 1Z" fill="#FFD700" filter="drop-shadow(0 0 4px rgba(255,215,0,0.6))"/></svg>`;
        }
        if (name === "apple") {
            return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C11.5 2 11 2.5 11 3C11 3.5 11.5 4 12 4C14.5 4 16 6 16 8C16 8.5 16.5 9 17 9C17.5 9 18 8.5 18 8C18 5 15.5 2 12 2Z" fill="#FFA726"/><path d="M12 6C9 6 6 8.5 6 12C6 16 9 19.5 12 19.5C15 19.5 18 16 18 12C18 8.5 15 6 12 6Z" fill="#EF5350" filter="drop-shadow(0 0 4px rgba(239,83,80,0.5))"/></svg>`;
        }
        if (name === "pocion_energia") {
            return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="14" rx="2" stroke="#69F0AE" stroke-width="2" filter="drop-shadow(0 0 4px rgba(105,240,174,0.5))"/><path d="M9 3H15V6H9V3Z" fill="#69F0AE"/><path d="M12 9V17M9 13H15" stroke="#69F0AE" stroke-width="2" stroke-linecap="round"/></svg>`;
        }
        if (name === "ration") {
            return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#FFB74D" stroke-width="2" filter="drop-shadow(0 0 4px rgba(255,183,77,0.5))"/><line x1="4" y1="12" x2="20" y2="12" stroke="#FFB74D" stroke-width="2"/><circle cx="9" cy="8" r="2" fill="#FFB74D"/><circle cx="15" cy="16" r="2" fill="#FFB74D"/></svg>`;
        }
        if (name === "escaner_basico") {
            return `<svg viewBox="0 0 100 100" width="24" height="24" filter="drop-shadow(0 0 4px rgba(0,229,255,0.5))"><path d="M45 20 A25 25 0 1 1 20 45 A25 25 0 0 1 45 20" fill="none" stroke="#00E5FF" stroke-width="8"/><path d="M62 62 L90 90" stroke="#00E5FF" stroke-width="12" stroke-linecap="round"/><circle cx="45" cy="45" r="12" fill="#00B0FF" opacity="0.5"/><path d="M25 45 L65 45 M45 25 L45 65" stroke="#00E5FF" stroke-width="4" opacity="0.8"/></svg>`;
        }
        if (name === "escaner_completo") {
            return `<svg viewBox="0 0 100 100" width="24" height="24" filter="drop-shadow(0 0 4px rgba(213,0,249,0.5))"><path d="M25 20 Q50 50 75 80 M75 20 Q50 50 25 80" fill="none" stroke="#D500F9" stroke-width="8"/><line x1="33" y1="50" x2="67" y2="50" stroke="#D500F9" stroke-width="5"/><line x1="42" y1="30" x2="58" y2="70" stroke="#D500F9" stroke-width="5"/><line x1="58" y1="30" x2="42" y2="70" stroke="#D500F9" stroke-width="5"/><circle cx="25" cy="20" r="7" fill="#AA00FF"/><circle cx="75" cy="80" r="7" fill="#AA00FF"/><circle cx="75" cy="20" r="7" fill="#AA00FF"/><circle cx="25" cy="80" r="7" fill="#AA00FF"/></svg>`;
        }
        if (name === "tinta_habilidad") {
            return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="drop-shadow(0 0 4px rgba(255,64,129,0.5))"><path d="M12 3C8 3 6 6 6 10V18C6 19 7 20 8 20H16C17 20 18 19 18 18V10C18 6 16 3 12 3Z" stroke="#FF4081" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#FF4081" opacity="0.5"/><path d="M10 20L8 22H16L14 20" stroke="#FF4081" stroke-width="2"/></svg>`;
        }
        if (name === "plasma_shower") {
            return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="drop-shadow(0 0 4px rgba(0,172,193,0.5))"><rect x="3" y="10" width="18" height="11" rx="3" stroke="#00E5FF" stroke-width="2"/><circle cx="7" cy="13" r="1.5" fill="#00E5FF"/><circle cx="12" cy="15" r="2" fill="#00E5FF"/><circle cx="17" cy="13" r="1" fill="#00E5FF"/><path d="M12 2V10" stroke="#00E5FF" stroke-width="2" stroke-linecap="round"/><path d="M10 5L12 7L14 5" stroke="#00E5FF" stroke-width="2" stroke-linecap="round"/></svg>`;
        }
        return "🎁";
    },

    // 3. Obtener rotación dinámica basada en tiempo de calendario (Semana 1-4)
    getCicloSemana: function() {
        if (window.TournamentManager && typeof window.TournamentManager.getCicloSemana === "function") {
            return window.TournamentManager.getCicloSemana();
        }
        const inicio = new Date('2026-01-05').getTime(); // Lunes de inicio
        const ahora = Date.now();
        const semanasTotales = Math.floor((ahora - inicio) / (7 * 24 * 60 * 60 * 1000));
        return Math.max(1, (semanasTotales % 4) + 1);
    }
};
