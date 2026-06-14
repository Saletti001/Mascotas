PROYECTO GENOS

Documento Maestro V12 — Hoja de Ruta + Sistema de Combate

Tamagotchi genetico · Breeding estrategico · Coliseo Web3

V9.1 + Sistema de Combate V1.1 + Balance V13.9 + Torneos Temáticos + Economía Consolidada V1.4 + Especificaciones Coliseo/Torneos V1.0

Abril 2026 | Actualizado: Junio 2026 — Estado de implementación real y consolidado

> NOTA: Este documento es una guia de disenio. El codigo es la fuente de verdad.
> Leyenda de estado: ✅ Completado en codigo | 🚧 Simulado/parcial (sin blockchain real) | ❌ Pendiente de implementar

## 🚦 Estado de Implementación — Actualizado desde el Código (Junio 2026)

Este cuadro representa el estado de desarrollo real del software validado directamente desde el código fuente de producción.

| Fase / Módulo | Estado | Descripción Técnica y Cobertura | Archivos de Código Clave |
| :--- | :---: | :--- | :--- |
| **Fase 0 (Pre-lanzamiento)** | ❌ Pendiente | GitBook público, códigos semilla de comunidad y evento de Semilla Genesis pendientes. | `caras.js` (forma SVG de Hongo lista) |
| **Fase 1 (Visual)** | ✅ Completada | Motor SVG dinámico de 7 capas, 6 formas corporales, mecánica Gordo y accesorios PvE de coliseo procedurales. | `SVGEngine.js`, `caras.js`, `accesorios.js` |
| **Fase 2 (Supervivencia)** | ✅ Completada | Energía Nexo y Resistencia de Genos, necesidades Pou, Bazar de consumibles, lluvia de manzanas (Arcade) y decaimiento. Formato abreviado K en el HUD principal, números completos con separador de miles en los detalles del juego, y empaquetador con 4 tamaños fijos de cápsulas (5K, 10K, 25K, 50K EV). | `InventoryManager.js`, `EnergyManager.js`, `MinigameCatch.js`, `ShopManager.js`, `EnergyPackager.js` |
| **Fase 3 (Santuario + Reactor)** | ✅ Completada | Fusión de Genos con mutaciones, corrector de calidad para rarezas "+" y liberación diaria con límites. | `ReactorManager.js`, `SanctuaryManager.js` |
| **Fase 4 (ADN y Linaje)** | 🔄 Parcial | Stats de combate, sistema de calidad S-D y Escáner básico/completo off-chain y on-chain vía MetaMask. Libro de Linaje en blockchain pendiente (es off-chain Supabase). | `RPGManager.js`, `BreedingManager.js`, `genes.js` |
| **Fase 5 (Coliseo)** | 🔄 Parcial | Motor de combate 1v1 y 3v3 con ciclo elemental, STAB x1.20 y defensa mínima. 12 torneos jugables. Válvula de Seguridad actuarial implementada (RPC Supabase + oponente contra-elemental con stats inflados en caso de winrate >50% y balance negativo del pool). PvP en vivo real y ligas POL reales pendientes. | `ColiseumLogic.js`, `ColiseumManager.js`, `ColiseumUI.js`, `AttackCatalog.js` |
| **Fase 6 (Web3 y Becas)** | 🔄 Parcial | Integración real con Polygon Amoy Testnet (MetaMask) para Plaza P2P y Torneos. Privy y Scholarships son simulados (off-chain). | `WalletManager.js`, `MarketManager.js`, `ScholarshipManager.js` |
| **Fase 7 (LiveOps y Torneos)** | 🔄 Parcial | 12 tipos de torneos (2 estándar + 10 temáticos) Sit & Go de fin de semana unificados en una cola de modificador único. Algoritmo de descenso FIFO con bolsa neta (90%), retención (10%), descenso con devolución a saldosPendientes (Pull-over-Push) e inyección de NPCs en brackets. Gen 0.5 y Dashboard RORS pendientes. | `TournamentManager.js`, `DailyLoginManager.js`, `DailyRewardsCatalog.js` |

### 🛠️ Módulos de Producción Validados

* **Completados ✅**:
  * **Motor SVG Dinámico (`SVGEngine.js`)**: 7 capas operacionales con auras de rareza.
  * **Energía y Cuidado (`EnergyManager.js`)**: Energía Nexo (cuenta) y Resistencia (Geno). Necesidades de Hambre, Higiene y Diversión con inmunidad offline. HUD principal muestra EV en formato abreviado K (10 K / 10.4 K) y modales/detalles muestran números completos dot-separados (10.000,45).
  * **Reactor y Santuario (`ReactorManager.js`, `SanctuaryManager.js`)**: Fusión de Genos y liberación con límites diarios (3/día, 48h CD) y recompensas escaladas.
  * **Crianza y ADN (`BreedingManager.js`, `RPGManager.js`)**: Sistema de herencia activa (30%/75%/70%), rango de calidad S-D y Escáner de ADN.
  * **Combate y Coliseo (`ColiseumLogic.js`, `ColiseumManager.js`, `ColiseumUI.js`)**: Combates de 6-9 turnos, ciclo elemental x1.35/x0.75, STAB x1.20 y Defensa DEF. Modos PvE elemental clone, NPC configurable y 3v3.
  * **Torneos Temáticos (`TournamentManager.js`)**: 12 tipos de torneos (2 estándar y 10 temáticos) completamente implementados en código con restricciones de entrada y reglas especiales de combate (sin genes, modo berserker, el espejo, etc.).
  * **Sincronización en la Nube (`CloudManager.js`)**: Autoguardado con debounce y reloj de red Nexo (reparado CORS).
  * **Recompensas Diarias (`DailyLoginManager.js`, `DailyRewardsCatalog.js`)**: Ciclo rotativo de 4 semanas, reclamos asíncronos Supabase RPC.
* **Parciales / Simulados 🔄**:
  * **Wallets Embebidas (`WalletManager.js`)**: Transacciones reales on-chain en Polygon Amoy Testnet para compras en la Plaza de Comercio y torneos cuando se usa MetaMask (`isSimulated = false`). Privy funciona como simulación local de saldo de cortesía (`isSimulated = true`).
  * **Plaza de Comercio P2P (`MarketManager.js`)**: Compra/venta e integración real on-chain con el contrato inteligente `PlazaComercio` bajo MetaMask. Privy simula las transacciones off-chain.
  * **Gestión de Becas (`ScholarshipManager.js`)**: UI y contratos locales de alquiler 70/30 funcionales con NPCs de muestra. Sin smart contracts reales en la blockchain.
* **Pendientes de Implementación ❌**:
  * **Liga Asíncrona PvP Real**: No existe matchmaking real entre jugadores. El Coliseo usa NPCs/clones locales.
  * **Ligas Escalonadas con $POL real**: Bronce a Diamante con entradas y premios reales en blockchain.
  * **Libro de Linaje on-chain**: Los pedigris se guardan off-chain en Supabase.
  * **Gen 0.5 Eventos**: Mecánica de Genos de evento estériles.
  * **Dashboard RORS**: Monitoreo de ratio EV generada/consumida.
  * **Codes de Comunidad**: 500 códigos semilla genesis verificables on-chain.



1. Novedades en V12 — Documento Maestro Definitivo

V12 fusiona la Hoja de Ruta V9.1 con el Sistema de Combate V1.1, el Balance V13.9 y el sistema completo de Torneos Tematicos. Es el documento mas completo del proyecto.



Incorporado de V9.1:

Sistema de Dos Dados: Dado de Privilegio + Dado de Suerte Universal. Los Comunes Anomalia.

Herencia Activa en Breeding: 30% base, 75% alelos identicos, 70% con Dominancia Genetica.

75 genes en 7 categorias. 35 combos sinergicos. Sistema de 3 slots (A cosmetico + B/C funcionales).

Sistema de Calificacion S-D, Plaza de Comercio, Mecanica Gordo, Actualizaciones UX V9.1.



Incorporado del Sistema de Combate V1.1 (nuevo en V12):

Los 4 Slots de Ataque por Geno: Basico / Especial / Buff-Debuff / Definitivo (nivel 25).

Nuevo stat Defensa (DEF): 5to stat. Formula actualizada: max(ATK-DEF, ATK x 0.35).

60 Ataques Especiales: 10 por elemento (6 elementos). Cada elemento tiene 3 Definitivos para fomentar mind games.

8 Genes nuevos de combate (G_COMBAT y G_PROG). 11 Estados de combate documentados.

[V12 NUEVO] Generacion Procedural de Accesorios PvE: rivales del Coliseo equipan hasta 4 accesorios cosmeticos (sombrero, alas, gafas, extras) segun rareza (hasta 85% en Legendarios).

[V12 NUEVO] Limites estrictos de inventario: 99 basicos / 20 consumibles / 1 equipo por slot.



Balance V13.9 — Parche de equilibrio elemental:

[CAMBIO] Multiplicadores elementales suavizados: ventaja x1.35 (+35%), desventaja x0.75 (-25%). Antes: x1.50/x0.50.

[NUEVO] Afinidad Genetica STAB x1.20: +20% de dano si el ataque coincide con el elemento del Geno. Solo aplica a Especiales y Definitivos, no al Basico.

[CAMBIO] Ciclo elemental escrito en positivo: Biomutante > Sintetico > Toxico > Radiactivo > Cibernetico > Viral > Biomutante.

[NUEVO] Matchmaking estricto: 85% vs misma rareza, 15% vs rareza superior (Jefe de liga). Nunca Comun vs Epico.

[NUEVO] Log de combate: estados etiquetados con descripcion y genes/pasivas explicitamente identificados.



Sistema de Torneos Tematicos (Fase 7 expandida):

12 tipos de torneo organizados en 4 categorias: rareza, elemental, progresion y reglas especiales.

Ciclo rotativo de 4 semanas. Ventana de preparacion de 7 dias con descuento en el Laboratorio de Implantes.

3 capas de recompensa: inmediatas (EV), permanentes en blockchain (Libro de Linaje) y estacionales.



2. Resumen Ejecutivo

Proyecto Genos es un juego de crianza tamagotchi con genetica procedural, economia Web3 y combate por turnos. Desarrollado en HTML/JS/CSS como PWA instalable. Fases 1-5 (motor) completadas. Web3 real pendiente.



Fases totales

Genes ocultos

Combos

Ataques especiales

Stats de combate

8 fases (✅ 1-3 completas, ✅ 4-5 motor listo, 🚧 6-7 parciales, ❌ 0 pendiente)

83 genes (75+8 nuevos) — ✅ implementados

35 combos — ✅ definidos en genes.js

60 ataques (10/elemento) — ✅ AttackCatalog.js

5 stats HP/ATK/SPD/LUK/DEF — ✅ implementados



Pixels gano Mejor Juego de Navegador GAM3 2025 con HTML/JS y alcanzo 1M de usuarios diarios generando $20M en revenue. El navegador no es un limite — es la ventaja.



3. Hoja de Ruta V12 — Fases Detalladas

Fase 0 — Go-to-Market y Semilla Genesis ❌ PENDIENTE

4 semanas antes del lanzamiento global. 500 codigos irrevocables. Objetivo Dia 1: 2.000 usuarios.

[ESTADO CODIGO] Ninguno de estos elementos tiene implementacion en el codigo actual.

Genopedia: GitBook publico en genopedia.io. Capitulo 1 completado. Audiencia dual: jugadores e inversores. ❌ No existe.

500 Codigos de Comunidad: criterios 2.000+ seguidores, gaming/web3. No se venden. Verificable on-chain. ❌ No existe sistema de codigos.

Semilla Genesis — El Hongo Fundador: Deep Teal, logo Play en torso SVG. Solo por codigo. Marcador de linaje permanente. ❌ La forma SVG existe en caras.js pero no hay mecanica de codigo de evento.

Slots garantizados en la Semilla: cosmetico 38%, funcional B 92%, funcional C 72%. Ningun slot llega al 100%. ❌ Pendiente.

Scholarship activo desde el Dia 1 (excepcion a Fase 6). Incubacion: el huevo eclosiona en el Dia 1 para todos. 🚧 ScholarshipManager existe pero sin blockchain.

Fase 1 — Infraestructura y Nucleo Visual ✅ COMPLETADA

[ESTADO CODIGO] SVGEngine.js + caras.js + accesorios.js + genes.js + motorGenetico.js. Todo operacional.

Motor SVG Dinamico: 7 capas apiladas. Sombra > Cuerpo > Color > Patron > Ojos > Brillo premium > Aura rareza. ✅ Implementado en SVGEngine.js.

Formas Gen 0: Gota (10%), Frijol (10%), Estrella, Circulo (26.7%), Cuadrado Redondeado (26.7%), Triangulo Redondeado (26.6%). El Hongo solo por codigo. ✅ Implementado.

[V8] Mecanica Gordo (0.1%): probabilidad de que un Nucleo de ADN estandar contenga un Geno Legendario Gen 0. ✅ Implementado.

[V12 NUEVO] Generacion Procedural de Accesorios PvE: los rivales del Coliseo (Torre de Mutacion) equipan hasta 4 accesorios cosmeticos (sombrero, alas, gafas, extras) usando el sistema de Doble Dado. Probabilidad basada en rareza: hasta 85% en Legendarios. Aumenta la diversidad visual en PvE. ✅ Implementado en ColiseumLogic.js.

[V9.1] Laboratorio Morfologico WYSIWYG. Boton Revelar Genes consume Escaner ADN del inventario. Titulo con cian #80deea. ✅ Implementado (laboratorio.html).

Fase 2 — Economia Basica y Supervivencia ✅ COMPLETADA

[ESTADO CODIGO] InventoryManager.js + EnergyManager.js + ArcadeManager.js + ShopManager.js. Todo operacional.

[V12 ACTUALIZADO] Inventario Bolsillos Rotos: 10 slots gratuitos. Expansion hasta 40 con $POL. Limite estricto por slot: 99 basicos / 20 consumibles / 1 equipo. El jugador debe descartar o consumir para liberar espacio. ✅ Implementado.

Modo Arcade Lluvia de Manzanas: 30 segundos, ratio 5:1. Consume 5 de Energía Nexo. ✅ Implementado en ArcadeManager.js + MinigameCatch.js.

Esencia Vital: off-chain. No vendible por $POL. Sin precio externo hasta Fase 6. Fuentes: victorias, minijuegos y cuidado diario pasivo. ✅ Implementado.

[V12 NUEVO] Sistema de Energía Nexo y Resistencia: ✅ Implementado en EnergyManager.js.
- Energía Nexo (Cuenta global): Max 100. Consume 5 en Arcade y 10 en Coliseo. Recupera 1 cada 12 minutos (5/hora).
- Resistencia del Geno (Individual): Max 100. Consume 20 en Coliseo. Recupera 25/hora descansando en el Centro de Cuidado.
- Recuperación Offline: Calcula la regeneración de forma retrospectiva al reconectarse.

[V12 NUEVO] Sistema de Cuidado (Estilo Pou/Tamagotchi): ✅ Implementado en EnergyManager.js y app.js.
- Barras de Necesidades: Hambre (vacía en 12h), Diversión (vacía en 16h), Higiene (vacía en 24h) y Resistencia.
- Cuidado Activo vs Reserva: Los Genos en reserva reducen sus necesidades 5x más despacio.
- Bazar Consumibles: Ración Automática (🍱 costo: 2.00 EV, alimenta y congela Hambre de reservas por 24h) y Ducha de Plasma (🧼 costo: 1.00 EV, limpia Higiene al 100% de todos). ✅ En ShopManager.js.
- Interacciones y Cosecha: Caricias, limpieza, moneda flotante de EV pasiva. ✅ Implementado.
- Decaimiento por Negligencia (Amistad): Huelga > 24h = -1 Amistad/hora. ✅ Implementado.
- Impactos en Combate: "Estado Óptimo" (necesidades >80%) otorga +25 LUK (+5% crítico) y genera EV. "Huelga" (necesidades <20%) impide que el Geno luche en el Coliseo. ✅ Implementado.

Fase 3 — El Santuario y el Reactor Genetico ✅ COMPLETADA

[ESTADO CODIGO] SanctuaryManager.js (V10.3) + ReactorManager.js (V15.33). Ambos modulos completamente operacionales.

Santuario: liberar (no destruir). 3 liberaciones/dia max. Cooldown 48h desde nacimiento. Recompensa escalada por rareza. ✅ Implementado.



Nivel

Exito Normal

Mutacion Estancada

Colapso

Exito Critico

Nv.1 Comun > Raro

35%

35% (Comun+)

27%

3% (Epico)

Nv.2 Raro > Epico

25%

35% (Raro+)

39.5%

0.5% (Legendario)

Nv.3 Epico > Leg.

5%

40% (Epico+)

54.9%

0.1% (Mitico)

Fase 4 — ADN, Asimetria de Mercado y Linaje 🔄 PARCIAL

[ESTADO CODIGO] RPGManager.js + BreedingManager.js + genes.js. Motor off-chain y on-chain (MetaMask en Amoy Testnet para exportar) completamente funcional. Supabase como backend. El Libro de Linaje on-chain permanece off-chain.

5 stats: Vitalidad HP, Fuerza ATK, Agilidad SPD, Suerte LUK, Defensa DEF (V10). ✅ Implementados con rangos por rareza.

Sistema S-D: pureza de IVs. Un Comun S puede valer mas que un Legendario D. ✅ Implementado en RPGManager.js (calcularCalidad).

Escaner ADN: Basico (slots activos) | Completo (genes exactos + tabla Dominante/Recesivo). ✅ Implementado en RPGManager.js con dos botones.

Libro de Linaje en blockchain. Breeding: 7 crias max. Herencia Activa V9.1. ✅ Breeding implementado. ❌ Libro de Linaje on-chain pendiente (solo off-chain Supabase).

Fase 5 — El Coliseo y Maestria Elemental 🔄 PARCIAL

[ESTADO CODIGO] ColiseumLogic.js + ColiseumManager.js + ColiseumUI.js + AttackCatalog.js. Motor de combate y torneos completamente operacional en 1v1 y 3v3. Matchmaking real PvP asíncrono y Ligas escalonadas con $POL real permanecen como simulaciones.

6 elementos con ventaja/desventaja (x1.35/x0.75), STAB (x1.20) y efectos pasivos propios. ✅ Implementado.

4 Slots de ataque: Basico / Especial / Buff-Debuff / 3 Definitivos a elegir (nivel 25). ✅ Implementado.

Nuevo stat DEF: combates de 6-9 turnos. Formula actualizada con minimo 35% ATK. ✅ Implementado.

3 modos en codigo: 'clon' (clon elemental PvE), 'desafio' (NPC configurable), '3v3'. ✅ Implementados.
🚧 Liga Asincrona PvP real entre jugadores: NO implementada. Matchmaking local con NPCs.
🚧 Torre de Mutacion como modo PvE estructurado con brackets: Parcial (modo 'desafio' con NPCs).

Sistema IFTTT de defensa offline. Modo Tactico vs Simulacion Rapida. ✅ IFTTT implementado en ColiseumLogic.js (evaluarCondicionIFTTT + resolverAccionIFTTT).

Ligas escalonadas: Bronce ($0.10) a Diamante ($10). Top 3: x1.8 / x1.0 / x0.6. ❌ NO implementadas con $POL real. Solo Copa Neon y Copa Satelite en TournamentManager.js.

Torneos de Llaves: ✅ Copa Neon Nexo ($1.0 EV, premios 9/3.6/1.8) y Copa Satelite ($0.5 EV, premios 4.5/1.8/0.9). Sistema FIFO con bots NPCs funcional.

Fase 6 — Expansion Web3 y Becas 🔄 PARCIAL

[ESTADO CODIGO] WalletManager.js + MarketManager.js + ScholarshipManager.js. Conexión dual implementada: transacciones reales on-chain en la testnet Polygon Amoy para la Plaza de Comercio y Torneos de Llaves con MetaMask (isSimulated = false), y simulación local con Privy (isSimulated = true). El sistema de Becas y el registro NFT permanecen simulados localmente sin smart contracts.

Peg al Dolar: precios fijos en USD. $POL como vehiculo de pago. 🚧 Logica de precios fijos implementada. $POL simulado localmente.

Plaza de Comercio P2P. Comision 2%-5% por transaccion en $POL. 🚧 UI implementada en MarketManager.js. Realtime Supabase para notificaciones. Sin blockchain real.

Registro NFT: <$3 para convertir Geno en NFT. Libro de Linaje migra on-chain. ❌ No implementado. Solo UI de wallet (MetaMask connect).

Scholarships 70/30 via smart contract. Periodo de prueba 7 dias cancelable. 🚧 UI implementada en ScholarshipManager.js con Genos NPC de muestra. Sin smart contracts reales.

Fase 7 — LiveOps y Torneos Tematicos 🔄 PARCIAL

[ESTADO CODIGO] TournamentManager.js + ColiseumLogic.js. Los 12 tipos de torneos (2 estándar y 10 temáticos) están completamente implementados y son funcionales con sus respectivas reglas de combate y restricciones en el cliente. Gen 0.5 y el Dashboard RORS permanecen pendientes.

Gen 0.5: Genos esteriles de evento irrepetibles. Un nuevo Gen 0.5 cada 6-8 semanas. ❌ No implementado.

Torneos Tematicos: 12 tipos, ciclo rotativo de 4 semanas. Ver Seccion 8 para el sistema completo.
🚧 IMPLEMENTADOS en TournamentManager.js: Copa Neon Nexo + Copa Satelite (2 de 12).
❌ PENDIENTES: Solo Comunes, Copa Raro, El Olimpo, Liga Elemental Pura, Torneo Inverso, Copa Dos Mundos, Liga Novatos, El Gran Linaje, Torneo Sin Genes, Modo Berserker, El Espejo, Torneo del Fundador.

Dashboard RORS: ratio EV generada/consumida. Objetivo >= 0.70. Alarma <0.65. ❌ No implementado.





4. ADN, Stats y Sistema de Progresion

4.1 Los 5 Stats de Combate — Tabla V12

Rareza

HP Vitalidad

ATK Fuerza

SPD Agilidad

LUK Suerte

DEF Defensa

Comun

35 - 55

10 - 22

8 - 25

5 - 15

6 - 14

Raro

50 - 75

18 - 35

15 - 40

10 - 25

12 - 22

Epico

70 - 100

28 - 50

25 - 55

20 - 35

18 - 32

Legendario

95 - 130

40 - 70

35 - 80

30 - 50

26 - 45

Mitico

120 - 160

60 - 100

50 - 110

45 - 70

38 - 62



4.2 Sistema de Calificacion Genetica S-D

Rango

Pureza

Color UI

Efecto Visual

Significado

S

95-100%

Oro / Brillo neon

Aura dorada pulsante

Perfeccion. Maximo valor de reventa.

A

80-94%

Cian Nexo

Aura cian sutil

Elite competitiva. Genetica superior.

B

50-79%

Verde

Sin aura extra

Estandar. Genetica saludable.

C

20-49%

Naranja

Sin aura

Potencial bajo. Candidato al Reactor.

D

0-19%

Rojo

Sin aura

Defectuoso. Candidato al Santuario.



4.3 Breeding — Herencia Activa V9.1

Escenario

Probabilidad

Descripcion

Un padre tiene el gen, el otro no

30% base

El gen puede desaparecer en esa cria.

Ambos padres con el MISMO gen (alelos identicos)

75%

El metodo optimo de los breeders serios.

Un padre con Dominancia Genetica activo

70% dominante

70% de herencia independiente del otro padre.

Herencia fallida

Dados universales

Posible mutacion aleatoria — puede salir un gen nuevo.





## 5. El Coliseo — Sistema de Combate 1v1 y 3v3 (V12)

El Coliseo de Proyecto Genos es un sistema de combate por turnos por equipos con 5 stats, 6 elementos, 60 ataques especiales, 11 estados y dos modos de juego (1v1 y 3v3). Todo el sistema esta disenado para que la estrategia del jugador importe mas que la rareza del Geno.



Stats de combate

Elementos

Ataques especiales

Estados de combate

Modos de combate

5 (HP/ATK/SPD/LUK/DEF)

6 (con ciclo circular)

60 (10 por elemento)

11 documentados

1v1 y 3v3



1.1 Los 5 Stats de Combate

Rareza

HP Vitalidad

ATK Fuerza

SPD Agilidad

LUK Suerte

DEF Defensa

Comun

35-55

10-22

8-25

5-15

6-14

Raro

50-75

18-35

15-40

10-25

12-22

Epico

70-100

28-50

25-55

20-35

18-32

Legendario

95-130

40-70

35-80

30-50

26-45

Mitico

120-160

60-100

50-110

45-70

38-62



1.2 Formula de Dano — V12

// Formula base (todos los ataques fisicos):

dano_efectivo = max(ATK_atacante - DEF_defensor,  ATK_atacante x 0.35)

// El minimo 35% garantiza que ningun combate sea infinito contra Tanks



// Formula completa con multiplicadores:

dano_final = dano_efectivo x mult_elemental x stab x mult_critico



// Ataques Especiales Perforantes: ignoran 50% de DEF

// Ataques Definitivos Perforantes: ignoran 65% de DEF

// Con gene Postura Inquebrantable activo: cualquier perforante solo ignora 20% DEF



Ejemplo practico: Comun ATK=15 vs Comun DEF=10. Dano = max(5, 15x0.35) = max(5, 5.25) = 5.25. Con HP=45 el combate dura ~9 turnos. Sin DEF duraba 3 turnos.



1.3 Los 4 Slots de Ataque por Geno

Slot

Tipo

Acceso

Descripcion y reglas

1

Ataque Basico

Siempre activo

Dano puro basado en ATK. Sin STAB ni bonus elemental. Formula: max(ATK-DEF, ATK x 0.35).

2

Ataque Especial

Desde nivel 1

Propio elemento gratis. Adyacentes +20% EV. Contrarios solo basicos +40% EV. Recibe STAB si coincide con el elemento.

3

Buff / Debuff / Estado

Desde nivel 1

Cualquier movimiento de soporte, control o estado. Sin restriccion de elemento.

4

Definitivo (1 de 3)

Desbloquea nivel 25

El jugador elige 1 de los 3 Definitivos de su propio elemento. 1 uso por combate. Nunca de otro elemento. Recibe STAB.



Coste de aprendizaje en el Laboratorio de Implantes (Fase 5): Basico ~10 EV | Intermedio ~25 EV | Avanzado ~50 EV | Definitivo ~100 EV.

