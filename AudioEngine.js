// =========================================
// AudioEngine.js - SINTETIZADOR 8-BITS NATIVO
// =========================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.Sonidos = {
    play: function(tipo) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const ahora = audioCtx.currentTime;

        if (tipo === "click") {
            // Sonido de interfaz (botón)
            osc.type = "square";
            osc.frequency.setValueAtTime(400, ahora);
            osc.frequency.exponentialRampToValueAtTime(600, ahora + 0.05);
            gainNode.gain.setValueAtTime(0.1, ahora);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ahora + 0.05);
            osc.start(ahora); osc.stop(ahora + 0.05);
            
        } else if (tipo === "hit") {
            // Sonido de golpe (Ataque en Coliseo)
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(150, ahora);
            osc.frequency.exponentialRampToValueAtTime(20, ahora + 0.2);
            gainNode.gain.setValueAtTime(0.2, ahora);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ahora + 0.2);
            osc.start(ahora); osc.stop(ahora + 0.2);
            
        } else if (tipo === "heal") {
            // Sonido de curación (Manzana / Habilidad Acuática)
            osc.type = "sine";
            osc.frequency.setValueAtTime(400, ahora);
            osc.frequency.linearRampToValueAtTime(800, ahora + 0.1);
            osc.frequency.linearRampToValueAtTime(1200, ahora + 0.3);
            gainNode.gain.setValueAtTime(0.1, ahora);
            gainNode.gain.linearRampToValueAtTime(0, ahora + 0.3);
            osc.start(ahora); osc.stop(ahora + 0.3);
            
        } else if (tipo === "coin") {
            // Sonido de Venta en el Mercado
            osc.type = "square";
            osc.frequency.setValueAtTime(1000, ahora);
            osc.frequency.setValueAtTime(1500, ahora + 0.1);
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