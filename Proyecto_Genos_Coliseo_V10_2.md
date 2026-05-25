PROYECTO GENOS

Sistema de Combate Completo — Documento Tecnico V10.2

Elementos · Stats · Ataques · Estados · Ligas · Torneos · 1v1 · 3v3

Abril 2026





1. Fundamentos del Sistema de Combate

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



1.2 Formula de Dano — V10.2

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



Coste de aprendizaje en el Dojo (Fase 5): Basico ~10 EV | Intermedio ~25 EV | Avanzado ~50 EV | Definitivo ~100 EV.

Los ataques se pueden olvidar y reensenar libremente pagando el coste en EV.



2. Los 6 Elementos y Multiplicadores de Dano

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

Multiplicador V10.2

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





3. Catalogo de 60 Ataques Especiales — 10 por Elemento

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

Efecto: 100% ATK. Con Quemadura activa: 135% ATK (nerf de V10.2). STAB. [NERFADO: antes 140/175]

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





4. Los 11 Estados de Combate

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





5. Sistema de Combate 1v1

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





6. Sistema de Combate 3v3 por Equipos

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





7. Sistema de Torneos Tematicos

Los Torneos Tematicos hacen que el esfuerzo de criar y mejorar Genos valga la pena competitivamente. En un ciclo de 4 semanas, cada tipo de Geno tiene su momento de brillo. Son una capa adicional sobre la Liga Asincrona y los Torneos de Llaves — no los reemplazan.



7.1 Los 12 Tipos de Torneo

Categoria A — Restriccion de rareza

Torneo

Descripcion

Entrada

Premio 1er lugar

Solo Comunes

Solo Comunes de cualquier nivel. El Comun nivel 50 Rango S con Slot 4 es el favorito.

$0.05 EV

0.40 EV + cosmetico

Copa Raro

Solo Raros. Genes de crianza como Linaje Ascendente crean ventaja estadistica.

$0.25 EV

0.50 EV + item Dojo

El Olimpo

Solo nivel 45+. Gen Especialista de Elite (nivel 60) tiene ventaja sobre todos.

$1.50 EV

2.00 EV + NFT unico



Categoria B — Restriccion elemental

Torneo

Descripcion

Entrada

Premio 1er lugar

Liga Elemental Pura

Solo el elemento anunciado esa semana (rota entre los 6). Nucleo Elemental Puro y Catalizador de Afinidad son los genes estrella.

$0.50 EV

0.60 EV + item elemental

Torneo Inverso

Solo el elemento en DESVENTAJA esa semana. Gen META_A (+10% todos los stats) se activa automaticamente.

$0.50 EV

0.90 EV (+50% base)

Copa de los Dos Mundos

Solo Genos con el gene Elemento Dual activo y verificado por Escaner Completo.

$1.00 EV

1.50 EV + Escaner gratis



Categoria C — Restriccion de progresion

Torneo

Descripcion

Entrada

Premio 1er lugar

Liga Novatos

Solo nivel 1-20. Sin Slot 4. Los genes de progresion (Aprendiz Acelerado, Puntos de Inflexion) tienen ventaja directa.

$0.05 EV

0.30 EV + XP bonus

El Gran Linaje

Solo Genos con al menos un progenitor registrado on-chain en el Libro de Linaje. Gen 0 puros excluidos.

$0.75 EV

1.00 EV + NFT emblema



Categoria D — Reglas especiales

Torneo

Descripcion

Entrada

Premio 1er lugar

Torneo Sin Genes

Genes ocultos desactivados. Solo stats, nivel y 4 ataques. El torneo de habilidad pura.

$0.50 EV

0.80 EV

Modo Berserker

Stat DEF ignorado para todos. Combates de 3-5 turnos. Glass Cannon domina. Valida el valor de la DEF por contraste.

$0.50 EV

0.80 EV

El Espejo

Todos los participantes usan el mismo Geno base (stats y nivel identicos). Solo los 3 ataques de los Slots 2, 3 y 4 marcan la diferencia.

$0.30 EV

0.60 EV + titulo

Torneo del Fundador

Solo Semillas Genesis y sus descendientes directos de primer nivel. Max 500 participantes posibles.

$2.00 EV

5.00 EV + NFT Fundador irrepetible



7.2 Torneos Tematicos con Version 3v3

Torneo 3v3

Restriccion del equipo

Lo especial en 3v3

Liga de Equipos (permanente)

Sin restriccion (dentro de la liga de rareza correspondiente).

IFTTT de equipo como ventaja diferencial. Ranking propio.

Torneo Elemental de Equipo

Los 3 Genos del mismo elemento anunciado esa semana.

STAB activo en todos. Con CLAN_R en los 3 y elemento activo: el bonus se maximiza.

Torneo de Linaje de Equipo

