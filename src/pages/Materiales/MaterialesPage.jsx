import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import {
  obtenerMateriales,
  crearMaterial,
  eliminarMaterial,
  actualizarMaterial,
} from "../../services/materialesService";
import SectionCard from "../../components/ui/SectionCard";
import {
  Package,
  PackagePlus,
  Plus,
  Pencil,
  Trash2,
  Search,
  Ruler,
  Tag,
  Clock,
  Calendar,
} from "lucide-react";

// Paleta cíclica puramente visual para los badges de categoría.
// No depende de ningún dato de negocio, solo del nombre de la categoría.
const coloresCategoria = [
  { bg: "bg-orange-500/15", text: "text-orange-500" },
  { bg: "bg-sky-500/15", text: "text-sky-500" },
  { bg: "bg-amber-500/15", text: "text-amber-500" },
  { bg: "bg-blue-500/15", text: "text-blue-500" },
  { bg: "bg-violet-500/15", text: "text-violet-500" },
  { bg: "bg-cyan-500/15", text: "text-cyan-500" },
  { bg: "bg-emerald-500/15", text: "text-emerald-500" },
  { bg: "bg-rose-500/15", text: "text-rose-500" },
  { bg: "bg-teal-500/15", text: "text-teal-500" },
];

function colorPorCategoria(categoria) {
  if (!categoria) return coloresCategoria[0];
  let hash = 0;
  for (let i = 0; i < categoria.length; i++) {
    hash = categoria.charCodeAt(i) + ((hash << 5) - hash);
  }
  return coloresCategoria[Math.abs(hash) % coloresCategoria.length];
}

function formatearPrecio(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return valor;
  return numero.toLocaleString("es-AR");
}

