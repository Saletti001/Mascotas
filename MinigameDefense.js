// MinigameDefense.js - Defensa Inmune (Whack-a-Mole)
// El jugador elimina virus invasores en un grid de 3x3 cápsulas antes de que escapen.
// Debe evitar golpear a los Anticuerpos.

class MinigameDefense {
    constructor() {
        window.minigameDefense = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.score = 0;
        this.evEarned = 0;
        this.escapes = 0; // Max 3 escapes
        this.timeLeft = 45; // 45 segundos estrictos
        this.isPlaying = false;

        this.activeEntities = Array(9).fill(null); // Array de entidades activas
        this.spawnCooldown = 800; // spawn rate inicial de 800ms
        this.lastSpawnTime = 0; // acumulador en ms

        this.gameTimerInterval = null;
        this.physicsInterval = null;

        this.initEvents();
    }

    initEvents() {
        if (this.btnQuit) {
            this.btnQuit.onclick = () => {
                if (this.isPlaying && window.miArcade && !window.miArcade.gameScreen.classList.contains("hidden")) {
                    this.endGame(true);
                }
            };
        }
    }

    start() {
        this.startGame();
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");

        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none"; // Ocultar controles táctiles genéricos

        // Limpiar área de juego y aplicar fondo de defensa inmune
        this.playArea.className = "";
        this.playArea.classList.add("game-defense-bg");

        // Ocultar elementos de otros minijuegos
        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "none";
        const falling = document.getElementById("falling-object");
        if (falling) falling.style.display = "none";

        Array.from(this.playArea.children).forEach(child => {
            if (child.id !== "player-basket" && child.id !== "touch-controls") {
                child.remove();
            }
        });

        // Crear la cuadrícula 3x3 de cápsulas
        const grid = document.createElement("div");
        grid.className = "defense-grid";

        for (let i = 0; i < 9; i++) {
            const capsule = document.createElement("div");
            capsule.className = "defense-capsule";
            capsule.dataset.index = i;
            capsule.onclick = () => this.onTapCapsule(i);
            
            // Estructura interna de la cápsula (capa de vidrio + contenedor de contenido)
            capsule.innerHTML = `
                <div class="defense-capsule-glass"></div>
                <div class="defense-capsule-content"></div>
            `;
            grid.appendChild(capsule);
        }
        this.playArea.appendChild(grid);

        // Inicializar variables de juego
        this.score = 0;
        this.evEarned = 0;
        this.escapes = 0;
        this.timeLeft = 45;
        this.activeEntities = Array(9).fill(null);
        this.spawnCooldown = 800;
        this.lastSpawnTime = 600; // Trigger spawn rápido inicial
        this.isPlaying = true;

        this.updateUI();

        // Arrancar loops
        this.gameTimerInterval = setInterval(() => this.tickTimer(), 1000);
        this.physicsInterval = setInterval(() => this.updatePhysics(), 20);
    }

    updateUI() {
        const evDisplay = ` | +${Number(this.evEarned).toFixed(2)} EV`;
        
        // Indicadores de defensa (escudos que se rompen con las explosiones)
        const shields = "🛡️".repeat(Math.max(0, 3 - this.escapes)) + "💥".repeat(Math.max(0, this.escapes));
        
        this.scoreDisplay.innerText = `Virus: ${this.score}${evDisplay}`;
        this.timerDisplay.innerText = `Tiempo: ${this.timeLeft}s | ${shields}`;
    }

    tickTimer() {
        if (!this.isPlaying) return;
        this.timeLeft--;

        // Aceleración de spawn progresiva
        const elapsed = 45 - this.timeLeft;
        this.spawnCooldown = Math.max(350, 800 - (elapsed / 10) * 100); // baja de 800ms a 360ms

        // Activar modo pánico visual en los últimos 15 segundos
        if (this.timeLeft <= 15) {
            this.playArea.classList.add("panic-mode");
        } else {
            this.playArea.classList.remove("panic-mode");
        }

        this.updateUI();

        if (this.timeLeft <= 0) {
            this.endGame(false);
        }
    }

