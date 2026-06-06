import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ============================================================================
// tournament-webhook/index.ts
// Edge Function de Supabase que escucha eventos on-chain del contrato
// GenosTorneos.sol (Polygon Amoy / Mainnet) vía Alchemy Webhooks.
//
// Eventos procesados:
//   - InscripcionTorneo  → Registra la inscripción del jugador en Supabase.
//   - TorneoFinalizado   → Actualiza la clasificación y acredita premios.
//   - RetiroSaldo        → Registra el retiro del saldo pendiente on-chain.
// ============================================================================

// ── Configuración de red ──────────────────────────────────────────────────────
const POLYGON_RPC_URL =
  Deno.env.get("POLYGON_RPC_URL") || "https://rpc-amoy.polygon.technology/";
const TORNEOS_CONTRACT_ADDRESS = (
  Deno.env.get("TORNEOS_CONTRACT_ADDRESS") || ""
).toLowerCase();

// ── Keccak-256 de las firmas de eventos (calculados con ethers.id() v6.7.0) ──
//  ethers.id("InscripcionTorneo(uint256,address,uint256,uint256)")
const TOPIC_INSCRIPCION =
  "0xdedcdb2e8eccd7c88791d558072a7340b9b28ca6140880948e3977ff303ed4ac";
//  ethers.id("TorneoFinalizado(uint256,address,address,address,uint256,uint256)")
const TOPIC_FINALIZADO =
  "0x553f9f2a012b390b7306017d8fba13293a65783a88c2eb3ae81ebaed48b5d3b7";
//  ethers.id("RetiroSaldo(address,uint256)")
const TOPIC_RETIRO =
  "0x460b022ac72cd620d15d01885b10cfaf528d441ce65336513ca6564ab418b0ad";

