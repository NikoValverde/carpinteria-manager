| prompt_context                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ## TABLA: clientes
### Columnas:
- `id` (bigint, NOT NULL)
- `nombre` (text, NOT NULL)
- `telefono` (text)
- `email` (text)
- `direccion` (text)
- `observaciones` (text)
- `created_at` (timestamp with time zone, NOT NULL)

### Relaciones (Foreign Keys):
Ninguna

### Políticas RLS:
- **allow_read_clientes** (SELECT): `USING (true)`
- **allow_delete_clientes** (DELETE): `USING (true)`
- **allow_update_clientes** (UPDATE): `USING (true)`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ## TABLA: materiales
### Columnas:
- `id` (bigint, NOT NULL)
- `nombre` (text, NOT NULL)
- `categoria` (text, NOT NULL)
- `unidad` (text, NOT NULL)
- `precio` (numeric, NOT NULL)
- `fecha_actualizacion` (timestamp with time zone, NOT NULL)
- `created_at` (timestamp with time zone, NOT NULL)

### Relaciones (Foreign Keys):
Ninguna

### Políticas RLS:
- **allow_read_materiales** (SELECT): `USING (true)`
- **allow_delete_materiales** (DELETE): `USING (true)`
- **allow_update_materiales** (UPDATE): `USING (true)`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ## TABLA: integrantes
### Columnas:
- `id` (bigint, NOT NULL)
- `nombre` (text, NOT NULL)
- `porcentaje` (numeric, NOT NULL)
- `activo` (boolean, NOT NULL)
- `created_at` (timestamp with time zone, NOT NULL)
- `jornal_actual` (numeric)

### Relaciones (Foreign Keys):
Ninguna

### Políticas RLS:
- **allow_read_integrantes** (SELECT): `USING (true)`
- **allow_delete_integrantes** (DELETE): `USING (true)`
- **allow_update_integrantes** (UPDATE): `USING (true)`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ## TABLA: presupuestos
### Columnas:
- `id` (bigint, NOT NULL)
- `numero` (text, NOT NULL)
- `cliente_id` (bigint, NOT NULL)
- `fecha` (date, NOT NULL)
- `validez_dias` (integer, NOT NULL)
- `fecha_vencimiento` (date)
- `tipo_trabajo` (text, NOT NULL)
- `estado` (text, NOT NULL)
- `descripcion` (text)
- `observaciones` (text)
- `porcentaje_ganancia` (numeric, NOT NULL)
- `consumibles_imprevistos` (numeric, NOT NULL)
- `flete` (numeric, NOT NULL)
- `costo_materiales` (numeric)
- `costo_mano_obra` (numeric)
- `costo_total` (numeric)
- `monto_ganancia` (numeric)
- `precio_trabajo` (numeric)
- `precio_final` (numeric)
- `version` (integer, NOT NULL)
- `presupuesto_origen_id` (bigint)
- `created_at` (timestamp with time zone, NOT NULL)
- `notas_internas` (text)
- `titulo` (text)
- `categoria_trabajo` (text)
- `opcionales` (text)
- `precio_opcional` (numeric)

### Relaciones (Foreign Keys):
- `cliente_id` -> `clientes.id`
- `presupuesto_origen_id` -> `presupuestos.id`

### Políticas RLS:
- **allow_update_presupuestos** (UPDATE): `USING (true)`
- **allow_insert_presupuestos** (INSERT): `with check (true)`
- **allow_read_presupuestos** (SELECT): `USING (true)`
- **allow_delete_presupuestos** (DELETE):`USING (true)`
 |
| ## TABLA: presupuesto_materiales
### Columnas:
- `id` (bigint, NOT NULL)
- `presupuesto_id` (bigint, NOT NULL)
- `material_id` (bigint)
- `material_nombre` (text, NOT NULL)
- `cantidad` (numeric, NOT NULL)
- `unidad` (text)
- `precio_unitario` (numeric, NOT NULL)
- `subtotal` (numeric, NOT NULL)
- `created_at` (timestamp with time zone, NOT NULL)

### Relaciones (Foreign Keys):
- `presupuesto_id` -> `presupuestos.id`

### Políticas RLS:
- **allow_delete_presupuesto_materiales** (DELETE): `USING (true)`
- **allow_read_presupuesto_materiales** (SELECT): `USING (true)`
- **allow_update_presupuesto_materiales** (UPDATE): `USING (true)`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ## TABLA: presupuesto_mano_obra
### Columnas:
- `id` (bigint, NOT NULL)
- `presupuesto_id` (bigint, NOT NULL)
- `integrante_id` (bigint, NOT NULL)
- `integrante_nombre` (text, NOT NULL)
- `dias` (numeric, NOT NULL)
- `jornal_utilizado` (numeric, NOT NULL)
- `subtotal` (numeric, NOT NULL)
- `created_at` (timestamp with time zone, NOT NULL)

### Relaciones (Foreign Keys):
- `integrante_id` -> `integrantes.id`
- `presupuesto_id` -> `presupuestos.id`

### Políticas RLS:
- **allow_delete_presupuesto_mano_obra** (DELETE): `USING (true)`
- **allow_read_presupuesto_mano_obra** (SELECT): `USING (true)`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ## TABLA: perfiles
### Columnas:
- `id` (uuid, NOT NULL)
- `nombre` (text, NOT NULL)
- `rol` (text, NOT NULL)
- `created_at` (timestamp with time zone)

### Relaciones (Foreign Keys):
Ninguna

### Políticas RLS:
- **Usuarios pueden ver su perfil** (SELECT): `USING ((auth.uid() = id))`
- **Usuarios pueden actualizar su perfil** (UPDATE): `USING ((auth.uid() = id))`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ## TABLA: alternativas_presupuesto
### Columnas:
- `id` (bigint, NOT NULL)
- `presupuesto_id` (bigint, NOT NULL)
- `titulo` (text, NOT NULL)
- `descripcion` (text, NOT NULL)
- `precio` (numeric, NOT NULL)
- `orden` (integer, NOT NULL)
- `created_at` (timestamp with time zone, NOT NULL)
- `tipo_precio` (text, NOT NULL)

### Relaciones (Foreign Keys):
- `presupuesto_id` -> `presupuestos.id`

### Políticas RLS:
- **allow_select_alternativas_presupuesto** (SELECT): `USING (true)`
- **allow_update_alternativas_presupuesto** (UPDATE): `USING (true)`
- **allow_delete_alternativas_presupuesto** (DELETE): `USING (true)`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |