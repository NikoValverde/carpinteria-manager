import { useState, useEffect } from "react";

export default function AlternativaModal({ abierto, alternativa, onCancelar, onGuardar }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipoPrecio, setTipoPrecio] = useState("SUMA");

  useEffect(() => {
    setTitulo(alternativa?.titulo || "");
    setDescripcion(alternativa?.descripcion || "");
    setPrecio(alternativa?.precio ?? "");
    setTipoPrecio(alternativa?.tipo_precio || "SUMA");
  }, [alternativa, abierto]);

  if (!abierto) return null;

  function handleGuardar() {
    onGuardar({
      titulo,
      descripcion,
      precio,
      tipo_precio: tipoPrecio,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          {alternativa ? "Editar alternativa" : "Nueva alternativa"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Título de la alternativa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Descripción de la alternativa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Precio Alternativa
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                $
              </span>
              <input
                type="text"
                value={
                  precio ? new Intl.NumberFormat("es-ES").format(precio) : ""
                }
                onChange={(e) => {
                  const valorLimpio = e.target.value
                    .replace(/\./g, "")
                    .replace(/[^0-9]/g, "");
                  setPrecio(valorLimpio ? Number(valorLimpio) : 0);
                }}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent pl-7 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ingrese el precio de la alternativa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Tipo de precio
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <input
                  type="radio"
                  name="tipoPrecio"
                  value="SUMA"
                  checked={tipoPrecio === "SUMA"}
                  onChange={(e) => setTipoPrecio(e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                Se suma al Precio Final
              </label>

              <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <input
                  type="radio"
                  name="tipoPrecio"
                  value="TOTAL"
                  checked={tipoPrecio === "TOTAL"}
                  onChange={(e) => setTipoPrecio(e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                Alternativa al Precio Final
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleGuardar}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
