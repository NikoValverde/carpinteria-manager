/**
 * FakeProvider
 *
 * Implementación simulada utilizada para desarrollar y probar
 * el flujo completo del Asistente de Redacción sin depender
 * de un proveedor de IA externo.
 *
 * Reemplazar por GeminiProvider, OpenAIProvider, etc.
 * manteniendo la misma interfaz AIProvider.
 */

import type { AIProvider } from "./aiProvider.ts";
import type { ProviderResponse } from "../types/providerResponse.ts";

export class FakeProvider implements AIProvider {
  async improveText(prompt: string): Promise<ProviderResponse> {
    return {
      text: `Fabricación y colocación de estructura metálica construida en caño estructural 30x30 mm, con incorporación de melamina blanca de 18 mm y herrajes Häfele, según las especificaciones suministradas.

Terminación:
Esmalte sintético negro satinado.

Según medidas finales tomadas en obra.`,
    };
  }

  async generateDescription(prompt: string): Promise<ProviderResponse> {
    return {
      text: `Fabricación y colocación de estructura metálica construida en caño estructural 30x30 mm, con incorporación de melamina blanca de 18 mm y herrajes Häfele, según las especificaciones suministradas.

Terminación:
Esmalte sintético negro satinado.

Según medidas finales tomadas en obra. Generado con IA`,
    };
  }
}
