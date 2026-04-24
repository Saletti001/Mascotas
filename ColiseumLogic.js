// =========================================
// ColiseumLogic.js - MODELO MATEMÁTICO
// =========================================
window.ColiseumLogic = {
    player: null,
    enemy: null,
    turno: 1,
    cooldownEspecial: 0,

    generarRivalProcedural: function(nivelJugador) {
        const rarezas = ["Común", "Raro", "Épico"];
        const eRareza = rarezas[Math.floor(Math.random() * rarezas.length)];
        const eStats = typeof window.generarStatsPorRareza === 'function' ? window.generarStatsPorRareza(eRareza) : {hp: 60, atk: 12, spd: 10, luk: 5};
        
        const elementos = ["Biomutante", "Viral", "Cibernético", "Radiactivo", "Tóxico", "Sintético"];
        const eElemento = elementos[Math.floor(Math.random() * elementos.length)];
        
        const prefijos = ["Nex", "Crio", "Bio", "Zar", "Vor", "Kael", "Lum", "Pyro", "Grav", "Aero", "Tox", "Muta", "Viro"];
        const sufijos = ["core", "morph", "tron", "lith", "pex", "byte", "spark", "fang", "claw", "pulse", "shade", "vibe", "gen"];
        const nombreAleatorio = prefijos[Math.floor(Math.random() * prefijos.length)] + sufijos[Math.floor(Math.random() * sufijos.length)];

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

        this.enemy = {
            nombre: nombreAleatorio, isPlayer: false, adn: adn,
            maxHp: eStats.hp, hp: eStats.hp, atk: eStats.atk, spd: eStats.spd, luk: eStats.luk,
            element: eElemento, rareza: eRareza,
            genesId: [eHiddenGenes.B ? eHiddenGenes.B.id : "ninguno", eHiddenGenes.C ? eHiddenGenes.C.id : "ninguno"],
            estados: [], escudoCibernetico: eElemento === "Cibernético"
        };
    },

    prepararJugador: function(mascota) {
        const pElemento = (mascota.genes && mascota.genes.afinidad) ? mascota.genes.afinidad.dom : (mascota.element || "Normal");
        const pStats = {
            hp: mascota.stats?.hp || 80,
            atk: mascota.stats?.atk || 15,
            spd: mascota.stats?.spd || 15,
            luk: mascota.stats?.luk || 10
        };
        
        let pGenB = mascota.hidden_genes?.B?.id || "ninguno";
        let pGenC = mascota.hidden_genes?.C?.id || "ninguno";

        this.player = {
            nombre: mascota.name || "Tu Geno", isPlayer: true, adn: mascota,
            maxHp: pStats.hp, hp: pStats.hp, atk: pStats.atk, spd: pStats.spd, luk: pStats.luk,
            element: pElemento, rareza: mascota.rarity || "Común",
            genesId: [pGenB, pGenC], estados: [], escudoCibernetico: pElemento === "Cibernético"
        };
        
        this.turno = 1;
        this.cooldownEspecial = 0;
    },

    calcularDano: function(atacante, defensor, multiplicadorAtaque = 1) {
        let dmg = Math.floor(atacante.atk * multiplicadorAtaque * (0.85 + Math.random() * 0.3));
        
        const ventajas = { "Biomutante": "Viral", "Viral": "Cibernético", "Cibernético": "Radiactivo", "Radiactivo": "Tóxico", "Tóxico": "Sintético", "Sintético": "Biomutante" };
        let multElem = ventajas[atacante.element] === defensor.element ? 1.5 : (ventajas[defensor.element] === atacante.element ? 0.5 : 1.0);
        dmg = Math.floor(dmg * multElem);

        let probCrit = 0.05 + (atacante.luk * 0.002);
        let isCrit = Math.random() <= probCrit;
        if (isCrit) dmg = Math.floor(dmg * 1.5);

        if (defensor.escudoCibernetico) { dmg = Math.floor(dmg * 0.60); defensor.escudoCibernetico = false; }

        defensor.hp -= dmg;
        if(defensor.hp < 0) defensor.hp = 0;

        return { dmg, isCrit, multElem };
    }
};