// Formatea created_at (timestamptz de Supabase) a "DD/MM/YYYY HH:mm".
function formatearFechaHora(valor) {
  if (!valor) return "—";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "—";
  return fecha.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Formatea solo la fecha a "DD/MM/YYYY" para el pie de la tabla.
function formatearFechaCorta(valor) {
  if (!valor) return "—";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "—";
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function MaterialesPage() {
  const [materiales, setMateriales] = useState([]);
  const [materialEditando, setMaterialEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("");
  const [precio, setPrecio] = useState("");

  // Estados nuevos, puramente de UI (no tocan Supabase ni el CRUD existente):
  // - mostrarFormulario: controla si se ve el panel de alta/edición.
  // - busqueda: filtro de visualización sobre la lista ya cargada.
  // - filtroCategoria: filtro visual por categoría.
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

const { perfil } = useAuth();

const usuarioNombre = perfil?.nombre || "Nicolás Valverde";
  

  async function cargarMateriales() {
    try {
      const data = await obtenerMateriales();
      setMateriales(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await cargarMateriales();
    };
    fetchData();
  }, []);

  
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (materialEditando) {
        await actualizarMaterial(materialEditando.id, {
          nombre,
          categoria,
          unidad,
          precio,
        });
      } else {
        await crearMaterial({
          nombre,
          categoria,
          unidad,
          precio,
        });
      }

      setNombre("");
      setCategoria("");
      setUnidad("");
      setPrecio("");
      setMaterialEditando(null);

      await cargarMateriales();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Desea eliminar este material?");

    if (!confirmar) return;

    try {
      await eliminarMaterial(id);

      await cargarMateriales();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditar(material) {
    setMaterialEditando(material);

    setNombre(material.nombre || "");
    setCategoria(material.categoria || "");
    setUnidad(material.unidad || "");
    setPrecio(material.precio || "");
  }

  // Derivados de presentación únicamente: no modifican materiales ni ningún estado existente.
  const formularioVisible = mostrarFormulario || materialEditando !== null;

  const categoriasDisponibles = [
    "Todas",
    ...Array.from(
      new Set(materiales.map((material) => material.categoria).filter(Boolean)),
    ),
  ];

  const materialesFiltrados = materiales.filter((material) => {
    const coincideCategoria =
      filtroCategoria === "Todas" || material.categoria === filtroCategoria;

    const termino = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      !termino ||
      [material.nombre, material.categoria, material.unidad]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(termino));

    return coincideCategoria && coincideBusqueda;
  });

  const promedioPrecio =
    materialesFiltrados.length > 0
      ? Math.round(
          materialesFiltrados.reduce(
            (acc, material) => acc + (Number(material.precio) || 0),
            0,
          ) / materialesFiltrados.length,
        )
      : 0;

  // Última actualización: tomamos el created_at más reciente entre los materiales.
  // Si no hay datos, usamos la fecha actual como referencia visual.
  const ultimaActualizacion = materiales.reduce((masReciente, material) => {
    if (!material.created_at) return masReciente;
    const actual = new Date(material.created_at).getTime();
    if (Number.isNaN(actual)) return masReciente;
    return actual > masReciente ? actual : masReciente;
  }, 0);

  const fechaUltimaActualizacion =
    ultimaActualizacion > 0 ? new Date(ultimaActualizacion) : new Date();

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Materiales
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {materiales.length}{" "}
            {materiales.length === 1
              ? "material registrado"
              : "materiales registrados"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
        >
          <Plus size={16} />
          Crear Material
        </button>
      </div>

      {/* Formulario de alta / edición */}
      {formularioVisible && (
        <SectionCard
          title={
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {materialEditando ? "Editar Material" : "Nuevo Material"}
              </span>
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                Completá los datos del material
              </span>
            </div>
          }
          icon={PackagePlus}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Categoría
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">Seleccione una categoría</option>

                  <option value="Melamina">Melamina</option>
                  <option value="MDF">MDF</option>
                  <option value="Herraje">Herraje</option>
                  <option value="Caño">Caño</option>
                  <option value="Chapa">Chapa</option>
                  <option value="Vidrio">Vidrio</option>
                  <option value="Aluminio">Aluminio</option>
                  <option value="Policarbonato">Policarbonato</option>
                  <option value="Pintura">Pintura</option>
                  <option value="Consumible">Consumible</option>
                  <option value="Madera">Madera</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Unidad
                </label>
                <select
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">Seleccione una unidad</option>

                  <option value="Placa">Placa</option>
                  <option value="Unidad">Unidad</option>
                  <option value="Barra 6m">Barra 6m</option>
                  <option value="Metro">Metro</option>
                  <option value="m²">m²</option>
                  <option value="Litro">Litro</option>
                  <option value="Kg">Kg</option>
                  <option value="Hoja">Hoja</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Precio
                </label>
                <input
                  type="number"
                  placeholder="Precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
              >
                {materialEditando ? <Pencil size={14} /> : <Plus size={14} />}
                {materialEditando ? "Guardar Cambios" : "Crear Material"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setNombre("");
                  setCategoria("");
                  setUnidad("");
                  setPrecio("");
                  setMaterialEditando(null);
                  setMostrarFormulario(false);
                }}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {/* Listado de materiales */}
      <SectionCard
        title={
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Listado de Materiales
            </span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {materialesFiltrados.length} de {materiales.length} materiales
            </span>
          </div>
        }
        icon={Package}
      >
        <div className="space-y-4">
          {/* Buscador + filtro de categorías (select desplegable) */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative lg:w-72">
              <Search
                size={16}
                className="pointer-events-none absolute inset-y-0 left-3 my-auto text-zinc-400"
              />
              <input
                type="text"
                placeholder="Buscar material..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="relative lg:w-56">
              <Tag
                size={16}
                className="pointer-events-none absolute inset-y-0 left-3 my-auto text-zinc-400"
              />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full appearance-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-9 pr-8 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "Todas" ? "Todas las categorías" : cat}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-zinc-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {materialesFiltrados.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-12 text-center">
              <Package size={28} className="text-zinc-400" />
              <p className="text-sm text-zinc-400">
                {materiales.length === 0
                  ? "Todavía no hay materiales registrados."
                  : "No se encontraron materiales con esos filtros."}
              </p>
            </div>
          ) : (
            <>
              {/* Vista tabla (desktop) con scroll cuando supera cierta altura */}
              <div className="hidden overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 md:block">
                <div className="max-h-[28rem] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-left text-[11px] uppercase tracking-wider text-zinc-400 backdrop-blur">
                        <th className="px-4 py-2.5 font-semibold text-center">
                          Nombre
                        </th>
                        <th className="px-4 py-2.5 font-semibold text-center">
                          Categoría
                        </th>
                        <th className="px-4 py-2.5 font-semibold text-center">
                          Unidad
                        </th>
                        <th className="px-4 py-2.5 font-semibold text-center">
                          Precio Unitario
                        </th>
                        <th className="px-4 py-2.5 font-semibold text-center">
                          Fecha de creación
                        </th>
                        <th className="px-4 py-2.5 font-semibold text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {materialesFiltrados.map((material) => {
                        const color = colorPorCategoria(material.categoria);

                        return (
                          <tr
                            key={material.id}
                            className="border-b border-zinc-100 dark:border-zinc-800/60 transition-colors last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                          >
                            <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 text-center">
                              {material.nombre}
                            </td>

                            <td className="px-4 py-3 text-center">
                              {material.categoria && (
                                <span
                                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${color.bg} ${color.text}`}
                                >
                                  {material.categoria}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 text-center">
                              <span className="flex items-center gap-1.5 justify-center">
                                <Ruler size={12} className="text-zinc-400" />
                                {material.unidad}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                              $ {formatearPrecio(material.precio)}
                            </td>

                            <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-center">
                              <span className="flex justify-center items-center gap-1.5 whitespace-nowrap tabular-nums">
                                <Calendar size={12} className="text-zinc-400" />
                                {formatearFechaHora(material.created_at)}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditar(material)}
                                  className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  <Pencil size={12} />
                                  Editar
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleEliminar(material.id)}
                                  className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-300 dark:border-red-900 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                  <Trash2 size={12} />
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pie con resumen + última actualización */}
                <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-3">
                    <span>{materialesFiltrados.length} materiales</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 sm:justify-end">
                    <Clock size={12} className="text-zinc-400" />
                    Última actualización: {" "}
                    {formatearFechaCorta(fechaUltimaActualizacion)} · por{" "}
                    {usuarioNombre}
                  </span>
                </div>
              </div>

              {/* Vista tarjetas (mobile) con scroll cuando supera cierta altura */}
              <div className="md:hidden">
                <div className="grid max-h-[28rem] gap-3 overflow-y-auto pr-1">
                  {materialesFiltrados.map((material) => {
                    const color = colorPorCategoria(material.categoria);

                    return (
                      <div
                        key={material.id}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                              {material.nombre}
                            </p>
                            {material.categoria && (
                              <span
                                className={`mt-1.5 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${color.bg} ${color.text}`}
                              >
                                {material.categoria}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditar(material)}
                              title="Editar"
                              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEliminar(material.id)}
                              title="Eliminar"
                              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700/60 pt-3 text-sm">
                          <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                            <Ruler size={12} className="text-zinc-400" />
                            {material.unidad}
                          </span>
                          <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                            $ {formatearPrecio(material.precio)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                          <Calendar size={12} className="text-zinc-400" />
                          {formatearFechaHora(material.created_at)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumen mobile + última actualización */}
                <div className="mt-3 flex flex-col gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag size={12} className="text-zinc-400" />
                      {materialesFiltrados.length} materiales
                    </span>
                    <span>
                      Promedio:{" "}
                      <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                        $ {formatearPrecio(promedioPrecio)}
                      </span>
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 border-t border-zinc-200 dark:border-zinc-700/60 pt-2 text-zinc-400 dark:text-zinc-500">
                    <Clock size={12} className="text-zinc-400" />
                    Última actualización: Actualizado el{" "}
                    {formatearFechaCorta(fechaUltimaActualizacion)} · por{" "}
                    {usuarioNombre}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

export default MaterialesPage;
