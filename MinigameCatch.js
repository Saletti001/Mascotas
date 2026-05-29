class MinigameCatch {
    constructor() {
        window.minigameCatch = this;
        this.screen = document.getElementById("minigame-screen");
        this.arcadeMenu = document.getElementById("arcade-menu");
        this.playArea = document.getElementById("play-area");
        this.basket = document.getElementById("player-basket");
        this.scoreDisplay = document.getElementById("minigame-score");
        this.timerDisplay = document.getElementById("minigame-timer");

        this.btnStart = document.getElementById("card-catch-game");
        this.btnQuit = document.getElementById("btn-quit-minigame");

        this.touchLeft = document.getElementById("touch-left");
        this.touchRight = document.getElementById("touch-right");

        this.score = 0;
        this.timeLeft = 30;
        this.basketX = 50; 
        this.gameInterval = null;
        this.spawnInterval = null;
        this.isPlaying = false;

        this.keys = { ArrowLeft: false, ArrowRight: false, a: false, d: false };

        this.initEvents();
    }

    start() {
        this.startGame();
    }

    initEvents() {
        if(this.btnStart) this.btnStart.addEventListener("click", () => this.startGame());
        if(this.btnQuit) this.btnQuit.addEventListener("click", () => this.endGame(true));

        document.addEventListener("keydown", (e) => {
            if(this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
        });
        document.addEventListener("keyup", (e) => {
            if(this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
        });

        if(this.touchLeft && this.touchRight) {
            this.touchLeft.addEventListener("touchstart", (e) => { e.preventDefault(); this.keys.ArrowLeft = true; });
            this.touchLeft.addEventListener("touchend", (e) => { e.preventDefault(); this.keys.ArrowLeft = false; });
            this.touchRight.addEventListener("touchstart", (e) => { e.preventDefault(); this.keys.ArrowRight = true; });
            this.touchRight.addEventListener("touchend", (e) => { e.preventDefault(); this.keys.ArrowRight = false; });
        }
    }

    startGame() {
        this.arcadeMenu.classList.add("hidden");
        this.screen.classList.remove("hidden");
        
        this.score = 0;
        this.timeLeft = 30;
        this.basketX = 50;
        this.basket.style.left = this.basketX + "%";
        this.updateUI();
        
        Array.from(this.playArea.children).forEach(child => {
            if (child.id !== "player-basket" && child.id !== "touch-controls") {
                child.remove();
            }
        });

        this.isPlaying = true;
        this.gameLoop(); 
        
        this.gameInterval = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            if (this.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);

        this.spawnInterval = setInterval(() => this.spawnItem(), 700);
    }

    updateUI() {
        this.scoreDisplay.innerText = `Manzanas: ${this.score}`;
        this.timerDisplay.innerText = `⏱️ ${this.timeLeft}s`;
    }

    spawnItem() {
        if (!this.isPlaying) return;
        
        const isBomb = Math.random() < 0.25; 
        const item = document.createElement("div");
        item.innerText = isBomb ? "💣" : "🍎";
        item.style.position = "absolute";
        item.style.fontSize = "30px";
        item.style.left = (Math.random() * 85) + "%"; 
        item.style.top = "-40px";
        item.dataset.type = isBomb ? "bomb" : "apple";
        
        this.playArea.appendChild(item);
        
        let posY = -40;
        const speed = 4 + Math.random() * 3; 
        
        const fall = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(fall);
                return;
            }
            
            posY += speed;
            item.style.top = posY + "px";
            
            const basketRect = this.basket.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            
            if (
                itemRect.bottom >= basketRect.top &&
                itemRect.top <= basketRect.bottom &&
                itemRect.right >= basketRect.left &&
                itemRect.left <= basketRect.right
            ) {
                if (item.dataset.type === "apple") {
                    this.score++;
                } else {
                    this.score = Math.max(0, this.score - 3); 
                    this.playArea.style.backgroundColor = "#ffcccc"; 
                    setTimeout(() => this.playArea.style.backgroundColor = "#87CEEB", 150);
                }
                
                this.updateUI();
                item.remove();
                clearInterval(fall);
            }
            
            if (posY > this.playArea.clientHeight) {
                item.remove();
                clearInterval(fall);
            }
        }, 20);
    }

    gameLoop() {
        if (!this.isPlaying) return;
        
        if (this.keys.ArrowLeft || this.keys.a) this.basketX = Math.max(0, this.basketX - 2.5);
        if (this.keys.ArrowRight || this.keys.d) this.basketX = Math.min(85, this.basketX + 2.5);
        
        this.basket.style.left = this.basketX + "%";
        
        requestAnimationFrame(() => this.gameLoop());
    }

    endGame(quit = false) {
        this.isPlaying = false;
        clearInterval(this.gameInterval);
        clearInterval(this.spawnInterval);
        
        if (!quit) {
            const reward = Math.floor(this.score / 5);
            
            if (reward > 0 && window.miInventario) {
                window.miInventario.addItem({
                    id: "apple_01",
                    name: "Manzana",
                    icon: "🍎",
                    type: "consumible",
                    maxStack: 20,
                    count: reward 
                });
            }

            // Afectar necesidades del Geno activo
            if (window.miMascota && window.miMascota.id && window.miMascota.id !== "temp") {
                if (window.miMascota.diversion === undefined) window.miMascota.diversion = 100;
                if (window.miMascota.amistad === undefined) window.miMascota.amistad = 0;
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
                if (window.NexoEnergyManager) {
                    window.NexoEnergyManager.actualizarUI();
                }
                if (window.guardarJuego) window.guardarJuego();
                else if (window.guardarProgreso) window.guardarProgreso();

                if (gananciaExplicita > 0) {
                    alert(`¡Tiempo terminado!\nAtrapaste ${this.score} manzanas.\nRatio 5:1 = Ganas ${reward} 🍎.\n¡Diversión +20% y Amistad +${gananciaExplicita}!`);
                } else {
                    alert(`¡Tiempo terminado!\nAtrapaste ${this.score} manzanas.\nRatio 5:1 = Ganas ${reward} 🍎.\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`);
                }
            } else {
                alert(`¡Tiempo terminado!\nAtrapaste ${this.score} manzanas.\nRatio 5:1 = Ganas ${reward} 🍎.`);
            }
        }
        
        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameCatch();
});