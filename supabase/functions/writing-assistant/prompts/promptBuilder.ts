import { systemPrompt } from "./systemPrompt";
import { styleGuide } from "./styleGuide";
import { improvePrompt } from "./improvePrompt";
import { generatePrompt } from "./generatePrompt";

import type { PromptContext } from "../types/promptContext";
import type { PromptRequest } from "../types/promptRequest";

export function buildPrompt(context: PromptContext): PromptRequest {
  switch (context.mode) {
    case "improve":
      return {
        system: [systemPrompt, styleGuide, improvePrompt].join("\n\n"),

        user: context.textoOriginal ?? "",
      };

    case "generate":
      return {
        system: [systemPrompt, styleGuide, generatePrompt].join("\n\n"),

        user: JSON.stringify(context, null, 2),
      };

    default:
      throw new Error(`Modo no soportado: ${context.mode}`);
  }
}
