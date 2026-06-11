-- ============================================================================
-- Migración: Registro y limitación de uso de fantasmas asíncronos en Nexus Arena
-- Proyecto Genos - Ajustes Técnicos Clave
-- ============================================================================

-- 1. Tabla de uso de fantasmas
CREATE TABLE IF NOT EXISTS uso_fantasmas (
    id          BIGSERIAL PRIMARY KEY,
    jugador_id  UUID NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
    fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
    usos        INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_jugador_fecha UNIQUE (jugador_id, fecha)
);

-- Habilitar RLS
ALTER TABLE uso_fantasmas ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de usos para el matchmaking
DROP POLICY IF EXISTS "uso_fantasmas_select_public" ON uso_fantasmas;
CREATE POLICY "uso_fantasmas_select_public" 
    ON uso_fantasmas FOR SELECT 
    USING (true);

-- 2. Vista de fantasmas (obtiene el total de usos de hoy)
CREATE OR REPLACE VIEW vista_fantasmas AS
SELECT 
    j.id, 
    j.email, 
    j.datos_juego, 
    j.ifttt_script, 
    COALESCE(u.usos, 0) AS usos_hoy
FROM jugadores j
LEFT JOIN uso_fantasmas u ON u.jugador_id = j.id AND u.fecha = CURRENT_DATE;

-- 3. Función RPC segura para registrar la batalla y acreditar EV
CREATE OR REPLACE FUNCTION registrar_batalla_fantasma(
    p_ghost_owner_id UUID,
    p_ghost_gano BOOLEAN
)
RETURNS JSONB
SECURITY DEFINER -- Ejecuta con privilegios del creador (bypass RLS)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usos INTEGER;
    v_ev_reward INTEGER := 0;
    v_result JSONB;
BEGIN
    -- Upsert en la tabla de usos para hoy
    INSERT INTO uso_fantasmas (jugador_id, fecha, usos)
    VALUES (p_ghost_owner_id, CURRENT_DATE, 1)
    ON CONFLICT (jugador_id, fecha)
    DO UPDATE SET usos = uso_fantasmas.usos + 1
    RETURNING usos INTO v_usos;

    -- Si el fantasma ganó y está dentro del límite de 5 usos
    IF p_ghost_gano AND v_usos <= 5 THEN
        -- Recompensa aleatoria entre 25 y 45 EV
        v_ev_reward := floor(random() * (45 - 25 + 1) + 25)::integer;
        
        -- Asegurar estructura datos_juego -> inventario
        UPDATE jugadores
        SET datos_juego = jsonb_set(
            COALESCE(datos_juego, '{}'::jsonb),
            '{inventario}',
            COALESCE(datos_juego -> 'inventario', '{}'::jsonb)
        )
        WHERE id = p_ghost_owner_id;

        -- Sumar EV
        UPDATE jugadores
        SET datos_juego = jsonb_set(
            datos_juego,
            '{inventario,vitalEssence}',
            to_jsonb(COALESCE((datos_juego -> 'inventario' ->> 'vitalEssence')::numeric, 0) + v_ev_reward)
        )
        WHERE id = p_ghost_owner_id;
    END IF;

    -- Construir resultado
    v_result := jsonb_build_object(
        'usos_hoy', v_usos,
        'ev_ganado', v_ev_reward
    );

    RETURN v_result;
END;
$$;

