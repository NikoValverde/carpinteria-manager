import { useEffect, useState } from "react";
import {
  obtenerPresupuestos,
  crearPresupuesto,
} from "../../services/presupuestosService";
import { obtenerClientes } from "../../services/clientesService";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SectionCard from "../../components/ui/SectionCard";
import {
  FileText,
  FilePlus,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Eye,
} from "lucide-react";

// Paleta cíclica puramente visual para las badges de estado.
// Se elige de forma determinística según el texto del estado,
// no representa ninguna regla de negocio (no conocemos el set real de estados).
const paletteColores = [
  { bg: "bg-blue-500/15", text: "text-blue-400" },
  { bg: "bg-orange-500/15", text: "text-orange-400" },
  { bg: "bg-amber-500/15", text: "text-amber-400" },
  { bg: "bg-violet-500/15", text: "text-violet-400" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  { bg: "bg-pink-500/15", text: "text-pink-400" },
  { bg: "bg-zinc-500/15", text: "text-zinc-300" },
];

// Colores para avatares
const coloresAvatar = [
  { bg: "bg-orange-500/15", text: "text-orange-500" },
  { bg: "bg-violet-500/15", text: "text-violet-500" },
  { bg: "bg-emerald-500/15", text: "text-emerald-500" },
  { bg: "bg-amber-500/15", text: "text-amber-500" },
];

function obtenerColorEstado(estado) {
  if (!estado) return paletteColores[paletteColores.length - 1];

  let hash = 0;
  for (let i = 0; i < estado.length; i++) {
    hash = (hash * 31 + estado.charCodeAt(i)) % paletteColores.length;
  }

  return paletteColores[Math.abs(hash) % paletteColores.length];
}

// Intenta resolver una fecha legible probando los nombres de campo más comunes.
// Si el presupuesto no trae ninguno, no se muestra nada (no se inventa una fecha).
function obtenerFechaLegible(presupuesto) {
  const valor =
    presupuesto.created_at || presupuesto.fecha || presupuesto.fecha_creacion;

  if (!valor) return null;

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;

  return fecha.toLocaleDateString("es-AR");
}

function obtenerIniciales(nombre) {
  if (!nombre) return "";
  const partes = nombre.trim().split(" ").filter(Boolean);
  const primera = partes[0]?.[0] || "";
  const segunda = partes[1]?.[0] || "";
  return `${primera}${segunda}`.toUpperCase();
}

function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [titulo, setTitulo] = useState("");
  const [categoriaTrabajo, setCategoriaTrabajo] = useState("");
  const [clienteId, setClienteId] = useState("");

  const [tipoTrabajo, setTipoTrabajo] = useState("Carpintería");

  const [descripcion, setDescripcion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [notasInternas, setNotasInternas] = useState("");

  const [porcentajeGanancia, setPorcentajeGanancia] = useState(35);
  const [consumiblesImprevistos, setConsumiblesImprevistos] = useState(0);
  const [flete, setFlete] = useState(0);

  const [validezDias, setValidezDias] = useState(15);

  const { perfil } = useAuth();
  const usuarioNombre = perfil?.nombre || "Administrador";

  async function cargarPresupuestos() {
    try {
      const data = await obtenerPresupuestos();

      setPresupuestos(data);
    } catch (error) {
      console.error(error);
    }
  }

  function generarNumeroPresupuesto() {
    const siguiente = presupuestos.length + 1;

    return `PV-${String(siguiente).padStart(4, "0")}`;
  }

  async function cargarClientes() {
    try {
      const data = await obtenerClientes();

      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await cargarPresupuestos();
      await cargarClientes();
    };

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await crearPresupuesto({
        numero: generarNumeroPresupuesto(),

        cliente_id: Number(clienteId),

        titulo,
        categoria_trabajo: categoriaTrabajo,

        tipo_trabajo: tipoTrabajo,

        descripcion,
        observaciones,
        notas_internas: notasInternas,

        porcentaje_ganancia: porcentajeGanancia,

        consumibles_imprevistos: consumiblesImprevistos,

        flete,

        validez_dias: validezDias,
      });

      await cargarPresupuestos();

      setTitulo("");
      setCategoriaTrabajo("");
      setClienteId("");

      setDescripcion("");
      setObservaciones("");
      setNotasInternas("");
    } catch (error) {
      console.error(error);
    }
  }

  const presupuestosFiltrados = presupuestos.filter((presupuesto) => {
    const textoBusqueda = busqueda.toLowerCase();

    return (
      presupuesto.numero?.toLowerCase().includes(textoBusqueda) ||
      presupuesto.titulo?.toLowerCase().includes(textoBusqueda) ||
      presupuesto.categoria_trabajo?.toLowerCase().includes(textoBusqueda) ||
      presupuesto.clientes?.nombre?.toLowerCase().includes(textoBusqueda)
    );
  });

  // Derivados de presentación únicamente (sumas/promedios para las tarjetas resumen):
  // no modifican presupuestos ni ningún estado existente, ni agregan reglas de negocio.
  const valorTotal = presupuestos.reduce(
    (acc, p) => acc + Number(p.precio_final || 0),
    0,
  );

  const precioPromedio =
    presupuestos.length > 0 ? valorTotal / presupuestos.length : 0;

  const fechaActualizacion = new Date().toLocaleDateString("es-AR");

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Presupuestos
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {presupuestos.length}{" "}
          {presupuestos.length === 1
            ? "presupuesto registrado"
            : "presupuestos registrados"}
        </p>
      </div>

      {/* Tarjetas resumen superiores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Presupuestos
            </p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {presupuestos.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
            <DollarSign size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Valor Total
            </p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              ${valorTotal.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Precio Promedio
            </p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              $
              {precioPromedio.toLocaleString("es-AR", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Buscador moderno */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute inset-y-0 left-3 my-auto text-zinc-400"
        />
        <input
          type="text"
          placeholder="Buscar por número, cliente, título o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2.5 pl-9 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Formulario de nuevo presupuesto */}
      <SectionCard
        title={
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Nuevo Presupuesto
            </span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              Completá los datos para iniciar un presupuesto
            </span>
          </div>
        }
        icon={FilePlus}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div className="min-w-[200px] flex-1 space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Título
            </label>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="w-full space-y-1 sm:w-56">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Categoría
            </label>
            <select
              value={categoriaTrabajo}
              onChange={(e) => setCategoriaTrabajo(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <option value="">Seleccionar categoría</option>

              <option>Amoblamiento de cocina</option>
              <option>Placard</option>
              <option>Vestidor</option>
              <option>Biblioteca</option>
              <option>Pérgola</option>
              <option>Puerta</option>
              <option>Portón</option>
              <option>Escalera</option>
              <option>Parrilla</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="w-full space-y-1 sm:w-56">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Cliente
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <option value="">Seleccionar cliente</option>

              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
          >
            <Plus size={14} />
            Crear Presupuesto
          </button>
        </form>
      </SectionCard>

      {/* Listado de presupuestos */}
      <SectionCard
        title={
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Listado de Presupuestos
            </span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {presupuestosFiltrados.length} de {presupuestos.length}{" "}
              presupuestos
            </span>
          </div>
        }
        icon={FileText}
      >
        <div className="space-y-4">
          {presupuestosFiltrados.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center text-sm text-zinc-400">
              {presupuestos.length === 0
                ? "Todavía no hay presupuestos registrados."
                : "No se encontraron presupuestos con esa búsqueda."}
            </p>
          ) : (
            <>
              {/* Vista tabla (desktop) - con scroll interno cuando supera la altura */}
              <div className="hidden max-h-[560px] overflow-y-auto overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-left text-[11px] uppercase tracking-wider text-zinc-400">
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Presupuesto
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Cliente
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Categoría
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Estado
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Fecha
                      </th>
                      <th className="px-4 py-2.5 text-right font-semibold">
                        Precio Final
                      </th>
                      <th className="px-4 py-2.5 text-right font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {presupuestosFiltrados.map((presupuesto, index) => {
                      const color = obtenerColorEstado(presupuesto.estado);
                      const fecha = obtenerFechaLegible(presupuesto);
                      const avatarColor =
                        coloresAvatar[index % coloresAvatar.length];

                      return (
                        <tr
                          key={presupuesto.id}
                          className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                        >
                          <td className="px-4 py-3 text-center">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {presupuesto.numero}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {presupuesto.titulo}
                            </p>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor.bg} ${avatarColor.text}`}
                              >
                                {obtenerIniciales(presupuesto.clientes?.nombre)}
                              </div>
                              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                                {presupuesto.clientes?.nombre}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 text-center">
                            {presupuesto.categoria_trabajo}
                          </td>

                          <td className="px-4 py-3 text-center">
                            {presupuesto.estado && (
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${color.bg} ${color.text}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${color.text.replace(
                                    "text-",
                                    "bg-",
                                  )}`}
                                />
                                {presupuesto.estado}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-center">
                            {fecha || "—"}
                          </td>

                          <td className="px-4 py-3 text-center font-semibold text-zinc-900 dark:text-zinc-100">
                            $
                            {Number(
                              presupuesto.precio_final || 0,
                            ).toLocaleString("es-AR")}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <Link
                              to={`/presupuestos/${presupuesto.id}`}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              <Eye size={12} />
                              Ver
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista tarjetas (mobile) - con scroll interno cuando supera la altura */}
              <div className="grid max-h-[600px] gap-3 overflow-y-auto md:hidden">
                {presupuestosFiltrados.map((presupuesto) => {
                  const color = obtenerColorEstado(presupuesto.estado);
                  const fecha = obtenerFechaLegible(presupuesto);

                  return (
                    <div
                      key={presupuesto.id}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {presupuesto.numero}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {presupuesto.titulo}
                          </p>
                        </div>

                        {presupuesto.estado && (
                          <span
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${color.bg} ${color.text}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${color.text.replace(
                                "text-",
                                "bg-",
                              )}`}
                            />
                            {presupuesto.estado}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
                        <p>
                          <span className="text-zinc-400">Cliente: </span>
                          {presupuesto.clientes?.nombre}
                        </p>
                        <p>
                          <span className="text-zinc-400">Categoría: </span>
                          {presupuesto.categoria_trabajo}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700/60 pt-3 text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {fecha || "—"}
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          $
                          {Number(presupuesto.precio_final || 0).toLocaleString(
                            "es-AR",
                          )}
                        </span>
                      </div>

                      <Link
                        to={`/presupuestos/${presupuesto.id}`}
                        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Eye size={12} />
                        Ver Presupuesto
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pie de actualización */}
              <div className="flex flex-col gap-1 border-t border-zinc-200 dark:border-zinc-800 px-1 pt-3 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {presupuestosFiltrados.length} de {presupuestos.length}{" "}
                  presupuestos mostrados
                </span>
                <span>
                  Actualizado el {fechaActualizacion} · por {usuarioNombre}
                </span>
              </div>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

export default PresupuestosPage;
