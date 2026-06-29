import type { PromptContext } from "../types/promptContext.ts";
import type { ValidationResult } from "../types/validationResult.ts";

export function validateContext(context: PromptContext): ValidationResult {
  if (context.mode === "improve") {
    const lengthResult = validateLength(context);
    if (!lengthResult.valid) return lengthResult;

    const domainResult = validateDomain(context);
    if (!domainResult.valid) return domainResult;

    const intentResult = validateIntent(context);
    if (!intentResult.valid) return intentResult;
  }

  if (context.mode === "generate") {
    const generateResult = validateGenerateContext(context);
    if (!generateResult.valid) return generateResult;
  }

  const promptInjectionResult = validatePromptInjection(context);
  if (!promptInjectionResult.valid) return promptInjectionResult;

  return {
    valid: true,
  };
}

/**
 * Texto vacío y longitud mínima.
 */
function validateLength(context: PromptContext): ValidationResult {
  if (!context.textoOriginal?.trim()) {
    return {
      valid: false,
      message: "No hay texto para mejorar.",
    };
  }

  if (context.textoOriginal.trim().length < 15) {
    return {
      valid: false,
      message: "El texto es demasiado corto para mejorarlo.",
    };
  }

  return { valid: true };
}

/**
 * El texto debe pertenecer al dominio de carpintería / herrería.
 */
function validateDomain(context: PromptContext): ValidationResult {
  if (!containsBudgetContext(context.textoOriginal ?? "")) {
    return {
      valid: false,
      message:
        "El texto ingresado no parece corresponder a un presupuesto de carpintería o herrería.",
    };
  }

  return { valid: true };
}

/**
 * Detecta si el usuario está haciendo una pregunta en lugar de
 * redactar una descripción técnica de presupuesto.
 */
function validateIntent(context: PromptContext): ValidationResult {
  const normalized = (context.textoOriginal ?? "").trim().toLowerCase();

  const startsWithQuestionWord = QUESTION_STARTERS.some(
    (starter) => normalized === starter || normalized.startsWith(`${starter} `),
  );

  const containsQuestionMark =
    normalized.includes("?") || normalized.includes("¿");

  const looksLikeQuestion = startsWithQuestionWord || containsQuestionMark;

  if (looksLikeQuestion) {
    return {
      valid: false,
      message:
        "El asistente solo puede redactar o mejorar descripciones técnicas de presupuestos.",
    };
  }

  return { valid: true };
}

/**
 * Validaciones específicas del modo "generate".
 * Sin reglas todavía.
 */
function validateGenerateContext(context: PromptContext): ValidationResult {
  return { valid: true };
}

/**
 * Detección de intentos de prompt injection.
 * Sin reglas todavía.
 */
function validatePromptInjection(context: PromptContext): ValidationResult {
  return { valid: true };
}

const QUESTION_STARTERS = [
  "qué",
  "como",
  "cómo",
  "cuál",
  "cuáles",
  "dónde",
  "cuando",
  "cuándo",
  "por qué",
];


function containsBudgetContext(text: string): boolean {
  const carpinteria = [
    "melamina",
    "mdf",
    "aglomerado",
    "terciado",
    "fenolico",
    "contrachapado",
    "enchapado",
    "placard",
    "vestidor",
    "mueble",
    "cocina",
    "alacena",
    "bajo mesada",
    "isla",
    "escritorio",
    "biblioteca",
    "estante",
    "mesa",
    "silla",
    "cama",
    "cabecera",
    "zapatero",
    "rack",
    "modular",
    "mdf 18",
    "18mm",
    "15mm",
    "6mm",
  ];

  const metales = [
    "planchuela",
    "redondo",
    "doble t",
    "cuadrado",
    "rectangular",
    "ipn",
    "u",
    "perfil c",
    "perfil l",
  ];

  const herrajes = [
    "herraje",
    "bisagra",
    "guia",
    "corredera",
    "tirador",
    "manija",
    "cerradura",
    "picaporte",
    "piston",
    "telescopica",
    "cajonera",
    "kit",
    "riel",
  ];

  const terminaciones = [
    "pintura",
    "laqueado",
    "esmalte",
    "barniz",
    "lustre",
    "encerado",
    "tapacanto",
    "laca poliuretanica",
    "sellador",
    "epoxi",
    "nitrocelulosa",
  ];

  const herreria = [
    "caño",
    "chapa",
    "estructura",
    "soldadura",
    "pergola",
    "tubo",
    "perfil",
    "vidrio",
    "aluminio",
    "hierro",
    "acero inoxidable",
    "antioxido",
    "galvanizado",
    "reja",
    "porton",
    "baranda",
    "pasamanos",
    "parrilla",
    "angulo",
    "solera",
  ];

  const procesos = [
    "fabricacion",
    "colocacion",
    "instalacion",
    "corte",
    "rebaje",
    "lijado",
    "pulido",
    "armado",
    "montaje",
    "ajuste",
    "torneado",
    "tapizado",
    "enmarcado",
  ];

  const marcas = [
    "Blum",
    "Häfele",
    "Faplac",
    "Masisa",
    "egger",
    "ducase",
    "eurohard",
    "cetol",
    "sherwin",
  ];

  const keywords = [
    ...carpinteria,
    ...metales,
    ...herrajes,
    ...terminaciones,
    ...herreria,
    ...procesos,
    ...marcas,
  ];

  const normalized = text.toLowerCase();

  return keywords.some((keyword) => normalized.includes(keyword));
}
