// ArcadeManager.js - El motor que construye la interfaz automáticamente
class ArcadeManager {
    constructor() {
        this.menuScreen = document.getElementById("arcade-menu");
        this.gameScreen = document.getElementById("minigame-screen");
        this.gridContainer = document.querySelector(".arcade-games-grid");
        
        this.init();
    }

    init() {
        this.renderGames();
        this.setupEvents();
    }

    // Esta función dibuja las 30 tarjetas por ti
    renderGames() {
        if (!this.gridContainer) return;
        
        this.gridContainer.innerHTML = ""; // Limpiamos la caja

        ARCADE_GAMES_DATABASE.forEach(game => {
            const card = document.createElement("div");
            card.className = `arcade-card ${game.locked ? 'locked' : ''}`;
            card.id = `card-${game.id}`;
            
            card.innerHTML = `
                <div class="card-icon">${game.icon}</div>
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
            `;

            if (!game.locked) {
                card.onclick = () => this.launchMinigame(game.id);
            }

            this.gridContainer.appendChild(card);
        });
    }

    launchMinigame(gameName) {
        this.menuScreen.classList.add("hidden");
        this.gameScreen.classList.remove("hidden");
        if (gameName === 'catch' && window.minigameCatch) {
            window.minigameCatch.start();
        }
    }

    returnToMenu() {
        this.gameScreen.classList.add("hidden");
        this.menuScreen.classList.remove("hidden");
    }

    setupEvents() {
        // Los clics ya se configuran automáticamente en renderGames()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.miArcade = new ArcadeManager();
});