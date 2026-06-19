# PROYECTO: CARPINTERÍA MANAGER

## Descripción General
Aplicación SaaS interna desarrollada para Carpintería y Herrería Valverde.

### Objetivo principal
- Centralizar la gestión de presupuestos
- Clientes
- Materiales
- Mano de obra
- Generación de PDF comerciales

### Stack actual
**Frontend:** React, Vite  
**Backend:** Supabase  
**Base de datos:** PostgreSQL (Supabase)  
**PDF:** jsPDF, jspdf-autotable  
**Deploy futuro:** Vercel  

---

## OBJETIVO DEL SISTEMA
Actualmente la carpintería realiza presupuestos manuales.  
El sistema busca:
- Reducir tiempo administrativo
- Estandarizar presupuestos
- Persistir costos
- Automatizar cálculos
- Generar PDF profesional
- Escalar hacia optimización de producción

---

## MÓDULOS IMPLEMENTADOS

### Clientes
**Estado:** CRUD completo  
**Funcionalidades:** Crear, Editar, Eliminar, Listar, Buscar  
**Campos principales:** nombre, teléfono, email, dirección  

### Materiales
**Estado:** CRUD completo  
**Funcionalidades:** Alta, Edición, Eliminación, Listado, Búsqueda  
**Campos:** nombre, precio_actual, unidad, activo  
**Ejemplos:** Melamina negra 18, Caño 40x20 Cal 18, MDF 18, Bisagras Hafele  

### Integrantes
**Estado:** CRUD completo  
**Campos:** nombre, jornal_actual, activo  
**Uso:** Cálculo de mano de obra  

### Presupuestos
**Estado:** Módulo principal operativo  
**Funcionalidades:** Crear, Listar, Buscar, Ver detalle, Editar, Generar PDF  

#### Tabla Presupuestos
Campos: id, numero, cliente_id, titulo, categoria, tipo, estado, descripcion, observaciones, notas_internas, precio_final, precio_trabajo, costo_materiales, costo_mano_obra, costo_total, porcentaje_ganancia, monto_ganancia, flete, consumibles_imprevistos, opcionales, precio_opcional, total_con_opcional, validez_dias, created_at  

#### Numeración
Formato: PV-0001, PV-0002, PV-0003 (correlativo)

---

## MATERIALES DEL PRESUPUESTO
**Estado:** CRUD completo  
**Campos:** presupuesto_id, material_id, cantidad, precio_utilizado, subtotal  

---

## MANO DE OBRA
**Estado:** CRUD completo  
**Campos:** presupuesto_id, integrante_id, integrante_nombre, dias, jornal_utilizado, subtotal  

**Mejora implementada:**  
- Opción: Agregar todos los integrantes  
- Lógica: No duplica integrantes, valida previamente  

---

## CÁLCULOS FINANCIEROS
- **costoTotal = costoMateriales + costoManoObra**  
- **montoGanancia = costoTotal × (porcentajeGanancia / 100)**  
- **precioCalculado = costoTotal + montoGanancia + flete + consumiblesImprevistos**  
- **Precio Final:** editable por usuario, persistido en Supabase  

### Redondeo
Botones: 10.000, 50.000, 100.000 → Copiar a Precio Final  
Ejemplo: 2.138.500 → 2.150.000  

---

## OPCIONALES
**Campos:** opcionales, precio_opcional  
**Cálculo:** totalConOpcional = precioFinal + precioOpcional  
**Mostrado:** Pantalla y PDF  
**Persistido:** Supabase  

---

## NOTAS INTERNAS
Campo: notas_internas  
Uso: información interna (NO aparece en PDF)  
Ejemplo: Cliente complicado, comparar con MDF  

---

## OBSERVACIONES
Campo: observaciones  
Persistido, visible en sistema, no prioritario para PDF  

---

## PDF VALVERDE

### Estado actual
- Versión funcional
- Librerías: jspdf, jspdf-autotable

### Estructura
- Encabezado: LOGO, PRESUPUESTO  
- Datos: CLIENTE, CONTACTO, FECHA, VALIDEZ  
- Título: PÉRGOLA DE HIERRO  
- Detalle: DETALLE DE CONSTRUCCIÓN  
- Opcionales: OPCIONALES  
- Total: TOTAL PRESUPUESTADO, TOTAL CON OPCIONAL  
- Pie: CARPINTERÍA Y HERRERÍA VALVERDE, WhatsApp, Web  

### Pendientes
- Tipografía
- Espaciados
- Detalles gráficos
- Logo definitivo  

### Decisión importante
NO mostrar al cliente: costo_materiales, costo_mano_obra, ganancia, flete, consumibles.  
Mostrar solamente: Trabajo, Detalle, Opcionales, Precio.  

---

## ARQUITECTURA FUTURA DEL PDF
Tabla: presupuesto_items  
Campos: id, presupuesto_id, descripcion, cantidad, precio_unitario, subtotal, es_opcional  

---

## FUNCIONALIDAD IA PLANIFICADA
Objetivo: generar automáticamente descripción técnica  
Flujo: Usuario carga datos → IA genera descripción → Usuario corrige → Guardar → PDF  
Implementación: Supabase Edge Functions + OpenAI API  
Estado: Backlog V2  

---

## MATERIALES NACIDOS DESDE PRESUPUESTO
Funcionalidad discutida.  
Problema: materiales nuevos aparecen dentro de presupuestos.  
Idea: crear material desde presupuesto sin abandonar pantalla.  
Estado: prioridad alta.  

---

## ELIMINACIÓN LÓGICA
Pendiente.  
Agregar campos: activo, eliminado en clientes, materiales, integrantes.  

---

## PAPELERA
Pendiente.  
Módulos: clientes, materiales.  
Acciones: restaurar, eliminar definitivamente.  

---

## COMPONENTIZACIÓN
Problema: PresupuestoDetallePage.jsx demasiado grande.  
Objetivo: separar en componentes (DatosPresupuesto, DetalleConstructivo, MaterialesSection, ManoObraSection, ResumenFinanciero, OpcionalesSection, GeneradorPDF).  
Prioridad: alta.  

---

## OPTIMIZADOR DE CORTES
Proyecto futuro.  
Objetivo: ingresar placas, medidas, piezas → generar despiece y optimización.  
Tecnología posible: Canvas, SVG, Bin Packing.  
Estado: backlog largo plazo.  

---

## ROADMAP ACORDADO
- Fase actual: cerrar PDF Valverde  
- Siguiente: materiales nacidos desde presupuesto  
- Luego: componentizar PresupuestoDetallePage  
- Después: IA para descripción técnica  
- Futuro: papelera, eliminación lógica, optimizador de cortes, dashboard, métricas  

---

## VISIÓN FINAL DEL PRODUCTO
De app de presupuestos → ERP liviano para carpintería.  
Flujo: Cliente → Presupuesto → Materiales → Mano de Obra → IA descripción → PDF → Optimización de cortes → Producción
