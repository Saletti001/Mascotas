// MinigameBubbles.js - Burbujas Elementales (Aim Matcher)
// Juego estilo Bubble Shooter / Puzzle Bobble integrado en el Salón Arcade de Mascotas.
// El jugador agrupa 3 o más células elementales del mismo color para reventarlas y generar reacciones en cadena.

class MinigameBubbles {
    constructor() {
        window.minigameBubbles = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.score = 0;
        this.evEarned = 0;
        this.isPlaying = false;

        // Físicas de descenso continuo
        this.gridY = 0;
        this.descendSpeed = 1.8; // velocidad en px por segundo

        // Dimensiones del juego
        this.gameWidth = 350;
        this.gameHeight = 350;

        // Cañón y Burbujas
        this.cannonX = 175;
        this.cannonY = 320;
        this.cannonAngle = -Math.PI / 2; // apuntando arriba por defecto
        this.currentBubble = null; // { element, type } cargada
        this.nextBubble = null; // vista previa
        
        // Proyectil activo
        this.firedBubble = null; // { x, y, vx, vy, type, element }

        // Red Hexagonal
        this.cols = 10;
        this.rows = 14;
        this.bubbleRadius = 15;
        this.bubbleDiameter = 30;
        this.rowHeight = 26; // Math.floor(30 * 0.866)
        this.gridOffsetX = 0;

        this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));

        // Tipos de elementos y sus colores/SVGs
        this.elements = ["biomutante", "viral", "cibernetico", "radiactivo", "toxico", "sintetico"];
        
        // Tiros realizados para controlar el descenso del techo
        this.shotsCount = 0;

        // Elementos DOM
        this.cannonElement = null;
        this.aimLineElement = null;
        this.gridContainer = null;
        this.dangerLineElement = null;

        // Loops y Listeners
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

        // Seguir el puntero para rotar el cañón
        const handlePointerMove = (e) => {
            if (!this.isPlaying) return;
            const rect = this.playArea.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;

            const dx = mouseX - this.cannonX;
            const dy = mouseY - this.cannonY;

            // Restringir el ángulo para evitar apuntar hacia abajo
            let angle = Math.atan2(dy, dx);
            if (angle > -0.2 && angle < Math.PI / 2) angle = -0.2;
            if (angle < -2.94 || angle >= Math.PI / 2) angle = -2.94;

            this.cannonAngle = angle;
            this.updateCannonRotation();
        };

        this.playArea.addEventListener("mousemove", handlePointerMove);
        this.playArea.addEventListener("touchmove", handlePointerMove, { passive: true });

        // Disparar
        const handleShoot = (e) => {
            if (!this.isPlaying) return;
            e.preventDefault();
            this.shootBubble();
        };

        this.playArea.addEventListener("mousedown", handleShoot);
        this.playArea.addEventListener("touchstart", handleShoot, { passive: false });
    }

    start() {
        this.startGame();
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");

        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none";

        // Limpiar área de juego y aplicar fondo bubbles
        this.playArea.className = "";
        this.playArea.classList.add("game-bubbles-bg");

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

        // Dimensiones reales
        this.gameWidth = this.playArea.clientWidth || 350;
        this.gameHeight = this.playArea.clientHeight || 350;
        this.cannonX = this.gameWidth / 2;
        this.cannonY = this.gameHeight - 35;
        this.gridOffsetX = (this.gameWidth - (this.cols * this.bubbleDiameter)) / 2;

        // Contenedor del tablero
        this.gridContainer = document.createElement("div");
        this.gridContainer.className = "bubbles-grid-container";
        this.gridContainer.style.position = "absolute";
        this.gridContainer.style.top = "0px";
        this.gridContainer.style.left = "0px";
        this.gridContainer.style.width = "100%";
        this.gridContainer.style.height = "100%";
        this.playArea.appendChild(this.gridContainer);

        // Crear línea de peligro
        this.dangerLineElement = document.createElement("div");
        this.dangerLineElement.className = "danger-threshold-line";
        this.dangerLineElement.style.position = "absolute";
        this.dangerLineElement.style.width = "100%";
        this.dangerLineElement.style.height = "2px";
        // Umbral a 90px sobre el cañón
        this.dangerLineElement.style.bottom = "90px";
        this.playArea.appendChild(this.dangerLineElement);

        // Crear SVG para línea de guía de puntería
        const svgAim = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgAim.style.position = "absolute";
        svgAim.style.top = "0px";
        svgAim.style.left = "0px";
        svgAim.style.width = "100%";
        svgAim.style.height = "100%";
        svgAim.style.pointerEvents = "none";
        svgAim.style.zIndex = "4";
        
        this.aimLineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.aimLineElement.setAttribute("class", "aim-guide-line");
        this.aimLineElement.setAttribute("fill", "none");
        this.aimLineElement.setAttribute("stroke-dasharray", "5, 6");
        svgAim.appendChild(this.aimLineElement);
        this.playArea.appendChild(svgAim);

        // Crear cañón visual
        this.cannonElement = document.createElement("div");
        this.cannonElement.className = "bubble-cannon";
        this.cannonElement.style.position = "absolute";
        this.cannonElement.style.left = `${this.cannonX - 18}px`;
        this.cannonElement.style.bottom = "12px";
        this.cannonElement.style.width = "36px";
        this.cannonElement.style.height = "50px";
        this.cannonElement.style.transformOrigin = "50% 80%";
        this.cannonElement.innerHTML = `
            <div class="cannon-pipe"></div>
            <div class="cannon-base"></div>
        `;
        this.playArea.appendChild(this.cannonElement);

        // Inicializar variables de juego
        this.score = 0;
        this.evEarned = 0;
        this.shotsCount = 0;
        this.firedBubble = null;
        this.gridY = 0;
        this.descendSpeed = 1.8;
        this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));

        // Rellenar las primeras 4 filas
        for (let r = 0; r < 4; r++) {
            const maxCols = (r % 2 === 0) ? this.cols : this.cols - 1;
            for (let c = 0; c < maxCols; c++) {
                const type = this.elements[Math.floor(Math.random() * this.elements.length)];
                this.spawnGridBubble(r, c, type);
            }
        }

        this.isPlaying = true;
        this.prepareNextBubbles();
        this.updateCannonRotation();
        this.updateUI();

        // Arrancar loop físico
        this.physicsInterval = setInterval(() => this.updatePhysics(), 16.6); // 60 fps fluidos
    }

    updateUI() {
        const evDisplay = ` | +${Number(this.evEarned).toFixed(2)} EV`;
        this.scoreDisplay.innerText = `Células: ${this.score}${evDisplay}`;
        this.timerDisplay.innerText = `Dificultad: x${(this.descendSpeed / 1.8).toFixed(1)}`;
    }

    prepareNextBubbles() {
        if (!this.isPlaying) return;

        // Cargar del preview anterior o generar nuevo
        const activeType = this.nextBubble ? this.nextBubble.type : this.elements[Math.floor(Math.random() * this.elements.length)];
        const nextType = this.elements[Math.floor(Math.random() * this.elements.length)];

        // 1. Burbuja cargada en el cañón
        const currEl = document.createElement("div");
        currEl.className = `elemental-bubble ${activeType}`;
        currEl.style.position = "absolute";
        currEl.style.left = `${this.cannonX - this.bubbleRadius}px`;
        currEl.style.bottom = "20px";
        currEl.style.width = `${this.bubbleDiameter}px`;
        currEl.style.height = `${this.bubbleDiameter}px`;
        currEl.style.zIndex = "9"; // Encima del cañón (z-index: 8) para que sea visible
        currEl.innerHTML = this.getBubbleSvg(activeType);
        this.playArea.appendChild(currEl);

        this.currentBubble = { element: currEl, type: activeType };

        // 2. Vista previa (próxima) en la esquina izquierda del cañón
        if (this.nextBubble && this.nextBubble.element) {
            this.nextBubble.element.remove();
        }

        const previewEl = document.createElement("div");
        previewEl.className = `elemental-bubble ${nextType}`;
        previewEl.style.position = "absolute";
        previewEl.style.left = `${this.cannonX - 55}px`;
        previewEl.style.bottom = "12px";
        previewEl.style.width = `28px`; // Aumentado para que no sea tan pequeña
        previewEl.style.height = `28px`;
        previewEl.style.opacity = "0.85";
        previewEl.style.zIndex = "6";
        previewEl.innerHTML = this.getBubbleSvg(nextType, true);
        this.playArea.appendChild(previewEl);

        this.nextBubble = { element: previewEl, type: nextType };
    }

    updateCannonRotation() {
        if (!this.cannonElement || !this.aimLineElement) return;

        // Rotar cañón DOM
        const displayAngleRad = this.cannonAngle + Math.PI / 2;
        this.cannonElement.style.transform = `rotate(${displayAngleRad}rad)`;

        // Dibujar línea guía de puntería con rebotado
        const pathPoints = this.calculateTrajectory();
        let pathD = `M ${pathPoints[0][0]} ${pathPoints[0][1]}`;
        for (let i = 1; i < pathPoints.length; i++) {
            pathD += ` L ${pathPoints[i][0]} ${pathPoints[i][1]}`;
        }
        this.aimLineElement.setAttribute("d", pathD);
    }

    calculateTrajectory() {
        let x = this.cannonX;
        let y = this.gameHeight - 35;
        let vx = Math.cos(this.cannonAngle);
        let vy = Math.sin(this.cannonAngle);
        const points = [[x, y]];

        // Simular hasta 3 segmentos de trayectoria para el reflejo
        for (let bounce = 0; bounce < 3; bounce++) {
            let tx = Infinity;
            if (vx > 0) {
                tx = (this.gameWidth - this.bubbleRadius - x) / vx;
            } else if (vx < 0) {
                tx = (this.bubbleRadius - x) / vx;
            }
            
            let ty = (this.bubbleRadius - y) / vy;
            let t = Math.min(tx, ty);

            // Avance
            x = x + vx * t;
            y = y + vy * t;
            points.push([x, y]);

            if (t === ty) {
                // Llegó al techo superior
                break;
            } else {
                // Rebotó en pared lateral
                vx = -vx;
            }
        }
        return points;
    }

    shootBubble() {
        if (!this.isPlaying || this.firedBubble || !this.currentBubble) return;

        const type = this.currentBubble.type;
        const el = this.currentBubble.element;

        // Disparar
        this.firedBubble = {
            x: this.cannonX,
            y: this.gameHeight - 35,
            vx: Math.cos(this.cannonAngle) * 9.5, // velocidad constante
            vy: Math.sin(this.cannonAngle) * 9.5,
            type: type,
            element: el
        };

        this.currentBubble = null;
        if (window.Sonidos) window.Sonidos.play("click");
    }

    updatePhysics() {
        if (!this.isPlaying) return;

        // Mover proyectil disparado
        if (this.firedBubble) {
            const fb = this.firedBubble;
            fb.x += fb.vx;
            fb.y += fb.vy;

            // Renderizar burbuja voladora
            fb.element.style.left = `${fb.x - this.bubbleRadius}px`;
            fb.element.style.top = `${fb.y - this.bubbleRadius}px`;
            fb.element.style.bottom = "auto"; // limpiar bottom anterior

            // Rebote lateral
            if (fb.x <= this.bubbleRadius) {
                fb.x = this.bubbleRadius;
                fb.vx = -fb.vx;
                if (window.Sonidos) window.Sonidos.play("select");
            } else if (fb.x >= this.gameWidth - this.bubbleRadius) {
                fb.x = this.gameWidth - this.bubbleRadius;
                fb.vx = -fb.vx;
                if (window.Sonidos) window.Sonidos.play("select");
            }

            // Validar colisiones con el tablero
            const collisionCell = this.checkGridCollisions(fb.x, fb.y);
            if (collisionCell || fb.y <= this.bubbleRadius) {
                // Snap (acoplar en la red)
                const snapCell = this.findNearestSnapCell(fb.x, fb.y);
                if (snapCell) {
                    this.snapBubble(snapCell.r, snapCell.c, fb.type, fb.element);
                } else {
                    // Si falla el snap (ej. lleno hasta el cañón)
                    fb.element.remove();
                    this.endGame(false);
                }
                this.firedBubble = null;
            }
        }

        // Mover burbujas cayendo (reacción en cadena)
        const falling = this.playArea.querySelectorAll(".elemental-bubble.falling");
        falling.forEach(el => {
            let y = parseFloat(el.style.top) || 0;
            let x = parseFloat(el.style.left) || 0;
            let vx = parseFloat(el.dataset.vx) || 0;
            let vy = parseFloat(el.dataset.vy) || 5;
            let va = parseFloat(el.dataset.va) || 3;
            let angle = parseFloat(el.dataset.angle) || 0;

            vy += 0.28; // gravedad
            y += vy;
            x += vx;
            angle += va;

            el.style.top = `${y}px`;
            el.style.left = `${x}px`;
            el.style.transform = `rotate(${angle}deg)`;
            el.dataset.vy = vy;
            el.dataset.angle = angle;

            if (y > this.gameHeight + 40) {
                el.remove();
            }
        });
    }

    checkGridCollisions(bx, by) {
        for (let r = 0; r < this.rows; r++) {
            const maxCols = (r % 2 === 0) ? this.cols : this.cols - 1;
            for (let c = 0; c < maxCols; c++) {
                const cell = this.grid[r][c];
                if (cell !== null) {
                    const cellPos = this.getCellCoords(r, c);
                    const dist = Math.hypot(bx - cellPos.x, by - cellPos.y);
                    // Colisión a distancia del diámetro (con un pequeño solape estético)
                    if (dist < this.bubbleDiameter - 2) {
                        return { r: r, c: c };
                    }
                }
            }
        }
        return null;
    }

    findNearestSnapCell(bx, by) {
        let bestCell = null;
        let minDist = Infinity;

        for (let r = 0; r < this.rows; r++) {
            const maxCols = (r % 2 === 0) ? this.cols : this.cols - 1;
            for (let c = 0; c < maxCols; c++) {
                if (this.grid[r][c] === null) {
                    const cellPos = this.getCellCoords(r, c);
                    const dist = Math.hypot(bx - cellPos.x, by - cellPos.y);
                    if (dist < minDist) {
                        minDist = dist;
                        bestCell = { r: r, c: c };
                    }
                }
            }
        }
        return bestCell;
    }

    snapBubble(r, c, type, el) {
        this.spawnGridBubble(r, c, type, el);
        this.shotsCount++;

        // Algoritmo BFS para encontrar coincidencias de color
        const matches = this.findMatches(r, c, type);

        if (matches.length >= 3) {
            // Reventar burbujas
            matches.forEach(cell => {
                const gridCell = this.grid[cell.r][cell.c];
                if (gridCell && gridCell.el) {
                    // Animación de pop
                    gridCell.el.classList.add("pop");
                    setTimeout(() => gridCell.el.remove(), 250);
                }
                this.grid[cell.r][cell.c] = null;
                this.score++;
                this.evEarned += 5.0; // +5 EV por célula
            });

            if (window.Sonidos) window.Sonidos.play("select");

            // Buscar y tumbar burbujas desconectadas del techo
            this.dropDisconnectedBubbles();
        } else {
            if (window.Sonidos) window.Sonidos.play("click");
        }

        // Verificar si la torre alcanzó la línea de peligro
        if (this.checkGameOverCondition()) {
            this.endGame(false);
            return;
        }

        // Controlar descenso del techo (cada 6 disparos)
        if (this.shotsCount > 0 && this.shotsCount % 6 === 0) {
            setTimeout(() => {
                this.descendCeiling();
                this.updateUI();
            }, 300);
        } else {
            this.updateUI();
            // Cargar la siguiente burbuja
            setTimeout(() => this.prepareNextBubbles(), 150);
        }
    }

    spawnGridBubble(r, c, type, existingEl = null) {
        const coords = this.getCellCoords(r, c);
        
        let el = existingEl;
        if (!el) {
            el = document.createElement("div");
            el.className = `elemental-bubble ${type}`;
            el.innerHTML = this.getBubbleSvg(type);
            this.gridContainer.appendChild(el);
        } else {
            // Si ya existe (volador), moverlo dentro del contenedor del grid
            el.remove();
            this.gridContainer.appendChild(el);
        }

        el.style.position = "absolute";
        el.style.left = `${coords.x - this.bubbleRadius}px`;
        el.style.top = `${coords.y - this.bubbleRadius}px`;
        el.style.bottom = "auto";
        el.style.width = `${this.bubbleDiameter}px`;
        el.style.height = `${this.bubbleDiameter}px`;
        el.style.zIndex = "5";

        this.grid[r][c] = { type: type, el: el };
    }

    findMatches(startR, startC, type) {
        const matches = [];
        const queue = [{ r: startR, c: startC }];
        const visited = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
        visited[startR][startC] = true;

        while (queue.length > 0) {
            const cell = queue.shift();
            matches.push(cell);

            const neighbors = this.getNeighbors(cell.r, cell.c);
            for (let n of neighbors) {
                if (!visited[n.r][n.c]) {
                    const gridCell = this.grid[n.r][n.c];
                    if (gridCell && gridCell.type === type) {
                        visited[n.r][n.c] = true;
                        queue.push(n);
                    }
                }
            }
        }
        return matches;
    }

    dropDisconnectedBubbles() {
        const connected = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
        const queue = [];

        // Inicializar cola con todas las celdas ocupadas de la primera fila (techo)
        for (let c = 0; c < this.cols; c++) {
            if (this.grid[0][c] !== null) {
                connected[0][c] = true;
                queue.push({ r: 0, c: c });
            }
        }

        // BFS desde el techo
        while (queue.length > 0) {
            const cell = queue.shift();
            const neighbors = this.getNeighbors(cell.r, cell.c);

            for (let n of neighbors) {
                if (!connected[n.r][n.c] && this.grid[n.r][n.c] !== null) {
                    connected[n.r][n.c] = true;
                    queue.push(n);
                }
            }
        }

        // Identificar y tumbar las huérfanas
        let droppedCount = 0;
        for (let r = 0; r < this.rows; r++) {
            const maxCols = (r % 2 === 0) ? this.cols : this.cols - 1;
            for (let c = 0; c < maxCols; c++) {
                if (this.grid[r][c] !== null && !connected[r][c]) {
                    const cell = this.grid[r][c];
                    this.grid[r][c] = null;
                    droppedCount++;

                    // Convertir burbuja en física cayendo
                    const coords = this.getCellCoords(r, c);
                    cell.el.classList.add("falling");
                    cell.el.style.top = `${coords.y}px`;
                    cell.el.style.left = `${coords.x}px`;
                    
                    // Almacenar velocidades aleatorias para dispersión visual
                    cell.el.dataset.vx = (Math.random() * 4 - 2).toFixed(2);
                    cell.el.dataset.vy = (-Math.random() * 2 - 1).toFixed(2);
                    cell.el.dataset.va = (Math.random() * 8 - 4).toFixed(2);
                    cell.el.dataset.angle = "0";

                    this.evEarned += 15.0; // +15 EV por célula colgada
                }
            }
        }

        if (droppedCount > 0 && window.Sonidos) {
            window.Sonidos.play("heal");
        }
    }

    descendCeiling() {
        if (!this.isPlaying) return;

        // Desplazar todas las filas hacia abajo
        for (let r = this.rows - 1; r > 0; r--) {
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = this.grid[r - 1][c];
                // Actualizar posiciones DOM locales
                const cell = this.grid[r][c];
                if (cell && cell.el) {
                    const coords = this.getCellCoords(r, c);
                    cell.el.style.left = `${coords.x - this.bubbleRadius}px`;
                    cell.el.style.top = `${coords.y - this.bubbleRadius}px`;
                }
            }
        }

        // Crear una nueva fila superior en r = 0
        const isEven = true; // fila 0 siempre es par
        for (let c = 0; c < this.cols; c++) {
            const type = this.elements[Math.floor(Math.random() * this.elements.length)];
            this.grid[0][c] = null; // Limpiar anterior
            this.spawnGridBubble(0, c, type);
        }

        if (window.Sonidos) window.Sonidos.play("lose");

        // Alerta de colapso si las burbujas pasaron el peligro
        if (this.checkGameOverCondition()) {
            this.endGame(false);
        } else {
            // Cargar burbuja cargada
            this.prepareNextBubbles();
        }
    }

    checkGameOverCondition() {
        const dangerY = this.gameHeight - 90;
        for (let r = 0; r < this.rows; r++) {
            const maxCols = (r % 2 === 0) ? this.cols : this.cols - 1;
            for (let c = 0; c < maxCols; c++) {
                if (this.grid[r][c] !== null) {
                    const coords = this.getCellCoords(r, c);
                    // Si alguna burbuja cruza el umbral
                    if (coords.y + this.bubbleRadius >= dangerY) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getCellCoords(r, c) {
        const isEven = (r % 2 === 0);
        const y = r * this.rowHeight + this.bubbleRadius + 5; // offset superior de 5px
        const x = this.gridOffsetX + c * this.bubbleDiameter + this.bubbleRadius + (isEven ? 0 : this.bubbleDiameter / 2);
        return { x: x, y: y };
    }

    getNeighbors(r, c) {
        const neighbors = [];
        const isEven = (r % 2 === 0);
        const offsets = isEven ? [
            { dr: -1, dc: -1 }, { dr: -1, dc: 0 },
            { dr: 0, dc: -1 },                  { dr: 0, dc: 1 },
            { dr: 1, dc: -1 },  { dr: 1, dc: 0 }
        ] : [
            { dr: -1, dc: 0 },  { dr: -1, dc: 1 },
            { dr: 0, dc: -1 },                  { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },   { dr: 1, dc: 1 }
        ];

        for (let o of offsets) {
            const nr = r + o.dr;
            const nc = c + o.dc;
            if (nr >= 0 && nr < this.rows) {
                const maxCols = (nr % 2 === 0) ? this.cols : this.cols - 1;
                if (nc >= 0 && nc < maxCols) {
                    neighbors.push({ r: nr, c: nc });
                }
            }
        }
        return neighbors;
    }

    getBubbleSvg(type, preview = false) {
        let strokeColor = "#00e5ff";
        let icon = "";

        switch (type) {
            case "biomutante":
                strokeColor = "#00e676";
                // Una hoja/catenaria orgánica
                icon = `<path d="M16 8 Q24 8 24 16 T16 24 Q8 24 8 16 T16 8" fill="none" stroke="${strokeColor}" stroke-width="1.8"/>`;
                break;
            case "viral":
                strokeColor = "#d500f9";
                // Célula espinosa
                icon = `<circle cx="16" cy="16" r="6" fill="none" stroke="${strokeColor}" stroke-width="1.8"/>
                        <path d="M16 4v6M16 22v6M4 16h6M22 16h6" stroke="${strokeColor}" stroke-width="1.5"/>`;
                break;
            case "cibernetico":
                strokeColor = "#00e5ff";
                // Círculo digital/chip
                icon = `<rect x="11" y="11" width="10" height="10" fill="none" stroke="${strokeColor}" stroke-width="1.8" rx="1"/>
                        <path d="M16 11v10M11 16h10" stroke="${strokeColor}" stroke-width="1" opacity="0.6"/>`;
                break;
            case "radiactivo":
                strokeColor = "#ff9100";
                // Trébol nuclear
                icon = `<circle cx="16" cy="16" r="3" fill="${strokeColor}"/>
                        <path d="M16 10 L19 14 L13 14 Z M11 19 L15 17 L13 22 Z M21 19 L19 22 L17 17 Z" fill="none" stroke="${strokeColor}" stroke-width="1.5"/>`;
                break;
            case "toxico":
                strokeColor = "#c6ff00";
                // Calavera simplificada
                icon = `<path d="M12 12 a4 4 0 0 1 8 0 v4 h-8 z M13 19 h6 M14 16 v4 M18 16 v4" fill="none" stroke="${strokeColor}" stroke-width="1.8"/>`;
                break;
            case "sintetico":
                strokeColor = "#ff007f";
                // Insignia hexagonal
                icon = `<polygon points="16,6 25,11 25,21 16,26 7,21 7,11" fill="none" stroke="${strokeColor}" stroke-width="1.8"/>`;
                break;
        }

        const size = preview ? 22 : 30;
        const innerRadius = preview ? 8 : 12;

        return `
        <svg viewBox="0 0 32 32" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="${innerRadius}" fill="#081017" stroke="${strokeColor}" stroke-width="2" style="filter: drop-shadow(0 0 4px ${strokeColor});"/>
            ${icon}
        </svg>`;
    }

    endGame(quit = false) {
        this.isPlaying = false;
        clearInterval(this.physicsInterval);

        // Limpiar área de juego
        this.playArea.className = "";
        
        if (this.gridContainer) this.gridContainer.remove();
        if (this.aimLineElement) this.aimLineElement.parentNode.remove(); // borrar SVG guía
        if (this.cannonElement) this.cannonElement.remove();
        if (this.dangerLineElement) this.dangerLineElement.remove();

        // Borrar burbujas activas
        if (this.currentBubble && this.currentBubble.element) this.currentBubble.element.remove();
        if (this.nextBubble && this.nextBubble.element) this.nextBubble.element.remove();
        if (this.firedBubble && this.firedBubble.element) this.firedBubble.element.remove();

        this.currentBubble = null;
        this.nextBubble = null;
        this.firedBubble = null;

        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "block";

        if (!quit) {
            if (window.Sonidos) window.Sonidos.play("heal");

            // Acreditar EV real al inventario
            if (this.evEarned > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(this.evEarned);
            }

            // XP de Laboratorio
            const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                ? window.completarMinijuegoArcade("Burbujas Elementales") 
                : 0;

            // Aumentar felicidad/amistad del Geno
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

                let msg = `🔮 ¡Muestras Inmunes Colapsadas!\nCélulas reventadas: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                alert(msg);
            } else {
                let msg = `🔮 ¡Muestras Inmunes Colapsadas!\nCélulas reventadas: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                alert(msg);
            }
        }

        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameBubbles();
});
