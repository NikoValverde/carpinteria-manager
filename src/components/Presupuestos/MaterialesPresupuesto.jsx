import { useState, useRef, useEffect } from "react";
import SectionCard from "../ui/SectionCard";
import { Package, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

{/*componente para mostrar el listado de materiales y el formulario de alta/edición*/}
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
  advertenciasMaterial,
  sugerenciasMateriales,
  seleccionarMaterial,
  materialSeleccionado,
  materialesPresupuesto,
  costoMateriales,
  handleAgregarMaterial,
  handleEditarMaterial,
  handleEliminarMaterial,
}) {
  // --- Navegación con teclado para el listado de sugerencias (solo UI, no toca lógica de datos) ---
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionRefs = useRef([]);

  // Cuando cambia la lista de sugerencias (nuevo prop), ajustamos el índice
  // resaltado durante el render en vez de en un efecto, siguiendo el patrón
  // recomendado por React para "adjusting state when a prop changes".
  const [prevSugerencias, setPrevSugerencias] = useState(sugerenciasMateriales);
  if (sugerenciasMateriales !== prevSugerencias) {
    setPrevSugerencias(sugerenciasMateriales);
    setHighlightedIndex(sugerenciasMateriales.length > 0 ? 0 : -1);
  }

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionRefs.current[highlightedIndex]) {
      suggestionRefs.current[highlightedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  const handleKeyDownMaterial = (e) => {
    if (sugerenciasMateriales.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < sugerenciasMateriales.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : sugerenciasMateriales.length - 1,
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      seleccionarMaterial(sugerenciasMateriales[highlightedIndex]);
    } else if (e.key === "Escape") {
      setHighlightedIndex(-1);
    }
  };

  return (
    <SectionCard
      title={
        <span className="flex flex-col leading-tight">
          <span className="text-2xl font-bold text-zinc-100">Materiales</span>
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
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
            <div className="relative">
              <input
                type="text"
                role="combobox"
                aria-expanded={sugerenciasMateriales.length > 0}
                aria-controls="material-suggestions-listbox"
                aria-activedescendant={
                  highlightedIndex >= 0
                    ? `material-suggestion-${highlightedIndex}`
                    : undefined
                }
                autoComplete="off"
                placeholder="Nombre del material"
                value={materialNombre}
                onChange={(e) => setMaterialNombre(e.target.value)}
                onKeyDown={handleKeyDownMaterial}
                required
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />

              {/* Sugerencias de materiales: panel flotante, mismo ancho que el input */}
              {sugerenciasMateriales.length > 0 && (
                <div
                  id="material-suggestions-listbox"
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[300px] w-full overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 shadow-xl"
                >
                  {sugerenciasMateriales.map((material, index) => {
                    const isHighlighted = index === highlightedIndex;
                    return (
                      <button
                        key={material.id}
                        id={`material-suggestion-${index}`}
                        ref={(el) => (suggestionRefs.current[index] = el)}
                        type="button"
                        role="option"
                        aria-selected={isHighlighted}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => seleccionarMaterial(material)}
                        className={`mb-1 block w-full rounded-md border px-3 py-2.5 text-left transition-colors last:mb-0 ${
                          isHighlighted
                            ? "border-orange-500/50 bg-orange-500/10"
                            : "border-transparent hover:border-zinc-700 hover:bg-zinc-800/70"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className="min-w-0 flex-1 truncate font-medium text-zinc-100"
                            title={material.nombre}
                          >
                            {material.nombre}
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-orange-400">
                            ${Number(material.precio).toLocaleString("es-AR")}
                          </span>
                        </div>
                        <div className="mt-0.5 truncate text-xs text-zinc-500">
                          {material.unidad}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Advertencias */}
            {advertenciasMaterial.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {advertenciasMaterial.map((advertencia, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-lg border-l-2 border-orange-500 bg-orange-500/10 px-3 py-2 text-xs text-orange-300"
                  >
                    <AlertTriangle
                      size={14}
                      className="mt-0.5 shrink-0 text-orange-400"
                    />
                    <span>{advertencia}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Botón para crear nuevo material */}

            {materialNombre.trim() &&
              sugerenciasMateriales.length === 0 &&
              !materialSeleccionado && (
                <div className="mt-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/60 p-1.5">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-orange-400 transition-colors hover:bg-zinc-800"
                  >
                    <Plus size={14} />
                    Crear "{materialNombre}"
                  </button>
                </div>
              )}
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
              <option value="" disabled hidden>
                Unidad
              </option>

              <option value="Placas">Placas</option>
              <option value="Unidad">Unidad</option>
              <option value="Paquete">Paquete</option>
              <option value="Caja">Caja</option>
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
            <div className="hidden md:block max-h-[420px] overflow-y-auto overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-zinc-900 z-10">
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
                        $
                        {Number(material.precio_unitario).toLocaleString(
                          "es-AR",
                        )}
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
            ${Number(costoMateriales).toLocaleString("es-AR")}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

export default MaterialesPresupuesto;
