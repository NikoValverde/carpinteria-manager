# PROJECT_CONTEXT.md

# Carpintería Manager

Aplicación SaaS para gestión de presupuestos de carpintería y herrería.

---

# Objetivo

Digitalizar el flujo de trabajo de Carpintería y Herrería Valverde:

- Clientes.
- Materiales.
- Integrantes.
- Presupuestos.
- Mano de obra.
- Costos.
- PDF.
- Seguimiento.

El objetivo a largo plazo es convertir la aplicación en un producto SaaS comercial.

---

# Stack Tecnológico

- React
- Vite
- JavaScript
- Supabase
- React Router
- Tailwind CSS
- Lucide React
- jsPDF

---

# Arquitectura

## Frontend

- React + Vite
- Componentes reutilizables
- Tailwind CSS
- Responsive design
- Dark mode

## Backend

- Supabase
- PostgreSQL
- Row Level Security
- Supabase Auth

---

# Autenticación

Implementada mediante Supabase Auth.

Características:

- Login con email y contraseña.
- Persistencia de sesión.
- Logout.
- Rutas protegidas.
- AuthContext global.
- Hook useAuth().

Archivos:

- context/AuthContext.jsx
- hooks/useAuth.js
- components/ProtectedRoute.jsx

---

# Tabla perfiles

```sql
id uuid primary key
nombre text
rol text default 'usuario'
created_at timestamp
```

Roles actuales:

- administrador
- usuario

Actualmente la aplicación funciona bajo un único negocio.

Todos los usuarios autenticados tienen acceso al sistema.

---

# RLS

Las tablas principales utilizan:

SELECT:
USING (true)

INSERT:
WITH CHECK (true)

UPDATE:
USING (true)
WITH CHECK (true)

DELETE:
USING (true)

TO authenticated

Tablas:

- clientes
- materiales
- integrantes
- presupuestos
- presupuesto_materiales
- mano_obra_presupuesto

La tabla perfiles mantiene acceso únicamente al usuario autenticado.

---

# Diseño UI

Inspiración:

- Linear
- Vercel
- SaaS modernos

Características:

- Navbar oscura.
- Color acento naranja.
- Cards modernas.
- Iconografía Lucide.
- Responsive.
- Scroll interno.
- Tablas desktop.
- Tarjetas mobile.

---

# Componentes UI

## SectionCard

Componente base reutilizable.

Usado por:

- ResumenFinanciero
- MaterialesPresupuesto
- ManoObraPresupuesto
- DatosGenerales
- OpcionalesNotas

---

# Navbar

Características:

- Responsive.
- Menú hamburguesa.
- Dropdown usuario.
- Logout.
- Avatar con iniciales.
- Perfil dinámico.

---

# Módulos

## Clientes

- CRUD completo.
- Responsive.
- Diseño moderno.

## Materiales

- CRUD completo.
- Fecha creación.
- Última actualización.
- Usuario autenticado.
- Scroll interno.

## Integrantes

- CRUD completo.
- Jornales.
- Porcentajes.
- Estado activo.

## Presupuestos

- Crear presupuesto.
- Listar presupuestos.
- Buscar.
- Ver detalle.

---

# Presupuesto Detalle

Módulos:

- Datos Generales.
- Opcionales y notas.
- Materiales.
- Mano de obra.
- Resumen financiero.

Características:

- Layout dos columnas.
- Sidebar sticky.
- Responsive.
- Scroll interno.

---

# Cálculo del presupuesto

Costo Materiales

- Costo Mano de Obra
- # Consumibles e Imprevistos

Costo Total

Costo Total

- # Ganancia

Precio Trabajo

Precio Trabajo

- # Flete

Precio Final

---

# PDF

Actualmente funcional.

Pendiente:

- Diseño profesional.
- Branding.
- Logo.
- Información comercial.
- Validez del presupuesto.
- Datos de contacto.

---

# Convenciones Git

Feature branches:

- feature/auth-login
- feature/ui-cruds
- feature/presupuesto-estados
- feature/ia-descripciones
- feature/pdf-profesional

Flujo:

main
↓
feature/\*
↓
commit
↓
merge main

---

# Roadmap

## Finalizado

- Auth.
- RLS.
- Navbar.
- Responsive.
- Clientes.
- Materiales.
- Integrantes.
- Presupuesto Detalle.

## Esquema del proyecto

