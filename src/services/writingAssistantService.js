import { supabase } from "../lib/supabase";

export async function improveText(context) {
  const { data, error } = await supabase.functions.invoke("writing-assistant", {
    body: {
      ...context,
      mode: "improve",
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error(data?.error || "No se pudo mejorar el texto.");
  }

  return data.text;
}

export async function generateDescription(context) {
  const { data, error } = await supabase.functions.invoke("writing-assistant", {
    body: {
      ...context,
      mode: "generate",
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error(data?.error || "No se pudo generar la descripción.");
  }

  return data.text;
}
