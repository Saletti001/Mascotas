# Plan de Implementación: Combate por Equipos 3v3 en el Coliseo

Este plan detalla la implementación de la modalidad de combate 3v3 ("Opción 1") en el Coliseo, manteniendo intactos los modos 1v1 existentes y cumpliendo con todas las reglas y balance descritos en la especificación técnica.

---

## Modificaciones Propuestas

### 1. Interfaz del Lobby del Coliseo y Modal de Selección de Equipo
#### [MODIFY] [index.html](file:///c:/Users/STT/Documents/GitHub/Mascotas/index.html)
* **Añadir tarjeta 3v3 en el Lobby**:
  * Insertar `#lobby-card-3v3` con diseño Cyberpunk neón cian y morado en la lista scrollable del lobby.
  * Añadir un control de acceso: si `window.misGenos.length < 3`, la tarjeta se muestra deshabilitada o muestra una advertencia al hacer clic.
* **Crear Modal de Selección de Equipo `#coliseum-team-modal`**:
  * Diseñar un modal con vidrio esmerilado (glassmorphism) para configurar el equipo:
    * Slot 1: **Abridor** (Cian)
    * Slot 2: **Relevo** (Morado)
    * Slot 3: **Cierre** (Rosa neón)
  * Renderizar los Genos del jugador en una lista interactiva. Al hacer clic en un Geno, se asigna al slot activo. Al hacer clic en un slot, se activa para asignación o se desasigna.
  * Cargar y guardar la selección del equipo en `localStorage` (`coliseum_3v3_team`) para comodidad del usuario.
  * Botón "Confirmar Equipo" habilitado solo cuando los 3 slots contengan Genos únicos.

---

### 2. Motor de Combate y Estado del Equipo
#### [MODIFY] [ColiseumLogic.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ColiseumLogic.js)
* **Variables del Estado del Equipo**:
  * `playerTeam`: Array de objetos de luchador correspondientes al equipo del jugador.
  * `enemyTeam`: Array de objetos de luchador para el rival procedural.
  * `playerActiveIndex` y `enemyActiveIndex`: Enteros (0, 1 o 2) que apuntan al luchador activo actual.
  * Redirigir por referencia `ColiseumLogic.player = ColiseumLogic.playerTeam[playerActiveIndex]` y `ColiseumLogic.enemy = ColiseumLogic.enemyTeam[enemyActiveIndex]`.
* **Inicialización de Equipos**:
  * Adaptar `prepararJugador` para recibir un array de 3 Genos y mapear sus estadísticas y ataques a `playerTeam`.
  * Adaptar `generarRivalProcedural` para 3v3:
    * Encontrar la rareza y el nivel máximo en el equipo del jugador.
    * Generar 3 enemigos procedurales simétricos con esa rareza y nivel equivalente, almacenándolos en `enemyTeam`.
* **Reglas de Intercambio (Swapping)**:
  * Implementar refresco de habilidades pasivas al entrar: `crystalSkin = true` si tiene el gen `piel_cristal`, y `sangreFriaUsada = false` si tiene el gen `sangre_fria`.
  * Comprobar el bloqueo de intercambio si el Geno activo tiene el estado `Enredado`.
  * La reducción por corrosión de ataque de los rivales afectará a todos los Genos del equipo (se hereda al cambiar).

---

### 3. Interfaz Visual en Combate
#### [MODIFY] [ColiseumUI.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ColiseumUI.js)
* **Mini Indicadores de Equipo**:
  * Renderizar en cada lado del combate (sobre las tarjetas de los combatientes) una fila vertical con 3 burbujas que representen a los miembros del equipo:
    * Borde del color elemental del Geno (ej: verde para Biomutante, violeta para Sintético).
    * Inicial del elemento (B, V, C, R, T, S).
    * Una pequeña barra horizontal debajo que refleje la proporción de HP del Geno.
    * Indicador visual luminoso (sombra neón) para el Geno actualmente activo.
    * Grayscale o cruz de derrota si el miembro está caído (0 HP).
* **Botones de Relevo Voluntario**:
  * Añadir en la grilla de controles `#battle-controls` dos botones de intercambio dinámicos `#btn-swap-a` y `#btn-swap-b` when in 3v3 mode.
  * Estos botones mostrarán el nombre y el slot del Geno benched correspondiente (ej. `🔄 RELEVO: Sparky`).
  * Estarían deshabilitados si el Geno objetivo tiene 0 HP, o si el Geno activo tiene el estado "Enredado".

---

### 4. Flujo del Turno y Controladores
#### [MODIFY] [ColiseumManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ColiseumManager.js)
* **Mapeo de Rutas**:
  * Añadir `ColiseumManager.abrirSeleccion3v3` para validar resistencia/número de Genos y abrir el modal.
  * Modificar `iniciarPeleaConfirmada` para descontar resistencia a los 3 Genos seleccionados si es 3v3.
* **Controlador de Turno con Relevo**:
  * Al presionar un botón de intercambio voluntario, se desencadena `procesarRonda("swap_X")` (donde X es el índice de equipo de destino).
  * En `procesarRonda`, si la acción del jugador es un swap:
    * Se ejecuta el cambio voluntario inmediatamente (antes de cualquier acción enemiga).
    * Consume el turno del jugador: el Geno entrante no ataca.
    * El enemigo realiza su acción contra el nuevo Geno activo.
* **Cambio Forzado**:
  * Al finalizar cada ronda (en `finalizarRonda`), si el Geno activo cae a 0 HP, se verifica si hay reservas disponibles.
  * Si quedan reservas, se realiza un cambio forzado automático al siguiente Geno en orden secuencial sin consumir turno.
  * Si no quedan reservas, se declara la derrota/victoria.

---

## Plan de Verificación

### Pruebas Manuales
1. **Validación del Lobby**:
   * Verificar que la tarjeta 3v3 muestra un aviso si el jugador tiene menos de 3 Genos.
   * Si tiene 3 o más, verificar que se abre el Modal de Selección de Equipo.
2. **Modal de Configuración**:
   * Probar a seleccionar 3 Genos y comprobar que se asignan a Abridor, Relevo y Cierre correspondientemente.
   * Probar a cambiar el orden o deseleccionar. Confirmar que el botón "Confirmar" se habilita únicamente con 3 Genos válidos y distintos.
3. **Inicio de Combate**:
   * Iniciar combate 3v3 y verificar que los 3 Genos tienen descontados 20 de resistencia.
   * Verificar la correcta visualización de los mini indicadores de equipo a ambos lados.
4. **Flujo de Batalla**:
   * Probar el intercambio voluntario en el turno del jugador. Verificar que se ejecuta el cambio, se registra en el log y el enemigo ataca al nuevo Geno activo inmediatamente.
   * Probar que si el Geno activo es afectado por "Raíz Enredadora" (Enredado), los botones de swap voluntario se bloquean.
   * Probar que si el Geno activo cae a 0 HP, entra el siguiente miembro automáticamente sin costo de turno y la batalla sigue.
   * Verificar la victoria cuando los 3 rivales caen a 0 HP, y la derrota cuando nuestros 3 Genos caen.
