import { supabase } from "../lib/supabase";

export async function obtenerMaterialesPresupuesto(presupuestoId) {
  const { data, error } = await supabase
    .from("presupuesto_materiales")
    .select("*")
    .eq("presupuesto_id", presupuestoId)
    .order("id");

  if (error) {
    throw error;
  }

  return data;
}

export async function agregarMaterialPresupuesto(material) {
  const { data, error } = await supabase
    .from("presupuesto_materiales")
    .insert([material])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarMaterialPresupuesto(id) {
  const { data, error } = await supabase
    .from("presupuesto_materiales")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarMaterialPresupuesto(id, material) {
  const { data, error } = await supabase
    .from("presupuesto_materiales")
    .update(material)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}