import { supabase } from "../lib/supabase";

export async function obtenerMateriales() {
  const { data, error } = await supabase
    .from("materiales")
    .select("*")
    .order("id");

  if (error) {
    throw error;
  }

  return data;
}

export async function crearMaterial(material) {
  const { data, error } = await supabase
    .from("materiales")
    .insert([material])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarMaterial(id) {
  const { data, error } = await supabase
    .from("materiales")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarMaterial(id, material) {
  const { data, error } = await supabase
    .from("materiales")
    .update(material)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function buscarMaterialPorNombre(nombre) {
  const { data, error } = await supabase
    .from("materiales")
    .select("*")
    .ilike("nombre", `%${nombre}%`)
    .limit(10);

  if (error) throw error;

  return data;
}