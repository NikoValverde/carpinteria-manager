-- ============================================
-- Carpintería Manager
-- Sprint 12
-- Crear tabla de alternativas de presupuesto
-- ============================================

CREATE TABLE public.alternativas_presupuesto (

    id BIGINT GENERATED ALWAYS AS IDENTITY,

    presupuesto_id BIGINT NOT NULL,

    titulo TEXT NOT NULL,

    descripcion TEXT NOT NULL,

    precio NUMERIC(12,2) NOT NULL,

    orden INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT alternativas_presupuesto_pkey
        PRIMARY KEY (id),

    CONSTRAINT alternativas_presupuesto_presupuesto_id_fkey
        FOREIGN KEY (presupuesto_id)
        REFERENCES public.presupuestos(id)
        ON DELETE CASCADE,

    CONSTRAINT alternativas_presupuesto_titulo_check
        CHECK (length(trim(titulo)) > 0),

    CONSTRAINT alternativas_presupuesto_descripcion_check
        CHECK (length(trim(descripcion)) > 0),

    CONSTRAINT alternativas_presupuesto_precio_check
        CHECK (precio >= 0),

    CONSTRAINT alternativas_presupuesto_orden_check
        CHECK (orden >= 1),

    CONSTRAINT alternativas_presupuesto_orden_unique
        UNIQUE (presupuesto_id, orden)

);

-- ============================================
-- Índice
-- ============================================

CREATE INDEX idx_alternativas_presupuesto_presupuesto
ON public.alternativas_presupuesto (presupuesto_id);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE public.alternativas_presupuesto
ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policies
-- ============================================

CREATE POLICY allow_select_alternativas_presupuesto
ON public.alternativas_presupuesto
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY allow_insert_alternativas_presupuesto
ON public.alternativas_presupuesto
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY allow_update_alternativas_presupuesto
ON public.alternativas_presupuesto
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY allow_delete_alternativas_presupuesto
ON public.alternativas_presupuesto
FOR DELETE
TO authenticated
USING (true);