Los ataques se pueden olvidar y reensenar libremente pagando el coste en EV.

### 5.1 Los 6 Elementos y Multiplicadores de Daño

Elemento

Fuerte vs

Debil vs

Efecto Pasivo

Biomutante

Sintetico

Viral

Regeneracion: +3% HP/turno

Viral

Biomutante

Cibernetico

Contagio: 5% chance reducir stat rival

Cibernetico

Viral

Radiactivo

Escudo: absorbe 10% del primer golpe

Radiactivo

Cibernetico

Toxico

Quemadura: 2% HP rival durante 3 turnos

Toxico

Radiactivo

Sintetico

Debilitacion: reduce Fuerza rival

Sintetico

Toxico

Biomutante

Precision: +15% prob. golpe critico



Ciclo (positivo): Biomutante > Sintetico > Toxico > Radiactivo > Cibernetico > Viral > Biomutante



Situacion

Multiplicador V12

Antes V10.0

Aplicacion

Ventaja elemental

x1.35 (+35%)

x1.50

Especiales y Definitivos con ventaja.

Neutro

x1.00

x1.00

Sin ventaja ni desventaja.

Desventaja elemental

x0.75 (-25%)

x0.50

Permite remontar con estrategia.

STAB (Afinidad Genetica)

x1.20 (+20%)

No existia

Solo Especiales y Definitivos del propio elemento.

Critico

x1.50

x1.50

LUK% + bonuses activos.



El STAB fomenta la especializacion: un Viral que usa solo ataques Virales hace x1.20 mas dano en cada uno. La decision de aprender ataques de otros elementos tiene coste de oportunidad real.

### 5.2 Catálogo de 60 Ataques Especiales — 10 por Elemento

Cada elemento tiene: 1 Basico + 3 Especiales + 3 Soportes + 3 Definitivos. El jugador elige 1 Definitivo para el Slot 4. Los 3 Definitivos por elemento crean mind games: el rival no sabe cual vas a usar. El Basico no recibe STAB ni bonus elemental.



Biomutante — Sustentacion y resiliencia

💚 Pulso Vital  [Basico]

El ataque base. Siempre disponible.

Efecto: Dano fisico puro. Sin STAB ni bonus elemental.

Potencia: 85% ATK  |  Precision: 100%  |  Usos: Ilimitado

🌿 Espinas Oseas  [Especial]

Counter contra Cibernetico y builds Tank.

Efecto: Ignora el 30% de la DEF del rival. STAB activo.

Potencia: 95% ATK  |  Precision: 95%  |  Usos: 5/combate

💥 Oleada Mutante  [Especial]

La apuesta ofensiva maxima. 85% precision es el riesgo.

Efecto: Dano: 130% ATK. STAB activo.

Potencia: 130% ATK  |  Precision: 85%  |  Usos: 4/combate

⚡ Transferencia de Carga  [Especial]

Con HP al 100% hace 90% ATK. La build Tank siempre rinde al maximo.

Efecto: 60% base + 1% por cada % de HP propio sobre el 70%. Max: 90% ATK. STAB activo.

Potencia: 60-90% ATK  |  Precision: 100%  |  Usos: Ilimitado

🌸 Espora Curativa  [Soporte]

El ataque defensivo central del elemento.

Efecto: Curacion inmediata: +20% HP propio.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 3/combate

🛡️ Membrana Fortalecida  [Soporte]

En un Geno con DEF alta crea una barrera casi impenetrable.

Efecto: Escudo: absorbe hasta 25% del ATK rival durante 2 turnos. Se suma a la DEF base.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

🌿 Raiz Enredadora  [Soporte]

El Biomutante lento hace que el rival tambien lo sea.

Efecto: Estado Enredado: rival SPD -40% durante 2 turnos. Solo puede usar ataques de dano.

Potencia: 40% ATK  |  Precision: 100%  |  Usos: 3/combate

💪 Frenesia Organica  [Soporte]

Hipercrecimiento celular. Sacrifica flexibilidad por potencia.

Efecto: Propio ATK +35% durante 3 turnos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 1/combate

🌟 Gran Regeneracion  [DEFINITIVO]

El Definitivo de supervivencia. Elegirlo dice al rival que vas a resistir.

Efecto: Curacion: +50% HP. Dano: 60% ATK. STAB activo.

Potencia: +50% HP + 60% ATK  |  Precision: 100%  |  Usos: 1/combate elegible

🌟 Ira de la Naturaleza  [DEFINITIVO]

El Definitivo anti-Tank del Biomutante. Destroza DEF extrema.

Efecto: Ignora el 65% de la DEF del rival. STAB activo.

Potencia: 130% ATK perforante (65% DEF)  |  Precision: 100%  |  Usos: 1/combate elegible

🌟 Esporas Drenantes  [DEFINITIVO]

El mas versatil de los tres: dano + curacion + control.

Efecto: Dano: 80% ATK. Curacion: 20% HP propio. Estado Enredado al rival. STAB activo.

Potencia: 80% ATK  |  Precision: 100%  |  Usos: 1/combate elegible



Viral — Control y deterioro

🦠 Descarga Viral  [Basico]

Construye presion acumulada.

Efecto: 80% ATK. 25% prob. Infeccion. Sin STAB ni bonus elemental.

Potencia: 80% ATK  |  Precision: 100%  |  Usos: Ilimitado

🦠 Infeccion Aguda  [Especial]

Contra un Glass Cannon, este debuff es devastador.

Efecto: 30% ATK. Estado garantizado: stat mas alto rival -20% por 3 turnos. STAB.

Potencia: 30% ATK  |  Precision: 100%  |  Usos: 4/combate

💀 Disolucion Celular  [Especial]

La recompensa a mantener multiples estados.

Efecto: 100% ATK + 20% por cada estado activo (max 160%). STAB.

Potencia: 100%+20%/estado  |  Precision: 90%  |  Usos: Ilimitado

🧫 Proliferacion  [Especial]

El ritmo viral.

Efecto: 70% ATK. Si rival tiene Infeccion: 140% ATK + duracion +1. STAB.

Potencia: 70% / 140%  |  Precision: 100%  |  Usos: Ilimitado

🌫️ Niebla Viral  [Soporte]

Counter contra Sintetico que depende de criticos.

Efecto: Vision Nublada: precision rival -25% durante 2 turnos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

⚡ Adaptacion Viral  [Soporte]

El setup fundamental del Viral.

Efecto: Propio SPD +30% durante 3 turnos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

💉 Cepa Parasita  [Soporte]

El ataque viral con curacion.

Efecto: Dano: 70% ATK. Curacion: 30% del dano.

Potencia: 70% ATK  |  Precision: 95%  |  Usos: Ilimitado

🦠 Evasion Viral  [Soporte]

Util contra Sobrecarga activa del rival.

Efecto: 60% de probabilidad de evadir el siguiente ataque.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 3/combate

☠️ Pandemia Global  [DEFINITIVO]

Puede aplicar 3 Infecciones en un turno.

Efecto: 3 golpes. 80% prob. Infeccion por golpe. STAB.

Potencia: 40% ATK x3 golpes  |  Precision: 100%  |  Usos: 1/combate elegible

☠️ Asimilacion Celular  [DEFINITIVO]

Drena y debilita en un movimiento.

Efecto: Roba 25% HP rival. Corrosion: ATK rival -15% permanente. STAB.

Potencia: 100% ATK  |  Precision: 100%  |  Usos: 1/combate elegible

☠️ Falla Genetica  [DEFINITIVO]

El Definitivo de control absoluto.

Efecto: Paraliza 1 turno al rival. ATK rival -30% por 3 turnos. STAB.

Potencia: Sin dano (control)  |  Precision: 100%  |  Usos: 1/combate elegible



Cibernetico — Precision y escudos

🔵 Laser de Precision  [Basico]

Nunca falla.

Efecto: 100% precision. Sin STAB ni bonus elemental.

Potencia: 75% ATK  |  Precision: 100%  |  Usos: Ilimitado

🔵 Descarga en Cadena  [Especial]

Erosiona DEF alta mejor que un golpe unico.

Efecto: 3 golpes de 35% ATK. Cada golpe calcula DEF por separado. STAB.

Potencia: 3x35%=105%  |  Precision: 95% c/golpe  |  Usos: Ilimitado

💥 Disparo Perforante  [Especial]

Hard counter contra el meta Tank.

Efecto: Ignora el 50% de la DEF y todos los escudos. STAB.

Potencia: 110% ATK (ignora 50% DEF)  |  Precision: 90%  |  Usos: 3/combate

⚡ Contrarrestar  [Especial]

Con DEF alta, el rival hace poco dano. Devolver el 40% es sostenible.

Efecto: Condicion: rival ataco el turno anterior. Devuelve 40%. STAB.

Potencia: 40% dano recibido  |  Precision: 100%  |  Usos: Ilimitado

🛡️ Protocolo de Escudo  [Soporte]

Combinado con DEF base y pasivo, el primer golpe casi desaparece.

Efecto: Escudo: absorbe hasta 35% del ATK rival durante 3 turnos. Se suma a DEF base.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

📡 Interferencia Electromagnetica  [Soporte]

Hard counter contra Frenesia Organica y Aceleracion Sintetica.

Efecto: Elimina TODOS los buffs activos del rival.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

⚙️ Sobrecarga del Sistema  [Soporte]

Con DEF alta el HP perdido es tolerable.

Efecto: Propio ATK +50% durante 2 turnos. Coste: -8% HP/turno activo.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

🔧 Recalibrado Rapido  [Soporte]

Setup para garantizar que los Definitivos conecten.

Efecto: Propio SPD +25%. Siguiente ataque con 100% precision.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 3/combate

❄️ Colapso del Sistema  [DEFINITIVO]

Dano + control simultaneo.

Efecto: Ignora 65% DEF. 60% prob. Paralisis al rival. STAB.

Potencia: 110% ATK (ignora 65% DEF)  |  Precision: 95%  |  Usos: 1/combate elegible

❄️ Canon Orbital  [DEFINITIVO]

El Definitivo de maximo dano puro.

Efecto: Si acierta (85%): Critico garantizado. STAB. Efectivo: 140x1.5x1.20=252% ATK.

Potencia: 140% ATK  |  Precision: 85%  |  Usos: 1/combate elegible

❄️ Matriz de Sobrecarga  [DEFINITIVO]

Maximo poder con coste propio. El mas arriesgado.

Efecto: Dano devastador. El usuario sufre Sobrecarga: -8% HP/turno durante 2 turnos. STAB.

Potencia: 180% ATK  |  Precision: 100%  |  Usos: 1/combate elegible



Radiactivo — DoT y presion acumulativa

☢️ Proyectil Radiactivo  [Basico]

Construye presion continua.

Efecto: 85% ATK. 30% prob. Quemadura. Sin STAB ni bonus elemental.

Potencia: 85% ATK  |  Precision: 100%  |  Usos: Ilimitado

💥 Explosion Nuclear  [Especial]

Requiere setup previo. Ya no supera el dano de un Definitivo.

Efecto: 100% ATK. Con Quemadura activa: 135% ATK (nerf de V12). STAB. [NERFADO: antes 140/175]

Potencia: 100% / 135% con Quemadura  |  Precision: 80%  |  Usos: 3/combate

☢️ Lluvia de Cenizas  [Especial]

Hace dano y debilita al mismo tiempo.

Efecto: 70% ATK. Rival precision -20% durante 2 turnos. STAB.

Potencia: 70% ATK  |  Precision: 100%  |  Usos: Ilimitado

💫 Pulso de Decaimiento  [Especial]

Counter especifico contra Lucky Strike y Sintetico.

Efecto: 60% ATK. Rival LUK -40% durante 3 turnos. STAB.

Potencia: 60% ATK  |  Precision: 95%  |  Usos: 4/combate

🌋 Campo Radioactivo  [Soporte]

En 7+ turnos los -15% HP totales son significativos.

Efecto: Estado Campo Radiactivo: rival -5% HP/turno durante 3 turnos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

🔥 Irradiacion  [Soporte]

Con DEF activa, reducir el ATK rival puede hacerlo incapaz de superar la DEF.

Efecto: 25% ATK. Rival ATK -25% durante 3 turnos.

Potencia: 25% ATK  |  Precision: 100%  |  Usos: 3/combate

🔥 Nucleo Ardiente  [Soporte]

En 2 turnos amplificados suma -10% HP extra.

Efecto: El pasivo de Quemadura sube de 2% a 5% HP/turno durante 2 turnos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

💣 Autoirradiacion  [Soporte]

El sacrificio calculado. Ideal para preparar Explosion Nuclear.

Efecto: Coste: -12% HP propio. Siguiente ataque +60% potencia adicional.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

☢️ Critico Nuclear  [DEFINITIVO]

Dano inmediato + DoT continuo.

Efecto: Gran dano. Envuelve al rival en Campo Radiactivo (-5%/turno). STAB.

Potencia: 120% ATK  |  Precision: 100%  |  Usos: 1/combate elegible

☢️ Fision Inestable  [DEFINITIVO]

Para cerrar el combate en un turno. Riesgo propio.

Efecto: Dano masivo. El usuario sufre Quemadura propia (-3%/turno). STAB.

Potencia: 160% ATK  |  Precision: 80%  |  Usos: 1/combate elegible

☢️ Desintegracion Atomica  [DEFINITIVO]

El Definitivo anti-Tank del Radiactivo.

Efecto: Ignora 65% DEF. Aplica Irradiacion al rival (ATK -25%). STAB.

Potencia: 95% ATK (ignora 65% DEF)  |  Precision: 100%  |  Usos: 1/combate elegible



Toxico — Veneno y corrosion permanente

🐍 Colmillo Venenoso  [Basico]

Construye el estado central del elemento.

Efecto: 80% ATK. 35% prob. Veneno (unico estado que apila). Sin STAB ni bonus.

Potencia: 80% ATK  |  Precision: 100%  |  Usos: Ilimitado

💀 Veneno Mortal  [Especial]

Con Concentrar Veneno: -16%/turno durante 4 turnos.

Efecto: Estado Veneno Mortal garantizado: -8% HP/turno durante 2 turnos. STAB.

Potencia: 40% ATK  |  Precision: 100%  |  Usos: 3/combate

⚗️ Corrosion de Acido  [Especial]

El debuff mas peligroso del juego. Con DEF activa es devastador.

Efecto: 50% ATK. Corrosion: ATK rival -15% permanente (max x3 = -45%). STAB.

Potencia: 50% ATK  |  Precision: 100%  |  Usos: 3 usos max

🎯 Espina Toxica  [Especial]

Aplica veneno antes de que el rival pueda curarse.

Efecto: 65% ATK. Prioridad +1. 25% prob. Veneno. STAB.

Potencia: 65% ATK  |  Precision: 100%  |  Usos: Ilimitado

🌫️ Nube Toxica  [Soporte]

Debuff doble en un movimiento.

Efecto: Rival ATK -20% y SPD -15% durante 2 turnos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

🛡️ Inmunizacion Toxica  [Soporte]

Setup defensivo + ofensivo en un movimiento.

Efecto: Propio: inmune a estados negativos 2 turnos. Ataques de veneno +20% dano.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 1/combate

💧 Drenaje de Esencia  [Soporte]

La version Toxica del drenaje.

Efecto: 65% ATK. Curacion: 25% del dano. 20% prob. Veneno.

Potencia: 65% ATK  |  Precision: 100%  |  Usos: Ilimitado

🎯 Concentrar Veneno  [Soporte]

Setup que transforma -8% x2 en -16% x4.

Efecto: El siguiente Veneno tiene el doble de intensidad y duracion.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 3/combate

☠️ Plaga Final  [DEFINITIVO]

El Definitivo de maximo dano condicional.

Efecto: 60% ATK base + 40% por cada estado activo en el rival. STAB. Con 3 estados: 180% ATK.

Potencia: 60%+40% por estado  |  Precision: 95%  |  Usos: 1/combate elegible

☠️ Lluvia Acida  [DEFINITIVO]

Puede apilar hasta 4 stacks de Veneno en un turno.

Efecto: 4 impactos. 50% prob. Veneno Fuerte por golpe. STAB.

Potencia: 30% ATK x4 golpes  |  Precision: 100%  |  Usos: 1/combate elegible

☠️ Niebla Asfixiante  [DEFINITIVO]

El Definitivo de control. Debilita precision y velocidad simultaneamente.

Efecto: Vision Nublada (precision -25%) y SPD rival -30%. STAB.

Potencia: 75% ATK  |  Precision: 100%  |  Usos: 1/combate elegible



Sintetico — Velocidad y criticos

⚡ Rafaga Sintetica  [Basico]

Aprovecha el pasivo de critico.

Efecto: 85% ATK. Critico: LUK%+15% del pasivo. Sin STAB ni bonus elemental.

Potencia: 85% ATK  |  Precision: 100%  |  Usos: Ilimitado

🎯 Golpe Certero  [Especial]

Supera a muchos ataques de mayor potencia base.

Efecto: Critico garantizado (x1.5). Con STAB: 90% x 1.20 = 108% ATK efectivo.

Potencia: 60% = 90% efectivo  |  Precision: 100%  |  Usos: Ilimitado

💥 Impacto Total  [Especial]

Recompensa la ventaja de SPD.

Efecto: Si actuo primero este turno: 150% ATK. Si no: 70% ATK. STAB.

Potencia: 150% / 70%  |  Precision: 95%  |  Usos: Ilimitado

⚡ Ataque Relampago  [Especial]

Para rematar rivales con poca vida.

Efecto: Prioridad +2. Siempre actua antes que cualquier otro movimiento. STAB.

Potencia: 55% ATK  |  Precision: 100%  |  Usos: Ilimitado

💉 Golpe Paralizante  [Soporte]

El control del Sintetico.

Efecto: 70% ATK. 40% prob. Paralisis (SPD -35%, 30% perder turno).

Potencia: 70% ATK  |  Precision: 100%  |  Usos: 4/combate

⚡ Aceleracion Sintetica  [Soporte]

El setup central de toda estrategia Sintetica.

Efecto: Propio SPD +45% durante 3 turnos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

🎯 Potenciador de Critico  [Soporte]

Combinado con Tormenta de Criticos puede critear todos los golpes.

Efecto: Propio LUK efectiva +50% durante 2 turnos para calcular criticos.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 2/combate

👁️ Esquiva Calculada  [Soporte]

En 7+ turnos puede evadir 2-3 veces.

Efecto: Evasion siguiente ataque: 75%. Si evade: SPD +10%.

Potencia: Sin dano  |  Precision: 100%  |  Usos: 3/combate

⚡ Tormenta de Criticos  [DEFINITIVO]

El Definitivo mas explosivo.

Efecto: 5 golpes de 25% ATK. Critico: LUK%+20%. STAB. Max si todos critan: 225% ATK.

Potencia: 25% ATK x5 golpes  |  Precision: 90% c/golpe  |  Usos: 1/combate elegible

⚡ Aceleracion Cuantica  [DEFINITIVO]

El Definitivo de momentum. Pega fuerte y se acelera.

Efecto: 85% ATK. El usuario recibe +50% SPD y +50% ATK durante 2 turnos. STAB.

Potencia: 85% ATK  |  Precision: 100%  |  Usos: 1/combate elegible

⚡ Impacto Prisma  [DEFINITIVO]

Con Aceleracion Cuantica activa es devastador.

Efecto: Si el usuario actua primero: 150% ATK. Si no: 90% ATK. STAB.

Potencia: 150% ATK  |  Precision: 90%  |  Usos: 1/combate elegible

### 5.3 Los 11 Estados de Combate

Los estados son el corazon de la profundidad tactica del Coliseo. Con combates de 6-9 turnos, los estados aplicados en turno 1 tienen tiempo de impactar completamente.



Estado

Origen

Efecto

Regla de acumulacion / duracion

Regeneracion

Biomutante

HP propio +X%/turno

Techo: max +15% HP/turno. Multiples fuentes se acumulan hasta el tope.

Infeccion

Viral

Stat aleatorio rival -10-20% X turnos

Max 3 infecciones activas. Cada una puede apuntar a un stat diferente.

Quemadura

Radiactivo

HP rival -X%/turno X turnos

Nueva aplicacion extiende duracion, no intensidad.

Veneno

Toxico

HP rival -X%/turno X turnos

UNICO estado que apila en intensidad. Hasta 3 stacks activos simultaneos.

Paralisis

Sintetico

SPD rival -35%, 30% perder turno

Solo 1 instancia. Dura 2 turnos.

Congelacion

Cibernetico

Rival pierde 1 turno completo

No acumulable. Inmunidad 2 turnos tras recuperarse.

Vision Nublada

Viral / Radiactivo

Precision rival -25%

Acumula hasta -45% de dos fuentes.

Enredado

Biomutante

SPD -40%, solo ataques de dano

No acumulable. Dura 2 turnos. BLOQUEA el cambio voluntario de Geno en 3v3.

Corrosion

Toxico

ATK rival -15% PERMANENTE

No removible. Acumula hasta x3 (-45% ATK total). El mas peligroso del juego.

Campo Radiactivo

Radiactivo

HP rival -5%/turno x3 turnos

Coexiste con todos los estados.

Irradiacion

Radiactivo

ATK rival -25% x3 turnos

Removible. Diferente a Corrosion.



En 3v3: los estados NO se transfieren al Geno de relevo. Cuando el Geno entrante llega, llega sin estados negativos activos. El Veneno, la Paralisis, la Quemadura quedan con el Geno que los tenia. Excepcion: la Corrosion de ATK del rival es permanente y afecta a todos los Genos del equipo rival.

### 5.4 Sistema de Combate 1v1 y Configuración IFTTT

5.1 Modos de Juego 1v1

Liga Asincrona PvP: duelos contra la IA defensora del rival configurada con IFTTT. Sin conexion simultanea. El motor resuelve el combate automaticamente. El jugador ve el resultado y el replay al dia siguiente.

Torneos de Llaves: eliminatorios de 16 jugadores cada 2 semanas. Entrada en $POL. El mayor ingreso competitivo directo del 1v1.

Torre de Mutacion PvE: supervivencia contra oleadas de rivales generados proceduralmente. Coste en manzanas (sink Arcade), premio en EV.



5.2 Sistema IFTTT de Defensa Offline

Panel visual sin codigo para programar la IA del Geno cuando defiende offline. El jugador que mejor configura su IFTTT gana aunque tenga stats ligeramente inferiores.



Condicion SI

Accion ENTONCES

Razonamiento estrategico

SI rival.elemento == Cibernetico

USAR Espinas Oseas

El Cibernetico tiene DEF alta. Los semi-perforantes son clave.

SI rival tiene Infeccion activa

USAR Proliferacion (140% ATK)

Solo usar cuando la condicion de dano doble se cumple.

SI propio HP < 30%

USAR Definitivo (Slot 4)

Guardar el Definitivo para el momento critico.

SI rival usa buff de ATK

USAR Interferencia Electromagnetica

Cancelar Frenesia Organica antes de que haga dano.

SI turno == 1

USAR Infeccion Aguda

Aplicar debuff garantizado desde el primer turno.

SI propio buff SPD activo

USAR Impacto Total

Solo cuando SPD garantiza actuar primero para el 150%.



5.3 Matchmaking Estricto V13.9

Rareza

Rival predominante (85%)

Jefe de liga (15%) + bonus XP

Comun

vs Comunes

vs Raros. NUNCA vs Epico o superior.

Raro

vs Raros

vs Epicos. NUNCA vs Legendario.

Epico

vs Epicos

vs Legendarios.

Legendario

vs Legendarios

vs Miticos (si existen).



5.4 Ligas Escalonadas 1v1

Liga

Requisito

Entrada

1er Premio

Top 3

Bronce

Sin requisito (F2P)

$0.10

$0.18

x1.8 / x1.0 / x0.6

Plata

Nivel 20+

$0.50

$0.90

x1.8 / x1.0 / x0.6

Oro

Rareza Raro+

$2.00

$3.60

x1.8 / x1.0 / x0.6

Diamante

Epico o Legendario

$10.00

$18.00

x1.8 / x1.0 / x0.6

### 5.5 Sistema de Combate 3v3 por Equipos

El 3v3 NO reemplaza el 1v1. Es un modo paralelo con su propia liga, sus propios premios y sus propias reglas estrategicas. Usa exactamente el mismo motor de combate, los mismos ataques, los mismos genes y el mismo IFTTT. La novedad es la estrategia de equipo.



6.1 Estructura del Equipo

Regla

Nombre

Descripcion

1

Seleccion de 3 Genos

Exactamente 3 Genos de la coleccion. Cualquier rareza, elemento o nivel. Mixtos permitidos.

2

Orden de entrada fijo

Geno 1 (abre), Geno 2 (relevo), Geno 3 (cierre). Inmutable en modo asincronico.

3

Ataques fijos por Geno

Cada Geno lleva sus 4 ataques habituales. No se cambian entre combates del mismo torneo.

4

IFTTT de equipo

Ademas del IFTTT individual, existe el IFTTT de cambio: SI propio HP < 20% Y Geno 2 disponible > CAMBIAR a Geno 2.



6.2 Clasificacion de Liga en 3v3

La liga del equipo se determina por la rareza del Geno MAS ALTO del equipo.

Un equipo Comun+Raro+Epico va a la liga de Epicos, no a la de Comunes.

Un Geno no puede estar en dos torneos activos simultaneamente. Para jugar 1v1 y 3v3 al mismo tiempo se necesitan 6 Genos distintos.

Acceso al 3v3: haber completado al menos 10 combates en la Liga 1v1 activa.



6.3 Los 4 Arquetipos de Equipo

Arquetipo

Composicion

Ventaja

Riesgo

Elemental Puro

3 Genos del mismo elemento. STAB activo en todos.

Maxima consistencia elemental. Con CLAN_R en los 3: +8% ATK desde turno 1.

Sin cobertura elemental. Un rival del elemento dominante arrasa.

Triangulo

3 elementos que cubren debilidades entre si. Ej: Bio + Cib + Tox.

Nunca hay una debilidad elemental total del equipo.

Mas complejo de configurar el IFTTT de cambio.

Sacrificio

Geno 1: Escudo de Karma. Geno 2: control/estados. Geno 3: Glass Cannon.

El rival llega herido al Glass Cannon tras caer el Geno 1.

Perder el Geno 1 demasiado rapido sin activar el karma.

Clan

Los 3 Genos tienen Resonancia de Clan activo.

