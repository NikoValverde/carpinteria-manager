import { supabase } from "../lib/supabase";

export async function obtenerIntegrantes() {
  const { data, error } = await supabase
    .from("integrantes")
    .select("*")
    .order("id");

  if (error) {
    throw error;
  }

  return data;
}

export async function crearIntegrante(integrante) {
  const { data, error } = await supabase
    .from("integrantes")
    .insert([integrante])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarIntegrante(id) {
  const { data, error } = await supabase
    .from("integrantes")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarIntegrante(id, integrante) {
  const { data, error } = await supabase
    .from("integrantes")
    .update(integrante)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}