// MinigameRunner.js - Juego estilo Endless Runner 2D (Carrera del Nexo)
// El jugador controla al Geno saltando y haciendo doble salto sobre obstáculos.

class MinigameRunner {
    constructor() {
        window.minigameRunner = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.distance = 0;
        this.meters = 0;
        this.evEarned = 0;
        this.cellsCollected = 0;
        this.floorHeight = 120; // Piso subido a ~1/4 de la pantalla
        this.isPlaying = false;
        
        // Parámetros de física (Coordenadas relativas al suelo)
        this.playerY = 0; // Altura del Geno sobre la línea del suelo
        this.playerVelocity = 0;
        this.gravity = -0.42; // Gravedad hacia abajo
        this.jumpForce = 8.2; // Fuerza de salto inicial
        this.doubleJumpForce = 6.8; // Fuerza de segundo salto
        this.doubleJumpAvailable = false;

        // Parámetros de juego
        this.speed = 4.14; // Velocidad inicial aumentada un 15% (de 3.6 a 4.14)
        this.baseSpeed = 4.14;
        this.gameTime = 0;
        this.startTime = 0;
        this.speedUpTriggered = false;

        // Elementos y listas
        this.playerElement = null;
        this.groundLineElement = null;
        this.obstacles = [];
        this.cells = [];
        this.gameLoopInterval = null;
        this.spawnTimeoutId = null;

        this.initEvents();
    }

