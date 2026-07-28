import { supabase } from "../lib/supabase";

const PREFIJO_NUMERO_PRESUPUESTO = "PV-";
const PADDING_NUMERO_PRESUPUESTO = 4;

// Regla de negocio: calcula el próximo número de presupuesto disponible.
// Hoy consulta la tabla directamente; en el futuro puede reemplazarse por
// una RPC de PostgreSQL sin que ningún componente de React deba cambiar,
// ya que solo la usa crearPresupuesto() internamente.
async function obtenerSiguienteNumeroPresupuesto() {
  const { data, error } = await supabase
    .from("presupuestos")
    .select("numero")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  const ultimoNumero = data?.[0]?.numero;

  if (!ultimoNumero) {
    return `${PREFIJO_NUMERO_PRESUPUESTO}${String(1).padStart(
      PADDING_NUMERO_PRESUPUESTO,
      "0",
    )}`;
  }

  const parteNumerica = parseInt(
    String(ultimoNumero).replace(/\D/g, ""),
    10,
  );

  const siguiente = (Number.isNaN(parteNumerica) ? 0 : parteNumerica) + 1;

  return `${PREFIJO_NUMERO_PRESUPUESTO}${String(siguiente).padStart(
    PADDING_NUMERO_PRESUPUESTO,
    "0",
  )}`;
}

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
  const numero = await obtenerSiguienteNumeroPresupuesto();

  const { data, error } = await supabase
    .from("presupuestos")
    .insert([{ ...presupuesto, numero }])
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
      clientes(
        id,
        nombre,
        telefono,
        email,
        direccion
      )
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

export async function actualizarEstadoPresupuesto(id, estado) {
  const { data, error } = await supabase
    .from("presupuestos")
    .update({ estado })
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarPresupuesto(id) {
  const { error } = await supabase.from("presupuestos").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}