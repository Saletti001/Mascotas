// =========================================
// genes.js - BASE DE DATOS GENÉTICA (V9.1)
// =========================================

// 1. DICCIONARIO MAESTRO DE GENES
window.BASE_DATOS_GENES_V9 = {
    cosmetico: [
        { id: "cromatico_latente", name: "Cromático Latente", desc: "Desbloquea skin alternativo invertido" },
        { id: "aura_linaje", name: "Aura de Linaje", desc: "Aureola visual permanente" },
        { id: "patron_holografico", name: "Patrón Holográfico", desc: "Patrón de piel animado único" },
        { id: "brillo_bioluminiscente", name: "Brillo Bioluminiscente", desc: "Brillo pulsante activo" },
        { id: "forma_invertida", name: "Forma Invertida", desc: "Paleta en negativo fotográfico" },
        { id: "rastro_elemental", name: "Rastro Elemental", desc: "Rastro visual al moverse" },
        { id: "sombra_genetica", name: "Sombra Genética", desc: "Sombra con animación independiente" },
        { id: "emblema_fundador", name: "Emblema Fundador", desc: "Insignia élite integrada" },
        { id: "eco_visual", name: "Eco Visual", desc: "Réplica translúcida con retraso" },
        { id: "metamorfosis_estacional", name: "Metamorfosis Estacional", desc: "Cambio de tonalidad estacional" }
    ],
    combate: [
        // --- GENES V9.1 (ORIGINALES) ---
        { id: "resiliencia_ultima", name: "Resiliencia Última", desc: "x1.4 ATK/SPD si HP < 15%" },
        { id: "piel_cristal", name: "Piel de Cristal", desc: "Primer golpe recibe 0 daño" },
        { id: "velocidad_fantasma", name: "Velocidad Fantasma", desc: "20% probabilidad de turno doble" },
        { id: "reflejo_genetico", name: "Reflejo Genético", desc: "Devuelve 30% del daño crítico" },
        { id: "barrera_limite", name: "Barrera Límite", desc: "Sobrevive con 1 HP un golpe fatal." },
        { id: "vampirismo_genetico", name: "Vampirismo Genético", desc: "Recupera 15% del daño infligido como HP." },
        { id: "armadura_adaptativa", name: "Armadura Adaptativa", desc: "Reduce daño repetido del mismo elemento." },
        { id: "sangre_fria", name: "Sangre Fría", desc: "Inmune al primer efecto de estado." },
        
        // --- ✨ NUEVOS GENES DE COLISEO V1.0 ---
        { id: "core_ar", name: "Núcleo Coraza", desc: "Absorbe el primer debuff de DEF o ATK." },
        { id: "min_dmg", name: "Daño Mínimo", desc: "El daño mínimo garantizado sube a 35% del ATK." },
        { id: "def_brk", name: "Ruptura Defensiva", desc: "3 golpes seguidos bajan DEF rival 10% permanente." },
        { id: "steadfast", name: "Postura Inquebrantable", desc: "Retiene el 20% de DEF contra ataques Perforantes." },
        { id: "state_rush", name: "Aceleración de Estado", desc: "Los estados aplican daño desde el turno 1." },
        { id: "dmg_echo", name: "Retroalimentación", desc: "+15% ATK tras recibir un golpe mayor al 15% de HP." },
        { id: "decoy", name: "Maestro del Engaño", desc: "El primer ataque Perforante rival falla." },
        { id: "ults_counter", name: "Contra-Golpe Definitivo", desc: "+30% ATK tras recibir el Definitivo del rival." }
    ],
    elemental: [
        { id: "elemento_dual", name: "Elemento Dual", desc: "Segundo elemento activable en combate" },
        { id: "afinidad_latente", name: "Afinidad Latente", desc: "Mitiga debilidad elemental a x0.75" },
        { id: "catalizador_afinidad", name: "Catalizador de Afinidad", desc: "Potencia pasivos elementales." }
    ],
    crianza: [
        { id: "fertilidad_pura", name: "Fertilidad Pura", desc: "Límite de crías +2 (Total 9)" },
        { id: "dominancia_genetica", name: "Dominancia Genética", desc: "70% dominancia en herencia" },
        { id: "cooldown_acelerado", name: "Cooldown Acelerado", desc: "-50% tiempo de descanso cría" },
        { id: "gen_dominante_puro", name: "Gen Dominante Puro", desc: "Garantiza 100% herencia de este gen." },
        { id: "memoria_genetica", name: "Memoria Genética", desc: "Hijos heredan genes ocultos más fácil." }
    ],
    progresion: [
        { id: "aprendiz_acelerado", name: "Aprendiz Acelerado", desc: "x1.25 XP obtenida" },
        { id: "umbral_despertar", name: "Umbral del Despertar", desc: "+5 todos los IVs al Nv. 25" },
        { id: "resonancia_nivel", name: "Resonancia de Nivel", desc: "+1 a stat líder cada 10 niveles." },
        // AQUI ESTÁ EL CAMBIO A NIVEL 55:
        { id: "especialista_elite", name: "Especialista de Élite", desc: "Rompe el límite. Permite Nivel 55." },
        { id: "aceleracion_final", name: "Aceleración Final", desc: "Últimos 10 niveles requieren 40% menos XP." }
    ],
    reactor_santuario: [
        { id: "esencia_concentrada", name: "Esencia Concentrada", desc: "x2 Esencia Vital al liberar" },
        { id: "resistencia_colapso", name: "Resistencia al Colapso", desc: "Evita colapso total en Reactor" },
        { id: "catalizador_rareza", name: "Catalizador de Rareza", desc: "+2% Éxito Crítico en Reactor" },
        { id: "alquimista_natural", name: "Alquimista Natural", desc: "Cuenta como 1.5 Genos en el Reactor." },
        { id: "catalizador_critico", name: "Catalizador del Crítico", desc: "Exito Crítico en Reactor +2% extra." }
    ],
    social: [
        { id: "gen_mentor", name: "Gen Mentor", desc: "+15% XP para becados" },
        { id: "aura_liderazgo", name: "Aura de Liderazgo", desc: "+10% ATK a todo el equipo" }
    ]
};

