// =========================================
// ColiseumLogic.js - MODELO MATEMÁTICO V12.3 (RELOJ INTELIGENTE DE TURNOS)
// =========================================

window.ColiseumLogic = {
    player: null,
    enemy: null,
    turno: 1,

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
        let eRareza = "Común";
        let roll = Math.random();
        
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
        
        let eHiddenGenes = {A: null, B: null, C: null};
        if (typeof window.generarGenesV9 === 'function') eHiddenGenes = window.generarGenesV9(eRareza);
        
        const adn = { 
            id: 888, scanned: true, rarity: eRareza, stats: eStats, element: eElemento,
            body_shape: formas[Math.floor(Math.random() * formas.length)], 
            color: colores[Math.floor(Math.random() * colores.length)],
            eye_type: opcionesOjos[Math.floor(Math.random() * opcionesOjos.length)], 
            mouth_type: opcionesBocas[Math.floor(Math.random() * opcionesBocas.length)], 
            wing_type: "ninguno", hat_type: "ninguno", 
            hidden_genes: eHiddenGenes, level: nivelJugador
        };

        let pAtks = window.miMascota && window.miMascota.ataques ? window.miMascota.ataques : {};
        let enemyAtaques = {
            "ataque": this.obtenerAtaqueAleatorio(eElemento, "basicos"),
            "especial": pAtks.atk_2 ? this.obtenerAtaqueAleatorio(eElemento, "especiales") : null,
            "tactica": pAtks.atk_3 ? this.obtenerAtaqueAleatorio(eElemento, "soportes") : null,
            "definitivo": (pAtks.atk_4 && nivelJugador >= 25) ? this.obtenerAtaqueAleatorio(eElemento, "definitivos") : null
        };
        
        this.enemy = {
            nombre: this.generarNombreAleatorio(), isPlayer: false, adn: adn,
            maxHp: eStats.hp, hp: eStats.hp, atk: eStats.atk, def: eStats.def || 5, spd: eStats.spd, luk: eStats.luk,
            baseAtk: eStats.atk, baseDef: eStats.def || 5, baseSpd: eStats.spd, baseLuk: eStats.luk,
            element: eElemento, rareza: eRareza, genesId: [eHiddenGenes.B ? eHiddenGenes.B.id : "ninguno", eHiddenGenes.C ? eHiddenGenes.C.id : "ninguno"],
            estados: [], efectosActivos: [], cooldowns: { especial: 0, tactica: 0, definitivo: 0 },
            escudoCibernetico: eElemento === "Cibernético", crystalSkin: eHiddenGenes.B?.id === "piel_cristal" || eHiddenGenes.C?.id === "piel_cristal",
            ataquesEquipados: enemyAtaques
        };
    },

    prepararJugador: function(mascota) {
        const pElemento = (mascota.genes && mascota.genes.afinidad) ? mascota.genes.afinidad.dom : (mascota.element || "Normal");
        const pStats = { hp: mascota.stats?.hp || 80, atk: mascota.stats?.atk || 15, def: mascota.stats?.def || 5, spd: mascota.stats?.spd || 15, luk: mascota.stats?.luk || 10 };
        let pGenB = mascota.hidden_genes?.B?.id || "ninguno"; let pGenC = mascota.hidden_genes?.C?.id || "ninguno";
        
        let pAtks = mascota.ataques || {};
        let playerAtaques = {
            "ataque": this.obtenerAtaqueAleatorio(pElemento, "basicos"),
            "especial": pAtks.atk_2 ? this.buscarAtaquePorNombre(pAtks.atk_2.nombre) : null,
            "tactica": pAtks.atk_3 ? this.buscarAtaquePorNombre(pAtks.atk_3.nombre) : null,
            "definitivo": pAtks.atk_4 ? this.buscarAtaquePorNombre(pAtks.atk_4.nombre) : null
        };

        this.player = {
            nombre: mascota.name || "Tu Geno", isPlayer: true, adn: mascota,
            maxHp: pStats.hp, hp: pStats.hp, atk: pStats.atk, def: pStats.def, spd: pStats.spd, luk: pStats.luk,
            baseAtk: pStats.atk, baseDef: pStats.def, baseSpd: pStats.spd, baseLuk: pStats.luk,
            element: pElemento, rareza: mascota.rarity || "Común", genesId: [pGenB, pGenC], 
            estados: [], efectosActivos: [], cooldowns: { especial: 0, tactica: 0, definitivo: 0 },
            escudoCibernetico: pElemento === "Cibernético", crystalSkin: pGenB === "piel_cristal" || pGenC === "piel_cristal",
            ataquesEquipados: playerAtaques
        };
        this.turno = 1;
    },

    ejecutarAtaqueCompleto: function(atacante, defensor, slotAccion) {
        let logs = [];
        let anims = { atacanteGrita: true, danoDefensor: 0, critico: false, curacionAtacante: 0, danoReflejo: 0, multElem: 1 };
        
        let ataqueReal = atacante.ataquesEquipados[slotAccion];
        if (!ataqueReal) {
            logs.push(`<span style="color:#888;">> ${atacante.nombre} intenta atacar pero tropieza.</span>`);
            return { logs, anims };
        }

        if (slotAccion === "especial") {
            atacante.cooldowns.especial = 3;
            logs.push(`<span style="color:#e040fb">> ¡${atacante.nombre} usa [${ataqueReal.nombre}]!</span>`);
            if(ataqueReal.descripcion) logs.push(`<span style="color:#ce93d8; font-style:italic;">* Info: ${ataqueReal.descripcion}</span>`);
        } else if (slotAccion === "definitivo") {
            atacante.cooldowns.definitivo = 5;
            logs.push(`<span style="color:#ff0000; font-weight:bold; text-transform:uppercase;">> ¡${atacante.nombre} desata [${ataqueReal.nombre}]!</span>`);
            if(ataqueReal.descripcion) logs.push(`<span style="color:#ff8a80; font-style:italic;">* Info: ${ataqueReal.descripcion}</span>`);
        } else if (slotAccion === "tactica") {
            atacante.cooldowns.tactica = 4;
            logs.push(`<span style="color:#26a69a">> ¡${atacante.nombre} prepara [${ataqueReal.nombre}]!</span>`);
            if(ataqueReal.descripcion) logs.push(`<span style="color:#80cbc4; font-style:italic;">* Efecto: ${ataqueReal.descripcion}</span>`);
        }

        let potenciaAtaque = ataqueReal.potencia || (ataqueReal.potenciaBase ? ataqueReal.potenciaBase * 100 : 0);
        if (potenciaAtaque > 0 && potenciaAtaque < 10) potenciaAtaque = potenciaAtaque * 100; 

        if (ataqueReal.curacion) {
            let cura = Math.floor(atacante.maxHp * ataqueReal.curacion);
            atacante.hp = Math.min(atacante.maxHp, atacante.hp + Math.max(1, cura));
            anims.curacionAtacante += cura;
            logs.push(`<span style="color:#4CAF50">* ${atacante.nombre} recupera ${cura} HP.</span>`);
        }

        if (potenciaAtaque > 0) {
            let numGolpes = ataqueReal.hits || 1;
            if (atacante.genesId.includes("velocidad_fantasma") && Math.random() <= 0.20 && numGolpes === 1) {
                numGolpes = 2;
                logs.push(`<span style="color:#b19cd9">* [Velocidad Fantasma] ¡${atacante.nombre} ataca rápido dos veces!</span>`);
            }

            for(let i=0; i<numGolpes; i++) {
                if (defensor.hp <= 0) break;
                
                let atkBruto = atacante.atk * (potenciaAtaque / 75) * (0.85 + Math.random() * 0.3);
                const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
                let multElem = ventajas[ataqueReal.elemento] === defensor.element ? 1.5 : (ventajas[defensor.element] === ataqueReal.elemento ? 0.5 : 1.0);
                atkBruto = atkBruto * multElem;
                anims.multElem = multElem;

                let defRival = (ataqueReal.perforante || ataqueReal.rompeEscudos) ? 0 : defensor.def;
                let dmg = Math.floor(Math.max(atkBruto - defRival, (atkBruto * 0.35) + 2));

                let probCrit = 0.05 + (atacante.luk * 0.002) + (atacante.element === "Sintético" ? 0.15 : 0) + (ataqueReal.bonusCrit || 0);
                if (ataqueReal.criticoGarantizado) probCrit = 1.0;

                let isCrit = Math.random() <= probCrit;
                if (isCrit) { dmg = Math.floor(dmg * 1.5); anims.critico = true; }

                if (defensor.escudoCibernetico && !ataqueReal.perforante) {
                    dmg = Math.floor(dmg * 0.60); defensor.escudoCibernetico = false;
                    logs.push(`<span style="color:#00d2ff">* [Escudo Cibernético] ${defensor.nombre} absorbe el impacto.</span>`);
                } else if (defensor.crystalSkin) {
                    dmg = 0; defensor.crystalSkin = false;
                    logs.push(`<span style="color:#80deea">* [Piel de Cristal] ${defensor.nombre} anula el daño.</span>`);
                } else {
                    defensor.hp = Math.max(0, defensor.hp - dmg);
                    anims.danoDefensor += dmg;

                    let tipoGolpe = multElem === 1.5 ? ` <span style="color:#4CAF50; font-weight:bold;">(¡Súper Efectivo!)</span>` : (multElem === 0.5 ? ` <span style="color:#888; font-weight:bold;">(Poco efectivo...)</span>` : "");
                    if (isCrit) logs.push(`> 💥 <span style="color:#ff0000; font-weight:bold;">¡CRÍTICO!</span> ${atacante.nombre} causa <span style="color:#ff6b6b; font-weight:bold;">${dmg} de daño</span>.${tipoGolpe}`);
                    else logs.push(`> ${atacante.nombre} causa <span style="color:#ff6b6b">${dmg} de daño</span>.${tipoGolpe}`);

                    if (atacante.genesId.includes("vampirismo_genetico") && dmg > 0) {
                        let roboVida = Math.max(1, Math.floor(dmg * 0.15));
                        atacante.hp = Math.min(atacante.maxHp, atacante.hp + roboVida);
                        anims.curacionAtacante += roboVida;
                        logs.push(`<span style="color:#e0b0ff">* [Vampirismo] ${atacante.nombre} recupera ${roboVida} HP.</span>`);
                    }
                }
            }
        }

        // ✨ NUEVO: AGREGADA LA PROPIEDAD 'isNuevo: true' A LOS RELOJES
        let probAply = ataqueReal.probEstado !== undefined ? ataqueReal.probEstado : 1.0;
        if (Math.random() <= probAply) {
            let duracionBase = ataqueReal.duracion || 3;

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
            if (ataqueReal.debuffSpd && defensor.hp > 0) {
                let val = Math.floor(defensor.baseSpd * ataqueReal.debuffSpd);
                defensor.spd = Math.max(1, defensor.spd - val);
                defensor.efectosActivos.push({ nombre: ataqueReal.nombre, stat: "spd", valor: -val, turnos: duracionBase, isNuevo: true });
            }
            if (ataqueReal.debuffAtk && defensor.hp > 0) {
                let val = Math.floor(defensor.baseAtk * ataqueReal.debuffAtk);
                defensor.atk = Math.max(1, defensor.atk - val);
                defensor.efectosActivos.push({ nombre: ataqueReal.nombre, stat: "atk", valor: -val, turnos: duracionBase, isNuevo: true });
            }

            let estadoAply = ataqueReal.aplicaEstado || ataqueReal.aplicaEstadoPropio;
            let target = ataqueReal.aplicaEstado ? defensor : atacante;
            if (estadoAply && target.hp > 0) {
                if (target.genesId.includes("sangre_fria") && !target.sangreFriaUsada) {
                    target.sangreFriaUsada = true;
                    logs.push(`<span style="color:#00d2ff">* [Sangre Fría] ¡${target.nombre} bloquea el estado!</span>`);
                } else if (!target.estados.includes(estadoAply)) {
                    target.estados.push(estadoAply);
                    let configEstado = window.AttackCatalog && window.AttackCatalog.estados ? window.AttackCatalog.estados[estadoAply] : null;
                    let durEstado = configEstado ? configEstado.duracionBase : 3;
                    target.efectosActivos.push({ nombre: estadoAply, stat: "estado", valor: estadoAply, turnos: durEstado, isNuevo: true });
                    logs.push(`<span style="color:#00bcd4">* ${target.nombre} sufre [${estadoAply}] por ${durEstado} turnos.</span>`);
                }
            }
        }
        return { logs, anims };
    },

    procesarEfectosFinTurno: function(fighter) {
        let logs = []; let anims = { heal: 0, dmg: 0 };
        if (fighter.hp <= 0) return { logs, anims };

        // ✨ NUEVO: REVISIÓN DEL RELOJ INTELIGENTE
        for (let i = fighter.efectosActivos.length - 1; i >= 0; i--) {
            let ef = fighter.efectosActivos[i];
            
            // Si el efecto acaba de ser lanzado este turno, no restamos el reloj
            if (ef.isNuevo) {
                ef.isNuevo = false; 
            } else {
                ef.turnos--;
                if (ef.turnos <= 0) {
                    if (ef.stat === "estado") {
                        fighter.estados = fighter.estados.filter(e => e !== ef.valor);
                        logs.push(`<span style="color:#888;">> ⏳ El estado [${ef.nombre}] sobre ${fighter.nombre} se disipó.</span>`);
                    } else if (ef.stat) {
                        fighter[ef.stat] -= ef.valor;
                        let accion = ef.valor > 0 ? "terminó" : "se recuperó";
                        logs.push(`<span style="color:#888;">> ⏳ El efecto de [${ef.nombre}] ${accion} en ${fighter.nombre}. Sus stats vuelven a la normalidad.</span>`);
                    }
                    fighter.efectosActivos.splice(i, 1);
                }
            }
        }
        
        if (fighter.element === "Biomutante" && fighter.hp < fighter.maxHp) {
            let regen = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp = Math.min(fighter.maxHp, fighter.hp + regen); anims.heal += regen;
        }
        if (fighter.estados.includes("Quemadura")) {
            let burnDmg = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp = Math.max(0, fighter.hp - burnDmg);
            logs.push(`<span style="color:#ff9800">🔥 [Quemadura] ${fighter.nombre} pierde ${burnDmg} HP.</span>`); anims.dmg += burnDmg;
        }
        if (fighter.estados.includes("Veneno")) {
            let venDmg = Math.floor(fighter.maxHp * 0.05) + 2;
            fighter.hp = Math.max(0, fighter.hp - venDmg);
            logs.push(`<span style="color:#9c27b0">☠️ [Veneno] ${fighter.nombre} pierde ${venDmg} HP.</span>`); anims.dmg += venDmg;
        }
        return { logs, anims };
    }
};