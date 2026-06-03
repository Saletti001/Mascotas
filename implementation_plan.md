# Plan de Implementación: Sistema de Meta-Progresión (Nivel del Laboratorio) - Actualizado

Este plan detalla el diseño e implementación del Nivel de Laboratorio y el progreso de experiencia del jugador. La meta-progresión es off-chain y se sincroniza con la base de datos Supabase, vinculando directamente las recompensas de Arcade, Coliseo y el Cuidado Diario a la cuenta del usuario para desbloquear la Licencia de Comercio.

---

## Modificaciones de Base de Datos (Acción del Usuario)

> [!NOTE]
> Debido a que la terminal y el contenedor del asistente de IA están aislados de internet y tienen el tráfico saliente restringido (sandbox de seguridad), no puedo conectarme directamente por TCP al puerto 5432 de Supabase para alterar las tablas.
> 
> Por favor, ejecuta la siguiente consulta SQL en el **SQL Editor** de tu consola de Supabase:
> 
> ```sql
> ALTER TABLE jugadores 
> ADD COLUMN IF NOT EXISTS lab_level INTEGER DEFAULT 1,
> ADD COLUMN IF NOT EXISTS lab_xp INTEGER DEFAULT 0,
> ADD COLUMN IF NOT EXISTS comercio_desbloqueado BOOLEAN DEFAULT false;
> ```
> 
> *Nota: La lógica en JavaScript se diseñará con un sistema de doble vía (resiliente). Si las columnas no existen en la base de datos (por ejemplo, antes de ejecutar el SQL), el juego guardará y leerá automáticamente estos tres valores dentro del campo JSONB `datos_juego`. Esto previene cualquier error de red o de base de datos.*

---

## Proposed Changes

### [Núcleo de Datos y Sincronización]

#### [NEW] [LabManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/LabManager.js)
* **Estado Global del Laboratorio**:
  * Definir variables globales reactivas: `window.labLevel = 1;`, `window.labXP = 0;`, `window.comercioDesbloqueado = false;`.
* **Fórmula Matemática**:
  * Implementar la progresión $XP\_Requerida = 100 \times L^{1.5}$ mediante:
    ```javascript
    window.obtenerXPRequeridaLaboratorio = function(level) {
        return Math.floor(100 * Math.pow(level, 1.5));
    };
    ```
* **Distribución de XP**:
  * Implementar `window.ganarXPLaboratorio(cantidad, motivo)`:
    * Acumula experiencia y maneja subidas de nivel consecutivas.
    * Si sube de nivel, reproduce el sonido de evolución y muestra una alerta emergente Cyberpunk indicando el nuevo nivel del laboratorio.
    * Actualiza la interfaz del HUD y ejecuta el guardado en la nube.
* **Ganancia Genérica en Arcade (Soporte Multi-minijuegos)**:
  * Para evitar código duplicado y facilitar la expansión de la lista de minijuegos, implementamos la función genérica:
    ```javascript
    window.completarMinijuegoArcade = function(nombreMiniguego) {
        const xpRandom = Math.floor(Math.random() * 6) + 10; // Rango 10 a 15
        if (window.ganarXPLaboratorio) {
            window.ganarXPLaboratorio(xpRandom, `Minijuego Arcade: ${nombreMiniguego}`);
        }
        return xpRandom;
    };
    ```
* **Cuidado Diario Pasivo**:
  * Implementar `window.verificarCuidadoDiarioXP(geno)`:
    * Comprueba si el Geno tiene registradas las tres necesidades completadas hoy (`limpieza`, `caricia` y `alimentacion` en `registroAmistadDiaria`).
    * Admite el estado de "Ración Automática" activa como alimentación completada.
    * Otorga **30 de Laboratorio XP** una vez al día por criatura.

#### [MODIFY] [CloudManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/CloudManager.js)
* **Guardar en la Nube (`window.respaldarEnNube`)**:
  * Añadir campos `labLevel`, `labXP`, `comercioDesbloqueado` al objeto `datosJuego` (JSONB) para respaldo.
  * Incluir los atributos de columna `lab_level`, `lab_xp` y `comercio_desbloqueado` en el payload de `upsert`.
  * Si el upsert falla por falta de las columnas SQL, realizar fallback re-intentando guardar solo en la columna JSONB `datos_juego`.
* **Cargar de la Nube (`cargarDatosDeLaNube`)**:
  * Modificar la consulta `select` para incluir las nuevas columnas.
  * Si la consulta falla por columnas inexistentes, re-intentar seleccionando únicamente `datos_juego`.
  * Cargar las variables globales leyendo de las columnas específicas y, si son indefinidas/nulas, realizar fallback al objeto JSONB `datosJuego`.
  * Refrescar la interfaz HUD al cargar de la nube.

---

### [Interfaz del HUD e Inserción del Script]

