export type PromptMode = "improve" | "generate";

export interface MaterialIA {
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface PromptContext {
  mode: "improve" | "generate";

  titulo?: string;
  categoria?: string;
  observaciones?: string;

  materiales?: MaterialIA[];

  textoOriginal?: string;
}
