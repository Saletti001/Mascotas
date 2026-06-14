// MinigameStacker.js - Apila-Núcleos (Stacker Mecánico)
// El jugador suelta bloques de Bio-Núcleos desde una grúa oscilante para construir una torre.
// Acierto perfecto (+25 EV, estabiliza torre). Acierto desviado (+10 EV, corta bloque, aumenta wobble). Caída = Game Over.

class MinigameStacker {
    constructor() {
        window.minigameStacker = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.score = 0;
        this.evEarned = 0;
        this.isPlaying = false;

        // Dimensiones lógicas (inicializadas al empezar)
        this.gameWidth = 350;
        this.gameHeight = 350;

        // Estado de la grúa
        this.craneX = 0;
        this.craneTime = 0;
        this.craneSpeed = 0.003; // velocidad de oscilación base
        this.craneWidth = 50;

        // Torre y Bloques
        this.placedBlocks = []; // Array de { x, y, width, height, element }
        this.activeBlock = null; // Block actual en la grúa o cayendo
        this.slicedPieces = []; // Trozos sobrantes cayendo
        this.blockHeight = 24;
        this.baseWidth = 120;

        // Físicas de balanceo (Wobble)
        this.wobbleIntensity = 0; // aumenta con desalineaciones, disminuye con perfects
        this.wobbleTime = 0;
        this.wobbleAngle = 0;

        // Desplazamiento de cámara para torres altas
        this.scrollOffset = 0;

        // Elementos DOM del juego
        this.towerContainer = null;
        this.craneRail = null;
        this.craneClaw = null;
        this.ropeElement = null;

        // Loops
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

        // Evento de clic/tap para soltar el bloque
        this.playArea.addEventListener("mousedown", (e) => {
            if (this.isPlaying && this.activeBlock && !this.activeBlock.isFalling) {
                e.preventDefault();
                this.dropBlock();
            }
        });

        this.playArea.addEventListener("touchstart", (e) => {
            if (this.isPlaying && this.activeBlock && !this.activeBlock.isFalling) {
                e.preventDefault();
                this.dropBlock();
            }
        }, { passive: false });
    }

    start() {
        this.startGame();
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");

        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none"; // Ocultar controles táctiles genéricos

        // Limpiar área de juego y aplicar fondo industrial
        this.playArea.className = "";
        this.playArea.classList.add("game-stacker-bg");

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

        // Obtener dimensiones reales del playArea
        this.gameWidth = this.playArea.clientWidth || 350;
        this.gameHeight = this.playArea.clientHeight || 350;

        // Crear contenedor de la torre (que se balancea completo)
        this.towerContainer = document.createElement("div");
        this.towerContainer.className = "stacker-tower-container";
        this.towerContainer.style.position = "absolute";
        this.towerContainer.style.left = "0px";
        this.towerContainer.style.bottom = "0px";
        this.towerContainer.style.width = "100%";
        this.towerContainer.style.height = "100%";
        this.towerContainer.style.transformOrigin = "bottom center";
        this.playArea.appendChild(this.towerContainer);

        // Crear riel de la grúa superior
        this.craneRail = document.createElement("div");
        this.craneRail.className = "stacker-crane-rail";
        this.playArea.appendChild(this.craneRail);

        // Crear la garra móvil
        this.craneClaw = document.createElement("div");
        this.craneClaw.className = "stacker-crane-claw";
        this.playArea.appendChild(this.craneClaw);

        // Crear cable tensor neón
        this.ropeElement = document.createElement("div");
        this.ropeElement.className = "stacker-rope";
        this.playArea.appendChild(this.ropeElement);

        // Crear base de la torre en la parte inferior (primer bloque de referencia)
        const baseX = (this.gameWidth - this.baseWidth) / 2;
        const baseY = 10;
        const baseEl = document.createElement("div");
        baseEl.className = "stacker-base";
        baseEl.style.left = `${baseX}px`;
        baseEl.style.bottom = `${baseY}px`;
        baseEl.style.width = `${this.baseWidth}px`;
        baseEl.style.height = `16px`;
        this.towerContainer.appendChild(baseEl);

        // Inicializar variables de juego
        this.score = 0;
        this.evEarned = 0;
        this.placedBlocks = [
            { x: baseX, y: baseY, width: this.baseWidth, height: 16, element: baseEl }
        ];
        this.slicedPieces = [];
        this.wobbleIntensity = 0;
        this.wobbleTime = 0;
        this.wobbleAngle = 0;
        this.scrollOffset = 0;
        this.craneTime = Math.random() * 100;
        this.isPlaying = true;

        this.spawnBlock();
        this.updateUI();

        // Arrancar loops
        this.physicsInterval = setInterval(() => this.updatePhysics(), 20);
    }

