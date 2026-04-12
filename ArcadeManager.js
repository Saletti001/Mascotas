class ArcadeManager {
    constructor() {
        this.menuScreen = document.getElementById("arcade-menu");
        this.gameScreen = document.getElementById("minigame-screen");
        this.setupEvents();
    }

    // Lanza el minijuego específico basado en el nombre
    launchMinigame(gameName) {
        this.menuScreen.classList.add("hidden");
        this.gameScreen.classList.remove("hidden");

        if (gameName === 'catch') {
            if (window.minigameCatch) window.minigameCatch.start();
        }
        // En el futuro: if (gameName === 'flappy') window.minigameFlappy.start();
    }

    // Llamado por el minijuego cuando terminas o sales
    returnToMenu() {
        this.gameScreen.classList.add("hidden");
        this.menuScreen.classList.remove("hidden");
    }

    setupEvents() {
        const btnCatchGame = document.getElementById("card-catch-game");
        if (btnCatchGame) {
            btnCatchGame.addEventListener("click", () => this.launchMinigame('catch'));
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.miArcade = new ArcadeManager();
});