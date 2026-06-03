DOCUMENTO DE ESPECIFICACIÓN TÉCNICA MAESTRO: ARQUITECTURA HÍBRIDA WEB2/WEB3, CONTENCIÓN DE COSTES Y FLUJOS FINANCIEROS SIN CUSTODIA

Proyecto: Genos

Fase de Implementación: Post-Fase 2 / Fase de Seguridad Financiera (Pre-Mainnet)

Entorno de Red: Polygon (Mainnet)

Infraestructura Backend: Supabase (PostgreSQL + Serverless Edge Functions)

Infraestructura Web3: Privy SDK + ERC-4337 (Account Abstraction) + Gnosis Safe (Multisig)

Versión del Documento: V1.2 (Unificado y Consolidado)

1. El Problema de la Infraestructura Financiera (Análisis de Costes)

Las pasarelas de Wallets Embebidas (como Privy o Web3Auth) resuelven la fricción del onboarding Web3 tradicional al crear una billetera inteligente de manera invisible mediante inicios de sesión sociales Web2 (Google, Discord, Apple o correo). Sin embargo, estas plataformas cobran bajo un modelo de licenciamiento comercial basado en MAU (Monthly Active Users - Usuarios Activos Mensuales).

Cualquier usuario que cargue el SDK de Privy e inicie sesión dentro de un ciclo de 30 días consume una unidad del cupo contratado, independientemente de si tiene saldo, si realiza transacciones en la red Polygon o si simplemente entra a curiosear en la interfaz de juego. En un videojuego gratuito (Free-to-Play), se estima que entre el 75% y el 85% de los usuarios registrados son "espectadores" que nunca realizarán transacciones financieras reales.

Si el SDK de Web3 se inicializa de forma automática en el de registro general del juego o al navegar de forma casual por los menús del cliente, un flujo masivo de usuarios (ej. 100,000 jugadores) generaría una factura de infraestructura de miles de dólares por usuarios "fantasma" que no aportan capital a la economía del juego.

Este documento técnico detalla la arquitectura para aislar el entorno Web3 de forma absoluta, utilizando tres barreras de protección de software off-chain gestionadas íntegramente por Supabase, junto con el estándar de Abstracción de Cuentas para garantizar transacciones de bajo coste sin custodia.

2. Componente 1: Sistema de Meta-Progresión (Nivel del Laboratorio)

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

3. Componente 2: Interfaz Espejo (Mock UI) y Carga Perezosa

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

4. Componente 3: El Permiso de Acceso a la Red de Comercio (Licencia)

Para activar definitivamente las funciones de la wallet embebida y la Plaza de Comercio P2P, el jugador debe adquirir dentro del juego un objeto digital sin valor comercial externo llamado "Permiso de Acceso a la Red de Comercio" (Licencia de Comerciante de Genos) dentro del Bazar Consumibles.

4.1 Condicionales de Desbloqueo (Muro de Seguridad)

La tienda del Bazar no permitirá la adquisición de la Licencia a menos que se verifiquen atómicamente los siguientes requisitos en el backend:

Nivel Mínimo de Laboratorio: El campo lab_level de la cuenta en la tabla profiles debe ser igual o superior a Nivel 5. Esto garantiza un mínimo de esfuerzo de juego real por parte de un humano.

Coste en Esencia Vital (EV): El jugador debe pagar una tasa fija única de 15.00 EV (moneda off-chain del juego, no vendible por dinero real). Esto actúa como un sumidero de valor para la economía de juego y detiene la creación de cuentas automatizadas por bots, ya que la EV requiere juego activo para ser acumulada.

Una vez que el backend procesa el cobro de la Esencia Vital y confirma el Nivel 5 de Laboratorio, actualiza el valor en base de datos:

UPDATE profiles SET comercio_desbloqueado = true,     esencia_vital_balance = esencia_vital_balance - 15.00 WHERE id = 'user_id' AND lab_level >= 5;

5. El Marco Legal Europeo y la No-Custodia (Análisis MiCA)

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

6. Componente 4: Abstracción de Cuentas (ERC-4337) para Micropagos

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

7. Componente 5: Flujo Híbrido de Comercio P2P (Geno Off-chain / Pago On-chain)

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

8. Componente 6: Sistema de Cascada de Torneos, Cancelación y NPCs

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

9. Tabla Comparativa de Modelos de Integración y costes de Privy

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

10. Referencias de Integración en el Documento Maestro V10.1

Este sistema de contención e infraestructura de red híbrida debe integrarse en las siguientes áreas del Documento Maestro definitivo del proyecto:

Fase 2 — Economía Básica y Supervivencia: Insertar la adquisición del "Permiso de Acceso a la Red de Comercio" (Licencia de Comercio) en el Bazar Consumibles por un precio de 15.00 EV. Configurar el campo lógico comercio_desbloqueado y el atributo lab_level de la meta-progresión en el gestor de inventario y mochila del cliente.

Fase 6 — Expansión Web3 y Becas: Sustituir el flujo tradicional que requiere acuñar obligatoriamente un NFT antes de vender por el sistema de Comercio Híbrido de transacción off-chain con liquidación on-chain mediante Supabase Edge Functions. El registro NFT (coste inferior a $3) queda exclusivamente reservado como una acción opcional del usuario para retirar el Geno de los servidores locales.

Sección 11 — Arquitectura Técnica: Registrar el uso de las Supabase Edge Functions (Serverless) como la capa inteligente de validación de transacciones que conecta de forma asíncrona la red Polygon con la base de datos de juego off-chain sin costes fijos de servidor.

11. Sistema de Seguridad de la Bóveda de Tesorería (Wallet Multi-firma)

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

