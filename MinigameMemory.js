// MinigameMemory.js - Minijuego de memoria de cartas ADN (Tablero 4x4, cartas cuadradas y volteado robusto)
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
        
        // Emojis/Símbolos de genes (8 símbolos únicos para un tablero de 16 cartas)
        this.symbols = ["🧬", "🧪", "🔬", "🦠", "⚙️", "☢️", "💊", "🔋"];
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

        // 🔥 Ocultar controles táctiles que bloqueaban los clics en memoria
        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "none";

        // 🔥 Aplicar fondo dinámico cyberpunk violeta
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
        this.timerDisplay.innerText = `⏱️ ${this.timeLeft}s`;
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
        grid.style.maxWidth = "330px"; // 🔥 Un poco más grande para ocupar mejor el espacio
        grid.style.aspectRatio = "1 / 1"; // 🔥 Fuerza a que la cuadrícula completa sea un cuadrado perfecto!
        
        // 🔥 Centrar el tablero vertical y horizontalmente en el playArea para no dejar espacio vacío raro abajo
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

            // Elemento de frente (El emoji real)
            const frontEl = document.createElement("span");
            frontEl.className = "card-front-symbol";
            frontEl.innerText = symbol;
            frontEl.style.display = "none"; // Oculto boca abajo
            frontEl.style.fontSize = "28px";
            frontEl.style.transition = "transform 0.2s ease";
            card.appendChild(frontEl);

            // Elemento de reverso (Icono ADN)
            const backEl = document.createElement("span");
            backEl.className = "card-back-symbol";
            backEl.innerText = "🧬";
            backEl.style.color = "#8A2BE2";
            backEl.style.fontSize = "20px";
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
        
        frontEl.style.display = "block"; // Mostrar emoji de frente
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
            first.frontEl.style.textShadow = "0 0 10px #4CAF50";
            second.frontEl.style.textShadow = "0 0 10px #4CAF50";
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

        // 🔥 Limpiar clase de fondo de playArea
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
                        icon: "🍎",
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

                    let msg = `¡EXCELENTE TRABAJO!\nCompletaste la secuencia en ${35 - this.timeLeft}s.\nGanas: ${rewardApples} 🍎.\n⚡ +${evGanada} EV cargada al balance!`;
                    if (xpObtenida > 0) msg += `\n🧪 +${xpObtenida} XP de Laboratorio!`;
                    if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                    else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                    alert(msg);
                } else {
                    let msg = `¡EXCELENTE TRABAJO!\nCompletaste la secuencia en ${35 - this.timeLeft}s.\nGanas: ${rewardApples} 🍎.\n⚡ +${evGanada} EV cargada al balance!`;
                    if (xpObtenida > 0) msg += `\n🧪 +${xpObtenida} XP de Laboratorio!`;
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
