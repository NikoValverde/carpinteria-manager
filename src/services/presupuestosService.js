import { supabase } from "../lib/supabase";

export async function obtenerPresupuestos() {
  const { data, error } = await supabase
    .from("presupuestos")
    .select(
      `
      *,
      clientes(nombre)
    `,
    )
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function crearPresupuesto(presupuesto) {
  const { data, error } = await supabase
    .from("presupuestos")
    .insert([presupuesto])
    .select();

  if (error) {
    throw error;
  }

  return data;
}