import { useEffect, useState } from "react";
import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente,
} from "../../services/clientesService";
import SectionCard from "../../components/ui/SectionCard";
import {
  Users,
  UserPlus,
  Plus,
  Pencil,
  Trash2,
  Search,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Paleta cíclica puramente visual para los avatares de cliente.
// No depende de ningún dato de negocio, solo del índice de la fila.
const coloresAvatar = [
  { bg: "bg-orange-500/15", text: "text-orange-500" },
  { bg: "bg-violet-500/15", text: "text-violet-500" },
  { bg: "bg-emerald-500/15", text: "text-emerald-500" },
  { bg: "bg-amber-500/15", text: "text-amber-500" },
];

function obtenerIniciales(nombre) {
  if (!nombre) return "";
  const partes = nombre.trim().split(" ").filter(Boolean);
  const primera = partes[0]?.[0] || "";
  const segunda = partes[1]?.[0] || "";
  return `${primera}${segunda}`.toUpperCase();
}

function ClientesPage() {
  const [clientes, setClientes] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Estados nuevos, puramente de UI (no tocan Supabase ni el CRUD existente):
  // - mostrarFormulario: controla si se ve el panel de alta/edición.
  // - busqueda: filtro de visualización sobre la lista ya cargada.
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  async function cargarClientes() {
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const inicializar = async () => {
      await cargarClientes();
    };

    inicializar();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (clienteEditando) {
        await actualizarCliente(clienteEditando.id, {
          nombre,
          telefono,
          email,
          direccion,
          observaciones,
        });
      } else {

        await crearCliente({
          nombre,
          telefono,
          email,
          direccion,
          observaciones,
        });
      }

      setNombre("");
      setTelefono("");
      setEmail("");
      setDireccion("");
      setObservaciones("");
      setClienteEditando(null);

      await cargarClientes();
    } catch (error) {
      console.error("ERROR:", error);
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Desea eliminar este cliente?");

    if (!confirmar) return;

    try {
      await eliminarCliente(id);

      await cargarClientes();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditar(cliente) {
    alert(`Editar: ${cliente.nombre}`);

    setClienteEditando(cliente);

    setNombre(cliente.nombre || "");
    setTelefono(cliente.telefono || "");
    setEmail(cliente.email || "");
    setDireccion(cliente.direccion || "");
    setObservaciones(cliente.observaciones || "");
  }

  // Derivados de presentación únicamente: no modifican clientes ni ningún estado existente.
  const formularioVisible = mostrarFormulario || clienteEditando !== null;

  const clientesFiltrados = clientes.filter((cliente) => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return true;

    return [
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.direccion,
    ]
      .filter(Boolean)
      .some((campo) => campo.toLowerCase().includes(termino));
  });

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Clientes
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {clientes.length}{" "}
            {clientes.length === 1
              ? "cliente registrado"
              : "clientes registrados"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
        >
          <Plus size={16} />
          Crear Cliente
        </button>
      </div>

      {/* Formulario de alta / edición */}
      {formularioVisible && (
        <SectionCard
          title={
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}
              </span>
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                Completá los datos del cliente
              </span>
            </div>
          }
          icon={UserPlus}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                  required
                  minLength={3}
                  maxLength={100}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  autoComplete="tel"
                  maxLength={20}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  placeholder="Dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  maxLength={200}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="min-h-[100px] w-full resize-none overflow-y-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
              >
                {clienteEditando ? <Pencil size={14} /> : <Plus size={14} />}
                {clienteEditando ? "Guardar Cambios" : "Crear Cliente"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setNombre("");
                  setTelefono("");
                  setEmail("");
                  setDireccion("");
                  setObservaciones("");
                  setClienteEditando(null);
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

      {/* Listado de clientes */}
      <SectionCard
        title={
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Listado de Clientes
            </span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {clientesFiltrados.length} de {clientes.length} clientes
            </span>
          </div>
        }
        icon={Users}
      >
        <div className="space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute inset-y-0 left-3 my-auto text-zinc-400"
            />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {clientesFiltrados.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center text-sm text-zinc-400">
              {clientes.length === 0
                ? "Todavía no hay clientes registrados."
                : "No se encontraron clientes con esa búsqueda."}
            </p>
          ) : (
            <>
              {/* Vista tabla (desktop) */}
              <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-left text-[11px] uppercase tracking-wider text-zinc-400">
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Cliente
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Contacto
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Dirección
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Observaciones
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clientesFiltrados.map((cliente, index) => {
                      const color = coloresAvatar[index % coloresAvatar.length];

                      return (
                        <tr
                          key={cliente.id}
                          className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-left gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
                              >
                                {obtenerIniciales(cliente.nombre)}
                              </div>
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {cliente.nombre}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {cliente.email && (
                                <span className="flex items-center gap-1.5">
                                  <Mail size={12} className="text-zinc-400" />
                                  {cliente.email}
                                </span>
                              )}
                              {cliente.telefono && (
                                <span className="flex items-center gap-1.5">
                                  <Phone size={12} className="text-zinc-400" />
                                  {cliente.telefono}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 text-center">
                            {cliente.direccion && (
                              <span className="flex items-center justify-center gap-1.5">
                                <MapPin
                                  size={12}
                                  className="shrink-0 text-zinc-400"
                                />
                                {cliente.direccion}
                              </span>
                            )}
                          </td>

                          <td className="max-w-xs px-4 py-3 text-zinc-600 dark:text-zinc-300 text-center">
                            {cliente.observaciones}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditar(cliente)}
                                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                <Pencil size={12} />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEliminar(cliente.id)}
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

              {/* Vista tarjetas (mobile) */}
              <div className="grid gap-3 md:hidden">
                {clientesFiltrados.map((cliente, index) => {
                  const color = coloresAvatar[index % coloresAvatar.length];

                  return (
                    <div
                      key={cliente.id}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
                          >
                            {obtenerIniciales(cliente.nombre)}
                          </div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {cliente.nombre}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditar(cliente)}
                            title="Editar"
                            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEliminar(cliente.id)}
                            title="Eliminar"
                            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5 border-t border-zinc-200 dark:border-zinc-700/60 pt-3 text-sm text-zinc-600 dark:text-zinc-300">
                        {cliente.email && (
                          <p className="flex items-center gap-1.5">
                            <Mail size={12} className="text-zinc-400" />
                            {cliente.email}
                          </p>
                        )}
                        {cliente.telefono && (
                          <p className="flex items-center gap-1.5">
                            <Phone size={12} className="text-zinc-400" />
                            {cliente.telefono}
                          </p>
                        )}
                        {cliente.direccion && (
                          <p className="flex items-center gap-1.5">
                            <MapPin
                              size={12}
                              className="shrink-0 text-zinc-400"
                            />
                            {cliente.direccion}
                          </p>
                        )}
                        {cliente.observaciones && (
                          <p className="text-zinc-500 dark:text-zinc-400">
                            {cliente.observaciones}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

export default ClientesPage;
