import { useEffect, useState } from "react";
import {
  obtenerIntegrantes,
  crearIntegrante,
  eliminarIntegrante,
  actualizarIntegrante,
} from "../../services/integrantesService";
import { useAuth } from "../../hooks/useAuth";
import SectionCard from "../../components/ui/SectionCard";
import { HardHat, UserPlus, Plus, Pencil, Clock, Trash2 } from "lucide-react";

// Paleta cíclica puramente visual para diferenciar integrantes (avatar + barra de %).
// No depende de ningún dato de negocio, solo del índice de la fila.
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

function IntegrantesPage() {
  const [integrantes, setIntegrantes] = useState([]);
  const [integranteEditando, setIntegranteEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [jornalActual, setJornalActual] = useState("");
  const [activo, setActivo] = useState(true);

  // Estado nuevo, puramente de UI (no toca Supabase ni el CRUD existente):
  // controla si se ve el panel de alta/edición.
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const { perfil } = useAuth();
  const usuarioNombre = perfil?.nombre || "Administrador";

  async function cargarIntegrantes() {
    try {
      const data = await obtenerIntegrantes();
      setIntegrantes(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await cargarIntegrantes();
    };

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (integranteEditando) {
        await actualizarIntegrante(integranteEditando.id, {
          nombre,
          porcentaje,
          jornal_actual: jornalActual,
          activo,
        });
      } else {
        await crearIntegrante({
          nombre,
          porcentaje,
          jornal_actual: jornalActual,
          activo,
        });
      }

      setNombre("");
      setPorcentaje("");
      setJornalActual("");
      setActivo(true);
      setIntegranteEditando(null);

      await cargarIntegrantes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Desea eliminar este integrante?");

    if (!confirmar) return;

    try {
      await eliminarIntegrante(id);

      await cargarIntegrantes();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditar(integrante) {
    setIntegranteEditando(integrante);

    setNombre(integrante.nombre || "");
    setPorcentaje(integrante.porcentaje || "");
    setJornalActual(integrante.jornal_actual || "");
    setActivo(integrante.activo);
  }

  // Derivados de presentación únicamente: no modifican integrantes ni ningún estado existente,
  // ni agregan reglas de negocio (son sólo conteos/promedios para mostrar en pantalla).
  const formularioVisible = mostrarFormulario || integranteEditando !== null;

  const integrantesActivos = integrantes.filter((i) => i.activo);

  const jornalPromedio =
    integrantes.length > 0
      ? integrantes.reduce((acc, i) => acc + Number(i.jornal_actual || 0), 0) /
        integrantes.length
      : 0;

  // "Última actualización" muestra el momento en que se renderizó la página
  // (no hay un campo de fecha de modificación en los datos de integrante),
  // junto con el usuario logueado provisto por useAuth.
  const fechaActualizacion = new Date().toLocaleDateString("es-AR");

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Integrantes
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {integrantes.length}{" "}
            {integrantes.length === 1 ? "integrante" : "integrantes"} ·{" "}
            {integrantesActivos.length} activos
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
        >
          <Plus size={16} />
          Crear Integrante
        </button>
      </div>

      {/* Formulario de alta / edición */}
      {formularioVisible && (
        <SectionCard
          title={
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {integranteEditando ? "Editar Integrante" : "Nuevo Integrante"}
              </span>
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                Completá los datos del integrante
              </span>
            </div>
          }
          icon={UserPlus}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
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
                  Porcentaje
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Porcentaje"
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(e.target.value)}
                    min="0"
                    max="100"
                    required
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-3 pr-8 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-zinc-400">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Jornal
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Jornal"
                    value={jornalActual}
                    onChange={(e) => setJornalActual(e.target.value)}
                    min="0"
                    required
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-7 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 accent-orange-500"
                  />
                  Activo
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
              >
                {integranteEditando ? <Pencil size={14} /> : <Plus size={14} />}
                {integranteEditando ? "Guardar Cambios" : "Crear Integrante"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setNombre("");
                  setPorcentaje("");
                  setJornalActual("");
                  setActivo(true);
                  setIntegranteEditando(null);
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

      {/* Listado de integrantes */}
      <SectionCard
        title={
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Equipo de Trabajo
            </span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {integrantes.length}{" "}
              {integrantes.length === 1 ? "integrante" : "integrantes"}
            </span>
          </div>
        }
        icon={HardHat}
      >
        <div className="space-y-4">
          {integrantes.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center text-sm text-zinc-400">
              Todavía no hay integrantes registrados.
            </p>
          ) : (
            <>
              {/* Vista tabla (desktop) - con scroll interno cuando supera la altura */}
              <div className="hidden max-h-[480px] overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-left text-[11px] uppercase tracking-wider text-zinc-400 backdrop-blur">
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Integrante
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Porcentaje
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Jornal / Día
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Estado
                      </th>
                      <th className="px-4 py-2.5 font-semibold text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {integrantes.map((integrante, index) => {
                      const color = coloresAvatar[index % coloresAvatar.length];
                      const porcentajeValor = Number(
                        integrante.porcentaje || 0,
                      );

                      return (
                        <tr
                          key={integrante.id}
                          className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
                              >
                                {obtenerIniciales(integrante.nombre)}
                              </div>
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {integrante.nombre}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`font-bold ${color.text}`}>
                                {porcentajeValor}%
                              </span>
                              <div className="h-1 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                <div
                                  className={`h-full ${color.bar}`}
                                  style={{ width: `${porcentajeValor}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-center font-semibold text-zinc-900 dark:text-zinc-100">
                            $
                            {Number(
                              integrante.jornal_actual || 0,
                            ).toLocaleString("es-AR")}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                integrante.activo
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : "bg-zinc-500/15 text-zinc-400"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  integrante.activo
                                    ? "bg-emerald-400"
                                    : "bg-zinc-400"
                                }`}
                              />
                              {integrante.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditar(integrante)}
                                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                <Pencil size={12} />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEliminar(integrante.id)}
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

              {/* Vista tarjetas (mobile) - con scroll interno cuando supera la altura */}
              <div className="grid max-h-[600px] gap-3 overflow-y-auto md:hidden">
                {integrantes.map((integrante, index) => {
                  const color = coloresAvatar[index % coloresAvatar.length];
                  const porcentajeValor = Number(integrante.porcentaje || 0);

                  return (
                    <div
                      key={integrante.id}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
                          >
                            {obtenerIniciales(integrante.nombre)}
                          </div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {integrante.nombre}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            integrante.activo
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-zinc-500/15 text-zinc-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              integrante.activo
                                ? "bg-emerald-400"
                                : "bg-zinc-400"
                            }`}
                          />
                          {integrante.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            % Porcentaje
                          </p>
                          <p className={`text-lg font-bold ${color.text}`}>
                            {porcentajeValor}%
                          </p>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                            <div
                              className={`h-full ${color.bar}`}
                              style={{ width: `${porcentajeValor}%` }}
                            />
                          </div>
                        </div>

                        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            $ Precio / Día
                          </p>
                          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            $
                            {Number(
                              integrante.jornal_actual || 0,
                            ).toLocaleString("es-AR")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-zinc-700/60 pt-3">
                        <button
                          type="button"
                          onClick={() => handleEditar(integrante)}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEliminar(integrante.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-300 dark:border-red-900 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 size={12} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen inferior */}
              <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {integrantes.length}{" "}
                  {integrantes.length === 1 ? "integrante" : "integrantes"} ·{" "}
                  Jornal promedio:{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    $
                    {jornalPromedio.toLocaleString("es-AR", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </span>

                <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 sm:justify-end">
                  <Clock size={12} className="text-zinc-400" />
                  Última actualización: {fechaActualizacion} · por{" "}
                  {usuarioNombre}
                </span>
              </div>

              {/* Resumen inferior (mobile) */}
              <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 px-1 pt-3 text-sm sm:hidden">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {integrantes.length}{" "}
                  {integrantes.length === 1 ? "integrante" : "integrantes"} ·{" "}
                  Jornal promedio:{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    $
                    {jornalPromedio.toLocaleString("es-AR", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </span>
                <span className="text-xs text-zinc-400">
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

export default IntegrantesPage;
