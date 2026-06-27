import type { AIProvider } from "./aiProvider.ts";
import { FakeProvider } from "./fakeProvider.ts";

export function getProvider(): AIProvider {
  return new FakeProvider();
}
