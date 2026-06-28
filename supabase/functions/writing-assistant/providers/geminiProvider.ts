import type { AIProvider } from "./AIProvider.ts";
import type { ProviderResponse } from "../types/providerResponse.ts";

export class GeminiProvider implements AIProvider {
  async improveText(prompt: string): Promise<ProviderResponse> {
    return await this.generate(prompt);
  }

  async generateDescription(prompt: string): Promise<ProviderResponse> {
    return await this.generate(prompt);
  }

  private async generate(prompt: string): Promise<ProviderResponse> {
    // aquí irá la llamada a Gemini
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no configurada.");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API Error: ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return {
      text,
    };
  }
}
