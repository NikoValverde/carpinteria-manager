import { Sparkles, Bot, ChevronRight } from "lucide-react";
import {
  improveText,
  generateDescription,
} from "../../services/writingAssistantService";
import WritingAssistantModal from "./WritingAssistantModal";
import { useState } from "react";

export default function WritingAssistant({
  descripcion,
  presupuesto,
  setDescripcion,
  materiales,
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [mode, setMode] = useState("improve");
  

  const handleImprove = async () => {
    try {
      const texto = descripcion.trim();

      if (!texto) {
        alert("No hay texto para mejorar.");
        return;
      }

      if (texto.length < 15) {
        alert("El texto es demasiado corto para mejorarlo.");
        return;
      }

      setMode("improve");

      setProposal("");

      setLoading(true);

      setOpen(true);

      const proposal = await improveText({
        textoOriginal: descripcion,
      });

      setProposal(proposal);
    } catch (error) {
      setOpen(false);

      alert(error.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      if (!presupuesto.titulo?.trim()) {
        alert("El presupuesto debe tener un título.");
        return;
      }

      if (!presupuesto.categoria_trabajo?.trim()) {
        alert("Debe seleccionar una categoría de trabajo.");
        return;
      }

      setMode("generate");

      setProposal("");

      setLoading(true);

      setOpen(true);

      const materialesIA = materiales.map((material) => ({
        nombre: material.material_nombre,
        cantidad: material.cantidad,
        unidad: material.unidad,
      }));

      const proposal = await generateDescription({
        titulo: presupuesto.titulo,
        categoria: presupuesto.categoria_trabajo,
        observaciones: presupuesto.observaciones,
        materiales: materialesIA,
      });

      setProposal(proposal);
    } catch (error) {
      console.error(error);

      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = () => {
    setDescripcion(proposal);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        disabled={!descripcion.trim() || loading}
        onClick={handleImprove}
        className="group flex h-[88px] items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-zinc-900 hover:shadow-lg hover:shadow-orange-500/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-zinc-800 disabled:hover:shadow-none"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 transition-colors duration-200 group-hover:bg-orange-500/15">
          <Sparkles size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-100">Mejorar texto</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Corrige y mejora la redacción.
          </p>
        </div>

        <ChevronRight
          size={18}
          className="shrink-0 text-zinc-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-orange-500"
        />
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={handleGenerate}
        className="group flex h-[88px] items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-zinc-900 hover:shadow-lg hover:shadow-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-zinc-800 disabled:hover:shadow-none"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-colors duration-200 group-hover:bg-blue-500/15">
          <Bot size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-100">Generar descripción</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Crea una descripción técnica.
          </p>
        </div>

        <ChevronRight
          size={18}
          className="shrink-0 text-zinc-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-blue-400"
        />
      </button>

      <WritingAssistantModal
        open={open}
        mode={mode}
        proposal={proposal}
        loading={loading}
        onClose={handleClose}
        onReplace={handleReplace}
      />
    </div>
  );
}
