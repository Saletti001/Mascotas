function generarSvgGeno(genesVisuales) {
    const safeData = genesVisuales || {};
    if (safeData.isEgg) { return /* código del huevo que ya tienes */; }

    const color = safeData.base_color || "#77DD77";
    const shape = safeData.body_shape || "frijol";
    const rnd = Math.floor(Math.random() * 100000);

    // 1. Obtener datos de anclaje (desde accesorios.js)
    const anclaje = (typeof anclajes !== 'undefined' && anclajes[shape]) ? anclajes[shape] : { cabezaX: 80, cabezaY: 25, espaldaX: 35, espaldaY: 80 };
    
    // 2. Elegir piezas de los diccionarios (desde caras.js y accesorios.js)
    const elegir = (dic, gen) => {
        if (typeof dic === 'undefined') return '';
        return gen ? dic[gen] : dic[Object.keys(dic)[Math.floor(Math.random() * Object.keys(dic).length)]];
    };

    const ojo = elegir(dicOjos, safeData.eye_type);
    const boca = elegir(dicBocas, safeData.mouth_type);
    const hat = elegir(dicSombreros, safeData.hat_type);
    const wing = elegir(dicAlas, safeData.wing_type);

    // ... [Aquí va el switch(shape) que dibuja pathD y shineD que ya conoces] ...

    return `<svg width="190" height="190" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <g class="g-cuerpo" transform="translate(${anclaje.espaldaX}, ${anclaje.espaldaY})">${wing}</g>
        <g class="g-cuerpo">
            ${shape === 'hongo' ? '/* las 5 manchas */' : ''}
            <path d="${pathD}" fill="${color}" stroke="#1a2a36" stroke-width="5" />
            <g class="g-ojos">${ojo}</g>
            <g class="g-boca">${boca}</g>
            <g transform="translate(${anclaje.cabezaX}, ${anclaje.cabezaY})">${hat}</g>
        </g>
    </svg>`;
}