    updateUI() {
        const evDisplay = ` | +${Number(this.evEarned).toFixed(2)} EV`;
        this.scoreDisplay.innerText = `Pisos: ${this.score}${evDisplay}`;
        this.timerDisplay.innerText = `Estabilidad: ${Math.max(0, 100 - Math.floor(this.wobbleIntensity * 12))}%`;
    }

    spawnBlock() {
        if (!this.isPlaying) return;

        const topBlock = this.placedBlocks[this.placedBlocks.length - 1];
        const nextWidth = topBlock.width;

        // Crear bloque visual en la grúa
        const blockEl = document.createElement("div");
        blockEl.className = "stacker-block active";
        blockEl.style.width = `${nextWidth}px`;
        blockEl.style.height = `${this.blockHeight}px`;
        this.playArea.appendChild(blockEl);

        this.activeBlock = {
            element: blockEl,
            x: 0,
            y: this.gameHeight - 65, // justo debajo de la grúa
            width: nextWidth,
            height: this.blockHeight,
            isFalling: false
        };

        // Renderizar posición inicial
        this.activeBlock.element.style.left = `${this.activeBlock.x}px`;
        this.activeBlock.element.style.bottom = `${this.activeBlock.y}px`;
    }

    dropBlock() {
        if (!this.isPlaying || !this.activeBlock || this.activeBlock.isFalling) return;
        this.activeBlock.isFalling = true;
        this.activeBlock.element.classList.remove("active");
        if (window.Sonidos) window.Sonidos.play("click");
    }

    updatePhysics() {
        if (!this.isPlaying) return;

        // 1. Mover la grúa superior (si el bloque no está cayendo)
        this.craneTime += 20;
        const speedMultiplier = 0.0035 + Math.min(0.004, (this.placedBlocks.length - 1) * 0.00035);
        
        // Oscilación sinusoidal de la grúa
        const activeWidth = this.activeBlock ? this.activeBlock.width : this.baseWidth;
        const maxRange = this.gameWidth - activeWidth - 20;
        const baseCenter = (this.gameWidth - activeWidth) / 2;
        this.craneX = baseCenter + Math.sin(this.craneTime * speedMultiplier) * (maxRange / 2);

        // Actualizar garra de la grúa en el DOM
        if (this.craneClaw) {
            this.craneClaw.style.left = `${this.craneX + activeWidth / 2 - 12}px`;
        }

        // 2. Controlar la caída del bloque activo
        if (this.activeBlock) {
            if (!this.activeBlock.isFalling) {
                // Sigue acoplado a la grúa
                this.activeBlock.x = this.craneX;
                this.activeBlock.element.style.left = `${this.activeBlock.x}px`;

                // Actualizar cable tensor
                if (this.ropeElement) {
                    this.ropeElement.style.left = `${this.craneX + activeWidth / 2}px`;
                    this.ropeElement.style.height = `${this.gameHeight - this.activeBlock.y - 32}px`;
                }
            } else {
                // Cayendo
                this.activeBlock.y -= 7.5; // velocidad de caída rápida y constante
                this.activeBlock.element.style.bottom = `${this.activeBlock.y}px`;

                // Cable cortado (desaparece gradualmente)
                if (this.ropeElement) {
                    this.ropeElement.style.height = "0px";
                }

                // Detectar colisión con el bloque superior
                const topBlock = this.placedBlocks[this.placedBlocks.length - 1];
                // El target de colisión incluye la compensación del scroll vertical
                const targetY = topBlock.y + topBlock.height - this.scrollOffset;

                // El bloque está a la altura de aterrizaje
                if (this.activeBlock.y <= targetY) {
                    this.activeBlock.y = targetY;
                    this.activeBlock.element.style.bottom = `${this.activeBlock.y}px`;
                    
                    this.handleLanding(topBlock);
                }
            }
        }

        // 3. Simular balanceo (wobble)
        this.wobbleTime += 0.045;
        this.wobbleAngle = Math.sin(this.wobbleTime) * Math.min(8.0, this.wobbleIntensity * 1.5);

        // Estabilización progresiva si no hay desalineaciones extremas
        this.wobbleIntensity = Math.max(0, this.wobbleIntensity - 0.005);

        // Aplicar transformaciones al contenedor de la torre (balanceo + scroll)
        if (this.towerContainer) {
            this.towerContainer.style.transform = `translateY(${this.scrollOffset}px) rotate(${this.wobbleAngle}deg)`;
        }

        // 4. Actualizar físicas de piezas cortadas que caen al vacío
        for (let i = this.slicedPieces.length - 1; i >= 0; i--) {
            const piece = this.slicedPieces[i];
            piece.y -= 6.5;
            piece.x += piece.vx;
            piece.angle += piece.va;

            piece.element.style.bottom = `${piece.y}px`;
            piece.element.style.left = `${piece.x}px`;
            piece.element.style.transform = `rotate(${piece.angle}deg)`;

            // Limpieza fuera de pantalla
            if (piece.y < -50) {
                piece.element.remove();
                this.slicedPieces.splice(i, 1);
            }
        }
    }

