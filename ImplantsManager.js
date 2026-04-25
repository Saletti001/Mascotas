// 1. Añadimos un Aura
window.miInventario.addItem({
    id: "cos_aura_" + Date.now(),
    name: "Aura de Energía Oscura",
    icon: "🔮", 
    type: "Cosmético", // MUY IMPORTANTE
    subType: "aura", // Define en qué slot va
    maxStack: 1, 
    description: "Un campo de fuerza giratorio.",
    evCost: 0, // Gratis de instalar
    id_cosmetico: "energia_oscura" // Llama a la propiedad del diccionario
});

// 2. Añadimos una Piel
setTimeout(() => {
    window.miInventario.addItem({
        id: "cos_skin_" + Date.now(),
        name: "Piel de Malla Cibernética",
        icon: "🧬",
        type: "Cosmético",
        subType: "skin", 
        maxStack: 1,
        description: "Reemplaza el tejido por fibra de carbono.",
        evCost: 150, // Cuesta esencia
        id_cosmetico: "malla_cibernetica"
    });
    alert("✅ Has recibido un Aura y una Piel en tu Almacén.");
    if(typeof window.actualizarHUD === 'function') window.actualizarHUD();
}, 100);