import SectionCard from "../ui/SectionCard";
import { Package, Plus, Pencil, Trash2 } from "lucide-react";

function MaterialesPresupuesto({
  materialNombre,
  setMaterialNombre,
  unidad,
  setUnidad,
  cantidad,
  setCantidad,
  precioUnitario,
  setPrecioUnitario,
  materialEditando,
  setMaterialEditando /* Agregado para permitir editar materiales */,
  materialesPresupuesto,
  costoMateriales,
  handleAgregarMaterial,
  handleEditarMaterial,
  handleEliminarMaterial,
}) {
  return (
    <SectionCard
      title={
        <span className="flex flex-col leading-tight">
          <span>Materiales</span>
          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
            {materialesPresupuesto.length}{" "}
            {materialesPresupuesto.length === 1 ? "ítem" : "ítems"} cargados
          </span>
        </span>
      }
      icon={Package}
    >
      <div className="space-y-6">
        {/* Formulario de alta / edición */}
        <form
          onSubmit={handleAgregarMaterial}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div className="min-w-[160px] flex-1 space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Material
            </label>
            <input
              type="text"
              placeholder="Nombre del material"
              value={materialNombre}
              onChange={(e) => setMaterialNombre(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="w-full space-y-1 sm:w-36">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Unidad
            </label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <option value="">Unidad</option>

              <option value="Placa">Placa</option>
              <option value="Unidad">Unidad</option>
              <option value="Barra 6m">Barra 6m</option>
              <option value="Metro">Metro</option>
              <option value="m²">m²</option>
              <option value="Litro">Litro</option>
              <option value="Kg">Kg</option>
            </select>
          </div>

          <div className="w-full space-y-1 sm:w-28">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Cantidad
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="w-full space-y-1 sm:w-36">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Precio Unitario
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="Precio Unitario"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-7 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              {materialEditando ? <Pencil size={14} /> : <Plus size={14} />}
              {materialEditando ? "Guardar Cambios" : "Agregar Material"}
            </button>

            {materialEditando && (
              <button
                type="button"
                onClick={() => {
                  setMaterialEditando(null);
                  setMaterialNombre("");
                  setUnidad("");
                  setCantidad("");
                  setPrecioUnitario("");
                }}
                className="whitespace-nowrap rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Listado de materiales */}
        {materialesPresupuesto.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-8 text-center text-sm text-zinc-400">
            Todavía no hay materiales cargados.
          </p>
        ) : (
          <>
            {/* Vista tabla (desktop) */}
            <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-left text-[11px] uppercase tracking-wider text-zinc-400">
                    <th className="px-4 py-2.5 font-semibold">Material</th>
                    <th className="px-4 py-2.5 font-semibold">Cantidad</th>
                    <th className="px-4 py-2.5 text-right font-semibold">
                      P. Unitario
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
                  {materialesPresupuesto.map((material) => (
                    <tr
                      key={material.id}
                      className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {material.material_nombre}
                      </td>

                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {material.cantidad}{" "}
                        <span className="text-zinc-400 dark:text-zinc-500">
                          {material.unidad}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-300">
                        ${Number(material.precio_unitario).toLocaleString("es-AR")}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                        ${Number(material.subtotal).toLocaleString("es-AR")}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditarMaterial(material)}
                            title="Editar"
                            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEliminarMaterial(material.id)}
                            title="Eliminar"
                            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista tarjetas (mobile) */}
            <div className="grid gap-3 md:hidden">
              {materialesPresupuesto.map((material) => (
                <div
                  key={material.id}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {material.material_nombre}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {material.cantidad} {material.unidad}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditarMaterial(material)}
                        title="Editar"
                        className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEliminarMaterial(material.id)}
                        title="Eliminar"
                        className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700/60 pt-3 text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      P. Unitario: $
                      {Number(material.precio_unitario).toLocaleString("es-AR")}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      ${Number(material.subtotal).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Total Materiales destacado */}
        <div className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total Materiales
          </span>
          <span className="text-lg font-bold text-orange-500">
            ${costoMateriales.toLocaleString("es-AR")}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

export default MaterialesPresupuesto;
