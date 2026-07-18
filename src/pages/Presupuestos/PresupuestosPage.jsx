import { useEffect, useState } from "react";
import {
  obtenerPresupuestos,
  crearPresupuesto,
} from "../../services/presupuestosService";
import { obtenerClientes } from "../../services/clientesService";
import { obtenerEstadoPresupuesto } from "../../constants/presupuestoEstados";
import { Link } from "react-router-dom";

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
  function iniciales(texto) {
    if (!texto) return "PV";
    return texto
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Presupuestos
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
          </svg>
          {mostrarFormulario ? "Cerrar" : "Crear Presupuesto"}
        </button>
      </header>

      {/* Formulario (Nuevo Presupuesto) */}
      {mostrarFormulario && (
        <section className="mb-6 rounded-2xl border border-zinc-800 bg-[#111111] p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Nuevo Presupuesto
          </h3>

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
                className="w-full rounded-lg border border-zinc-700 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-zinc-100 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
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
                className="w-full rounded-lg border border-zinc-700 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-zinc-100 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
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
                className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
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
        </section>
      )}

      {/* Listado */}
      <section className="rounded-2xl border border-zinc-800 bg-[#111111] shadow-sm">
        {/* Cabecera de la card */}
        <div className="flex items-center gap-3 border-b border-zinc-800 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Listado de Presupuestos
            </h2>
            <p className="text-sm text-zinc-400">
              {presupuestosFiltrados.length} de {presupuestos.length}{" "}
              presupuestos
            </p>
          </div>
        </div>

        {/* Buscador */}
        <div className="p-5">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 3.476 9.77l3.127 3.127a.75.75 0 1 0 1.06-1.06l-3.126-3.127A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por número, cliente, título o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-[#0a0a0a] py-2.5 pl-10 pr-3.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            />
          </div>
        </div>

        {/* Tabla (desktop) */}
        <div className="hidden px-5 pb-5 lg:block">
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <div className="max-h-[32rem] overflow-y-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-[#161616]">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
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
                <tbody className="divide-y divide-zinc-800">
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
                    presupuestosFiltrados.map((presupuesto) => (
                      <tr
                        key={presupuesto.id}
                        className="transition-colors hover:bg-zinc-800/40"
                      >
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white">
                            {presupuesto.numero}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-200">
                          {presupuesto.titulo}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-400 ring-1 ring-orange-500/20">
                            {presupuesto.categoria_trabajo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-200">
                              {iniciales(presupuesto.clientes?.nombre)}
                            </span>
                            <span className="text-zinc-200">
                              {presupuesto.clientes?.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {presupuesto.tipo_trabajo}
                        </td>
                        <td className="px-4 py-3">
                          {(() => {
                            const estado = obtenerEstadoPresupuesto(
                              presupuesto.estado
                            );
                            return (
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${estado.badgeClass}`}
                              >
                                {estado.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-white">
                          ${" "}
                          {Number(
                            presupuesto.precio_final || 0
                          ).toLocaleString("es-AR")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/presupuestos/${presupuesto.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path d="M10 4c-3.6 0-6.7 2.1-8 5 1.3 2.9 4.4 5 8 5s6.7-2.1 8-5c-1.3-2.9-4.4-5-8-5Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                            </svg>
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tarjetas (mobile / tablet) */}
        <div className="space-y-3 px-5 pb-5 lg:hidden">
          {presupuestosFiltrados.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">
              No hay presupuestos para mostrar.
            </p>
          ) : (
            presupuestosFiltrados.map((presupuesto) => (
              <div
                key={presupuesto.id}
                className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-zinc-200">
                      {iniciales(presupuesto.clientes?.nombre)}
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        {presupuesto.numero}
                      </p>
                      <p className="text-sm text-zinc-400">
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
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${estado.badgeClass}`}
                      >
                        {estado.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  <p className="text-zinc-200">
                    <span className="text-zinc-500">Título: </span>
                    {presupuesto.titulo}
                  </p>
                  <p>
                    <span className="text-zinc-500">Categoría: </span>
                    <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400 ring-1 ring-orange-500/20">
                      {presupuesto.categoria_trabajo}
                    </span>
                  </p>
                  <p className="text-zinc-400">
                    <span className="text-zinc-500">Tipo: </span>
                    {presupuesto.tipo_trabajo}
                  </p>
                  <p className="font-semibold text-white">
                    <span className="font-normal text-zinc-500">
                      Precio Final:{" "}
                    </span>
                    ${" "}
                    {Number(presupuesto.precio_final || 0).toLocaleString(
                      "es-AR"
                    )}
                  </p>
                </div>

                <div className="mt-3 flex justify-end">
                  <Link
                    to={`/presupuestos/${presupuesto.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M10 4c-3.6 0-6.7 2.1-8 5 1.3 2.9 4.4 5 8 5s6.7-2.1 8-5c-1.3-2.9-4.4-5-8-5Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                    </svg>
                    Ver
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default PresupuestosPage;
