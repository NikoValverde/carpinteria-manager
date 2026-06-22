import SectionCard from "../ui/SectionCard";
import { StickyNote } from "lucide-react";

function OpcionalesNotas({
  opcionales,
  setOpcionales,
  guardarOpcionales,
  precioOpcional,
  setPrecioOpcional,
  notasInternas,
  setNotasInternas,
  guardarNotasInternas,
}) {
  return (
    <SectionCard
      title={
        <div className="flex flex-col leading-tight">
          <span className="text-2xl font-bold text-zinc-100">
            Opcionales del presupuesto
          </span>
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            Información adicional del presupuesto
          </span>
        </div>
      }
      icon={StickyNote}
    >
      <div className="space-y-6">
        {/* Opcionales (textarea principal) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
            Opcionales
          </label>
          <textarea
            value={opcionales}
            onChange={(e) => setOpcionales(e.target.value)}
            onBlur={guardarOpcionales}
            className="min-h-[160px] w-full resize-none overflow-y-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Valor Opcional (input monetario) */}
        <div className="space-y-1.5 flex flex-col items-center">
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 text-center">
            Valor Opcional
          </label>
          <div className="relative w-full max-w-[180px]">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
              $
            </span>
            <input
              type="number"
              value={precioOpcional}
              onChange={(e) => setPrecioOpcional(e.target.value)}
              onBlur={guardarOpcionales}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-7 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-center"
            />
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        {/* Notas Internas */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
              NOTAS INTERNAS
            </label>
            <span className="text-[11px] italic text-zinc-400">
              No se imprime en el PDF
            </span>
          </div>
          <textarea
            value={notasInternas}
            onChange={(e) => setNotasInternas(e.target.value)}
            onBlur={guardarNotasInternas}
            className="min-h-[120px] w-full resize-none overflow-y-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>
    </SectionCard>
  );
}

export default OpcionalesNotas;
