import { supabase } from "../lib/supabase";

export async function obtenerManoObraPresupuesto(presupuestoId) {
  const { data, error } = await supabase
    .from("presupuesto_mano_obra")
    .select("*")
    .eq("presupuesto_id", presupuestoId)
    .order("id");

  if (error) {
    throw error;
  }

  return data;
}

export async function agregarManoObraPresupuesto(manoObra) {
  const { data, error } = await supabase
    .from("presupuesto_mano_obra")
    .insert([manoObra])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarManoObraPresupuesto(id) {
  const { data, error } = await supabase
    .from("presupuesto_mano_obra")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}