class MinigameCatch {
    constructor() {
        this.appleElement = document.getElementById("falling-apple");
        this.basketElement = document.getElementById("player-basket");
        this.scoreElement = document.getElementById("minigame-score");
        this.timerElement = document.getElementById("minigame-timer");

        this.gameInterval = null;
        this.timerInterval = null;
        
        this.basketX = 50;
        this.appleY = -10;
        this.appleX = 50;
        this.speed = 1.5;
        this.score = 0;
        this.timeLeft = 30; // LÍMITE DE TIEMPO
        this.isPlaying = false;

        this.setupEvents();
    }

    start() {
        this.score = 0;
        this.speed = 1.5;
        this.timeLeft = 30;
        this.isPlaying = true;
        
        this.updateScore();
        this.updateTimer();
        this.basketX = 50;
        this.updateBasketPosition();
        this.resetApple();
        
        // Iniciamos el motor gráfico
        this.gameLoop();

        // Iniciamos el reloj
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.isPlaying = false;
        cancelAnimationFrame(this.gameInterval);
        clearInterval(this.timerInterval);
        
        alert(`¡Tiempo terminado! Atrapaste ${this.score} manzanas y están en tus Bolsillos Rotos.`);
        window.miArcade.returnToMenu(); // Le decimos al Manager que vuelva al menú
    }

    stopManually() {
        this.isPlaying = false;
        cancelAnimationFrame(this.gameInterval);
        clearInterval(this.timerInterval);
        window.miArcade.returnToMenu();
    }

    resetApple() {
        this.appleY = -10;
        this.appleX = Math.random() * 80 + 10;
        this.appleElement.style.left = `${this.appleX}%`;
        this.appleElement.style.top = `${this.appleY}%`;
    }

    moveBasket(direction) {
        if (!this.isPlaying) return;
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

    updateTimer() {
        this.timerElement.innerText = `⏱️ ${this.timeLeft}s`;
    }

    gameLoop() {
        if (!this.isPlaying) return;

        this.appleY += this.speed;
        this.appleElement.style.top = `${this.appleY}%`;

        // Detección de colisión limpia
        if (this.appleY >= 85) {
            if (Math.abs(this.basketX - this.appleX) < 15) {
                this.score++;
                this.speed += 0.05; // Aumenta levemente la dificultad
                this.updateScore();
                
                // Inventario
                if (window.miInventario) {
                    const success = window.miInventario.addItem({ id: "apple_01", icon: "🍎", type: "consumable" });
                    if (!success) {
                        alert("¡Tus Bolsillos Rotos están llenos! El juego termina aquí.");
                        this.endGame();
                        return;
                    }
                }
            }
            this.resetApple();
        }

        this.gameInterval = requestAnimationFrame(() => this.gameLoop());
    }

    setupEvents() {
        const btnQuit = document.getElementById("btn-quit-minigame");
        if (btnQuit) {
            btnQuit.addEventListener("click", () => this.stopManually());
        }

        const touchLeft = document.getElementById("touch-left");
        const touchRight = document.getElementById("touch-right");
        
        if (touchLeft) {
            touchLeft.addEventListener("mousedown", () => this.moveBasket('left'));
            touchLeft.addEventListener("touchstart", (e) => { e.preventDefault(); this.moveBasket('left'); });
        }
        if (touchRight) {
            touchRight.addEventListener("mousedown", () => this.moveBasket('right'));
            touchRight.addEventListener("touchstart", (e) => { e.preventDefault(); this.moveBasket('right'); });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.minigameCatch = new MinigameCatch();
});