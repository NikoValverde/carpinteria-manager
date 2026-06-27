import { AIProvider } from "./aiProvider.ts";

export class GeminiProvider implements AIProvider {
  async improveText(prompt: string): Promise<string> {
    throw new Error("Not implemented.");
  }

  async generateDescription(prompt: string): Promise<string> {
    throw new Error("Not implemented.");
  }
}
