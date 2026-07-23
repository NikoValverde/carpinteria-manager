import { useState } from "react";
import { Layers, Plus } from "lucide-react";

import SectionCard from "../ui/SectionCard";
import AlternativaCard from "./AlternativaCard";
import AlternativaModal from "./AlternativaModal";

import {
  crearAlternativa,
  actualizarAlternativa,
  eliminarAlternativa,
} from "../../services/alternativasService";

import { calcularResumenFinanciero } from "../../domain/presupuesto/finanzas";

function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-AR")}`;
}

export default function AlternativasPresupuesto({
  presupuestoId,
  alternativas,
  setAlternativas,
  precioFinal,
  descuentoTipo,
  descuentoValor,
}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [alternativaEditando, setAlternativaEditando] = useState(null);

  function handleNuevaAlternativa() {
    setAlternativaEditando(null);
    setModalAbierto(true);
  }

  function handleEditarAlternativa(alternativa) {
    setAlternativaEditando(alternativa);
    setModalAbierto(true);
  }

  async function handleEliminarAlternativa(alternativa) {
    const confirmado = confirm("¿Seguro que querés eliminar esta alternativa?");

    if (!confirmado) return;

    try {
      await eliminarAlternativa(alternativa.id);

      setAlternativas((prev) =>
        prev.filter((item) => item.id !== alternativa.id),
      );
    } catch (error) {
      console.error(error);
    }
  }

  function handleCerrarModal() {
    setModalAbierto(false);
    setAlternativaEditando(null);
  }

  // El descuento pertenece al presupuesto, no a la alternativa: se reutiliza
  // el mismo dominio financiero para no reimplementar la fórmula acá.
  // SUMA -> el precio de la alternativa se suma al Precio Final.
  // TOTAL -> el precio de la alternativa reemplaza al Precio Final.
  function calcularTotalAlternativa(alternativa) {
    const precioFinalAlternativa =
      alternativa.tipo_precio === "SUMA"
        ? Number(precioFinal || 0) + Number(alternativa.precio || 0)
        : Number(alternativa.precio || 0);

    const { precioFinalConDescuento } = calcularResumenFinanciero({
      costoMateriales: 0,
      costoManoObra: 0,
      consumiblesImprevistos: 0,
      porcentajeGanancia: 0,
      flete: 0,
      precioFinal: precioFinalAlternativa,
      descuentoTipo,
      descuentoValor,
    });

    return precioFinalConDescuento;
  }

  async function handleGuardarAlternativa(datosFormulario) {
    try {
      if (alternativaEditando) {
        const actualizada = await actualizarAlternativa(
          alternativaEditando.id,
          datosFormulario,
        );

        setAlternativas((prev) =>
          prev.map((item) =>
            item.id === alternativaEditando.id ? actualizada : item,
          ),
        );
      } else {
        const nueva = await crearAlternativa({
          ...datosFormulario,
          presupuesto_id: presupuestoId,
          orden: alternativas.length + 1,
        });

        setAlternativas((prev) => [...prev, nueva]);
      }

      handleCerrarModal();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SectionCard
      title={
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-col leading-tight">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Alternativas de Trabajo
            </h2>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {alternativas.length}{" "}
              {alternativas.length === 1
                ? "alternativa registrada"
                : "alternativas registradas"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleNuevaAlternativa}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 shrink-0"
          >
            <Plus size={16} />
            Nueva alternativa
          </button>
        </div>
      }
      icon={Layers}
    >
      {alternativas.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Todavía no hay alternativas para este presupuesto.
        </p>
      ) : (
        <div className="space-y-3">
          {alternativas.map((alternativa) => (
            <div key={alternativa.id} className="space-y-2">
              <AlternativaCard
                alternativa={alternativa}
                onEditar={handleEditarAlternativa}
                onEliminar={handleEliminarAlternativa}
              />

              <div className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Total a cobrar con esta alternativa
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatoMoneda(calcularTotalAlternativa(alternativa))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlternativaModal
        abierto={modalAbierto}
        alternativa={alternativaEditando}
        onCancelar={handleCerrarModal}
        onGuardar={handleGuardarAlternativa}
      />
    </SectionCard>
  );
}
