import type { ProviderResponse } from "../types/providerResponse.ts";

export interface AIProvider {
  improveText(prompt: string): Promise<ProviderResponse>;

  generateDescription(prompt: string): Promise<ProviderResponse>;
}