    spawnEntity() {
        if (!this.isPlaying) return;

        // Buscar celdas vacías
        const emptyIndexes = [];
        for (let i = 0; i < 9; i++) {
            if (this.activeEntities[i] === null) {
                emptyIndexes.push(i);
            }
        }

        if (emptyIndexes.length === 0) return;

        // Decidir si es un spawn doble de virus (25% de probabilidad si hay al menos 2 celdas vacías)
        const isDoubleVirus = emptyIndexes.length >= 2 && Math.random() < 0.25;

        if (isDoubleVirus) {
            // Elegir dos celdas distintas al azar
            const idx1 = Math.floor(Math.random() * emptyIndexes.length);
            const cell1 = emptyIndexes.splice(idx1, 1)[0];
            const cell2 = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

            this.createEntityAtCell(cell1, "virus");
            this.createEntityAtCell(cell2, "virus");
        } else {
            // Spawn normal (individual)
            const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
            const type = Math.random() < 0.75 ? "virus" : "ally";
            this.createEntityAtCell(randomIndex, type);
        }
    }

    createEntityAtCell(randomIndex, type) {
        // Obtener la cápsula en el DOM
        const capsule = this.playArea.querySelectorAll(".defense-capsule")[randomIndex];
        const contentContainer = capsule.querySelector(".defense-capsule-content");

        // Crear elemento gráfico
        const entityEl = document.createElement("div");
        entityEl.className = `defense-entity ${type}`;

        let svg = "";
        if (type === "virus") {
            // Virus morado con púas y ojos malvados
            svg = `
            <svg viewBox="0 0 64 64" width="100%" height="100%">
                <circle cx="32" cy="32" r="14" fill="#1b0826" stroke="#d500f9" stroke-width="2.5" style="filter: drop-shadow(0 0 6px #d500f9);"/>
                <path d="M32 6 L32 18 M32 46 L32 58 M6 32 L18 32 M46 32 L58 32 M14 14 L23 23 M41 41 L50 50 M14 50 L23 41 M41 14 L50 23" fill="none" stroke="#d500f9" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="32" cy="6" r="3" fill="#ff007f"/>
                <circle cx="32" cy="58" r="3" fill="#ff007f"/>
                <circle cx="6" cy="32" r="3" fill="#ff007f"/>
                <circle cx="58" cy="32" r="3" fill="#ff007f"/>
                <path d="M25 28 L29 30 M39 28 L35 30" fill="none" stroke="#ff007f" stroke-width="3" stroke-linecap="round"/>
                <circle cx="27" cy="31" r="1.5" fill="#ff007f"/>
                <circle cx="37" cy="31" r="1.5" fill="#ff007f"/>
                <path d="M26 40 Q32 44 38 40" fill="none" stroke="#ff007f" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        } else {
            // Anticuerpo cian/verde feliz con un corazón
            svg = `
            <svg viewBox="0 0 64 64" width="100%" height="100%">
                <path d="M32 12 C20 12 16 22 16 34 C16 46 22 52 32 52 C42 52 48 46 48 34 C48 22 44 12 32 12 Z" fill="#052528" stroke="#00e5ff" stroke-width="2.5" style="filter: drop-shadow(0 0 6px #00e5ff);"/>
                <circle cx="26" cy="32" r="2.5" fill="#00e5ff"/>
                <circle cx="38" cy="32" r="2.5" fill="#00e5ff"/>
                <circle cx="22" cy="35" r="1.5" fill="#ff007f" opacity="0.6"/>
                <circle cx="42" cy="35" r="1.5" fill="#ff007f" opacity="0.6"/>
                <path d="M30 38 Q32 40 34 38" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round"/>
                <path d="M32 20 C32 20 30 17 28 17 C26 17 25 18.5 25 20 C25 22 28 24 32 26 C36 24 39 22 39 20 C39 18.5 38 17 36 17 C34 17 32 20 32 20 Z" fill="#ff007f" style="filter: drop-shadow(0 0 2px #ff007f);"/>
            </svg>`;
        }

        entityEl.innerHTML = svg;
        contentContainer.appendChild(entityEl);

        // Vida útil inicial de 1.2 segundos (1200ms)
        // Se reduce ligeramente en la fase final
        const elapsed = 45 - this.timeLeft;
        const duration = Math.max(900, 1200 - Math.floor(elapsed / 10) * 80);

        this.activeEntities[randomIndex] = {
            type: type,
            element: entityEl,
            timeLeft: duration,
            capsuleElement: capsule,
            index: randomIndex
        };
    }

    onTapCapsule(index) {
        if (!this.isPlaying || this.activeEntities[index] === null) return;

        const entity = this.activeEntities[index];
        const capsule = entity.capsuleElement;
        
        // Limpiar entidad de la cápsula
        entity.element.remove();
        this.activeEntities[index] = null;
        capsule.classList.remove("shaking", "shaking-danger", "shaking-safe");

        // Obtener coordenadas de la cápsula para flotante
        const rect = capsule.getBoundingClientRect();
        const playAreaRect = this.playArea.getBoundingClientRect();
        const x = rect.left - playAreaRect.left + rect.width / 2;
        const y = rect.top - playAreaRect.top + rect.height / 2;

        if (entity.type === "virus") {
            // Acierto!
            this.score++;
            this.evEarned += 10.0;

            if (window.Sonidos) window.Sonidos.play("click");
            
            // Efecto flotante
            this.spawnFloatingText("+10 EV", x, y, "correct");

            // Animación de impacto en cápsula
            capsule.classList.add("tapped-success");
            setTimeout(() => capsule.classList.remove("tapped-success"), 300);
        } else {
            // Error! Pinchó un Anticuerpo
            this.evEarned = Math.max(0, this.evEarned - 15.0);

            if (window.Sonidos) window.Sonidos.play("lose");

            this.spawnFloatingText("-15 EV", x, y, "fail");

            // Animación de interferencia en cápsula (destello rojo)
            capsule.classList.add("tapped-fail");
            setTimeout(() => capsule.classList.remove("tapped-fail"), 300);
        }

        this.updateUI();
    }

    updatePhysics() {
        if (!this.isPlaying) return;

        // 1. Administrador del spawn
        this.lastSpawnTime += 20;
        if (this.lastSpawnTime >= this.spawnCooldown) {
            this.spawnEntity();
            this.lastSpawnTime = 0;
        }

        // 2. Control de expiración de entidades activas
        for (let i = 0; i < 9; i++) {
            const entity = this.activeEntities[i];
            if (entity === null) continue;

            entity.timeLeft -= 20;

            // Alerta visual de escape: sacudir cápsula si queda menos de 350ms
            if (entity.timeLeft <= 350) {
                if (entity.type === "virus") {
                    entity.capsuleElement.classList.add("shaking", "shaking-danger");
                } else {
                    entity.capsuleElement.classList.add("shaking", "shaking-safe");
                }
            }

            // Expiración
            if (entity.timeLeft <= 0) {
                const capsule = entity.capsuleElement;
                entity.element.remove();
                this.activeEntities[i] = null;
                capsule.classList.remove("shaking", "shaking-danger", "shaking-safe");

                if (entity.type === "virus") {
                    // Virus escapa y rompe la cápsula!
                    this.escapes++;
                    
                    if (window.Sonidos) window.Sonidos.play("lose");

                    // Efecto visual de cápsula rota
                    capsule.classList.add("capsule-broken");
                    setTimeout(() => capsule.classList.remove("capsule-broken"), 500);

                    const rect = capsule.getBoundingClientRect();
                    const playAreaRect = this.playArea.getBoundingClientRect();
                    const x = rect.left - playAreaRect.left + rect.width / 2;
                    const y = rect.top - playAreaRect.top + rect.height / 2;
                    this.spawnFloatingText("💥 ESCAPE", x, y, "fail");

                    this.updateUI();

                    if (this.escapes >= 3) {
                        this.endGame(false);
                        return;
                    }
                } else {
                    // El anticuerpo desaparece pacíficamente y brilla en verde (tapped-success-green)
                    capsule.classList.add("tapped-success-green");
                    setTimeout(() => capsule.classList.remove("tapped-success-green"), 300);
                }
            }
        }
    }

    spawnFloatingText(text, x, y, type) {
        const textEl = document.createElement("div");
        textEl.className = `sorting-floating-text ${type}`; // Usa los mismos estilos neón que sorting
        textEl.innerText = text;
        textEl.style.left = `${x}px`;
        textEl.style.top = `${y}px`;
        this.playArea.appendChild(textEl);
        setTimeout(() => textEl.remove(), 800);
    }

    endGame(quit = false) {
        this.isPlaying = false;
        clearInterval(this.gameTimerInterval);
        clearInterval(this.physicsInterval);

        // Limpiar clases de playArea
        this.playArea.className = "";

        // Remover elementos creados
        this.activeEntities.forEach(entity => {
            if (entity && entity.element) entity.element.remove();
        });
        this.activeEntities = Array(9).fill(null);

        const grid = this.playArea.querySelector(".defense-grid");
        if (grid) grid.remove();

        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "block";

        if (!quit) {
            if (window.Sonidos) window.Sonidos.play("heal");

            // Acreditar esencia vital real
            if (this.evEarned > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(this.evEarned);
            }

            // XP de Laboratorio
            const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                ? window.completarMinijuegoArcade("Defensa Inmune") 
                : 0;

            // Incrementar diversión y amistad del Geno
            if (window.miMascota && window.miMascota.id && window.miMascota.id !== "temp") {
                if (window.miMascota.diversion === undefined) window.miMascota.diversion = 100;
                if (window.miMascota.amistad   === undefined) window.miMascota.amistad   = 0;
                window.miMascota.diversion = Math.min(100, window.miMascota.diversion + 20);

                const hoy = new Date().toDateString();
                if (!window.miMascota.registroAmistadDiaria) window.miMascota.registroAmistadDiaria = {};
                let gananciaExplicita = 0;
                if (window.miMascota.registroAmistadDiaria.arcade !== hoy) {
                    window.miMascota.registroAmistadDiaria.arcade = hoy;
                    gananciaExplicita = Math.floor(Math.random() * 3) + 1;
                    window.miMascota.amistad = Math.min(100, window.miMascota.amistad + gananciaExplicita);
                }

                if (window.misGenos) {
                    const idx = window.misGenos.findIndex(g => String(g.id) === String(window.miMascota.id));
                    if (idx !== -1) {
                        window.misGenos[idx].diversion = window.miMascota.diversion;
                        window.misGenos[idx].amistad = window.miMascota.amistad;
                        window.misGenos[idx].registroAmistadDiaria = window.miMascota.registroAmistadDiaria;
                    }
                }
                
                if (window.NexoEnergyManager) window.NexoEnergyManager.actualizarUI();
                
                if (window.guardarJuego) window.guardarJuego();
                else if (window.guardarProgreso) window.guardarProgreso();

                let headerMsg = this.escapes >= 3 ? "💥 ¡SISTEMA INMUNE COLAPSADO (GAME OVER)!" : "🛡️ ¡Simulación Inmune Exitosa!";
                let msg = `${headerMsg}\nVirus eliminados: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                alert(msg);
            } else {
                let headerMsg = this.escapes >= 3 ? "💥 ¡SISTEMA INMUNE COLAPSADO (GAME OVER)!" : "🛡️ ¡Simulación Inmune Exitosa!";
                let msg = `${headerMsg}\nVirus eliminados: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                alert(msg);
            }
        }

        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameDefense();
});
