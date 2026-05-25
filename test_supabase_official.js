require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
    console.log("Iniciando prueba de conexión con cliente oficial de Supabase...");
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    
    if (!url || !key) {
        console.error("No se encontraron SUPABASE_URL o SUPABASE_ANON_KEY en el archivo .env");
        return;
    }
    
    console.log("URL leída del .env:", url);
    const supabase = createClient(url, key);

    try {
        console.log("1. Probando lectura REST de la tabla 'market_listings'...");
        const { data, error } = await supabase
            .from('market_listings')
            .select('*')
            .limit(1);

        if (error) {
            console.error("❌ Error de lectura REST:", error.message);
        } else {
            console.log("✅ Lectura exitosa. Estructura de tabla detectada:");
            if (data.length > 0) {
                console.log(Object.keys(data[0]));
            } else {
                console.log("La tabla está vacía, pero existe y es accesible.");
            }
        }

        console.log("\n2. Probando conexión Realtime a 'market_listings'...");
        const channel = supabase.channel('system-test-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'market_listings' },
                (payload) => {
                    console.log("Recibido evento Realtime:", payload);
                }
            )
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log("✅ Subscripción Realtime Exitosa! WebSockets operativos.");
                    console.log("\nPrueba completada. Saliendo...");
                    process.exit(0);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error("❌ Error en el canal Realtime:", err || "Verifica si Realtime está habilitado en tu panel.");
                    process.exit(1);
                } else if (status === 'TIMED_OUT') {
                    console.error("❌ Tiempo de espera agotado al conectar al Realtime.");
                    process.exit(1);
                }
            });
            
    } catch (e) {
        console.error("Fallo inesperado:", e);
    }
}

testSupabase();
