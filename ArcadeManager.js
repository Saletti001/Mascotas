class ArcadeManager {
    constructor() {
        // Elementos de UI
        this.menuScreen = document.getElementById("arcade-menu");
        this.gameScreen = document.getElementById("minigame-screen");
        this.appleElement = document.getElementById("falling-apple");
        this.basketElement = document.getElementById("player-basket");
        this.scoreElement = document.getElementById("minigame-score");
        
        // Variables físicas
        this.gameInterval = null;
        this.basketX = 50; // Porcentaje (50% es el centro)
        this.appleY = -10; // Posición vertical
        this.appleX = 50;
        this.speed = 1.5;
        this.score = 0;
        this.isPlaying = false;
    }

    startCatchGame() {
        this.menuScreen.classList.add("hidden");
        this.gameScreen.classList.remove("hidden");
        
        this.score = 0;
        this.speed = 1.5;
        this.updateScore();
        this.resetApple();
        this.basketX = 50;
        this.updateBasketPosition();
        
        this.isPlaying = true;
        this.gameLoop();
    }

    stopGame() {
        this.isPlaying = false;
        cancelAnimationFrame(this.gameInterval);
        this.gameScreen.classList.add("hidden");
        this.menuScreen.classList.remove("hidden");
    }

    resetApple() {
        this.appleY = -10;
        // La manzana cae en un lugar aleatorio entre 10% y 90% del ancho
        this.appleX = Math.random() * 80 + 10; 
        this.appleElement.style.left = `${this.appleX}%`;
    }

    moveBasket(direction) {
        if (!this.isPlaying) return;
        // Mueve 10% a la izquierda o derecha
        if (direction === 'left' && this.basketX > 10) this.basketX -= 10;
        if (direction === 'right' && this.basketX < 90) this.basketX += 10;
        this.updateBasketPosition();
    }

    updateBasketPosition() {
        this.basketElement.style.left = `${this.basketX}%`;
    }

    updateScore() {
        this.scoreElement.innerText = `Manzanas: ${this.score}`;
    }

    gameLoop() {
        if (!this.isPlaying) return;

        // Gravedad de la manzana
        this.appleY += this.speed;
        this.appleElement.style.top = `${this.appleY}%`;

        // Detección de colisión (Si llega abajo del todo)
        if (this.appleY >= 85) {
            // Comprobamos si la canasta está cerca de la manzana (margen de error de 15%)
            if (Math.abs(this.basketX - this.appleX) < 15) {
                // ¡Atrapada!
                this.score++;
                this.speed += 0.1; // Se vuelve un poco más rápido
                this.updateScore();
                
                // Añadimos al inventario real
                if (window.miInventario) {
                    const success = window.miInventario.addItem({ id: "apple_01", icon: "🍎", type: "consumable" });
                    if (!success) {
                        // Inventario lleno, paramos el juego
                        alert("¡Tus Bolsillos Rotos están llenos! Ve a liberar espacio.");
                        this.stopGame();
                        return;
                    }
                }
            }
            this.resetApple();
        }

        this.gameInterval = requestAnimationFrame(() => this.gameLoop());
    }

    setupEvents() {
        // Iniciar minijuego desde la tarjeta
        const btnCatchGame = document.getElementById("card-catch-game");
        if (btnCatchGame) {
            btnCatchGame.addEventListener("click", () => this.startCatchGame());
        }

        // Salir del minijuego
        const btnQuit = document.getElementById("btn-quit-minigame");
        if (btnQuit) {
            btnQuit.addEventListener("click", () => this.stopGame());
        }

        // Controles táctiles
        const touchLeft = document.getElementById("touch-left");
        const touchRight = document.getElementById("touch-right");
        
        if (touchLeft) {
            // Usamos mousedown y touchstart para que responda rápido en PC y Móvil
            touchLeft.addEventListener("mousedown", () => this.moveBasket('left'));
            touchLeft.addEventListener("touchstart", (e) => { e.preventDefault(); this.moveBasket('left'); });
        }
        if (touchRight) {
            touchRight.addEventListener("mousedown", () => this.moveBasket('right'));
            touchRight.addEventListener("touchstart", (e) => { e.preventDefault(); this.moveBasket('right'); });
        }
    }
}

// Iniciar el gestor arcade al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    window.miArcade = new ArcadeManager();
    window.miArcade.setupEvents();
});