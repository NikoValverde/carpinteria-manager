import { LoaderCircle } from "lucide-react";

export default function WritingAssistantModal({
  open,
  mode,
  proposal,
  loading,
  onClose,
  onReplace,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl">
        <div className="border-b border-zinc-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {mode === "improve" ? "✨ Mejorar texto" : "🤖 Generar descripción"}
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoaderCircle className="mb-4 h-8 w-8 animate-spin text-orange-500" />

              <p className="text-sm font-medium text-zinc-200">
                Analizando presupuesto...
              </p>

              <p className="mt-2 text-xs text-zinc-500">
                Esto puede tardar unos segundos.
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-zinc-200">
              {proposal}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-700 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800"
          >
            Cancelar
          </button>

          <button
            onClick={onReplace}
            disabled={loading}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reemplazar texto
          </button>
        </div>
      </div>
    </div>
  );
}
