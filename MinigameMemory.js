// MinigameMemory.js - Minijuego de memoria de cartas ADN (Tablero 4x4, cartas cuadradas y volteado robusto) con SVGs Vectoriales
class MinigameMemory {
    constructor() {
        window.minigameMemory = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.isPlaying = false;
        this.timeLeft = 30;
        this.timerInterval = null;
        
        // Claves de los símbolos científicos (sin emojis)
        this.symbols = ["dna", "flask", "microscope", "virus", "gear", "radioactive", "pill", "battery"];
        this.cards = [];
        this.flippedCards = [];
        this.matchesFound = 0;
        
        this.initEvents();
    }

    initEvents() {
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

    // Retorna el SVG vectorial neón premium correspondiente a cada clave científica
    getSymbolSvg(symbol) {
        const mapping = {
            dna: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(0,229,255,0.6));"><path d="M4.5 10.5c3-6 12-6 15 0m-15 3c3 6 12 6 15 0"/><path d="M6 8v8m4-9v10m4-10v10m4-9v8"/></svg>`,
            flask: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#69f0ae" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(105,240,174,0.6));"><path d="M9 3h6M10 3v15a2 2 0 0 0 4 0V3M8 6h8"/></svg>`,
            microscope: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(255,215,0,0.6));"><path d="M6 21h12M12 21V16M8 16h8M14 4h2v3h-2z M10 4v8M10 12l4 2v2M7 10h3"/></svg>`,
            virus: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ff007f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(255,0,127,0.6));"><circle cx="12" cy="12" r="5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5M4.93 4.93l3.54 3.54M15.53 15.53l3.54 3.54M4.93 19.07l3.54-3.54M15.53 8.47l3.54-3.54"/></svg>`,
            gear: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#b388ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(179,136,255,0.6));"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
            radioactive: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ffb300" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(255,179,0,0.6));"><circle cx="12" cy="12" r="10"/><path d="M12 12V6M12 12l5.2 3M12 12l-5.2 3M12 12a2 2 0 1 1 0-.01"/></svg>`,
            pill: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#e040fb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(224,64,251,0.6));"><rect x="5" y="5" width="14" height="14" rx="7" transform="rotate(45 12 12)"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>`,
            battery: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#00e676" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(0,230,118,0.6));"><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="14" y1="10" x2="14" y2="14"/></svg>`
        };
        return mapping[symbol] || '';
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");
        
        this.isPlaying = true;
        this.timeLeft = 35; // Un poco más de tiempo por ser 16 cartas (4x4)
        this.matchesFound = 0;
        this.flippedCards = [];
        
        // Ocultar cesta y manzana del otro juego
        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "none";
        const falling = document.getElementById("falling-object");
        if (falling) falling.style.display = "none";

        // Ocultar controles táctiles que bloqueaban los clics en memoria
        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none";

        // Aplicar fondo dinámico cyberpunk violeta
        this.playArea.className = "";
        this.playArea.classList.add("game-memory-bg");

        // Limpiar el área de juego
        Array.from(this.playArea.children).forEach(child => {
            if (child.id !== "player-basket" && child.id !== "touch-controls") {
                child.remove();
            }
        });

        this.updateUI();
        this.buildGrid();
        
        // Timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            if (this.timeLeft <= 0) {
                this.endGame(false, false); // Derrota por tiempo
            }
        }, 1000);
    }

    updateUI() {
        this.scoreDisplay.innerText = `Parejas: ${this.matchesFound} / 8`;
        this.timerDisplay.innerText = `TIEMPO: ${this.timeLeft}s`;
    }

    buildGrid() {
        // Duplicar símbolos para crear las 8 parejas
        let deck = [...this.symbols, ...this.symbols];
        
        // Barajar deck
        deck.sort(() => Math.random() - 0.5);

        // Crear contenedor grid
        const grid = document.createElement("div");
        grid.id = "memory-grid-container";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(4, 1fr)";
        grid.style.gridTemplateRows = "repeat(4, 1fr)";
        grid.style.gap = "10px";
        grid.style.width = "90%";
        grid.style.maxWidth = "330px";
        grid.style.aspectRatio = "1 / 1";
        
        // Centrar el tablero vertical y horizontalmente en el playArea
        grid.style.position = "absolute";
        grid.style.top = "50%";
        grid.style.left = "50%";
        grid.style.transform = "translate(-50%, -50%)";

        this.cards = [];
        
        deck.forEach((symbol, index) => {
            const card = document.createElement("div");
            card.className = "memory-card";
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            
            // Estilos iniciales (boca abajo)
            card.style.background = "#0d1a24";
            card.style.border = "2px solid #8A2BE2"; // Borde violeta neon
            card.style.borderRadius = "8px";
            card.style.display = "flex";
            card.style.alignItems = "center";
            card.style.justifyContent = "center";
            card.style.cursor = "pointer";
            card.style.userSelect = "none";
            card.style.boxShadow = "0 0 8px rgba(138,43,226,0.2)";
            card.style.transition = "all 0.2s ease";
            card.style.position = "relative";

            // Elemento de frente (El SVG del símbolo)
            const frontEl = document.createElement("span");
            frontEl.className = "card-front-symbol";
            frontEl.innerHTML = this.getSymbolSvg(symbol);
            frontEl.style.display = "none"; // Oculto boca abajo
            frontEl.style.transition = "transform 0.2s ease";
            card.appendChild(frontEl);

            // Elemento de reverso (Icono ADN SVG)
            const backEl = document.createElement("span");
            backEl.className = "card-back-symbol";
            backEl.innerHTML = this.getSymbolSvg("dna");
            backEl.style.color = "#8A2BE2";
            backEl.style.display = "block"; // Visible boca abajo
            card.appendChild(backEl);

            card.onclick = () => this.flipCard(card, frontEl, backEl);
            
            grid.appendChild(card);
            this.cards.push(card);
        });

        this.playArea.appendChild(grid);
    }

    flipCard(card, frontEl, backEl) {
        if (!this.isPlaying) return;
        if (this.flippedCards.length >= 2) return;
        if (card.classList.contains("matched") || card.classList.contains("flipped")) return;

        // Voltear
        card.classList.add("flipped");
        card.style.background = "rgba(0, 229, 255, 0.1)";
        card.style.border = "2px solid #00e5ff"; // Borde cian neon al voltear
        card.style.boxShadow = "0 0 15px rgba(0,229,255,0.4)";
        
        frontEl.style.display = "block"; // Mostrar frente
        backEl.style.display = "none"; // Ocultar reverso

        if (window.Sonidos) {
            window.Sonidos.play("select");
        }

        this.flippedCards.push({ card, frontEl, backEl });

        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        const match = first.card.dataset.symbol === second.card.dataset.symbol;

        if (match) {
            // Acierto
            first.card.classList.add("matched");
            second.card.classList.add("matched");
            
            first.card.style.border = "2px solid #4CAF50"; // Borde verde
            second.card.style.border = "2px solid #4CAF50";
            first.card.style.boxShadow = "0 0 15px rgba(76,175,80,0.5)";
            second.card.style.boxShadow = "0 0 15px rgba(76,175,80,0.5)";

            this.matchesFound++;
            this.updateUI();
            this.flippedCards = [];

            if (window.Sonidos) {
                window.Sonidos.play("click");
            }

            if (this.matchesFound === 8) {
                setTimeout(() => this.endGame(false, true), 500); // Victoria!
            }
        } else {
            // Fallo - Voltear de nuevo después de 800ms
            setTimeout(() => {
                if (!this.isPlaying) return;

                first.card.classList.remove("flipped");
                second.card.classList.remove("flipped");

                first.card.style.background = "#0d1a24";
                first.card.style.border = "2px solid #8A2BE2";
                first.card.style.boxShadow = "0 0 8px rgba(138,43,226,0.2)";
                first.frontEl.style.display = "none";
                first.backEl.style.display = "block";

                second.card.style.background = "#0d1a24";
                second.card.style.border = "2px solid #8A2BE2";
                second.card.style.boxShadow = "0 0 8px rgba(138,43,226,0.2)";
                second.frontEl.style.display = "none";
                second.backEl.style.display = "block";

                this.flippedCards = [];
            }, 800);
        }
    }

    endGame(quit = false, won = false) {
        this.isPlaying = false;
        clearInterval(this.timerInterval);

        // Limpiar clase de fondo de playArea
        this.playArea.className = "";

        // Limpiar grid
        const grid = document.getElementById("memory-grid-container");
        if (grid) grid.remove();

        // Mostrar cesta de manzanas por defecto
        const basket = document.getElementById("player-basket");
        if (basket) basket.style.display = "block";

        if (!quit) {
            let evGanada = 0;
            if (won) {
                if (window.Sonidos) {
                    window.Sonidos.play("heal");
                }
                
                // Premios basados en rendimiento de tiempo
                const rewardApples = Math.floor(this.timeLeft / 8) + 1; // 1 a 5 manzanas
                evGanada = 100 + (this.timeLeft * 5); // 100 EV base + 5 EV por segundo restante

                if (rewardApples > 0 && window.miInventario) {
                    window.miInventario.addItem({
                        id: "apple_01",
                        name: "Manzana",
                        icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#ff007f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px rgba(255,0,127,0.5));"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6c0-2 1-3 1-3 M9.5 8C8.5 7 8 5.5 8 5.5"/></svg>`,
                        type: "consumible",
                        maxStack: 20,
                        count: rewardApples 
                    });
                }

                // Acumular EV ganada directamente al inventario del jugador
                if (evGanada > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                    window.miInventario.addEssence(evGanada);
                }

                const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                    ? window.completarMinijuegoArcade("Memoria ADN") 
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

                    let msg = `¡EXCELENTE TRABAJO!\nCompletaste la secuencia en ${35 - this.timeLeft}s.\nGanas: ${rewardApples} Manzanas.\n+${evGanada} EV cargada al balance!`;
                    if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                    if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                    else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                    alert(msg);
                } else {
                    let msg = `¡EXCELENTE TRABAJO!\nCompletaste la secuencia en ${35 - this.timeLeft}s.\nGanas: ${rewardApples} Manzanas.\n+${evGanada} EV cargada al balance!`;
                    if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                    alert(msg);
                }
            } else {
                if (window.Sonidos) {
                    window.Sonidos.play("lose");
                }

                evGanada = this.matchesFound * 10;
                if (evGanada > 0 && window.miInventario && typeof window.miInventario.addEssence === "function") {
                    window.miInventario.addEssence(evGanada);
                }

                // Afectar necesidades del Geno activo por intentar jugar
                if (window.miMascota && window.miMascota.id && window.miMascota.id !== "temp") {
                    if (window.miMascota.diversion === undefined) window.miMascota.diversion = 100;
                    window.miMascota.diversion = Math.min(100, window.miMascota.diversion + 15);
                }
                
                if (window.guardarJuego) window.guardarJuego();
                else if (window.guardarProgreso) window.guardarProgreso();

                alert(`¡Se acabó el tiempo!\nNo pudiste sincronizar todos los genes. ¡Inténtalo de nuevo!\nConsolación: ¡Obtienes +${evGanada} EV (+10 EV por cada una de tus ${this.matchesFound} parejas encontradas)!`);
            }
        }

        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameMemory();
});