CLAN_R activo en los 3: +8% ATK permanente desde turno 1 para todos.

Requiere inversion: 3 Genos con ese gene especifico activo.



6.4 Las 4 Reglas de Cambio de Geno

Tipo de cambio

Cuando ocurre

Consume turno

Regla especial

Forzado

El Geno activo cae a 0 HP.

NO. El rival no gana un turno extra.

En modo tactico el jugador elige cual de los dos restantes entra.

Voluntario

El jugador lo decide (modo tactico).

SI. El Geno entrante no ataca ese turno. El rival si ataca.

Solo en modo tactico. En asincronico lo maneja el IFTTT.

Por IFTTT

El sistema ejecuta la condicion programada.

SI. Cuenta como turno gastado.

Ejemplo: SI propio HP < 20% > CAMBIAR a Geno 2.

Bloqueado

El Geno activo tiene estado Enredado.

No aplica.

El cambio forzado (caida) si funciona. El estado no se hereda al entrante.



Lo que persiste y lo que se resetea al cambiar

PERSISTE al cambiar de Geno

SE RESETEA al entrar el Geno de relevo

HP restante de todos los Genos del equipo.

El Geno entrante llega SIN estados negativos (Veneno, Quemadura, Paralisis).

Buffs propios activos quedan con el Geno que los tiene.

El gene Piel de Cristal del entrante funciona fresco.

La Corrosion de ATK del rival (permanente e irremovible).

La Sangre Fria del entrante se resetea: bloquea el primer estado.

Genes ocultos siempre activos (Vampirismo, Frenesi acumulado).

El temporizador de duracion de estados del rival sigue corriendo.



6.5 Los 4 Escenarios de Cambio Estrategico

El cambio por cobertura elemental: tu Biomutante esta combatiendo un Viral (desventaja x0.75). Cambias al Cibernetico (fuerte contra Viral, x1.35). Pierdes un turno pero cambias completamente el multiplicador. En 6+ turnos el cambio se amortiza.

El cambio post-Definitivo del rival: el rival acaba de usar su Definitivo (1 uso por combate). Cambias a tu Geno de reserva. Tu Geno de reserva entra fresco para los turnos siguientes sin el Definitivo del rival disponible.

El sacrificio calculado: tu primer Geno tiene Escudo de Karma (KARM_S). Lo dejas caer intencionalmente para que el rival pierda el 20% de su HP restante. Tu segundo Geno entra con ventaja numerica de HP inmediata.

El relevo del controlador: tu Viral aplico Pandemia (ATK-15%, SPD-15%, LUK-15%). Cambias al Glass Cannon Sintetico. Tormenta de Criticos contra un rival con -15% LUK y SPD puede ser el cierre perfecto del combate.



6.6 Los 2 Modos de Combate 3v3

Caracteristica

Modo Asincronico (liga diaria)

Modo Tactico (torneos especiales)

Cambios voluntarios

Por IFTTT pre-programado.

El jugador elige en tiempo real. Consume el turno.

Cambios forzados

Automaticos. Sigue el orden establecido.

El jugador elige cual de los dos Genos restantes entra.

Tiempo por decision

No aplica. Motor automatico.

60 segundos. Si expira: primer ataque disponible.

Duracion combate

Instantanea (replay disponible).

20-40 minutos en partidas de alto nivel.

Donde se usa

Liga de Equipos diaria. Torre PvE equipo.

Torneos de Llaves 3v3. El Olimpo de Equipos.



6.7 Duracion Estimada de un Combate 3v3

Escenario

Turnos totales

Experiencia del jugador

Cada enfrentamiento individual

6-9 turnos (igual que 1v1 con DEF)

Identico al 1v1 por segmento.

3v3 completo sin cambios voluntarios

18-27 turnos totales estimados

El replay dura 2-3 minutos.

3v3 con cambios voluntarios frecuentes

Hasta 35 turnos en el peor caso

Replay mas largo pero mas dramatico.

Modo Tactico en tiempo real

20-40 minutos en partidas equilibradas

Solo disponible en torneos especiales.



6.8 Genes que Cobran Nueva Dimension en 3v3

Gene

Efecto especifico en 3v3

Nivel de impacto

Resonancia de Clan (CLAN_R, Epico)

Si los 3 Genos del equipo tienen CLAN_R: +8% ATK permanente para los 3 desde turno 1.

CRITICO. El gene mas poderoso de la Liga de Equipos.

Escudo de Karma (KARM_S, Epico)

El Geno abridor con KARM_S convierte su derrota en una trampa: el rival paga 20% HP.

ALTO. Permite estrategias de sacrificio deliberado.

Sangre Fria (COLD_BL, Raro)

El Geno de relevo llega fresco. COLD_BL garantiza que el primer estado del rival no conecta.

ALTO. Esencial en el Geno 2 del equipo.

Contra-Golpe Definitivo (ULTS_COUNTER, Leg.)

El rival tiene 3 Definitivos (uno por Geno). ULTS_COUNTER puede activarse hasta 3 veces por combate.

ALTO. En 1v1 se activa 1 vez. En 3v3 hasta 3.

Adaptacion al Meta (META_A, Epico)

Si los 3 Genos son del elemento en desventaja con META_A: todos +10% todos los stats.

ALTO. El equipo underdog que se convierte en favorito.

Conexion Empatica (EMP_C, Raro)

Los 3 Genos son siempre del mismo dueno. Con 2 en reserva con EMP_C: +5% LUK al activo.

MEDIO. En 1v1 requeria coordinar. En 3v3 es automatico.

Vampirismo Genetico (VAMP_G, Legendario)

El Geno de cierre contra un rival que llega con Corrosion acumulada se vuelve casi indetenible.

ALTO. El cierre mas sostenible en combates 3v3 largos.



6.9 Balance y Mitigacion de Riesgos del 3v3

Riesgo

Mitigacion implementada

3 Legendarios aplastan todo.

La liga clasifica por el Geno mas alto. Tres Legendarios compiten contra otros tres Legendarios.

Premio 3v3 multiplica ingresos x3.

Premio fijo x1.5 sobre el 1v1, no x3. Complejidad recompensada moderadamente.

El mismo jugador domina 1v1 y 3v3.

Un Geno no puede estar en dos torneos activos. Para ambos modos se necesitan 6 Genos distintos.

Modo tactico demasiado largo para casuals.

El modo tactico solo existe en torneos especiales. La Liga de Equipos es 100% asincronica.

CLAN_R en 3 Genos es muy poderoso.

CLAN_R tiene 22% de probabilidad en Slot B para Epicos. Tener los 3 requiere suerte o inversion en Escaneres.

El 3v3 complica el juego para nuevos.

Acceso al 3v3 requiere 10 combates en Liga 1v1 completados. El nuevo jugador aprende el 1v1 primero.

### 5.6 Resumen Técnico para Implementación del Coliseo

Este documento es la referencia tecnica completa para implementar el sistema de combate en ColiseumLogic.js, AttackCatalog.js y la UI del Coliseo. Todos los valores numericos son definitivos para V12.



Variables clave del motor

// Multiplicadores elementales V12

VENTAJA_ELEMENTAL = 1.35

DESVENTAJA_ELEMENTAL = 0.75

STAB = 1.20  // Solo Especiales y Definitivos del propio elemento

CRITICO = 1.50



// Formula DEF V12

MINIMO_DANO = 0.35  // 35% del ATK atacante como minimo garantizado



// Penetracion de armadura V12

PERFORANTE_ESPECIAL = 0.50  // Ignora 50% DEF

PERFORANTE_DEFINITIVO = 0.65  // Ignora 65% DEF

POSTURA_INQUEBRANTABLE = 0.20  // Con ese gene, el perforante solo ignora 20%



// 3v3: cambio de Geno

CAMBIO_FORZADO_CONSUME_TURNO = false

CAMBIO_VOLUNTARIO_CONSUME_TURNO = true

ESTADOS_SE_TRANSFIEREN_AL_RELEVO = false

CORROSION_ES_PERMANENTE_Y_AFECTA_A_TODO_EL_EQUIPO_RIVAL = true





Proyecto Genos — Sistema de Combate Completo V12 · Documento Tecnico · Abril 2026

## 6. Arquitectura Técnica y Seguridad Financiera (Web3, Privy y Safe)

### 6.1 El Problema de la Infraestructura Financiera (Análisis de Costes)

Las pasarelas de Wallets Embebidas (como Privy o Web3Auth) resuelven la fricción del onboarding Web3 tradicional al crear una billetera inteligente de manera invisible mediante inicios de sesión sociales Web2 (Google, Discord, Apple o correo). Sin embargo, estas plataformas cobran bajo un modelo de licenciamiento comercial basado en MAU (Monthly Active Users - Usuarios Activos Mensuales).

Cualquier usuario que cargue el SDK de Privy e inicie sesión dentro de un ciclo de 30 días consume una unidad del cupo contratado, independientemente de si tiene saldo, si realiza transacciones en la red Polygon o si simplemente entra a curiosear en la interfaz de juego. En un videojuego gratuito (Free-to-Play), se estima que entre el 75% y el 85% de los usuarios registrados son "espectadores" que nunca realizarán transacciones financieras reales.

Si el SDK de Web3 se inicializa de forma automática en el de registro general del juego o al navegar de forma casual por los menús del cliente, un flujo masivo de usuarios (ej. 100,000 jugadores) generaría una factura de infraestructura de miles de dólares por usuarios "fantasma" que no aportan capital a la economía del juego.

Este documento técnico detalla la arquitectura para aislar el entorno Web3 de forma absoluta, utilizando tres barreras de protección de software off-chain gestionadas íntegramente por Supabase, junto con el estándar de Abstracción de Cuentas para garantizar transacciones de bajo coste sin custodia.

### 6.2 Componente 1: Sistema de Meta-Progresión (Nivel del Laboratorio)

2.1 Descripción General

El Nivel del Laboratorio es una variable de progresión global vinculada de manera única a la cuenta del jugador (perfil de usuario), y es completamente independiente de los niveles de combate o crianza de sus criaturas individuales (Genos). Este sistema se procesa y almacena en su totalidad de forma off-chain dentro de la base de datos de Supabase.

2.2 Estructura y Esquema en Base de Datos

Para implementar esta meta-progresión, se deben añadir los siguientes atributos a la tabla de perfiles de usuario de Supabase:

ALTER TABLE profiles ADD COLUMN lab_level INTEGER DEFAULT 1,ADD COLUMN lab_xp INTEGER DEFAULT 0,ADD COLUMN comercio_desbloqueado BOOLEAN DEFAULT false;

2.3 Fórmula de Progresión de Experiencia

La experiencia necesaria para avanzar del nivel actual  al nivel siguiente  se calcula mediante la siguiente función polinómica:

Esta curva garantiza un crecimiento progresivo y predecible:

Nivel 1 a 2: 

Nivel 2 a 3: 

Nivel 3 a 4: 

Nivel 4 a 5: 

2.4 Acciones de Juego que Aportan XP al Laboratorio

Para asegurar que un bot no pueda automatizar de manera sencilla el incremento del nivel del laboratorio, la ganancia de experiencia se asocia a interacciones que consumen recursos de tiempo o energía:

Minijuegos (Arcade): Completar una sesión del minijuego "Lluvia de Manzanas" consumiendo Energía Nexo otorga un rango de  a  de Laboratorio por partida completada.

Combates (Coliseo/Torre): Ganar un combate asíncrono o una etapa en la Torre de Mutación PvE otorga . Una derrota aporta  de Laboratorio.

Cuidado Diario Pasivo: Realizar con éxito las tres interacciones diarias de necesidades (Limpieza mediante ducha de plasma, Alimentación con ración automática y Caricias) aporta  de Laboratorio de forma global por cada Geno atendido, limitado a una vez al día por criatura para evitar el spam.

2.5 Rango Científico y Rango de Combate (Títulos de Criador)

Para incentivar la progresión off-chain y PvP del jugador, se implementan títulos cosméticos dinámicos en la ficha de identidad del Perfil de Usuario:

* **Rango Científico (Experiencia en Laboratorio):** Calculado a partir de la variable `lab_level` del perfil del jugador:
  * Nivel 1 a 4: `Auxiliar de Laboratorio`
  * Nivel 5 a 9: `Técnico de Campo`
  * Nivel 10 a 19: `Investigador Élite`
  * Nivel 20 a 29: `Biólogo Avanzado`
  * Nivel 30 o más: `Científico Supremo`

* **Rango de Combate (Habilidad en la Torre):** Calculado a partir de la variable `max_floor` alcanzada en la Torre de Mutación PvE:
  * Piso menor a 10: `Aspirante de la Arena` (rango por defecto)
  * Piso 10 a 19: `Luchador de la Arena`
  * Piso 20 a 39: `Gladiador de la Torre`
  * Piso 40 a 59: `Defensor del Nexo`
  * Piso 60 o más: `Conquistador del Caos`

### 6.3 Componente 2: Interfaz Espejo (Mock UI) y Carga Perezosa

Con el fin de evitar que un jugador curioso que simplemente quiere explorar las opciones de la "Plaza de Comercio" o el "Baúl" inicialice el SDK de Privy y active el contador de MAU, el juego implementa una Interfaz Espejo (Mock UI) desarrollada con componentes nativos de HTML/JS/CSS.

3.1 Mecánica de Aislamiento del SDK (Lazy Loading)

El cliente web del juego no carga la librería de Privy en el punto de entrada principal del juego (Main App Entry). El import se realiza bajo demanda únicamente si se cumplen las condiciones lógicas de desbloqueo.

Cuando el jugador accede a la pestaña de su "Baúl", el sistema lee el saldo de la base de datos de Supabase (que de forma predeterminada para cuentas nuevas será ). Esta vista renderiza los botones de "Depositar", "Retirar" e "Historial de Transacciones" usando puro código CSS del cliente, sin instanciar la billetera de Privy ni hacer llamadas a la blockchain de Polygon.

Si el usuario hace clic en los botones informativos, el juego le muestra el diseño de la interfaz y las explicaciones de uso del Baúl. El "Muro de Acción" o activación real se pospone estrictamente hasta que el usuario intente realizar su primer depósito/retiro real, o decida publicar un elemento para la venta, previa validación de su Nivel de Laboratorio.

3.2 Flujo del Comprador Curioso (Muro de Saldo Cero)

Para evitar la inicialización del SDK de las cuentas de Privy cuando un usuario sin fondos intenta realizar una compra por curiosidad o exploración, el cliente web interceptará el evento del botón "Comprar" mediante una validación lógica off-chain directamente en Supabase:

Consulta Pasiva Interna: El frontend lee instantáneamente el estado del perfil local del usuario en Supabase (wallet_address y pol_balance).

Evaluación de Umbral: Si el sistema detecta que la dirección de la wallet es nula o que el saldo almacenado es menor que el precio en $POL fijado para el Geno en la tabla mercado_p2p, se bloquea el script de inicialización Web3 de forma fulminante.

Renderizado del Modal Web2: El juego despliega una ventana flotante (Modal) diseñada enteramente en HTML/CSS local con un árbol de opciones lógicas para mitigar los clics accidentales:

Acción Principal (Enfoque Web2): Un botón destacado y brillante con la etiqueta: [ Volver a la Plaza ]. Al presionarlo, cierra el modal y devuelve al usuario a la vista del mercado.

Acción Secundaria (Enfoque Web3): Un botón inicialmente bloqueado o condicionado con la etiqueta: [ Activar Baúl y Depositar ].

3.3 Alternativas de Diseño de Experiencia de Usuario (UX) para la Contención de Clics

Alternativa A: Textos de Mensajería Sutil (Copywriting Anti-Fricción)

Se exponen tres variantes de mensajes informativos para ubicar en la zona inferior del modal. El objetivo es guiar de forma lógica al jugador de perfil Web2 clásico sin emplear un lenguaje prohibitivo o restrictivo que infunda desconfianza o miedo financiero:

Variante 1 (Enfoque de Seguridad e Inmersión):🔒 Nota de seguridad: Tu dirección de comercio en la red Polygon se generará de forma automática y totalmente segura solo cuando decidas iniciar el proceso de depósito.

Variante 2 (Enfoque Técnico Limpio):🛡️ Para mantener la seguridad de tu Laboratorio, la firma digital del Baúl solo se vinculará a tu cuenta al detectar una orden de depósito confirmada.

Variante 3 (Enfoque Minimalista de Juego):💡 Puedes seguir explorando la Plaza de Comercio de forma libre. El enlace con la red de transacciones se activará únicamente al preparar los fondos de tu primer intercambio.

Alternativa B: Jerarquía Visual por Opacidad (Diseño de Botones)

Para evitar que el cerebro del jugador presione el botón de activación por inercia o reflejo automatizado, se altera drásticamente la distribución visual de la interfaz del modal:

El botón [ Volver a la Plaza ] adopta un estilo de alta prioridad (color neón cian del lore de Genos, tamaño completo, iluminación activa).

El botón [ Activar Baúl y Depositar ] se configura como un elemento secundario y opaco (diseño traslúcido, escala de grises o bordes planos sin relleno). Esto reduce el estímulo visual de clic involuntario en un 40%, canalizando el tráfico orgánico de vuelta al bucle del juego off-chain.

Alternativa C: Puerta de Interacción Mediante Casilla de Confirmación (Checkbox Gate)

Para añadir una capa de confirmación consciente definitiva, el botón secundario [ Activar Baúl y Depositar ] se renderiza con el atributo HTML disabled por defecto en el cliente.

Se añade un elemento interactivo <input type="checkbox" id="gate_web3"> justo encima de los botones de acción.

El texto descriptivo junto a la casilla indica de manera sutil:[ ] Confirmar que deseo inicializar la red para preparar una transferencia externa de $POL.

Lógica del Frontend (JS local): El botón opaco de Privy solo cambia su estado a activo (disabled = false) y recupera sus colores interactivos si y solo si el jugador marca activamente la casilla de verificación. Si la casilla no está seleccionada, el clic en el botón de la wallet está físicamente deshabilitado a nivel de código, impidiendo de forma matemática cualquier fuga de MAU innecesaria.

### 6.4 Componente 3: El Permiso de Acceso a la Red de Comercio (Licencia)

Para activar definitivamente las funciones de la wallet embebida y la Plaza de Comercio P2P, el jugador debe adquirir dentro del juego un objeto digital sin valor comercial externo llamado "Permiso de Acceso a la Red de Comercio" (Licencia de Comerciante de Genos) dentro del Bazar Consumibles.

4.1 Condicionales de Desbloqueo (Muro de Seguridad)

La tienda del Bazar no permitirá la adquisición de la Licencia a menos que se verifiquen atómicamente los siguientes requisitos en el backend:

Nivel Mínimo de Laboratorio: El campo lab_level de la cuenta en la tabla profiles debe ser igual o superior a Nivel 5. Esto garantiza un mínimo de esfuerzo de juego real por parte de un humano.

Coste en Esencia Vital (EV): El jugador debe pagar una tasa fija única de 15.00 EV (moneda off-chain del juego, no vendible por dinero real). Esto actúa como un sumidero de valor para la economía de juego y detiene la creación de cuentas automatizadas por bots, ya que la EV requiere juego activo para ser acumulada.

Una vez que el backend procesa el cobro de la Esencia Vital y confirma el Nivel 5 de Laboratorio, actualiza el valor en base de datos:

UPDATE profiles SET comercio_desbloqueado = true,     esencia_vital_balance = esencia_vital_balance - 15.00 WHERE id = 'user_id' AND lab_level >= 5;

### 6.5 El Marco Legal Europeo y la No-Custodia (Análisis MiCA)

5.1 El Riesgo de los "Saldos en Base de Datos"

Manejar un sistema donde los jugadores depositan dinero real () en un contrato unificado del juego y el servidor les asigna un saldo digital interno en la base de datos para operar (sistema de saldos internos Web2) constituye legalmente una actividad de Custodia de Activos Virtuales.

Bajo el marco regulatorio de la ley MiCA (Markets in Crypto-Assets) en la Unión Europea:

Manejar, resguardar o procesar saldos en criptomonedas de terceros de forma interna requiere una licencia financiera oficial emitida por el regulador nacional correspondiente (como la CNMV en España).

Operar sin esta licencia conlleva multas penales de millones de euros y el cierre inmediato de la infraestructura del servidor.

Los requisitos para obtener y auditar una licencia de custodia de criptoactivos son económica y técnicamente inviables para un equipo independiente o estudio independiente de videojuegos.

5.2 El Enfoque de Autocustodia Real

Para eximir al equipo de desarrollo de toda responsabilidad penal y regulatoria, Genos opera bajo un modelo de autocustodia estricta.

El dinero del jugador reside siempre en su cuenta inteligente (Smart Account) controlada criptográficamente por el SDK de Privy.

El equipo de desarrollo no almacena claves privadas, no puede mover saldos de los usuarios unilateralmente y no interactúa con el dinero de los jugadores en bases de datos internas.

Legalmente, el juego es un mero software intermediario que facilita la firma de transacciones autónomas por parte de los propios usuarios en la blockchain pública de Polygon.

5.3 Coexistencia de Billeteras: Privy (MPC) y MetaMask (Externa)

Para asegurar la accesibilidad para todo tipo de usuarios sin comprometer la descentralización ni la autocustodia, el sistema implementa un modelo de interfaz dual de billetera:

- **Billetera Embebida (Privy - MPC):** Para usuarios Web2 tradicionales. El SDK genera de forma invisible una Smart Account en la red Polygon utilizando el inicio de sesión social del jugador. La clave privada se fragmenta en múltiples partes mediante criptografía MPC (Multi-Party Computation) y se distribuye de manera que el servidor del juego nunca tiene acceso a la clave completa ni puede firmar transacciones de forma unilateral. El jugador es el único que posee el control criptográfico final de su cuenta inteligente.
- **Billetera Externa (MetaMask / Extensiones Web3):** Para usuarios Web3 experimentados. Permite conectar billeteras de autocustodia tradicionales a través de su propia extensión de navegador. El flujo de transacciones es clásico: cada operación (compra, entrada, retiro) invoca una ventana emergente de MetaMask para que el usuario firme manualmente la transacción con su clave privada local.
- **Interoperabilidad:** Ambos tipos de billeteras operan de manera análoga en los contratos de la Plaza de Comercio y Ligas de Torneos. En la base de datos de Supabase, la propiedad de las criaturas y los registros de transacciones se asocian de forma transparente a la `wallet_address` del jugador, independientemente del método de firma utilizado, garantizando que el dinero y los Genos de los jugadores pertenezcan 100% a los usuarios y nunca sean custodiados por el juego.

### 6.6 Componente 4: Abstracción de Cuentas (ERC-4337) para Micropagos

Para garantizar que el jugador pueda realizar micropagos de forma rápida, económica (compras de consumibles o entradas de ligas de tan solo  en POL) y sin romper la jugabilidad con constantes firmas o cobros de comisiones invasivas, se implementa el estándar ERC-4337 (Account Abstraction) integrado nativamente con Privy.

[Jugador en el Cliente]          ↓  (Inicia Sesión)          ↓[Smart Account del Usuario (ERC-4337)]       /                       \[Sponsor: Paymaster]     [Control: Session Keys](Paga el Gas del usuario) (Firma transacciones automáticas)

6.1 El Paymaster (Sponsor de Gas)

Para evitar que el jugador tenga que pagar comisiones de red por cada acción de micro-valor, el juego implementa un Paymaster (contratado mediante proveedores como Biconomy o Pimlico):

Cuando el jugador compra un artículo de  en POL, la transacción se ejecuta on-chain directamente.

El jugador paga únicamente la cuantía de la compra (sus  en POL).

La comisión de la red Polygon (gas de transacción, promedio de ) es absorbida y patrocinada en segundo plano por el contrato del Paymaster de desarrollo.

El estudio deposita un fondo de gas mensual en Polygon (ej. ) para cubrir decenas de miles de transacciones de sus usuarios activos, coste que se recupera exponencialmente con las comisiones de la Plaza de Comercio y las inscripciones de torneos.

6.2 Session Keys (Claves de Sesión sin Popups)

Para eliminar las interrupciones constantes de ventanas flotantes de Privy solicitando firmas por cada acción menor, se despliega la mecánica de Session Keys:

Al iniciar una sesión de juego en la PWA, el cliente solicita al jugador firmar una única vez una autorización transitoria de sesión.

Esta clave define límites claros y seguros:

“Autorizo a la clave efímera del juego a firmar transacciones en mi nombre por un límite máximo de  por acción, durante un periodo estricto de 2 horas, limitando la interacción únicamente al contrato inteligente de Genos.”

Durante la sesión activa, el juego procesa las batallas, inscripciones y compra de consumibles en milisegundos directamente en la red Polygon. El jugador experimenta una respuesta visual instantánea idéntica a una base de datos Web2 tradicional, sin interrupciones ni pantallas emergentes.

### 6.7 Componente 5: Flujo Híbrido de Comercio P2P (Geno Off-chain / Pago On-chain)

Para evitar las elevadas comisiones de gas que implicaría acuñar cada Geno como un NFT nativo de Polygon en la red, el juego implementa un modelo de comercio híbrido. El Geno permanece en la base de datos de Supabase en todo momento, y la blockchain se utiliza de forma exclusiva para procesar el pago del importe en $POL. Esto reduce la fricción económica de gas y elimina el cobro de comisiones previas de acuñación.

7.1 Esquema de las Tablas en Supabase para el Comercio Híbrido

-- Tabla de publicaciones en el mercadoCREATE TABLE mercado_p2p (    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),    geno_id UUID REFERENCES genos(id) ON DELETE CASCADE,    vendedor_id UUID REFERENCES profiles(id),    wallet_vendedor VARCHAR(42) NOT NULL,    precio_pol NUMERIC(10, 4) NOT NULL,    estado VARCHAR(20) DEFAULT 'en_venta', -- 'en_venta', 'vendido', 'cancelado'    fecha_publicacion TIMESTAMP DEFAULT NOW());

7.2 El Proceso de Venta Paso a Paso (Backend y On-chain)

Paso A: Publicación en el Mercado (Vendedor)

El vendedor selecciona un Geno de su inventario en la UI del juego.

El cliente del juego verifica en Supabase que el usuario posee el campo comercio_desbloqueado = true. Si es falso, el juego le indica los requisitos (Nivel 5 de Lab + 15 EV) y no inicia Privy.