// ── Servidor ──────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // CORS pre-flight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-alchemy-signature");
    const signingKey = Deno.env.get("ALCHEMY_WEBHOOK_SIGNING_KEY");

    // 1. Verificar firma HMAC del webhook (igual que buy-geno-webhook)
    if (signingKey && signature) {
      const isValid = await verifySignature(rawBody, signature, signingKey);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Firma de webhook invalida" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    console.log("⚡ [tournament-webhook] Recibido:", JSON.stringify(payload));

    const activities = payload.event?.activity || [];
    if (activities.length === 0) {
      return new Response(
        JSON.stringify({ message: "No hay actividades en el payload" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Supabase con Service Role (bypass RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const processedTxHashes: string[] = [];

    for (const activity of activities) {
      const txHash: string = activity.hash;
      console.log(`[tournament-webhook] Procesando tx: ${txHash}`);

      // 2. Obtener recibo desde la blockchain (protección anti-spoofing)
      const receipt = await fetchTransactionReceipt(txHash);
      if (!receipt) {
        console.error(`No se pudo obtener recibo para: ${txHash}`);
        continue;
      }
      if (receipt.status !== "0x1" && receipt.status !== 1) {
        console.error(`Transacción fallida en blockchain: ${txHash}`);
        continue;
      }

      // 3. Filtrar logs del contrato de torneos
      const logs: any[] = receipt.logs.filter((log: any) => {
        const matchesContract = TORNEOS_CONTRACT_ADDRESS
          ? log.address.toLowerCase() === TORNEOS_CONTRACT_ADDRESS
          : true;
        return matchesContract && log.topics && log.topics.length > 0;
      });

      for (const log of logs) {
        const topic0: string = log.topics[0];

        if (topic0 === TOPIC_INSCRIPCION) {
          await procesarInscripcion(supabase, log, txHash);
        } else if (topic0 === TOPIC_FINALIZADO) {
          await procesarFinalizacion(supabase, log, txHash);
        } else if (topic0 === TOPIC_RETIRO) {
          await procesarRetiro(supabase, log, txHash);
        } else {
          console.log(`[tournament-webhook] Topic no reconocido: ${topic0}`);
        }
      }

      processedTxHashes.push(txHash);
    }

    return new Response(
      JSON.stringify({ success: true, processed: processedTxHashes }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[tournament-webhook] Error crítico:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// ============================================================================
// PROCESADORES DE EVENTOS
// ============================================================================

/**
 * InscripcionTorneo(uint256 indexed torneoId, address indexed jugador,
 *                   uint256 montoPagado, uint256 saldoUsado)
 *
 * Registra la inscripción en la tabla `tournament_entries`.
 * Actualiza el historial del jugador en `jugadores.datos_juego`.
 */
async function procesarInscripcion(
  supabase: any,
  log: any,
  txHash: string
): Promise<void> {
  const torneoId = parseInt(log.topics[1], 16);
  const jugadorAddress = ("0x" + log.topics[2].slice(26)).toLowerCase();
  // data = abi.encode(montoPagado, saldoUsado) — 2 x uint256 = 64 bytes hex
  const data: string = log.data.startsWith("0x")
    ? log.data.slice(2)
    : log.data;
  const montoPagadoWei = BigInt("0x" + data.slice(0, 64));
  const saldoUsadoWei = BigInt("0x" + data.slice(64, 128));

  // Convertir Wei → POL (18 decimales)
  const montoPOL = Number(montoPagadoWei) / 1e18;
  const saldoUsadoPOL = Number(saldoUsadoWei) / 1e18;

  console.log(
    `[InscripcionTorneo] torneoId=${torneoId} jugador=${jugadorAddress} ` +
      `montoPOL=${montoPOL} saldoUsadoPOL=${saldoUsadoPOL}`
  );

  // Upsert en tabla tournament_entries
  const { error: entryError } = await supabase
    .from("tournament_entries")
    .upsert(
      {
        torneo_id: torneoId,
        jugador_address: jugadorAddress,
        monto_pagado_pol: montoPOL,
        saldo_usado_pol: saldoUsadoPOL,
        tx_hash: txHash,
        inscrito_at: new Date().toISOString(),
        status: "inscrito",
      },
      { onConflict: "torneo_id,jugador_address" }
    );

  if (entryError) {
    console.error(
      "[InscripcionTorneo] Error insertando entry:",
      entryError
    );
  }

  // Actualizar historial en el perfil del jugador
  const { data: jugador, error: jError } = await supabase
    .from("jugadores")
    .select("id, datos_juego")
    .filter(
      "datos_juego->wallet->>address",
      "ilike",
      jugadorAddress
    )
    .maybeSingle();

  if (jError || !jugador) {
    console.warn(
      `[InscripcionTorneo] Jugador no encontrado para wallet: ${jugadorAddress}`
    );
    return;
  }

  const datos = jugador.datos_juego || {};
  if (!datos.tournament_history) datos.tournament_history = [];
  datos.tournament_history.unshift({
    torneoId,
    tipo: "inscripcion",
    montoPOL,
    txHash,
    fecha: new Date().toISOString(),
  });
  // Limitar historial a 50 entradas
  if (datos.tournament_history.length > 50) {
    datos.tournament_history = datos.tournament_history.slice(0, 50);
  }

  const { error: updateError } = await supabase
    .from("jugadores")
    .update({ datos_juego: datos })
    .eq("id", jugador.id);

  if (updateError) {
    console.error(
      "[InscripcionTorneo] Error actualizando perfil:",
      updateError
    );
  } else {
    console.log(
      `✅ [InscripcionTorneo] Inscripción registrada para ${jugadorAddress} en torneoId=${torneoId}`
    );
  }
}

/**
 * TorneoFinalizado(uint256 indexed torneoId, address primerLugar,
 *                  address segundoLugar, address tercerLugar,
 *                  uint256 premiosPagados, uint256 desviadoTesoreria)
 *
 * Actualiza la tabla `tournament_results` y acredita premios off-chain
 * a los perfiles de los jugadores humanos.
 */
async function procesarFinalizacion(
  supabase: any,
  log: any,
  txHash: string
): Promise<void> {
  const torneoId = parseInt(log.topics[1], 16);

  // data = abi.encode(primer, segundo, tercer, premiosPagados, desviadoTesoreria)
  // Sin indexed: 5 x 32 bytes = 160 bytes hex
  const data: string = log.data.startsWith("0x")
    ? log.data.slice(2)
    : log.data;

  const primerLugar = ("0x" + data.slice(24, 64)).toLowerCase();
  const segundoLugar = ("0x" + data.slice(88, 128)).toLowerCase();
  const tercerLugar = ("0x" + data.slice(152, 192)).toLowerCase();
  const premiosPagadosWei = BigInt("0x" + data.slice(192, 256));
  const desviadoTesoreriaWei = BigInt("0x" + data.slice(256, 320));

  const premiosPOL = Number(premiosPagadosWei) / 1e18;
  const desviadoPOL = Number(desviadoTesoreriaWei) / 1e18;

  console.log(
    `[TorneoFinalizado] torneoId=${torneoId}\n` +
      `  1º=${primerLugar} 2º=${segundoLugar} 3º=${tercerLugar}\n` +
      `  premiosPOL=${premiosPOL} desviadoTesoreriaPOL=${desviadoPOL}`
  );

  // Upsert en tournament_results
  const { error: resultError } = await supabase
    .from("tournament_results")
    .upsert(
      {
        torneo_id: torneoId,
        primer_lugar: primerLugar,
        segundo_lugar: segundoLugar,
        tercer_lugar: tercerLugar,
        premios_pagados_pol: premiosPOL,
        desviado_tesoreria_pol: desviadoPOL,
        tx_hash: txHash,
        finalizado_at: new Date().toISOString(),
      },
      { onConflict: "torneo_id" }
    );

  if (resultError) {
    console.error(
      "[TorneoFinalizado] Error insertando resultado:",
      resultError
    );
  }

  // Marcar todas las entries de este torneo como finalizadas
  await supabase
    .from("tournament_entries")
    .update({ status: "finalizado" })
    .eq("torneo_id", torneoId);

  // Acreditar premios en el perfil off-chain de los ganadores humanos
  // Los premios ya se distribuyeron on-chain en saldosPendientes del contrato.
  // Aquí anotamos en Supabase para que el frontend los refleje.
  const ganadores = [
    { address: primerLugar, puesto: 1 },
    { address: segundoLugar, puesto: 2 },
    { address: tercerLugar, puesto: 3 },
  ];

  // La distribución de premios del contrato es: 50% / 30% / 20% del pozo
  // Pozo = premiosPOL (ya calculado por el contrato)
  const distribucion = [0.5, 0.3, 0.2];

  for (const g of ganadores) {
    // Saltear direcciones nulas (NPC)
    if (
      !g.address ||
      g.address === "0x" + "0".repeat(40)
    ) {
      continue;
    }

    const { data: jugador, error: jError } = await supabase
      .from("jugadores")
      .select("id, datos_juego")
      .filter("datos_juego->wallet->>address", "ilike", g.address)
      .maybeSingle();

    if (jError || !jugador) {
      console.warn(
        `[TorneoFinalizado] Jugador ${g.address} no encontrado en Supabase`
      );
      continue;
    }

    const datos = jugador.datos_juego || {};
    const premioIndividual = premiosPOL * distribucion[g.puesto - 1];

    // Registrar en historial
    if (!datos.tournament_history) datos.tournament_history = [];
    datos.tournament_history.unshift({
      torneoId,
      tipo: "premio",
      puesto: g.puesto,
      premioPOL: premioIndividual,
      txHash,
      fecha: new Date().toISOString(),
    });
    if (datos.tournament_history.length > 50) {
      datos.tournament_history = datos.tournament_history.slice(0, 50);
    }

    // Actualizar contador de victorias si es primer lugar
    if (g.puesto === 1) {
      datos.torneo_victorias = (datos.torneo_victorias || 0) + 1;
    }
    datos.torneo_participaciones = (datos.torneo_participaciones || 0) + 1;

    const { error: updateError } = await supabase
      .from("jugadores")
      .update({ datos_juego: datos })
      .eq("id", jugador.id);

    if (updateError) {
      console.error(
        `[TorneoFinalizado] Error actualizando perfil de ${g.address}:`,
        updateError
      );
    } else {
      console.log(
        `✅ [TorneoFinalizado] ${g.puesto}º lugar (${g.address}) acreditado ${premioIndividual.toFixed(4)} POL`
      );
    }
  }
}

/**
 * RetiroSaldo(address indexed jugador, uint256 monto)
 *
 * Registra el retiro del saldo on-chain en el historial del jugador.
 */
async function procesarRetiro(
  supabase: any,
  log: any,
  txHash: string
): Promise<void> {
  const jugadorAddress = ("0x" + log.topics[1].slice(26)).toLowerCase();
  const data: string = log.data.startsWith("0x")
    ? log.data.slice(2)
    : log.data;
  const montoWei = BigInt("0x" + data.slice(0, 64));
  const montoPOL = Number(montoWei) / 1e18;

  console.log(
    `[RetiroSaldo] jugador=${jugadorAddress} montoPOL=${montoPOL}`
  );

  const { data: jugador, error: jError } = await supabase
    .from("jugadores")
    .select("id, datos_juego")
    .filter("datos_juego->wallet->>address", "ilike", jugadorAddress)
    .maybeSingle();

  if (jError || !jugador) {
    console.warn(
      `[RetiroSaldo] Jugador no encontrado para wallet: ${jugadorAddress}`
    );
    return;
  }

  const datos = jugador.datos_juego || {};
  if (!datos.tournament_history) datos.tournament_history = [];
  datos.tournament_history.unshift({
    tipo: "retiro_saldo",
    montoPOL,
    txHash,
    fecha: new Date().toISOString(),
  });
  if (datos.tournament_history.length > 50) {
    datos.tournament_history = datos.tournament_history.slice(0, 50);
  }

  // Acumulador total de POL retirado (útil para analítica)
  datos.pol_total_retirado = (datos.pol_total_retirado || 0) + montoPOL;

  const { error: updateError } = await supabase
    .from("jugadores")
    .update({ datos_juego: datos })
    .eq("id", jugador.id);

  if (updateError) {
    console.error("[RetiroSaldo] Error actualizando perfil:", updateError);
  } else {
    console.log(
      `✅ [RetiroSaldo] ${jugadorAddress} retiró ${montoPOL.toFixed(4)} POL`
    );
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/** Verifica firma HMAC-SHA256 del webhook de Alchemy */
async function verifySignature(
  body: string,
  signature: string,
  signingKey: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  return crypto.subtle.verify("HMAC", key, hexToBytes(signature), encoder.encode(body));
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Consulta eth_getTransactionReceipt al RPC de Polygon */
async function fetchTransactionReceipt(txHash: string): Promise<any> {
  const response = await fetch(POLYGON_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getTransactionReceipt",
      params: [txHash],
    }),
  });
  if (!response.ok) return null;
  const json = await response.json();
  return json.result;
}
