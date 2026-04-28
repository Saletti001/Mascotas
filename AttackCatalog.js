// =========================================
// AttackCatalog.js - DICCIONARIO MAESTRO DE COMBATE V1.0 (54 ATAQUES)
// =========================================

window.AttackCatalog = {
    // 1. DICCIONARIO DE ESTADOS ALTERADOS [cite: 400]
    estados: {
        "Regeneracion": { tipo: "buff", duracionBase: 3, efecto: "cura", valor: 0.15, apilable: true, maxStack: 15 },
        "Infeccion": { tipo: "debuff", duracionBase: 2, efecto: "baja_stat_random", valor: 0.20, apilable: true, maxStack: 3 },
        "Quemadura": { tipo: "dot", duracionBase: 3, efecto: "dano_hp", valor: 0.06, apilable_duracion: true },
        "Veneno": { tipo: "dot", duracionBase: 3, efecto: "dano_hp", valor: 0.05, apilable_intensidad: true, maxStack: 3 },
        "Paralisis": { tipo: "control", duracionBase: 2, efecto: "baja_spd", valor: 0.35, probPerderTurno: 0.30, maxStack: 1 },
        "Congelacion": { tipo: "control", duracionBase: 1, efecto: "pierde_turno", inmunidadPost: 2 },
        "Vision Nublada": { tipo: "debuff", duracionBase: 2, efecto: "baja_acc", valor: 0.25, apilable: true, maxStack: 45 },
        "Enredado": { tipo: "control", duracionBase: 2, efecto: "baja_spd_bloquea_soporte", valor: 0.40, maxStack: 1 },
        "Corrosion": { tipo: "debuff", duracionBase: 999, efecto: "baja_atk_permanente", valor: 0.15, apilable: true, maxStack: 3 },
        "Campo Radiactivo": { tipo: "dot", duracionBase: 3, efecto: "dano_hp_fijo", valor: 0.05 },
        "Irradiacion": { tipo: "debuff", duracionBase: 3, efecto: "baja_atk", valor: 0.25 }
    },

    // 2. CATÁLOGO DE MOVIMIENTOS POR ELEMENTO (54 Ataques)
    ataquesPorElemento: {
        
        // --- 🌿 BIOMUTANTE (Sustentación y Resiliencia) ---
        "Biomutante": {
            basicos: [
                { id: "pulso_vital", nombre: "Pulso Vital", slot: 1, potencia: 85, precision: 100, usos: 99, descripcion: "Ataque básico de masa orgánica." } // [cite: 160, 163]
            ],
            especiales: [
                { id: "espinas_oseas", nombre: "Espinas Óseas", slot: 2, potencia: 95, precision: 95, usos: 5, rompeEscudos: 0.30, descripcion: "Penetra 30% de escudos y defensa." }, // [cite: 164, 167]
                { id: "oleada_mutante", nombre: "Oleada Mutante", slot: 2, potencia: 130, precision: 85, usos: 4, descripcion: "Golpe poderoso de energía orgánica." }, // [cite: 168, 171]
                { id: "transferencia_carga", nombre: "Transferencia de Carga", slot: 2, potencia: 60, escalaConHP: true, precision: 100, usos: 99, descripcion: "Más daño cuanto más HP tienes (Max 90%)." } // [cite: 172, 176]
            ],
            soportes: [
                { id: "espora_curativa", nombre: "Espora Curativa", slot: 3, potencia: 0, curacion: 0.20, precision: 100, usos: 3, descripcion: "Restaura 20% de HP propio." }, // [cite: 177, 180]
                { id: "membrana_fortalecida", nombre: "Membrana Fortalecida", slot: 3, potencia: 0, escudo: 0.25, duracion: 2, precision: 100, usos: 2, descripcion: "Escudo del 25% del ATK rival." }, // [cite: 181, 184]
                { id: "raiz_enredadora", nombre: "Raíz Enredadora", slot: 3, potencia: 40, aplicaEstado: "Enredado", precision: 100, usos: 3, descripcion: "Aplica Enredado (SPD -40%)." }, // [cite: 185, 188]
                { id: "frenesia_organica", nombre: "Frenesía Orgánica", slot: 3, potencia: 0, buffAtk: 0.35, duracion: 3, restriccion: "no_soporte", precision: 100, usos: 1, descripcion: "ATK +35% durante 3 turnos." } // [cite: 189, 192]
            ],
            definitivos: [
                { id: "gran_regeneracion", nombre: "Gran Regeneración", slot: 4, potencia: 60, curacion: 0.50, precision: 100, usos: 1, descripcion: "Causa daño y cura el 50% de tu HP Máximo." },
                { id: "ira_naturaleza", nombre: "Ira de la Naturaleza", slot: 4, potencia: 130, perforante: true, precision: 90, usos: 1, descripcion: "Golpe brutal que ignora el 100% de la DEF rival." },
                { id: "esporas_drenantes", nombre: "Esporas Drenantes", slot: 4, potencia: 80, aplicaEstado: "Enredado", probEstado: 1.0, curacion: 0.20, usos: 1, descripcion: "Causa daño, cura 20% HP y atrapa al rival (Enredado)." }
            ]
        },

        // --- 🦠 VIRAL (Control y Deterioro por desgaste) ---
        "Viral": {
            basicos: [
                { id: "descarga_viral", nombre: "Descarga Viral", slot: 1, potencia: 80, aplicaEstado: "Infeccion", probEstado: 0.25, precision: 100, usos: 99, descripcion: "25% prob. de infectar al rival." } // [cite: 201, 204]
            ],
            especiales: [
                { id: "infeccion_aguda", nombre: "Infección Aguda", slot: 2, potencia: 30, aplicaEstado: "Infeccion", probEstado: 1.00, statObjetivo: "max", precision: 100, usos: 4, descripcion: "Infección garantizada al mejor stat del rival." }, // [cite: 205, 208]
                { id: "disolucion_celular", nombre: "Disolución Celular", slot: 2, potencia: 100, bonusPorEstado: 20, precision: 90, usos: 99, descripcion: "Hace +20% daño por cada estado en el rival." }, // [cite: 209, 212]
                { id: "proliferacion", nombre: "Proliferación", slot: 2, potencia: 70, bonusMultiplicador: 2.0, requiereEstado: "Infeccion", precision: 100, usos: 99, descripcion: "Doble daño si el rival está Infectado." } // [cite: 213, 216]
            ],
            soportes: [
                { id: "niebla_viral", nombre: "Niebla Viral", slot: 3, potencia: 0, aplicaEstado: "Vision Nublada", precision: 100, usos: 2, descripcion: "Precisión del rival -25% por 2 turnos." }, // [cite: 217, 220]
                { id: "adaptacion_viral", nombre: "Adaptación Viral", slot: 3, potencia: 0, buffSpd: 0.30, duracion: 3, precision: 100, usos: 2, descripcion: "Velocidad propia +30% por 3 turnos." }, // [cite: 221, 224]
                { id: "cepa_parasita", nombre: "Cepa Parásita", slot: 3, potencia: 70, roboVida: 0.30, precision: 95, usos: 99, descripcion: "Roba 30% del daño causado como HP." }, // [cite: 225, 228]
                { id: "evasion_viral", nombre: "Evasión Viral", slot: 3, potencia: 0, buffEvasion: 0.60, duracion: 1, precision: 100, usos: 3, descripcion: "60% prob. de evadir el próximo ataque." } // [cite: 229, 232]
            ],
            definitivos: [
                { id: "pandemia_global", nombre: "Pandemia Global", slot: 4, potencia: 40, hits: 3, aplicaEstado: "Infeccion", probEstado: 0.80, precision: 95, usos: 1, descripcion: "3 golpes. 80% prob. de aplicar Infección por golpe." },
                { id: "asimilacion_celular", nombre: "Asimilación Celular", slot: 4, potencia: 100, aplicaEstado: "Corrosion", probEstado: 1.0, curacion: 0.25, usos: 1, descripcion: "Roba 25% HP y aplica Corrosión (ATK -15% permanente)." },
                { id: "falla_genetica", nombre: "Falla Genética", slot: 4, potencia: 0, aplicaEstado: "Paralisis", probEstado: 1.0, debuffAtk: 0.30, duracion: 3, usos: 1, descripcion: "Paraliza al rival y reduce su ATK un 30% por 3 turnos." }
            ]
        },

        // --- 🤖 CIBERNÉTICO (Precisión, Escudos y Contraataques) ---
        "Cibernético": {
            basicos: [
                { id: "laser_precision", nombre: "Láser de Precisión", slot: 1, potencia: 75, precision: 1000, noFalla: true, usos: 99, descripcion: "Ataque quirúrgico que nunca falla." } // [cite: 241, 244]
            ],
            especiales: [
                { id: "descarga_cadena", nombre: "Descarga en Cadena", slot: 2, potencia: 35, hits: 3, precision: 95, usos: 99, descripcion: "Golpea 3 veces. Excelente contra escudos." }, // [cite: 245, 249]
                { id: "disparo_perforante", nombre: "Disparo Perforante", slot: 2, potencia: 110, perforante: true, precision: 90, usos: 3, descripcion: "Ignora el 100% de la DEF rival." }, // [cite: 250, 253]
                { id: "contrarrestar", nombre: "Contrarrestar", slot: 2, potencia: 0, reactivo: 0.40, precision: 100, usos: 99, descripcion: "Devuelve el 40% del daño recibido el último turno." } // [cite: 254, 257]
            ],
            soportes: [
                { id: "protocolo_escudo", nombre: "Protocolo de Escudo", slot: 3, potencia: 0, escudo: 0.35, duracion: 3, precision: 100, usos: 2, descripcion: "Escudo 35% ATK rival. Se suma a DEF." }, // [cite: 258, 262]
                { id: "interferencia", nombre: "Interferencia Electromagnética", slot: 3, potencia: 0, limpiaBuffsRival: true, precision: 100, usos: 2, descripcion: "Elimina todos los buffs activos del rival." }, // [cite: 263, 266]
                { id: "sobrecarga_sistema", nombre: "Sobrecarga del Sistema", slot: 3, potencia: 0, buffAtk: 0.50, costoHpTurno: 0.08, duracion: 2, precision: 100, usos: 2, descripcion: "ATK +50% pero pierdes 8% HP por turno." }, // [cite: 267, 270]
                { id: "recalibrado_rapido", nombre: "Recalibrado Rápido", slot: 3, potencia: 0, buffSpd: 0.25, proximoHitGarantizado: true, precision: 100, usos: 3, descripcion: "SPD +25% y próximo ataque no falla." } // [cite: 271, 274]
            ],
            definitivos: [
                { id: "colapso_sistema", nombre: "Colapso del Sistema", slot: 4, potencia: 110, rompeEscudos: true, aplicaEstado: "Paralisis", probEstado: 0.60, precision: 100, usos: 1, descripcion: "Ignora escudos y tiene 60% prob. de Paralizar." },
                { id: "canon_orbital", nombre: "Cañón Orbital", slot: 4, potencia: 140, criticoGarantizado: true, precision: 85, usos: 1, descripcion: "Precisión 85%, pero si acierta es un Crítico garantizado." },
                { id: "matriz_sobrecarga", nombre: "Matriz de Sobrecarga", slot: 4, potencia: 180, aplicaEstadoPropio: "Sobrecarga", probEstado: 1.0, precision: 100, usos: 1, descripcion: "Poder devastador, pero el usuario sufre Sobrecarga." }
            ]
        },

        // --- ☢️ RADIACTIVO (Daño continuo y presión) ---
        "Radiactivo": {
            basicos: [
                { id: "proyectil_radiactivo", nombre: "Proyectil Radiactivo", slot: 1, potencia: 85, aplicaEstado: "Quemadura", probEstado: 0.30, precision: 100, usos: 99, descripcion: "30% prob. de aplicar Quemadura." } // [cite: 282, 285]
            ],
            especiales: [
                { id: "explosion_nuclear", nombre: "Explosión Nuclear", slot: 2, potencia: 140, bonusContraEstado: "Quemadura", multiplier: 1.25, precision: 80, usos: 3, descripcion: "Daño masivo. Más letal si el rival arde." }, // [cite: 286, 289]
                { id: "lluvia_cenizas", nombre: "Lluvia de Cenizas", slot: 2, potencia: 70, debuffAcc: 0.20, duracion: 2, precision: 100, usos: 99, descripcion: "Daña y reduce 20% la Precisión rival." }, // [cite: 290, 293]
                { id: "pulso_decaimiento", nombre: "Pulso de Decaimiento", slot: 2, potencia: 60, debuffLuk: 0.40, duracion: 3, precision: 95, usos: 4, descripcion: "Daña y arruina la Suerte (LUK) rival." } // [cite: 294, 297]
            ],
            soportes: [
                { id: "campo_radioactivo", nombre: "Campo Radioactivo", slot: 3, potencia: 0, aplicaEstado: "Campo Radiactivo", precision: 100, usos: 2, descripcion: "Crea un campo que daña 5% HP x3 turnos." }, // [cite: 298, 301]
                { id: "irradiacion", nombre: "Irradiación", slot: 3, potencia: 25, aplicaEstado: "Irradiacion", precision: 100, usos: 3, descripcion: "Golpe leve que baja ATK rival 25% x3 turnos." }, // [cite: 302, 305]
                { id: "nucleo_ardiente", nombre: "Núcleo Ardiente", slot: 3, potencia: 0, buffPasivo: "Quemadura", duracion: 2, precision: 100, usos: 2, descripcion: "Amplifica tus Quemaduras a 5% HP/turno." }, // [cite: 306, 309]
                { id: "autoirradiacion", nombre: "Autoirradiación", slot: 3, potencia: 0, costoHp: 0.12, buffProxAtaque: 0.60, precision: 100, usos: 2, descripcion: "Pierdes 12% HP para dar +60% potencia al prox hit." } // [cite: 310, 313]
            ],
            definitivos: [
                { id: "critico_nuclear", nombre: "Crítico Nuclear", slot: 4, potencia: 120, aplicaEstado: "Campo Radiactivo", probEstado: 1.0, precision: 90, usos: 1, descripcion: "Gran daño. Envuelve al rival en un Campo Radiactivo." },
                { id: "fision_inestable", nombre: "Fisión Inestable", slot: 4, potencia: 160, aplicaEstadoPropio: "Quemadura", probEstado: 1.0, precision: 100, usos: 1, descripcion: "Daño masivo, pero el usuario sufre Quemadura." },
                { id: "desintegracion_atomica", nombre: "Desintegración Atómica", slot: 4, potencia: 95, perforante: true, aplicaEstado: "Irradiacion", probEstado: 1.0, usos: 1, descripcion: "Ignora DEF y aplica Irradiación (ATK rival -25%)." }
            ]
        },

        // --- ☣️ TÓXICO (Corrosión permanente) ---
        "Tóxico": {
            basicos: [
                { id: "colmillo_venenoso", nombre: "Colmillo Venenoso", slot: 1, potencia: 80, aplicaEstado: "Veneno", probEstado: 0.35, precision: 100, usos: 99, descripcion: "35% prob. de envenenar. Acumulable." } // [cite: 321, 324]
            ],
            especiales: [
                { id: "veneno_mortal", nombre: "Veneno Mortal", slot: 2, potencia: 40, aplicaEstado: "Veneno Fuerte", probEstado: 1.00, precision: 100, usos: 3, descripcion: "Aplica Veneno letal (-8% HP x2 turnos)." }, // [cite: 325, 328]
                { id: "corrosion_acido", nombre: "Corrosión de Ácido", slot: 2, potencia: 50, aplicaEstado: "Corrosion", precision: 100, usos: 3, descripcion: "Daña y baja ATK rival 15% de forma PERMANENTE." }, // [cite: 329, 333]
                { id: "espina_toxica", nombre: "Espina Tóxica", slot: 2, potencia: 65, prioridad: 1, aplicaEstado: "Veneno", probEstado: 0.25, precision: 100, usos: 99, descripcion: "Ataque rápido con prioridad. 25% prob Veneno." } // [cite: 334, 337]
            ],
            soportes: [
                { id: "nube_toxica", nombre: "Nube Tóxica", slot: 3, potencia: 0, debuffAtk: 0.20, debuffSpd: 0.15, duracion: 2, precision: 100, usos: 2, descripcion: "Baja ATK y SPD del rival por 2 turnos." }, // [cite: 338, 341]
                { id: "inmunizacion_toxica", nombre: "Inmunización Tóxica", slot: 3, potencia: 0, inmunidadEstados: 2, buffDanoPropioVeneno: 0.20, precision: 100, usos: 1, descripcion: "Te hace inmune a estados por 2 turnos." }, // [cite: 342, 345]
                { id: "drenaje_esencia", nombre: "Drenaje de Esencia", slot: 3, potencia: 65, roboVida: 0.25, aplicaEstado: "Veneno", probEstado: 0.20, precision: 100, usos: 99, descripcion: "Roba 25% de salud y puede envenenar." }, // [cite: 346, 349]
                { id: "concentrar_veneno", nombre: "Concentrar Veneno", slot: 3, potencia: 0, duplicaSiguienteVeneno: true, precision: 100, usos: 3, descripcion: "El prox veneno que apliques es el doble de fuerte." } // [cite: 350, 353]
            ],
            definitivos: [
                { id: "plaga_final", nombre: "Plaga Final", slot: 4, potenciaBase: 60, bonusPorEstado: 40, precision: 100, usos: 1, descripcion: "Poder 60. Aumenta +40 de potencia por cada estado en el rival." },
                { id: "lluvia_acida", nombre: "Lluvia Ácida", slot: 4, potencia: 30, hits: 4, aplicaEstado: "Veneno Fuerte", probEstado: 0.50, precision: 95, usos: 1, descripcion: "4 impactos. 50% prob. de Veneno Fuerte por golpe." },
                { id: "niebla_asfixiante", nombre: "Niebla Asfixiante", slot: 4, potencia: 75, aplicaEstado: "Vision Nublada", probEstado: 1.0, debuffSpd: 0.30, usos: 1, descripcion: "Aplica Visión Nublada (Fallo) y reduce SPD rival 30%." }
            ]
        },

        // --- ⚙️ SINTÉTICO (Velocidad y Críticos) ---
        "Sintético": {
            basicos: [
                { id: "rafaga_sintetica", nombre: "Ráfaga Sintética", slot: 1, potencia: 85, bonusCrit: 0.15, precision: 100, usos: 99, descripcion: "Ataque básico con 15% prob. extra de Crítico." } // [cite: 362, 365]
            ],
            especiales: [
                { id: "golpe_certero", nombre: "Golpe Certero", slot: 2, potencia: 60, criticoGarantizado: true, precision: 100, usos: 99, descripcion: "Golpe Crítico garantizado (x1.5 daño)." }, // [cite: 366, 369]
                { id: "impacto_total", nombre: "Impacto Total", slot: 2, potencia: 70, bonusSiPrimero: 150, precision: 95, usos: 99, descripcion: "Si actúas antes que el rival, potencia es 150%." }, // [cite: 370, 373]
                { id: "ataque_relampago", nombre: "Ataque Relámpago", slot: 2, potencia: 55, prioridad: 2, precision: 100, usos: 99, descripcion: "Prioridad máxima. Golpea antes de todo." } // [cite: 374, 377]
            ],
            soportes: [
                { id: "golpe_paralizante", nombre: "Golpe Paralizante", slot: 3, potencia: 70, aplicaEstado: "Paralisis", probEstado: 0.40, precision: 100, usos: 4, descripcion: "Daño y 40% prob. de Paralizar al rival." }, // [cite: 378, 381]
                { id: "aceleracion_sintetica", nombre: "Aceleración Sintética", slot: 3, potencia: 0, buffSpd: 0.45, duracion: 3, precision: 100, usos: 2, descripcion: "Velocidad propia +45% durante 3 turnos." }, // [cite: 382, 385]
                { id: "potenciador_critico", nombre: "Potenciador de Crítico", slot: 3, potencia: 0, buffLukEfectiva: 0.50, duracion: 2, precision: 100, usos: 2, descripcion: "Suerte (LUK) propia +50% por 2 turnos." }, // [cite: 386, 389]
                { id: "esquiva_calculada", nombre: "Esquiva Calculada", slot: 3, potencia: 0, probEvasion: 0.75, buffSpdSiEvade: 0.10, precision: 100, usos: 3, descripcion: "75% prob evasión. Si esquivas, SPD +10%." } // [cite: 390, 393]
            ],
            definitivos: [
                { id: "tormenta_criticos", nombre: "Tormenta de Críticos", slot: 4, potencia: 25, hits: 5, bonusCrit: 0.20, precision: 90, usos: 1, descripcion: "5 golpes ultrarrápidos con +20% de prob. de Crítico." },
                { id: "aceleracion_cuantica", nombre: "Aceleración Cuántica", slot: 4, potencia: 85, buffSpd: 0.50, buffAtk: 0.50, duracion: 3, precision: 100, usos: 1, descripcion: "Golpea y otorga +50% SPD y +50% ATK al usuario." },
                { id: "impacto_prisma", nombre: "Impacto Prisma", slot: 4, potencia: 90, bonusSiPrimero: 150, precision: 100, usos: 1, descripcion: "Potencia 90. Sube a 150 si el usuario ataca primero." }
            ]
        }
    }
};