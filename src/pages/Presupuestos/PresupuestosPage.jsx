import { useEffect, useState } from "react";
import {
  obtenerPresupuestos,
  crearPresupuesto,
} from "../../services/presupuestosService";
import { obtenerClientes } from "../../services/clientesService";
import { obtenerEstadoPresupuesto } from "../../constants/presupuestoEstados";
import { Link } from "react-router-dom";
import SectionCard from "../../components/ui/SectionCard";
import { Eye, FilePlus, FileText, Plus, Search } from "lucide-react";

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

  // Estado solo visual (no afecta la lógica ni el CRUD)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

      setMostrarFormulario(false);
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

  // Helpers solo visuales
  const coloresAvatar = [
    { bg: "bg-orange-500/15", text: "text-orange-400", bar: "bg-orange-500" },
    { bg: "bg-violet-500/15", text: "text-violet-400", bar: "bg-violet-500" },
    { bg: "bg-emerald-500/15", text: "text-emerald-400", bar: "bg-emerald-500" },
    { bg: "bg-amber-500/15", text: "text-amber-400", bar: "bg-amber-500" },
  ];

  function obtenerIniciales(nombre) {
    if (!nombre) return "";
    const partes = nombre.trim().split(" ").filter(Boolean);
    const primera = partes[0]?.[0] || "";
    const segunda = partes[1]?.[0] || "";
    return `${primera}${segunda}`.toUpperCase();
  }

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-6 md:px-6">
      {/* Encabezado */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Presupuestos
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {presupuestos.length}{" "}
            {presupuestos.length === 1
              ? "presupuesto registrado"
              : "presupuestos registrados"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          <Plus size={16} className="shrink-0" aria-hidden="true" />
          {mostrarFormulario ? "Cerrar" : "Crear Presupuesto"}
        </button>
      </header>

      <div className="space-y-6">
        {/* Formulario (Nuevo Presupuesto) */}
        {mostrarFormulario && (
          <SectionCard title="Nuevo Presupuesto" icon={FilePlus}>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
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

              <div className="flex justify-end gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  Crear Presupuesto
                </button>
              </div>
            </form>
          </SectionCard>
        )}

        {/* Listado */}
        <SectionCard
          title={
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                Listado de Presupuestos
              </span>

              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500/60">
                {presupuestosFiltrados.length} de {presupuestos.length}
              </span>
            </div>
          }
          icon={FileText}
        >
          <div className="space-y-4">
            {/* Buscador */}
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Buscar por número, cliente, título o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-10 pr-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Tabla (desktop) */}
            <div className="hidden overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 lg:block">
              <div className="max-h-[32rem] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb:hover]:bg-zinc-400 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 dark:[&::-webkit-scrollbar-thumb:hover]:bg-zinc-600">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-800">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      <th className="px-4 py-3">Número</th>
                      <th className="px-4 py-3">Título</th>
                      <th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-right">Precio Final</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {presupuestosFiltrados.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-10 text-center text-sm text-zinc-500"
                        >
                          No hay presupuestos para mostrar.
                        </td>
                      </tr>
                    ) : (
                      presupuestosFiltrados.map((presupuesto, index) => {
                        const color =
                          coloresAvatar[index % coloresAvatar.length];
                        return (
                        <tr
                          key={presupuesto.id}
                          className="align-middle transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                        >
                          <td className="px-4 py-3">
                            <span className="font-semibold text-zinc-900 dark:text-white">
                              {presupuesto.numero}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">
                            {presupuesto.titulo}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              title={presupuesto.categoria_trabajo}
                              className="inline-flex max-w-[10rem] items-center truncate rounded-md bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20"
                            >
                              {presupuesto.categoria_trabajo}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color.bg} ${color.text}`}
                              >
                                {obtenerIniciales(presupuesto.clientes?.nombre)}
                              </span>
                              <span className="text-zinc-700 dark:text-zinc-200">
                                {presupuesto.clientes?.nombre}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                            {presupuesto.tipo_trabajo}
                          </td>
                          <td className="px-4 py-3">
                            {(() => {
                              const estado = obtenerEstadoPresupuesto(
                                presupuesto.estado
                              );
                              return (
                                <span
                                  className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none ${estado.badgeClass}`}
                                >
                                  {estado.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums text-zinc-900 dark:text-white">
                            ${Number(presupuesto.precio_final || 0).toLocaleString(
                              "es-AR"
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              to={`/presupuestos/${presupuesto.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              <Eye size={14} aria-hidden="true" />
                              Ver
                            </Link>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tarjetas (mobile / tablet) */}
            <div className="space-y-3 lg:hidden">
              {presupuestosFiltrados.length === 0 ? (
                <p className="py-10 text-center text-sm text-zinc-500">
                  No hay presupuestos para mostrar.
                </p>
              ) : (
                presupuestosFiltrados.map((presupuesto, index) => {
                  const color = coloresAvatar[index % coloresAvatar.length];
                  return (
                  <div
                    key={presupuesto.id}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color.bg} ${color.text}`}
                        >
                          {obtenerIniciales(presupuesto.clientes?.nombre)}
                        </span>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {presupuesto.numero}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {presupuesto.clientes?.nombre}
                          </p>
                        </div>
                      </div>
                      {(() => {
                        const estado = obtenerEstadoPresupuesto(
                          presupuesto.estado
                        );
                        return (
                          <span
                            className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none ${estado.badgeClass}`}
                          >
                            {estado.label}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="mt-3 space-y-1.5 text-sm">
                      <p className="text-zinc-700 dark:text-zinc-200">
                        <span className="text-zinc-500">Título: </span>
                        {presupuesto.titulo}
                      </p>
                      <p>
                        <span className="text-zinc-500">Categoría: </span>
                        <span
                          title={presupuesto.categoria_trabajo}
                          className="inline-flex max-w-[12rem] items-center truncate rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20 align-middle"
                        >
                          {presupuesto.categoria_trabajo}
                        </span>
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        <span className="text-zinc-500">Tipo: </span>
                        {presupuesto.tipo_trabajo}
                      </p>
                      <p className="font-semibold tabular-nums text-zinc-900 dark:text-white">
                        <span className="font-normal text-zinc-500">
                          Precio Final:{" "}
                        </span>
                        ${Number(presupuesto.precio_final || 0).toLocaleString(
                          "es-AR"
                        )}
                      </p>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Link
                        to={`/presupuestos/${presupuesto.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Eye size={14} aria-hidden="true" />
                        Ver
                      </Link>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default PresupuestosPage;
