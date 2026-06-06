import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Configuración de red Polygon (Amoy por defecto para testnet, Matic para mainnet)
const POLYGON_RPC_URL = Deno.env.get("POLYGON_RPC_URL") || "https://rpc-amoy.polygon.technology/";
const CONTRACT_ADDRESS = (Deno.env.get("CONTRACT_ADDRESS") || "").toLowerCase();
const COMPRA_GENO_TOPIC = "0x7722d925f849639c256d32bc961d016ca86501c344b92a8b7c468b4da01453ec";

Deno.serve(async (req: Request) => {
  // Manejo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-alchemy-signature");
    const signingKey = Deno.env.get("ALCHEMY_WEBHOOK_SIGNING_KEY");

    // 1. Validar firma del Webhook si la clave está configurada
    if (signingKey && signature) {
      const isValid = await verifySignature(rawBody, signature, signingKey);
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Firma de webhook invalida" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log("⚡ Recibido Webhook de Alchemy:", JSON.stringify(payload));

    // Alchemy Webhooks envían la información dentro de event.activity
    const activities = payload.event?.activity || [];
    if (activities.length === 0) {
      return new Response(JSON.stringify({ message: "No hay actividades en el payload" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Inicializar Supabase Client con Service Role (Bypass RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const processedTxHashes = [];

    for (const activity of activities) {
      const txHash = activity.hash;
      console.log(`Procesando transaccion on-chain: ${txHash}`);

      // 2. Consultar directamente a la blockchain para verificar la transaccion (evita spoofing)
      const receipt = await fetchTransactionReceipt(txHash);
      if (!receipt) {
        console.error(`No se pudo obtener el recibo para la transaccion: ${txHash}`);
        continue;
      }

      if (receipt.status !== "0x1" && receipt.status !== 1) {
        console.error(`La transaccion ${txHash} fallo en la blockchain`);
        continue;
      }

      // 3. Buscar el evento CompraGeno en los logs de la transaccion
      const compLog = receipt.logs.find((log: any) => {
        const matchesContract = CONTRACT_ADDRESS ? log.address.toLowerCase() === CONTRACT_ADDRESS : true;
        const matchesTopic = log.topics && log.topics[0] === COMPRA_GENO_TOPIC;
        return matchesContract && matchesTopic;
      });

      if (!compLog) {
        console.error(`No se encontro el evento CompraGeno en los logs de la tx: ${txHash}`);
        continue;
      }

      // Decodificar topics
      // topics[0] = event signature
      // topics[1] = compraId (uint256)
      // topics[2] = comprador (address)
      // topics[3] = vendedor (address)
      const compraId = parseInt(compLog.topics[1], 16);
      const compradorAddress = "0x" + compLog.topics[2].slice(26).toLowerCase();
      const vendedorAddress = "0x" + compLog.topics[3].slice(26).toLowerCase();

      console.log(`Datos decodificados del evento:
        - Compra ID: ${compraId}
        - Comprador: ${compradorAddress}
        - Vendedor: ${vendedorAddress}
      `);

      // 4. Buscar la oferta activa en Supabase
      const { data: listing, error: findError } = await supabase
        .from("market_listings")
        .select("*")
        .eq("id", compraId)
        .single();

      if (findError || !listing) {
        console.error(`No se encontro el listado en base de datos para ID: ${compraId}`);
        continue;
      }

      if (listing.status !== "active") {
        console.log(`El listado ${compraId} ya no esta activo. Estado actual: ${listing.status}`);
        continue;
      }

      // 5. Buscar al jugador comprador por su wallet address
      const { data: comprador, error: compError } = await supabase
        .from("jugadores")
        .select("*")
        .filter("datos_juego->wallet->>address", "ilike", compradorAddress)
        .maybeSingle();

      if (compError || !comprador) {
        console.error(`No se encontro al comprador en Supabase con la wallet: ${compradorAddress}`);
        continue;
      }

      // 6. Buscar al jugador vendedor
      const { data: vendedor, error: vendError } = await supabase
        .from("jugadores")
        .select("*")
        .eq("id", listing.sellerId)
        .single();

      if (vendError || !vendedor) {
        console.error(`No se encontro al vendedor en Supabase con ID: ${listing.sellerId}`);
        continue;
      }

      // 7. Modificar atómicamente los perfiles en la base de datos
      const compradorDatos = comprador.datos_juego || {};
      const vendedorDatos = vendedor.datos_juego || {};

      // Eliminar el item/Geno de misVentas del vendedor
      if (vendedorDatos.misVentas) {
        vendedorDatos.misVentas = vendedorDatos.misVentas.filter(
          (v: any) => v.saleId !== listing.saleId && (v.id !== listing.itemId)
        );
      }

      // Añadir item/Geno al comprador
      const itemData = listing.itemData || {};
      // Quitar campos de venta temporales
      delete itemData.pricePol;
      delete itemData.listadoRemoto;
      delete itemData.sellerId;
      delete itemData.saleId;

      if (listing.isItem) {
        compradorDatos.inventario = addItemToInventory(compradorDatos.inventario, itemData, itemData.count || 1);
      } else {
        if (!compradorDatos.misGenos) compradorDatos.misGenos = [];
        compradorDatos.misGenos.push(itemData);
      }

      // Actualizar comprador y vendedor en Supabase
      const { error: updateComprador } = await supabase
        .from("jugadores")
        .update({ datos_juego: compradorDatos })
        .eq("id", comprador.id);

      if (updateComprador) {
        console.error(`Error al actualizar comprador ${comprador.id}:`, updateComprador);
        continue;
      }

      const { error: updateVendedor } = await supabase
        .from("jugadores")
        .update({ datos_juego: vendedorDatos })
        .eq("id", vendedor.id);

      if (updateVendedor) {
        console.error(`Error al actualizar vendedor ${vendedor.id}:`, updateVendedor);
        continue;
      }

      // Marcar listado como vendido y asociar el comprador
      const updatedItemData = { ...listing.itemData, buyerId: comprador.id };
      const { error: updateListing } = await supabase
        .from("market_listings")
        .update({ status: "sold", itemData: updatedItemData })
        .eq("id", listing.id);

      if (updateListing) {
        console.error(`Error al actualizar listado ${listing.id} a sold:`, updateListing);
        continue;
      }

      console.log(`✅ Liquidacion completada con exito para tx: ${txHash}. ID Venta: ${listing.id}`);
      processedTxHashes.push(txHash);
    }

    return new Response(JSON.stringify({ success: true, processed: processedTxHashes }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Critical error in webhook:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// Helper: Firma de webhook
async function verifySignature(body: string, signature: string, signingKey: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(signingKey);
  const msgData = encoder.encode(body);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBuffer = hexToBytes(signature);
  return await crypto.subtle.verify("HMAC", key, sigBuffer, msgData);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Helper: Consultar RPC de Polygon para obtener el recibo
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

// Helper: Añadir items al inventario
function addItemToInventory(inventario: any, item: any, count: number) {
  if (!inventario) inventario = {};
  if (!inventario.slots) inventario.slots = [];
  
  let found = false;
  for (let i = 0; i < inventario.slots.length; i++) {
    const slot = inventario.slots[i];
    if (slot && slot.id === item.id) {
      slot.count = (slot.count || 0) + count;
      found = true;
      break;
    }
  }
  
  if (!found) {
    let placed = false;
    for (let i = 0; i < inventario.slots.length; i++) {
      if (inventario.slots[i] === null) {
        inventario.slots[i] = { ...item, count: count };
        placed = true;
        break;
      }
    }
    if (!placed) {
      inventario.slots.push({ ...item, count: count });
    }
  }
  return inventario;
}
