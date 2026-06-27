# IA_MODULE_CONTEXT.md

# Módulo IA - Carpintería Manager

## Objetivo

Implementar un módulo de Inteligencia Artificial que actúe como un asistente de redacción técnica para presupuestos de Carpintería y Herrería.

La IA NO debe reemplazar al usuario ni tomar decisiones comerciales o técnicas. Su objetivo es ahorrar tiempo, mejorar la calidad de redacción y mantener un estilo uniforme en todos los presupuestos.

---

# Filosofía del módulo

La IA debe ser una herramienta opcional.

El usuario siempre podrá:

* escribir manualmente.
* mejorar un texto existente.
* generar una descripción desde cero.

Nunca debe existir dependencia obligatoria de la IA para utilizar el sistema.

---

# Casos de uso

## 1. Mejorar texto

### Flujo

El usuario escribe manualmente el contenido del campo:

Detalles de Construcción

Ejemplo:

Fabricación de frente de parrilla.
Caño 40x30.
Puertas corredizas.
Pintura negra.

Luego presiona:

✨ Mejorar texto

La IA devuelve una versión mejor redactada.

### Reglas

La IA NO puede modificar:

* medidas
* espesores
* cantidades
* nombres de materiales
* modelos
* marcas
* colores
* datos técnicos

Debe conservar exactamente la información ingresada por el usuario.

Su función es únicamente:

* mejorar gramática
* mejorar estructura
* mejorar claridad
* mantener estilo profesional

Nunca debe inventar información.

---

## 2. Generar descripción

### Flujo

El usuario completa normalmente el presupuesto.

La IA utiliza automáticamente información existente.

Por ejemplo:

* título del trabajo
* categoría
* materiales del presupuesto
* observaciones
* detalles existentes (si los hubiera)

Luego presiona:

🤖 Generar descripción

La IA genera un texto técnico siguiendo el estilo de Carpintería y Herrería Valverde.

---

# Información que podrá utilizar la IA

Puede utilizar:

* título
* categoría
* materiales
* observaciones
* tipo de trabajo

No puede inventar información que no exista.

Ejemplos:

Si el presupuesto contiene:

Caño 40x30 Cal 18

La IA NO puede responder:

Caño 50x30

o

Perfil UPN

o

Caño galvanizado

si esos datos no existen.

---

# Estilo de escritura

El objetivo NO es escribir como ChatGPT.

El objetivo es escribir como Carpintería y Herrería Valverde.

Para ello se utilizarán presupuestos reales como fuente de estilo.

Se analizarán:

* estructura
* vocabulario
* orden de los párrafos
* tono profesional
* forma habitual de describir los trabajos

El modelo deberá imitar ese estilo.

---

# Prompt Maestro

El Prompt Maestro se dividirá en varias partes.

## Identidad

Define quién es la IA.

Ejemplo:

"Asistente técnico especializado en presupuestos de carpintería y herrería."

---

## Reglas generales

Incluye reglas obligatorias.

Ejemplos:

* nunca inventar medidas
* nunca cambiar espesores
* nunca agregar materiales inexistentes
* nunca modificar cantidades
* mantener tono profesional
* utilizar lenguaje técnico
* escribir en español de Argentina

---

## Estilo

Describe cómo escribe la empresa.

Ejemplos:

* párrafos claros
* lenguaje técnico
* sin exageraciones comerciales
* orden lógico
* primero estructura
* luego revestimientos
* luego herrajes
* luego terminación

---

## Ejemplos reales

Se utilizarán presupuestos reales de la empresa.

Estos ejemplos servirán como referencia para el estilo de escritura.

---

## Contexto dinámico

Información enviada desde el presupuesto.

Por ejemplo:

* título
* materiales
* categoría
* observaciones

---

# Arquitectura técnica

Frontend React

↓

Servicio IA

↓

Supabase Edge Function

↓

OpenAI API

↓

Respuesta

↓

Textarea "Detalles de Construcción"

---

# Componentes previstos

services/

iaService.js

utils/

construirPrompt.js

prompts/

promptMaestro.js

promptMejorar.js

promptGenerar.js

Supabase/

Edge Function

---

# Integración UI

Dentro de "Detalles de Construcción" existirán dos acciones.

✨ Mejorar texto

Mejora el texto existente.

🤖 Generar descripción

Genera una descripción utilizando la información del presupuesto.

Ambas funciones escribirán el resultado dentro del textarea para que el usuario pueda editarlo antes de guardar.

Nunca se guardará automáticamente.

---

# Reglas de negocio

La IA nunca podrá:

* calcular precios
* modificar costos
* decidir materiales
* decidir mano de obra
* cambiar cantidades
* cambiar medidas
* cambiar espesores
* cambiar modelos

La IA solamente redacta.

---

# Roadmap

## IA V1

* Mejorar texto
* Generar descripción
* Prompt maestro
* Integración con OpenAI
* Supabase Edge Function

---

## IA V2

* Plantillas por rubro
* Carpintería
* Herrería

La IA adaptará automáticamente la redacción según el tipo de trabajo.

---

## IA V3

* Plantillas por empresa (Multiempresa)

Cada empresa podrá tener:

* su propio estilo
* sus ejemplos
* sus reglas
* su prompt maestro

La IA escribirá respetando la identidad de cada empresa.

---

# Modelo comercial

La IA será una funcionalidad Premium.

Plan Básico

* Gestión
* Presupuestos
* PDF

Plan Profesional

* Mejorar texto
* Generar descripción
* Asistencia Inteligente

De esta forma el costo del consumo de OpenAI será absorbido por los usuarios que utilicen la funcionalidad.

---

# Versionado de prompts.

Crearemos Prompt que mejoraremos constantemente en distintas versiones.
Por ejemplo:
Prompt Maestro v1.0
Prompt Maestro v1.1
Prompt Maestro v2.0

---

# Principio más importante

La IA no reemplaza al profesional.

La IA acelera la redacción.

La decisión técnica siempre pertenece al usuario.
