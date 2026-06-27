import type { PromptContext } from "../types/promptContext";
import type { PromptRequest } from "../types/promptRequest";

export function buildPrompt(context: PromptContext): PromptRequest {
  return {
    system: "SYSTEM PLACEHOLDER",
    user: "USER PLACEHOLDER",
  };
}
