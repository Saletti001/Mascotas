// =========================================
// ColiseumLogic.js - MODELO MATEMÁTICO V10.2 (IA EN ESPEJO Y DEFINITIVOS)
// =========================================

window.ColiseumLogic = {
    player: null,
    enemy: null,
    turno: 1,
    cooldownEspecial: 0,

    generarNombreAleatorio: function() {
        const prefijos = ["Nex", "Crio", "Bio", "Zar", "Vor", "Kael", "Lum", "Pyro", "Grav", "Aero", "Tox", "Muta", "Viro"];
        const sufijos = ["core", "morph", "tron", "lith", "pex", "byte", "spark", "fang", "claw", "pulse", "shade", "vibe", "gen"];
        return prefijos[Math.floor(Math.random() * prefijos.length)] + sufijos[Math.floor(Math.random() * sufijos.length)];
    },

    generarRivalProcedural: function(nivelJugador) {
        let eRareza = "Común";
        let roll = Math.random();
        
        if (nivelJugador <= 4) {
            eRareza = roll < 0.85 ? "Común" : "Raro";
        } else if (nivelJugador <= 10) {
            eRareza = roll < 0.60 ? "Común" : (roll < 0.90 ? "Raro" : "Épico");
        } else {
            eRareza = roll < 0.40 ? "Común" : (roll < 0.70 ? "Raro" : (roll < 0.90 ? "Épico" : "Legendario"));
        }
        
        const eStats = window.generarStatsPorRareza ? 
            window.generarStatsPorRareza(eRareza) : {hp: 60, atk: 12, def: 8, spd: 10, luk: 5};

        let puntosExtra = (nivelJugador > 1) ? (nivelJugador - 1) * 3 : 0;
        for(let i=0; i<puntosExtra; i++) {
            const stats = ['hp', 'atk', 'def', 'spd', 'luk'];
            const rStat = stats[Math.floor(Math.random() * stats.length)];
            if(rStat === 'hp') eStats.hp += 5;
            else eStats[rStat] += 1;
        }
            
        const elementos = ["Biomutante", "Viral", "Cibernético", "Radiactivo", "Tóxico", "Sintético"];
        const eElemento = elementos[Math.floor(Math.random() * elementos.length)];
        
        const formas = ["gota", "frijol", "circulo", "cuadrado", "triangulo", "hongo", "estrella", "pentagono", "nube", "chili", "rayo"];
        const colores = ["#ff6b6b", "#4dd0e1", "#fdfd96", "#b19cd9", "#77DD77", "#ff9800", "#ffb347", "#a8e6cf"];
        const opcionesOjos = typeof dicOjos !== 'undefined' ? Object.keys(dicOjos) : ["estandar", "cute", "angry"];
        const opcionesBocas = typeof dicBocas !== 'undefined' ? Object.keys(dicBocas) : ["estandar", "feliz", "colmillos"];
        
        let eHiddenGenes = {A: null, B: null, C: null};
        if (typeof window.generarGenesV9 === 'function') eHiddenGenes = window.generarGenesV9(eRareza);
        
        const adn = { 
            id: 888, scanned: true, rarity: eRareza, stats: eStats, element: eElemento,
            body_shape: formas[Math.floor(Math.random() * formas.length)], 
            color: colores[Math.floor(Math.random() * colores.length)],
            eye_type: opcionesOjos[Math.floor(Math.random() * opcionesOjos.length)], 
            mouth_type: opcionesBocas[Math.floor(Math.random() * opcionesBocas.length)], 
            wing_type: "ninguno", hat_type: "ninguno", hidden_genes: eHiddenGenes, level: nivelJugador
        };

        // ✨ NUEVO: MATCHMAKING EN ESPEJO (El rival copia las categorías de tus MTs)
        let ataquesEnemigo = ["ataque"];
        const btn2 = document.getElementById("btn-atk-2");
        const btn3 = document.getElementById("btn-atk-3");
        const btn4 = document.getElementById("btn-atk-4");

        if (btn2 && btn2.innerText !== "VACÍO" && !btn2.innerText.includes("NV.")) ataquesEnemigo.push("especial");
        if (btn3 && btn3.innerText !== "VACÍO" && !btn3.innerText.includes("NV.")) ataquesEnemigo.push("tactica");
        if (btn4 && btn4.innerText !== "VACÍO" && !btn4.innerText.includes("NV.")) ataquesEnemigo.push("definitivo");
        
        this.enemy = {
            nombre: this.generarNombreAleatorio(), isPlayer: false, adn: adn,
            maxHp: eStats.hp, hp: eStats.hp, 
            atk: eStats.atk, def: eStats.def || 5, spd: eStats.spd, luk: eStats.luk,
            element: eElemento, rareza: eRareza,
            genesId: [eHiddenGenes.B ? eHiddenGenes.B.id : "ninguno", eHiddenGenes.C ? eHiddenGenes.C.id : "ninguno"],
            estados: [], escudoCibernetico: eElemento === "Cibernético", resilienciaUsada: false, barreraUsada: false, 
            ultimoElementoRecibido: null, sangreFriaUsada: false, 
            crystalSkin: eHiddenGenes.B?.id === "piel_cristal" || eHiddenGenes.C?.id === "piel_cristal",
            ataquesDisponibles: ataquesEnemigo // Se le entregan los mismos slots que tienes tú
        };
    },

    prepararJugador: function(mascota) {
        const pElemento = (mascota.genes && mascota.genes.afinidad) ? mascota.genes.afinidad.dom : (mascota.element || "Normal");
        
        const pStats = { 
            hp: mascota.stats?.hp || 80, 
            atk: mascota.stats?.atk || 15, 
            def: mascota.stats?.def || 5, 
            spd: mascota.stats?.spd || 15, 
            luk: mascota.stats?.luk || 10 
        };
        
        let pGenB = mascota.hidden_genes?.B?.id || "ninguno";
        let pGenC = mascota.hidden_genes?.C?.id || "ninguno";
        
        this.player = {
            nombre: mascota.name || "Tu Geno", isPlayer: true, adn: mascota,
            maxHp: pStats.hp, hp: pStats.hp, 
            atk: pStats.atk, def: pStats.def, spd: pStats.spd, luk: pStats.luk,
            element: pElemento, rareza: mascota.rarity || "Común",
            genesId: [pGenB, pGenC], estados: [], escudoCibernetico: pElemento === "Cibernético", 
            resilienciaUsada: false, barreraUsada: false, ultimoElementoRecibido: null, sangreFriaUsada: false, 
            crystalSkin: pGenB === "piel_cristal" || pGenC === "piel_cristal"
        };
        
        this.turno = 1;
        this.cooldownEspecial = 0;
    },

    ejecutarAtaqueCompleto: function(atacante, defensor, accionElegida) {
        let logs = [];
        let anims = { atacanteGrita: true, danoDefensor: 0, critico: false, curacionAtacante: 0, danoReflejo: 0, multElem: 1 };
        let multDano = 1;
        
        // ✨ NUEVO: MATEMÁTICAS PARA LOS DIFERENTES TIPOS DE ATAQUES
        if (accionElegida === "especial") {
            if(atacante.isPlayer) this.cooldownEspecial = 3;
            logs.push(`<span style="color:#e040fb">> ¡${atacante.nombre} usa una TÉCNICA ESPECIAL!</span>`);
            multDano = 1.35; 
        } else if (accionElegida === "definitivo") {
            logs.push(`<span style="color:#ff0000; font-weight:bold; text-transform:uppercase;">> ¡${atacante.nombre} desata su ATAQUE DEFINITIVO!</span>`);
            multDano = 2.00; // Doble de daño por usar el Slot 4
        }

        let ataques = 1;
        if (atacante.genesId.includes("velocidad_fantasma") && Math.random() <= 0.20) {
            ataques = 2;
            logs.push(`<span style="color:#b19cd9">* [Velocidad Fantasma] ¡${atacante.nombre} ataca rápido dos veces!</span>`);
        }

        for(let i=0; i<ataques; i++) {
            if (defensor.hp <= 0) break;
            
            let atkBruto = atacante.atk * multDano * (i === 1 ? 0.5 : 1) * (0.85 + Math.random() * 0.3);

            const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
            let multElem = ventajas[atacante.element] === defensor.element ? 1.5 : (ventajas[defensor.element] === atacante.element ? 0.5 : 1.0);
            atkBruto = atkBruto * multElem;
            anims.multElem = multElem;

            let defRival = defensor.def;
            let dmgMinimo = (atkBruto * 0.35) + 2; 
            let dmg = Math.max(atkBruto - defRival, dmgMinimo);
            dmg = Math.floor(dmg);

            let probCrit = 0.05 + (atacante.luk * 0.002);
            if (atacante.element === "Sintético") probCrit += 0.15; 
            let isCrit = Math.random() <= probCrit;
            
            if (isCrit) {
                dmg = Math.floor(dmg * 1.5);
                anims.critico = true;
            }

            if (defensor.escudoCibernetico) {
                dmg = Math.floor(dmg * 0.60);
                defensor.escudoCibernetico = false;
                logs.push(`<span style="color:#00d2ff">* [Escudo Cibernético] ${defensor.nombre} absorbe el impacto inicial.</span>`);
            }

            if (defensor.genesId.includes("armadura_adaptativa")) {
                if (defensor.ultimoElementoRecibido === atacante.element) {
                    dmg = Math.floor(dmg * 0.6);
                    logs.push(`<span style="color:#77DD77">* [Armadura Adaptativa] ¡Resiste el ataque conocido! (-40% Daño)</span>`);
                }
                defensor.ultimoElementoRecibido = atacante.element;
            }

            if (defensor.crystalSkin) {
                dmg = 0;
                defensor.crystalSkin = false;
                logs.push(`<span style="color:#80deea">* [Piel de Cristal] ${defensor.nombre} absorbió el impacto (Daño: 0).</span>`);
            } else {
                if (defensor.hp - dmg <= 0 && defensor.genesId.includes("barrera_limite") && !defensor.barreraUsada) {
                    dmg = defensor.hp - 1;
                    defensor.barreraUsada = true;
                    logs.push(`<span style="color:#ff5722">* [Barrera Límite] ¡${defensor.nombre} sobrevive con 1 HP!</span>`);
                }

                defensor.hp -= dmg;
                if(defensor.hp < 0) defensor.hp = 0;
                anims.danoDefensor += dmg;

                let tipoGolpe = multElem === 1.5 ? ` <span style="color:#4CAF50; font-weight:bold;">(¡Súper Efectivo!)</span>` : (multElem === 0.5 ? ` <span style="color:#888; font-weight:bold;">(Poco efectivo...)</span>` : "");
                
                if (isCrit) logs.push(`> 💥 <span style="color:#ff0000; font-weight:bold;">¡CRÍTICO!</span> ${atacante.nombre} causa <span style="color:#ff6b6b; font-weight:bold;">${dmg} de daño</span>.${tipoGolpe}`);
                else logs.push(`> ${atacante.nombre} causa <span style="color:#ff6b6b">${dmg} de daño</span>.${tipoGolpe}`);

                if (dmg > 0) {
                    let efectoAplicar = null;
                    if (atacante.element === "Radiactivo" && Math.random() <= 0.25) efectoAplicar = "Quemadura";
                    if (atacante.element === "Tóxico" && Math.random() <= 0.25) efectoAplicar = "Debilidad";
                    if (atacante.element === "Viral" && Math.random() <= 0.25) efectoAplicar = "Infección";
                    
                    if (efectoAplicar) {
                        if (defensor.genesId.includes("sangre_fria") && !defensor.sangreFriaUsada) {
                            defensor.sangreFriaUsada = true;
                            logs.push(`<span style="color:#00d2ff">* [Sangre Fría] ¡${defensor.nombre} inmuniza el estado alterado!</span>`);
                        } else if (!defensor.estados.includes(efectoAplicar)) {
                            defensor.estados.push(efectoAplicar);
                            if (efectoAplicar === "Debilidad") {
                                let atkPerdido = defensor.atk - Math.floor(defensor.atk * 0.8);
                                defensor.atk = Math.floor(defensor.atk * 0.8);
                                logs.push(`<span style="color:#ff9800">* ${defensor.nombre} sufre ${efectoAplicar} (-${atkPerdido} ATK).</span>`);
                            } else if (efectoAplicar === "Infección") {
                                let spdPerdida = defensor.spd - Math.floor(defensor.spd * 0.8);
                                defensor.spd = Math.floor(defensor.spd * 0.8);
                                logs.push(`<span style="color:#ff9800">* ${defensor.nombre} sufre ${efectoAplicar} (-${spdPerdida} SPD).</span>`);
                            } else {
                                logs.push(`<span style="color:#ff9800">* ${defensor.nombre} sufre ${efectoAplicar} (Daño continuo).</span>`);
                            }
                        }
                    }
                }

                if (atacante.genesId.includes("vampirismo_genetico") && dmg > 0) {
                    let roboVida = Math.floor(dmg * 0.15);
                    if (roboVida < 1) roboVida = 1;
                    atacante.hp = Math.min(atacante.maxHp, atacante.hp + roboVida);
                    logs.push(`<span style="color:#e0b0ff">* [Vampirismo] ${atacante.nombre} se cura ${roboVida} HP.</span>`);
                    anims.curacionAtacante += roboVida;
                }

                if (isCrit && defensor.genesId.includes("reflejo_genetico") && dmg > 0) {
                    let danoReflejado = Math.floor(dmg * 0.30);
                    if (danoReflejado < 1) danoReflejado = 1;
                    atacante.hp = Math.max(0, atacante.hp - danoReflejado);
                    logs.push(`<span style="color:#ffcc00">* [Reflejo] ¡${defensor.nombre} devuelve ${danoReflejado} de daño!</span>`);
                    anims.danoReflejo += danoReflejado;
                }
            }

            if (defensor.hp > 0 && defensor.hp <= (defensor.maxHp * 0.15) && defensor.genesId.includes("resiliencia_ultima") && !defensor.resilienciaUsada) {
                defensor.resilienciaUsada = true;
                defensor.atk = Math.floor(defensor.atk * 1.4); defensor.spd = Math.floor(defensor.spd * 1.4);
                logs.push(`<span style="color:#ffcc00">* [Resiliencia Última] ¡${defensor.nombre} entra en modo Berserker!</span>`);
            }
        }
        return { logs, anims };
    },

    procesarEfectosFinTurno: function(fighter) {
        let logs = [];
        let anims = { heal: 0, dmg: 0 };
        if (fighter.hp <= 0) return { logs, anims };
        
        if (fighter.element === "Biomutante" && fighter.hp < fighter.maxHp) {
            let regen = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp = Math.min(fighter.maxHp, fighter.hp + regen);
            anims.heal += regen;
        }
        
        if (fighter.estados.includes("Quemadura")) {
            let burnDmg = Math.floor(fighter.maxHp * 0.06) + 2;
            fighter.hp = Math.max(0, fighter.hp - burnDmg);
            logs.push(`<span style="color:#ff9800">🔥 [Quemadura] ${fighter.nombre} pierde ${burnDmg} HP.</span>`);
            anims.dmg += burnDmg;
        }
        return { logs, anims };
    }
};