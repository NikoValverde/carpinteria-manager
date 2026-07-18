import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { obtenerEstadoPresupuesto } from "../../constants/presupuestoEstados";

/**
 * Dropdown personalizado para seleccionar el estado del presupuesto.
 * Reutilizable y con estilo consistente con el tema oscuro del SaaS.
 * Usa `obtenerEstadoPresupuesto` como única fuente de labels y colores.
 */
function EstadoDropdown({ presupuesto, estadosDisponibles, onCambiarEstado }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const estadoActual = obtenerEstadoPresupuesto(presupuesto.estado);

  useEffect(() => {
    function handleClickFuera(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  function handleSeleccionar(valor) {
    setIsOpen(false);
    onCambiarEstado?.(valor);
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium outline-none transition-colors focus:ring-1 focus:ring-orange-500 ${estadoActual.badgeClass}`}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${estadoActual.dotClass}`}
        />
        {estadoActual.label}
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 z-20 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg shadow-black/30">
          {(estadosDisponibles || []).map((estado) => (
            <button
              key={estado.value}
              type="button"
              onClick={() => handleSeleccionar(estado.value)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-100 transition-colors hover:bg-zinc-700"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${estado.dotClass}`}
              />
              {estado.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default EstadoDropdown;