#### [MODIFY] [index.html](file:///c:/Users/STT/Documents/GitHub/Mascotas/index.html)
* **HUD del Nivel de Laboratorio**:
  * Insertar un nuevo bloque `#hud-lab-container` al final de la tarjeta principal `#top-hud` (línea 101 aprox).
  * Usar estética Cyberpunk neón verde menta (`#69f0ae`) con una barra de progreso que refleje `window.labXP / window.obtenerXPRequeridaLaboratorio(window.labLevel)`.
* **Import de Script**:
  * Importar el archivo `<script src="LabManager.js"></script>` justo antes de `app.js`.

---

### [Eventos del Juego que Aportan XP]

#### [MODIFY] [MinigameCatch.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/MinigameCatch.js)
* **Arcade (Lluvia de Manzanas)**:
  * Al finalizar la sesión del miniguego con éxito (en `endGame` con `quit = false`), invocar la función genérica:
    ```javascript
    const xpObtenida = window.completarMinijuegoArcade("Lluvia de Manzanas");
    ```
  * Mostrar la cantidad de XP de laboratorio obtenida en la alerta de fin de partida.

#### [MODIFY] [ColiseumManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ColiseumManager.js)
* **Coliseo (1v1 y 3v3)**:
  * Al final de la batalla en `terminarCombate()`, comprobar el resultado:
    * **Victoria**: Invocar `window.ganarXPLaboratorio(25, "Victoria en el Coliseo")` y añadir al log de batalla `🏆 ¡+25 XP de Laboratorio!`.
    * **Derrota**: Invocar `window.ganarXPLaboratorio(5, "Derrota en el Coliseo")` y añadir al log de batalla `💀 +5 XP de Laboratorio.`.

#### [MODIFY] [app.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/app.js)
* **Cuidado Diario y Alimentación**:
  * Registrar la alimentación diaria cuando el jugador presiona "Alimentar":
    * Añadir `window.miMascota.registroAmistadDiaria.alimentacion = hoy;` y sincronizarlo al array `misGenos`.
  * Invocar `window.verificarCuidadoDiarioXP(window.miMascota)` al final de cada evento de cuidado exitoso (Ducha, Alimentar, Acariciar).

---

### [Bazar y Licencia de Comercio]

#### [MODIFY] [ShopManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ShopManager.js)
* **Licencia en Bazar**:
  * En `renderBazar()`, añadir el ítem `"Permiso de Comercio"` (`id: "comercio_licencia"`) al catálogo por un coste de **15.00 EV**.
  * Mostrar la tarjeta con un color amarillo/dorado.
  * Si la licencia está adquirida (`window.comercioDesbloqueado === true`), desactivar el botón y cambiar su texto a "Adquirido".
  * Si el nivel de laboratorio es menor que 5, desactivar el botón y cambiar su texto a "Bloqueado (Nv. 5)".
* **Acción de Compra**:
  * En `procesarCompra()`, añadir el handler para `comercio_licencia`:
    * Validar que `window.labLevel >= 5`.
    * Deducir 15.00 EV de `window.miInventario.vitalEssence`.
    * Establecer `window.comercioDesbloqueado = true` y actualizar la interfaz.

---

## Verification Plan

### Pruebas Automatizadas
1. **Verificación de Sintaxis**:
   * Ejecutar un script de validación de sintaxis Node.js en los archivos modificados para evitar fallos antes de cargar el navegador.

### Pruebas Manuales
1. **Prueba de Carga y Guardado Resiliente**:
   * Iniciar sesión en el juego sin haber ejecutado la migración SQL. Verificar que el juego carga y guarda progreso normalmente en la columna JSONB.
   * Ejecutar la migración en Supabase y verificar que las columnas específicas `lab_level`, `lab_xp` y `comercio_desbloqueado` se actualizan y cargan en sincronía.
2. **Progreso y Subidas de Nivel**:
   * Completar una partida de Arcade y verificar la obtención de 10-15 XP de Laboratorio en el HUD.
   * Terminar combates en el Coliseo (ganar/perder) y verificar la ganancia de 25 XP / 5 XP correspondientemente.
   * Realizar Ducha, Caricia y Alimentación a un Geno en el mismo día, verificar la alerta de Cuidado Diario y la suma de +30 XP.
   * Simular la obtención de suficiente experiencia para subir de nivel y validar que el nivel y el exceso de XP se calculan según la fórmula y se actualizan en el HUD.
3. **Tienda y Licencia**:
   * Tratar de comprar el "Permiso de Comercio" en el Bazar siendo Nivel 1. Confirmar que el botón aparece bloqueado como "Bloqueado (Nv. 5)".
   * Aumentar el nivel de laboratorio a 5, verificar que el botón se habilita, comprarlo con 15.00 EV y constatar que pasa a estado "Adquirido" y desbloquea el estado `window.comercioDesbloqueado`.
