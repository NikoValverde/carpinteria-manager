import SectionCard from "../ui/SectionCard";
import { HardHat, Plus, Trash2 } from "lucide-react";

// Paleta cíclica puramente visual para diferenciar integrantes (avatar + barra de proporción).
// No depende de ningún dato de negocio, solo del índice de la fila.
const coloresAvatar = [
  { bg: "bg-orange-500/15", text: "text-orange-500", bar: "bg-orange-500" },
  { bg: "bg-violet-500/15", text: "text-violet-500", bar: "bg-violet-500" },
  { bg: "bg-emerald-500/15", text: "text-emerald-500", bar: "bg-emerald-500" },
];

function obtenerIniciales(nombre) {
  if (!nombre) return "";
  const partes = nombre.trim().split(" ").filter(Boolean);
  const primera = partes[0]?.[0] || "";
  const segunda = partes[1]?.[0] || "";
  return `${primera}${segunda}`.toUpperCase();
}

function ManoObraPresupuesto({
  integrantes,
  integranteId,
  setIntegranteId,
  dias,
  setDias,
  manoObraPresupuesto,
  costoManoObra,
  handleAgregarManoObra,
  handleEliminarManoObra,
}) {
  return (
    <SectionCard
      title={
        <span className="flex flex-col leading-tight">
          <span>Mano de Obra</span>
          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
            {manoObraPresupuesto.length}{" "}
            {manoObraPresupuesto.length === 1 ? "integrante" : "integrantes"}
          </span>
        </span>
      }
      icon={HardHat}
    >
      <div className="space-y-6">
        {/* Formulario de alta */}
        <form
          onSubmit={handleAgregarManoObra}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div className="min-w-[200px] flex-1 space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Integrante
            </label>
            <select
              value={integranteId}
              onChange={(e) => setIntegranteId(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            >
              <option value="">Seleccionar integrante</option>
              <option value="todos">Todos</option>

              {integrantes.map((integrante) => (
                <option key={integrante.id} value={integrante.id}>
                  {integrante.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full space-y-1 sm:w-28">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Días
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="Días"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
          >
            <Plus size={14} />
            Agregar Mano de Obra
          </button>
        </form>

        {/* Listado */}
        {manoObraPresupuesto.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center text-sm text-zinc-400">
            Todavía no hay mano de obra cargada.
          </p>
        ) : (
          <>
            {/* Vista tabla (desktop) */}
            <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-left text-[11px] uppercase tracking-wider text-zinc-400">
                    <th className="px-4 py-2.5 font-semibold">Integrante</th>
                    <th className="px-4 py-2.5 text-right font-semibold">
                      Días
                    </th>
                    <th className="px-4 py-2.5 text-right font-semibold">
                      $/Día
                    </th>
                    <th className="px-4 py-2.5 text-right font-semibold">
                      Subtotal
                    </th>
                    <th className="px-4 py-2.5 text-right font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {manoObraPresupuesto.map((item, index) => {
                    const color = coloresAvatar[index % coloresAvatar.length];
                    const porcentaje =
                      costoManoObra > 0
                        ? (Number(item.subtotal) / costoManoObra) * 100
                        : 0;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
                            >
                              {obtenerIniciales(item.integrante_nombre)}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {item.integrante_nombre}
                              </p>
                              <div className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                <div
                                  className={`h-full ${color.bar}`}
                                  style={{ width: `${porcentaje}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-300">
                          {item.dias}
                        </td>

                        <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-300">
                          ${Number(item.jornal_utilizado || 0).toLocaleString(
                            "es-AR",
                          )}
                        </td>

                        <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                          ${Number(item.subtotal).toLocaleString("es-AR")}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleEliminarManoObra(item.id)}
                            title="Eliminar"
                            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Vista tarjetas (mobile) */}
            <div className="grid gap-3 md:hidden">
              {manoObraPresupuesto.map((item, index) => {
                const color = coloresAvatar[index % coloresAvatar.length];
                const porcentaje =
                  costoManoObra > 0
                    ? (Number(item.subtotal) / costoManoObra) * 100
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
                        >
                          {obtenerIniciales(item.integrante_nombre)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {item.integrante_nombre}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {item.dias} días
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEliminarManoObra(item.id)}
                        title="Eliminar"
                        className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className={`h-full ${color.bar}`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700/60 pt-3 text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        $/Día: $
                        {Number(item.jornal_utilizado || 0).toLocaleString(
                          "es-AR",
                        )}
                      </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        ${Number(item.subtotal).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Total Mano de Obra destacado */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2 rounded-lg border border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20 px-4 py-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Total Mano de Obra
            </span>
            <span className="text-base font-bold text-violet-600 dark:text-violet-400">
              ${costoManoObra.toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default ManoObraPresupuesto;
