// MinigameFlappy.js - Juego estilo Flappy Bird utilizando el Geno principal en vista de perfil con SVGs vectoriales
class MinigameFlappy {
    constructor() {
        window.minigameFlappy = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.score = 0;
        this.evGanada = 0;
        this.isPlaying = false;
        
        // Parámetros de física
        this.playerY = 150;
        this.playerVelocity = 0;
        this.gravity = 0.35;
        this.jumpForce = -6.5;
        
        // Elementos y listas
        this.playerElement = null;
        this.tubes = [];
        this.gameLoopInterval = null;
        this.spawnInterval = null;
        
        this.initEvents();
    }

    initEvents() {
        // Enlazar clics/taps en el área de juego
        const handleJump = (e) => {
            if (this.isPlaying) {
                e.preventDefault();
                this.flap();
            }
        };

        this.playArea.addEventListener("mousedown", handleJump);
        this.playArea.addEventListener("touchstart", handleJump, { passive: false });

        document.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
                if (this.isPlaying) {
                    e.preventDefault();
                    this.flap();
                }
            }
        });
        
        if (this.btnQuit) {
            this.btnQuit.addEventListener("click", () => {
                if (this.isPlaying && window.miArcade && window.miArcade.gameScreen.classList.contains("hidden") === false) {
                    this.endGame(true);
                }
            });
        }
    }

    start() {
        this.startGame();
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");
        
        // Ocultar controles táctiles que bloquean los clics
        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none";

        // Aplicar fondo dinámico azul
        this.playArea.className = "";
        this.playArea.classList.add("game-flappy-bg");

        this.score = 0;
        this.evGanada = 0;
        this.playerY = 130;
        this.playerVelocity = 0;
        this.tubes = [];
        this.isPlaying = true;

        this.updateUI();
        
        // Ocultar elementos de Lluvia de Manzanas
        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "none";
        const falling = document.getElementById("falling-object");
        if (falling) falling.style.display = "none";

        // Limpiar el área de juego
        Array.from(this.playArea.children).forEach(child => {
            if (child.id !== "player-basket" && child.id !== "touch-controls") {
                child.remove();
            }
        });

        // Crear personaje Flappy Geno (sin cosméticos y con vista de perfil derecha)
        this.playerElement = document.createElement("div");
        this.playerElement.id = "flappy-player";
        this.playerElement.className = "profile-view-right";
        this.playerElement.style.position = "absolute";
        this.playerElement.style.left = "20%";
        this.playerElement.style.top = this.playerY + "px";
        this.playerElement.style.width = "65px";
        this.playerElement.style.height = "65px";
        this.playerElement.style.zIndex = "10";
        this.playerElement.style.transition = "transform 0.1s ease";

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
        
        const droneFallbackSvg = `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(255,215,0,0.5));"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12 M12 12L5 8 M12 12l7-4 M12 12v-6"/></svg>`;
        this.playerElement.innerHTML = typeof generarSvgGeno === 'function' ? generarSvgGeno(cleanAdn) : droneFallbackSvg;
        this.playArea.appendChild(this.playerElement);

        // Iniciar loop físico y spawn de tubos
        this.gameLoopInterval = setInterval(() => this.updatePhysics(), 20);
        this.spawnInterval = setInterval(() => this.spawnTube(), 1800);
        
        // Spawnear el primer tubo inmediatamente
        this.spawnTube();
    }

    updateUI() {
        const evStr = ` | +${Number(this.evGanada).toFixed(2)} EV`;
        this.scoreDisplay.innerText = `Puntos: ${this.score}${evStr}`;
        this.timerDisplay.innerText = `Supervivencia`;
    }

    flap() {
        if (!this.isPlaying) return;
        this.playerVelocity = this.jumpForce;
        if (window.Sonidos) {
            window.Sonidos.play("click");
        }
    }

    spawnTube() {
        if (!this.isPlaying) return;

        const playAreaHeight = this.playArea.clientHeight || 300;
        const gap = 125; // Tamaño del hueco para pasar
        const minHeight = 40;
        const maxHeight = playAreaHeight - gap - minHeight;
        const topHeight = Math.floor(minHeight + Math.random() * (maxHeight - minHeight));
        const bottomHeight = playAreaHeight - topHeight - gap;
        const tubeWidth = 55;

        // Crear tubo superior
        const topTube = document.createElement("div");
        topTube.className = "flappy-tube top-tube";
        topTube.style.position = "absolute";
        topTube.style.left = "100%";
        topTube.style.top = "0px";
        topTube.style.width = tubeWidth + "px";
        topTube.style.height = topHeight + "px";
        topTube.style.background = "linear-gradient(90deg, #1b5e20, #4caf50, #1b5e20)";
        topTube.style.border = "2px solid #00ffcc";
        topTube.style.borderTop = "none";
        topTube.style.boxShadow = "0 0 10px rgba(0,255,204,0.3)";
        topTube.style.borderRadius = "0 0 6px 6px";
        topTube.style.zIndex = "5";

        // Crear tubo inferior
        const bottomTube = document.createElement("div");
        bottomTube.className = "flappy-tube bottom-tube";
        bottomTube.style.position = "absolute";
        bottomTube.style.left = "100%";
        bottomTube.style.bottom = "0px";
        bottomTube.style.width = tubeWidth + "px";
        bottomTube.style.height = bottomHeight + "px";
        bottomTube.style.background = "linear-gradient(90deg, #1b5e20, #4caf50, #1b5e20)";
        bottomTube.style.border = "2px solid #00ffcc";
        bottomTube.style.borderBottom = "none";
        bottomTube.style.boxShadow = "0 0 10px rgba(0,255,204,0.3)";
        bottomTube.style.borderRadius = "6px 6px 0 0";
        bottomTube.style.zIndex = "5";

        this.playArea.appendChild(topTube);
        this.playArea.appendChild(bottomTube);

        this.tubes.push({
            x: this.playArea.clientWidth,
            width: tubeWidth,
            topHeight: topHeight,
            bottomHeight: bottomHeight,
            topElement: topTube,
            bottomElement: bottomTube,
            passed: false
        });
    }

    updatePhysics() {
        if (!this.isPlaying) return;

        const playAreaHeight = this.playArea.clientHeight || 300;
        const playAreaWidth = this.playArea.clientWidth || 300;

        // Aplicar gravedad
        this.playerVelocity += this.gravity;
        this.playerY += this.playerVelocity;
        
        // Limitar caídas y techos
        if (this.playerY < 0) {
            this.playerY = 0;
            this.playerVelocity = 0;
        }
        
        // Renderizar personaje
        if (this.playerElement) {
            this.playerElement.style.top = this.playerY + "px";
            // Inclinación según velocidad
            const rotation = Math.max(-25, Math.min(60, this.playerVelocity * 5));
            this.playerElement.style.transform = `rotate(${rotation}deg)`;
        }

        // Muerte al tocar el suelo
        if (this.playerY >= playAreaHeight - 55) {
            this.endGame(false);
            return;
        }

        const playerX = playAreaWidth * 0.2;

        // Mover tubos y chequear colisiones
        for (let i = this.tubes.length - 1; i >= 0; i--) {
            const tube = this.tubes[i];
            tube.x -= 2.8; // velocidad horizontal

            // Renderizar tubos
            tube.topElement.style.left = tube.x + "px";
            tube.bottomElement.style.left = tube.x + "px";

            // Eliminar tubos fuera de la pantalla
            if (tube.x < -tube.width) {
                tube.topElement.remove();
                tube.bottomElement.remove();
                this.tubes.splice(i, 1);
                continue;
            }

            // Validar si el jugador pasa el tubo
            if (!tube.passed && tube.x + tube.width < playerX + 16) {
                tube.passed = true;
                this.score++;
                
                // Calcular EV ganada por este tubo
                let evTubo = 10;
                if (this.score > 20) {
                    evTubo = 50;
                } else if (this.score > 10) {
                    evTubo = 20;
                }
                this.evGanada += evTubo;

                this.updateUI();
                if (window.Sonidos) {
                    window.Sonidos.play("select");
                }
            }

            // Hitbox del jugador más ceñida y centrada dentro de la caja de renderizado de 65x65
            const playerHitboxLeft   = playerX + 16;
            const playerHitboxRight  = playerX + 48; // ancho efectivo de 32px
            const playerHitboxTop    = this.playerY + 16;
            const playerHitboxBottom = this.playerY + 48; // alto efectivo de 32px

            // Colisiones (Hitbox)
            if (
                playerHitboxRight > tube.x &&
                playerHitboxLeft < tube.x + tube.width
            ) {
                // Colisión con tubo superior
                if (playerHitboxTop < tube.topHeight) {
                    this.endGame(false);
                    return;
                }
                // Colisión con tubo inferior
                if (playerHitboxBottom > playAreaHeight - tube.bottomHeight) {
                    this.endGame(false);
                    return;
                }
            }
        }
    }

    endGame(quit = false) {
        this.isPlaying = false;
        clearInterval(this.gameLoopInterval);
        clearInterval(this.spawnInterval);
        
        // Limpiar clase de fondo de playArea
        this.playArea.className = "";

        // Remover tubos del DOM
        this.tubes.forEach(t => {
            if (t.topElement) t.topElement.remove();
            if (t.bottomElement) t.bottomElement.remove();
        });
        if (this.playerElement) this.playerElement.remove();

        // Mostrar cesta de manzanas por defecto
        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "block";

        if (!quit) {
            if (window.Sonidos) {
                window.Sonidos.play("lose");
            }
            
            const reward = Math.floor(this.score / 5);
            if (reward > 0 && window.miInventario) {
                window.miInventario.addItem({
                    id: "apple_01",
                    name: "Manzana",
                    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#ff007f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px rgba(255,0,127,0.5));"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6c0-2 1-3 1-3 M9.5 8C8.5 7 8 5.5 8 5.5"/></svg>`,
                    type: "consumible",
                    maxStack: 20,
                    count: reward 
                });
            }

            if (this.evGanada > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                window.miInventario.addEssence(this.evGanada);
            }

            const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                ? window.completarMinijuegoArcade("Flappy Geno") 
                : 0;

            // Afectar necesidades del Geno activo
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

                let msg = `¡Colisión detectada!\nConseguiste: ${this.score} puntos.\nRatio 5:1 = Ganas ${reward} Manzanas.`;
                if (this.evGanada > 0) msg += `\n+${this.evGanada} EV obtenidas!`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                alert(msg);
            } else {
                let msg = `¡Colisión detectada!\nConseguiste: ${this.score} puntos.\nRatio 5:1 = Ganas ${reward} Manzanas.`;
                if (this.evGanada > 0) msg += `\n+${this.evGanada} EV obtenidas!`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                alert(msg);
            }
        }
        
        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameFlappy();
});
