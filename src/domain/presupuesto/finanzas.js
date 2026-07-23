// Dominio financiero del presupuesto.
//
// Concentra TODA la lógica de negocio relacionada al cálculo de un presupuesto:
// costos, ganancia, precio de trabajo y descuento sobre el Precio Final.
//
// Reglas:
// - Funciones puras: mismos inputs -> mismos outputs, sin efectos secundarios.
// - Sin dependencias de React, Supabase, fetch, etc.
// - Ningún otro módulo debe reimplementar estas fórmulas: esta es la única
//   fuente de verdad. Pensado para ser reutilizado más adelante por
//   Alternativas, PDF, Dashboard y Reportes.
//
// Este módulo expone una única función pública: calcularResumenFinanciero().
// El resto de las funciones son privadas del dominio.

function calcularCostoTotal({ costoMateriales, costoManoObra, consumiblesImprevistos }) {
  return (
    Number(costoMateriales || 0) +
    Number(costoManoObra || 0) +
    Number(consumiblesImprevistos || 0)
  );
}

function calcularMontoGanancia({ costoTotal, porcentajeGanancia }) {
  return costoTotal * (Number(porcentajeGanancia || 0) / 100);
}

function calcularPrecioTrabajo({ costoTotal, montoGanancia, flete }) {
  return costoTotal + montoGanancia + Number(flete || 0);
}

// Devuelve un mensaje de error, o "" si el descuento es válido (o no fue cargado).
function validarDescuento({ precioFinal, descuentoTipo, descuentoValor }) {
  if (
    descuentoValor === "" ||
    descuentoValor === null ||
    descuentoValor === undefined
  ) {
    return "";
  }

  const valor = Number(descuentoValor) || 0;

  if (descuentoTipo === "porcentaje") {
    if (valor < 0 || valor > 100) {
      return "El porcentaje debe estar entre 0 y 100.";
    }
    return "";
  }

  if (descuentoTipo === "monto") {
    if (valor < 0) {
      return "El monto no puede ser negativo.";
    }
    if (valor > Number(precioFinal || 0)) {
      return "El monto no puede superar el Precio Final.";
    }
    return "";
  }

  return "";
}

// El descuento siempre se aplica sobre el Precio Final editable, nunca sobre
// el Precio Trabajo (precio sugerido).
function calcularDescuento({ precioFinal, descuentoTipo, descuentoValor }) {
  const descuentoValorNumerico = Number(descuentoValor) || 0;
  const errorDescuento = validarDescuento({
    precioFinal,
    descuentoTipo,
    descuentoValor,
  });

  const descuentoAplicado =
    descuentoValor !== "" &&
    descuentoValor !== null &&
    descuentoValor !== undefined &&
    !errorDescuento;

  const montoDescuento = descuentoAplicado
    ? descuentoTipo === "porcentaje"
      ? Number(precioFinal || 0) * (descuentoValorNumerico / 100)
      : descuentoValorNumerico
    : 0;

  const precioFinalConDescuento = descuentoAplicado
    ? Number(precioFinal || 0) - montoDescuento
    : Number(precioFinal || 0);

  return {
    errorDescuento,
    descuentoAplicado,
    descuentoValorNumerico,
    montoDescuento,
    precioFinalConDescuento,
  };
}

/**
 * Única función pública del dominio financiero del presupuesto.
 *
 * Recibe todos los datos necesarios y devuelve un único objeto con todos
 * los resultados financieros derivados: costos, ganancia, precio de trabajo
 * y descuento sobre el Precio Final.
 */
export function calcularResumenFinanciero({
  costoMateriales,
  costoManoObra,
  consumiblesImprevistos,
  porcentajeGanancia,
  flete,
  precioFinal,
  descuentoTipo,
  descuentoValor,
}) {
  const costoTotal = calcularCostoTotal({
    costoMateriales,
    costoManoObra,
    consumiblesImprevistos,
  });

  const montoGanancia = calcularMontoGanancia({ costoTotal, porcentajeGanancia });

  const precioTrabajo = calcularPrecioTrabajo({
    costoTotal,
    montoGanancia,
    flete,
  });

  const diferenciaPrecio = Number(precioFinal || 0) - Number(precioTrabajo || 0);
  const precioDesactualizado = diferenciaPrecio !== 0;

  const {
    errorDescuento,
    descuentoAplicado,
    descuentoValorNumerico,
    montoDescuento,
    precioFinalConDescuento,
  } = calcularDescuento({ precioFinal, descuentoTipo, descuentoValor });

  return {
    costoTotal,
    montoGanancia,
    precioTrabajo,
    diferenciaPrecio,
    precioDesactualizado,
    descuentoAplicado,
    descuentoValorNumerico,
    montoDescuento,
    precioFinalConDescuento,
    errorDescuento,
  };
}
