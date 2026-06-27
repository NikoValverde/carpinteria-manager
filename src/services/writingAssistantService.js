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

  return data.text;
}
