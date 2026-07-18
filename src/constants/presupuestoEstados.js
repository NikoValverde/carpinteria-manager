/**
 * Estados posibles de un presupuesto.
 *
 * Centraliza los valores de estado usados en toda la aplicación
 * para evitar strings repetidos ("mágicos") en los componentes.
 *
 * `value` debe coincidir exactamente con el valor almacenado en el
 * campo `estado` (TEXT) de la tabla `presupuestos` en Supabase.
 */
export const PRESUPUESTO_ESTADOS = [
  {
    value: "Borrador",
    label: "Borrador",
    badgeClass: "bg-gray-100 text-gray-800 border border-gray-300",
    dotClass: "bg-gray-500",
  },
  {
    value: "Enviado",
    label: "Enviado",
    badgeClass: "bg-blue-100 text-blue-800 border border-blue-300",
    dotClass: "bg-blue-500",
  },
  {
    value: "Aprobado",
    label: "Aprobado",
    badgeClass: "bg-green-100 text-green-800 border border-green-300",
    dotClass: "bg-green-300",
  },
  {
    value: "En Producción",
    label: "En Producción",
    badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    dotClass: "bg-yellow-500",
  },
  {
    value: "Finalizado",
    label: "Finalizado",
    badgeClass: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    dotClass: "bg-emerald-600",
  },
  {
    value: "Rechazado",
    label: "Rechazado",
    badgeClass: "bg-red-100 text-red-800 border border-red-300",
    dotClass: "bg-red-500",
  },
  {
    value: "Cancelado",
    label: "Cancelado",
    badgeClass: "bg-slate-200 text-slate-700 border border-slate-400",
    dotClass: "bg-slate-500",
  },
];

/**
 * Devuelve el objeto de estado correspondiente a un valor dado.
 *
 * @param {string} valor - El string de estado (ej: "Aprobado").
 * @returns {{ value: string, label: string, badgeClass: string, dotClass: string }}
 *          El objeto de estado encontrado, o el estado "Borrador"
 *          por defecto si no se encuentra ninguna coincidencia.
 */
export function obtenerEstadoPresupuesto(valor) {
  const estadoEncontrado = PRESUPUESTO_ESTADOS.find(
    (estado) => estado.value === valor
  );

  if (estadoEncontrado) {
    return estadoEncontrado;
  }

  return PRESUPUESTO_ESTADOS.find((estado) => estado.value === "Borrador");
}
