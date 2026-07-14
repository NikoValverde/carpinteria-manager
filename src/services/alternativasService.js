/**
 * Servicio de acceso a datos para las alternativas
 * de presupuesto.
 *
 * No contiene lógica de negocio.
 * Solo operaciones CRUD sobre Supabase.
 */

import { supabase } from "../lib/supabase";

export async function obtenerAlternativas(presupuestoId) {
  const { data, error } = await supabase
    .from("alternativas_presupuesto")
    .select("*")
    .eq("presupuesto_id", presupuestoId)
    .order("orden", { ascending: true });

  if (error) throw error;

  return data;
}

export async function crearAlternativa(alternativa) {
  const { data, error } = await supabase
    .from("alternativas_presupuesto")
    .insert(alternativa)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function actualizarAlternativa(id, alternativa) {
  const { data, error } = await supabase
    .from("alternativas_presupuesto")
    .update(alternativa)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function eliminarAlternativa(id) {
  const { error } = await supabase
    .from("alternativas_presupuesto")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
