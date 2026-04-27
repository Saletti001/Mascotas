// =========================================
// ColiseumLogic.js - MODELO MATEMÁTICO V13.6 (LOG DE PASIVA BIOMUTANTE)
// =========================================

window.ColiseumLogic = {
    player: null,
    enemy: null,
    turno: 1,

    cName: function(fighter) {
        const color = fighter.isPlayer ? "#4dd0e1" : "#ff6b6b";
        return `<span style="color:${color}; font-weight:bold;">${fighter.nombre}</span>`;
    },

    generarNombreAleatorio: function() {
        const prefijos = ["Nex", "Crio", "Bio", "Zar", "Vor", "Kael", "Lum", "Pyro", "Grav", "Aero", "Tox", "Muta", "Viro"];
        const sufijos = ["core", "morph", "tron", "lith", "pex", "byte", "spark", "fang", "claw", "pulse", "shade", "vibe", "gen"];
        return prefijos[Math.floor(Math.random() * prefijos.length)] + sufijos[Math.floor(Math.random() * sufijos.length)];
    },

    buscarAtaquePorNombre: function(nombreItem) {
        if (!nombreItem || !window.AttackCatalog) return null;
        let nomNormalizado = nombreItem.replace(/💿/g, "").replace(/MT /gi, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
        let catalogoAUsar = window.AttackCatalog.ataquesPorElemento || window.AttackCatalog.movimientos;
        if (!catalogoAUsar) return null;

        for (const el in catalogoAUsar) {
            const ramas = catalogoAUsar[el];
            for (const cat in ramas) {
                let encontrado = ramas[cat].find(a => nomNormalizado.includes(a.nombre.toLowerCase()) || a.nombre.toLowerCase().includes(nomNormalizado));
                if (encontrado) return { ...encontrado, elemento: el };
            }
        }
        return null;
    },

    obtenerAtaqueAleatorio: function(elemento, categoria) {
        if (!window.AttackCatalog) return null;
        let catalogoAUsar = window.AttackCatalog.ataquesPorElemento || window.AttackCatalog.movimientos;
        if (!catalogoAUsar || !catalogoAUsar[elemento]) return null;
        const lista = catalogoAUsar[elemento][categoria];
        if (!lista || lista.length === 0) return null;
        return { ...lista[Math.floor(Math.random() * lista.length)], elemento: elemento };
    },

    generarRivalProcedural: function(nivelJugador) {
        let eRareza = "Común"; let roll = Math.random();
        let poderJugador = 100; 
        if (this.player) poderJugador = this.player.maxHp + this.player.atk + this.player.def + this.player.spd + this.player.luk;

        if (poderJugador < 130) eRareza = roll < 0.85 ? "Común" : "Raro"; 
        else if (poderJugador < 170) eRareza = roll < 0.60 ? "Común" : (roll < 0.90 ? "Raro" : "Épico"); 
        else eRareza = roll < 0.30 ? "Raro" : (roll < 0.70 ? "Épico" : "Legendario"); 
        
        const eStats = window.generarStatsPorRareza ? window.generarStatsPorRareza(eRareza) : {hp: 60, atk: 12, def: 8, spd: 10, luk: 5};
        let puntosExtra = (nivelJugador > 1) ? (nivelJugador - 1) * 3 : 0;
        for(let i=0; i<puntosExtra; i++) {
            const stats = ['hp', 'atk', 'def', 'spd', 'luk'];
            const rStat = stats[Math.floor(Math.random() * stats.length)];
            if(rStat === 'hp') eStats.hp += 5; else eStats[rStat] += 1;
        }
            
        const elementos = ["Biomutante", "Viral", "Cibernético", "Radiactivo", "Tóxico", "Sintético"];
        const eElemento = elementos[Math.floor(Math.random() * elementos.length)];
        const formas = ["gota", "frijol", "circulo", "cuadrado", "triangulo", "hongo", "estrella", "pentagono", "nube", "chili", "rayo"];
        const colores = ["#ff6b6b", "#4dd0e1", "#fdfd96", "#b19cd9", "#77DD77", "#ff9800", "#ffb347", "#a8e6cf"];
        const opcionesOjos = typeof dicOjos !== 'undefined' ? Object.keys(dicOjos) : ["estandar", "cute", "angry", "cibernetico", "alien", "ojeras"];
        const opcionesBocas = typeof dicBocas !== 'undefined' ? Object.keys(dicBocas) : ["estandar", "feliz", "colmillos", "abierta", "sorpresa", "lengua"];
        
        const opcionesSombreros = typeof dicSombreros !== 'undefined' ? Object.keys(dicSombreros).filter(k => k !== "ninguno") : ["gorra", "corona", "casco", "cinta"];
        const opcionesAlas = typeof dicAlas !== 'undefined' ? Object.keys(dicAlas).filter(k => k !== "ninguno") : ["alas_angel", "alas_murcielago", "jetpack", "capa"];
        const opcionesGafas = typeof dicGafas !== 'undefined' ? Object.keys(dicGafas).filter(k => k !== "ninguno") : ["lentes", "parche", "visor", "monoculo"];
        const opcionesExtras = typeof dicExtras !== 'undefined' ? Object.keys(dicExtras).filter(k => k !== "ninguno") : ["bufanda", "collar", "auriculares", "corbata"];

        let probBase = eRareza === "Legendario" ? 0.85 : (eRareza === "Épico" ? 0.65 : (eRareza === "Raro" ? 0.40 : 0.15));
        let cantidadAccesorios = 0;

        if (Math.random() < probBase) {
            cantidadAccesorios = 1;
            let probExtra = probBase * 0.6; 
            if (Math.random() < probExtra) {
                cantidadAccesorios = 2;
                if (Math.random() < (probExtra * 0.5)) { 
                    cantidadAccesorios = 3;
                    if (Math.random() < (probExtra * 0.25)) cantidadAccesorios = 4; 
                }
            }
        }

        let eHat = "ninguno", eWing = "ninguno", eGlasses = "ninguno", eExtra = "ninguno";
        if (cantidadAccesorios > 0) {
            let slotsDisponibles = ["hat", "wing", "glasses", "extra"].sort(() => 0.5 - Math.random()).slice(0, cantidadAccesorios);
            if (slotsDisponibles.includes("hat") && opcionesSombreros.length > 0) eHat = opcionesSombreros[Math.floor(Math.random() * opcionesSombreros.length)];
            if (slotsDisponibles.includes("wing") && opcionesAlas.length > 0) eWing = opcionesAlas[Math.floor(Math.random() * opcionesAlas.length)];
            if (slotsDisponibles.includes("glasses") && opcionesGafas.length > 0) eGlasses = opcionesGafas[Math.floor(Math.random() * opcionesGafas.length)];
            if (slotsDisponibles.includes("extra") && opcionesExtras.length > 0) eExtra = opcionesExtras[Math.floor(Math.random() * opcionesExtras.length)];
        }

        let eHiddenGenes = {A: null, B: null, C: null};
        if (typeof window.generarGenesV9 === 'function') eHiddenGenes = window.generarGenesV9(eRareza);
        
        const adn = { 
            id: 888, scanned: true, rarity: eRareza, stats: eStats, element: eElemento,
            body_shape: formas[Math.floor(Math.random() * formas.length)], color: colores[Math.floor(Math.random() * colores.length)],
            eye_type: opcionesOjos[Math.floor(Math.random() * opcionesOjos.length)], mouth_type: opcionesBocas[Math.floor(Math.random() * opcionesBocas.length)], 
            wing_type: eWing, hat_type: eHat, glasses_type: eGlasses, extra_type: eExtra,
            hidden_genes: eHiddenGenes, level: nivelJugador
        };

        let pAtks = window.miMascota && window.miMascota.ataques ? window.miMascota.ataques : {};
        let enemyAtaques = {
            "ataque": this.obtenerAtaqueAleatorio(eElemento, "basicos"),
            "especial": pAtks.atk_2 ? this.obtenerAtaqueAleatorio(eElemento, "especiales") : null,
            "tactica": pAtks.atk_3 ? this.obtenerAtaqueAleatorio(eElemento, "soportes") : null,
            "definitivo": (pAtks.atk_4 && nivelJugador >= 25) ? this.obtenerAtaqueAleatorio(eElemento, "definitivos") : null
        };
        
        let gB = (eHiddenGenes.B?.id || "ninguno").toLowerCase();
        let gC = (eHiddenGenes.C?.id || "ninguno").toLowerCase();

        this.enemy = {
            nombre: this.generarNombreAleatorio(), isPlayer: false, adn: adn,
            maxHp: eStats.hp, hp: eStats.hp, atk: eStats.atk, def: eStats.def || 5, spd: eStats.spd, luk: eStats.luk,
            baseAtk: eStats.atk, baseDef: eStats.def || 5, baseSpd: eStats.spd, baseLuk: eStats.luk,
            element: eElemento, rareza: eRareza, genesId: [gB, gC],
            estados: [], efectosActivos: [], cooldowns: { especial: 0, tactica: 0, definitivo: 0 },
            escudoCibernetico: eElemento === "Cibernético", 
            crystalSkin: gB === "piel_cristal" || gC === "piel_cristal",
            decoyUsado: false, coreArUsado: false, rachaGolpes: 0, adaptativaStacks: 0, ultimoElementoRecibido: null,
            danoRecibidoEsteTurno: 0, danoRecibidoTurnoAnterior: 0, proxVenenoDoble: false,
            ataquesEquipados: enemyAtaques
        };
    },

    prepararJugador: function(mascota) {
        const pElemento = (mascota.genes && mascota.genes.afinidad) ? mascota.genes.afinidad.dom : (mascota.element || "Normal");
        const pStats = { hp: mascota.stats?.hp || 80, atk: mascota.stats?.atk || 15, def: mascota.stats?.def || 5, spd: mascota.stats?.spd || 15, luk: mascota.stats?.luk || 10 };
        
        let pGenB = (mascota.hidden_genes?.B?.id || "ninguno").toLowerCase(); 
        let pGenC = (mascota.hidden_genes?.C?.id || "ninguno").toLowerCase();
        
        let pAtks = mascota.ataques || {};
        let playerAtaques = {
            "ataque": this.obtenerAtaqueAleatorio(pElemento, "basicos"),
            "especial": pAtks.atk_2 ? this.buscarAtaquePorNombre(pAtks.atk_2.nombre) : null,
            "tactica": pAtks.atk_3 ? this.buscarAtaquePorNombre(pAtks.atk_3.nombre) : null,
            "definitivo": pAtks.atk_4 ? this.buscarAtaquePorNombre(pAtks.atk_4.nombre) : null
        };

        this.player = {
            nombre: mascota.alias || mascota.apodo || mascota.nombre || mascota.name || "Tu Geno", 
            isPlayer: true, adn: mascota,
            maxHp: pStats.hp, hp: pStats.hp, atk: pStats.atk, def: pStats.def, spd: pStats.spd, luk: pStats.luk,
            baseAtk: pStats.atk, baseDef: pStats.def, baseSpd: pStats.spd, baseLuk: pStats.luk,
            element: pElemento, rareza: mascota.rarity || "Común", genesId: [pGenB, pGenC], 
            estados: [], efectosActivos: [], cooldowns: { especial: 0, tactica: 0, definitivo: 0 },
            escudoCibernetico: pElemento === "Cibernético", 
            crystalSkin: pGenB === "piel_cristal" || pGenC === "piel_cristal",
            decoyUsado: false, coreArUsado: false, rachaGolpes: 0, adaptativaStacks: 0, ultimoElementoRecibido: null,
            danoRecibidoEsteTurno: 0, danoRecibidoTurnoAnterior: 0, proxVenenoDoble: false,
            ataquesEquipados: playerAtaques
        };
        this.turno = 1;
    },

    ejecutarAtaqueCompleto: function(atacante, defensor, slotAccion) {
        let logs = [];
        let anims = { atacanteGrita: true, danoDefensor: 0, critico: false, curacionAtacante: 0, danoReflejo: 0, multElem: 1, detalleGolpes: [] };
        
        let ataqueReal = atacante.ataquesEquipados[slotAccion];
        if (!ataqueReal) {
            logs.push(`<span style="color:#888;">> ${this.cName(atacante)} intenta atacar pero tropieza.</span>`);
            return { logs, anims };
        }

        if (slotAccion === "definitivo" && defensor.genesId.includes("ults_counter")) {
            let buffAtk = Math.floor(defensor.baseAtk * 0.30);
            defensor.atk += buffAtk;
            defensor.efectosActivos.push({ nombre: "Contra-Golpe", stat: "atk", valor: buffAtk, turnos: 2, isNuevo: true });
            logs.push(`<span style="color:#ff3333">🔥 🧬 [Gen Oculto: Contra-Golpe] ¡${this.cName(defensor)} gana +30% ATK por la adrenalina del Definitivo!</span>`);
        }

        if (slotAccion === "especial") {
            atacante.cooldowns.especial = 3;
            logs.push(`<span style="color:#e040fb">> ¡${this.cName(atacante)} usa [${ataqueReal.nombre}]!</span>`);
            if(ataqueReal.descripcion) logs.push(`<span style="color:#ce93d8; font-style:italic;">* Info: ${ataqueReal.descripcion}</span>`);
        } else if (slotAccion === "definitivo") {
            atacante.cooldowns.definitivo = 5;
            logs.push(`<span style="color:#ff0000; font-weight:bold; text-transform:uppercase;">> ¡${this.cName(atacante)} desata [${ataqueReal.nombre}]!</span>`);
            if(ataqueReal.descripcion) logs.push(`<span style="color:#ff8a80; font-style:italic;">* Info: ${ataqueReal.descripcion}</span>`);
        } else if (slotAccion === "tactica") {
            atacante.cooldowns.tactica = 4;
            logs.push(`<span style="color:#26a69a">> ¡${this.cName(atacante)} prepara [${ataqueReal.nombre}]!</span>`);
            if(ataqueReal.descripcion) logs.push(`<span style="color:#80cbc4; font-style:italic;">* Efecto: ${ataqueReal.descripcion}</span>`);
        }

        let potenciaAtaque = ataqueReal.potencia || 0;

        if (ataqueReal.escalaConHP) {
            let pctHP = atacante.hp / atacante.maxHp;
            if (pctHP > 0.70) potenciaAtaque += Math.floor((pctHP - 0.70) * 100);
        }
        if (ataqueReal.bonusPorEstado) {
            potenciaAtaque += (defensor.estados.length * ataqueReal.bonusPorEstado);
        }
        if (ataqueReal.requiereEstado && defensor.estados.includes(ataqueReal.requiereEstado)) {
            potenciaAtaque *= (ataqueReal.bonusMultiplicador || 1);
        }
        if (ataqueReal.bonusContraEstado && defensor.estados.includes(ataqueReal.bonusContraEstado)) {
            potenciaAtaque *= (ataqueReal.multiplier || 1);
        }
        if (ataqueReal.bonusSiPrimero && (atacante.spd >= defensor.spd)) {
            potenciaAtaque = ataqueReal.bonusSiPrimero;
        }
        if (ataqueReal.duplicaSiguienteVeneno) {
            atacante.proxVenenoDoble = true;
        }

        if (ataqueReal.reactivo) {
            let danoPrevio = atacante.danoRecibidoEsteTurno > 0 ? atacante.danoRecibidoEsteTurno : (atacante.danoRecibidoTurnoAnterior || 0);
            let dmgDevuelto = Math.floor(danoPrevio * ataqueReal.reactivo);
            
            if (dmgDevuelto > 0) {
                defensor.hp = Math.max(0, defensor.hp - dmgDevuelto);
                anims.danoDefensor += dmgDevuelto;
                anims.detalleGolpes.push({ dmg: dmgDevuelto, critico: false, bloqueado: false, evadido: false });
                logs.push(`> ⚡ [Contrarrestar] ¡${this.cName(atacante)} devuelve el impacto y causa <span style="color:#ff6b6b; font-weight:bold;">${dmgDevuelto} de daño puro</span>!`);

                if (atacante.genesId.includes("vampirismo_genetico")) {
                    let roboVida = Math.max(1, Math.floor(dmgDevuelto * 0.15));
                    atacante.hp = Math.min(atacante.maxHp, atacante.hp + roboVida);
                    anims.curacionAtacante += roboVida;
                    logs.push(`<span style="color:#e0b0ff">🦇 🧬 [Gen Oculto: Vampirismo] ${this.cName(atacante)} recupera ${roboVida} HP.</span>`);
                }
            } else {
                logs.push(`<span style="color:#888;">> ...pero ${this.cName(atacante)} no había recibido daño reciente. ¡El contraataque falla!</span>`);
            }
        }

        if (potenciaAtaque > 0 && potenciaAtaque < 10) potenciaAtaque = potenciaAtaque * 100; 

        if (ataqueReal.curacion) {
            let cura = Math.floor(atacante.maxHp * ataqueReal.curacion);
            atacante.hp = Math.min(atacante.maxHp, atacante.hp + Math.max(1, cura));
            anims.curacionAtacante += cura;
            logs.push(`<span style="color:#4CAF50">* ${this.cName(atacante)} recupera ${cura} HP.</span>`);
        }

        if (potenciaAtaque > 0) {
            let numGolpes = ataqueReal.hits || 1;
            if (atacante.genesId.includes("velocidad_fantasma") && Math.random() <= 0.20 && numGolpes === 1) {
                numGolpes = 2;
                logs.push(`<span style="color:#b19cd9">⚡ 🧬 [Gen Oculto: Velocidad Fantasma] ¡${this.cName(atacante)} ataca rápido dos veces!</span>`);
            }

            for(let i=0; i<numGolpes; i++) {
                if (defensor.hp <= 0) break;
                
                let golpeActual = { dmg: 0, critico: false, bloqueado: false, evadido: false };

                let atkBruto = atacante.atk * (potenciaAtaque / 75) * (0.85 + Math.random() * 0.3);
                const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
                let multElem = ventajas[ataqueReal.elemento] === defensor.element ? 1.5 : (ventajas[defensor.element] === ataqueReal.elemento ? 0.5 : 1.0);
                atkBruto = atkBruto * multElem;
                anims.multElem = multElem;

                let defRival = defensor.def;

                if (ataqueReal.perforante || ataqueReal.rompeEscudos) {
                    if (defensor.genesId.includes("decoy") && !defensor.decoyUsado) {
                        defensor.decoyUsado = true;
                        atkBruto = 0; 
                        golpeActual.evadido = true;
                        logs.push(`<span style="color:#e0e0e0; font-style:italic;">💨 🧬 [Gen Oculto: Maestro del Engaño] ¡${this.cName(defensor)} evadió el golpe perforante!</span>`);
                    } else if (defensor.genesId.includes("steadfast")) {
                        defRival = Math.floor(defensor.def * 0.20); 
                        logs.push(`<span style="color:#80deea;">🛡️ 🧬 [Gen Oculto: Postura Inquebrantable] Absorbe parcialmente la perforación.</span>`);
                    } else {
                        defRival = 0;
                    }
                }

                let minDmgMultiplier = atacante.genesId.includes("min_dmg") ? 0.35 : 0.25;
                let dmgMinimo = Math.floor(atkBruto * minDmgMultiplier);
                let dmg = Math.floor(Math.max(atkBruto - defRival, dmgMinimo));

                if (defensor.genesId.includes("adapt_a") && atkBruto > 0) {
                    if (defensor.ultimoElementoRecibido === ataqueReal.elemento) {
                        defensor.adaptativaStacks = Math.min(5, defensor.adaptativaStacks + 1);
                    } else {
                        defensor.adaptativaStacks = 0;
                        defensor.ultimoElementoRecibido = ataqueReal.elemento;
                    }
                    if (defensor.adaptativaStacks > 0) {
                        dmg = Math.floor(dmg * (1 - (defensor.adaptativaStacks * 0.10)));
                        logs.push(`<span style="color:#80deea">🛡️ 🧬 [Gen Oculto: Armadura Adaptativa] Daño reducido un ${defensor.adaptativaStacks * 10}%.</span>`);
                    }
                }

                let probCrit = 0.05 + (atacante.luk * 0.002) + (atacante.element === "Sintético" ? 0.15 : 0) + (ataqueReal.bonusCrit || 0);
                if (ataqueReal.criticoGarantizado) probCrit = 1.0;

                let isCrit = Math.random() <= probCrit && atkBruto > 0;
                if (isCrit) { dmg = Math.floor(dmg * 1.5); anims.critico = true; golpeActual.critico = true; }

                if (defensor.escudoCibernetico && !ataqueReal.perforante && atkBruto > 0) {
                    dmg = Math.floor(dmg * 0.60); defensor.escudoCibernetico = false;
                    logs.push(`<span style="color:#00d2ff">🛡️ [Pasivo: Escudo Cibernético] ${this.cName(defensor)} absorbe el impacto.</span>`);
                    golpeActual.bloqueado = true;
                } else if (defensor.crystalSkin && atkBruto > 0) {
                    dmg = 0; defensor.crystalSkin = false;
                    logs.push(`<span style="color:#80deea">💎 🧬 [Gen Oculto: Piel de Cristal] ${this.cName(defensor)} anula el daño por completo.</span>`);
                    golpeActual.bloqueado = true;
                } 

                if (golpeActual.evadido || golpeActual.bloqueado) {
                    dmg = 0; 
                } else if (atkBruto > 0) {
                    defensor.hp = Math.max(0, defensor.hp - dmg);
                    anims.danoDefensor += dmg;
                    golpeActual.dmg = dmg;
                    defensor.danoRecibidoEsteTurno += dmg;

                    if (atacante.genesId.includes("def_brk")) {
                        atacante.rachaGolpes++;
                        if (atacante.rachaGolpes >= 3) {
                            defensor.def = Math.floor(defensor.def * 0.90);
                            logs.push(`<span style="color:#ff9800">⚔️ 🧬 [Gen Oculto: Ruptura Defensiva] DEF de ${this.cName(defensor)} -10% permanente.</span>`);
                            atacante.rachaGolpes = 0;
                        }
                    }

                    if (dmg > (defensor.maxHp * 0.15) && defensor.genesId.includes("dmg_echo")) {
                        let buffAtk = Math.floor(defensor.baseAtk * 0.15);
                        defensor.atk += buffAtk;
                        defensor.efectosActivos.push({ nombre: "Ret. Daño", stat: "atk", valor: buffAtk, turnos: 2, isNuevo: true });
                        logs.push(`<span style="color:#ff3333">💢 🧬 [Gen Oculto: Retroalimentación] ${this.cName(defensor)} recibe +15% ATK por el gran impacto!</span>`);
                    }

                    let tipoGolpe = multElem === 1.5 ? ` <span style="color:#4CAF50; font-weight:bold;">(¡Súper Efectivo!)</span>` : (multElem === 0.5 ? ` <span style="color:#888; font-weight:bold;">(Poco efectivo...)</span>` : "");
                    if (isCrit) logs.push(`> 💥 <span style="color:#ff0000; font-weight:bold;">¡CRÍTICO!</span> ${this.cName(atacante)} causa <span style="color:#ff6b6b; font-weight:bold;">${dmg} de daño</span>.${tipoGolpe}`);
                    else logs.push(`> ${this.cName(atacante)} causa <span style="color:#ff6b6b">${dmg} de daño</span>.${tipoGolpe}`);

                    if (atacante.genesId.includes("vampirismo_genetico") && dmg > 0) {
                        let roboVida = Math.max(1, Math.floor(dmg * 0.15));
                        atacante.hp = Math.min(atacante.maxHp, atacante.hp + roboVida);
                        anims.curacionAtacante += roboVida;
                        logs.push(`<span style="color:#e0b0ff">🦇 🧬 [Gen Oculto: Vampirismo] ${this.cName(atacante)} recupera ${roboVida} HP.</span>`);
                    }
                }
                anims.detalleGolpes.push(golpeActual);
            }
        }

        let probAply = ataqueReal.probEstado !== undefined ? ataqueReal.probEstado : 1.0;
        if (Math.random() <= probAply) {
            let duracionBase = ataqueReal.duracion || 3;

            let aplicarDebuffAtk = ataqueReal.debuffAtk;
            let aplicarDebuffSpd = ataqueReal.debuffSpd;

            if ((aplicarDebuffAtk || aplicarDebuffSpd) && defensor.hp > 0 && defensor.genesId.includes("core_ar") && !defensor.coreArUsado) {
                defensor.coreArUsado = true;
                aplicarDebuffAtk = false; 
                aplicarDebuffSpd = false;
                logs.push(`<span style="color:#80deea">🛡️ 🧬 [Gen Oculto: Núcleo Coraza] ¡${this.cName(defensor)} bloquea la reducción de stats!</span>`);
                anims.detalleGolpes.push({dmg: 0, bloqueado: true}); 
            }

            if (ataqueReal.buffSpd) {
                let val = Math.floor(atacante.baseSpd * ataqueReal.buffSpd);
                atacante.spd += val;
                atacante.efectosActivos.push({ nombre: ataqueReal.nombre, stat: "spd", valor: val, turnos: duracionBase, isNuevo: true });
            }
            if (ataqueReal.buffAtk) {
                let val = Math.floor(atacante.baseAtk * ataqueReal.buffAtk);
                atacante.atk += val;
                atacante.efectosActivos.push({ nombre: ataqueReal.nombre, stat: "atk", valor: val, turnos: duracionBase, isNuevo: true });
            }
            if (ataqueReal.escudo) {
                let val = Math.floor(atacante.maxHp * ataqueReal.escudo);
                atacante.def += val;
                atacante.efectosActivos.push({ nombre: ataqueReal.nombre, stat: "def", valor: val, turnos: duracionBase, isNuevo: true });
            }
            if (aplicarDebuffSpd && defensor.hp > 0) {
                let val = Math.floor(defensor.baseSpd * ataqueReal.debuffSpd);
                defensor.spd = Math.max(1, defensor.spd - val);
                defensor.efectosActivos.push({ nombre: ataqueReal.nombre, stat: "spd", valor: -val, turnos: duracionBase, isNuevo: true });
            }
            if (aplicarDebuffAtk && defensor.hp > 0) {
                let val = Math.floor(defensor.baseAtk * ataqueReal.debuffAtk);
                defensor.atk = Math.max(1, defensor.atk - val);
                defensor.efectosActivos.push({ nombre: ataqueReal.nombre, stat: "atk", valor: -val, turnos: duracionBase, isNuevo: true });
            }

            let estadoAply = ataqueReal.aplicaEstado || ataqueReal.aplicaEstadoPropio;
            let target = ataqueReal.aplicaEstado ? defensor : atacante;
            
            if (estadoAply && target.hp > 0) {
                if (target.genesId.includes("sangre_fria") && !target.sangreFriaUsada) {
                    target.sangreFriaUsada = true;
                    logs.push(`<span style="color:#00d2ff">❄️ 🧬 [Gen Oculto: Sangre Fría] ¡${this.cName(target)} bloquea el estado!</span>`);
                    anims.detalleGolpes.push({dmg: 0, bloqueado: true});
                } else if (!target.estados.includes(estadoAply)) {
                    let configEstado = window.AttackCatalog && window.AttackCatalog.estados ? window.AttackCatalog.estados[estadoAply] : null;
                    let durEstado = configEstado ? configEstado.duracionBase : 3;

                    if (atacante.proxVenenoDoble && (estadoAply === "Veneno" || estadoAply === "Veneno Fuerte")) {
                        estadoAply = "Veneno Fuerte";
                        durEstado *= 2;
                        atacante.proxVenenoDoble = false;
                        logs.push(`<span style="color:#9c27b0">🧪 ¡El Veneno fue concentrado con doble intensidad y duración!</span>`);
                    }

                    target.estados.push(estadoAply);
                    target.efectosActivos.push({ nombre: estadoAply, stat: "estado", valor: estadoAply, turnos: durEstado, isNuevo: true });
                    
                    if (configEstado) {
                        if (configEstado.efecto === "baja_atk" || configEstado.efecto === "baja_atk_permanente") {
                            let val = Math.floor(target.baseAtk * configEstado.valor);
                            target.atk = Math.max(1, target.atk - val);
                            if (configEstado.efecto !== "baja_atk_permanente") target.efectosActivos.push({ nombre: estadoAply + " (-ATK)", stat: "atk", valor: -val, turnos: durEstado, isNuevo: true });
                        } else if (configEstado.efecto === "baja_spd" || configEstado.efecto === "baja_spd_bloquea") {
                            let val = Math.floor(target.baseSpd * configEstado.valor);
                            target.spd = Math.max(1, target.spd - val);
                            target.efectosActivos.push({ nombre: estadoAply + " (-SPD)", stat: "spd", valor: -val, turnos: durEstado, isNuevo: true });
                        } else if (configEstado.efecto === "baja_stat_random") {
                            let pos = ["atk", "def", "spd"]; let s = pos[Math.floor(Math.random() * pos.length)];
                            let base = s === "atk" ? target.baseAtk : (s === "def" ? target.baseDef : target.baseSpd);
                            let val = Math.floor(base * configEstado.valor);
                            target[s] = Math.max(1, target[s] - val);
                            target.efectosActivos.push({ nombre: estadoAply + " (-"+s.toUpperCase()+")", stat: s, valor: -val, turnos: durEstado, isNuevo: true });
                        }
                    }

                    const descEstados = {
                        "Regeneracion": "Cura HP cada turno", "Infeccion": "Baja un stat al azar", "Quemadura": "Pierde HP cada turno",
                        "Quemadura Critica": "Pierde mucho HP cada turno", "Veneno": "Pierde HP (Acumulable)", "Veneno Fuerte": "Pierde mucho HP cada turno",
                        "Paralisis": "SPD -35% y puede fallar turno", "Congelacion": "Pierde su próximo turno", "Vision Nublada": "Precisión -25%",
                        "Enredado": "SPD -40% y bloquea soporte", "Corrosion": "ATK -15% permanente", "Campo Radiactivo": "Pierde 5% HP cada turno",
                        "Irradiacion": "ATK -25%", "Debilitacion SPD": "SPD -20%"
                    };
                    let textoEfecto = descEstados[estadoAply] ? ` <span style="font-size: 11px; color:#aaa; font-style:italic;">(${descEstados[estadoAply]})</span>` : "";
                    
                    logs.push(`<span style="color:#00bcd4">* ${this.cName(target)} sufre [${estadoAply}]${textoEfecto} por ${durEstado} turnos.</span>`);
                    
                    // ✨ FIX: AÑADIDO LOG DE PASIVA BIOMUTANTE
                    if (estadoAply === "Regeneracion" && target.element === "Biomutante") {
                         logs.push(`<span style="color:#4CAF50">🌿 [Pasiva: Biomutante] ${this.cName(target)} activa regeneración natural.</span>`);
                    }
                    
                    if (atacante.genesId.includes("state_rush") && (estadoAply.includes("Veneno") || estadoAply.includes("Quemadura"))) {
                        logs.push(`<span style="color:#ffcc00">⚡ 🧬 [Gen Oculto: Acel. de Estado] ¡El estado surte efecto de inmediato!</span>`);
                        let estadoDmg = Math.floor(target.maxHp * (estadoAply.includes("Veneno") ? 0.05 : 0.06)) + 2;
                        target.hp = Math.max(0, target.hp - estadoDmg);
                        anims.danoDefensor += estadoDmg;
                        target.danoRecibidoEsteTurno += estadoDmg;
                    }
                }
            }
        }
        return { logs, anims };
    },

    procesarEfectosFinTurno: function(fighter) {
        let logs = []; let anims = { heal: 0, dmg: 0 };
        if (fighter.hp <= 0) return { logs, anims };

        fighter.danoRecibidoTurnoAnterior = fighter.danoRecibidoEsteTurno || 0;
        fighter.danoRecibidoEsteTurno = 0;

        for (let i = fighter.efectosActivos.length - 1; i >= 0; i--) {
            let ef = fighter.efectosActivos[i];
            
            if (ef.isNuevo) {
                ef.isNuevo = false; 
            } else {
                ef.turnos--;
                if (ef.turnos <= 0) {
                    if (ef.stat === "estado") {
                        fighter.estados = fighter.estados.filter(e => e !== ef.valor);
                        logs.push(`<span style="color:#888;">> ⏳ El estado [${ef.nombre}] sobre ${this.cName(fighter)} se disipó.</span>`);
                    } else if (ef.stat) {
                        fighter[ef.stat] -= ef.valor;
                        let accion = ef.valor > 0 ? "terminó" : "se recuperó";
                        logs.push(`<span style="color:#888;">> ⏳ El efecto de [${ef.nombre}] ${accion} en ${this.cName(fighter)}. Sus stats vuelven a la normalidad.</span>`);
                    }
                    fighter.efectosActivos.splice(i, 1);
                }
            }
        }
        
        if (fighter.element === "Biomutante" && fighter.hp < fighter.maxHp) {
            let regen = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp = Math.min(fighter.maxHp, fighter.hp + regen); anims.heal += regen;
            // ✨ FIX: AÑADIDO EL LOG DE LA PASIVA
            logs.push(`<span style="color:#4CAF50">🌿 [Pasivo: Biomutante] ${this.cName(fighter)} regenera ${regen} HP.</span>`);
        }

        if (fighter.estados.includes("Regeneracion")) {
            let healDmg = Math.floor(fighter.maxHp * 0.15) + 1;
            fighter.hp = Math.min(fighter.maxHp, fighter.hp + healDmg);
            logs.push(`<span style="color:#4CAF50">✨ [Regeneración] ${this.cName(fighter)} recupera ${healDmg} HP.</span>`); 
            anims.heal += healDmg;
        }
        if (fighter.estados.includes("Campo Radiactivo")) {
            let radDmg = Math.floor(fighter.maxHp * 0.05) + 1;
            fighter.hp = Math.max(0, fighter.hp - radDmg);
            logs.push(`<span style="color:#b2ff59">☢️ [Campo Radiactivo] ${this.cName(fighter)} pierde ${radDmg} HP.</span>`); 
            anims.dmg += radDmg;
        }
        
        if (fighter.estados.includes("Sobrecarga") || fighter.estados.includes("Sobrecarga del Sistema") || fighter.estados.includes("Sobrecarga del sistema")) {
            let sobreDmg = Math.floor(fighter.maxHp * 0.08) + 1; 
            fighter.hp = Math.max(0, fighter.hp - sobreDmg);
            logs.push(`<span style="color:#ff3d00">⚡ [Sobrecarga] ${this.cName(fighter)} pierde ${sobreDmg} HP por el esfuerzo.</span>`); 
            anims.dmg += sobreDmg;
        }
        
        if (fighter.estados.includes("Quemadura")) {
            let burnDmg = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp = Math.max(0, fighter.hp - burnDmg);
            logs.push(`<span style="color:#ff9800">🔥 [Quemadura] ${this.cName(fighter)} pierde ${burnDmg} HP.</span>`); anims.dmg += burnDmg;
        }
        if (fighter.estados.includes("Veneno") || fighter.estados.includes("Veneno Fuerte")) {
            let venDmg = Math.floor(fighter.maxHp * (fighter.estados.includes("Veneno Fuerte") ? 0.08 : 0.05)) + 2;
            fighter.hp = Math.max(0, fighter.hp - venDmg);
            logs.push(`<span style="color:#9c27b0">☠️ [Veneno] ${this.cName(fighter)} pierde ${venDmg} HP.</span>`); anims.dmg += venDmg;
        }
        
        return { logs, anims };
    }
};