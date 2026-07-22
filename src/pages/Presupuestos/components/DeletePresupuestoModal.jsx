import { AlertTriangle } from "lucide-react";

// Modal de confirmación para eliminar un presupuesto.
// Componente específico de Presupuestos (no reutilizable todavía).
function DeletePresupuestoModal({ presupuesto, isDeleting, onCancel, onConfirm }) {
  if (!presupuesto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-500">
            <AlertTriangle size={18} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Eliminar presupuesto
            </h3>

            <div className="mt-2 space-y-0.5">
              {presupuesto.numero && (
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {presupuesto.numero}
                </p>
              )}
              {presupuesto.titulo && (
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                  {presupuesto.titulo}
                </p>
              )}
            </div>

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePresupuestoModal;