Los 3 Genos comparten al menos un progenitor on-chain.

El Breeder que construyo una familia con genes similares tiene ventaja real. Premio: NFT Familia Generacional.

Torneo Inverso de Equipos

Los 3 Genos del elemento en DESVENTAJA. Con META_A en los 3: +10% todos los stats.

CLAN_R + META_A en los 3 Genos es el combo de equipo underdog mas poderoso del juego.

El Olimpo de Equipos (mensual)

El Geno mas bajo del equipo debe ser nivel 40+. Modo Tactico en tiempo real.

Premio: 9.00 EV (3.00 por Geno) + NFT Equipo del Mes registrado on-chain.



7.3 El Ciclo Rotativo de 4 Semanas

Semana

Torneo principal

Torneo secundario

Meta activado

Premio destacado

Semana 1

Solo Comunes / Copa Raro

Liga Novatos

Genes de progresion y crianza S-D

Cosmetico + EV

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

El Olimpo / Sin Genes / Berserker / El Espejo (rotacion)

Copa de los Dos Mundos

Situacional segun el torneo

NFT unico + EV alta



7.4 Calendario Semanal de un Torneo Tematico

Dia

Evento

Descripcion

Lunes

Anuncio oficial

Torneo de la semana con 7 dias de anticipacion. Tipo, restriccion y premios.

Lunes-Jue

Preparacion

Cambio de ataques en el Dojo con 20% descuento (ataques del elemento del torneo). IFTTT gratis.

Miercoles

Registro abierto

Inscripcion del Geno o equipo. Ataques cambiables hasta el jueves 12:00.

Jueves 12:00

Cierre

Ataques y IFTTT fijos. El jugador mejor preparado tiene ventaja.

Viernes

Inicio de combates

Combates resueltos con el sistema asincronico.

Domingo

Finalistas y premios

Top 3 recibe recompensas. Victorias en Libro de Linaje. Puntos de temporada actualizados.



7.5 Sistema de Recompensas — 3 Capas

Capa 1 — Inmediatas (en EV)

Posicion

Torneo de Rareza

Torneo Elemental

El Olimpo / Fundador

Participacion

1er lugar

0.40 EV + cosmetico

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



Capa 2 — Permanentes en blockchain

Gen Fama Genetica (FAME_G): cada victoria en torneo tematico queda registrada on-chain con nombre del torneo, semana, rival derrotado y posicion final. El historial se vende con el Geno.

Gen Legado de Torneo (TOUR_L): cada torneo ganado suma +0.5% al split de Scholarship (hasta 40% tras 20 victorias). Los torneos tematicos cuentan igual que los de liga.

El Olimpo y el Torneo del Fundador generan una entrada especial distinguida en el Libro de Linaje. La distincion mas valorada del marketplace.



Capa 3 — Estacional (cada 12 semanas)

Puntos de temporada: participacion = 1 punto. Victoria de ronda = 2 puntos adicionales. Primer lugar = 5 puntos adicionales.

Top 10 de temporada: NFT cosmetico de temporada unico. No replicable ni comprable.

Campeon de temporada: titulo "Campeon Temporal T-[numero]" registrado on-chain. Solo existe 1 por temporada en toda la historia del juego.

Control economico (RORS): si los torneos generan demasiada EV (ratio < 0.65), las entradas del siguiente ciclo suben automaticamente 10-20%.



8. Resumen Tecnico para Implementacion

Este documento es la referencia tecnica completa para implementar el sistema de combate en ColiseumLogic.js, AttackCatalog.js y la UI del Coliseo. Todos los valores numericos son definitivos para V10.2.



Variables clave del motor

// Multiplicadores elementales V10.2

VENTAJA_ELEMENTAL = 1.35

DESVENTAJA_ELEMENTAL = 0.75

STAB = 1.20  // Solo Especiales y Definitivos del propio elemento

CRITICO = 1.50



// Formula DEF V10.2

MINIMO_DANO = 0.35  // 35% del ATK atacante como minimo garantizado



// Penetracion de armadura V10.2

PERFORANTE_ESPECIAL = 0.50  // Ignora 50% DEF

PERFORANTE_DEFINITIVO = 0.65  // Ignora 65% DEF

POSTURA_INQUEBRANTABLE = 0.20  // Con ese gene, el perforante solo ignora 20%



// 3v3: cambio de Geno

CAMBIO_FORZADO_CONSUME_TURNO = false

CAMBIO_VOLUNTARIO_CONSUME_TURNO = true

ESTADOS_SE_TRANSFIEREN_AL_RELEVO = false

CORROSION_ES_PERMANENTE_Y_AFECTA_A_TODO_EL_EQUIPO_RIVAL = true





Proyecto Genos — Sistema de Combate Completo V10.2 · Documento Tecnico · Abril 2026

