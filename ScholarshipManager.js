// ============================================================================
// ScholarshipManager.js - GESTOR DE BECAS Y ALQUILERES (Lore Híbrido Genos)
// ============================================================================

window.becasPlaza = [];

window.ScholarshipManager = {
    saldosPendientesBecas: {}, // Guardará saldo de POL ganado por dueños de Genos rentados

    init: function() {
        console.log("🧬 [ScholarshipManager] Inicializando módulo de Becas...");
        // Cargar plaza de becas desde localStorage si existe
        const guardado = localStorage.getItem("genos_becas_plaza");
        if (guardado) {
            try {
                window.becasPlaza = JSON.parse(guardado);
            } catch (e) {
                console.error("[ScholarshipManager] Error al cargar la plaza de becas, reiniciando...", e);
                window.becasPlaza = [];
            }
        }

        // Si la plaza está vacía, pre-poblarla con algunos Genos de NPCs para alquilar
        if (window.becasPlaza.length === 0) {
            this.generarGenosMockPlaza();
        }

        // Limpiar estados corruptos de Genos que no tengan el objeto scholarship pero sí flags
        this.sanitizarGenosLocales();
    },

    // Genera 3 Genos de dueños virtuales (NPCs) para que el jugador local pueda probar el lado de "Becado"
    generarGenosMockPlaza: function() {
        console.log("🧬 [ScholarshipManager] Generando catálogo de becas inicial...");
        const mockGenos = [
            {
                id: "B-90110",
                name: "NEO-VANDAL",
                level: 6,
                xp: 120,
                rarity: "Raro",
                color: "#00d2ff",
                element: "Cibernético",
                genes: { afinidad: { dom: "Cibernético" }, mutacion: 12 },
                stats: { hp: 120, maxHp: 120, attack: 28, defense: 22, speed: 25 },
                higiene: 100,
                hambre: 100,
                diversion: 100,
                resistencia: 100,
                amistad: 40,
                felicidad: 100,
                isEgg: false,
                scholarship: {
                    status: "available",
                    ownerId: "npc_owner_zero",
                    ownerAddress: "0x39aA...F891",
                    scholarId: null,
                    scholarAddress: null,
                    minLabLevel: 1, // Sin requisitos
                    splitOwner: 70, // 70% dueño / 30% becado
                    rentedAt: null
                }
            },
            {
                id: "B-50412",
                name: "TOXIC-VIPER",
                level: 8,
                xp: 450,
                rarity: "Épico",
                color: "#d500f9",
                element: "Tóxico",
                genes: { afinidad: { dom: "Tóxico" }, mutacion: 20 },
                stats: { hp: 140, maxHp: 140, attack: 35, defense: 24, speed: 30 },
                higiene: 100,
                hambre: 100,
                diversion: 100,
                resistencia: 100,
                amistad: 55,
                felicidad: 100,
                isEgg: false,
                scholarship: {
                    status: "available",
                    ownerId: "npc_owner_max",
                    ownerAddress: "0x81Cb...112A",
                    scholarId: null,
                    scholarAddress: null,
                    minLabLevel: 3, // Requisito Lab Nivel 3
                    splitOwner: 70,
                    rentedAt: null
                }
            },
            {
                id: "B-77299",
                name: "APEX-SYNTH",
                level: 12,
                xp: 900,
                rarity: "Legendario",
                color: "#ffea00",
                element: "Sintético",
                genes: { afinidad: { dom: "Sintético" }, mutacion: 32 },
                stats: { hp: 180, maxHp: 180, attack: 46, defense: 38, speed: 42 },
                higiene: 100,
                hambre: 100,
                diversion: 100,
                resistencia: 100,
                amistad: 80,
                felicidad: 100,
                isEgg: false,
                scholarship: {
                    status: "available",
                    ownerId: "npc_owner_krypton",
                    ownerAddress: "0xbc8A...D501",
                    scholarId: null,
                    scholarAddress: null,
                    minLabLevel: 5, // Requisito Lab Nivel 5
                    splitOwner: 80, // 80% dueño / 20% becado
                    rentedAt: null
                }
            }
        ];

        // Asegurar render de SVGs para los mock
        mockGenos.forEach(g => {
            if (typeof window.generarSvgGeno === 'function') {
                g.svg = window.generarSvgGeno(g);
            }
        });

        window.becasPlaza = mockGenos;
        this.guardarPlazaLocal();
    },

    sanitizarGenosLocales: function() {
        if (!window.misGenos) return;
        window.misGenos.forEach(geno => {
            if (geno.scholarship) {
                // Si es un Geno que alquilamos nosotros y no está en la plaza, agregarlo
                if (geno.scholarship.ownerId === "local_user") {
                    const existeEnPlaza = window.becasPlaza.some(b => b.id === geno.id);
                    if (!existeEnPlaza) {
                        window.becasPlaza.push(geno);
                    }
                }
            }
        });
        this.guardarPlazaLocal();
    },

    guardarPlazaLocal: function() {
        localStorage.setItem("genos_becas_plaza", JSON.stringify(window.becasPlaza));
    },

    // El Propietario local ofrece su Geno en Beca
    publicarGenoEnBeca: function(genoId, minLabLevel, splitOwner) {
        if (!window.misGenos) return { success: false, message: "No posees criaturas." };
        
        const geno = window.misGenos.find(g => String(g.id) === String(genoId));
        if (!geno) return { success: false, message: "La criatura seleccionada no existe en tu laboratorio." };

        // Validar que no esté ya alquilado o publicado
        if (geno.scholarship) {
            return { success: false, message: "Esta criatura ya tiene un contrato de beca activo o está publicada." };
        }

        // Validar que no esté en venta P2P
        if (window.misVentas && window.misVentas.some(v => String(v.genoId) === String(genoId))) {
            return { success: false, message: "No puedes becar un Geno que tienes a la venta en la Plaza." };
        }

        // Validar que no esté en un torneo activo
        if (window.TournamentManager && window.TournamentManager.activeTournament) {
            const tGeno = window.TournamentManager.activeTournament.fighters.find(f => String(f.id) === String(genoId));
            if (tGeno) {
                return { success: false, message: "No puedes becar un Geno inscrito en un torneo activo." };
            }
        }

        // Si es el Geno activo (compañero), desvincularlo
        if (window.miMascota && String(window.miMascota.id) === String(genoId)) {
            const otroGeno = window.misGenos.find(g => String(g.id) !== String(genoId));
            if (otroGeno) {
                window.miMascota = otroGeno;
                console.log(`[Scholarship] Cambiando mascota activa a ${otroGeno.name} debido a publicación en Beca.`);
            } else {
                window.miMascota = { id: "temp", name: "Ninguno", color: "#ccc", svg: "", stats: { hp: 0 } };
            }
        }

        // Definir objeto de beca
        geno.scholarship = {
            status: "available",
            ownerId: "local_user",
            ownerAddress: window.miWallet ? window.miWallet.address : "0xLocalOwner...",
            scholarId: null,
            scholarAddress: null,
            minLabLevel: parseInt(minLabLevel, 10) || 1,
            splitOwner: parseInt(splitOwner, 10) || 70,
            rentedAt: null
        };

        // Agregar copia a la plaza pública
        const plazaCopy = JSON.parse(JSON.stringify(geno));
        // Restaurar SVG tras clonación JSON
        if (typeof window.generarSvgGeno === 'function') {
            plazaCopy.svg = window.generarSvgGeno(plazaCopy);
        }
        window.becasPlaza.push(plazaCopy);

        this.guardarPlazaLocal();
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        console.log(`[Scholarship] Geno ${geno.name} publicado en beca con Nv. Lab mínimo ${minLabLevel} y split ${splitOwner}%`);

        // Simular que un NPC alquila este Geno después de 15 segundos para pruebas
        setTimeout(() => {
            this.simularAlquilerPorNPC(geno.id);
        }, 15000);

        return { success: true, message: `Geno ${geno.name} ofrecido en Beca con éxito.` };
    },

    // El Propietario local retira su Geno que estaba disponible en la plaza pero NO alquilado aún
    retirarGenoDeBeca: function(genoId) {
        const index = window.becasPlaza.findIndex(b => String(b.id) === String(genoId));
        if (index === -1) return { success: false, message: "La oferta de beca no existe." };

        const becaGeno = window.becasPlaza[index];
        if (becaGeno.scholarship.status !== "available") {
            return { success: false, message: "El Geno ya está alquilado por un jugador. Usa 'Reclamar Beca' en su lugar." };
        }

        // Remover de la plaza
        window.becasPlaza.splice(index, 1);

        // Limpiar estado en el Geno del inventario local
        const localGeno = window.misGenos.find(g => String(g.id) === String(genoId));
        if (localGeno) {
            delete localGeno.scholarship;
        }

        this.guardarPlazaLocal();
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        console.log(`[Scholarship] Oferta de beca retirada para Geno ID ${genoId}`);
        return { success: true, message: "Oferta de beca retirada." };
    },

    // =========================================================================
    // V23: HELPER - Devuelve todos los ítems custodiadoas al terminar una beca
    // Llamar ANTES de remover el Geno del inventario del becado.
    // =========================================================================
    _devolverItemsCustodia: function(geno) {
        if (!geno || !geno.scholarship) return;
        const scholarship = geno.scholarship;

        // --- Paso 1: Devolver las MTs del BECADO al becado (si es local_user) ---
        // Iterar todos los slots de ataque y ver si el becado colocó algo ahí
        const scholarItems = scholarship.scholarItems || {};
        const slotsAtaque = ['atk_2', 'atk_3', 'atk_4'];

        if (scholarship.scholarId === "local_user" && window.miInventario) {
            slotsAtaque.forEach(slot => {
                const itemEnSlot = geno.ataques && geno.ataques[slot];
                if (itemEnSlot && scholarItems[slot] && scholarItems[slot].id === (itemEnSlot.itemData?.id || itemEnSlot.id)) {
                    // Este ítem fue puesto por el becado, devolverlo a su mochila
                    const itemADevolver = itemEnSlot.itemData || {
                        id: itemEnSlot.id + "_rec",
                        name: itemEnSlot.nombre,
                        icon: "💿",
                        type: "MT",
                        subType: slot === 'atk_4' ? "Definitivo" : (slot === 'atk_2' ? 'Técnica' : 'Soporte'),
                        element: itemEnSlot.element,
                        maxStack: 1,
                        id_ataque: itemEnSlot.id,
                        power: itemEnSlot.power,
                        evCost: 0
                    };
                    window.miInventario.addItem(itemADevolver);
                    console.log(`[Scholarship Custodia] MT del becado "${itemADevolver.name}" devuelta al inventario del becado.`);
                }
            });
        }

        // --- Paso 2: Restaurar las MTs del DUEÑO desde ownerItems custody ---
        // Estas MTs fueron desplazadas cuando el becado puso las suyas.
        // Si el dueño es local_user, las devolvemos a su mochila.
        const ownerItems = scholarship.ownerItems || {};
        if (scholarship.ownerId === "local_user" && window.miInventario) {
            Object.values(ownerItems).forEach(item => {
                if (item) {
                    window.miInventario.addItem(item);
                    console.log(`[Scholarship Custodia] MT del dueño "${item.name}" recuperada de custodia al inventario.`);
                }
            });
        }

        // Limpiar los registros de custodia en el objeto scholarship
        delete scholarship.ownerItems;
        delete scholarship.scholarItems;
    },

    // El Propietario local revoca la beca y recupera su Geno (incluso si está alquilado)
    reclamarGenoRentado: function(genoId) {
        const index = window.becasPlaza.findIndex(b => String(b.id) === String(genoId));
        if (index === -1) return { success: false, message: "El contrato de beca no existe." };

        const becaGeno = window.becasPlaza[index];

        // Validar si el becado lo tiene actualmente inscrito en un torneo activo
        if (window.TournamentManager && window.TournamentManager.activeTournament) {
            const enTorneo = window.TournamentManager.activeTournament.fighters.some(f => String(f.id) === String(genoId));
            if (enTorneo) {
                return { 
                    success: false, 
                    message: "⚠️ Bloqueo de seguridad: No puedes reclamar tu Geno mientras el becado compite activamente en un Torneo de Llaves." 
                };
            }
        }

        // Si el becado es el usuario local (es decir, el dueño es un NPC y el jugador local lo está devolviendo)
        // o si el dueño es el usuario local y el becado es un NPC
        console.log(`[Scholarship] Revocando beca de Geno ID ${genoId}. Retornando al dueño.`);

        // V23: Devolver primero todas las MTs a sus respectivos dueños
        this._devolverItemsCustodia(becaGeno);

        // Remover de la plaza
        window.becasPlaza.splice(index, 1);

        // Si el dueño era el usuario local, limpiamos el scholarship y vuelve al inventario limpio
        if (becaGeno.scholarship.ownerId === "local_user") {
            const localGeno = window.misGenos.find(g => String(g.id) === String(genoId));
            if (localGeno) {
                delete localGeno.scholarship;
            }
        } else {
            // Si el dueño era un NPC y nosotros éramos el becado, removemos el Geno de nuestro inventario
            if (window.misGenos) {
                window.misGenos = window.misGenos.filter(g => String(g.id) !== String(genoId));
            }
            // Si era nuestra mascota activa, cambiarla
            if (window.miMascota && String(window.miMascota.id) === String(genoId)) {
                if (window.misGenos && window.misGenos.length > 0) {
                    window.miMascota = window.misGenos[0];
                } else {
                    window.miMascota = { id: "temp", name: "Ninguno", color: "#ccc", svg: "", stats: { hp: 0 } };
                }
            }
        }

        this.guardarPlazaLocal();
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        return { success: true, message: "Geno reclamado. El contrato de beca se ha dado por terminado." };
    },

    // El jugador local (Becado) intenta alquilar un Geno de la plaza (de un dueño NPC)
    alquilarGeno: function(genoId) {
        const index = window.becasPlaza.findIndex(b => String(b.id) === String(genoId));
        if (index === -1) return { success: false, message: "La oferta no está disponible en la plaza." };

        const becaGeno = window.becasPlaza[index];

        if (becaGeno.scholarship.status !== "available") {
            return { success: false, message: "Este Geno ya está alquilado por otro becado." };
        }

        // Validar Nivel de Laboratorio Mínimo
        const nivelJugador = window.labLevel || 1;
        if (nivelJugador < becaGeno.scholarship.minLabLevel) {
            return { 
                success: false, 
                message: `⚠️ Nivel de Laboratorio insuficiente. Requieres Nivel ${becaGeno.scholarship.minLabLevel} (tienes Nv. ${nivelJugador}).` 
            };
        }

        // Asignar local_user como becado
        becaGeno.scholarship.status = "rented";
        becaGeno.scholarship.scholarId = "local_user";
        becaGeno.scholarship.scholarAddress = window.miWallet ? window.miWallet.address : "0xLocalScholar...";
        becaGeno.scholarship.rentedAt = Date.now();

        // Clonar Geno para agregarlo al inventario del usuario
        const clonGeno = JSON.parse(JSON.stringify(becaGeno));
        if (typeof window.generarSvgGeno === 'function') {
            clonGeno.svg = window.generarSvgGeno(clonGeno);
        }

        if (!window.misGenos) window.misGenos = [];
        window.misGenos.push(clonGeno);

        this.guardarPlazaLocal();
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        console.log(`[Scholarship] Has alquilado a ${clonGeno.name} (Dueño: ${clonGeno.scholarship.ownerId}) con split ${clonGeno.scholarship.splitOwner}%`);
        return { success: true, message: `Has alquilado a ${clonGeno.name} con éxito.` };
    },

    // El jugador local (Becado) devuelve voluntariamente un Geno alquilado a su dueño NPC
    devolverGenoAlquilado: function(genoId) {
        // Remover de misGenos
        if (!window.misGenos) return { success: false, message: "No tienes criaturas." };

        const geno = window.misGenos.find(g => String(g.id) === String(genoId));
        if (!geno || !geno.scholarship || geno.scholarship.scholarId !== "local_user") {
            return { success: false, message: "Este Geno no es un alquiler activo." };
        }

        // Validar si el becado lo tiene inscrito en un torneo activo
        if (window.TournamentManager && window.TournamentManager.activeTournament) {
            const enTorneo = window.TournamentManager.activeTournament.fighters.some(f => String(f.id) === String(genoId));
            if (enTorneo) {
                return { 
                    success: false, 
                    message: "⚠️ Bloqueo de seguridad: No puedes devolver el Geno mientras esté compitiendo en un Torneo de Llaves." 
                };
            }
        }

        // V23: Devolver primero todas las MTs a sus respectivos dueños
        this._devolverItemsCustodia(geno);

        // Quitar de misGenos
        window.misGenos = window.misGenos.filter(g => String(g.id) !== String(genoId));

        // Cambiar mascota activa si es necesario
        if (window.miMascota && String(window.miMascota.id) === String(genoId)) {
            if (window.misGenos.length > 0) {
                window.miMascota = window.misGenos[0];
            } else {
                window.miMascota = { id: "temp", name: "Ninguno", color: "#ccc", svg: "", stats: { hp: 0 } };
            }
        }

        // Resetear estado en la plaza de becas pública (limpiar también custodia)
        const index = window.becasPlaza.findIndex(b => String(b.id) === String(genoId));
        if (index !== -1) {
            const plazaGeno = window.becasPlaza[index];
            plazaGeno.scholarship.status = "available";
            plazaGeno.scholarship.scholarId = null;
            plazaGeno.scholarship.scholarAddress = null;
            plazaGeno.scholarship.rentedAt = null;
            delete plazaGeno.scholarship.ownerItems;
            delete plazaGeno.scholarship.scholarItems;
        }

        this.guardarPlazaLocal();
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        console.log(`[Scholarship] Devolución de Geno ID ${genoId} completada.`);
        return { success: true, message: "Geno devuelto con éxito a su propietario." };
    },

    // SIMULACIÓN: Simula que un NPC becado alquila nuestro Geno listado
    simularAlquilerPorNPC: function(genoId) {
        const index = window.becasPlaza.findIndex(b => String(b.id) === String(genoId));
        if (index === -1) return;

        const becaGeno = window.becasPlaza[index];
        if (becaGeno.scholarship.status !== "available" || becaGeno.scholarship.ownerId !== "local_user") return;

        const scholarsSimulados = ["Scholar_Apex", "Scholar_Viper", "Scholar_Cyber", "Scholar_Hex"];
        const scholarNombre = scholarsSimulados[Math.floor(Math.random() * scholarsSimulados.length)];

        // Actualizar contrato a Rented
        becaGeno.scholarship.status = "rented";
        becaGeno.scholarship.scholarId = scholarNombre;
        becaGeno.scholarship.scholarAddress = "0x" + Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 6);
        becaGeno.scholarship.rentedAt = Date.now();

        // Sincronizar en el inventario local del propietario
        const localGeno = window.misGenos.find(g => String(g.id) === String(genoId));
        if (localGeno) {
            localGeno.scholarship = becaGeno.scholarship;
        }

        this.guardarPlazaLocal();
        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        console.log(`🤖 [Scholarship SIM] El becado virtual "${scholarNombre}" ha alquilado tu Geno ${becaGeno.name}.`);

        // Simular que el NPC gana recompensas de POL en torneos pasivamente cada 30-40 segundos para el dueño
        this.programarSimulacionTorneoPasivoNPC(genoId, scholarNombre);
    },

    programarSimulacionTorneoPasivoNPC: function(genoId, scholarNombre) {
        const intervalId = setInterval(() => {
            const index = window.becasPlaza.findIndex(b => String(b.id) === String(genoId));
            // Si el contrato ya no existe o ya no está alquilado por este NPC, detener la simulación
            if (index === -1) {
                clearInterval(intervalId);
                return;
            }
            const bGeno = window.becasPlaza[index];
            if (bGeno.scholarship.status !== "rented" || bGeno.scholarship.scholarId !== scholarNombre) {
                clearInterval(intervalId);
                return;
            }

            // Simular un torneo con probabilidad de 15% de ganar una ronda de cobro
            if (Math.random() < 0.20) {
                const premiosDisponibles = [2.00, 5.00, 10.00];
                const premioTotal = premiosDisponibles[Math.floor(Math.random() * premiosDisponibles.length)];
                
                // Aplicar el split de ganancias
                const splits = this.aplicarSplitPremio(premioTotal, bGeno);
                
                console.log(`🏆 [Scholarship SIM] ¡Tu becado "${scholarNombre}" usando a "${bGeno.name}" quedó en Top de Torneo! Premio total: ${premioTotal} POL. Tu parte (${bGeno.scholarship.splitOwner}%): +${splits.ownerAmount} POL. Parte de becado: +${splits.scholarAmount} POL.`);
                
                // Mostrar notificación visual flotante
                if (typeof window.LoginUI !== 'undefined') {
                    // Notificación en pantalla
                    const alertDiv = document.createElement("div");
                    alertDiv.className = "cyber-alert-popup";
                    alertDiv.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: rgba(10, 10, 25, 0.95); border: 2px solid #00e5ff; color: #fff; padding: 15px; border-radius: 8px; z-index: 10000; box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); font-family: monospace; font-size: 12px;";
                    alertDiv.innerHTML = `
                        <div style="color: #00e5ff; font-weight: bold; margin-bottom: 5px;">🏆 RECOMPENSA DE BECA</div>
                        Tu becado <b>${scholarNombre}</b> con ${bGeno.name} ganó un torneo.<br>
                        Recibes <b>+${splits.ownerAmount} POL</b> (Comisión del ${bGeno.scholarship.splitOwner}%).
                    `;
                    document.body.appendChild(alertDiv);
                    setTimeout(() => alertDiv.remove(), 6000);
                }
            }
        }, 30000); // Evaluar cada 30 segundos
    },

    // Divide los premios de POL en base a las tasas del contrato de beca
    aplicarSplitPremio: function(montoPOL, geno) {
        if (!geno.scholarship) {
            return { ownerAmount: 0, scholarAmount: montoPOL };
        }

        const splitOwnerPct = geno.scholarship.splitOwner || 70;
        const ownerAmount = parseFloat(((montoPOL * splitOwnerPct) / 100).toFixed(4));
        const scholarAmount = parseFloat((montoPOL - ownerAmount).toFixed(4));

        // Si el dueño es el usuario local, acreditar a sus saldos pendientes
        if (geno.scholarship.ownerId === "local_user") {
            if (!window.TournamentManager) window.TournamentManager = { saldosPendientes: 0.0 };
            window.TournamentManager.saldosPendientes = parseFloat((parseFloat(window.TournamentManager.saldosPendientes || 0) + ownerAmount).toFixed(4));
            console.log(`[Scholarship Split] Acreditado +${ownerAmount} POL a la cuenta del Propietario (saldosPendientes = ${window.TournamentManager.saldosPendientes} POL)`);
        }

        // Si el becado es el usuario local, acreditar a su billetera activa o saldos pendientes
        if (geno.scholarship.scholarId === "local_user") {
            if (window.miWallet) {
                window.miWallet.pol = parseFloat((parseFloat(window.miWallet.pol) + scholarAmount).toFixed(4));
                console.log(`[Scholarship Split] Acreditado +${scholarAmount} POL a la billetera del Becado local`);
                // Registrar en historial
                if (!window.miWallet.history) window.miWallet.history = [];
                window.miWallet.history.push({
                    type: "Recompensa Beca",
                    amount: `+${scholarAmount} POL`,
                    date: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString(),
                    hash: "0x" + Math.random().toString(16).substring(2, 10) + "..."
                });
            }
        }

        if (typeof window.guardarProgreso === 'function') window.guardarProgreso();

        return { ownerAmount, scholarAmount };
    }
};

// Auto-inicializar cuando el script se cargue
window.ScholarshipManager.init();
