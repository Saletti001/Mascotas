// MinigameSorting.js - DNA Sorter (Clasificador de ADN) - Lluvia Multitarea y Controles Invertidos
// El jugador clasifica Bio-Núcleos en Bases Estables (izquierda) o Taras Genéticas (derecha).

class MinigameSorting {
    constructor() {
        window.minigameSorting = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.score = 0;
        this.evEarned = 0;
        this.timeLeft = 45; // 45 segundos estrictos
        this.lives = 3; // 3 Vidas (Integridad de ADN)
        this.isPlaying = false;
        
        this.streak = 0;
        this.comboMultiplier = 1; // max x3
        
        this.nuclei = []; // Lista activa de núcleos cayendo
        this.activeDragNucleus = null; // Núcleo siendo arrastrado actualmente
        
        this.gameTimerInterval = null;
        this.physicsInterval = null;
        
        this.baseFallSpeed = 3.6; // Velocidad inicial balanceada (fácil de seguir, reto a largo plazo)
        this.fallSpeed = 3.6;
        
        // Spawn control
        this.spawnCooldown = 800; // spawn rate inicial de 800ms (ritmo dinámico)
        this.lastSpawnTime = 0; // acumulador en ms

        // Estado de control invertido
        this.controlsInverted = false;
        this.invertTimer = 0;
        this.warningBanner = null;

        this.initEvents();
    }

    initEvents() {
        // Controles de teclado: A o Flecha Izquierda -> Izquierda, D o Flecha Derecha -> Derecha
        // Clasifica automáticamente el bote activo más bajo en la pantalla.
        document.addEventListener("keydown", (e) => {
            if (!this.isPlaying || this.nuclei.length === 0) return;

            const isLeft = e.key === "ArrowLeft" || e.key === "a" || e.key === "A";
            const isRight = e.key === "ArrowRight" || e.key === "d" || e.key === "D";

            if (isLeft || isRight) {
                e.preventDefault();
                
                // Encontrar el núcleo no bloqueado más bajo (mayor coordenada y)
                const activeCores = this.nuclei.filter(n => !n.isLocked);
                if (activeCores.length === 0) return;

                let lowest = activeCores[0];
                for (let i = 1; i < activeCores.length; i++) {
                    if (activeCores[i].y > lowest.y) {
                        lowest = activeCores[i];
                    }
                }

                // Clasificar el núcleo más bajo
                if (isLeft) {
                    this.classify(lowest, "left");
                } else {
                    this.classify(lowest, "right");
                }
            }
        });

        if (this.btnQuit) {
            this.btnQuit.onclick = () => {
                if (this.isPlaying && window.miArcade && !window.miArcade.gameScreen.classList.contains("hidden")) {
                    this.endGame(true);
                }
            };
        }

        // Mouse/Touch movement events on window to track drag/swipe properly
        const onMove = (e) => this.dragMove(e);
        const onEnd = () => this.dragEnd();

        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("mouseup", onEnd);
        window.addEventListener("touchend", onEnd);
    }

    start() {
        this.startGame();
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");

        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none"; // Ocultar controles táctiles genéricos

        // Limpiar área de juego y aplicar fondo sorting
        this.playArea.className = "";
        this.playArea.classList.add("game-sorting-bg");

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

        // Crear divisiones visuales del Clasificador
        const leftZone = document.createElement("div");
        leftZone.className = "sorting-zone-left";
        leftZone.innerHTML = `<div class="sorting-zone-label">BASES ESTABLES<br><small>[A / ◄]</small></div>`;
        this.playArea.appendChild(leftZone);

        const rightZone = document.createElement("div");
        rightZone.className = "sorting-zone-right";
        rightZone.innerHTML = `<div class="sorting-zone-label">TARAS GENÉTICAS<br><small>[D / ►]</small></div>`;
        this.playArea.appendChild(rightZone);

        // Crear indicador de Combo
        this.comboBadge = document.createElement("div");
        this.comboBadge.className = "sorting-combo-badge combo-x1";
        this.comboBadge.innerText = "Combo: x1";
        this.playArea.appendChild(this.comboBadge);

        // Inicializar variables
        this.score = 0;
        this.evEarned = 0;
        this.timeLeft = 45;
        this.lives = 3;
        this.streak = 0;
        this.comboMultiplier = 1;
        this.fallSpeed = this.baseFallSpeed;
        this.spawnCooldown = 800;
        this.lastSpawnTime = 700; // Trigger spawn rápido al empezar
        this.nuclei = [];
        this.activeDragNucleus = null;
        this.controlsInverted = false;
        this.invertTimer = 0;
        this.warningBanner = null;
        this.isPlaying = true;

        this.updateUI();

        // Arrancar loops
        this.gameTimerInterval = setInterval(() => this.tickTimer(), 1000);
        this.physicsInterval = setInterval(() => this.updatePhysics(), 20);
    }