// 2. DICCIONARIO DE COMBOS SINÉRGICOS
window.COMBOS_OFICIALES = [
    { ids: ["resiliencia_ultima", "aprendiz_acelerado"], nombre: "El Fénix" },
    { ids: ["piel_cristal", "reflejo_genetico"], nombre: "El Espejo Viviente" },
    { ids: ["resistencia_colapso", "catalizador_rareza"], nombre: "El Alquimista" },
    { ids: ["dominancia_genetica", "aprendiz_acelerado"], nombre: "El Criador Real" },
    { ids: ["barrera_limite", "vampirismo_genetico"], nombre: "El Inmortal" },
    { ids: ["armadura_adaptativa", "catalizador_afinidad"], nombre: "La Fortaleza Elemental" },
    { ids: ["velocidad_fantasma", "sangre_fria"], nombre: "El Fantasma Práctico" },
    { ids: ["cooldown_acelerado", "resonancia_nivel"], nombre: "El Acelerador Total" },
    { ids: ["gen_dominante_puro", "memoria_genetica"], nombre: "El Gran Linaje" },
    { ids: ["especialista_elite", "aceleracion_final"], nombre: "La Máquina Imparable" },
    { ids: ["alquimista_natural", "catalizador_critico"], nombre: "El Reactor Monstruoso" }
];

// 3. FUNCIÓN GLOBAL DETECTORA DE COMBOS
window.detectarComboSinergico = function(genB, genC) {
    if(!genB || !genC || genB === "ninguno" || genC === "ninguno") return null;
    const combo = window.COMBOS_OFICIALES.find(c => c.ids.includes(genB) && c.ids.includes(genC));
    return combo ? combo.nombre : null;
};