class MinigameCatch {
    constructor() {
        this.objectElement = document.getElementById("falling-object");
        this.basketElement = document.getElementById("player-basket");
        this.scoreElement = document.getElementById("minigame-score");
        this.timerElement = document.getElementById("minigame-timer");

        this.gameInterval = null;
        this.timerInterval = null;
        
        this.basketX = 50;
        this.objY = -10;
        this.objX = 50;
        this.speed = 1.5;
        this.score = 0;
        this.applesBuffer = 0; // CONTADOR PARA EL 5:1
        this.timeLeft = 30;
        this.isPlaying = false;
        this.currentType = "apple"; // apple o bomb

        this.setupEvents();
    }

    start() {
        this.score = 0;
        this.applesBuffer = 0;
        this.speed = 1.5;
        this.timeLeft = 30;
        this.isPlaying = true;
        this.updateScore();
        this.updateTimer();
        this.resetObject();
        this.gameLoop();

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            if (this.timeLeft <= 0) this.endGame("¡Tiempo agotado!");
        }, 1000);
    }

    endGame(message) {
        this.isPlaying = false;
        cancelAnimationFrame(this.gameInterval);
        clearInterval(this.timerInterval);
        alert(message);
        window.miArcade.returnToMenu();
    }

    resetObject() {
        this.objY = -10;
        this.objX = Math.random() * 80 + 10;
        // 20% de probabilidad de que sea una bomba
        this.currentType = Math.random() > 0.8 ? "bomb" : "apple";
        this.objectElement.innerHTML = this.currentType === "apple" ? "🍎" : "💣";
        this.objectElement.style.left = `${this.objX}%`;
    }

    moveBasket(direction) {
        if (!this.isPlaying) return;
        if (direction === 'left' && this.basketX > 10) this.basketX -= 10;
        if (direction === 'right' && this.basketX < 90) this.basketX += 10;
        this.basketElement.style.left = `${this.basketX}%`;
    }

    updateScore() { this.scoreElement.innerText = `Manzanas: ${this.score}`; }
    updateTimer() { this.timerElement.innerText = `⏱️ ${this.timeLeft}s`; }

    gameLoop() {
        if (!this.isPlaying) return;
        this.objY += this.speed;
        this.objectElement.style.top = `${this.objY}%`;

        if (this.objY >= 85) {
            if (Math.abs(this.basketX - this.objX) < 15) {
                if (this.currentType === "bomb") {
                    this.endGame("¡BOOM! Agarraste una bomba. Perdiste todo lo de esta ronda.");
                    return;
                } else {
                    this.score++;
                    this.applesBuffer++;
                    this.speed += 0.05;
                    this.updateScore();
                    
                    // REGLA 5:1 -> Solo añade al inventario cada 5 manzanas
                    if (this.applesBuffer >= 5) {
                        window.miInventario.addItem({ id: "apple_01", icon: "🍎", type: "consumable" });
                        this.applesBuffer = 0;
                    }
                }
            }
            this.resetObject();
        }
        this.gameInterval = requestAnimationFrame(() => this.gameLoop());
    }

    setupEvents() {
        document.getElementById("btn-quit-minigame").addEventListener("click", () => {
            this.isPlaying = false;
            cancelAnimationFrame(this.gameInterval);
            clearInterval(this.timerInterval);
            window.miArcade.returnToMenu();
        });
        document.getElementById("touch-left").addEventListener("mousedown", () => this.moveBasket('left'));
        document.getElementById("touch-right").addEventListener("mousedown", () => this.moveBasket('right'));
        // Touch para móvil
        document.getElementById("touch-left").addEventListener("touchstart", (e) => { e.preventDefault(); this.moveBasket('left'); });
        document.getElementById("touch-right").addEventListener("touchstart", (e) => { e.preventDefault(); this.moveBasket('right'); });
    }
}

document.addEventListener("DOMContentLoaded", () => { window.minigameCatch = new MinigameCatch(); });