    updateUI() {
        const evDisplay = ` | +${Number(this.evEarned).toFixed(2)} EV`;
        
        // Crear visualización de corazones de vidas ❤ (con corazones apagados 🖤)
        const hearts = "❤".repeat(Math.max(0, this.lives)) + "🖤".repeat(Math.max(0, 3 - this.lives));
        
        this.scoreDisplay.innerText = `Puntos: ${this.score}${evDisplay}`;
        this.timerDisplay.innerText = `Tiempo: ${this.timeLeft}s | ${hearts}`;
        
        if (this.comboBadge) {
            this.comboBadge.innerText = `Combo: x${this.comboMultiplier}`;
            this.comboBadge.className = `sorting-combo-badge combo-x${this.comboMultiplier}`;
        }
    }

    tickTimer() {
        if (!this.isPlaying) return;
        this.timeLeft--;

        // Manejar contador de controles invertidos
        if (this.controlsInverted) {
            this.invertTimer--;
            if (this.invertTimer <= 0) {
                this.controlsInverted = false;
                if (this.warningBanner) {
                    this.warningBanner.remove();
                    this.warningBanner = null;
                }
            }
        }

        // Aumentar velocidad y spawn rate cada 10 segundos (Balanceado)
        const elapsed = 45 - this.timeLeft;
        this.fallSpeed = this.baseFallSpeed + (elapsed / 10) * 0.7; // Sube gradualmente de 3.6 a 6.75 max
        this.spawnCooldown = Math.max(400, 800 - (elapsed / 10) * 90); // Baja de 800ms a 400ms max

        // Modo Pánico en los últimos 15 segundos (Alerta visual roja)
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

    spawnNucleus() {
        if (!this.isPlaying) return;

        // Decidir tipo de bote genético (Proporciones balanceadas)
        // 30% Estable, 30% Tara, 12% Bomba, 13% Oro, 15% Toxina
        const roll = Math.random();
        let type = "stable";
        let isBomb = false;
        let isGold = false;
        let isToxic = false;

        if (roll < 0.30) {
            type = "stable";
        } else if (roll < 0.60) {
            type = "flaw";
        } else if (roll < 0.72) {
            type = "bomb";
            isBomb = true;
        } else if (roll < 0.85) {
            type = Math.random() < 0.5 ? "stable" : "flaw";
            isGold = true;
        } else {
            type = "flaw"; // La toxina pertenece a las taras genéticas (debe ir a la derecha)
            isToxic = true;
        }

        const nucleusEl = document.createElement("div");
        nucleusEl.className = "sorting-nucleus";
        if (isBomb) nucleusEl.classList.add("bomb");
        if (isGold) nucleusEl.classList.add("gold");
        if (isToxic) nucleusEl.classList.add("toxic");
        
        // Spawn horizontal en el pasillo central con variación
        const randOffset = Math.floor(Math.random() * 30) - 15;
        nucleusEl.style.left = `calc(50% - 32px + ${randOffset}px)`;
        nucleusEl.style.top = "0px";

        // Diseñar los Bio-Núcleos con vectores SVG y luces LED
        let svg = "";
        if (isBomb) {
            svg = `
            <svg viewBox="0 0 64 64" width="100%" height="100%">
                <circle cx="32" cy="36" r="17" fill="#1c0707" stroke="#ff3d00" stroke-width="2.5" style="filter: drop-shadow(0 0 6px #ff3d00);"/>
                <rect x="27" y="12" width="10" height="7" fill="#424242" rx="1"/>
                <path d="M32 12 Q36 6 42 5" fill="none" stroke="#ffd54f" stroke-width="2" stroke-linecap="round"/>
                <path d="M32 25 L32 33 M32 38 C32 38 31 38 32 38" fill="none" stroke="#ff3d00" stroke-width="3.5" stroke-linecap="round" style="filter: drop-shadow(0 0 2px #ff3d00);"/>
                <circle cx="32" cy="36" r="11" fill="#ff1744" opacity="0.3" class="sorting-bomb-glow"/>
            </svg>`;
        } else if (isToxic) {
            // Toxina parpadeante verde radioactiva con una calavera y flecha derecha (tara)
            svg = `
            <svg viewBox="0 0 64 64" width="100%" height="100%">
                <rect x="18" y="10" width="28" height="44" rx="6" fill="#041a04" stroke="#39ff14" stroke-width="2.5" style="filter: drop-shadow(0 0 6px #39ff14);"/>
                <rect x="21" y="26" width="22" height="24" rx="3" fill="#39ff14" opacity="0.7"/>
                <rect x="24" y="4" width="16" height="6" rx="2" fill="#39ff14"/>
                <!-- Calavera simplificada -->
                <circle cx="32" cy="33" r="5" fill="#ffffff"/>
                <rect x="30" y="36" width="4" height="4" fill="#ffffff"/>
                <circle cx="30.5" cy="33" r="1" fill="#000"/>
                <circle cx="33.5" cy="33" r="1" fill="#000"/>
                <path d="M54 32 L49 27 L49 31 L44 31 L44 33 L49 33 L49 37 Z" fill="#39ff14"/>
            </svg>`;
        } else if (isGold) {
            if (type === "stable") {
                svg = `
                <svg viewBox="0 0 64 64" width="100%" height="100%">
                    <rect x="18" y="10" width="28" height="44" rx="6" fill="#1e1804" stroke="#ffd54f" stroke-width="2.5" style="filter: drop-shadow(0 0 6px #ffd54f);"/>
                    <rect x="21" y="26" width="22" height="24" rx="3" fill="#ffd54f" opacity="0.65"/>
                    <rect x="24" y="4" width="16" height="6" rx="2" fill="#ffd54f"/>
                    <text x="32" y="38" fill="#ffffff" font-family="Orbitron" font-size="12" font-weight="900" text-anchor="middle" style="filter: drop-shadow(0 0 2px #000);">$$</text>
                    <path d="M10 32 L15 27 L15 31 L20 31 L20 33 L15 33 L15 37 Z" fill="#ffd54f"/>
                </svg>`;
            } else {
                svg = `
                <svg viewBox="0 0 64 64" width="100%" height="100%">
                    <path d="M 27 10 L 37 10 L 37 18 L 47 38 A 15 15 0 1 1 17 38 L 27 18 Z" fill="#1e1804" stroke="#ffd54f" stroke-width="2.5" style="filter: drop-shadow(0 0 6px #ffd54f);"/>
                    <path d="M 24 24 L 40 24 L 46 36 A 12 12 0 1 1 18 36 Z" fill="#ffd54f" opacity="0.7"/>
                    <rect x="25" y="4" width="14" height="6" rx="2" fill="#ffd54f"/>
                    <text x="32" y="41" fill="#ffffff" font-family="Orbitron" font-size="11" font-weight="900" text-anchor="middle" style="filter: drop-shadow(0 0 2px #000);">$$</text>
                    <path d="M54 32 L49 27 L49 31 L44 31 L44 33 L49 33 L49 37 Z" fill="#ffd54f"/>
                </svg>`;
            }
        } else {
            if (type === "stable") {
                svg = `
                <svg viewBox="0 0 64 64" width="100%" height="100%">
                    <rect x="18" y="10" width="28" height="44" rx="6" fill="#0b071e" stroke="#00e5ff" stroke-width="2.5" style="filter: drop-shadow(0 0 4px #00e5ff);"/>
                    <rect x="21" y="26" width="22" height="24" rx="3" fill="#00e5ff" opacity="0.6"/>
                    <rect x="24" y="4" width="16" height="6" rx="2" fill="#00e5ff"/>
                    <path d="M26 38 L30 42 L38 32" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 32 L15 27 L15 31 L20 31 L20 33 L15 33 L15 37 Z" fill="#00ffcc"/>
                </svg>`;
            } else {
                svg = `
                <svg viewBox="0 0 64 64" width="100%" height="100%">
                    <path d="M 27 10 L 37 10 L 37 18 L 47 38 A 15 15 0 1 1 17 38 L 27 18 Z" fill="#0b071e" stroke="#ff007f" stroke-width="2.5" style="filter: drop-shadow(0 0 4px #ff007f);"/>
                    <path d="M 24 24 L 40 24 L 46 36 A 12 12 0 1 1 18 36 Z" fill="#ff007f" opacity="0.65"/>
                    <rect x="25" y="4" width="14" height="6" rx="2" fill="#ff007f"/>
                    <path d="M27 30 L37 40 M37 30 L27 40" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
                    <path d="M54 32 L49 27 L49 31 L44 31 L44 33 L49 33 L49 37 Z" fill="#ff0055"/>
                </svg>`;
            }
        }

        nucleusEl.innerHTML = svg;
        this.playArea.appendChild(nucleusEl);

        const newCore = {
            element: nucleusEl,
            type: type,
            isBomb: isBomb,
            isGold: isGold,
            isToxic: isToxic,
            y: 0,
            xOffset: 0,
            drift: 0,
            randOffset: randOffset,
            isDragging: false,
            isLocked: false,
            dragStartX: 0
        };

        nucleusEl.addEventListener("mousedown", (e) => this.dragStart(e, newCore));
        nucleusEl.addEventListener("touchstart", (e) => this.dragStart(e, newCore), { passive: false });

        this.nuclei.push(newCore);
    }

    dragStart(e, core) {
        if (!this.isPlaying || core.isLocked) return;

        if (core.isBomb) {
            e.preventDefault();
            this.defuseBomb(core);
            return;
        }

        this.activeDragNucleus = core;
        core.isDragging = true;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        core.dragStartX = clientX - core.xOffset;
        
        core.element.style.transition = "none";
    }

    dragMove(e) {
        if (!this.isPlaying || !this.activeDragNucleus) return;
        
        if (e.cancelable) e.preventDefault();

        const core = this.activeDragNucleus;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const offset = clientX - core.dragStartX;
        
        const limit = (this.playArea.clientWidth || 300) * 0.45;
        core.xOffset = Math.max(-limit, Math.min(limit, offset));

        // Aplicar posición sumando el drift y la rotación
        const rotate = (core.xOffset + core.drift) * 0.12;
        core.element.style.left = `calc(50% - 32px + ${core.randOffset}px + ${core.drift}px + ${core.xOffset}px)`;
        core.element.style.transform = `rotate(${rotate}deg)`;
    }

    dragEnd() {
        if (!this.isPlaying || !this.activeDragNucleus) return;
        
        const core = this.activeDragNucleus;
        this.activeDragNucleus = null;
        core.isDragging = false;

        const limit = (this.playArea.clientWidth || 300) * 0.22;

        if (core.xOffset < -limit) {
            this.classify(core, "left");
        } else if (core.xOffset > limit) {
            this.classify(core, "right");
        } else {
            // Regresar al centro
            core.element.style.transition = "left 0.2s ease-out, transform 0.2s ease-out";
            core.xOffset = 0;
            core.element.style.left = `calc(50% - 32px + ${core.randOffset}px + ${core.drift}px)`;
            core.element.style.transform = `rotate(${core.drift * 0.12}deg)`;
        }
    }

    defuseBomb(core) {
        core.isLocked = true;
        
        core.element.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        core.element.style.transform = "scale(0.2) rotate(45deg)";
        core.element.style.opacity = "0";

        const elementToRemove = core.element;
        setTimeout(() => elementToRemove.remove(), 200);

        const idx = this.nuclei.indexOf(core);
        if (idx !== -1) this.nuclei.splice(idx, 1);

        this.evEarned += 2.0;
        if (window.Sonidos) window.Sonidos.play("click");

        this.spawnFloatingText("DEFUSE +2 EV", "50%", core.y + 20, "correct");
        this.updateUI();
    }

    classify(core, direction) {
        if (!this.isPlaying || core.isLocked) return;
        core.isLocked = true;

        if (this.activeDragNucleus === core) {
            this.activeDragNucleus = null;
            core.isDragging = false;
        }

        // Si es una bomba y se clasifica lateralmente, explota
        if (core.isBomb) {
            this.triggerExplosion(core, "50%");
            return;
        }

        // Si los controles están invertidos, cambiar el sentido del input del jugador
        const finalDirection = this.controlsInverted 
            ? (direction === "left" ? "right" : "left") 
            : direction;

        const correct = (finalDirection === "left" && core.type === "stable") || 
                        (finalDirection === "right" && core.type === "flaw");

        // Animar salida
        core.element.style.transition = "left 0.25s ease-out, opacity 0.25s ease-out, top 0.25s ease-out";
        const exitOffset = direction === "left" ? -250 : 250;
        core.element.style.left = `calc(50% - 32px + ${core.randOffset}px + ${core.drift}px + ${exitOffset}px)`;
        core.element.style.opacity = "0";

        const elementToRemove = core.element;
        setTimeout(() => elementToRemove.remove(), 250);

        const idx = this.nuclei.indexOf(core);
        if (idx !== -1) this.nuclei.splice(idx, 1);

        const floatX = direction === "left" ? "20%" : "80%";
        const floatY = core.y + 30;

        if (correct) {
            this.score++;
            this.streak++;
            this.comboMultiplier = Math.min(3, Math.floor(this.streak / 3) + 1);
            
            const baseGain = 5 * this.comboMultiplier;
            const finalGain = core.isGold ? baseGain * 2 : baseGain;
            
            this.evEarned += finalGain;

            if (window.Sonidos) window.Sonidos.play("click");

            const goldLabel = core.isGold ? "⭐ ORO " : "";
            this.spawnFloatingText(`${goldLabel}+${finalGain} EV`, floatX, floatY, core.isGold ? "gold" : "correct");
        } else {
            // Clasificación incorrecta
            this.streak = 0;
            this.comboMultiplier = 1;
            this.evEarned = Math.max(0, this.evEarned - 10);
            this.lives--;

            if (window.Sonidos) window.Sonidos.play("lose");

            if (core.isToxic) {
                // Si la toxina se clasifica mal, invierte controles
                this.invertControls();
                this.spawnFloatingText("☣️ TOXINA: -10 EV", floatX, floatY, "fail");
            } else {
                this.spawnFloatingText("-10 EV", floatX, floatY, "fail");
            }

            if (this.lives <= 0) {
                this.endGame(false);
                return;
            }
        }

        this.updateUI();
    }

    spawnFloatingText(text, x, y, type) {
        const textEl = document.createElement("div");
        textEl.className = `sorting-floating-text ${type}`;
        textEl.innerText = text;
        textEl.style.left = typeof x === "string" ? x : `${x}px`;
        textEl.style.top = typeof y === "string" ? y : `${y}px`;
        this.playArea.appendChild(textEl);
        setTimeout(() => textEl.remove(), 800);
    }

    invertControls() {
        this.controlsInverted = true;
        this.invertTimer = 5; // 5 segundos de inversión
        
        if (this.warningBanner) this.warningBanner.remove();

        this.warningBanner = document.createElement("div");
        this.warningBanner.className = "sorting-warning-inverted";
        this.warningBanner.innerText = "☣️ ¡ALERTA: CONTROLES INVERTIDOS! ☣️";
        this.playArea.appendChild(this.warningBanner);
        
        if (window.Sonidos) window.Sonidos.play("lose");
    }

    triggerExplosion(core, floatX) {
        core.element.style.transition = "transform 0.15s ease-out, opacity 0.15s ease-out";
        core.element.style.transform = "scale(2.2)";
        core.element.style.opacity = "0";

        const elementToRemove = core.element;
        setTimeout(() => elementToRemove.remove(), 150);

        const idx = this.nuclei.indexOf(core);
        if (idx !== -1) this.nuclei.splice(idx, 1);

        this.streak = 0;
        this.comboMultiplier = 1;
        this.evEarned = Math.max(0, this.evEarned - 15);
        this.lives--;

        if (window.Sonidos) window.Sonidos.play("lose");

        this.spawnFloatingText("💥 BOOM! -15 EV", floatX, core.y + 20, "fail");
        this.updateUI();

        if (this.lives <= 0) {
            this.endGame(false);
        }
    }

    updatePhysics() {
        if (!this.isPlaying) return;

        // 1. Administrar el spawn por acumulador de tiempo
        this.lastSpawnTime += 20;
        if (this.lastSpawnTime >= this.spawnCooldown) {
            this.spawnNucleus();
            this.lastSpawnTime = 0;
        }

        // 2. Actualizar la física de los botes
        const limitY = (this.playArea.clientHeight || 400) - 120 - 64;

        for (let i = this.nuclei.length - 1; i >= 0; i--) {
            const core = this.nuclei[i];
            if (core.isLocked) continue;

            const speedMultiplier = core.isDragging ? 0.35 : 1.0;
            core.y += this.fallSpeed * speedMultiplier;

            // Oscilación senoidal horizontal (Drift de laboratorio balanceado)
            // No aplica mientras se arrastra directamente
            if (!core.isDragging) {
                core.drift = Math.sin(core.y * 0.038) * 28;
            }

            core.element.style.top = core.y + "px";
            core.element.style.left = `calc(50% - 32px + ${core.randOffset}px + ${core.drift}px + ${core.xOffset}px)`;
            
            const rotate = (core.xOffset + core.drift) * 0.12;
            core.element.style.transform = `rotate(${rotate}deg)`;

            // Comprobar colisión con el suelo (subsuelo a 120px)
            if (core.y >= limitY) {
                core.isLocked = true;
                
                if (core.isBomb) {
                    // La bomba explota
                    this.triggerExplosion(core, "50%");
                } else {
                    // Choque del bote normal / toxina
                    core.element.style.transition = "transform 0.15s ease-out, opacity 0.15s ease-out";
                    core.element.style.transform = "scale(0.8)";
                    core.element.style.opacity = "0";
                    
                    const elementToRemove = core.element;
                    setTimeout(() => elementToRemove.remove(), 150);

                    this.streak = 0;
                    this.comboMultiplier = 1;
                    this.evEarned = Math.max(0, this.evEarned - 10);
                    this.lives--;

                    if (window.Sonidos) window.Sonidos.play("lose");

                    if (core.isToxic) {
                        // La toxina derramada en el suelo invierte controles
                        this.invertControls();
                        this.spawnFloatingText("☣️ TOXINA: -10 EV", "50%", limitY - 10, "fail");
                    } else {
                        this.spawnFloatingText("-10 EV", "50%", limitY - 10, "fail");
                    }
                    
                    const idx = this.nuclei.indexOf(core);
                    if (idx !== -1) this.nuclei.splice(idx, 1);
                    
                    this.updateUI();

                    if (this.lives <= 0) {
                        this.endGame(false);
                        return;
                    }
                }
            }
        }
    }

    endGame(quit = false) {
        this.isPlaying = false;
        clearInterval(this.gameTimerInterval);
        clearInterval(this.physicsInterval);

        // Limpiar clase de fondo de playArea
        this.playArea.className = "";

        // Remover elementos
        this.nuclei.forEach(core => {
            if (core.element) core.element.remove();
        });
        this.nuclei = [];
        this.activeDragNucleus = null;

        if (this.warningBanner) {
            this.warningBanner.remove();
            this.warningBanner = null;
        }

        Array.from(this.playArea.querySelectorAll(".sorting-zone-left, .sorting-zone-right, .sorting-combo-badge, .sorting-nucleus, .sorting-floating-text, .sorting-warning-inverted")).forEach(el => el.remove());

        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "block";

        if (!quit) {
            if (window.Sonidos) window.Sonidos.play("heal");

            // Otorgar EV ganado real
            if (this.evEarned > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(this.evEarned);
            }

            // XP de Laboratorio
            const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                ? window.completarMinijuegoArcade("Clasificador de ADN") 
                : 0;

            // Incrementar diversión del Geno activo
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

                let headerMsg = this.lives <= 0 ? "💥 ¡INTEGRIDAD DE ADN CRÍTICA (GAME OVER)!" : "🧪 ¡Sesión Completa!";
                let msg = `${headerMsg}\nBotes clasificados: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                alert(msg);
            } else {
                let headerMsg = this.lives <= 0 ? "💥 ¡INTEGRIDAD DE ADN CRÍTICA (GAME OVER)!" : "🧪 ¡Sesión Completa!";
                let msg = `${headerMsg}\nBotes clasificados: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                alert(msg);
            }
        }

        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameSorting();
});
