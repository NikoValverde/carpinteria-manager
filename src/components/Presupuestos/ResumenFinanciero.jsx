import SectionCard from "../ui/SectionCard";
import { Calculator, Truck, Percent, Layers, Copy, AlertTriangle } from "lucide-react";

function redondear(valor, multiplo) {
  return Math.ceil(valor / multiplo) * multiplo;
}
function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-AR")}`;
}

function ResumenFinanciero({
  consumiblesImprevistos,
  setConsumiblesImprevistos,
  costoMateriales,
  costoManoObra,
  costoTotal,
  porcentajeGanancia,
  setPorcentajeGanancia,
  montoGanancia,
  flete,
  setFlete,
  precioTrabajo,
  precioFinal,
  setPrecioFinal,
  precioDesactualizado,
  diferenciaPrecio,
  totalConOpcional,
  guardarResumenFinanciero,
  aplicarPrecioFinal,
}) {
  // Proporciones visuales de la barra de distribución de costos.
  // Es un valor puramente de presentación derivado de los props existentes;
  // no reemplaza ni altera ninguno de los cálculos de negocio originales.
  const baseDistribucion = costoMateriales + costoManoObra + Number(flete || 0);
  const pctMateriales =
    baseDistribucion > 0 ? (costoMateriales / baseDistribucion) * 100 : 0;
  const pctManoObra =
    baseDistribucion > 0 ? (costoManoObra / baseDistribucion) * 100 : 0;
  const pctFlete =
    baseDistribucion > 0 ? (Number(flete || 0) / baseDistribucion) * 100 : 0;

  return (
    <SectionCard
      title={
        <span className="flex flex-col leading-tight">
          <span>Resumen Financiero</span>
          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
            Cálculo automático
          </span>
        </span>
      }
      icon={Calculator}
    >
      <div className="space-y-6">
        {/* Desglose de costos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Costo Materiales
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {formatoMoneda(costoMateriales)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Costo Mano de Obra
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {formatoMoneda(costoManoObra)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-zinc-400" />
              Flete / Traslado
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {formatoMoneda(flete)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Subtotal Costos
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {formatoMoneda(costoTotal)}
            </span>
          </div>

          {/* Barra de distribución (Mat. / M.O. / Flete) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="bg-orange-500"
                style={{ width: `${pctMateriales}%` }}
              />
              <div
                className="bg-violet-500"
                style={{ width: `${pctManoObra}%` }}
              />
              <div className="bg-zinc-400" style={{ width: `${pctFlete}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Mat. {pctMateriales.toFixed(0)}%</span>
              <span>M.O. {pctManoObra.toFixed(0)}%</span>
              <span>Flete {pctFlete.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Consumibles / Imprevistos */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            <Layers size={12} />
            Consumibles / Imprevistos
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
              $
            </span>
            <input
              type="number"
              value={consumiblesImprevistos}
              onChange={(e) => setConsumiblesImprevistos(e.target.value)}
              onBlur={guardarResumenFinanciero}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-7 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Flete / Traslado */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            <Truck size={12} />
            Flete / Traslado
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
              $
            </span>
            <input
              type="number"
              value={flete}
              onChange={(e) => setFlete(e.target.value)}
              onBlur={guardarResumenFinanciero}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-7 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Ganancia % */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <Percent size={12} />
              Ganancia
            </label>
            <span className="text-sm font-bold text-orange-500">
              {Number(porcentajeGanancia || 0)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={porcentajeGanancia}
            onChange={(e) => setPorcentajeGanancia(e.target.value)}
            onBlur={guardarResumenFinanciero}
            className="w-full cursor-pointer accent-orange-500"
          />

          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>0%</span>
            <span>100%</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Ganancia estimada
            </span>
            <span className="text-sm font-semibold text-emerald-500">
              {formatoMoneda(montoGanancia)}
            </span>
          </div>
        </div>

        {/* Precio Trabajo destacado */}
        <div className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-4 py-3">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Precio Trabajo
          </span>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {formatoMoneda(precioTrabajo)}
          </span>
        </div>

        {/* Ajustes rápidos */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Ajustes rápidos
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                aplicarPrecioFinal(redondear(precioTrabajo, 10000))
              }
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Redondear a $10.000
            </button>

            <button
              type="button"
              onClick={() =>
                aplicarPrecioFinal(redondear(precioTrabajo, 50000))
              }
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Redondear a $50.000
            </button>

            <button
              type="button"
              onClick={() =>
                aplicarPrecioFinal(redondear(precioTrabajo, 100000))
              }
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Redondear a $100.000
            </button>

            <button
              type="button"
              onClick={() => aplicarPrecioFinal(Math.round(precioTrabajo))}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Copy size={12} />
              Copiar sugerido
            </button>
          </div>
        </div>

        {/* Precio Final */}
        <div className="space-y-2 pt-1">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
            Precio Final
          </p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">
              Precio sugerido
            </span>
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              {formatoMoneda(precioTrabajo)}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border-2 border-orange-300 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20 px-4 py-3">
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              $
            </span>
            <input
              type="text"
              value={
                precioFinal
                  ? new Intl.NumberFormat("es-ES").format(precioFinal)
                  : ""
              }
              onChange={(e) => {
                const valorLimpio = e.target.value
                  .replace(/\./g, "")
                  .replace(/[^0-9]/g, "");
                setPrecioFinal(valorLimpio);
              }}
              onBlur={guardarResumenFinanciero}
              className="w-full bg-transparent text-3xl font-bold text-orange-600 dark:text-orange-400 outline-none"
            />
          </div>
        </div>

        {/* Advertencia: precio desactualizado */}
        {precioDesactualizado && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20 p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-500"
            />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                El Precio Final fue modificado o quedó desactualizado.
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-500">
                Diferencia: {diferenciaPrecio > 0 ? "+" : "-"}$
                {Math.abs(diferenciaPrecio).toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        )}

        {/* Total con Opcional */}
        {totalConOpcional > Number(precioFinal || 0) && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-4 py-3">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Total con Opcional
            </span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {formatoMoneda(totalConOpcional)}
            </span>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default ResumenFinanciero;