-- 4. Tabla para registrar cada combate individual de PvP
CREATE TABLE IF NOT EXISTS combates_coliseo (
    id              BIGSERIAL PRIMARY KEY,
    jugador_id      UUID NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
    liga            TEXT NOT NULL,
    es_realtime     BOOLEAN NOT NULL,
    es_victoria     BOOLEAN NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE combates_coliseo ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de combates para auditorías y dashboards
DROP POLICY IF EXISTS "combates_coliseo_select_public" ON combates_coliseo;
CREATE POLICY "combates_coliseo_select_public" 
    ON combates_coliseo FOR SELECT 
    USING (true);

-- Permitir a los jugadores registrar sus propios combates
DROP POLICY IF EXISTS "combates_coliseo_insert_own" ON combates_coliseo;
CREATE POLICY "combates_coliseo_insert_own" 
    ON combates_coliseo FOR INSERT 
    WITH CHECK (auth.uid() = jugador_id);

-- 5. Función de métricas de administrador actualizada
CREATE OR REPLACE FUNCTION get_admin_metrics()
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
    
    -- Métricas de jugadores
    total_players INT;
    active_players_24h INT;
    active_players_5m INT;
    
    -- Métricas de EV
    total_ev_circulation NUMERIC := 0;
    ev_reward_24h NUMERIC := 0;
    ev_sink_24h NUMERIC := 0;
    rors_ratio_24h NUMERIC := 0;
    
    -- Métricas de POL
    total_market_vol_pol NUMERIC := 0;
    total_boveda_pol NUMERIC := 0;
    
    -- Métricas de Coliseo (PvP)
    pvp_total_combates INT := 0;
    pvp_realtime_combates INT := 0;
    pvp_winrate_global NUMERIC := 0;
    pvp_pool_global_neto NUMERIC := 0;
    pvp_season_jackpot_acum NUMERIC := 0;
    pvp_liga_balances jsonb;
    
    rarity_counts jsonb;
    element_counts jsonb;
    daily_history jsonb;
    recent_logs jsonb;
    caller_email TEXT;
BEGIN
    -- Validar que el llamador esté en la lista blanca de administradores
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
    IF caller_email IS NULL OR NOT EXISTS (SELECT 1 FROM public.admin_whitelist WHERE email = caller_email) THEN
        RAISE EXCEPTION 'Acceso denegado: No eres un administrador autorizado.';
    END IF;

    -- A. MÉTRICAS DE JUGADORES
    SELECT COUNT(*) INTO total_players FROM public.jugadores;
    
    SELECT COUNT(*) INTO active_players_24h 
    FROM public.jugadores 
    WHERE last_active_at > (now() - INTERVAL '24 hours');
    
    SELECT COUNT(*) INTO active_players_5m 
    FROM public.jugadores 
    WHERE last_active_at > (now() - INTERVAL '10 minutes');

    -- B. MÉTRICAS DE EV
    SELECT COALESCE(SUM(CAST(datos_juego->'inventario'->>'vitalEssence' AS NUMERIC)), 0)
    INTO total_ev_circulation
    FROM public.jugadores;

    -- Calcular emisiones y quemas de EV en las últimas 24h
    SELECT COALESCE(SUM(amount), 0) INTO ev_reward_24h FROM public.economy_logs 
    WHERE action_type = 'reward' AND created_at > (now() - INTERVAL '24 hours');
    
    SELECT COALESCE(SUM(amount), 0) INTO ev_sink_24h FROM public.economy_logs 
    WHERE action_type = 'sink' AND created_at > (now() - INTERVAL '24 hours');

    IF ev_sink_24h > 0 THEN
        rors_ratio_24h := ROUND(ev_reward_24h / ev_sink_24h, 2);
    ELSE
        rors_ratio_24h := ev_reward_24h;
    END IF;

    -- C. MÉTRICAS DE POL
    SELECT COALESCE(SUM(amount), 0) INTO total_market_vol_pol 
    FROM public.economy_logs 
    WHERE action_type = 'pol_sale';

    SELECT COALESCE(SUM(CAST(datos_juego->'wallet'->>'bovedaAportada' AS NUMERIC)), 0)
    INTO total_boveda_pol
    FROM public.jugadores;

    -- D. MÉTRICAS DE COLISEO (PvP)
    SELECT COUNT(*), COALESCE(SUM(CASE WHEN es_realtime THEN 1 ELSE 0 END), 0)
    INTO pvp_total_combates, pvp_realtime_combates
    FROM public.combates_coliseo;

    IF pvp_total_combates > 0 THEN
        SELECT ROUND(COALESCE(SUM(CASE WHEN es_victoria THEN 1 ELSE 0 END), 0)::numeric / pvp_total_combates * 100, 1)
        INTO pvp_winrate_global
        FROM public.combates_coliseo;
    ELSE
        pvp_winrate_global := 0.0;
    END IF;

    -- Saldo Pool Global y Bote Temporada
    SELECT 
        COALESCE(SUM(CASE WHEN action_type = 'arena_ticket_buy' THEN amount * 0.80 ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN action_type = 'arena_payout' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN action_type = 'arena_ticket_buy' THEN amount * 0.10 ELSE 0 END), 0)
    INTO pvp_pool_global_neto, pvp_season_jackpot_acum
    FROM public.economy_logs;

    -- Pool por ligas
    WITH liga_stats AS (
        SELECT 
            COALESCE(substring(source from ' - (.*)$'), 'General') AS liga,
            SUM(CASE WHEN action_type = 'arena_ticket_buy' THEN amount * 0.80 ELSE 0 END) - 
            SUM(CASE WHEN action_type = 'arena_payout' THEN amount ELSE 0 END) AS balance
        FROM public.economy_logs
        WHERE action_type IN ('arena_ticket_buy', 'arena_payout')
        GROUP BY COALESCE(substring(source from ' - (.*)$'), 'General')
    )
    SELECT json_object_agg(liga, balance) INTO pvp_liga_balances
    FROM (
        SELECT liga, COALESCE(balance, 0) AS balance
        FROM liga_stats
    ) sub;

    -- E. DISTRIBUCIÓN DE RAREZAS Y ELEMENTOS DE MASCOTAS
    WITH all_genos AS (
        SELECT datos_juego->'mascotaActiva' AS g
        FROM public.jugadores
        WHERE datos_juego->'mascotaActiva' IS NOT NULL AND datos_juego->'mascotaActiva'->>'id' IS NOT NULL
        
        UNION ALL
        
        SELECT jsonb_array_elements(datos_juego->'genosGuardados') AS g
        FROM public.jugadores
        WHERE datos_juego->'genosGuardados' IS NOT NULL
    )
    SELECT json_object_agg(rarity, count) INTO rarity_counts
    FROM (
        SELECT COALESCE(g->>'rarity', 'Común') AS rarity, COUNT(*) AS count
        FROM all_genos
        GROUP BY COALESCE(g->>'rarity', 'Común')
    ) sub;

    WITH all_genos AS (
        SELECT datos_juego->'mascotaActiva' AS g
        FROM public.jugadores
        WHERE datos_juego->'mascotaActiva' IS NOT NULL AND datos_juego->'mascotaActiva'->>'id' IS NOT NULL
        
        UNION ALL
        
        SELECT jsonb_array_elements(datos_juego->'genosGuardados') AS g
        FROM public.jugadores
        WHERE datos_juego->'genosGuardados' IS NOT NULL
    )
    SELECT json_object_agg(element, count) INTO element_counts
    FROM (
        SELECT COALESCE(g->>'element', 'Desconocido') AS element, COUNT(*) AS count
        FROM all_genos
        GROUP BY COALESCE(g->>'element', 'Desconocido')
    ) sub;

    -- F. HISTORIAL DIARIO PARA GRÁFICOS (Últimos 7 días)
    WITH daily_stats AS (
        SELECT 
            created_at::date AS day,
            SUM(CASE WHEN action_type = 'reward' THEN amount ELSE 0 END) AS reward,
            SUM(CASE WHEN action_type = 'sink' THEN amount ELSE 0 END) AS sink
        FROM public.economy_logs
        WHERE created_at > (now() - INTERVAL '7 days')
        GROUP BY created_at::date
        ORDER BY created_at::date
    )
    SELECT json_agg(json_build_object('day', day, 'reward', reward, 'sink', sink)) INTO daily_history FROM daily_stats;

    -- G. REGISTROS RECIENTES DE ECONOMÍA (últimos 50 logs)
    SELECT json_agg(json_build_object(
        'id', l.id,
        'created_at', l.created_at,
        'player_email', COALESCE(j.email, 'Desconocido'),
        'action_type', l.action_type,
        'amount', l.amount,
        'source', l.source
    )) INTO recent_logs
    FROM (
        SELECT * FROM public.economy_logs
        ORDER BY created_at DESC
        LIMIT 50
    ) l
    LEFT JOIN public.jugadores j ON l.player_id = j.id;

    -- CONSTRUIR RETORNO JSON CONSOLIDADO
    result := jsonb_build_object(
        'total_players', total_players,
        'active_players_24h', active_players_24h,
        'active_players_5m', active_players_5m,
        'total_ev_in_circulation', total_ev_circulation,
        'ev_reward_24h', ev_reward_24h,
        'ev_sink_24h', ev_sink_24h,
        'rors_ratio_24h', rors_ratio_24h,
        'total_market_volume_pol', total_market_vol_pol,
        'total_boveda_pol', total_boveda_pol,
        'pvp_total_combates', pvp_total_combates,
        'pvp_realtime_combates', pvp_realtime_combates,
        'pvp_winrate_global', pvp_winrate_global,
        'pvp_pool_global_neto', pvp_pool_global_neto,
        'pvp_season_jackpot_acum', pvp_season_jackpot_acum,
        'pvp_liga_balances', COALESCE(pvp_liga_balances, '{}'::jsonb),
        'rarity_distribution', COALESCE(rarity_counts, '{}'::jsonb),
        'element_distribution', COALESCE(element_counts, '{}'::jsonb),
        'daily_history', COALESCE(daily_history, '[]'::jsonb),
        'recent_logs', COALESCE(recent_logs, '[]'::jsonb)
    );

    RETURN result;
END;
$$;
