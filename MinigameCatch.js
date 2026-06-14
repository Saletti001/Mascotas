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
        this.evGanada = 0;
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
        
        // Asegurar controles táctiles visibles
        const touchControls = document.getElementById("touch-controls");
        if (touchControls) touchControls.style.display = "flex";

        // Aplicar fondo dinámico verde
        this.playArea.className = "";
        this.playArea.classList.add("game-catch-bg");

        this.score = 0;
        this.evGanada = 0;
        this.timeLeft = 30;
        this.basketX = 50;
        this.basket.style.left = this.basketX + "%";
        
        // Inyectar Geno principal sin cosméticos como el recolector
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

        const basketFallbackSvg = `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#ffea00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto; filter: drop-shadow(0 0 4px rgba(255,234,0,0.5));"><path d="M22 12h-4.58A6 6 0 0 0 12 6a6 6 0 0 0-5.42 6H2 M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6M12 2v4"/></svg>`;
        this.basket.innerHTML = typeof generarSvgGeno === 'function' ? generarSvgGeno(cleanAdn) : basketFallbackSvg;
        this.basket.style.fontSize = "initial";
        this.basket.style.display = "block"; // Asegurar visibilidad
        
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
        const evStr = this.evGanada > 0 ? ` | +${this.evGanada.toFixed(2)} EV` : "";
        this.scoreDisplay.innerText = `Manzanas: ${this.score}${evStr}`;
        this.timerDisplay.innerText = `TIEMPO: ${this.timeLeft}s`;
    }

    spawnItem() {
        if (!this.isPlaying) return;

        const rand = Math.random();
        let type, iconSvg, speed;

        if (rand < 0.15) {
            // Gema de EV — siempre cae rápido
            type  = Math.random() < 0.70 ? "ev_small" : "ev_large";
            iconSvg  = null; // usaremos SVG inline de gema
            speed = 9 + Math.random() * 2; // 9-11 px/tick
        } else if (rand < 0.40) {
            // Bomba
            type  = "bomb";
            iconSvg  = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px rgba(0,229,255,0.5));"><circle cx="12" cy="12" r="8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M5.64 19.07l1.42-1.42M16.94 7.06l1.42-1.42"/><path d="M12 8v4l3 3" opacity="0.6"/></svg>`;
            speed = 4 + Math.random() * 3;
        } else {
            // Manzana
            type  = "apple";
            iconSvg  = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#ff007f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px rgba(255,0,127,0.5));"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6c0-2 1-3 1-3 M9.5 8C8.5 7 8 5.5 8 5.5"/></svg>`;
            speed = 4 + Math.random() * 3;
        }

        const item = document.createElement("div");
        item.style.position = "absolute";
        item.style.left     = (Math.random() * 85) + "%";
        item.style.top      = "-40px";
        item.dataset.type   = type;

        if (type === "ev_small" || type === "ev_large") {
            item.style.fontSize = "0"; // sin emoji
            const isLarge = type === "ev_large";
            const size = isLarge ? "30px" : "22px";
            const textVal = isLarge ? "10" : "5";
            item.style.width    = size;
            item.style.height   = size;
            item.style.display  = "flex";
            item.style.alignItems = "center";
            item.style.justifyContent = "center";
            item.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="${isLarge ? "#FF8F00" : "#FFD700"}" stroke="${isLarge ? "#D84315" : "#FFA000"}" stroke-width="1.5"/>
                <text x="12" y="16" text-anchor="middle" font-size="9" fill="#0d1a24" font-weight="bold" font-family="monospace">${textVal}</text>
                <circle cx="12" cy="12" r="4" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>
            </svg>`;
            // Brillo pulsante
            item.style.filter = "drop-shadow(0 0 5px #FFD700) drop-shadow(0 0 10px rgba(255,215,0,0.6))";
            item.style.animation = "pulse 0.8s ease-in-out infinite alternate";
        } else {
            item.style.fontSize = "0";
            item.style.width = "30px";
            item.style.height = "30px";
            item.innerHTML = iconSvg;
        }

        this.playArea.appendChild(item);
        
        let posY = -40;
        
        const fall = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(fall);
                return;
            }
            
            posY += speed;
            item.style.top = posY + "px";
            
            const basketRect = this.basket.getBoundingClientRect();
            const itemRect   = item.getBoundingClientRect();
            
            const collisionTop = basketRect.top + 20;
            const collisionLeft = basketRect.left + 12;
            const collisionRight = basketRect.right - 12;
 
            if (
                itemRect.bottom >= collisionTop &&
                itemRect.top    <= basketRect.bottom &&
                itemRect.right  >= collisionLeft &&
                itemRect.left   <= collisionRight
            ) {
                if (item.dataset.type === "apple") {
                    this.score++;
                } else if (item.dataset.type === "ev_small" || item.dataset.type === "ev_large") {
                    const evGemVal = item.dataset.type === "ev_large" ? 10 : 5;
                    this.evGanada = parseFloat((this.evGanada + evGemVal).toFixed(2));
                    // Acreditar directamente al inventario del jugador
                    if (window.miInventario && typeof window.miInventario.addEssence === "function") {
                        window.miInventario.addEssence(evGemVal);
                    }
                    // Feedback visual rápido
                    this.playArea.style.backgroundColor = "rgba(255, 215, 0, 0.15)";
                    setTimeout(() => this.playArea.style.backgroundColor = "", 120);
                } else {
                    // Bomba
                    this.score = Math.max(0, this.score - 3);
                    this.playArea.style.backgroundColor = "#ffcccc";
                    setTimeout(() => this.playArea.style.backgroundColor = "", 150);
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
        
        // Limpiar clase de fondo de playArea
        this.playArea.className = "";
        
        if (!quit) {
            let appleRatio = 5;
            if (window.GameEconomyConfig && window.GameEconomyConfig.gameplay_rewards && window.GameEconomyConfig.gameplay_rewards.arcade_catch && window.GameEconomyConfig.gameplay_rewards.arcade_catch.apple_ratio !== undefined) {
                appleRatio = window.GameEconomyConfig.gameplay_rewards.arcade_catch.apple_ratio;
            }
            const reward = Math.floor(this.score / appleRatio);
            
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

            const xpObtenida = typeof window.completarMinijuegoArcade === 'function' 
                ? window.completarMinijuegoArcade("Lluvia de Manzanas") 
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
                        window.misGenos[idx].diversion          = window.miMascota.diversion;
                        window.misGenos[idx].amistad            = window.miMascota.amistad;
                        window.misGenos[idx].evAcumulada        = window.miMascota.evAcumulada;
                        window.misGenos[idx].registroAmistadDiaria = window.miMascota.registroAmistadDiaria;
                    }
                }
                if (window.NexoEnergyManager) window.NexoEnergyManager.actualizarUI();
                if (window.guardarJuego) window.guardarJuego();
                else if (window.guardarProgreso) window.guardarProgreso();

                let appleRatio = 5;
                if (window.GameEconomyConfig && window.GameEconomyConfig.gameplay_rewards && window.GameEconomyConfig.gameplay_rewards.arcade_catch && window.GameEconomyConfig.gameplay_rewards.arcade_catch.apple_ratio !== undefined) {
                    appleRatio = window.GameEconomyConfig.gameplay_rewards.arcade_catch.apple_ratio;
                }
                let msg = `¡Tiempo terminado!\nAtrapaste ${this.score} manzana(s).\nRatio ${appleRatio}:1 = Ganas ${reward} Manzanas.`;
                if (this.evGanada > 0) msg += `\n+${this.evGanada.toFixed(2)} EV atrapada(s)!`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                if (gananciaExplicita > 0) msg += `\n¡Diversión +20% y Amistad +${gananciaExplicita}!`;
                else                       msg += `\n¡Diversión +20%! (Amistad por Arcade ya obtenida hoy)`;
                alert(msg);
            } else {
                let appleRatio = 5;
                if (window.GameEconomyConfig && window.GameEconomyConfig.gameplay_rewards && window.GameEconomyConfig.gameplay_rewards.arcade_catch && window.GameEconomyConfig.gameplay_rewards.arcade_catch.apple_ratio !== undefined) {
                    appleRatio = window.GameEconomyConfig.gameplay_rewards.arcade_catch.apple_ratio;
                }
                let msg = `¡Tiempo terminado!\nAtrapaste ${this.score} manzana(s).\nRatio ${appleRatio}:1 = Ganas ${reward} Manzanas.`;
                if (xpObtenida > 0) msg += `\n+${xpObtenida} XP de Laboratorio!`;
                alert(msg);
            }
        }
        
        this.screen.classList.add("hidden");
        this.arcadeMenu.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MinigameCatch();
});