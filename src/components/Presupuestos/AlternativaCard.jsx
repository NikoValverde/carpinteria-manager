import { Pencil, Trash2 } from "lucide-react";

function formatearPrecio(valor) {
  if (!valor && valor !== 0) return "$0";
  return new Intl.NumberFormat("es-ES").format(valor);
}

export default function AlternativaCard({ alternativa, onEditar, onEliminar }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">
          {alternativa.titulo}
        </p>

        {alternativa.descripcion && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {alternativa.descripcion}
          </p>
        )}

        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2">
          ${formatearPrecio(alternativa.precio)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onEditar(alternativa)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label="Editar alternativa"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => onEliminar(alternativa)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
          aria-label="Eliminar alternativa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
