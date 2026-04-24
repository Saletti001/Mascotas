// =========================================
// AttackCatalog.js - DICCIONARIO DE ATAQUES Y ESTADOS
// =========================================

window.AttackCatalog = {
    // 1. DICCIONARIO DE ESTADOS ALTERADOS
    estados: {
        "Regeneracion": { tipo: "buff", duracionBase: 3, efecto: "cura", valor: 0.08, apilable: true, maxStack: 15 }, // Hasta 15%
        "Infeccion": { tipo: "debuff", duracionBase: 3, efecto: "baja_stat", valor: 0.20, apilable: true, maxStack: 3 },
        "Quemadura": { tipo: "dot", duracionBase: 3, efecto: "dano_hp", valor: 0.06, apilable_duracion: true },
        "Veneno": { tipo: "dot", duracionBase: 3, efecto: "dano_hp", valor: 0.05, apilable_intensidad: true, maxStack: 3 },
        "Paralisis": { tipo: "control", duracionBase: 2, efecto: "baja_spd", valor: 0.35, probPerderTurno: 0.30, maxStack: 1 },
        "Congelacion": { tipo: "control", duracionBase: 1, efecto: "pierde_turno", inmunidadPost: 2 },
        "Vision Nublada": { tipo: "debuff", duracionBase: 3, efecto: "baja_acc", valor: 0.25, apilable: true, maxStack: 45 },
        "Enredado": { tipo: "control", duracionBase: 2, efecto: "baja_spd_bloquea_soporte", valor: 0.40, maxStack: 1 },
        "Corrosion": { tipo: "debuff", duracionBase: 999, efecto: "baja_atk_permanente", valor: 0.15, apilable: true, maxStack: 3 },
        "Campo Radiactivo": { tipo: "dot", duracionBase: 4, efecto: "dano_hp_fijo", valor: 0.05 },
        "Irradiacion": { tipo: "debuff", duracionBase: 3, efecto: "baja_atk", valor: 0.25 }
    },

    // 2. CATÁLOGO DE MOVIMIENTOS POR ELEMENTO
    movimientos: {
        "Biomutante": {
            basicos: [
                { id: "pulso_vital", nombre: "Pulso Vital", tipo: "Fisico", slot: 1, potencia: 0.85, precision: 100, usos: 99, descripcion: "Ataque básico de masa orgánica." }
            ],
            especiales: [
                { id: "oleada_mutante", nombre: "Oleada Mutante", tipo: "Fisico", slot: 2, potencia: 1.30, precision: 85, usos: 4, descripcion: "Golpe poderoso de energía orgánica." },
                { id: "espinas_oseas", nombre: "Espinas Óseas", tipo: "Fisico", slot: 2, potencia: 0.95, precision: 95, usos: 5, rompeEscudos: 0.30, descripcion: "Penetra 30% de escudos." },
                { id: "transferencia_carga", nombre: "Transferencia", tipo: "Especial", slot: 2, potenciaBase: 0.60, escalaConHP: true, precision: 100, usos: 99, descripcion: "Más daño cuanto más HP tienes." }
            ],
            soportes: [
                { id: "espora_curativa", nombre: "Espora Curativa", tipo: "Soporte", slot: 3, curacion: 0.20, precision: 100, usos: 3, descripcion: "Restaura 20% de HP." },
                { id: "membrana_fortalecida", nombre: "Membrana", tipo: "Soporte", slot: 3, escudo: 0.25, duracion: 2, precision: 100, usos: 2, descripcion: "Escudo del 25% del ATK rival." },
                { id: "raiz_enredadora", nombre: "Raíz Enredadora", tipo: "Control", slot: 3, potencia: 0.40, precision: 100, usos: 2, aplicaEstado: "Enredado", descripcion: "Aplica Enredado (SPD -40%)." },
                { id: "frenesia_organica", nombre: "Frenesía Orgánica", tipo: "Buff", slot: 3, buffAtk: 0.35, duracion: 3, usos: 1, restriccion: "no_soporte", descripcion: "ATK +35% pero sin soporte." }
            ],
            definitivos: [
                { id: "gran_regeneracion", nombre: "Gran Regeneración", tipo: "Definitivo", slot: 4, curacion: 0.35, aplicaEstado: "Regeneracion", precision: 100, usos: 1, descripcion: "Cura 35% y da Regeneración." }
            ]
        },
        "Sintético": { basicos: [{ id: "golpe_sintetico", nombre: "Golpe Sintético", slot: 1, potencia: 0.85, precision: 100, usos: 99}], especiales: [{ id: "rayo_sintetico", nombre: "Rayo Láser", slot: 2, potencia: 1.10, precision: 95, usos: 5}], soportes: [{ id: "sobrecarga", nombre: "Sobrecarga", slot: 3, curacion: 0.15, usos: 3}], definitivos: [{ id: "borrado_sistema", nombre: "Borrado de Sistema", slot: 4, potencia: 2.0, usos: 1}] },
        "Viral": { basicos: [{ id: "golpe_viral", nombre: "Arañazo Viral", slot: 1, potencia: 0.85, precision: 100, usos: 99}], especiales: [{ id: "saliva_viral", nombre: "Saliva Tóxica", slot: 2, potencia: 1.10, precision: 95, usos: 5}], soportes: [{ id: "mutacion", nombre: "Mutación", slot: 3, curacion: 0.15, usos: 3}], definitivos: [{ id: "pandemia", nombre: "Pandemia Global", slot: 4, potencia: 1.5, aplicaEstado: "Infeccion", usos: 1}] },
        "Cibernético": { basicos: [{ id: "golpe_ciber", nombre: "Puño Metálico", slot: 1, potencia: 0.85, precision: 100, usos: 99}], especiales: [{ id: "corte_plasma", nombre: "Corte Plasma", slot: 2, potencia: 1.10, precision: 95, usos: 5}], soportes: [{ id: "escudo_energia", nombre: "Escudo Energía", slot: 3, curacion: 0.15, usos: 3}], definitivos: [{ id: "colapso", nombre: "Colapso Núcleo", slot: 4, potencia: 2.0, usos: 1}] },
        "Radiactivo": { basicos: [{ id: "golpe_rad", nombre: "Golpe Isótopo", slot: 1, potencia: 0.85, precision: 100, usos: 99}], especiales: [{ id: "onda_gamma", nombre: "Onda Gamma", slot: 2, potencia: 1.10, precision: 95, usos: 5}], soportes: [{ id: "brillo_toxico", nombre: "Brillo Tóxico", slot: 3, curacion: 0.15, usos: 3}], definitivos: [{ id: "fision", nombre: "Fisión Nuclear", slot: 4, potencia: 2.0, usos: 1}] },
        "Tóxico": { basicos: [{ id: "golpe_tox", nombre: "Golpe Ácido", slot: 1, potencia: 0.85, precision: 100, usos: 99}], especiales: [{ id: "bomba_lodo", nombre: "Bomba Lodo", slot: 2, potencia: 1.10, precision: 95, usos: 5}], soportes: [{ id: "niebla_acida", nombre: "Niebla Ácida", slot: 3, curacion: 0.15, usos: 3}], definitivos: [{ id: "derretir", nombre: "Lluvia Corrosiva", slot: 4, potencia: 1.5, aplicaEstado: "Corrosion", usos: 1}] },
        "Normal": { basicos: [{ id: "placaje", nombre: "Placaje", slot: 1, potencia: 0.85, precision: 100, usos: 99}], especiales: [{ id: "golpe_fuerte", nombre: "Golpe Fuerte", slot: 2, potencia: 1.10, precision: 95, usos: 5}], soportes: [{ id: "descanso", nombre: "Descanso", slot: 3, curacion: 0.15, usos: 3}], definitivos: [{ id: "hiperrayo", nombre: "Hiperrayo", slot: 4, potencia: 2.0, usos: 1}] }
    },

    equiparAtaquesBase: function(elemento) {
        // Busca en el catálogo o usa Normal como fallback por si acaso
        const elementData = this.movimientos[elemento] || this.movimientos["Normal"];
        return [
            { ...elementData.basicos[0], usosRestantes: elementData.basicos[0].usos },
            { ...elementData.especiales[0], usosRestantes: elementData.especiales[0].usos },
            { ...elementData.soportes[0], usosRestantes: elementData.soportes[0].usos },
            { ...elementData.definitivos[0], usosRestantes: elementData.definitivos[0].usos }
        ];
    }
};