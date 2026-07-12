ALTER TABLE alternativas_presupuesto
ADD COLUMN tipo_precio TEXT NOT NULL DEFAULT 'SUMA';

ALTER TABLE alternativas_presupuesto
ADD CONSTRAINT alternativas_presupuesto_tipo_precio_check
CHECK (tipo_precio IN ('SUMA', 'TOTAL'));