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

export async function obtenerPresupuestoPorId(id) {
  const { data, error } = await supabase
    .from("presupuestos")
    .select(
      `
      *,
      clientes(nombre)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarPresupuesto(id, presupuesto) {
  const { data, error } = await supabase
    .from("presupuestos")
    .update(presupuesto)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}