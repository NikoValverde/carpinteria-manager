export interface AIProvider {
  improveText(prompt: string): Promise<string>;

  generateDescription(prompt: string): Promise<string>;
}