    initEvents() {
        const handleJump = (e) => {
            if (this.isPlaying) {
                e.preventDefault();
                this.jump();
            }
        };

        this.playArea.addEventListener("mousedown", handleJump);
        this.playArea.addEventListener("touchstart", handleJump, { passive: false });

        document.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
                if (this.isPlaying) {
                    e.preventDefault();
                    this.jump();
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
    }

    start() {
        this.startGame();
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");

        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none";

        // Limpiar área de juego y aplicar fondo runner
        this.playArea.className = "";
        this.playArea.classList.add("game-runner-bg");

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

        // Inicializar variables de juego
        this.playerY = 0; // En el suelo
        this.playerVelocity = 0;
        this.doubleJumpAvailable = false;

        this.distance = 0;
        this.meters = 0;
        this.evEarned = 0;
        this.cellsCollected = 0;
        this.speed = this.baseSpeed;
        this.isPlaying = true;
        this.startTime = Date.now();
        this.gameTime = 0;
        this.speedUpTriggered = false;

        // Crear fondo cyber-lab de fondo (backdrop)
        this.backdropElement = document.createElement("div");
        this.backdropElement.className = "runner-backdrop";
        this.backdropElement.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Background Gradient -->
                <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#140628"/>
                    <stop offset="40%" stop-color="#3b0954"/>
                    <stop offset="75%" stop-color="#730e70"/>
                    <stop offset="100%" stop-color="#ba126c"/>
                </linearGradient>
                
                <!-- Reactor Glow -->
                <radialGradient id="reactor-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.5"/>
                    <stop offset="50%" stop-color="#ff007f" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
                </radialGradient>
                
                <!-- Cyber Grid -->
                <pattern id="cyber-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#d500f9" stroke-width="0.5" opacity="0.3"/>
                </pattern>
            </defs>
            
            <!-- Background base -->
            <rect x="0" y="0" width="400" height="300" fill="url(#bg-gradient)"/>
            
            <!-- Tech Grid Overlay -->
            <rect x="0" y="0" width="400" height="300" fill="url(#cyber-grid)"/>
            
            <!-- Reactor radial light -->
            <rect x="0" y="0" width="400" height="300" fill="url(#reactor-glow)" style="mix-blend-mode: screen;"/>
            
            <!-- Neon pipes/cables with drop shadow effect (glowing) -->
            <path d="M 0 30 Q 100 80 200 40 T 400 30" fill="none" stroke="#ff007f" stroke-width="3" opacity="0.85" style="filter: drop-shadow(0 0 3px #ff007f);"/>
            <path d="M 0 50 Q 120 20 200 60 T 400 50" fill="none" stroke="#00e5ff" stroke-width="2" opacity="0.8" style="filter: drop-shadow(0 0 3px #00e5ff);"/>
            <path d="M 0 90 Q 150 120 250 80 T 400 110" fill="none" stroke="#ffd54f" stroke-width="1.5" opacity="0.75" style="filter: drop-shadow(0 0 2px #ffd54f);"/>
            
            <!-- Side glowing structural columns -->
            <line x1="30" y1="0" x2="30" y2="300" stroke="#00e5ff" stroke-width="2" opacity="0.6" stroke-dasharray="10 5" style="filter: drop-shadow(0 0 2px #00e5ff);"/>
            <line x1="370" y1="0" x2="370" y2="300" stroke="#ff007f" stroke-width="2" opacity="0.6" stroke-dasharray="10 5" style="filter: drop-shadow(0 0 2px #ff007f);"/>
            

        </svg>`;
        this.playArea.appendChild(this.backdropElement);

        // Crear línea de suelo neón y plataforma de subsuelo
        this.groundLineElement = document.createElement("div");
        this.groundLineElement.className = "runner-ground-line";
        this.playArea.appendChild(this.groundLineElement);

        this.subfloorElement = document.createElement("div");
        this.subfloorElement.className = "runner-subfloor";
        this.playArea.appendChild(this.subfloorElement);

        // Crear personaje Geno de perfil derecho
        this.playerElement = document.createElement("div");
        this.playerElement.id = "runner-player";
        this.playerElement.className = "profile-view-right";
        this.playerElement.style.position = "absolute";
        this.playerElement.style.left = "20%";
        this.playerElement.style.top = "auto"; // Limpiar top para usar bottom
        this.playerElement.style.bottom = this.floorHeight + "px"; // Alineado al nuevo suelo (120px)
        this.playerElement.style.width = "65px";
        this.playerElement.style.height = "65px";
        this.playerElement.style.zIndex = "10";

        const activeGeno = window.miMascota || { body_shape: "frijol", base_color: "#77DD77", eye_type: "estandar", mouth_type: "estandar" };
        const cleanAdn = {
            body_shape: activeGeno.body_shape || "frijol",
            base_color: activeGeno.base_color || activeGeno.color || "#77DD77",
            color: activeGeno.base_color || activeGeno.color || "#77DD77",
            eye_type: activeGeno.eye_type || "estandar",
            mouth_type: activeGeno.mouth_type || "estandar",
            wing_type: "ninguno",
            hat_type: "ninguno",
            skin_type: "ninguno",
            aura_type: "ninguno",
            isEgg: false,
            scanned: false
        };

        const fallbackSvg = `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#ffd700" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
        this.playerElement.innerHTML = typeof generarSvgGeno === 'function' ? generarSvgGeno(cleanAdn) : fallbackSvg;
        this.playArea.appendChild(this.playerElement);

        this.obstacles = [];
        this.cells = [];

        this.updateUI();

        // Arrancar loops
        this.gameLoopInterval = setInterval(() => this.updatePhysics(), 20);
        
        // Spawnear el primer obstáculo rápido a los 600ms para acción inmediata
        this.spawnTimeoutId = setTimeout(() => {
            if (this.isPlaying) {
                this.spawnObstacle();
                this.scheduleSpawn();
            }
        }, 600);
    }

    updateUI() {
        const evDisplay = ` | +${Number(this.evEarned).toFixed(2)} EV`;
        this.scoreDisplay.innerText = `Metros: ${this.meters}m${evDisplay}`;
        this.timerDisplay.innerText = `Nexo: ${Math.floor(this.gameTime)}s`;
    }

    jump() {
        if (!this.isPlaying) return;
        
        // Si está en el suelo (con tolerancia de 1px)
        if (this.playerY <= 1) {
            this.playerVelocity = this.jumpForce;
            this.doubleJumpAvailable = true;
            if (window.Sonidos) window.Sonidos.play("click");
        } 
        // Si está en el aire y tiene el doble salto disponible
        else if (this.doubleJumpAvailable) {
            this.playerVelocity = this.doubleJumpForce;
            this.doubleJumpAvailable = false;
            if (window.Sonidos) window.Sonidos.play("click");

            // Crear anillo visual de doble salto
            this.spawnDoubleJumpRing();
        }
    }

    spawnDoubleJumpRing() {
        const playAreaWidth = this.playArea.clientWidth || 300;
        const playerX = playAreaWidth * 0.2;
        
        const ring = document.createElement("div");
        ring.style = `position: absolute; left: ${playerX - 10}px; bottom: ${this.floorHeight + this.playerY - 5}px; width: 85px; height: 10px; border: 2px solid #00e5ff; border-radius: 50%; opacity: 0.8; transform: scale(0.5); transition: transform 0.3s ease-out, opacity 0.3s ease-out; z-index: 8; pointer-events: none; box-shadow: 0 0 6px #00e5ff;`;
        this.playArea.appendChild(ring);

        setTimeout(() => {
            ring.style.transform = "scale(1.2)";
            ring.style.opacity = "0";
        }, 10);

        setTimeout(() => ring.remove(), 400);
    }

    scheduleSpawn() {
        if (!this.isPlaying) return;

        // Spawn aleatorio entre obstáculos y células
        const delay = this.speedUpTriggered 
            ? (650 + Math.random() * 650) 
            : (1200 + Math.random() * 1000);

        this.spawnTimeoutId = setTimeout(() => {
            if (this.isPlaying) {
                // Decidir si spawnear un obstáculo o una célula flotante
                const roll = Math.random();
                if (roll < 0.75) {
                    this.spawnObstacle();
                } else {
                    this.spawnCell();
                }
                this.scheduleSpawn();
            }
        }, delay);
    }

    spawnObstacle() {
        const playAreaWidth = this.playArea.clientWidth || 300;
        const roll = Math.random();
        const obstacle = document.createElement("div");
        obstacle.className = "runner-obstacle";

        let width, height, svg, yOffset = 0;

        if (roll < 0.30) {
            // Charco de ácido (suelo)
            width = 48;
            height = 10;
            yOffset = 0;
            svg = `<svg viewBox="0 0 32 8" width="100%" height="100%" fill="#00e676" stroke="#003311" stroke-width="0.8" style="filter: drop-shadow(0 0 6px #00e676); opacity: 0.95;"><path d="M1 7c2-1 4-1 6 0s4 1 6 0s4-2 6-1 4 2 6 1 4-1 6 0v1H1z"/></svg>`;
        } else if (roll < 0.55) {
            // Escombro mecánico (caja simple en el suelo)
            width = 30;
            height = 32;
            yOffset = 0;
            svg = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#1a0a03" stroke="#ff6d3b" stroke-width="2.2" style="filter: drop-shadow(0 0 6px #ff5722);"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 7.5H3M16.5 21V3M7.5 21V3M3 16.5h18"/></svg>`;
        } else if (roll < 0.75) {
            // Cajas apiladas / Sobre cajas (suelo, obstáculo doble)
            width = 30;
            height = 58;
            yOffset = 0;
            svg = `<svg viewBox="0 0 24 48" width="100%" height="100%" fill="#1a0a03" stroke="#ff6d3b" stroke-width="2.2" style="filter: drop-shadow(0 0 6px #ff5722);"><g transform="translate(0, 24)"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 7.5H3M16.5 21V3M7.5 21V3M3 16.5h18"/></g><g transform="translate(0, 0)"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 7.5H3M16.5 21V3M7.5 21V3M3 16.5h18"/></g></svg>`;
        } else {
            // Dron cibernético aéreo (¡Obstáculo aéreo!)
            width = 36;
            height = 20;
            // yOffset puede ser 28 (bajo, hay que saltarlo) o 65 (alto, hay que pasar por abajo)
            yOffset = Math.random() > 0.5 ? 65 : 28;
            svg = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#12021c" stroke="#ff55ff" stroke-width="2.2" style="filter: drop-shadow(0 0 6px #ea00ff);"><path d="M4 10h16M12 4v6M6 14c0 3 6 4 6 4s6-1 6-4" stroke-linecap="round"/><circle cx="12" cy="7" r="3" fill="#00ffcc"/><path d="M2 10l3-3M22 10l-3-3"/></svg>`;
        }

        obstacle.style.width = width + "px";
        obstacle.style.height = height + "px";
        obstacle.style.left = playAreaWidth + "px";
        obstacle.style.top = "auto";
        obstacle.style.bottom = (this.floorHeight + yOffset) + "px"; // Posicionado relativo al nuevo suelo
        obstacle.innerHTML = svg;

        this.playArea.appendChild(obstacle);
        this.obstacles.push({
            x: playAreaWidth,
            y: yOffset,
            width: width,
            height: height,
            element: obstacle
        });
    }

    spawnCell() {
        const playAreaWidth = this.playArea.clientWidth || 300;

        // Spawn a una altura que requiere saltar (entre 55px y 105px sobre el suelo)
        const cellHeight = 24;
        const cellWidth = 24;
        const cellBottom = this.floorHeight + 55 + Math.random() * 50;

        const cell = document.createElement("div");
        cell.className = "runner-cell";
        cell.style.width = cellWidth + "px";
        cell.style.height = cellHeight + "px";
        cell.style.left = playAreaWidth + "px";
        cell.style.top = "auto";
        cell.style.bottom = cellBottom + "px";

        // Estrella de energía neón
        cell.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#ffd54f" style="filter: drop-shadow(0 0 6px #ffd54f);"><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"/></svg>`;

        this.playArea.appendChild(cell);
        this.cells.push({
            x: playAreaWidth,
            y: cellBottom,
            width: cellWidth,
            height: cellHeight,
            element: cell
        });
    }

    updatePhysics() {
        if (!this.isPlaying) return;

        // Actualizar tiempo transcurrido
        this.gameTime = (Date.now() - this.startTime) / 1000;

        // Aceleración de dificultad a los 30 segundos
        if (this.gameTime >= 30 && !this.speedUpTriggered) {
            this.speedUpTriggered = true;
            this.speed = this.baseSpeed * 1.5;
            this.triggerSpeedUpWarning();
            if (window.Sonidos) window.Sonidos.play("select");
        }

        // Aplicar gravedad y física vertical al Geno
        this.playerVelocity += this.gravity;
        this.playerY += this.playerVelocity;

        // Limitar caída al suelo
        if (this.playerY <= 0) {
            this.playerY = 0;
            this.playerVelocity = 0;
        }

        // Renderizar Geno con bottom
        if (this.playerElement) {
            this.playerElement.style.bottom = (this.floorHeight + this.playerY) + "px";
        }

        // Incrementar distancia recorrida
        this.distance += this.speed * 0.045; 
        this.meters = Math.floor(this.distance);
        
        // Sumar EV base por distancia recorrida (0.10 EV por cada 30 metros) + células (0.50 EV por estrella)
        this.evEarned = parseFloat((Math.floor(this.meters / 30) * 0.10 + this.cellsCollected * 0.50).toFixed(2));

        this.updateUI();

        const playAreaWidth = this.playArea.clientWidth || 300;
        const playerX = playAreaWidth * 0.2;

        // Hitbox del Geno
        const pLeft = playerX + 16;
        const pRight = playerX + 49;
        const pBottom = this.floorHeight + this.playerY + 8;
        const pTop = this.floorHeight + this.playerY + 57;

        // 1. Mover y colisionar con obstáculos
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.speed;
            obs.element.style.left = obs.x + "px";

            // Limpieza fuera de pantalla
            if (obs.x < -obs.width) {
                obs.element.remove();
                this.obstacles.splice(i, 1);
                continue;
            }

            // Hitbox del obstáculo (soporta offsets y offsets aéreos obs.y)
            const oLeft = obs.x + 4;
            const oRight = obs.x + obs.width - 4;
            const oBottom = this.floorHeight + obs.y;
            const oTop = this.floorHeight + obs.y + obs.height - 2;

            // Colisión = Game Over
            if (
                pRight > oLeft &&
                pLeft < oRight &&
                pTop > oBottom &&
                pBottom < oTop
            ) {
                this.endGame(false);
                return;
            }
        }

        // 2. Mover y recoger células de energía
        for (let i = this.cells.length - 1; i >= 0; i--) {
            const cell = this.cells[i];
            cell.x -= this.speed;
            cell.element.style.left = cell.x + "px";

            // Limpieza fuera de pantalla
            if (cell.x < -cell.width) {
                cell.element.remove();
                this.cells.splice(i, 1);
                continue;
            }

            // Hitbox de la célula
            const cLeft = cell.x + 2;
            const cRight = cell.x + cell.width - 2;
            const cBottom = cell.y + 2;
            const cTop = cell.y + cell.height - 2;

            // Colisión = Recolección
            if (
                pRight > cLeft &&
                pLeft < cRight &&
                pTop > cBottom &&
                pBottom < cTop
            ) {
                // Incrementar contador de células
                this.cellsCollected++;
                
                // Recalcular EV total (0.10 EV por cada 30 metros + 0.50 EV por estrella)
                this.evEarned = parseFloat((Math.floor(this.meters / 30) * 0.10 + this.cellsCollected * 0.50).toFixed(2));
                
                // Efecto de chispa / sonido
                if (window.Sonidos) window.Sonidos.play("select");
                
                // Quitar de pantalla y de lista
                cell.element.remove();
                this.cells.splice(i, 1);
                this.updateUI();
            }
        }
    }

