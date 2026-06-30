import SectionCard from "../ui/SectionCard";
import WritingAssistant from "./WritingAssistant";
import { ClipboardList, Tag, User } from "lucide-react";


function DatosGenerales({
  presupuesto,
  descripcion,
  setDescripcion,
  guardarDescripcion,
  observaciones,
  setObservaciones,
  guardarObservaciones,
  materiales,
}) {


  return (
    <SectionCard
      title={
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">Datos Generales</span>

          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500/60">
            {presupuesto.numero}
          </span>
        </div>
      }
      icon={ClipboardList}
    >
      <div className="space-y-6">
        {/* Información general */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                Categoría
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2">
                <Tag size={14} className="shrink-0 text-zinc-400" />
                <input
                  type="text"
                  value={presupuesto.categoria_trabajo || ""}
                  readOnly
                  className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                Tipo
              </label>
              <input
                type="text"
                value={presupuesto.tipo_trabajo || ""}
                readOnly
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
              Título del Trabajo
            </label>
            <input
              type="text"
              value={presupuesto.titulo || ""}
              readOnly
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-[3fr_1fr] gap-6">
            {/* CLIENTE */}
            <div className="space-y-2">
              <label className="block text-center text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                Cliente
              </label>

              <div className="flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2">
                <User size={14} className="shrink-0 text-zinc-400" />

                <input
                  type="text"
                  value={presupuesto.clientes?.nombre || ""}
                  readOnly
                  className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            {/* ESTADO */}
            <div className="space-y-2">
              <label className="block text-center text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                Estado
              </label>

              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  {presupuesto.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        {/* Detalles de Construcción - ancho completo */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
            Detalles de Construcción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            onBlur={guardarDescripcion}
            placeholder="Describa el trabajo a realizar..."
            className="min-h-[320px] w-full resize-none overflow-y-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <WritingAssistant
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            presupuesto={presupuesto}
            materiales={materiales}
          />
        </div>

        {/* Observaciones - debajo de Detalles, ancho completo */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            onBlur={guardarObservaciones}
            className="min-h-[140px] w-full resize-none overflow-y-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>
    </SectionCard>
  );
}

export default DatosGenerales;