Si es verdadero, el juego carga el SDK de Privy, inicializa su Smart Account en Polygon y lee su dirección de wallet.

El vendedor establece un precio en $POL (Ej: 20.00 $POL).

La base de datos actualiza el estado del Geno a en_venta en la tabla genos y añade una fila en la tabla mercado_p2p con la wallet del vendedor y el precio.

Paso B: La Ejecución del Pago (Comprador)

El Comprador B (que ya ha desbloqueado la Plaza de Comercio anteriormente y dispone de saldo de $POL en su wallet embebida) selecciona el Geno en la Plaza y hace clic en "Comprar".

La aplicación web de Genos invoca al SDK de Privy para ejecutar una transacción desde la Smart Account del comprador directamente al Contrato Inteligente de la Plaza de Comercio de Genos en Polygon.

El contrato inteligente procesa la transacción de la siguiente manera:

Calcula la comisión de desarrollador configurada fija en el 3.5%.

Transfiere el porcentaje de la comisión (3.5%) a la wallet de tesorería del equipo de desarrollo.

Transfiere el porcentaje neto restante (96.5%) de forma directa a la wallet del Vendedor A.

La transacción en la red finaliza de manera exitosa y el contrato inteligente emite el siguiente evento en Polygon:

event CompraGeno(    uint256 indexed compraId,     address indexed comprador,     address indexed vendedor,     uint256 genoId,     uint256 precio);

Paso C: Validación y Cambio de Dueño Off-chain

Para garantizar que ningún usuario malintencionado intente inyectar transacciones falsas manipulando el código JavaScript en su navegador, el cliente del juego tiene estrictamente prohibido cambiar la propiedad de la base de datos de forma directa. Todo el intercambio se valida en el servidor de forma asíncrona:

Un servicio de monitoreo e indexación de eventos Web3 (como Alchemy Webhooks) está escuchando el contrato de la Plaza de Comercio en Polygon.

En el instante en que el contrato emite el evento CompraGeno, el indexador detecta la confirmación del bloque en Polygon y envía una petición segura HTTP POST (Webhook) a la Supabase Edge Function del juego.

La Edge Function ejecuta la validación automatizada:

Verifica la firma del Webhook (signature verification) con una clave secreta para asegurar que el remitente es Alchemy y no un hacker.

Realiza una llamada RPC directa a Polygon para comprobar que el hash de la transacción existe, que está en estado exitoso y que los parámetros del evento coinciden exactamente con los registros de la tabla mercado_p2p.

Si el pago es verificado, ejecuta de forma atómica la transacción SQL para reasignar la propiedad del Geno y cerrar la oferta:

-- Cambia de forma segura el propietario en la base de datos centralUPDATE genos SET owner_id = 'id_perfil_comprador_b',     estado = 'activo' WHERE id = 'geno_id_comprado';-- Cierra la oferta en la Plaza de ComercioUPDATE mercado_p2p SET estado = 'vendido' WHERE geno_id = 'geno_id_comprado' AND estado = 'en_venta';

Una vez completada la base de datos, el sistema de WebSockets en tiempo real (Supabase Realtime) actualiza la pantalla de ambos jugadores sin necesidad de refrescar el navegador. El Comprador B ve la nueva criatura en su laboratorio y el Vendedor A recibe una notificación emergente indicando que su saldo en $POL ha aumentado.

### 6.8 Componente 6: Sistema de Cascada de Torneos, Cancelación y NPCs

Para optimizar las salas de emparejamiento (matchmaking) con cobro de entradas reales de manera rentable y sin sufrir la fragmentación del ecosistema, se implementan tres mecánicas de balanceo off-chain/on-chain.

8.1 Sistema de Cascada de Torneos y Reasignación de Categoría (Matchmaking Dinámico)

Para maximizar el llenado rápido de las salas competitivas diseñadas para 16 participantes (evitando largas esperas que arruinan la experiencia), el juego despliega un emparejamiento en cascada:

Regla de Excedente FIFO: Si un torneo estructurado para un coste de entrada de  cierra el cupo de 16 jugadores pero tiene a 2 jugadores excedentes esperando en cola (jugador 17 y 18), el backend reubica de forma automática y pasiva a estos dos jugadores en el grupo de la categoría de entrada inmediatamente inferior (ej. ).

Cero Gas de Devolución Inmediata (Patrón de Retiro / Pull-over-Push): El juego prohíbe realizar devoluciones automáticas on-chain activas desde el servidor para evitar pagar gas extra por transacciones de fallo. En su lugar, el contrato inteligente simplemente acredita la diferencia de  de saldo a favor de las cuentas inteligentes de los jugadores en la variable interna del contrato mapping saldosPendientes.

Flujo de Re-Inversión o Retiro Pasivo: El saldo a favor se visualiza en la interfaz Web2 de los jugadores. Desde el frontend, el cliente ofrece dos vías:

Re-inscripción Directa: Usar la diferencia de  almacenada en el contrato para inscribirse en otro torneo, requiriendo cero gas del Paymaster al ser una reasignación puramente lógica de datos dentro de la red.

Retiro Voluntario: Solicitar la retirada física del saldo del contrato hacia su wallet de Privy, donde el Paymaster absorbe el coste unitario del gas () bajo demanda directa del propio usuario.

8.2 Protocolo ante el Caso Extremo: Torneos Incompletos y Cancelados

En caso de que el temporizador de emparejamiento expire (ej. tras 5 minutos de espera) y una sala con entrada de  registre únicamente a 12 de los 16 jugadores mínimos, se activa el protocolo de mitigación de gasto de gas:

Cancelación Global Off-chain: El backend de Supabase detecta la expiración de la cola, detiene la sala y actualiza su estado a cancelada.

Una Única Firma de Cancelación: El servidor realiza una sola transacción de administración hacia el contrato de torneos para cerrarlo de forma global. El coste es de un único fee de gas ().

Actualización de Saldos Pasivos: El contrato inteligente transfiere internamente los balances de los 12 jugadores al pool de retiro saldosPendientes. No se procesan 12 transferencias salientes de dinero desde el servidor. El capital de entrada queda liberado para ser reutilizado en el siguiente torneo que sí se complete con éxito de forma gratuita para el Paymaster.

8.3 Protocolo de Subvención por Inyección de NPC (Semicompletado de Salas)

Si al expirar el tiempo de matchmaking de un torneo de 16 participantes el grupo registra exactamente a 15 jugadores humanos reales, el juego inyecta de forma automatizada un agente virtual (NPC) como el competidor número 16 para iniciar la partida de inmediato bajo el siguiente protocolo económico:

Subvención del Pozo de Premios: El contrato inteligente mantendrá inalterable el pool de premios del Top 3 calculado sobre un torneo completo de 16 participantes (ej. pozo total de  con un fondo a repartir del 90%: ). La "entrada" ficticia de  del NPC se subsidia de forma matemática a través de la retención del organizador (10%) cobrada a los 15 participantes humanos:

Fondos aportados por humanos: .

Fondo entregado a los premios: .

Comisión neta real de la casa:  (en lugar del  teórico).

Resultado: El torneo se ejecuta de forma rentable, cubriendo el gas de las transacciones sin aportar capital físico de desarrollo.

Rescate de Liquidez por Victoria del NPC: Si el agente NPC finaliza el torneo en posiciones de cobro (1º, 2º o 3º lugar), el contrato inteligente del torneo intercepta la dirección pública de cobro del bot. El monto de ese premio es desviado automáticamente de vuelta a la wallet Safe de tesorería del juego de la siguiente manera:

Si el bot gana el primer lugar (ej. premio de ), los premios de la segunda y tercera posición se envían a los humanos y los  restantes se acumulan en la tesorería del estudio para financiar reservas de gas del Paymaster.

Control de Gas del NPC: Todas las interacciones de juego del NPC se simulan asíncronamente de forma lógica en el servidor, consumiendo cero transacciones o firmas en Polygon durante el transcurso de las rondas competitivas.

### 6.9 Tabla Comparativa de Modelos de Integración y costes de Privy

Para dar visibilidad al comité o equipo de desarrollo sobre la contención de costes, a continuación se desglosa el impacto financiero estimado al alcanzar el hito de 100,000 Usuarios Activos Mensuales (MAU):

Criterio Técnico / Financiero

Modelo Tradicional (Sin Filtro de Acceso)

Modelo Híbrido de Genos (Nivel de Laboratorio)

Usuarios en Privy (MAU)

100,000 MAU (Todos los registros de la PWA)

15,000 - 25,000 MAU (Solo jugadores con Licencia activa)

Costo Mensual de Privy (Estimado)

$1,200 - $2,000 USD / mes

$300 - $500 USD / mes (Plan Scale de Privy)

Protección contra Granjas de Bots

Nula. Los bots crean cuentas y disparan el gasto.

Absoluta. Los bots se quedan atascados en el requisito off-chain.

Consumo de Recursos en Supabase

Elevado. Llamadas constantes a la API de Privy.

Mínimo. Todo se procesa con Edge Functions gratuitas.

Sostenibilidad de la Infraestructura

Requiere inyección de capital constante (pérdidas).

Autofinanciable. La comisión del 3.5% en Plaza y 10% en Torneos cubre los costes de sobra.

### 6.10 Referencias de Integración en el Documento Maestro V12

Este sistema de contención e infraestructura de red híbrida debe integrarse en las siguientes áreas del Documento Maestro definitivo del proyecto:

Fase 2 — Economía Básica y Supervivencia: Insertar la adquisición del "Permiso de Acceso a la Red de Comercio" (Licencia de Comercio) en el Bazar Consumibles por un precio de 15.00 EV. Configurar el campo lógico comercio_desbloqueado y el atributo lab_level de la meta-progresión en el gestor de inventario y mochila del cliente.

Fase 6 — Expansión Web3 y Becas: Sustituir el flujo tradicional que requiere acuñar obligatoriamente un NFT antes de vender por el sistema de Comercio Híbrido de transacción off-chain con liquidación on-chain mediante Supabase Edge Functions. El registro NFT (coste inferior a $3) queda exclusivamente reservado como una acción opcional del usuario para retirar el Geno de los servidores locales.

Sección 11 — Arquitectura Técnica: Registrar el uso de las Supabase Edge Functions (Serverless) como la capa inteligente de validación de transacciones que conecta de forma asíncrona la red Polygon con la base de datos de juego off-chain sin costes fijos de servidor.

### 6.11 Sistema de Seguridad de la Bóveda de Tesorería (Wallet Multi-firma)

11.1 Descarte de Infraestructura Web3 Básica (Por qué NO usar Privy para el Administrador)

Las wallets embebidas de Privy están optimizadas de forma exclusiva para la experiencia de incorporación del usuario masivo (jugadores F2P). El protocolo fragmenta las claves privadas mediante criptografía MPC y vincula la reconstrucción del acceso a flujos de autenticación Web2 tradicionales, como cuentas de Google, Discord o correos electrónicos.

Si el estudio independiente utiliza una dirección generada por Privy para almacenar las comisiones y micropagos acumulados de la economía del juego, se introduce un punto crítico de vulnerabilidad sistémica (Single Point of Failure). Si cualquier miembro del equipo de desarrollo sufre un ataque de ingeniería social, phishing o filtración de credenciales en su cuenta de Google o Discord asociada, el atacante ganaría acceso inmediato a la clave privada unificada de la tesorería, vaciando los fondos del proyecto de forma irreversible. La wallet del juego no debe depender jamás de la seguridad de una contraseña de correo electrónico.

11.2 El Estándar de Seguridad Contractual: Safe (Multisig Smart Contract)

Para blindar la bóveda del juego contra ataques informáticos, accesos no autorizados y fallos humanos, la recaudación de fondos se gestiona mediante un contrato inteligente multi-firma basado en el estándar industrial Safe (anteriormente conocido como Gnosis Safe).

Una cuenta Safe no opera bajo una única clave privada tradicional. Es un contrato inteligente desplegado en la red de Polygon que requiere que un número mínimo de claves autorizadas independientes aprueben y firmen digitalmente cualquier transacción de salida antes de que esta pueda ser ejecutada en la blockchain.

11.3 Arquitectura de Gobernanza del Capital (Esquema 2 de 3)

Para el funcionamiento independiente de Genos, la tesorería del juego se configura bajo una estructura de 2 de 3 firmas autorizadas:

Firma 1 (Dispositivo Físico Principal - Desarrollador A): Controlada mediante una wallet de hardware (Ledger o Trezor) en posesión física del programador principal.

Firma 2 (Dispositivo Físico de Respaldo - Desarrollador B): Controlada mediante una segunda wallet de hardware en posesión de otro miembro clave del equipo o socio estratégico.

Firma 3 (Wallet de Recuperación en Frío - Clave Guardada): Una wallet tradicional fuera de línea cuyas palabras semilla se almacenan en un lugar físico seguro de acceso restringido, utilizada únicamente en caso de pérdida o avería de uno de los dispositivos físicos primarios.

Bajo esta configuración, si un atacante logra comprometer la seguridad física o digital de una de las llaves (Llave 1), el saldo total de la bóveda permanece intacto y bloqueado, dado que el contrato inteligente de Safe de la blockchain de Polygon rechazará cualquier intento de retiro que no cuente con la aprobación digital explícita de la Llave 2 o la Llave 3 de forma simultánea.

11.4 Integración Técnica con el Contrato de la Plaza de Comercio

El flujo automatizado de las comisiones del juego no toca los servidores locales ni las bases de datos en Supabase. El desvío de capital está hardcodeado directamente en el núcleo del contrato inteligente que liquida las compras P2P en Polygon.