    triggerSpeedUpWarning() {
        const warning = document.createElement("div");
        warning.className = "runner-warning";
        warning.innerText = "🚨 ACELERACIÓN DE RED NEXO: VELOCIDAD +50% 🚨";
        warning.style = "position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); color: #ff1744; font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 900; text-shadow: 0 0 10px #ff1744; z-index: 100; text-align: center; width: 90%; transition: opacity 1.5s; opacity: 1; pointer-events: none;";
        this.playArea.appendChild(warning);

        setTimeout(() => {
            warning.style.opacity = "0";
        }, 1200);

        setTimeout(() => warning.remove(), 2700);
    }

    endGame(quit = false) {
        this.isPlaying = false;
        clearInterval(this.gameLoopInterval);
        clearTimeout(this.spawnTimeoutId);

        // Limpiar clase de fondo de playArea
        this.playArea.className = "";

        // Remover elementos del DOM
        this.obstacles.forEach(o => o.element.remove());
        this.cells.forEach(c => c.element.remove());
        if (this.playerElement) this.playerElement.remove();
        if (this.groundLineElement) this.groundLineElement.remove();
        if (this.subfloorElement) this.subfloorElement.remove();
        if (this.backdropElement) this.backdropElement.remove();

        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "block";

        if (!quit) {
            if (window.Sonidos) window.Sonidos.play("lose");

            // Cálculo de inyección de Jabón/Ducha de Plasma (1 cada 50 metros)
            const showersWon = Math.floor(this.meters / 50);
            
            if (showersWon > 0 && window.miInventario) {
                window.miInventario.addItem({
                    id: "plasma_shower",
                    name: "Ducha de Plasma",
                    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"><rect x="3" y="10" width="18" height="11" rx="3" stroke="#00E5FF" stroke-width="2"/><circle cx="7" cy="13" r="1.5" fill="#00E5FF"/><circle cx="12" cy="15" r="2" fill="#00E5FF"/><path d="M12 2v8" stroke="#00E5FF" stroke-width="2"/></svg>`,
                    type: "consumable",
                    maxStack: 20,
                    desc: "Limpia a todo tu inventario de mascotas a 100% de Higiene.",
                    count: showersWon
                });
            }

            // Inyectar EV a la cartera
            if (this.evEarned > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(this.evEarned);
            }

            // Otorgar XP de Laboratorio
            const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                ? window.completarMinijuegoArcade("Carrera del Nexo") 
                : 0;

            // Afectar necesidades y diversión del Geno Compañero activo
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

                let msg = `💥 ¡Colisión registrada!\nRecorriste: ${this.meters} metros.\nTotal EV acumulada: +${this.evEarned} EV.`;
                if (showersWon > 0) msg += `\n¡Ganaste ${showersWon} Ducha(s) de Plasma por recorrer la red!`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                alert(msg);
            } else {
                let msg = `💥 ¡Colisión registrada!\nRecorriste: ${this.meters} metros.\nTotal EV acumulada: +${this.evEarned} EV.`;
                if (showersWon > 0) msg += `\n¡Ganaste ${showersWon} Ducha(s) de Plasma por recorrer la red!`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                alert(msg);
            }
        }

        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameRunner();
});
