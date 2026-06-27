export type PromptMode = "improve" | "generate";

export interface PromptContext {
  mode: PromptMode;

  titulo?: string;
  categoria?: string;

  materiales?: string[];
  observaciones?: string;

  textoOriginal?: string;
}
