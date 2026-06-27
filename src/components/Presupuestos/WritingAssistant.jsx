import { Sparkles, Bot } from "lucide-react";
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
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [mode, setMode] = useState("improve");
  

  const handleImprove = async () => {
    try {
      setMode("improve");
      setLoading(true);
      const response = await improveText({
        textoOriginal: descripcion,
      });
      setProposal(response);
      setOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setMode("generate");

      setLoading(true);

      const proposal = await generateDescription({
        titulo: presupuesto.titulo,
        categoria: presupuesto.categoria_trabajo,
        observaciones: presupuesto.observaciones,
      });

      setProposal(proposal);

      setOpen(true);
    } catch (error) {
      console.error(error);
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
    <div className="mt-2 flex items-center gap-5">
      <button
        type="button"
        onClick={handleImprove}
        className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 transition-colors duration-200 hover:text-orange-500"
      >
        <Sparkles size={14} />
        Mejorar texto
      </button>

      <button
        type="button"
        onClick={handleGenerate}
        className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 transition-colors duration-200 hover:text-blue-400"
      >
        <Bot size={14} />
        Generar descripción
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
