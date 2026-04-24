// Dentro de la función iniciarPelea()
    function iniciarPelea() {
        let btnStart = document.getElementById("btn-start-battle");
        let btnLeave = document.getElementById("btn-leave-battle"); // NUEVO
        let controls = document.getElementById("battle-controls");
        
        if(btnStart) btnStart.style.setProperty("display", "none", "important");
        if(btnLeave) btnLeave.style.setProperty("display", "none", "important"); // NUEVO: ¡Aquí desaparece Retirarse!
        if(controls) controls.style.setProperty("display", "flex", "important");

        // ... resto de tu código de iniciarPelea
    }

    // Dentro de la función terminarCombate()
    function terminarCombate() {
        bloquearBotones(true);
        // ... (texto de victoria o derrota) ...

        setTimeout(() => {
            let controls = document.getElementById("battle-controls");
            let btnStart = document.getElementById("btn-start-battle");
            let btnLeave = document.getElementById("btn-leave-battle"); // NUEVO
            
            if(controls) controls.style.setProperty("display", "none", "important");
            if(btnStart) {
                btnStart.style.setProperty("display", "block", "important");
                btnStart.innerText = "Buscar otro rival";
            }
            if(btnLeave) { // NUEVO: ¡Aquí vuelve a aparecer Retirarse!
                btnLeave.style.setProperty("display", "block", "important");
            }
        }, 1000);
    }