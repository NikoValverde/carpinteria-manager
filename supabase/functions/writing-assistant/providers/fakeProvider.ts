import type { AIProvider } from "./aiProvider.ts";
import type { ProviderResponse } from "../types/providerResponse.ts";

export class FakeProvider implements AIProvider {
  async improveText(prompt: string): Promise<ProviderResponse> {
    return {
      text: [
        "===== FAKE PROVIDER =====",
        "",
        "Modo: Mejorar texto",
        "",
        prompt,
      ].join("\n"),
    };
  }

  async generateDescription(prompt: string): Promise<ProviderResponse> {
    return {
      text: [
        "===== FAKE PROVIDER =====",
        "",
        "Modo: Generar descripción",
        "",
        prompt,
      ].join("\n"),
    };
  }
}