    handleLanding(topBlock) {
        const activeBlock = this.activeBlock;
        this.activeBlock = null;

        // Comprobación de solapamiento horizontal
        // Ojo: el activeBlock.x está en coordenadas globales, pero los bloques colocados están dentro de towerContainer.
        // Como la torre se desplaza por scrollOffset, debemos comparar usando la misma referencia de x global.
        const left = Math.max(activeBlock.x, topBlock.x);
        const right = Math.min(activeBlock.x + activeBlock.width, topBlock.x + topBlock.width);
        const overlapWidth = right - left;

        const x = activeBlock.x;
        const playRect = this.playArea.getBoundingClientRect();

        if (overlapWidth > 0) {
            // ¡Aterrizó con éxito!
            const activeCenter = activeBlock.x + activeBlock.width / 2;
            const topCenter = topBlock.x + topBlock.width / 2;
            const offset = Math.abs(activeCenter - topCenter);

            let earnsPerfect = offset <= 4.5;
            let currentReward = 0;

            // Mover el elemento al contenedor de la torre para que oscile con ella
            activeBlock.element.remove();
            this.towerContainer.appendChild(activeBlock.element);

            // Ajustar posición bottom en base a la coordenada local de la torre
            // (La torre dibuja sus bloques de abajo hacia arriba de forma acumulativa en pixeles reales)
            const localY = topBlock.y + topBlock.height;
            activeBlock.element.style.bottom = `${localY}px`;

            if (earnsPerfect) {
                // Aterrizaje Perfecto!
                this.score++;
                currentReward = 25.0;
                this.evEarned += currentReward;

                // Alinear perfectamente
                activeBlock.x = topBlock.x;
                activeBlock.element.style.left = `${activeBlock.x}px`;
                activeBlock.element.style.width = `${activeBlock.width}px`;

                // Estabilizar la torre (bajar wobble)
                this.wobbleIntensity = Math.max(0, this.wobbleIntensity - 1.2);

                if (window.Sonidos) window.Sonidos.play("select");

                // Destello verde de perfección
                activeBlock.element.classList.add("perfect");
                setTimeout(() => activeBlock.element.classList.remove("perfect"), 400);

                // Texto flotante
                const floatX = activeBlock.x + activeBlock.width / 2;
                const floatY = this.gameHeight - activeBlock.y;
                this.spawnFloatingText("✨ PERFECTO +25 EV", floatX, floatY, "correct");
            } else {
                // Aterrizaje desalineado (Cortar bloque)
                this.score++;
                currentReward = 10.0;
                this.evEarned += currentReward;

                // Generar pieza sobrante que cae al vacío
                const sliceLeft = activeBlock.x < topBlock.x;
                const pieceWidth = activeBlock.width - overlapWidth;
                const pieceX = sliceLeft ? activeBlock.x : right;

                // Crear trozo cortado en el playArea principal (para que caiga recto sin balanceo)
                const pieceEl = document.createElement("div");
                pieceEl.className = "sliced-piece";
                pieceEl.style.width = `${pieceWidth}px`;
                pieceEl.style.height = `${this.blockHeight}px`;
                pieceEl.style.left = `${pieceX}px`;
                pieceEl.style.bottom = `${activeBlock.y}px`;
                this.playArea.appendChild(pieceEl);

                this.slicedPieces.push({
                    element: pieceEl,
                    x: pieceX,
                    y: activeBlock.y,
                    vx: sliceLeft ? -1.5 : 1.5,
                    va: sliceLeft ? -6 : 6,
                    angle: 0
                });

                // Redimensionar bloque landed al solapamiento
                activeBlock.x = left;
                activeBlock.width = overlapWidth;
                activeBlock.element.style.left = `${activeBlock.x}px`;
                activeBlock.element.style.width = `${activeBlock.width}px`;

                // Aumentar inestabilidad (Wobble)
                this.wobbleIntensity += offset * 0.075 + 0.3;

                if (window.Sonidos) window.Sonidos.play("click");

                // Destello amarillo/naranja
                activeBlock.element.classList.add("sliced");
                setTimeout(() => activeBlock.element.classList.remove("sliced"), 400);

                // Texto flotante
                const floatX = activeBlock.x + activeBlock.width / 2;
                const floatY = this.gameHeight - activeBlock.y;
                this.spawnFloatingText("+10 EV", floatX, floatY, "correct");
            }

            // Guardar bloque en la torre
            this.placedBlocks.push({
                x: activeBlock.x,
                y: localY,
                width: activeBlock.width,
                height: this.blockHeight,
                element: activeBlock.element
            });

            // Ajustar el desplazamiento de cámara para mantener la cima visible
            const towerHeight = this.placedBlocks.length * this.blockHeight;
            if (towerHeight > this.gameHeight / 2) {
                // Desplazar cámara hacia abajo de forma acumulada
                this.scrollOffset = -(towerHeight - this.gameHeight / 2);
            }

            this.updateUI();

            // Preparar el siguiente bloque
            setTimeout(() => this.spawnBlock(), 150);
        } else {
            // ¡Caída completa! Bloque fallado
            activeBlock.element.classList.add("falling-dead");
            if (window.Sonidos) window.Sonidos.play("lose");

            // Animación de caída libre con rotación
            let fallY = activeBlock.y;
            let fallAngle = 0;
            const dropInterval = setInterval(() => {
                fallY -= 9;
                fallAngle += 4;
                activeBlock.element.style.bottom = `${fallY}px`;
                activeBlock.element.style.transform = `rotate(${fallAngle}deg)`;

                if (fallY < -100) {
                    clearInterval(dropInterval);
                    activeBlock.element.remove();
                }
            }, 20);

            // Efecto de pantalla roja de colapso
            this.playArea.classList.add("crash-flash");
            const floatX = activeBlock.x + activeBlock.width / 2;
            this.spawnFloatingText("💥 COLAPSO AL VACÍO", floatX, 100, "fail");

            this.updateUI();

            // Finalizar juego tras 900ms para permitir ver el colapso
            setTimeout(() => {
                this.playArea.classList.remove("crash-flash");
                this.endGame(false);
            }, 900);
        }
    }

