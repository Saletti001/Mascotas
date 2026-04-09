// =========================================
// AudioEngine.js - SINTETIZADOR MODERNO Y MÚSICA
// =========================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// REPRODUCTOR DE MÚSICA DE FONDO
// Puedes cambiar el enlace entre comillas por "musica.mp3" si descargas tu propio archivo en la carpeta
const bgm = new Audio("https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3"); 
bgm.loop = true;
bgm.volume = 0.15; // Volumen bajito para que no tape los efectos

window.Sonidos = {
    musicaOn: false,
    
    toggleMusica: function() {
        if (this.musicaOn) {
            bgm.pause();
            this.musicaOn = false;
        } else {
            // Los navegadores requieren interacción antes de reproducir audio
            if (audioCtx.state === 'suspended') audioCtx.resume();
            bgm.play().catch(e => console.log("Esperando interacción del usuario"));
            this.musicaOn = true;
        }
        return this.musicaOn;
    },

    play: function(tipo) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const ahora = audioCtx.currentTime;

        if (tipo === "click") {
            // UI Pop moderno y suave
            osc.type = "sine"; 
            osc.frequency.setValueAtTime(600, ahora);
            osc.frequency.exponentialRampToValueAtTime(300, ahora + 0.05);
            gainNode.gain.setValueAtTime(0.1, ahora);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ahora + 0.05);
            osc.start(ahora); osc.stop(ahora + 0.05);
            
        } else if (tipo === "hit") {
            // Golpe profundo (Sub-bass thud) sin distorsión
            osc.type = "sine";
            osc.frequency.setValueAtTime(100, ahora);
            osc.frequency.exponentialRampToValueAtTime(30, ahora + 0.2);
            gainNode.gain.setValueAtTime(0.3, ahora);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ahora + 0.2);
            osc.start(ahora); osc.stop(ahora + 0.2);
            
        } else if (tipo === "heal") {
            // Campana holográfica (brillo de curación)
            osc.type = "triangle";
            osc.frequency.setValueAtTime(400, ahora);
            osc.frequency.linearRampToValueAtTime(800, ahora + 0.4);
            gainNode.gain.setValueAtTime(0, ahora);
            gainNode.gain.linearRampToValueAtTime(0.1, ahora + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, ahora + 0.4);
            osc.start(ahora); osc.stop(ahora + 0.4);
            
        } else if (tipo === "coin") {
            // Sonido de "Ping" tecnológico para el mercado
            osc.type = "sine";
            osc.frequency.setValueAtTime(1200, ahora);
            osc.frequency.setValueAtTime(1800, ahora + 0.1);
            gainNode.gain.setValueAtTime(0.1, ahora);
            gainNode.gain.linearRampToValueAtTime(0, ahora + 0.2);
            osc.start(ahora); osc.stop(ahora + 0.2);
        }
    }
};

// Enganchar el sonido de "Click" a todos los botones del juego automáticamente
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if(e.target.tagName.toLowerCase() === 'button' || e.target.closest('.drawer-item') || e.target.closest('.arcade-card')) {
            window.Sonidos.play("click");
        }
    });
});