┣ 📂.vscode
┃ ┗ 📜settings.json
┣ 📂public
┃ ┣ 📜favicon.svg
┃ ┣ 📜icons.svg
┃ ┣ 📜logo-valverde.png
┃ ┣ 📜logo-valverde1.png
┃ ┗ 📜logo.png
┣ 📂src
┃ ┣ 📂assets
┃ ┃ ┣ 📜hero.png
┃ ┃ ┣ 📜react.svg
┃ ┃ ┗ 📜vite.svg
┃ ┣ 📂components
┃ ┃ ┣ 📂Presupuestos
┃ ┃ ┃ ┣ 📜AlternativaCard.jsx
┃ ┃ ┃ ┣ 📜AlternativaModal.jsx
┃ ┃ ┃ ┣ 📜AlternativasPresupuesto.jsx
┃ ┃ ┃ ┣ 📜DatosGenerales.jsx
┃ ┃ ┃ ┣ 📜ManoObraPresupuesto.jsx
┃ ┃ ┃ ┣ 📜MaterialesPresupuesto.jsx
┃ ┃ ┃ ┣ 📜OpcionalesNotas.jsx
┃ ┃ ┃ ┣ 📜ResumenFinanciero.jsx
┃ ┃ ┃ ┣ 📜WritingAssistant.jsx
┃ ┃ ┃ ┗ 📜WritingAssistantModal.jsx
┃ ┃ ┗ 📂ui
┃ ┃   ┗ 📜SectionCard.jsx
┃ ┣ 📂context
┃ ┃ ┣ 📜AuthContext.jsx
┃ ┃ ┗ 📜context.js
┃ ┣ 📂hooks
┃ ┃ ┗ 📜useAuth.js
┃ ┣ 📂layouts
┃ ┃ ┗ 📜MainLayout.jsx
┃ ┣ 📂lib
┃ ┃ ┗ 📜supabase.js
┃ ┣ 📂pages
┃ ┃ ┣ 📂Auth
┃ ┃ ┃ ┗ 📜LoginPage.jsx
┃ ┃ ┣ 📂Clientes
┃ ┃ ┃ ┗ 📜ClientesPage.jsx
┃ ┃ ┣ 📂Integrantes
┃ ┃ ┃ ┗ 📜IntegrantesPage.jsx
┃ ┃ ┣ 📂Materiales
┃ ┃ ┃ ┗ 📜MaterialesPage.jsx
┃ ┃ ┗ 📂Presupuestos
┃ ┃   ┣ 📜PresupuestoDetallePage.jsx
┃ ┃   ┗ 📜PresupuestosPage.jsx
┃ ┣ 📂routes
┃ ┃ ┗ 📜ProtectedRoute.jsx
┃ ┣ 📂services
┃ ┃ ┣ 📜alternativasService.js
┃ ┃ ┣ 📜clientesService.js
┃ ┃ ┣ 📜integrantesService.js
┃ ┃ ┣ 📜materialesService.js
┃ ┃ ┣ 📜presupuestoManoObraService.js
┃ ┃ ┣ 📜presupuestoMaterialesService.js
┃ ┃ ┣ 📜presupuestosService.js
┃ ┃ ┗ 📜writingAssistantService.js
┃ ┣ 📂utils
┃ ┃ ┣ 📜materiales.js
┃ ┃ ┣ 📜pdfGenerator.js
┃ ┃ ┗ 📜validarMaterial.js
┃ ┣ 📜App.css
┃ ┣ 📜App.jsx
┃ ┣ 📜index.css
┃ ┣ 📜main.jsx
┃ ┗ 📜tailwind.css
┣ 📂supabase
┃ ┣ 📂.temp
┃ ┃ ┣ 📜gotrue-version
┃ ┃ ┣ 📜linked-project.json
┃ ┃ ┣ 📜pooler-url
┃ ┃ ┣ 📜postgres-version
┃ ┃ ┣ 📜project-ref
┃ ┃ ┣ 📜rest-version
┃ ┃ ┣ 📜storage-migration
┃ ┃ ┗ 📜storage-version
┃ ┣ 📂functions
┃ ┃ ┗ 📂writing-assistant
┃ ┃   ┣ 📂guards
┃ ┃   ┃ ┗ 📜ContextGuardian.ts
┃ ┃   ┣ 📂prompts
┃ ┃   ┃ ┣ 📜generatePrompt.ts
┃ ┃   ┃ ┣ 📜improvePrompt.ts
┃ ┃   ┃ ┣ 📜promptBuilder.ts
┃ ┃   ┃ ┣ 📜styleGuide.ts
┃ ┃   ┃ ┗ 📜systemPrompt.ts
┃ ┃   ┣ 📂providers
┃ ┃   ┃ ┣ 📜aiProvider.ts
┃ ┃   ┃ ┣ 📜fakeProvider.ts
┃ ┃   ┃ ┣ 📜geminiProvider.ts
┃ ┃   ┃ ┗ 📜providerFactory.ts
┃ ┃   ┣ 📂types
┃ ┃   ┃ ┣ 📜promptContext.ts
┃ ┃   ┃ ┣ 📜promptRequest.ts
┃ ┃   ┃ ┣ 📜providerResponse.ts
┃ ┃   ┃ ┗ 📜ValidationResult.ts
┃ ┃   ┣ 📂utils
┃ ┃   ┃ ┗ 📜response.ts
┃ ┃   ┣ 📜.npmrc
┃ ┃   ┣ 📜deno.json
┃ ┃   ┗ 📜index.ts
┃ ┣ 📂migrations
┃ ┃ ┣ 📜20260706_create_alternativas_presupuesto.sql
┃ ┃ ┗ 📜20260712_add_tipo_precio_alternativas.sql
┃ ┣ 📜.gitignore
┃ ┗ 📜config.toml
┣ 📜.env
┣ 📜.env.example
┣ 📜.gitignore
┣ 📜.repomixignore
┣ 📜CONTEXT_MODULE_AI.md
┣ 📜DB_SCHEMA.md
┣ 📜eslint.config.js
┣ 📜index.html
┣ 📜package.json
┣ 📜PROJECT_CONTEXT.md
┣ 📜README.md
┣ 📜repomix-output.xml
┗ 📜vite.config.js

---

# Modulo AI

Objetivo:

Mejorar y generar automáticamente descripciones técnicas de presupuestos.

Ejemplo:

Entrada:

- medidas
- materiales
- terminaciones

Salida:

- descripción profesional lista para PDF.

El detalle se encuentra en CONTEXT_MODULE_AI.md

---

# Objetivo comercial

Transformar la aplicación en un SaaS de gestión para carpinterías y herrerías pequeñas y medianas.
