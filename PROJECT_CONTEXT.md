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

## Próximo

1. Estados del presupuesto.
2. IA para descripciones.
3. PDF profesional.
4. Dashboard.
5. Gestión de usuarios.
6. Multiempresa.

---

# IA futura

Objetivo:

Generar automáticamente descripciones técnicas de presupuestos.

Ejemplo:

Entrada:

- medidas
- materiales
- terminaciones

Salida:

- descripción profesional lista para PDF.

---

# Objetivo comercial

Transformar la aplicación en un SaaS de gestión para carpinterías y herrerías pequeñas y medianas.