contract GenosPlazaComercio {    address public immutable walletTesoreriaSafe;    uint256 public porcentajeComision = 350; // 3.50% expresado en puntos básicos (basis points)    constructor(address _walletSafe) {        require(_walletSafe != address(0), "Direccion invalida");        walletTesoreriaSafe = _walletSafe;    }    function procesarPagoGeno(address payable _vendedor, uint256 _montoTotal) external payable {        uint256 montoComision = (_montoTotal * porcentajeComision) / 10000;        uint256 montoNetoVendedor = _montoTotal - montoComision;        // Desvío inmediato y automatizado a la bóveda multi-firma blindada (Safe)        (bool exitoComision, ) = walletTesoreriaSafe.call{value: montoComision}("");        require(exitoComision, "Fallo el envio de comision a la tesoreria");        // Envío del neto al jugador vendedor (su cuenta Privy)        (bool exitoVendedor, ) = _vendedor.call{value: montoNetoVendedor}("");        require(exitoVendedor, "Fallo el envio de fondos al vendedor");    }}

11.5 Inmunidad Frente a Ataques del Servidor Central

Al acoplar la recaudación directamente entre las cuentas de los usuarios y el contrato Safe en Polygon, el sistema adquiere inmunidad contable off-chain:

Si un atacante vulnera el backend de Supabase o las Edge Functions, solo podrá alterar información visual o lógica local del juego (como inventarios ficticios o nombres cosméticos).

El hacker no tiene ninguna vía técnica para extraer el dinero acumulado en la tesorería del proyecto, ya que el backend de Supabase no almacena, no conoce y no tiene privilegios de firma sobre el contrato inteligente Safe de la blockchain de Polygon.

Cualquier movimiento de retiro de fondos acumulados para sufragar costes operativos del estudio requiere obligatoriamente una firma física offline del equipo, manteniendo las finanzas del proyecto bajo un entorno de seguridad de nivel bancario de forma totalmente gratuita.

### 6.12 Catálogo Consolidado de Contratos Inteligentes (Solidity)

Para dar una visión de conjunto sobre la descentralización del proyecto, a continuación se detallan todos los contratos inteligentes de la red Polygon que integran el ecosistema de Genos, tanto los ya implementados en el directorio `/contracts` como los planificados para futuras fases.

| Nombre del Contrato | Tipo / Estándar | Estado actual | Ubicación del código | Propósito y Funcionalidad Principal |
| :--- | :--- | :--- | :--- | :--- |
| **`GenosPlazaComercio`** | Custom Settlement | **L100% Implementado** | [GenosPlazaComercio.sol](file:///c:/Users/STT/Documents/GitHub/Mascotas/contracts/GenosPlazaComercio.sol) | Gestiona los pagos P2P en $POL entre cuentas del juego. Realiza de forma atómica y directa en la blockchain la deducción del **3.5%** de comisión hacia la tesorería multi-firma y el 96.5% restante al vendedor. |
| **`GenosTorneos`** | Custom Matchmaking | **L100% Implementado** | [GenosTorneos.sol](file:///c:/Users/STT/Documents/GitHub/Mascotas/contracts/GenosTorneos.sol) | Gestiona las inscripciones y el pozo de premios de torneos. Soporta devoluciones FIFO diferidas en `saldosPendientes`, reinversión interna con 0 gas y desviación del premio de NPCs ganadores a la tesorería. |
| **`GenosNFT`** | `ERC-721` / `ERC-1155` | ❌ *Planificado* (Fase 6) | *Pendiente de creación* | Representa a los Genos en la blockchain de Polygon. Permite el "minting" bajo demanda de criaturas off-chain de Supabase a la blockchain por un coste inferior a $3 de gas para su libre transferencia o venta externa. |
| **`LibroLinaje`** | Registro Inmutable | ❌ *Planificado* (Fase 4) | *Pendiente de creación* | Registro histórico y de pedigrí on-chain. Guarda la genealogía (padres, abuelos), victorias en torneos temáticos y combos genéticos activos para que viajen inmutablemente junto al NFT del Geno. |
| **`GenosBecas`** | Custodia / Escrow | ❌ *Planificado* (Fase 6) | *Pendiente de creación* | Contrato de alquiler que bloquea temporalmente el NFT en custodia segura y reparte automáticamente las recompensas obtenidas (split 70% becario / 30% mánager) eliminando el riesgo de robo del Geno. |

El estado actual del ecosistema es de un **40% de contratos implementados on-chain** (Plaza y Torneos en testnet Amoy/MetaMask y localmente Privy), con un **60% restante planificado** para la migración del motor de base de datos de Supabase a la blockchain cuando se inicie la Fase 4 (Linaje on-chain) y Fase 6 (NFT y Becas reales).

## 7. Sistema de Recompensas Diarias Rotativas (Daily Check-in)


Este sistema regula el incentivo de conexión diaria del jugador en un bucle infinito automatizado de 4 semanas (28 días), alineado con el calendario de Torneos Temáticos del Coliseo.

### 7.1 Catálogo de Ítems Fundamentales Estructurado

Para que el sistema funcione de forma dinámica sin repetir los mismos premios exactos, clasificamos los recursos del juego en 4 Categorías Maestras:

* **A. Categoría: RECURSOS_BASICOS (Monedas y Alimentos)**:
  * **Esencia Vital (EV)**: Moneda interna off-chain para el mantenimiento, Reactor, Santuario y Laboratorio de Implantes.
  * **Manzanas**: Alimento fundamental para resetear el estado de Hambre en el modo Tamagotchi (restaura 20%).
* **B. Categoría: CONSUMIBLES_TAMAGOTCHI (Gestión de Necesidades)**:
  * **Poción de Energía**: Recupera 50% de Resistencia del Geno activo para permitirle combatir en el Coliseo.
  * **Ración Automática**: Alimenta pasivamente a todos los Genos guardados en las cápsulas de reserva por 24 horas.
* **C. Categoría: HERRAMIENTAS_GENETICAS (Laboratorio)**:
  * **Escáner de ADN Básico**: Revela los slots de genes activos del Geno en el Reactor (valorado en el documento en $0.15 EV).
  * **Escáner de ADN Completo**: Revela la cadena genética entera del Geno en el Reactor (valorado en el documento en $0.50 EV).
* **D. Categoría: ITEMS_COMPETITIVOS (Lab. Implantes - Ataques)**:
  * **Tinta de Habilidad**: Permite al jugador resetear o cambiar un ataque de su Geno en el Laboratorio de Implantes antes de inscribirse a un torneo.

### 7.2 Matriz Dinámica del Calendario (Bucle de 4 Semanas)

En lugar de definir un ítem único e inmutable, el código llama a una Categoría en los días clave, haciendo que el premio se asigne de forma aleatoria según las necesidades del meta de esa semana:

* **Días 1, 2, 4 y 5 (Días de Grindeo)**: Otorgan `RECURSOS_BASICOS` o `CONSUMIBLES_TAMAGOTCHI` escalados según el nivel de laboratorio del jugador (Ej: $EV \times Nivel$, o cantidad de Manzanas proporcional al nivel).
* **Días 3 y 6 (Días de Preparación)**: Otorgan una herramienta aleatoria de la categoría `HERRAMIENTAS_GENETICAS` (con un drop-rate equilibrado de 70% Básico y 30% Completo).
* **Día 7 (El Premio Gordo del Domingo)**: Otorga un ítem aleatorio de la categoría `ITEMS_COMPETITIVOS` (como Tinta de Habilidad, multiplicada según la semana) adaptado al elemento o rareza del torneo de ese fin de semana.

### 7.3 Estructura de Datos y Seguridad en Supabase

Para garantizar la persistencia de la racha y evitar fraudes por modificación del reloj del cliente, el sistema requiere las siguientes especificaciones:

* **Tabla `profiles` (Columnas añadidas)**:
  * `last_check_in` (timestamp): Registra cuándo reclamó su último premio.
  * `streak_days` (int): Contador del día actual de la racha (del 1 al 7).
* **Seguridad (Anti-Cheat)**:
  * El cálculo y asignación de la recompensa se ejecuta en el servidor mediante la llamada RPC `claim_daily_checkin`.
  * La validación se basa estrictamente en la hora UTC del servidor, impidiendo que el jugador adelante el reloj de su dispositivo local para reclamar premios antes de tiempo.



## 8. Sistema de Torneos Temáticos — Fase 7 Completa

Los Torneos Tematicos son la capa que hace que el esfuerzo de criar y mejorar Genos valga la pena competitivamente. En un ciclo completo de 4 semanas, cada tipo de Geno tiene su momento de brillo. No reemplazan la Liga Asincrona ni los Torneos de Llaves — son una capa adicional.



Tipos de torneo

Ciclo rotativo

Capas de recompensa

Participantes por bracket

12 tipos distintos

4 semanas fijas

3 independientes

16 por liga de rareza



### 8.1 Los 12 Tipos de Torneo

Categoria A — Restriccion de rareza

Solo Comunes: solo Comunes de cualquier nivel. El torneo donde 8 meses de entrenamiento tienen recompensa directa. Un Comun nivel 50 Rango S con Slot 4 desbloqueado es el favorito. Entrada: $0.05 EV.

Copa Raro: solo Raros. Los genes de crianza como Dominancia Genetica y Linaje Ascendente crean ventaja estadistica. Entrada: $0.25 EV.

El Olimpo: solo Genos nivel 45 o superior. El gen Especialista de Elite (nivel 60) tiene ventaja sobre todos. El torneo que justifica meses de entrenamiento. Entrada: $1.50 EV.



Categoria B — Restriccion elemental

Liga Elemental Pura: solo el elemento anunciado esa semana (rota entre los 6). Nucleo Elemental Puro y Catalizador de Afinidad son los genes mas valiosos de la semana. Todas las rarezas permitidas con ligas internas separadas.

Torneo Inverso: solo el elemento en DESVENTAJA esa semana. El gen Adaptacion al Meta (+10% stats) se activa automaticamente. Premio +50% sobre el Elemental estandar por la dificultad inherente.

Copa de los Dos Mundos: solo Genos con el gen Elemento Dual (GEN: ELEM_2) activo y verificado por Escaner Completo. El torneo mas exclusivo del sistema elemental.



Categoria C — Restriccion de progresion

Liga Novatos: solo Genos nivel 1-20. Sin Slot 4. Los genes de progresion tienen ventaja directa. El nuevo jugador puede competir desde la primera semana. Entrada: $0.05 EV.

El Gran Linaje: solo Genos con al menos un progenitor registrado en el Libro de Linaje on-chain. Los Gen 0 puros no participan. Dentro del torneo, los descendientes de Semilla Genesis tienen su propia liga.



Categoria D — Reglas especiales

Torneo Sin Genes: los genes ocultos estan desactivados para todos. Solo importan los 5 stats, el nivel y los 4 ataques equipados. El torneo de habilidad pura.

Modo Berserker: el stat DEF se ignora para todos. Combates de 3-5 turnos. El Sintetico con Tormenta de Criticos es el meta dominante. Valida el valor de la DEF por contraste.

El Espejo: todos los participantes usan el mismo Geno base (stats y nivel identicos, sin genes). Solo los 3 ataques de los Slots 2, 3 y 4 marcan la diferencia. El torneo de conocimiento del catalogo de ataques.

Torneo del Fundador: solo Semillas Genesis y sus descendientes directos de primer nivel. Maximo 500 participantes posibles. El NFT de primer lugar es el activo mas escaso del juego.



### 8.2 El Ciclo Rotativo de 4 Semanas

Semana

Torneo principal

Torneo secundario

Meta activado

Premio destacado

Semana 1

Solo Comunes / Copa Raro

Liga Novatos

Genes de progresion y crianza S-D

Cosmético + EV

Semana 2

Liga Elemental Pura (elemento rotatorio)

Torneo Inverso

Genes G_ELEM y ataques del elemento

Item elemental + EV

Semana 3

El Gran Linaje

Torneo del Fundador (si hay participantes)

Genes de crianza y linaje on-chain

NFT emblema + EV

Semana 4

El Olimpo / Sin Genes / Modo Berserker / El Espejo (rotacion entre los 4)

Copa de los Dos Mundos

Situacional segun el torneo

NFT unico + EV alta



### 8.3 Calendario Semanal

Dia

Evento

Descripcion

Lunes

Anuncio oficial

Se anuncia el torneo con 7 dias de anticipacion. Tipo, restriccion, elemento (si aplica) y premios.

Lunes-Jue

Preparacion

Cambio de ataques en el Laboratorio de Implantes con 20% de descuento si son del elemento del torneo. Reconfiguracion del IFTTT gratis.

Miercoles

Registro abierto

Inscripcion del Geno. Ataques cambiables hasta el jueves 12:00 sin coste adicional.

Jueves 12:00

Cierre de inscripciones

Ataques y IFTTT quedan fijos. El jugador mejor preparado tiene ventaja.

Viernes

Inicio de combates

Los combates se resuelven con el sistema asincrono. Resultados al dia siguiente.

Domingo

Finalistas y premios

Top 3 recibe recompensas. Victorias registradas en Libro de Linaje. Puntos de temporada actualizados.



La ventana de preparacion de 7 dias es donde ocurre el meta real: debate en comunidad, pruebas en la Torre PvE, ajuste de ataques en el Laboratorio de Implantes y reconfiguracion del IFTTT. El torneo no empieza el viernes — empieza el lunes con el anuncio.



### 8.4 Mecánicas de los Torneos

Formato: eliminatoria de 16 participantes por bracket dentro de cada liga de rareza. Un Comun nunca compite contra un Legendario.

Emparejamiento: por IVs similares (Calificacion S-D) dentro de la misma rareza. Los mejores Genos se encuentran en semifinales y final.

Regla antiabuso: un Geno solo puede participar en UN torneo tematico por semana. No puede acumular todas las recompensas posibles.

Jefe de liga: el 15% de rivales de rareza superior da +15% XP extra al ser derrotado. Queda registrado en el Libro de Linaje.

Si hay menos de 8 inscritos en una liga, el bracket se reduce a 8. Si hay menos de 4, el torneo en esa liga no se celebra esa semana.



### 8.5 Sistema de Recompensas — 3 Capas

Capa 1 — Recompensas del torneo (inmediatas en EV)

Posicion

Torneo de Rareza

Torneo Elemental

El Olimpo / Fundador

Participacion

1er lugar

0.40 EV + cosmético

0.60 EV + item elemental

2.00-5.00 EV + NFT unico

—

2do lugar

0.20 EV

0.35 EV

1.00-2.50 EV

—

3er lugar

0.12 EV

0.20 EV

0.60-1.50 EV

—

Participacion

—

—

—

+5-15 XP segun torneo

Torneo Inverso

Base + 50%

Base + 50%

—

XP bonus extra



Capa 2 — Recompensas de linaje (permanentes en blockchain)

Gen Fama Genetica (FAME_G): cada victoria en torneo tematico queda registrada on-chain con nombre del torneo, semana, rival derrotado y posicion. El historial se vende con el Geno.

Gen Legado de Torneo (TOUR_L): cada torneo tematico ganado suma +0.5% al split de Scholarship del dueno (hasta 40% tras 20 victorias totales). Las victorias en torneos tematicos cuentan igual que las de liga.

El Olimpo y el Torneo del Fundador generan una entrada distinguida especial en el Libro de Linaje. La distincion mas valorada del marketplace.



Capa 3 — Recompensas de temporada (cada 12 semanas)

Puntos de temporada: participacion = 1 punto. Victoria de ronda = 2 puntos adicionales. Primer lugar = 5 puntos adicionales.

Top 10 de temporada: NFT cosmetico de temporada unico — no replicable ni comprable.

Campeon de temporada: el Geno con mas puntos recibe el titulo "Campeon Temporal T-[numero]" registrado on-chain. Solo existe uno por temporada en toda la historia del juego.

Control economico: si los torneos generan demasiada EV (RORS < 0.65), las entradas del siguiente ciclo suben automaticamente 10-20%.



### 8.6 Por Qué los Torneos Temáticos No Rompen el Balance

Las recompensas son en EV, no en $POL. El balance economico de la liga permanente en $POL no se ve afectado.

El Modo Berserker (sin DEF) existe exactamente 1 torneo cada 12 semanas. No invalida el stat DEF — lo valida por contraste.

El Torneo Sin Genes demuestra que el sistema de combate tiene profundidad independiente de los genes.

La rotacion semanal garantiza que ningun build domina permanentemente. El meta cambia cada 7 dias.

El ciclo virtuoso: el anuncio del lunes genera 4 sesiones activas en la semana (ver anuncio, ajustar ataques en el Laboratorio de Implantes, configurar IFTTT, consultar resultados). El torneo no es una funcion adicional — es el pegamento que da significado al Laboratorio de Implantes, al Escaner, al IFTTT y al Libro de Linaje.



11. Arquitectura Tecnica

Capa

Tecnologia

Contenido

Costo hasta 50K usuarios

Frontend

HTML / JS / CSS, PWA

Motor SVG, UI, animaciones, sistema de combate. Completadas Fases 1-2.

~$0 (en dispositivo del usuario)

Backend

Firebase / Supabase

Estado off-chain: inventario, XP, niveles, Libro de Linaje, ataques, DEF, genes, torneos.

~$0 (escalado automatico)

Blockchain

Polygon on-chain

Solo finanzas: NFT, $POL, smart contracts scholarships, prize pools, victorias de torneo.

Gas fees del usuario



NUNCA estado de juego on-chain. Solo finanzas on-chain. El stat DEF, los ataques equipados, los combates y los torneos se gestionan en el backend off-chain. Solo las victorias registradas en el Libro de Linaje van on-chain.



## 9. Genopedia — Índice del GitBook V12

### Capítulo 1 — Bienvenido al Laboratorio

Vision del Juego: que es Proyecto Genos y por que es diferente.

La Semilla Genesis y El Hongo Fundador.

Primeros Pasos: conectar wallet y reclamar tu primer Geno.

Mecanica Gordo y Generacion Procedural de Accesorios PvE.



### Capítulo 2 — Economia de Supervivencia

Mochila e Inventario: slots, limites estrictos (99/20/1) y gestion del espacio.

Modo Arcade: Lluvia de Manzanas. Consume 5 de Energia Nexo.

Esencia Vital, diferencia con $POL y Cosecha de EV pasiva (Moneda Flotante).

El Sistema de Energia Nexo y Resistencia Individual.

Cuidado Diario (Estilo Pou): Hambre, Diversion, Higiene y Amistad. Cuidado en reserva.

Consumibles del Bazar: Racion Automatica (🍱) y Ducha de Plasma (🧼).

La Plaza de Comercio: comprar y vender Genos. Comision 2-5%.



### Capítulo 3 — Genetica y Rol

Rarezas y Calificacion S-D: de Comun a Mitico.

Los 5 Stats: HP, ATK, SPD, LUK y DEF. Rangos por rareza.

Libro de Linaje: pedigri en blockchain.

El Sistema de 3 Slots y el Sistema de Dos Dados. Los Comunes Anomalia.

Herencia Activa en Breeding: 30%/75%/70%.

Los 83 Genes y los 35 Combos: catalogo completo.



### Capítulo 4 — Afinidad y Combate

Los 6 Elementos: ciclo Bio>Sin>Tox>Rad>Cib>Viral. Multiplicadores x1.35/x0.75.

Afinidad Genetica STAB x1.20: como funciona y que ataques lo reciben.

Los 4 Slots de Ataque. Los 3 Definitivos por elemento y los mind games.

Los 60 Ataques Especiales: catalogo y como aprenderlos en el Laboratorio de Implantes.

Los 11 Estados de Combate. Reglas de acumulacion.

Matchmaking Estricto V13.9: 85% misma rareza, 15% Jefe de liga.

Ligas Escalonadas: Bronce a Diamante.

Torneos Tematicos: los 12 tipos, el ciclo de 4 semanas y las recompensas.



### Capítulo 5 — Ecosistema de Quema

El Santuario Genetico: freno anti-bots (3/dia, 48h cooldown).

El Reactor Genetico: 5 Genos + EV. Los 4 resultados.

La Tienda de Esencia y el Laboratorio de Implantes (Ataques).



### Capítulo 6 — Economia Web3 y Mercado

El uso de $POL: micro-transacciones, expansiones. ~$10 = mucho.

Sistema de Becas (Scholarships): guia 70/30 para propietarios y jugadores.

La Plaza de Comercio: como listar Genos y maximizar precio de venta.

Peg al Dolar: por que los precios no cambian aunque $POL suba o baje.

---

## 10. Especificaciones Económicas Detalladas (Motor PvE, Reactor, Web3 y F2P)
*Este capítulo transcribe en su totalidad y de forma oficial el pliego de condiciones del balance macroeconómico del proyecto.*

PROYECTO GENOS
Documento Maestro de Especificaciones Economicas
Motor PvE  ·  Reactor de Fusion  ·  Ciclo del Jugador F2P  ·  Ecosistema Web3
Version 1.4  |  Documento consolidado y definitivo  |  Confidencial
 
Alcance de este documento
Este documento unifica y consolida todos los documentos economicos anteriores de Proyecto Genos.
Cubre: arquitectura y escala de la moneda EV, principios psicologicos del sistema de recompensas,
todas las fuentes de ingreso PvE, logistica de crianza y almacen, el Reactor de Fusion con sus
probabilidades completas, los sistemas de retencion, el Pase de Batalla, el ecosistema Web3 de
encapsulacion de EV, y la auditoria matematica del ciclo de vida del jugador F2P.
Sirve como manual tecnico de referencia para el equipo de desarrollo (Supabase, backend, smart contracts).
 


=== Seccion 1 — Filosofia de escala matematica y arquitectura de la moneda EV ===

 
La Esencia Vital (EV) es la moneda interna y universal de Proyecto Genos. Toda la economia del juego utiliza una escala uniforme de multiplicacion por 100 sobre los valores base originales. Esta decision no es estetica: tiene un fundamento psicologico, matematico y de negocio preciso.
 


=== 1.1  Los tres principios psicoeconomicos de la escala x100 ===

 
Principio 1 — Eliminacion de decimales: El cerebro humano procesa los numeros enteros grandes como botines de guerra reales. Ganar 250 EV activa el mismo circuito de recompensa que ganar una cantidad sustancial. Acumular 2.5 EV genera percepcion de miseria y lentitud, lo que reduce la retencion.
 
Principio 2 — Percepcion de inversion fuerte: Un coste de 10,000 EV para aprender un ataque Definitivo en el Laboratorio de Implantes comunica inmediatamente que el jugador esta adquiriendo un activo de alto valor estrategico que requiere dedicacion real. El mismo coste en 100 EV parece trivial y erosiona la sensacion de logro.
 
Principio 3 — Granularidad de recompensa: Trabajar con cientos y miles permite aplicar micro-bonificaciones por rendimiento excelente (combos perfectos, rachas, ventajas elementales, velocidad en misiones) sin romper la macroeconomia ni forzar al backend a manejar decimales.
 


=== 1.2  Ratio de Retorno de Sumideros (RORS) ===

El equilibrio macroeconomico del juego esta blindado en un RORS de 0.81. Esto significa que por cada unidad de EV que el sistema genera y pone en circulacion, el conjunto de sumideros (sinks) diseados absorbe el 81% de vuelta. El 19% restante se acumula de forma natural en las cuentas de los jugadores, generando una inflacion controlada y gradual que no compromete el valor percibido de la moneda.
El RORS no cambia al aplicar la escala x100 porque multiplica tanto los ingresos como los sumideros por el mismo factor. El equilibrio matematico subyacente es identico; solo cambia la percepcion psicologica del jugador.
 


=== 1.3  Tabla comparativa de escala: ingresos ===

La siguiente tabla muestra todos los valores de ingreso en EV antes y despues de aplicar la escala x100, con su fuente exacta dentro del juego:
 
Accion de juego (fuente de ingreso)
EV original (base)
EV nuevo (x100)
Victoria en Liga Bronce (PvP)
2 EV
200 EV
Victoria en Liga Diamante (PvP)
5 EV
500 EV
Derrota en Liga (PvP)
0.5 EV
50 EV
Cuidado diario por Geno (cap 3 activos)
0.5 EV
50 EV
Victoria estandar en Arcade (media)
1.5 EV
150 EV
Combate en Torre PvE (pisos iniciales)
1-2 EV
100-200 EV
Santuario Comun
3 EV
300 EV
Santuario Legendario
50 EV
5,000 EV
Torneo Tematico (1er lugar)
40-500 EV
4,000-50,000 EV
 


=== 1.4  Tabla comparativa de escala: sumideros (sinks) ===

Los sumideros son los mecanismos que retiran EV de circulacion, controlando la inflacion de forma organica:
 
Mecanica de consumo (sink)
EV original (base)
EV nuevo (x100)
Activacion Reactor Nivel 1 (Comun a Raro)
50 EV
5,000 EV
Activacion Reactor Nivel 2 (Raro a Epico)
150 EV
15,000 EV
Activacion Reactor Nivel 3 (Epico a Legendario)
300 EV
30,000 EV
Laboratorio de Implantes: aprender Ataque Basico
10 EV
1,000 EV
Laboratorio de Implantes: aprender Ataque Especial (Slot 2)
40 EV
4,000 EV
Laboratorio de Implantes: aprender Ataque Definitivo (Slot 3)
100 EV
10,000 EV
Escaner de ADN Basico
15 EV
1,500 EV
Escaner de ADN Completo
50 EV
5,000 EV
Recarga de Energia de un Geno
20 EV
2,000 EV
Licencia de Comercio Web3 (Bazar Nv.5)
30 EV
3,000 EV
Entrada a Torneo Tematico
5-200 EV
500-20,000 EV
Incubadora Basica (eclosion 4 horas)
10 EV
1,000 EV
Ranura de almacen N.7
15 EV
1,500 EV
Ranura de almacen N.8
30 EV
3,000 EV
 
 


=== Seccion 2 — Limites del sistema: Energia Nexo y cap diario ===

 
La contencion de la inflacion de la moneda EV se gestiona de forma automatizada mediante dos variables estructurales en el backend. Este disenyo evita bloquear pantallas de forma antipática para el jugador: el propio ritmo de juego actua como regulador natural.
 


=== 2.1  El embudo de la Energia Nexo ===

Parametros tecnicos de la Energia Nexo
Capacidad maxima de la cuenta: 100 puntos de Energia Nexo (inmutable).
Tasa de regeneracion pasiva: 1 punto cada 12 minutos = 5 puntos por hora.
Recarga completa de 0 a 100: requiere exactamente 20 horas de tiempo real.
Coste por Arcade: 5 Energia Nexo por partida.
Coste por Coliseo estandar o Torre: 10 Energia Nexo por combate o ticket.
 
Al estar todas las actividades generadoras de EV ligadas a un coste de Energia Nexo, el tiempo actua como el regulador automatico de la base de datos. Un jugador hardcore que optimice sus sesiones en un ciclo completo de 24 horas jamas podra generar mas de 5,000 a 6,000 EV al dia mediante juego activo. Este es el Soft Cap natural del sistema.
 


=== 2.2  Blindaje del Cuidado Diario (colecciones grandes) ===

El juego fomenta que los jugadores expandan su inventario y almacenen grandes cantidades de Genos esperando ser sacrificados en el Reactor. Sin una limitacion especifica, un jugador con 20 o 30 Genos podria usar su coleccion como una granja pasiva de clics automaticos, rompiendo la economia.
 
Regla del Cap Diario de Cuidado (Account-wide EV Cap): Una cuenta solo puede extraer un maximo de 150 EV al dia mediante las interacciones del Centro de Cuidado (Alimentacion, Higiene, Caricias). Esto equivale exactamente al pago de cuidar a 3 Genos Activos (50 EV por criatura).
 
Logica del Baul de Reserva: Los Genos almacenados en las ranuras de reserva reducen sus necesidades fisicas 5 veces mas despacio. El jugador puede interactuar con ellos para cuidar su higiene y alimentarlos (requisito para que esten sanos al fusionarse en el Reactor), pero una vez que el contador global de la cuenta llega a 150 EV diarios, el sistema actualiza sus estadisticas de salud pero devuelve 0 EV, mostrando el aviso en pantalla: +0 EV (Limite diario alcanzado).
 
 


=== Seccion 3 — Catalogo tecnico de minijuegos (Arcade) ===

 
El Arcade es el entorno libre de riesgo competitivo donde el jugador convierte su Energia Nexo y su habilidad manual en EV. Es la fuente de ingreso mas accesible del juego y la principal puerta de entrada para jugadores F2P. Todas las modalidades estan calibradas para que una partida exitosa rinda una media estandar de aproximadamente 150 EV a cambio de 5 puntos de Energia Nexo.
 
Parametros globales del Arcade
Coste de entrada: 5 Energia Nexo por partida (cualquier modalidad).
Duracion media por partida: 30 a 45 segundos de juego activo.
Recompensa media calibrada: ~150 EV por partida exitosa.
Paridad energetica: 2 partidas de Arcade = 1 combate en el Coliseo (en energia y recompensa).
 


=== 3.1  Lluvia de Manzanas ===

•      Mecanica: Manzanas y amenazas caen verticalmente desde la parte superior de la pantalla. El jugador desplaza a su Geno lateralmente para atraparlas y esquivar las bombas.
•      Sistema de 3 vidas: el jugador comienza con 3 puntos de vida. Pierde una vida si una manzana toca el suelo sin ser atrapada, o si recoge una Bomba de forma accidental. La partida termina al llegar a 0 vidas.
 


=== Curva de velocidad exponencial ===

•      Segundos 0 a 30: ritmo asequible y constante. El jugador aprende el patron.
•      Segundo 30: la velocidad de caida de todos los objetos aumenta un 50% de forma brusca.
•      Segundo 45: la velocidad aumenta otro 100% adicional, haciendo fisicamente imposible prolongar la partida de forma indefinida.
•      Este sistema garantiza que incluso el jugador experto no pueda farmear EV infinitamente en una sola partida.
 


=== Sistema de recompensas ===

•      Monedas de EV flotantes: caen aleatoriamente durante la partida. Valor: +5 EV (moneda pequena) y +10 EV (moneda grande).
•      Conversion de Alimento (sumidero circular): el juego cuenta las manzanas biologicas atrapadas. Por cada 5 manzanas normales recolectadas, se inyecta automaticamente 1 Manzana de Alimento en el inventario global de la mochila del jugador (ratio 5:1).
 


=== Rendimiento esperado ===

•      Jugador promedio: dura hasta el segundo 30-35 y extrae entre 120 y 150 EV por partida.
•      Jugador experto: estira sus reflejos hasta el segundo 50 y puede extraer hasta 250 EV por partida.
 


=== 3.2  Flappy Geno ===

•      Mecanica: control de salto de un boton para hacer levitar al Geno a traves de los huecos vacios de tuberias en movimiento horizontal constante.
•      La EV esta fisicamente suspendida en el centro de los huecos de los tubos, obligando al jugador a arriesgar su posicion para recogerla.
 


=== Algoritmo de recompensas en cascada ===

El valor del EV se incrementa con la distancia recorrida para premiar la supervivencia extrema:
 
Rango de tuberias
Dificultad
Descripcion
EV por tubo superado
Tubos 1 a 10
Baja
Ritmo introductorio, huecos amplios, velocidad constante.
10 EV / tubo
Tubos 11 a 20
Media
Los huecos se estrechan. La velocidad horizontal aumenta.
20 EV / tubo
Tubos 21 en adelante
Hardcore
Los tubos ejecutan movimientos verticales oscilatorios aleatorios.
50 EV / tubo
 
El punto de muerte estadistica de la comunidad se situa entre el tubo 10 y el 13, garantizando que el coste de 5 de Energia Nexo entregue aproximadamente las 150 EV presupuestadas. Un jugador experto que llegue al tubo 20 obtiene hasta 300 EV, recompensando la habilidad sin romper el equilibrio.
 


=== 3.3  Juego de Memoria ===

•      Mecanica: tablero cerrado de 16 cartas (matriz de 4x4) con 8 pares de elementos geneticos tematizados. Las cartas se muestran boca abajo y el jugador las voltea de dos en dos buscando las coincidencias exactas.
•      El minijuego incluye un cronometro de 45 segundos en retroceso visible para el jugador.
 


=== Algoritmo de recompensas por eficiencia mental ===

•      Premio base por victoria: si el jugador descubre los 8 pares antes de que el reloj llegue a cero, recibe 100 EV fijos como pago base.
•      Bono de velocidad excedente: cada segundo restante en el cronometro en el momento exacto de completar el tablero se liquida a +5 EV por segundo.
 
Ejemplo de calculo: jugador completa la matriz con 10 segundos restantes:
 
Calculo del bono de velocidad
Premio base:          100 EV
Bono de velocidad:    10 segundos x 5 EV = 50 EV
Total de la partida:  150 EV  (media esperada con rendimiento estandar)
 
•      Consolacion por derrota (anti-frustracion): si el tiempo expira antes de completar el tablero, el backend otorga 10 EV por cada par correcto que haya alcanzado a descubrirse. El jugador nunca se queda con las manos vacias.
 
 


=== Seccion 4 — Combate estandar del Coliseo (vs. IA) ===

 
El Coliseo es el entorno de simulacion tactica donde el jugador pone a prueba las configuraciones IFTTT de sus criaturas en duelos directos contra la inteligencia artificial del servidor. Para mantener la paridad exacta con el Arcade, este modo duplica el coste de entrada en Energia Nexo y, por ende, duplica el retorno financiero base.
 
Costes de entrada al Coliseo
Energia Nexo de la cuenta: 10 puntos por combate (el doble que el Arcade).
Resistencia biologica del Geno participante: 20 puntos por combate.
La resistencia del Geno es independiente de la Energia Nexo de la cuenta.
 


=== 4.1  Modalidad 1 vs 1 (Duelo singular) ===

•      Victoria: 300 EV. Paridad milimetrica con el Arcade: equivale a jugar dos partidas perfectas de Arcade pero en un formato de combate mas agil y directo.
•      Derrota: 50 EV. Consolacion minima que cubre el esfuerzo del tiempo invertido. Este subsidio bloquea el abuso de bots que busquen rendirse en bucle para farmear EV de forma pasiva, ya que el retorno es demasiado bajo para justificar el gasto de energia.
 


=== 4.2  Modalidad 3 vs 3 (Combate por equipos) ===

La complejidad de gestionar tres scripts de condiciones IFTTT y la mayor duracion del combate no multiplica el premio por tres para evitar la hiperinflacion del sistema. Se aplica un multiplicador de complejidad moderada de x1.5 sobre el pozo base del 1v1:
 
Modalidad
Formula
Victoria
Derrota
1 vs 1 (Duelo singular)
Base
300 EV
50 EV
3 vs 3 (Combate por equipos)
Base x 1.5
450 EV
75 EV
 
 


=== Seccion 5 — Torre de Mutacion (Supervivencia lineal unica) ===

 
La Torre de Mutacion funciona bajo una estructura roguelike de escalada infinita por pisos donde la salud residual y el dano acumulado de los Genos se arrastran de forma persistente entre rondas. Es el modo de juego mas exigente del PvE y el que ofrece las mayores recompensas individuales por piso.
 


=== 5.1  El ticket de entrada y la logica de sesion ===

•      El jugador paga 10 de Energia Nexo una unica vez para adquirir un Ticket de Tanda.
•      Mientras su Geno gane el combate y conserve puntos de vida, el jugador permanece dentro de la Torre de forma gratuita, avanzando pisos de forma consecutiva sin coste adicional.
•      En el momento en que el jugador decide salir voluntariamente o su criatura es derrotada, la tanda se cierra por completo. Para reingresar en el futuro, se debe pagar un nuevo ticket de 10 de Energia Nexo.
 


=== 5.2  La regla de oro economica: bloqueo de pisos superados ===

Para evitar que jugadores avanzados usen Genos de rarezas altas para farmear EV masiva y facilmente en los pisos iniciales, se implementa un bloqueo permanente:
 
Bloqueo de pisos en Supabase
Cada piso completado con exito se registra en la variable max_floor de la tabla de perfiles.
El EV de un piso especifico solo puede reclamarse una unica vez en toda la vida de la cuenta.
Este bloqueo es irreversible e inmutable. No existe mecanismo de reset para un piso ya superado.
 


=== 5.3  Retirada voluntaria vs. muerte en combate ===

Al terminar cada piso, el sistema muestra la salud actual del Geno y el peligro del siguiente nivel, forzando al jugador a tomar una decision financiera consciente:
 
•      Retirada voluntaria (asegurar botin): el jugador pulsa el boton de salida. El backend entrega el 100% de toda la EV acumulada durante los pisos de esa tanda.
•      Muerte en combate (pena por codicia): si el jugador arriesga al Geno y este es derrotado, la tanda colapsa. El sistema aplica una penalizacion: solo se rescata el 50% del EV acumulado en esa carrera. El otro 50% se destruye.
•      Accesorios cosmeticos: los accesorios fisicos obtenidos de los jefes (Bosses) quedan asegurados siempre. No pueden perderse ni por muerte ni por retirada.
 


=== 5.4  Sistema de Checkpoints y sectores de control ===

Para evitar la frustracion de repetir contenido trivial y eliminar el riesgo de soft-lock (bloqueo absoluto sin salida), la Torre implementa Checkpoints cada 10 pisos vinculados al rango genetico de los enemigos:
 
Ejemplo de funcionamiento del Checkpoint
Situacion: el jugador tiene su record en el Piso 17 y muere en un intento posterior.
Sin Checkpoint: el jugador tendria que empezar desde el Piso 1 (pisos ya bloqueados = 0 EV disponible).
Con Checkpoint: al comprar su siguiente ticket, el sistema lee que el ultimo Checkpoint desbloqueado
fue el Piso 10, y le permite reanudar directamente desde el Piso 11. Esto le da pisos seguros
(11, 12, 13) para farmear algo de EV limpio antes de volver a enfrentarse a su muro personal.
 


=== 5.5  Tabla completa de premios por piso ===

Cada fila representa un bloque de pisos con sus enemigos correspondientes, el EV reclamable una unica vez, y los eventos especiales:
 
Sector
Pisos
Enemigo IA (calidad)
EV neto unico
Evento especial
Fase Comun Inicial
1-9
Comun (Rango D a A con taras)
100 EV / piso
—
Jefe del Nexo
10
Comun (Rango A+ / Miniboss)
400 EV
Drop accesorio procedural
Fase Comun Avanzada
11-19
Comun (Rango B a S Perfecto)
200 EV / piso
—
Gran Guardian
20
Comun (Rango S / Boss de Bloque)
800 EV
Drop accesorio procedural
Fase Comun Critica
21-25
Comun (Rango S Combinados)
300 EV / piso
—
Fase Rara de Ascension
26-29
Raro (Rango D a C / Salto de Stats)
500 EV / piso
—
Jefe Raro
30
Raro (Rango B / Miniboss de Bloque)
900 EV
Drop accesorio procedural + Checkpoint 3
Los pisos 26-29 presentan un salto de dificultad notable (enemigos Raros) que justifica el aumento de 300 a 500 EV por piso. El jugador que llegue al Piso 30 habra demostrado tener un Geno de calidad competitiva y recibe 900 EV + el Checkpoint 3 como recompensa al nivel del esfuerzo.
 
 


=== Seccion 6 — Sistemas de retencion y progresion pasiva ===

 
Para afianzar la retencion a corto, mediano y largo plazo, se implementan cinco capas de incentivos economicos fijos que recompensan la constancia y dan utilidad a la totalidad de la coleccion de Genos del jugador.
 


=== 6.1  Ciclo de Racha de Login (7 dias) ===

Recompensa la conexion diaria consecutiva. Si el jugador no inicia sesion en un intervalo de 24 horas, el backend resetea el progreso de forma obligatoria al Dia 1. El reinicio crea urgencia de retorno sin castigar con perdida de activos al jugador que vuelve.
 
Dia del ciclo
Recompensa en EV
Bonus adicional
Razon de diseno
Dia 1
100 EV
—
Barrera de entrada baja. Facil de completar.
Dia 2
150 EV
—
Escalado gradual que recompensa la vuelta al dia siguiente.
Dia 3
200 EV
1 Racion de Comida Basica
Primer bonus fisico que refuerza el loop de cuidado.
Dia 4
250 EV
—
Mitad del ciclo: el jugador ya esta comprometido.
Dia 5
300 EV
—
La recompensa crece de forma apreciable. Tension positiva.
Dia 6
400 EV
1 Ducha de Plasma
Segundo bonus fisico. Un dia mas y llega el gran premio.
Dia 7 (Hito semanal)
1,000 EV
1 Caja de Escaner de ADN Basico
Pago maximo. Recompensa el compromiso semanal completo.
 


=== 6.2  Pase de Batalla mensual (Puntos de Mutacion) ===

El Pase de Batalla es un contrato de recompensas mensual de 50 niveles basado en la acumulacion de Puntos de Pase (PP). Los PP se obtienen exclusivamente a traves del panel de misiones diarias y semanales, garantizando que el avance en el Pase sea siempre un reflejo del juego activo y no de una billetera.
 


=== Ruta gratuita (disponible para todos los jugadores) ===

•      Ofrece recompensas intercaladas cada 2 niveles, enfocadas en el mantenimiento diario y la progresion organica.
•      Tipos de recompensa: paquetes de 200 EV, consumibles de higiene (duchas, banos de plasma), raciones de alimento basico.
•      Nivel 25 (hito estrategico): el jugador recibe gratuitamente 1 unidad del Estabilizador Atomico. Esto es un regalo deliberado para que pruebe su efecto antes de una fusion de alto riesgo, rompiendo la barrera psicologica de compra.
 


=== Ruta premium (desbloqueable con $POL) ===

•      Desbloquea la fila inferior del contrato de recompensas del Pase.
•      Introduce inyecciones masivas de 1,000 EV por nivel de Pase completado.
•      Acceso a planos de accesorios esteticos de edicion limitada (exclusivos del mes en curso).
•      Skins exclusivas para personalizar el entorno visual del Laboratorio del jugador.
 


=== Obtencion de Puntos de Pase (PP) ===

Fuente de PP
PP obtenidos
Frecuencia
Cada mision diaria completada
10 PP
3 misiones disponibles al dia
Cofre de bonificacion diario (3/3 misiones)
PP incluidos en cofre
1 vez al dia
Cada mision semanal completada
50 PP
3 misiones disponibles a la semana
 


=== 6.3  Panel de misiones diarias y semanales ===

El panel de misiones obliga al jugador a diversificar su actividad paseandose por todas las mecanicas del cliente, evitando que se especialice en una sola fuente de EV y abandone el resto del contenido.
 


=== Misiones diarias (reseteo automatico cada 24 horas) ===

Cada mision individual completada otorga 100 EV + 10 Puntos de Pase (PP). Al completar las 3 actividades del dia, el sistema libera automaticamente un Cofre de Bonificacion Diario con 300 EV adicionales.
 
Mision diaria
Descripcion
Recompensa individual
El Buen Criador
Satisfacer las necesidades de higiene o alimentacion de 3 Genos en el menu de Cuidado.
100 EV + 10 PP
Rey del Arcade
Completar con exito 3 partidas en cualquiera de los minijuegos activos del Arcade.
100 EV + 10 PP
Sangre en la Arena
Cerrar con victoria 2 combates contra la IA en el Coliseo Estandar.
100 EV + 10 PP
 
Completar las 3 misiones diarias suma 300 EV + 300 EV del cofre = 600 EV fijos garantizados al dia para cualquier jugador activo, independientemente de su habilidad o progresion.
 


=== Misiones semanales (reseteo automatizado cada lunes) ===

Retos de mayor complejidad y exigencia tactica. Cada mision semanal completa entrega 500 EV + 50 PP.
 
Mision semanal
Descripcion
Recompensa
Escalador Tactico
Superar 5 pisos nuevos no bloqueados en la Torre de Mutacion.
500 EV + 50 PP
Maestro Genetico
Ejecutar de forma valida 1 proceso de fusion en el Reactor (quemar 5 criaturas).
500 EV + 50 PP
Inversionista del Laboratorio de Implantes
Intercambiar un minimo de 2,000 EV dentro del Laboratorio de Implantes o en el Bazar.
500 EV + 50 PP
 


=== 6.4  Expediciones pasivas (Utilidad del Baul) ===

Disenadas especificamente para dar una salida de juego valiosa a las criaturas debiles que estan almacenadas en el baul esperando ser acumuladas para fusiones. Permiten al jugador sentir que toda su coleccion, incluyendo los Genos mas debiles, esta trabajando para el.
 
•      El jugador envia Genos de su reserva a misiones de exploracion en el mapa exterior. Hay tres ventanas de tiempo real seleccionables: 4 horas, 8 horas o 12 horas.
•      Mientras el Geno esta en expedicion, queda totalmente congelado en la base de datos. No puede seleccionarse para combatir, cuidarse, ni usarse como sacrificio en el Reactor.
•      Retorno al regresar: el Geno consume automaticamente el 50% de su barra de Resistencia, pero entrega al usuario un botin fijo de 300 EV + probabilidad procedural de rescatar items consumibles raros para la mochila.
 


=== 6.5  Sistema de logros unicos de cuenta (Achievements) ===

Hitos inmutables ligados al progreso historico del perfil que se completan una sola vez en la vida util del jugador. Actuan como el combustible financiero definitivo para apoyar al usuario en las transiciones criticas de su experiencia (del Early Game al Mid Game y al Late Game):
 
Nombre del logro
Condicion de desbloqueo
Recompensa
Despertar Biologico
Conseguir dar a luz al primer Geno de rareza Rara en el Reactor.
5,000 EV
Combustion Masiva
Quemar un acumulado historico de 50 Genos en sacrificios de fusion.
5,000 EV
Veterano del Nexo
Registrar el codigo del Piso 25 de la Torre en el perfil de la cuenta.
5,000 EV + Titulo Honorífico para el Avatar
Los logros se activan una sola vez. Ademas de su valor en EV, sirven como marcadores de progresion que el jugador puede mostrar en su perfil y que actuan como indicadores sociales de experiencia dentro de la comunidad.
 
 


=== Seccion 7 — Logistica del almacen, crianza y componentes ===

 
Antes de poder fusionar Genos en el Reactor, el jugador debe producirlos y almacenarlos. Esta seccion describe los costes en EV y $POL que regulan la velocidad de reproduccion del servidor, crean tension estrategica de progresion y garantizan que la crianza requiera inversion activa en lugar de ser un proceso pasivo.
 


=== 7.1  Adquisicion de especimenes base ===

 


=== Compra directa en la tienda ===

•      Un Bio-Nucleo Comun (Nivel 1) cuesta 3,000 EV en la tienda del juego.
•      Conseguir los 5 especimenes necesarios para una primera fusion comprando todos en tienda cuesta 15,000 EV en total.
 


=== Crianza (Breeding) ===

•      Requisito minimo: dos Genos padres con al menos Nivel 10.
•      Limite de vida por Geno: 7 crias en total durante toda su existencia (contador permanente).
•      El coste de cada cria se calcula sumando el contador de hijos de ambos padres de forma exponencial, encareciendo el uso repetido de la misma pareja.
 
Tabla de costes de crianza para una pareja con contador 0/7 (ambos padres virgenes):
 
Numero de cria
Coste en EV
Coste acumulado con la pareja
1a cria
1,000 EV
1,000 EV
2a cria
1,500 EV
2,500 EV
3a cria
2,500 EV
5,000 EV
4a cria
4,500 EV
9,500 EV
5a cria
7,000 EV
16,500 EV
Criar 5 hijos con la misma pareja cuesta 16,500 EV, ligeramente mas caro que comprar 5 Bio-Nucleos en tienda (15,000 EV). Esto incentiva al jugador a mantener multiples parejas activas y usar solo los slots baratos de cada una (crias 1 y 2), manteniendo el engagement con el PvE de forma continua.
 


=== 7.2  Las incubadoras (freno temporal de produccion) ===

Todo Bio-Nucleo comprado en tienda o huevo producido por crianza requiere una incubadora para eclosionar. Las incubadoras se adquieren en el Bazar y existen dos variantes que cubren perfiles de jugador distintos:
 
Tipo de incubadora
Coste
Tiempo de eclosion
Perfil de jugador objetivo
Incubadora Basica
1,000 EV
4 horas (tiempo real)
F2P / Web2 (espera natural del loop)
Incubadora de Plasma
0.20 $POL
15 minutos o instantanea
Web3 / Pay-to-Fast (acelera sin ventaja)
La Incubadora de Plasma aplica el modelo Pay-to-Fast: no otorga ventajas de estadisticas sobre el Geno resultante. Solo acelera el tiempo de espera. Es un micropago accesible (0.20 $POL) que respeta la salud competitiva del juego y la regla de los $10 maximos de barrera economica.
 


=== 7.3  Ranuras del almacen (sistema de expansion progresiva) ===

El jugador inicia con 6 ranuras de almacen gratuitas. Estas 6 ranuras son suficientes para ejecutar la primera fusion sin necesidad de comprar ninguna ranura adicional: 5 Genos de sacrificio + 1 Geno activo del equipo.
 
El desbloqueo de ranuras adicionales es una decision libre y progresiva que el jugador tomara de forma natural cuando decida conservar mas Genos en paralelo, despues de su primera fusion y una vez que entienda su propia estrategia. No hay ninguna obligacion de comprar ranuras el primer dia.
 
Escala de costes de expansion del almacen:
 
Ranura
Coste en EV
Coste en $POL
Nota
Ranura 7
1,500 EV
—
Primera expansion. Muy accesible.
Ranura 8
3,000 EV
—
Equivale a un Bio-Nucleo extra.
Ranura 9
6,000 EV
0.50 $POL
Opcion hibrida: EV o micropago.
Ranura 10
12,000 EV
1.00 $POL
El gasto en EV ya es significativo.
Ranura 11 en adelante
15,000 EV (escala)
2.00 $POL (fijo)
A partir de aqui $POL es mas eficiente.
 
 


=== Seccion 8 — El Reactor Genetico y el item de estabilizacion ===

 
El Reactor es el gran destructor de cartas del juego y el destino final del ciclo PvE. Procesa fusiones consumiendo 5 Genos de la misma rareza mas una tasa de activacion fija en EV. Sus cuatro posibles resultados estan disenados para que ninguno sea una perdida total: incluso el peor escenario (Colapso) incluye un seguro que permite al jugador relanzar el ciclo rapidamente.
 


=== 8.1  Matriz de probabilidades base por nivel de fusion ===

 


=== Fusion Nivel 1: Comun a Raro (Tasa de activacion: 5,000 EV) ===

Resultado
Probabilidad
Descripcion breve
Exito Normal
35%
El jugador obtiene un Geno Raro a Nivel 1 limpio.
Mutacion Estancada
35%
Geno Comun+ con is_plus=true. +15% stats base y gen dominante.
Colapso
27%
Fallo. Reembolso automatico de 8,000 EV como seguro.
Exito Critico
3%
Salto directo a Epico (rareza +2). El mejor resultado posible.
 


=== Fusion Nivel 2: Raro a Epico (Tasa de activacion: 15,000 EV) ===

Resultado
Probabilidad
Descripcion breve
Exito Normal
25%
El jugador obtiene un Geno Epico a Nivel 1 limpio.
Mutacion Estancada
35%
Geno Raro+ con is_plus=true. Campeon de torneos de su categoria.
Colapso
39.5%
Fallo. Reembolso automatico de 25,000 EV como seguro.
Exito Critico
0.5%
Salto directo a Legendario. Rareza maxima del juego.
 


=== Fusion Nivel 3: Epico a Legendario (Tasa de activacion: 30,000 EV) ===

Resultado
Probabilidad
Descripcion breve
Exito Normal
5%
El jugador obtiene un Geno Legendario a Nivel 1 limpio.
Mutacion Estancada
40%
Geno Epico+ con is_plus=true. Estadisticas cercanas al Legendario.
Colapso
54.9%
Fallo. Reembolso automatico de 60,000 EV como seguro.
Exito Critico
0.1%
Rareza desconocida / Geno unico. Evento extremadamente raro.
La curva de dificultad entre niveles es intencional: las fusiones de Nivel 2 y 3 son retos de alto riesgo reservados para jugadores muy comprometidos o con respaldo economico en $POL. El Colapso supera el 50% en la Fusion de Nivel 3, convirtiendo el Estabilizador Atomico en un accesorio practicamente obligatorio para los jugadores serios.
 


=== 8.2  El Estabilizador Atomico (item premium) ===

Consumible acoplable al Reactor que mitiga el riesgo de Colapso sin eliminar la tension intrinseca del sistema de probabilidades.
 
Especificaciones del Estabilizador Atomico
Efecto: anade +5% de probabilidad de exito directo a la fusion activa.
Mecanismo exacto: el +5% se resta EXCLUSIVAMENTE de la tasa de Colapso (fallo destructivo).
No modifica las probabilidades de Mutacion Estancada ni de Exito Critico.
Precio en tienda premium: 1.00 $POL por unidad.
Distribucion gratuita: 1 unidad en el Nivel 25 de la ruta gratuita del Pase de Batalla.
 
Comparativa de probabilidades con y sin Estabilizador Atomico para Fusion Nivel 1:
 
Resultado
Sin estabilizador
Con estabilizador
Variacion
Exito Normal
35%
40%
+5%
Mutacion Estancada
35%
35%
Sin cambio
Colapso
27%
22%
-5%
Exito Critico
3%
3%
Sin cambio
 


=== 8.3  Logica completa de los 4 resultados en backend (Supabase) ===

Cuando el servidor ejecuta la fusion y el generador de numeros aleatorios del servidor determina el destino, Supabase procesa las siguientes acciones en cascada:
 
Resultado
Prob.
Qué recibe el jugador
Acciones en backend (Supabase)
Exito Normal
35%
Geno de rareza superior (Nivel 1 limpio)
Elimina los 5 Genos sacrificados. Genera nuevo Geno de rareza+1.
Mutacion Estancada
35%
Geno de la misma rareza de entrada con flag is_plus=true. +15% stats base ocultas y gen dominante activo.
Elimina los 5 Genos. Entrega especimen de misma rareza con is_plus=true a Nivel 1.
Colapso
27%
Reembolso inmediato en EV segun tabla de seguros. Los 5 Genos son destruidos.
Elimina los 5 Genos. Inyecta EV de seguro directamente en el saldo de la cuenta.
Exito Critico
3%
Salto de doble rareza (Comun directo a Epico). Material viral para redes sociales.
Elimina los 5 Genos. Genera Geno con rareza +2 sobre la de entrada a Nivel 1.
 
Tabla de seguros de reembolso por Colapso:
 
Nivel de fusion
EV reembolsado al instante
Justificacion del valor
Nivel 1 (Comun a Raro)
8,000 EV
Cubre exactamente el coste de una nueva tanda de crianza + incubadoras. Permite reintentar en 48h.
Nivel 2 (Raro a Epico)
25,000 EV
Cubre los materiales de una segunda tanda completa de crianza avanzada.
Nivel 3 (Epico a Legendario)
60,000 EV
Reduce el impacto de semanas de inversion perdida. Acorta el tiempo de recuperacion significativamente.
El reembolso por Colapso no es una limosna: es el mecanismo que convierte el peor resultado del juego en un retraso de 48 horas en lugar de un abandono permanente del jugador. Su calibracion es critica para la retencion a largo plazo.
 
 


=== Seccion 9 — Ecosistema Web3: Licencia de Comercio y Capsulas de EV ===

 
Esta seccion cubre la capa Web3 de la economia de Proyecto Genos: el puente controlado que permite a los jugadores F2P convertir su EV farmeable en $POL real a traves del Marketplace de la Plaza de Comercio, sin que la moneda interna pierda su naturaleza cerrada ni genere riesgos legales o economicos para el proyecto.
 


=== 9.1  Fundamento legal y economico del sistema ===

Por que este sistema es seguro y legal
La EV no tiene pool de liquidez en ningun DEX externo (Uniswap, QuickSwap, etc.).
La EV no puede transferirse fuera del ecosistema del juego ni convertirse directamente en dinero fiat.
Su precio en $POL lo determina exclusivamente la ley de oferta y demanda dentro del Marketplace interno.
Este modelo es identico al sistema WoW Token de Blizzard y al Grand Exchange de RuneScape, vigentes
durante mas de 10 anos sin conflictos legales. La EV es una mecanica de juego P2P, no un activo financiero.
IMPORTANTE: nunca describir publica ni internamente como 'inversion' ni prometer rendimientos.
 


=== 9.2  La Licencia de Comercio Web3 ===

La Licencia de Comercio es el requisito obligatorio para poder interactuar con el Marketplace Web3 y activar la wallet de Privy del jugador. Su diseno cumple dos funciones simultaneas:
 
•      Funcion 1: filtro de intencion. Solo los jugadores que realmente quieren comerciar en Web3 la adquieren. Los jugadores pasivos o casuales no la necesitan y no interactuan con el mercado.
•      Funcion 2: proteccion de costes de infraestructura. Cada activacion de wallet de Privy tiene un coste operativo para el servidor. La Licencia garantiza que ese coste solo se incurra para usuarios comprometidos que van a generar transacciones reales y, por lo tanto, comisiones del 3.5% para el proyecto.
 
Especificaciones de la Licencia de Comercio
Requisito de desbloqueo: alcanzar el Nivel 5 del Laboratorio (aproximadamente 7 a 10 dias de juego organico).
Coste en EV: 3,000 EV (identico al precio de un Bio-Nucleo Comun en tienda).
Razon del precio: el jugador que quiere comerciar debe demostrar el mismo nivel de compromiso
que alguien que va a criar su primer Geno. No es un muro frustrante, es un filtro de intencion.
Efecto al adquirirla: el juego activa la API de Privy y el jugador puede configurar su wallet.
Es un pago unico y permanente. No hay cuotas de renovacion.
 


=== 9.3  La encapsulacion de EV: mecanica y flujo completo ===

La encapsulacion es el proceso por el que un jugador convierte EV digital (saldo interno) en un item fisico transaccionable en el Marketplace Web3. Este proceso incluye un impuesto del 10% que actua como el principal sumidero deflacionario del sistema.
 


=== Regla del impuesto de encapsulacion ===

•      Para encapsular y vender 1,000 EV, el jugador debe pagar 1,100 EV de su saldo.
•      Los 100 EV de diferencia son destruidos permanentemente en el backend (quemados), reduciendo la masa monetaria total del servidor.
•      Este impuesto del 10% es automatico, irrevocable y no negociable.
 


=== Lotes fijos de capsulas en el Marketplace ===

Para evitar la fragmentacion de la base de datos y facilitar la compra rapida por parte de los jugadores Web3, solo se permiten lotes fijos estandarizados (4 tamanos de capsula):

| Tipo de capsula | EV que recibe el comprador | EV que paga el vendedor F2P | EV quemados (10% de impuesto) |
| :--- | :--- | :--- | :--- |
| Capsula de Esencia Comun | 5.000 EV | 5.500 EV | 500 EV destruidos |
| Capsula de Esencia Mayor | 10.000 EV | 11.000 EV | 1.000 EV destruidos |
| Capsula de Esencia Grande | 25.000 EV | 27.500 EV | 2.500 EV destruidos |
| Capsula de Esencia Gigante | 50.000 EV | 55.000 EV | 5.000 EV destruidos |

=== El item fisico: Geno_Essence_Capsule ===

•      Cuando el jugador paga los 5,500 EV (para la capsula comun), el backend descuenta ese saldo de su wallet interna y le entrega en su inventario un item semi-fungible: la Capsula de 5,000 EV.
•      Este item fisico es el que se publica en el Marketplace por el precio en $POL que el vendedor elija.
•      Cuando el comprador Web3 adquiere la capsula, el item es destruido y las 5,000 EV son inyectadas directamente en su saldo digital interno.
 


=== 9.4  El modelo de ingresos del Marketplace ===

Flujo de ingresos del 3.5% para el proyecto
Sobre cada venta de capsula en el Marketplace, el smart contract de GenosPlazaComercio retiene
automaticamente un 3.5% del $POL de la transaccion como comision para el proyecto.
Este 3.5% se aplica sobre el valor total en $POL de la venta, no sobre el EV.
El 3.5% es la principal fuente de ingresos operativos recurrentes del juego una vez en produccion.
CRITICO: esta logica debe vivir en el smart contract on-chain, no solo en el backend Firebase/Supabase.
Si la validacion de la Licencia y el cobro del 3.5% solo existen en el backend, pueden ser eludidos.
 
Controles anti-abuso integrados en el sistema:
 
Control
Mecanismo
Problema que previene
Barrera del Lab Nivel 5
Solo jugadores con Lab Nv.5 (7-10 dias de juego) pueden activar la Licencia.
Impide que bots creen cuentas y vendan EV desde el primer dia.
Impuesto del 10% por encapsulacion
Por cada 5,000 EV vendidos se queman 500 EV del vendedor.
Desincentiva la creacion masiva de capsulas y controla la inflacion.
Lotes fijos estandarizados
No se permiten cantidades arbitrarias. Solo 5,000 y 10,000 EV.
Evita el spam de micro-ventas que saturan la base de datos.
Licencia de Comercio: 3,000 EV
Filtro economico accesible pero no trivial para un jugador nuevo.
Separa a los comerciantes activos de los jugadores casuales.
 


=== 9.5  Ciclo economico completo del Marketplace ===

El siguiente flujo describe el ciclo completo desde que el jugador F2P genera EV hasta que el jugador Web3 la consume:
 
Flujo completo: F2P a Web3 a consumo
PASO 1 — JUGADOR F2P: juega PvE durante 7-10 dias, llega a Lab Nv.5, acumula EV.
PASO 2 — LICENCIA: paga 3,000 EV, activa su wallet Privy, accede al Marketplace.
PASO 3 — ENCAPSULACION: paga 5,500 EV, recibe una Capsula de 5,000 EV en su inventario.
    Los 500 EV de impuesto son destruidos permanentemente (deflacion).
PASO 4 — VENTA: publica la Capsula en el Marketplace por el precio en $POL que elija.
PASO 5 — COMISION: al venderse, el smart contract retiene 3.5% del $POL para el proyecto.
PASO 6 — JUGADOR WEB3: recibe la Capsula, la abre, 5,000 EV se inyectan en su saldo.
PASO 7 — CONSUMO: el jugador Web3 gasta las 5,000 EV en el Reactor Nv.2, el Laboratorio de Implantes, o fusiones.
    El EV vuelve a circular y eventualmente es destruido por nuevos sumideros.
 
 


=== Seccion 10 — Auditoria del ciclo de vida del jugador F2P ===

 
Esta seccion demuestra con matematica concreta que el bucle economico es justo, fluido y no frustrante para un jugador completamente gratuito. Analiza los primeros 12 dias de juego sin gastar ningun $POL.
 
Supuestos base de la auditoria
Generacion diaria: 4,000 EV por sesion completa (media documentada en la Seccion 11).
El jugador inicia con 6 ranuras de almacen gratuitas y 1 Geno de partida.
Cero gastos en $POL. Todo se paga en EV.
Los caminos de gasto son libres: no existe orden obligatorio. Cada jugador adapta su estrategia.
La auditoria asume el camino de fusion mas rapido posible para demostrar el caso favorable.
 


=== 10.1  Resumen del ciclo en tabla ===

Fase
Dias
EV generado
Gasto principal
EV final
Inicio y exploracion
1-3
12,000 EV
Variable segun estrategia elegida por el jugador
~8,000-12,000 EV
Crianza de los 5 Genos
4-7
+16,000 EV
Tasas crianza ~7,000 + incubadoras 5,000
~1,500-4,000 EV
Primera fusion
8-10
+12,000 EV
Tasa Reactor Nv.1: 5,000 EV
~8,500 EV
Reintento si Colapso
11-12
+4,000 EV/dia
Crianza 7,000 + incubadoras 5,000 + Reactor 5,000
~3,500 EV
 


=== 10.2  Desglose por fases ===

 


=== Fase 1: Inicio y exploracion (Dias 1 a 3) ===

•      El jugador explora la Energia Nexo en el Arcade y el Coliseo IA, completa misiones diarias, y aprende el loop basico del juego.
•      Balance acumulado al final del Dia 3: aproximadamente 12,000 EV.
•      Decisiones opcionales en esta fase: comprar ranuras adicionales, ensenar ataques en el Laboratorio de Implantes, adquirir Bio-Nucleos en tienda. Ninguna es obligatoria para llegar a la primera fusion con las 6 ranuras base.
•      Los 6 slots gratuitos cubren exactamente lo necesario: 5 Genos de sacrificio + 1 Geno activo.
 


=== Fase 2: Crianza (Dias 4 a 7) ===

•      Los primeros Genos alcanzan Nivel 10 de forma natural combatiendo. El jugador comienza a cruzarlos para producir los 5 Genos de sacrificio.
•      Estrategia optima: usar solo las crias 1 y 2 de cada pareja (las mas baratas) rotando multiples parejas en lugar de agotar una sola.
•      Las incubadoras de 4 horas crean el primer momento de expectacion genuina del ciclo: el jugador ve sus temporizadores activos.
 


=== Fase 3: Primera fusion (Dias 8 a 10) ===

•      Los 5 Genos Comunes eclosionan. El jugador farmea 3 dias adicionales y llega al Reactor con suficiente EV para la tasa de 5,000 EV y conservar un colchon de seguridad.
 
Analisis de los 4 posibles resultados el Dia 10:
 
Exito Normal o Critico (38% de probabilidad)
Obtiene un Geno Raro o Epico en 10 dias de juego F2P puro.
Con las 8,500 EV restantes puede entrenar a su nuevo campeon en el Laboratorio de Implantes al dia siguiente.
Retencion esperada: muy alta. El jugador tiene exactamente lo que vino a buscar.
 
Mutacion Estancada (35% de probabilidad)
Recibe un Geno Comun+ con +15% de estadisticas base ocultas y un gen dominante.
No es una derrota: es un especimen de edicion especial, mas fuerte que cualquier Comun normal.
Es competitivo en torneos de su categoria y un excelente padre de crianza.
El jugador lo equipa, avanza en la Torre y espera el siguiente torneo de Comunes para competir por $POL.
Retencion esperada: alta.
 
Colapso (27% de probabilidad - el peor escenario)
Los 5 Genos son destruidos. Hay un impacto emocional inmediato.
El Reactor reembolsa 8,000 EV al instante como seguro automatico.
Las EV guardadas (~8,500) + el seguro = 16,500 EV liquidas disponibles de inmediato.
El ciclo de reintento completo (crianza + incubadoras + tasa Reactor) cuesta ~17,000 EV.
Resultado: el jugador puede reintentar la fusion en solo 48 horas, no en otros 10 dias.
 


=== Fase 4: Segunda oportunidad (Dias 11 y 12, solo si hubo Colapso) ===

•      Dia 11: el jugador se despierta con 16,500 EV. Farmea su sesion habitual: 20,500 EV disponibles.
•      Paga una nueva tanda de crianza (~7,000 EV) y 5 incubadoras (5,000 EV). Le quedan ~8,500 EV.
•      CLAVE: las ranuras de almacen ya estan compradas. No hay ningun coste adicional de infraestructura.
•      Dia 12: los huevos eclosionan en 4 horas. El jugador farmea (4,000 EV) y ejecuta su segundo intento de fusion 48 horas despues del primero.
El segundo intento ocurre 48 horas despues del primer fallo, no 10 dias. Este es el argumento matematico mas solido contra el abandono del jugador F2P tras un Colapso.
 


=== 10.3  Los tres arquetipos de jugador F2P ===

El diseno soporta multiples rutas estrategicas sin que sea necesario codificar caminos separados. Tres arquetipos emergen de forma natural con la misma arquitectura economica:
 
Arquetipo
Estrategia
Primer fusion
Ventaja principal
El fusionador rapido
Sacrifica todo incluyendo su campeon inicial. Maximiza la velocidad al Reactor.
Dia 8-10
Llega al Raro mas rapido. Alto riesgo.
El conservador
Preserva su mejor Geno. Cria con los demas. Fusiona en paralelo.
Dia 12-15
Siempre tiene un campeon activo. Progresion mas lenta pero mas estable.
El explorador de Torre
Prioriza la Torre para acumular mas EV antes de tocar el Reactor.
Dia 15-20
Llega con mas colchon economico. Menor riesgo de abandono por Colapso.
Los tres arquetipos son viables y rentables para el proyecto. No es necesario favorecer ninguno: la libertad de eleccion es uno de los argumentos mas fuertes del diseno para la solicitud de grants y para la comunidad.
 
 


=== Seccion 11 — Resumen macro para desarrolladores (balance de flujo) ===

 
Esta seccion proporciona las metricas exactas de control del sistema economico para el equipo tecnico que programe Supabase, los scripts de recompensa del backend y los smart contracts de la Plaza de Comercio.
 


=== 11.1  Desglose del ingreso diario medio ===

Al integrar todas las fuentes de recompensa, la economia de un jugador comun que consuma su energia diaria de forma equilibrada y recolecte sus bonos de retencion se comporta bajo las siguientes metricas exactas:
 
Fuente de EV
EV diarios
Tipo
Notas
Cap diario de Cuidado (3 Genos activos)
150 EV
Pasivo/fijo
Tope absoluto por cuenta. No escalable con mas Genos.
Misiones diarias (3 de 3)
300 EV
Activo/fijo
100 EV x 3 misiones completadas.
Cofre de bonificacion diario
300 EV
Activo/fijo
Se libera al completar las 3 misiones del dia.
Racha de login (media semanal)
~200 EV
Pasivo/variable
Media del ciclo de 7 dias dividida entre 7.
Subtotal pasivo y de baja exigencia
~950 EV
SUBTOTAL
EV garantizados por actividad minima diaria.
Juego activo (100 Energia Nexo, ruta mixta)
~3,000 EV
Activo/variable
Arcade + Coliseo + Torre en combinacion optima.
TOTAL MEDIO DIARIO
~4,000 EV
TOTAL
Jugador activo que consume toda su energia.
 


=== 11.2  Tiempo para alcanzar los sumideros principales ===

Referencia practica para calibrar la velocidad de progresion y detectar desbalances:
 
Objetivo (sink)
Coste en EV
Dias de juego activo necesarios
Nota estrategica
Aprender Ataque Basico (Laboratorio de Implantes)
1,000 EV
0.25 dias
Accesible el primer dia de juego.
Aprender Ataque Especial Slot 2 (Laboratorio de Implantes)
4,000 EV
1 dia
Meta del primer o segundo dia.
Aprender Ataque Definitivo (Laboratorio de Implantes)
10,000 EV
2.5 dias
Meta perfecta calibrada para retener sin inflar.
Escaner de ADN Basico
1,500 EV
~0.4 dias
Herramienta de diagnostico accesible.
Escaner de ADN Completo
5,000 EV
1.25 dias
Inversion significativa pero justificada.
Incubadora Basica x5 (tanda de fusion)
5,000 EV
1.25 dias
Coste de eclosionar los 5 Genos de sacrificio.
Tasa Reactor Nivel 1
5,000 EV
1.25 dias
Solo la tasa; no incluye la crianza.
Licencia de Comercio Web3
3,000 EV
0.75 dias
Requiere Lab Nv.5 antes del pago.
Tasa Reactor Nivel 2
15,000 EV
3.75 dias
Exige una base economica solida.
Tasa Reactor Nivel 3
30,000 EV
7.5 dias
Inversion de alto riesgo. Estabilizador recomendado.
 


=== 11.3  Verificacion del RORS (Ratio de Retorno de Sumideros) ===

El RORS de 0.81 indica que por cada 4,000 EV generados en un dia de juego activo, el conjunto de sumideros diseados absorbe en promedio 3,240 EV, dejando 760 EV de acumulacion neta en la cuenta del jugador. Esta acumulacion gradual:
 
•      Genera la sensacion de progreso y ahorro que motiva las grandes inversiones (Reactor Nivel 2 o 3).
•      No produce hiperinflacion porque los sumideros de alto valor (Laboratorio de Implantes Definitivo, Reactor Nivel 3, expansion de almacen) absorben periodicamente los balances acumulados.
•      Se equilibra naturalmente sin necesidad de intervenciones manuales del equipo de desarrollo.
 
 
Proyecto Genos  —  Documento consolidado V1.4  —  Confidencial

---

## 11. Especificaciones Técnicas Detalladas: Coliseo, Arena del Nexo y Torneos Temáticos
*Este capítulo detalla de forma exhaustiva las reglas del sistema PvP, el Pase de Arena, los Torneos y la Gobernanza.*

PROYECTO GENOS
Documento de Especificaciones Técnicas y Económicas
Coliseo  ·  Arena del Nexo  ·  Sistema de Torneos Temáticos
Versión 1.0 Consolidada  |  Documento Confidencial  |  Uso Interno
 
 

# Resumen del documento

 
¿Qué contiene este documento?
Este documento consolida dos fuentes previas en una única referencia técnica:
  · Doc A — Reestructuración de Arquitectura: Coliseo, Arena del Nexo y Monedas
  · Doc B — Especificaciones Técnicas: Sistema de Torneos Temáticos (Fase 7)
 
Cubre: separación radical PvE/PvP, modos del Coliseo, ligas de la Arena del Nexo,
sistema de Pase de Arena diario, algoritmo de matchmaking híbrido (en vivo + IFTTT),
ciclo de gobernanza semanal con votación, catálogo completo de 6 torneos maestros,
cola unificada con cascada FIFO, ingeniería económica de payouts en $POL,
protocolo de desconexión asíncrona, e inscripción anticipada con recompensa en EV.
 
Regla de desarrollo: nunca modificar los 11 estados de combate, las fórmulas de daño,
los multiplicadores elementales (×1.35 / ×0.75) ni el STAB (×1.20) sin aprobación explícita.
 

 

# Sección 1 — Reglas de desarrollo (conservación de código)

 
Directiva estricta aplicable a todos los gestores involucrados en este módulo: TournamentManager.js, ColiseumLogic.js, CloudManager.js y contratos asociados.
 
•      Modificaciones quirúrgicas: Solo se añaden o eliminan las líneas estrictamente necesarias para implementar nuevas mecánicas. No se reescriben módulos completos.
•      Última versión funcional: Cualquier modificación o entrega de código completo usa obligatoriamente el último script funcional como base, nunca una versión anterior.
•      Prohibición de cambios extremos sin aprobación: Quedan bloqueados sin discusión previa explícita los cambios a los 11 estados de combate, las fórmulas de daño validadas, los multiplicadores elementales (×1.35 ataque con ventaja / ×0.75 ataque con desventaja) y el STAB (×1.20 por ataque del tipo propio del Geno).

# Sección 2 — Separación radical de entornos: PvE vs. PvP

 
El menú del Coliseo se divide de forma tajante en dos pestañas independientes con sus propias reglas de acceso, costes y recompensas. Esta separación es irrevocable: ningún modo cruza sus reglas con el otro.
 
Característica
Ala de Investigación (PvE)
Arena del Nexo (PvP)
Acceso
100% gratuito. No consume $POL.
Requiere compra de Pase de Arena en $POL.
Rival
Inteligencia Artificial del servidor.
Jugador humano en vivo o fantasma IFTTT asíncrono.
Recompensas
Esencia Vital (EV) + Puntos de Experiencia (EXP).
Pool de $POL neto + Puntos de Rango (PR).
Riesgo financiero
Ninguno.
El $POL apostado puede no recuperarse según el resultado.
Propósito
Entrenamiento, prueba de configuraciones, farmeo de EV.
Competencia real, escalada en el leaderboard, ganancias en cripto.
 

 

# Sección 3 — Ala de Investigación (modos PvE)

 
Entorno de riesgo cero diseñado para que el jugador entrene, pruebe configuraciones IFTTT de forma segura y recolecte recursos básicos off-chain.
 

# 3.1  Combate Estándar contra la IA

•      Coste de entrada: Completamente gratuito. No consume $POL ni Manzanas de la mochila.
•      Funcionamiento: Un botón directo empareja al jugador de forma instantánea contra un rival controlado por la IA del servidor de manera aleatoria.
•      Recompensas: Esencia Vital (EV) y Puntos de Experiencia (EXP) para subir el nivel del Geno.
 

# 3.2  Torre de Mutación (Modo Supervivencia)

Modo de escalada infinita por pisos. El sistema registra el piso máximo alcanzado (max_floor) en la tabla de perfiles de Supabase. El EV de cada piso solo puede reclamarse una vez.
 

# Escalado genético de la IA (anti-techo técnico)

Los rivales de la IA progresan imitando la escala biológica de crianza del juego para evitar estadísticas artificiales injustas:
 
Rango de pisos
Rareza del rival IA
Progresión de rangos
Mecánica especial
Pisos 1–25
Común
Rango D → C → B → A → S perfecto
Escalado gradual dentro de la rareza Común.
Piso 26 (salto)
Rara (Rango D)
Raro D supera estadísticas al Común S
El cambio de rareza fuerza al jugador a evolucionar su estrategia.
Pisos siguientes
Rara → Épica → Legendaria → Mítica
D → S en cada bloque de rareza
La curva se repite ascendente por rareza.
 
Si un jugador llega a la Torre con un Geno Mítico sin haber subido los pisos anteriores, el juego lo eleva automáticamente al primer piso que represente un reto real para sus estadísticas, entregando todas las recompensas de los pisos anteriores de forma automática. Esto impide el abuso de reinicio en pisos fáciles con Genos de rareza alta.
 

# Mecánica de retirada vs. muerte

Retirada Voluntaria
Muerte en Combate
Retirada Voluntaria
Muerte en Combate
El jugador pulsa el botón de salida.
El Geno es derrotado por la IA.
Recibe el 100% del EV acumulado en la tanda.
Recibe el 100% del EV acumulado en la tanda.
Los accesorios cosméticos obtenidos se guardan.
Los accesorios cosméticos se guardan siempre.
 
Los Checkpoints cada 10 pisos evitan repetir contenido trivial. Si el jugador muere en el Piso 17, su próximo ticket le permite reanudar desde el Piso 11, consiguiendo pisos seguros para farmear EV antes de volver a enfrentarse al muro de su récord.

# Sección 4 — Arena del Nexo (modo PvP híbrido competitivo)

 
Núcleo de la economía Web3 asíncrona del juego. Funciona bajo un modelo híbrido en tiempo real y diferido controlado por Supabase. Toda la lógica económica de la Arena opera fuera de los torneos de fin de semana, que tienen su propio módulo (Sección 6 en adelante).

# 4.1  Segmentación estricta por ligas ligadas al Geno

Las ligas están ligadas obligatoriamente a la rareza o nivel del Geno activo equipado en ese instante, no al nivel global de la cuenta del jugador. Esto garantiza el ratio de emparejamiento seguro 85/15 del Parche de Balance de Matchmaking V13.9.
 
Liga
Requisito de acceso
Perfil de jugador
Liga Bronce
Acceso libre. Genos de rareza Común.
Cuentas nuevas y jugadores casual.
Liga Plata
Geno equipado con Nivel 20 o superior en estadísticas.
Jugadores intermedios con Genos nivelados.
Liga Oro
Geno de rareza Rara o superior equipado e inscrito.
Jugadores avanzados con crianza optimizada.
Liga Diamante
Exclusiva para Genos de rareza Épica o Legendaria.
Élite competitiva. Mayores stakes en $POL.
 
Regla anti-exploit: si un jugador en lo más alto de la Liga Diamante desequipa su Geno Legendario y equipa un Común de Nivel 1, el sistema de Supabase lo desplaza automáticamente a la Liga Bronce. Empieza desde cero en el ranking de esa liga, impidiendo el aplastamiento de jugadores novatos por parte de usuarios avanzados.
 

# 4.2  Separación absoluta de Puntos de Rango (PR)

Los PR del leaderboard no son globales. Cada perfil mantiene en la base de datos columnas numéricas separadas para cada liga:
 
Campo en Supabase
Liga
Descripción
pr_bronce
Liga Bronce
Puntos acumulados exclusivamente en combates de la Liga Bronce.
pr_plata
Liga Plata
Puntos acumulados exclusivamente en la Liga Plata.
pr_oro
Liga Oro
Puntos acumulados exclusivamente en la Liga Oro.
pr_diamante
Liga Diamante
Puntos acumulados exclusivamente en la Liga Diamante.
 

 

# Sección 5 — Economía de fichas: el Pase de Arena y premios diarios

 
La Arena del Nexo no cobra por combates individuales (modelo todo-o-nada destructivo para el jugador casual). En su lugar usa un sistema de Pases de Arena de mitigación de riesgo por ronda de 5 combates.
 

# 5.1  Mecánica del Pase de Arena (ronda de 5 combates)

•      Compra del pase: El jugador realiza una única compra consciente de un Pase de Arena válido para su categoría de liga. Ejemplo base: 0.50 $POL en Liga Plata.
•      Crédito cerrado: La compra otorga exactamente 5 combates. Se genera un estado persistente en la base de datos: arena_ticket_active = true, battles_played = 0.
•      El Geno no pelea de forma autónoma: El ticket queda congelado esperando la interacción directa del usuario. El jugador debe pulsar físicamente el botón BUSCAR OPONENTE para disputar cada combate.
•      Estado persistente entre sesiones: Si el jugador cierra la app tras jugar 2 combates, el estado se congela en 2/5. El contrato inteligente no liquida ni paga nada hasta que se complete formalmente el combate número 5.
 

# 5.2  Distribución atómica de la entrada en el contrato inteligente

En el momento exacto en que el jugador compra el pase de 0.50 $POL, el contrato inteligente de Polygon divide los fondos de forma automática e irreversible:
 
Destino
Porcentaje
Importe (base 0.50 $POL)
Propósito
Safe de Tesorería (desarrollador)
10%
0.05 $POL
Infraestructura, servidores, gas del Paymaster para Session Keys.
Bote Acumulado de Temporada
10%
0.05 $POL
Distribuido al final del mes entre los 10 mejores del leaderboard de la liga.
Pool de Premios Inmediatos Global
80%
0.40 $POL
Bolsa de liquidez unificada para financiar los payouts inmediatos de todas las rondas activas.
 

# 5.3  Tabla actuarial de liquidación inmediata

Al terminar el quinto combate de la ronda, el gestor lee el balance de victorias/derrotas del ticket y ejecuta el pago correspondiente desde el pool global de premios:
 
Récord final de la ronda
Pago en $POL
Recompensa en EV
Items adicionales
5V / 0D  (perfecto)
1.50 $POL
0.50 EV (simbólico)
Desbloqueo de ítems raros.
4V / 1D
0.80 $POL
1.00 EV
Desbloqueo de implantes comunes.
3V / 2D  (break-even)
0.50 $POL
2.50 EV
Ninguno.
2V / 3D  (amortiguación)
0.20 $POL
5.00 EV (consolación)
Ninguno.
1V / 4D
0.00 $POL
2.00 EV
Ninguno.
0V / 5D
0.00 $POL
0.50 EV
Ninguno.
 
Mecanismo de seguridad actuarial: los premios de los jugadores con 4-5 victorias se financian con las pérdidas de quienes obtienen 0-2 victorias. Si la comunidad supera la tasa de éxito estándar del 50% de forma inusual, el contrato toma fondos del colchón del Bote Acumulado de Temporada para garantizar que el juego nunca entre en déficit. El fantasma IFTTT solo es un modelo de combate: no reclama dinero del pool.
 

 

# Sección 6 — Algoritmo de matchmaking híbrido y sistema de dados asíncrono

 
Cuando el jugador pulsa BUSCAR OPONENTE en la Arena del Nexo, el backend ejecuta un escaneo de dos etapas para emparejar la partida con cero esperas garantizadas.
 

# 6.1  Etapa 1 — Filtro de tiempo real (modo manual en vivo)

•      Duración del escaneo: El sistema analiza durante 10 segundos exactos los canales Realtime Broadcast de Supabase en busca de otro jugador online de la misma liga buscando partida en ese mismo instante.
•      Si encuentra rival: Se abre un canal interactivo bidireccional punto a punto. Ambos jugadores controlan sus acciones de forma manual turno por turno.
•      Incentivo en vivo: Una victoria en modo tiempo real otorga un +15% de Puntos de Rango (PR) adicionales de bonificación sobre los PR estándar de esa victoria.
 

# 6.2  Etapa 2 — Respaldo asíncrono (el fantasma IFTTT)

Si el temporizador de 10 segundos expira sin encontrar rival online, el sistema activa el modo asíncrono para garantizar cero esperas:
 
•      Selección del fantasma: El algoritmo busca en Supabase el registro de un jugador offline de la misma liga y extrae sus estadísticas y su script defensivo IFTTT preprogramado.
•      Ejecución del combate: El jugador activo controla sus turnos manualmente. El rival offline combate de forma pasiva mediante su script IFTTT.
•      Impacto para el jugador desconectado: El combate ocurre exclusivamente en el servidor del jugador activo. El usuario offline NO consume sus tickets ni altera su ronda de 5 combates. Su saldo de $POL jamás se altera de forma pasiva. Si su script gana la defensa, suma PR gratis; si pierde, se le restan PR.
 

# 6.3  Sistema de dados genéticos (asimetría orgánica)

Para contrarrestar la ventaja cognitiva del jugador humano frente a un script IFTTT estático, el motor no selecciona un rival exactamente simétrico. En su lugar, ejecuta dos dados probabilísticos:
 
Dado de Nivel
Dado de Calidad Genética
Dado de Nivel del Rival
Dado de Calidad Genética (Purity/IVs)
Resultado posible A: mismo nivel que el jugador activo.
Resultado posible A: misma calidad genética.
Resultado posible B: +1 nivel por encima.
Resultado posible B: +1 rango de calidad (ej. B → A).
Resultado posible C: +2 niveles por encima.
Resultado posible C: +2 rangos de calidad (ej. B → S).
 
Filtro de Inmunidad de Tipo (Exclusión Elemental): la consulta SQL/RPC de Supabase prohíbe de forma estricta seleccionar fantasmas cuyo elemento principal tenga desventaja elemental directa frente al Geno del jugador activo. El fantasma solo puede ser seleccionado si el emparejamiento elemental es neutral o ventajoso para él. Esto neutraliza los counters automáticos malintencionados.
 

 

# Sección 7 — Ciclo de gobernanza semanal (Lunes a Jueves)

 
El modificador del torneo de fin de semana se determina mediante un sistema de votación descentralizado off-chain gestionado por Supabase. La comunidad elige el torneo, lo que mantiene el juego en constante evolución táctica y genera expectación semana a semana.
 

# 7.1  Flujo semanal paso a paso

 
Día
Evento
Acción técnica del sistema
Lunes
Selección aleatoria
Cron Job ejecuta función que selecciona al azar 3 opciones del catálogo cerrado de 6 torneos maestros.
Lunes – Jueves
Ventana de votación
Los jugadores elegibles votan por su torneo preferido del fin de semana.
Jueves noche
Cierre de urnas
El sistema cierra las urnas, hace el recuento en la tabla tournament_votes y actualiza current_weekend_tournament.
Viernes
Ventana de preparación
24h para adaptar builds, comprar ataques en el Laboratorio y reconfigurar scripts IFTTT.
Fin de semana
Ventanas Sit &amp; Go
Se abre la cola unificada de 1:30 hora y 30 minutos para el torneo ganador de la votación.
 

# 7.2  Muro de seguridad del voto (anti-bots)

No todos los perfiles pueden votar. El sistema valida en la tabla profiles de Supabase que el usuario cumpla ambas condiciones:
 
•      Condición 1: Nivel 5 de Laboratorio (Lab_level &gt;= 5 en Supabase). Requiere aproximadamente 7-10 días de juego activo real.
•      Condición 2: Licencia de Comercio Web3 adquirida (has_commerce_license = true). Coste: 3,000 EV en el Bazar Nivel 5.
 
Este doble filtro neutraliza matemáticamente los ataques de granjas de bots e impide que cuentas falsas o recién creadas manipulen el meta del juego. Solo los jugadores comprometidos con el juego durante al menos una semana pueden influir en el torneo del fin de semana.
 

 

# Sección 8 — Catálogo cerrado de los 6 torneos maestros

 
El bombo de votación semanal se compone exclusivamente de estos 6 formatos, optimizados para maximizar la masa crítica de participantes. Las rarezas Épica, Legendaria y Mítica están excluidas de la rotación semanal; su terreno es los Eventos de Gala trimestrales.
 

# Torneo 1 — Solo Comunes

Parámetro
Detalle
Restricción de acceso
Solo Genos de rareza Común. Cualquier nivel.
Filtro de rareza en brackets
No aplica. Comunes compiten contra Comunes directamente.
Mecánica especial
Ninguna. Formato estándar.
Perfil que favorece
Jugadores F2P con mucho tiempo de farmeo y optimización de Genos básicos.
 

# Torneo 2 — Copa Raro

Parámetro
Detalle
Restricción de acceso
Solo Genos de rareza Rara.
Filtro de rareza en brackets
No aplica. Raros compiten contra Raros directamente.
Mecánica especial
Ninguna. Destaca la herencia avanzada y los alelos idénticos.
Perfil que favorece
Jugadores intermedios con inversión en crianza optimizada.
 

# Torneo 3 — Modo Berserker

Parámetro
Detalle
Restricción de acceso
Cualquier rareza.
Filtro de rareza en brackets
APLICADO. Brackets segregados estrictamente por rareza (Comunes vs Comunes, Raros vs Raros).
Mecánica especial
El stat de Defensa (DEF) se reduce a cero globalmente en el motor de combate para todos los combatientes. Los combates duran 3-5 turnos. Puro daño por turnos.
Perfil que favorece
Jugadores agresivos con builds de máximo ATK. La defensa no importa; solo el primer golpe.
 

# Torneo 4 — Sin Genes

Parámetro
Detalle
Restricción de acceso
Cualquier rareza.
Filtro de rareza en brackets
APLICADO. Brackets segregados por rareza para equilibrar stats base.
Mecánica especial
Toda la cadena de genes ocultos y pasivas biológicas del ADN queda desactivada. Solo importan los 5 stats base numéricos, el nivel y la sinergia del catálogo de ataques.
Perfil que favorece
Jugadores con alto conocimiento táctico del sistema de ataques. Habilidad pura sin ventaja genética.
 

# Torneo 5 — Liga Elemental Pura

Parámetro
Detalle
Restricción de acceso
Solo Genos del elemento activado ese fin de semana + sus elementos adyacentes de ventaja/desventaja directa.
Filtro de rareza en brackets
APLICADO. Cuadros de 16 divididos por rareza para evitar que diferencias de poder numérico pisen las estrategias de contrarresto elemental.
Mecánica especial
El servidor activa un elemento específico del ciclo circular (ej. Radiactivo). Solo los Genos de ese tipo o sus adyacentes pueden inscribirse.
Perfil que favorece
Jugadores con colecciones diversas y conocimiento del sistema elemental circular del juego.
 

# Torneo 6 — El Espejo

Parámetro
Detalle
Restricción de acceso
Cualquier jugador de cualquier nivel e inventario.
Filtro de rareza en brackets
No aplica. Todos compiten en los mismos brackets.
Mecánica especial
El sistema clona un Geno exactamente idéntico (mismo nivel, stats y rareza) para todos los participantes del bracket. La victoria depende 100% de la selección de movimientos para los Slots 2, 3 y 4 (Ataque Especial, Soporte y Definitivo).
Perfil que favorece
El ecualizador absoluto. Un jugador nuevo con buena táctica puede vencer a una ballena. El conocimiento del juego importa más que el inventario.
 
Épicos, Legendarios y Míticos están excluidos de la rotación semanal de torneos. Su terreno exclusivo son los Eventos de Gala de Fin de Temporada (Torneo del Fundador y similares), organizados de forma síncrona cada 3 meses como campañas de marketing masivas para elevar el valor del marketplace P2P.
 

 

# Sección 9 — Sistema de inscripción anticipada con recompensa en EV

 
La inscripción anticipada es un sistema paralelo a las ventanas Sit &amp; Go del fin de semana. Permite a los jugadores comprometerse con un torneo antes de que comience, generando datos de participación valiosos para el servidor y ofreciendo un incentivo económico a quienes planifican con antelación.
 

# 9.1  Propósito y valor para el servidor

•      Base de datos de participación: El servidor conoce con antelación cuántos jugadores hay inscritos para cada tipo de torneo y en qué tier de precio de entrada están posicionados. Esto permite ajustar el pozo de premios, verificar si el torneo tiene quórum suficiente para lanzarse y segmentar comunicaciones.
•      Actividad durante la semana: La ventana de inscripción abierta desde el lunes genera engagement con el juego durante los días laborables, no solo el fin de semana.
•      Métricas de diseño: Los datos de inscripción por torneo y tier informan las decisiones de qué torneos incluir en la rotación semanal y qué niveles de precio tienen mayor demanda real.
 

# 9.2  Ventana de inscripción

•      Apertura: La inscripción anticipada se abre el mismo lunes en que se anuncia el torneo ganador de la votación.
•      Cierre: La inscripción se cierra en el momento exacto en que comienza la primera ventana Sit &amp; Go del fin de semana.
•      Inscripción durante el torneo: Durante el tiempo que dure la ventana activa del torneo, los jugadores que aún no se hayan inscrito pueden seguir haciéndolo, pero no recibirán la recompensa anticipada.
 

# 9.3  Regla de no cancelación

Una vez que el jugador completa la inscripción anticipada, el compromiso es irrevocable. No existe opción de cancelación bajo ninguna circunstancia.
 
¿Por qué no permitir cancelación?
El sistema IFTTT hace innecesaria cualquier cancelación: si el jugador no puede conectarse
el día del torneo, su Geno combatirá de forma autónoma con la configuración IFTTT activa.
 
Esto significa que técnicamente no existe el concepto de &apos;no-show&apos;: siempre hay un
combatiente activo en el torneo independientemente de si el jugador está conectado o no.
 
La no cancelación garantiza que todos los datos de inscripción que maneja el servidor
correspondan a participantes reales que sí van a competir, sin huecos vacíos ni emparejamientos rotos.
 

# 9.4  Congelación del IFTTT al inicio del torneo

•      Libre hasta el inicio: El jugador puede modificar su configuración IFTTT libremente en cualquier momento desde que se inscribe hasta el instante exacto en que el torneo comienza.
•      Congelación automática: En el momento en que el torneo arranca, la configuración IFTTT de todos los participantes se congela de forma simultánea. No se permiten modificaciones mientras el torneo esté activo.
•      Descongelación: La configuración IFTTT vuelve a ser editable en cuanto el torneo finaliza o el Geno es eliminado de la competición.
•      Configuración por defecto: Si un jugador inscrito no tiene ninguna configuración IFTTT personalizada en el momento del inicio, el sistema aplica automáticamente la configuración por defecto del servidor. El Geno no queda paralizado.
 
La Sala de Pruebas es la herramienta clave de preparación: el jugador sabe que tiene hasta el inicio del torneo para afinar y verificar que su combinación IFTTT funciona correctamente contra distintos tipos de rivales. El límite de tiempo crea urgencia de uso de la Sala de Pruebas durante la semana previa.
 

# 9.5  Privacidad de rivales

Los emparejamientos del torneo se revelan únicamente en el momento en que éste comienza. Durante toda la semana de inscripción anticipada y preparación, ningún jugador sabe contra quién va a competir.
 
•      Consecuencia táctica: La única forma de prepararse es construir una configuración IFTTT robusta y versátil, no una diseñada para contraatacar a un rival específico conocido. Esto eleva el nivel estratégico general y elimina el metagaming de counter personalizado.
•      Consecuencia competitiva: Inscribirse antes no da ventaja de información sobre los rivales. La ventaja de la inscripción anticipada es exclusivamente económica (la recompensa en EV), no táctica.
 

# 9.6  Recompensa por inscripción anticipada

•      Cuándo se entrega: La recompensa en EV se entrega automáticamente después de que el torneo finaliza, independientemente del resultado del jugador en la competición.
•      Condición única: Haberse inscrito durante la ventana anticipada (antes del inicio del torneo). Los jugadores que se inscriban durante la ventana activa del torneo NO reciben esta recompensa.
•      Valor de la recompensa: A definir en el balance final. Debe ser suficientemente atractivo para incentivar la inscripción anticipada pero no tan alto como para convertirse en una fuente primaria de farmeo de EV.
 
Campos necesarios en Supabase para esta mecánica
tournament_registrations: tabla con player_id, tournament_id, tier ($POL), registered_at, is_early (boolean).
is_early = true si registered_at &lt; tournament_start_time.
early_ev_reward_paid: boolean, se actualiza a true cuando se entrega la recompensa post-torneo.
ifttt_snapshot: snapshot de la configuración IFTTT del jugador en el momento de la congelación.
 

 

# Sección 10 — Cola unificada de riesgo y cascada dinámica FIFO

 
Para que los jugadores veteranos puedan competir por bolsas altas sin fragmentar las salas de espera, el sistema implementa un Matchmaking Unificado de Riesgo Flexible controlado por capas de precio con descenso automático garantizado.
 

# 10.1   Los 4 niveles de entrada disponibles

El sistema en TournamentManager.js implementa un Matchmaking Unificado de Riesgo Flexible controlado por 4 capas de precio:

| Nivel | Coste de entrada | Perfil objetivo | Premios en $POL |
| :--- | :---: | :--- | :--- |
| Practicante | 0.15 $POL | Jugadores principiantes y de prueba. Suelo del sistema con bots de relleno garantizados. | 🥇 1º: 1.20 $POL, 🥈 2º: 0.66 $POL, 🥉 3º: 0.30 $POL |
| Casual | 0.50 $POL | Jugadores F2P o de bajo riesgo. Nivel de volumen masivo. | 🥇 1º: 4.00 $POL, 🥈 2º: 2.20 $POL, 🥉 3º: 1.00 $POL |
| Competitivo | 2.00 $POL | Jugadores regulares con experiencia en torneos. | 🥇 1º: 16.00 $POL, 🥈 2º: 8.80 $POL, 🥉 3º: 4.00 $POL |
| Élite | 5.00 $POL | Ballenas y jugadores veteranos buscando bolsas de premios altas. | 🥇 1º: 40.00 $POL, 🥈 2º: 22.00 $POL, 🥉 3º: 10.00 $POL |

# 10.2  Algoritmo del flujo de cascada en servidor

•      Paso 1 — Inscripción intencional: El jugador selecciona su Geno elegible y elige el monto que está dispuesto a arriesgar (ej. 5.00 $POL). El contrato retiene los fondos y lo añade a la Cola Élite.
•      Paso 2 — Temporizador de corte (6 minutos): El backend abre un cuadro de espera de duración estricta de 6 minutos para reunir 16 jugadores reales al mismo nivel de entrada.
•      Paso 3a — Si se llena (16/16): Se cierra el bracket y arranca el torneo de inmediato.
•      Paso 3b — Si el tiempo expira sin llenarse: El sistema Verifica cuantos hay, si son 15 jugadores, el sistema añade 1 Geno IA, este se financia con el 10% de la comisión que se queda el juego por cada torneo de 16, si son menos de 15 activa el protocolo de Descenso FIFO (First In, First Out). Los jugadores se desplazan en bloque al siguiente nivel de entrada inferior.
•      Garantía de cierre: El nivel Practicante (0.15 $POL) es el suelo del sistema. Por ser el nivel de volumen masivo, el cuadro de 16 se cerrará de forma garantizada.
•      Opcion adicional: Se le permitirá activar una opción a los jugadores donde autorizan a comenzar torneos de 8 jugadores si hay menos de 15 jugadores en sala de espera, si algún jugador tampoco queda en el grupo de 8 seguira bajando de al nivel de entrada inferior. Esta opción le aparece al momento en el que se va activar el FIFO.
 

# 10.3  Gestión de fondos en el descenso FIFO

•      Patrón de Retiro (Pull-over-Push): Al ejecutar el descenso, el contrato inteligente prohíbe realizar transferencias salientes automáticas a la wallet on-chain del usuario para evitar gasto innecesario de gas.
•      Crédito interno: El contrato calcula la diferencia exacta (ej. 5.00 - 2.00 = 3.00 $POL) y la acredita instantáneamente en la variable interna saldosPendientes del perfil del usuario.
•      Visibilidad en UI: El saldo queda reflejado en el Baúl del jugador como crédito interno libre de gas, disponible para reinvertir en otra inscripción de la ventana horaria o retirar físicamente hacia su wallet Privy bajo demanda.
 

# 10.4  Pop-up de transparencia UX al ejecutar el descenso

Mensaje que el cliente muestra obligatoriamente al jugador cuando se ejecuta un descenso FIFO
¡Ajuste de categoría para inicio rápido!
 
El temporizador de la cola Élite (5.00 $POL) ha expirado sin encontrar los 16 rivales
requeridos para cerrar el cuadro. Para que no tengas que seguir esperando, el Laboratorio
te ha trasladado automáticamente al próximo torneo de la categoría Competitiva (2.00 $POL),
donde la batalla comienza ya.
 
¡Tus fondos están seguros! Los 3.00 $POL de diferencia han sido devueltos instantáneamente
a tus saldosPendientes en el Baúl. Puedes usarlos para reinscribirte en esta misma ventana
o retirarlos cuando desees.
 

 

# Sección 11 — Blindaje de equidad matemática y ajuste de llaves

 
Al manejar dinero real ($POL), el balance se convierte en un elemento crítico de seguridad. Se aplican tres protocolos de equidad estrictos.
 

# 11.1  Desactivación del Jefe de Liga (0% asimetría en torneos)

•      La regla del 15% de probabilidad de cruzarse con una rareza superior queda completamente eliminada de los torneos de fin de semana.
•      Ningún jugador que arriesgue capital real será emparejado en desventaja de estadísticas contra una escala biológica superior.
•      Un Geno Común solo compite contra Genos Comunes en todos los torneos con filtro de rareza activo.
 

# 11.2  Protocolo de contracción de bracket a 8 participantes

•      8 a 14 inscritos: El servidor Avisa a los jugadores para reducir el bracket de 16 a 8 participantes (Cuartos, Semifinal y Final). Si los jugadores aceptan el torneo arranca de inmediato respetando las entradas proporcionales.
•      Menos de 7 inscritos: Si no pueden bajar de categoría, el juego dará tiempo de gracia para conseguir al jugador faltante al finalizar ese tiempo el torneo de esa categoría se cancela off-chain. El 100% de las entradas se devuelve al pool saldosPendientes de los usuarios con el coste de gas de una sola firma de administración.
 

# 11.3  Protocolo de inyección de NPC (bracket semicompleto)

Si al expirar el matchmaking un torneo de 16 participantes registra exactamente 15 jugadores humanos reales, el juego inyecta un agente virtual (NPC) como competidor número 16:
 
•      Subvención del pozo: El pool de premios se mantiene calculado sobre un torneo completo de 8 participantes. La entrada ficticia del NPC se subsidia a través de la retención del organizador (10%) cobrada a los 7 participantes humanos.
•      Ejecución del NPC: El NPC ejecuta de forma pasiva su script IFTTT en el servidor consumiendo cero firmas de gas.
•      Rescate de liquidez si el NPC llega al podio: Si el NPC finaliza en 1º, 2º o 3º lugar, el contrato inteligente desvía de forma atómica el premio en $POL de vuelta a la Safe de Tesorería multi-firma del equipo, usándose como colchón del Paymaster.
 

 

# Sección 12 — Ingeniería económica: matemática del payout en $POL

 
Cada bracket de 16 jugadores (o 8 en contracción) constituye un circuito financiero cerrado e independiente en la blockchain de Polygon. No se crea dinero de la nada, garantizando liquidez inmediata y evitando inflación.
 

# 12.1   Distribución de fondos de un bracket estándar (Ejemplo conceptual base 1.00 $POL)

Ejemplo base con entrada de 1.00 $POL y 16 jugadores:

| Concepto | Cálculo | Importe |
| :--- | :--- | :--- |
| Recaudación bruta de la llave | 16 jugadores × 1.00 $POL | 16.00 $POL |
| Retención de la casa (10%) | 16.00 × 10% | 1.60 $POL → Safe de Tesorería multi-firma (2 de 3 llaves físicas de hardware) |
| Bolsa neta para el podio (90%) | 16.00 × 90% | 14.40 $POL → repartidos entre 1º, 2º y 3º puesto |

# 12.2   Distribución del podio en los 4 Tiers Reales

A continuación se detalla la matemática de liquidación on-chain exacta del contrato para cada uno de los 4 tiers de entrada reales del juego:

### 1. Copa Practicante (0.15 $POL)
* Recaudación Bruta (16 jugadores): **2.40 $POL**
* Retención de la Casa (10%): **0.24 $POL**
* Bolsa Neta Podio (90%): **2.16 $POL**
  * 🥇 **1º Lugar (Campeón - 55.55%):** **1.20 $POL** (x8 de entrada)
  * 🥈 **2º Lugar (Subcampeón - 30.55%):** **0.66 $POL**
  * 🥉 **3º Lugar (Consolación - fijo x2.0):** **0.30 $POL**
  * *Comprobación:* 1.20 + 0.66 + 0.30 + 0.24 = 2.40 $POL (100.0%)

### 2. Copa Casual (0.50 $POL)
* Recaudación Bruta (16 jugadores): **8.00 $POL**
* Retención de la Casa (10%): **0.80 $POL**
* Bolsa Neta Podio (90%): **7.20 $POL**
  * 🥇 **1º Lugar (Campeón - 55.55%):** **4.00 $POL** (x8 de entrada)
  * 🥈 **2º Lugar (Subcampeón - 30.55%):** **2.20 $POL**
  * 🥉 **3º Lugar (Consolación - fijo x2.0):** **1.00 $POL**
  * *Comprobación:* 4.00 + 2.20 + 1.00 + 0.80 = 8.00 $POL (100.0%)

### 3. Copa Competitiva (2.00 $POL)
* Recaudación Bruta (16 jugadores): **32.00 $POL**
* Retención de la Casa (10%): **3.20 $POL**
* Bolsa Neta Podio (90%): **28.80 $POL**
  * 🥇 **1º Lugar (Campeón - 55.55%):** **16.00 $POL** (x8 de entrada)
  * 🥈 **2º Lugar (Subcampeón - 30.55%):** **8.80 $POL**
  * 🥉 **3º Lugar (Consolación - fijo x2.0):** **4.00 $POL**
  * *Comprobación:* 16.00 + 8.80 + 4.00 + 3.20 = 32.00 $POL (100.0%)

### 4. Copa Élite (5.00 $POL)
* Recaudación Bruta (16 jugadores): **80.00 $POL**
* Retención de la Casa (10%): **8.00 $POL**
* Bolsa Neta Podio (90%): **72.00 $POL**
  * 🥇 **1º Lugar (Campeón - 55.55%):** **40.00 $POL** (x8 de entrada)
  * 🥈 **2º Lugar (Subcampeón - 30.55%):** **22.00 $POL**
  * 🥉 **3º Lugar (Consolación - fijo x2.0):** **10.00 $POL**
  * *Comprobación:* 40.00 + 22.00 + 10.00 + 8.00 = 80.00 $POL (100.0%)

# 12.3  Mitigación del riesgo financiero: consolación en EV para eliminados

Para eliminar la frustración de los jugadores que quedan fuera del dinero, el backend de Supabase entrega recursos de progreso off-chain según la ronda alcanzada:
 
Fase de eliminación
Recompensa en EV
Bonus adicional
Eliminados en Octavos de Final (Ronda 1)
15.00 EV
Energía para ir directo al Laboratorio a modificar estrategia.
Eliminados en Cuartos de Final (Ronda 2)
8.00 EV
—
4º Puesto (pierde la final de consolación por el 3er puesto)
4.00 EV
Plano procedural para un Accesorio Cosmético de la Torre.
 

 

# Sección 13 — Protocolo de desconexión asíncrona durante torneos

 
Los torneos de fin de semana son eventos en vivo con horarios específicos. Para evitar que una caída de red o abandono congele el torneo de forma indefinida para el rival, el sistema activa el piloto automático IFTTT.
 

# 13.1  Activación del piloto automático

•      Detección de inactividad: Si el temporizador de turno (30 segundos de decisión por turno) expira dos veces consecutivas sin recibir respuesta del cliente del Jugador A, el backend de Supabase cambia el estado del jugador a offline.
•      Lectura del script IFTTT: El motor de combate central (ColiseumLogic.js) lee de forma pasiva e instantánea el script de condiciones IFTTT que el Jugador A tenía configurado en su perfil al inicio del torneo (snapshot congelado).
•      Continuidad del bracket: El combate continúa ejecutándose en milisegundos en el servidor. El Jugador B (que sigue online) continúa jugando de forma manual en vivo contra la mente automatizada del rival, asegurando que el bracket no sufra retrasos y finalice dentro de los tiempos de la ventana horaria.
 

# 13.2  Relación con la inscripción anticipada

La mecánica de desconexión asíncrona y la inscripción anticipada son piezas complementarias del mismo diseño filosófico: el Geno siempre combate, independientemente de la presencia del jugador.
 
Escenario
Qué ocurre
Impacto económico para el jugador
Jugador inscrito anticipadamente que no se conecta el día del torneo
Su Geno combate con la configuración IFTTT congelada al inicio.
Ningún perjuicio. Si gana, recibe los premios. Si pierde, recibe la consolación en EV.
Jugador conectado que pierde internet durante el torneo
El sistema detecta 2 timeouts consecutivos y activa el piloto IFTTT.
Ningún perjuicio. El torneo continúa con su configuración guardada.
Jugador sin configuración IFTTT personalizada al inicio
El sistema aplica la configuración por defecto del servidor.
El Geno combate con comportamiento básico estándar.
 
Esta arquitectura convierte la inscripción al torneo en un compromiso del Geno, no del jugador. La comunicación en el juego puede reforzarlo: &apos;Una vez inscrito, tu Geno combatirá con tu estrategia IFTTT aunque no estés conectado. Asegúrate de que tu configuración esté lista antes del inicio.&apos;
 
 
Proyecto Genos  —  Especificaciones Técnicas Coliseo y Torneos V1.0 Consolidada  —  Confidencial
Todas las mecánicas, probabilidades y valores numéricos son definitivos hasta nueva versión firmada.

---

## 12. Registro Histórico de Ajustes de Base de Datos y Bugs de Producción
*Esta sección detalla las intervenciones críticas y correcciones aplicadas al servidor y base de datos Supabase.*

# 📝 Registro de Mejoras y Ajustes del Servidor — Proyecto Genos

Este documento sirve como bitácora de todas las modificaciones y restauraciones realizadas que no están descritas en el Documento Maestro ni registradas directamente en los comentarios del código de producción, para mantener un registro histórico y evitar que se olviden.

---

## 🛠️ Modificaciones de Base de Datos y Servidor (Supabase)

### 1. Creación de Columnas Dedicadas en Tabla `jugadores` (06/06/2026)
* **Descripción**: Se agregaron tres columnas dedicadas a la tabla `jugadores` en la base de datos de producción para alinearse con las consultas y guardados del cliente, evitando errores de solicitud errónea (`HTTP 400 Bad Request`).
* **Acción SQL DDL**:
  ```sql
  ALTER TABLE jugadores 
  ADD COLUMN IF NOT EXISTS lab_level integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS lab_xp integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comercio_desbloqueado boolean DEFAULT false;
  ```
* **Migración de Datos (Backfill)**: Se ejecutó un query de actualización masiva para rellenar estas nuevas columnas con los datos históricos existentes dentro del campo JSONB `datos_juego` de todos los usuarios:
  ```sql
  UPDATE jugadores
  SET 
    lab_level = COALESCE((datos_juego->>'labLevel')::integer, 1),
    lab_xp = COALESCE((datos_juego->>'labXP')::integer, 0),
    comercio_desbloqueado = COALESCE((datos_juego->>'comercioDesbloqueado')::boolean, false);
  ```

### 2. Restauración Manual del Progreso del Administrador (06/06/2026)
* **Cuenta afectada**: `saletti001@gmail.com` (UUID: `9814f37b-df28-458e-8fa0-73a09aa8100b`).
* **Problema**: El progreso se corrompió al inicializarse un estado por defecto de Nivel 1 en el cliente por caché vacía, y luego la amistad de los Genos se redujo a 0 debido al bug del decaimiento offline.
* **Solución**: Se ejecutó una consulta SQL para fusionar (merge) el objeto `datos_juego` actual del jugador con los datos correctos de la copia de seguridad no corrompida del Paso 10611 (eliminando los SVGs dinámicos para optimizar espacio).
* **Valores restaurados**:
  * Nivel de Laboratorio: **2** (con 219 XP).
  * Monedero: **103.51 $POL** y **0.79 de Bóveda**.
  * Mascota Activa: **Neo-Prime** (ID: 000005, Amistad: **4.80**).
  * Puntos de Amistad originales de Genos: BIO-742 (**6.43**), Mutcore (**6.44**), Neo-Prime (**4.80**), Nexomorph (**3.86**).

---

## ⚙️ Correcciones y Ajustes de Integración (Frontend)

### 1. Fix del Decaimiento de Amistad Offline (`EnergyManager.js`)
* **Descripción**: Se añadió inmunidad al decaimiento de amistad durante la desconexión del jugador.
* **Implementación**:
  * Se modificó la firma de `NexoEnergyManager.recuperar(segundosTranscurridos, isOffline)` para incluir el parámetro booleano `isOffline`.
  * La lógica que descuenta amistad por descuido/negligencia se protegió dentro de un bloque `if (!isOffline)`.
  * El método `aplicarRecuperacionPasiva` invoca `this.recuperar(segundosTranscurridos, true)`. Esto preserva las amistades mientras el usuario está desconectado y solo aplica el decaimiento por tiempo de juego activo en los ticks normales.

### 2. Corrección del Reloj de Red Nexo y CORS (`CloudManager.js`)
* **Descripción**: Se eliminaron los errores en la consola del navegador (`401 Unauthorized` / `405 Method Not Allowed`) provocados por la consulta del desfase horario con el servidor de Supabase.
* **Implementación**:
  * Se modificó `window.obtenerHoraServidor` para realizar una solicitud de tipo `GET` (en lugar de `HEAD`) apuntando a la ruta pública de salud del servicio de autenticación: `supabaseUrl + '/auth/v1/health'`.
  * Se inyectó la cabecera `apikey: supabaseKey` para pasar de forma segura a través de la pasarela de enlace API (Kong Gateway).
  * Esto permite obtener el encabezado `Date` del servidor de forma limpia, cumpliendo con la política de CORS y sin arrojar logs de error en rojo.

## 13. Veredicto y Siguientes Pasos — Roadmap de Implementaciones Pendientes y Siguientes Pasos — Actualizado Junio 2026

Proyecto Genos V12 es el documento mas completo del proyecto. El balance V13.9 resuelve la dependencia del RNG elemental. Los 3 Definitivos por elemento crean mind games reales. Los Torneos Tematicos hacen que el esfuerzo de criar y mejorar Genos tenga recompensa competitiva directa.

ESTADO ACTUAL (Junio 2026): El motor del juego está completo y funcional. Las Fases 1-3 están 100% implementadas. La Fase 4 (ADN), la Fase 5 (Coliseo), la Fase 6 (Web3) y la Fase 7 (Torneos) tienen sus motores y flujos principales funcionando off-chain y parcialmente on-chain (integración de MetaMask en la testnet Polygon Amoy para la Plaza de Comercio P2P y Torneos). La brecha crítica actual es el despliegue del Libro de Linaje en blockchain y contratos inteligentes on-chain para becas.



Las 3 Condiciones de Exito — Estado actual

✅ CUMPLIDA: El Reactor y el Santuario estan activos (SanctuaryManager.js + ReactorManager.js).

❌ PENDIENTE: La Fase 0 con los 500 codigos de Semilla Genesis. Sin comunidad previa, lanzas en el vacio.

✅ CUMPLIDA / EN TESTNET: La Plaza de Comercio (MarketManager.js) y los Torneos (TournamentManager.js) tienen integración real on-chain en Polygon Amoy Testnet mediante MetaMask. Las becas siguen simuladas localmente.



Proximos Pasos Concretos — Actualizados

✅ HECHO: Stat DEF implementado con formula min 35% ATK en ColiseumLogic.js.

✅ HECHO: Multiplicadores elementales x1.35/x0.75 y STAB x1.20 implementados.

✅ HECHO: Ciclo elemental correcto en UI: Biomutante > Sintetico > Toxico > Radiactivo > Cibernetico > Viral.

✅ HECHO: Sistema S-D implementado en RPGManager.js y app.js.

✅ HECHO: Laboratorio de Implantes (Ataques) en ShopManager.js (Matriz Tactica) con AttackCatalog.js.

✅ HECHO: Fase 3 completa (Santuario + Reactor operacionales).

--- PENDIENTES REALES ---

PRIORIDAD ALTA: Desplegar los contratos de Plaza de Comercio y Torneos en Polygon Mainnet, y migrar el Libro de Linaje y NFT on-chain (actualmente en Supabase).

PRIORIDAD ALTA: Crear sistema de Fase 0 — 500 codigos de Semilla Genesis irrevocables verificables.

PRIORIDAD ALTA: Publicar Capitulo 1 de la Genopedia (genopedia.io).

PRIORIDAD MEDIA: Implementar Liga Asincrona PvP real con matchmaking entre jugadores (actualmente solo NPCs locales).

PRIORIDAD MEDIA: Implementar ligas escalonadas Bronce-Diamante con entrada en $POL real.

✅ HECHO: Los 10 tipos de Torneos Temáticos adicionales están completamente implementados y son funcionales en el código.

PRIORIDAD BAJA: Dashboard RORS de monitoreo economico.

PRIORIDAD BAJA: Gen 0.5 — mecanica de Genos de evento esteriles.





Proyecto Genos V12 — Documento Maestro Definitivo · Actualizado Junio 2026
Codigo fuente: https://github.com/Saletti001/Mascotas
Estado: Motor de juego completo. Blockchain layer pendiente.
