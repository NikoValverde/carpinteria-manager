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
            <p className="text-zinc-400">Analizando información...</p>
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
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-500"
          >
            Reemplazar texto
          </button>
        </div>
      </div>
    </div>
  );
}
