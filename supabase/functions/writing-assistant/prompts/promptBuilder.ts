import { systemPrompt } from "./systemPrompt.ts";
import { styleGuide } from "./styleGuide.ts";
import { improvePrompt } from "./improvePrompt.ts";
import { generatePrompt } from "./generatePrompt.ts";

import type { PromptContext } from "../types/promptContext.ts";
import type { PromptRequest } from "../types/promptRequest.ts";

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
