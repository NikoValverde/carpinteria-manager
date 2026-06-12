import { supabase } from "../lib/supabase";

export async function obtenerClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("id");

  if (error) {
    throw error;
  }

  return data;
}

export async function crearCliente(cliente) {
  const { data, error } = await supabase
    .from("clientes")
    .insert([cliente])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarCliente(id) {
  const { data, error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id)
    .select();

  console.log("DELETE DATA:", data);
  console.log("DELETE ERROR:", error);

  if (error) {
    throw error;
  }

  return data;
}
