# 📝 Registro de Mejoras y Ajustes — Proyecto Genos (Nueva Era)

Este documento sirve como bitácora activa para registrar todas las modificaciones, correcciones de errores, balanceos y ajustes de base de datos que realicemos a partir del **12 de junio de 2026** (después de la consolidación de la versión V12 Maestro).

---

## ⚙️ Correcciones y Ajustes de Integración (12/06/2026)

### 1. Solución al Bloqueo de Navegación en el Nexo y Desaparición de Cajas de Selección (Selects)
* **Problema**: 
  1. Al entrar al Nexo (Lobby del Coliseo), la navegación se bloqueaba y el jugador no podía cambiar de pantalla o regresar al laboratorio de forma consistente. Esto ocurría porque la función `window.navegarA` se definía dentro del evento `DOMContentLoaded` en `app.js`, lo que hacía que otros scripts cargados de forma inmediata (como `ImplantsManager.js`) no pudieran capturar la función base para encadenar sus decoraciones correctamente, provocando fallos y referencias `undefined`. Además, los botones de "Volver" compartían la clase `.btn-go-home` de forma genérica, gatillando navegación paralela indeseada al laboratorio por el burbujeo de eventos.
  2. Los selectores customizados de afinidad elemental y dificultad (del simulador de clon y desafío táctico PvE) desaparecían al cambiar de pestaña (PvE <-> PvP) porque la función `initColiseumCustomSelects()` solo se ejecutaba una vez en la carga inicial, mientras que la UI del lobby regenera el HTML dinámicamente limpiando los selectores nativos recién insertados.
* **Implementación y Solución**:
  * **Estructura Global**: Se movió la definición de `window.currentSlide` y la base de `window.navegarA` al contexto global en [app.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/app.js) (fuera de `DOMContentLoaded`). Ahora todos los managers cargados subsecuentemente pueden decorar `window.navegarA` de forma segura.
  * **Evitar Conflicto de Navegación**: Se modificó [app.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/app.js) para que no adjunte el callback de navegación por defecto a elementos con la clase `.btn-go-home` si ya cuentan con un atributo inline `onclick` definido en el HTML.
  * **Navegación Explícita y Limpieza**: En [play.html](file:///c:/Users/STT/Documents/GitHub/Mascotas/play.html), se añadió `onclick="navegarA('room-area')"` de forma inline a todos los botones reales de retorno al laboratorio. Se removió la clase `.btn-go-home` de los botones que no deben volver al laboratorio (como el botón "VOLVER AL COLISEO" de la pantalla de torneos y el botón "RETIRARSE" del combate activo), eliminando la navegación dual concurrente.
  * **Re-inicialización de Selects**: Se expuso la función `initColiseumCustomSelects` como `window.ColiseumManager.initColiseumCustomSelects` en [ColiseumManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ColiseumManager.js) y se invoca de manera automática al finalizar la renderización de la pestaña PvE en `actualizarLobbyUI()`. Los desplegables Cyberpunk ahora se muestran y funcionan correctamente en cada renderizado.
  * **Corrección de Sintaxis**: Se removió una cadena de texto residual huérfana en la línea 745 de [app.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/app.js) que impedía la correcta compilación sintáctica en navegadores estrictos.

### 2. Panel de Control de Precios y Sincronización Dinámica de Mecánicas del Nexo (12/06/2026)
* **Objetivo**: Integrar y centralizar todos los precios, límites y costos de eventos o productos implementados recientemente (que consumen EV o POL) bajo el panel de control del administrador (`admin.html`) para permitir su edición y publicación en tiempo real vía Supabase.
* **Implementación**:
  * **Base de datos (`CloudManager.js`)**: Se integró el bloque `mechanics` al objeto `DEFAULT_CONFIG` para inicializar y garantizar compatibilidad retroactiva con valores base para el Reactor, Centro de Crianza, Arena PvP, Ranuras (Slots) de inventario y Cuidado Diario de Esencia Vital.
  * **Interfaz de Control (`admin.html`)**: Se creó la Card 4 ("Configuración de Mecánicas del Nexo") en la pestaña de Balance. Cuenta con un selector interactivo Cyberpunk (`select-mechanic`) que permite alternar y editar dinámicamente los valores y tasas de cada mecánica. Se enlazó al flujo de persistencia en caliente e incrementa el número de versión del balance global al guardar y publicar.
  * **Consumo Dinámico de Configuración**:
    * **Reactor Manager**: `reactorRules` ahora consume dinámicamente los costos y reembolsos de los tres niveles de fusión de `window.GameEconomyConfig.mechanics.reactor`.
    * **Breeding Manager**: Se dinamizaron las tarifas de crianza según cantidad de crías anteriores (`cost_0` a `cost_5_plus_base`), las tarifas de incubadora básica (EV), incubadora de plasma (POL) y coste de aceleración instantánea (`skip_hatch` en POL) desde `window.GameEconomyConfig.mechanics.breeding`.
    * **Coliseum Manager**: El coste del pase de entrada a la Arena PvP se lee desde `window.GameEconomyConfig.mechanics.arena.ticket_cost`, actualizando los textos de la interfaz correspondientes.
    * **Slots y Cosecha Diaria (`app.js` y `EnergyManager.js`)**: Las ranuras del inventario del 7 al 11+ consumen sus valores híbridos (EV / POL) dinámicamente. El límite de recolección de esencia (`harvest_limit`) y la generación pasiva por día (`passive_rate_day`) se sincronizan directamente desde la configuración de base de datos.
  * **Usabilidad de Cápsulas de Esencia Vital (`InventoryManager.js`)**: Se implementó el soporte en el gestor de inventario para que los jugadores puedan "abrir" o "usar" las cápsulas de Esencia Vital en su mochila, consumiendo el ítem e inyectando de forma instantánea el EV contenido al saldo del usuario, cerrando el ciclo de vida de la encapsulación.
