-- ============================================================================
-- Migración: Tablas para el sistema de Torneos On-Chain
-- Proyecto Genos - Fase 3: Sincronización Backend
--
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. TABLA: tournament_entries
--    Registra cada inscripción on-chain de un jugador a un torneo.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tournament_entries (
    id                  BIGSERIAL PRIMARY KEY,
    torneo_id           BIGINT          NOT NULL,            -- ID numérico del torneo en la blockchain
    jugador_address     TEXT            NOT NULL,            -- Wallet address del jugador (lowercase)
    monto_pagado_pol    NUMERIC(18, 8)  NOT NULL DEFAULT 0,  -- POL enviados en msg.value
    saldo_usado_pol     NUMERIC(18, 8)  NOT NULL DEFAULT 0,  -- POL descontados de saldosPendientes
    tx_hash             TEXT            NOT NULL,            -- Hash de la transacción on-chain
    inscrito_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    status              TEXT            NOT NULL DEFAULT 'inscrito'
                            CHECK (status IN ('inscrito', 'finalizado', 'cancelado')),

    CONSTRAINT uq_torneo_jugador UNIQUE (torneo_id, jugador_address)
);

COMMENT ON TABLE tournament_entries IS
    'Inscripciones on-chain al contrato GenosTorneos.sol. Alimentado por tournament-webhook.';

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_entries_torneo   ON tournament_entries (torneo_id);
CREATE INDEX IF NOT EXISTS idx_entries_jugador  ON tournament_entries (jugador_address);
CREATE INDEX IF NOT EXISTS idx_entries_status   ON tournament_entries (status);


-- ────────────────────────────────────────────────────────────────────────────
-- 2. TABLA: tournament_results
--    Registra el resultado final de cada torneo (Top 3).
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tournament_results (
    id                       BIGSERIAL PRIMARY KEY,
    torneo_id                BIGINT          NOT NULL UNIQUE,  -- ID numérico del torneo
    primer_lugar             TEXT,                             -- Wallet address del 1er lugar
    segundo_lugar            TEXT,                             -- Wallet address del 2º lugar
    tercer_lugar             TEXT,                             -- Wallet address del 3er lugar
    premios_pagados_pol      NUMERIC(18, 8)  NOT NULL DEFAULT 0,
    desviado_tesoreria_pol   NUMERIC(18, 8)  NOT NULL DEFAULT 0,
    tx_hash                  TEXT            NOT NULL,
    finalizado_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE tournament_results IS
    'Resultados finales on-chain de los torneos GenosTorneos.sol.';

-- Índices
CREATE INDEX IF NOT EXISTS idx_results_primer  ON tournament_results (primer_lugar);
CREATE INDEX IF NOT EXISTS idx_results_segundo ON tournament_results (segundo_lugar);
CREATE INDEX IF NOT EXISTS idx_results_tercer  ON tournament_results (tercer_lugar);


-- ────────────────────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────────────────────

-- Las Edge Functions usan SUPABASE_SERVICE_ROLE_KEY (bypass RLS),
-- pero habilitamos RLS para que los usuarios autenticados solo lean
-- sus propios datos desde el cliente.

ALTER TABLE tournament_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_results  ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública (los resultados son públicos)
CREATE POLICY "tournament_results_select_public"
    ON tournament_results
    FOR SELECT
    USING (true);

-- Política: lectura de entries solo propia o del sistema
CREATE POLICY "tournament_entries_select_own"
    ON tournament_entries
    FOR SELECT
    USING (true);  -- Los rankings son públicos; ajustar si se requiere privacidad

-- Solo el service role puede insertar / actualizar (edge functions)
CREATE POLICY "tournament_entries_insert_service"
    ON tournament_entries
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "tournament_results_insert_service"
    ON tournament_results
    FOR ALL
    USING (auth.role() = 'service_role');


-- ────────────────────────────────────────────────────────────────────────────
-- 4. VISTA: leaderboard_torneos
--    Ranking global de jugadores por victorias de torneo.
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW leaderboard_torneos AS
SELECT
    r.primer_lugar                          AS wallet_address,
    COUNT(*)                                AS victorias,
    SUM(r.premios_pagados_pol * 0.50)       AS pol_ganado_estimado
FROM tournament_results r
WHERE r.primer_lugar IS NOT NULL
  AND r.primer_lugar <> '0x' || repeat('0', 40)
GROUP BY r.primer_lugar
ORDER BY victorias DESC;

COMMENT ON VIEW leaderboard_torneos IS
    'Ranking de jugadores ordenados por victorias en torneos on-chain.';
