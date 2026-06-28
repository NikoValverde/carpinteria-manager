import type { AIProvider } from "./aiProvider.ts";
import { GeminiProvider } from "./GeminiProvider.ts";

export function getProvider(): AIProvider {
  return new GeminiProvider();
}
