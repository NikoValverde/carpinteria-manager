| table_name             | column_name             | data_type                |
| ---------------------- | ----------------------- | ------------------------ |
| presupuesto_mano_obra  | created_at              | timestamp with time zone |
| presupuestos           | monto_ganancia          | numeric                  |
| presupuestos           | precio_trabajo          | numeric                  |
| presupuestos           | precio_final            | numeric                  |
| presupuestos           | version                 | integer                  |
| presupuestos           | presupuesto_origen_id   | bigint                   |
| presupuestos           | created_at              | timestamp with time zone |
| presupuestos           | precio_opcional         | numeric                  |
| presupuesto_materiales | id                      | bigint                   |
| presupuesto_materiales | presupuesto_id          | bigint                   |
| presupuesto_materiales | material_id             | bigint                   |
| presupuesto_materiales | cantidad                | numeric                  |
| presupuesto_materiales | precio_unitario         | numeric                  |
| presupuesto_materiales | subtotal                | numeric                  |
| presupuesto_materiales | created_at              | timestamp with time zone |
| presupuesto_mano_obra  | id                      | bigint                   |
| presupuesto_mano_obra  | presupuesto_id          | bigint                   |
| presupuesto_mano_obra  | integrante_id           | bigint                   |
| presupuesto_mano_obra  | dias                    | numeric                  |
| presupuesto_mano_obra  | jornal_utilizado        | numeric                  |
| presupuesto_mano_obra  | subtotal                | numeric                  |
| clientes               | id                      | bigint                   |
| clientes               | created_at              | timestamp with time zone |
| materiales             | id                      | bigint                   |
| materiales             | precio                  | numeric                  |
| materiales             | fecha_actualizacion     | timestamp with time zone |
| materiales             | created_at              | timestamp with time zone |
| integrantes            | id                      | bigint                   |
| integrantes            | porcentaje              | numeric                  |
| integrantes            | activo                  | boolean                  |
| integrantes            | created_at              | timestamp with time zone |
| integrantes            | jornal_actual           | numeric                  |
| presupuestos           | id                      | bigint                   |
| presupuestos           | cliente_id              | bigint                   |
| presupuestos           | fecha                   | date                     |
| presupuestos           | validez_dias            | integer                  |
| presupuestos           | fecha_vencimiento       | date                     |
| presupuestos           | porcentaje_ganancia     | numeric                  |
| presupuestos           | consumibles_imprevistos | numeric                  |
| presupuestos           | flete                   | numeric                  |
| presupuestos           | costo_materiales        | numeric                  |
| presupuestos           | costo_mano_obra         | numeric                  |
| presupuestos           | costo_total             | numeric                  |
| clientes               | nombre                  | text                     |
| clientes               | telefono                | text                     |
| clientes               | email                   | text                     |
| clientes               | direccion               | text                     |
| clientes               | observaciones           | text                     |
| presupuesto_materiales | material_nombre         | text                     |
| presupuesto_mano_obra  | integrante_nombre       | text                     |
| materiales             | nombre                  | text                     |
| materiales             | categoria               | text                     |
| materiales             | unidad                  | text                     |
| presupuestos           | notas_internas          | text                     |
| presupuestos           | titulo                  | text                     |
| presupuestos           | tipo_trabajo            | text                     |
| presupuestos           | estado                  | text                     |
| integrantes            | nombre                  | text                     |
| presupuestos           | descripcion             | text                     |
| presupuestos           | observaciones           | text                     |
| presupuestos           | categoria_trabajo       | text                     |
| presupuestos           | opcionales              | text                     |
| presupuesto_materiales | unidad                  | text                     |
| presupuestos           | numero                  | text                     |