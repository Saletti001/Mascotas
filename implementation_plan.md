# Hito A: Activación Genética y Ajustes de Progresión

Activación y programación de los genes ocultos inactivos en el juego según las especificaciones de las hojas de ruta **V10.1 (Maestro)** y **V10.2 (Coliseo)**, permitiendo cerrar las brechas del sistema RPG, de cría (Breeding) y fusión (Reactor).

## User Review Required

> [!IMPORTANT]
> **Fórmula de Daño Mínimo (Confirmada)**
> De acuerdo con las instrucciones explícitas del usuario, la fórmula de daño mínimo actual en [ColiseumLogic.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ColiseumLogic.js) **no se modificará** y permanecerá en `0.25` (25% del ATK por defecto) y `0.35` (35% del ATK con el gen `min_dmg`). Esto permite que los combates se prolonguen más para favorecer el juego táctico.

## Proposed Changes

---

### RPG y Progresión de Niveles

Activación de genes ocultos relacionados con la progresión del Geno.

#### [MODIFY] [RPGManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/RPGManager.js)
- **Gen `especialista_elite`**: Modificar la validación de nivel máximo de XP (actualmente limitada rígidamente a 50) para permitir subir hasta el nivel 55 si el Geno posee este gen de combate.
- **Gen `resonancia_nivel`**: Implementar la lógica para que el Geno obtenga un aumento de +1 en su estadística líder cada 10 niveles alcanzados.
- **Gen `aceleracion_final`**: Modificar la curva de XP en la función de subida de nivel de forma que los últimos 10 niveles (del 40 al 50, o del 45 al 55 con `especialista_elite`) requieran un 40% menos de XP.

---

### Reactor y Fusión

Activación de genes ocultos que afectan el proceso de fusión en el reactor.

#### [MODIFY] [ReactorManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/ReactorManager.js)
- **Gen `resistencia_colapso` (ANTI_C)**: Integrar en la lógica de fusión para mitigar o anular las posibilidades de colapso destructivo del Reactor.
- **Genes `catalizador_rareza` y `catalizador_critico`**: Sumar un +2% de probabilidad de éxito crítico al proceso de fusión de reactor respectivamente si los especímenes involucrados poseen estos genes.
- **Gen `alquimista_natural`**: Implementar para que el Geno que posea este gen cuente como `1.5` Genos de cara al peso de la mezcla de fusión en el reactor.

---

### Laboratorio de Crianza (Breeding)

Activación de genes de crianza inactivos en el laboratorio.

#### [MODIFY] [BreedingManager.js](file:///c:/Users/STT/Documents/GitHub/Mascotas/BreedingManager.js)
- **Gen `gen_dominante_puro`**: Asegurar que, si el padre posee este gen, se garantice la herencia del 100% de los genes asociados a la cría.
- **Gen `memoria_genetica`**: Incrementar la probabilidad de que la cría herede genes ocultos raros de sus ancestros.
- **Gen `cooldown_acelerado`**: Modificar el cálculo de incubación/cooldown de cría para reducir a la mitad el tiempo de espera por defecto del espécimen.

---

## Verification Plan

### Automated Tests
- Ejecutar pruebas automatizadas locales de subida de nivel para comprobar que un Geno con `especialista_elite` puede superar el nivel 50.
- Ejecutar scripts de simulación de herencia de cría y probabilidad de reactor para validar la correcta aplicación matemática de los genes de crianza y reactor.

### Manual Verification
- Realizar fusiones en el Reactor con un Geno que tenga el gen `resistencia_colapso` y verificar que el porcentaje de colapso disminuye en la UI.
- Realizar cruces en el Laboratorio de Crianza con Genos que posean `cooldown_acelerado` y confirmar que el tiempo de incubación se reduce al 50%.
- Subir de nivel a un Geno mediante el entrenamiento en el panel de juego y validar que las estadísticas se calculan con el bonus de `resonancia_nivel`.