    spawnFloatingText(text, x, y, type) {
        const textEl = document.createElement("div");
        textEl.className = `sorting-floating-text ${type}`; // Usa los estilos neón de sorting
        textEl.innerText = text;
        textEl.style.left = `${x}px`;
        textEl.style.bottom = `${y}px`;
        textEl.style.top = "auto";
        this.playArea.appendChild(textEl);
        setTimeout(() => textEl.remove(), 800);
    }

    endGame(quit = false) {
        this.isPlaying = false;
        clearInterval(this.physicsInterval);

        // Limpiar clases de playArea
        this.playArea.className = "";

        // Remover elementos de grúa y torre
        if (this.towerContainer) this.towerContainer.remove();
        if (this.craneRail) this.craneRail.remove();
        if (this.craneClaw) this.craneClaw.remove();
        if (this.ropeElement) this.ropeElement.remove();

        this.slicedPieces.forEach(p => p.element.remove());
        this.slicedPieces = [];

        if (this.activeBlock && this.activeBlock.element) {
            this.activeBlock.element.remove();
        }
        this.activeBlock = null;

        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "block";

        if (!quit) {
            if (window.Sonidos) window.Sonidos.play("heal");

            // Acreditar esencia vital ganada real
            if (this.evEarned > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(this.evEarned);
            }

            // XP de Laboratorio
            const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                ? window.completarMinijuegoArcade("Apila-Núcleos") 
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

                let msg = `🏗️ ¡Partida Terminada!\nPisos apilados: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                alert(msg);
            } else {
                let msg = `🏗️ ¡Partida Terminada!\nPisos apilados: ${this.score}.\nTotal EV acumulada: +${this.evEarned.toFixed(2)} EV.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                alert(msg);
            }
        }

        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameStacker();
});
