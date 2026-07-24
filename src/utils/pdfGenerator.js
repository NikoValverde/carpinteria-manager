import jsPDF from "jspdf";

import { calcularResumenFinanciero } from "../domain/presupuesto/finanzas";

// ---- Paleta de colores institucional (únicos colores permitidos) ----
const COLOR_GRIS_OSCURO = [44, 52, 64];
const COLOR_GRIS_BORDE = [170, 170, 170];
const COLOR_BLANCO = [255, 255, 255];
const COLOR_NEGRO = [0, 0, 0];
const COLOR_NARANJA = [234, 88, 12];
// Único agregado de paleta para esta mejora: tratamiento sutil y discreto
// de la línea de descuento (verde grisáceo oscuro, no compite con el naranja).
const COLOR_VERDE_DESCUENTO = [63, 107, 89];

// Helper de formato visual de precios: unifica "$ " + separador de miles.
// Solo cambia el TEXTO mostrado, nunca el valor numérico ni los cálculos.
function formatearPrecio(valor) {
  return `$ ${Number(valor || 0).toLocaleString("es-AR")}`;
}

// Función auxiliar para dibujar una flecha hacia abajo estilizada
// (no un triángulo simple, sino una flecha común con asta y punta)
function dibujarFlechaAbajo(doc, x, y, tamaño = 3) {
  y = y + 1;
  const mitad = tamaño / 2;
  const asta = tamaño * 0.6;
  
  doc.setFillColor(...COLOR_VERDE_DESCUENTO);
  doc.setDrawColor(...COLOR_VERDE_DESCUENTO);
  doc.setLineWidth(0.3);
  
  // Línea vertical (asta) - centrada exactamente en el punto medio
  doc.line(x, y - asta * 0.5, x, y + asta * 0.4);
  
  // Triángulo (punta de la flecha) - centrado en la parte inferior
  doc.triangle(
    x - mitad, y + asta * 0.2,
    x + mitad, y + asta * 0.2,
    x, y + asta * 0.9,
    "F"
  );
  
  doc.setDrawColor(...COLOR_NEGRO);
  doc.setFillColor(...COLOR_NEGRO);
}

// Función auxiliar: convierte una imagen cargada por fetch a base64
async function obtenerLogoBase64() {
  const response = await fetch("/logo-valverde.png");
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("image")) {
    throw new Error(
      `La ruta /logo-valverde.png no devolvió una imagen (devolvió: ${contentType}). Verificá que el archivo esté en /public/logo-valverde.png y reiniciá el servidor de desarrollo.`,
    );
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ===== FUNCIONES PARA CARGAR ÍCONOS DEL FOOTER =====

// Función para cargar ícono de WhatsApp
async function obtenerIconoWhatsApp() {
  const response = await fetch("/whatsapp-icon.png");
  if (!response.ok) {
    throw new Error("No se pudo cargar el ícono de WhatsApp");
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Función para cargar ícono de Globo
async function obtenerIconoGlobo() {
  const response = await fetch("/globe-icon.png");
  if (!response.ok) {
    throw new Error("No se pudo cargar el ícono de Globo");
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ===== FIN FUNCIONES ÍCONOS FOOTER =====

// Función auxiliar para dibujar un recuadro con barra de título (gris
// oscuro, texto blanco) y cuerpo de texto en negro, alineado a la
// izquierda (sin justificar). Se usa tanto para "DETALLES DE
// CONSTRUCCIÓN" como para "OPCIONALES": ambas deben verse exactamente
// igual, por eso no recibe ningún parámetro de color.
function dibujarCaja(doc, x, y, ancho, titulo, texto, fontSizeTexto = 9) {
  const altoBarraTitulo = 6;
  const lineHeightFactor = 1.5;

  // Barra de título: fondo gris oscuro, texto blanco
  doc.setFillColor(...COLOR_GRIS_OSCURO);
  doc.rect(x, y, ancho, altoBarraTitulo, "F");

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_BLANCO);
  doc.text(titulo, x + ancho / 2, y + altoBarraTitulo / 2 + 1.5, {
    align: "center",
  });

  // Cuerpo del texto: caja blanca (sin fondo), texto negro, alineado a la
  // izquierda (nunca justificado).
  doc.setFont(undefined, "normal");
  doc.setFontSize(fontSizeTexto);
  doc.setTextColor(...COLOR_NEGRO);

  const lineas = doc.splitTextToSize(texto || "", ancho - 8);

  doc.text(lineas, x + 4, y + altoBarraTitulo + 5, {
    lineHeightFactor,
    align: "left",
    maxWidth: ancho - 8,
  });

  // Alto del texto en base al tamaño de fuente real y el interlineado 1.5
  // (no se tocó la lógica de splitTextToSize, solo el cálculo de alto que
  // depende del tamaño de fuente para que la caja no quede corta; se
  // ajustó 1mm respecto a la versión anterior para achicar espacio
  // sobrante, en línea con "reducir espacios innecesarios").
  const altoLineaMM = fontSizeTexto * 0.3528 * lineHeightFactor; // pt → mm
  const altoTexto = lineas.length * altoLineaMM + altoBarraTitulo + 9;

  // Borde general fino en gris
  doc.setDrawColor(...COLOR_GRIS_BORDE);
  doc.setLineWidth(0.2);
  doc.rect(x, y, ancho, altoTexto);
  doc.setDrawColor(...COLOR_NEGRO);

  return y + altoTexto;
}

// Función auxiliar para dibujar la sección "ALTERNATIVAS DE TRABAJO".
// Estructura tipo tabla (3 columnas: título | precio alternativa | precio
// final) para facilitar la comparación entre alternativas. El título de
// cada fila es el elemento con mayor jerarquía visual, los labels son
// discretos y el naranja se reserva exclusivamente para los importes,
// igual que en el resto del documento. La lógica de cálculo (SUMA/TOTAL)
// no se modifica: esto solo cambia cómo se presenta cada valor.
function dibujarAlternativas(
  doc,
  x,
  y,
  ancho,
  alternativas,
  precioFinal,
  descuentoTipo,
  descuentoValor,
) {
  const altoBarraTitulo = 6;

  doc.setFillColor(...COLOR_GRIS_OSCURO);
  doc.rect(x, y, ancho, altoBarraTitulo, "F");

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_BLANCO);
  doc.text(
    "ALTERNATIVAS DE TRABAJO",
    x + ancho / 2,
    y + altoBarraTitulo / 2 + 1.5,
    {
      align: "center",
    },
  );
  doc.setFont(undefined, "normal");
  doc.setTextColor(...COLOR_NEGRO);

  // Columnas: el título ocupa la mitad del ancho para tener protagonismo;
  // los importes comparten la otra mitad en dos columnas más angostas.
  const anchoTitulo = ancho * 0.5;
  const anchoPrecio = ancho * 0.25;
  const xColTitulo = x;
  const xColPrecioAlt = x + anchoTitulo;
  const xColPrecioFinal = x + anchoTitulo + anchoPrecio;

  const yInicioFilas = y + altoBarraTitulo;
  const altoFilaAlternativa = 13;
  // Alto adicional que ocupa la línea intermedia del descuento. Una fila sin
  // descuento conserva exactamente los 13mm de siempre.
  const altoExtraFilaDescuento = 7;

  let yCursor = yInicioFilas;

  alternativas.forEach((alternativa, indice) => {
    const yFila = yCursor;

    // Divisor horizontal sutil entre filas (no se dibuja antes de la primera)
    if (indice > 0) {
      doc.setDrawColor(...COLOR_GRIS_BORDE);
      doc.setLineWidth(0.15);
      doc.line(x, yFila, x + ancho, yFila);
      doc.setDrawColor(...COLOR_NEGRO);
    }

    const esSuma = alternativa.tipo_precio === "SUMA";

    // Calcular si hay descuento para esta alternativa
    const {
      descuentoAplicado,
      precioFinalEfectivo,
      precioFinalConDescuento,
      montoDescuento,
      descuentoValorNumerico,
    } = calcularResumenFinanciero({
      costoMateriales: 0,
      costoManoObra: 0,
      consumiblesImprevistos: 0,
      porcentajeGanancia: 0,
      flete: 0,
      precioFinal,
      descuentoTipo,
      descuentoValor,
      alternativa,
    });

    const altoFila = descuentoAplicado
      ? altoFilaAlternativa + altoExtraFilaDescuento
      : altoFilaAlternativa;

    // ===== COLUMNA 1: TÍTULO (alineado a la izquierda, centrado verticalmente) =====
    const yCentroFila = yFila + altoFila / 2;
    
    doc.setFontSize(10.5);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_GRIS_OSCURO);
    doc.text(alternativa.titulo || "", xColTitulo + 4, yCentroFila + 1, {
      align: "left",
    });
    doc.setFont(undefined, "normal");

    // ===== COLUMNA 2: PRECIO ALTERNATIVA (centrado horizontal y vertical) =====
    if (esSuma) {
      // Calcular el centro vertical de la columna 2
      const yCentroCol2 = yFila + altoFila / 2;
      
      // Etiqueta "Precio Alternativa" - centrada justo encima del centro
      doc.setFontSize(7);
      doc.setTextColor(...COLOR_GRIS_OSCURO);
      doc.text(
        "Precio Alternativa",
        xColPrecioAlt + anchoPrecio / 2,
        yCentroCol2 - 2.5,
        {
          align: "center",
        },
      );

      // Valor del precio - centrado justo debajo del centro
      doc.setFontSize(10.5);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...COLOR_NARANJA);
      doc.text(
        formatearPrecio(alternativa.precio),
        xColPrecioAlt + anchoPrecio / 2,
        yCentroCol2 + 3.5,
        { align: "center" },
      );
      doc.setFont(undefined, "normal");
      doc.setTextColor(...COLOR_NEGRO);
    }

        // ===== COLUMNA 3: PRECIO FINAL =====
    if (!descuentoAplicado) {
      // Sin descuento: todo centrado verticalmente en la fila
      const yCentroCol3 = yFila + altoFila / 2;
      
      // Etiqueta "Precio Final" - centrada justo encima del centro
      doc.setFontSize(7);
      doc.setTextColor(...COLOR_GRIS_OSCURO);
      doc.text("Precio Final", xColPrecioFinal + anchoPrecio / 2, yCentroCol3 - 2.5, {
        align: "center",
      });

      // Precio final en naranja - centrado justo debajo del centro
      doc.setFontSize(10.5);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...COLOR_NARANJA);
      doc.text(
        formatearPrecio(precioFinalEfectivo),
        xColPrecioFinal + anchoPrecio / 2,
        yCentroCol3 + 3.5,
        { align: "center" },
      );
      doc.setFont(undefined, "normal");
      doc.setTextColor(...COLOR_NEGRO);
    } else {
      // Con descuento: estructura de 3 líneas centradas
      // Etiqueta "Precio Final" - centrada arriba
      doc.setFontSize(7);
      doc.setTextColor(...COLOR_GRIS_OSCURO);
      doc.text("Precio Final", xColPrecioFinal + anchoPrecio / 2, yFila + 4.5, {
        align: "center",
      });

      // Precio Final (sin descuento) en gris oscuro (más pequeño)
      doc.setFontSize(8.5);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...COLOR_GRIS_OSCURO);
      doc.text(
        formatearPrecio(precioFinalEfectivo),
        xColPrecioFinal + anchoPrecio / 2,
        yFila + 8.5,
        { align: "center" },
      );
      doc.setFont(undefined, "normal");

      // Línea intermedia del descuento: compacta, verde grisáceo, con flecha.
      const textoDescuentoFila =
        descuentoTipo === "porcentaje"
          ? `${descuentoValorNumerico}%`
          : `${formatearPrecio(montoDescuento)}`;

      doc.setFontSize(6.5);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...COLOR_VERDE_DESCUENTO);
      
      // Dibujar el texto del descuento centrado
      const anchoTextoDesc = doc.getTextWidth(textoDescuentoFila);
      const xCentroCol = xColPrecioFinal + anchoPrecio / 2;
      const xInicioTexto = xCentroCol - anchoTextoDesc / 2;
      
      doc.text(textoDescuentoFila, xInicioTexto, yFila + 13.5);
      
      // Dibujar la flecha a la derecha del texto, alineada verticalmente
      const xFlecha = xInicioTexto + anchoTextoDesc + 1.5;
      dibujarFlechaAbajo(doc, xFlecha, yFila + 11.5, 2);

      doc.setFont(undefined, "normal");
      doc.setTextColor(...COLOR_NEGRO);

      // Precio con descuento: naranja (más grande)
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...COLOR_NARANJA);
      doc.text(
        formatearPrecio(precioFinalConDescuento),
        xColPrecioFinal + anchoPrecio / 2,
        yFila + 18.5,
        { align: "center" },
      );
      doc.setFont(undefined, "normal");
      doc.setTextColor(...COLOR_NEGRO);
    }

    yCursor += altoFila;
  });

  const altoCuerpo = yCursor - yInicioFilas;

  // Divisores verticales sutiles y continuos entre columnas (estructura de
  // tabla), sin protagonismo frente al contenido.
  doc.setDrawColor(...COLOR_GRIS_BORDE);
  doc.setLineWidth(0.15);
  doc.line(xColPrecioAlt, yInicioFilas, xColPrecioAlt, yCursor);
  doc.line(xColPrecioFinal, yInicioFilas, xColPrecioFinal, yCursor);
  doc.setDrawColor(...COLOR_NEGRO);

  // Borde general de la tabla
  doc.setDrawColor(...COLOR_GRIS_BORDE);
  doc.setLineWidth(0.2);
  doc.rect(x, y, ancho, altoBarraTitulo + altoCuerpo);
  doc.setDrawColor(...COLOR_NEGRO);

  return y + altoBarraTitulo + altoCuerpo;
}

// Función para generar el PDF del presupuesto.
// Recibe toda la información necesaria por parámetros (no depende de estado de React).
export async function generarPDF({
  presupuesto,
  descripcion,
  opcionales,
  precioFinal,
  precioOpcional,
  totalConOpcional,
  alternativas,
  descuentoTipo,
  descuentoValor,
}) {
  const doc = new jsPDF();

  const anchoHoja = 210;
  const margen = 15;
  const anchoUtil = anchoHoja - margen * 2;

  let y = margen;

  // ===== CARGAR ÍCONOS DEL FOOTER =====
  let iconoWhatsApp = null;
  let iconoGlobo = null;

  try {
    iconoWhatsApp = await obtenerIconoWhatsApp();
    iconoGlobo = await obtenerIconoGlobo();
  } catch (error) {
    console.error("Error cargando íconos del footer:", error);
    // Continuar sin íconos (fallback visual)
  }
  // ===== FIN CARGA DE ÍCONOS =====

  // ENCABEZADO (logo + "Presupuesto" ya incluido en la imagen)
  // Se mantiene exactamente igual: mismo logo, mismo banner, mismo tamaño,
  // y queda prácticamente unido a la tabla de cliente (0mm de separación).

  const altoLogo = (399 / 1774) * anchoUtil * 0.85; // ≈ 18mm con anchoUtil de 180mm

  try {
    const logoBase64 = await obtenerLogoBase64();
    doc.addImage(logoBase64, "PNG", margen, y, anchoUtil, altoLogo);
  } catch (error) {
    console.error("No se pudo cargar el logo:", error);
  }

  y += altoLogo;
  doc.setDrawColor(...COLOR_NEGRO);
  doc.rect(margen, margen, anchoUtil, altoLogo);

  // RECUADRO CLIENTE / CONTACTO / DIRECCIÓN / E-MAIL / FECHA / VALIDEZ
  const cliente = String(presupuesto.clientes?.nombre ?? "-");
  const telefono = String(presupuesto.clientes?.telefono ?? "-");
  const direccion = String(presupuesto.clientes?.direccion ?? "-");
  const email = String(presupuesto.clientes?.email ?? "-");

  const fechaActual = new Date();
  const fechaValidez = new Date(fechaActual);
  fechaValidez.setDate(fechaValidez.getDate() + 15);

  const filasDatosCliente = [
    {
      izquierda: {
        label: "CLIENTE",
        valor: cliente,
      },
      derecha: {
        label: "CONTACTO",
        valor: telefono,
      },
    },
    {
      izquierda: {
        label: "DIRECCIÓN",
        valor: direccion,
      },
      derecha: {
        label: "E-MAIL",
        valor: email,
      },
    },
    {
      izquierda: {
        label: "FECHA",
        valor: fechaActual.toLocaleDateString("es-AR"),
      },
      derecha: {
        label: "VALIDEZ",
        valor: fechaValidez.toLocaleDateString("es-AR"),
      },
    },
  ];

  const anchoMitad = anchoUtil / 2;
  const altoFila = 5.5; // antes 6mm, ligeramente más bajo
  const cantidadFilas = filasDatosCliente.length * 2; // 1 fila de etiqueta + 1 de dato por par
  const altoTotalDatos = altoFila * cantidadFilas;

  // Fondo gris oscuro SOLO en las filas de etiqueta (los valores quedan en blanco)
  doc.setFillColor(...COLOR_GRIS_OSCURO);
  filasDatosCliente.forEach((_, indice) => {
    const yFilaEtiqueta = y + indice * altoFila * 2;
    doc.rect(margen, yFilaEtiqueta, anchoUtil, altoFila, "F");
  });

  // Borde general y divisores en gris fino
  doc.setDrawColor(...COLOR_GRIS_BORDE);
  doc.setLineWidth(0.2);
  doc.rect(margen, y, anchoUtil, altoTotalDatos);
  doc.line(margen + anchoMitad, y, margen + anchoMitad, y + altoTotalDatos);
  for (let i = 1; i < cantidadFilas; i++) {
    doc.line(margen, y + altoFila * i, margen + anchoUtil, y + altoFila * i);
  }
  doc.setDrawColor(...COLOR_NEGRO);

  // Texto: etiquetas en blanco sobre fondo oscuro, datos en negro sobre blanco
  filasDatosCliente.forEach((fila, indice) => {
    const yEtiqueta = y + indice * altoFila * 2;
    const yDato = yEtiqueta + altoFila;

    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_BLANCO);
    doc.text(fila.izquierda.label, margen + 3, yEtiqueta + 3.8);
    doc.text(fila.derecha.label, margen + anchoMitad + 3, yEtiqueta + 3.8);

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_NEGRO);
    doc.text(fila.izquierda.valor, margen + 3, yDato + 3.8);
    doc.text(fila.derecha.valor, margen + anchoMitad + 3, yDato + 3.8);
  });

  doc.setTextColor(...COLOR_NEGRO);

  y += altoTotalDatos + 3; // tabla cliente → título del trabajo (antes 4mm)

  // TÍTULO DEL TRABAJO (una sola barra horizontal, baja y sin líneas decorativas)

  const altoTitulo = 8;

  doc.setFillColor(...COLOR_GRIS_OSCURO);
  doc.rect(margen, y, anchoUtil, altoTitulo, "F");

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_BLANCO);
  doc.text(
    (presupuesto.titulo || "").toUpperCase(),
    anchoHoja / 2,
    y + altoTitulo / 2 + 1.5,
    { align: "center" },
  );
  doc.setFont(undefined, "normal");
  doc.setTextColor(...COLOR_NEGRO);

  y += altoTitulo + 3; // título → detalle de construcción

  // DETALLE DE CONSTRUCCIÓN

  y = dibujarCaja(
    doc,
    margen,
    y,
    anchoUtil,
    "DETALLES DE CONSTRUCCIÓN",
    descripcion,
  );

  y += 3; // detalle → opcionales (o → total, si no hay opcionales)

  // OBSERVACIONES

  /*if (observaciones?.trim()) {
  y = dibujarCaja(
    doc,
    margen,
    y,
    anchoUtil,
    "OBSERVACIONES",
    observaciones,
  );
  y += 4;
}*/

  // OPCIONALES (mismo diseño exacto que "DETALLES DE CONSTRUCCIÓN", sin acento naranja)

  if (opcionales?.trim()) {
    y = dibujarCaja(doc, margen, y, anchoUtil, "OPCIONALES", opcionales);
    y += 3; // opcionales → total
  }

    // TOTAL PRESUPUESTADO (caja blanca, barra gris oscuro, único elemento naranja: el precio principal)

  const altoBarraTotal = 7;

  doc.setFillColor(...COLOR_GRIS_OSCURO);
  doc.rect(margen, y, anchoUtil, altoBarraTotal, "F");

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_BLANCO);
  doc.text("TOTAL PRESUPUESTADO", anchoHoja / 2, y + altoBarraTotal / 2 + 1.5, {
    align: "center",
  });
  doc.setFont(undefined, "normal");

  // El descuento pertenece al presupuesto: se resuelve exclusivamente vía el
  // dominio financiero (misma fuente de verdad que el resto de la app). Acá
  // solo se decide cómo se presenta, no se reimplementa ninguna fórmula.
  const { descuentoAplicado, montoDescuento, descuentoValorNumerico, precioFinalConDescuento } =
    calcularResumenFinanciero({
      costoMateriales: 0,
      costoManoObra: 0,
      consumiblesImprevistos: 0,
      porcentajeGanancia: 0,
      flete: 0,
      precioFinal,
      descuentoTipo,
      descuentoValor,
    });

  const hayDescuentoTotal = descuentoAplicado;
  // Alto extra que ocupa la línea intermedia del descuento. Sin descuento
  // queda en 0: el bloque se ve pixel a pixel igual que antes.
  const altoExtraDescuentoTotal = hayDescuentoTotal ? 12 : 0;

  if (!hayDescuentoTotal) {
    // Comportamiento actual, sin ningún cambio.
    doc.setFontSize(17);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_NARANJA);
    doc.text(
      formatearPrecio(precioFinal),
      anchoHoja / 2,
      y + altoBarraTotal + 10,
      {
        align: "center",
      },
    );
    doc.setFont(undefined, "normal");
    doc.setTextColor(...COLOR_NEGRO);
  } else {
    // Precio original: se conserva visible pero deja de ser el protagonista
    // (gris oscuro, tamaño reducido).
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_GRIS_OSCURO);
    doc.text(
      formatearPrecio(precioFinal),
      anchoHoja / 2,
      y + altoBarraTotal + 7,
      { align: "center" },
    );
    doc.setFont(undefined, "normal");

    // Línea intermedia del descuento: compacta, verde grisáceo, con flecha.
    const textoDescuentoTotal =
      descuentoTipo === "porcentaje"
        ? `Descuento aplicado: ${descuentoValorNumerico}%`
        : `Descuento aplicado: -${formatearPrecio(montoDescuento)}`;

    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_VERDE_DESCUENTO);
    
    // Dibujar el texto del descuento centrado
    const anchoTextoDescTotal = doc.getTextWidth(textoDescuentoTotal);
    const xCentroTotal = anchoHoja / 2;
    const xInicioDescTotal = xCentroTotal - anchoTextoDescTotal / 2;
    
    doc.text(textoDescuentoTotal, xInicioDescTotal, y + altoBarraTotal + 13.5);
    
    // Dibujar la flecha a la derecha del texto, alineada verticalmente
    const xFlechaTotal = xInicioDescTotal + anchoTextoDescTotal + 2;
    dibujarFlechaAbajo(doc, xFlechaTotal, y + altoBarraTotal + 11, 2.2);
    
    doc.setFont(undefined, "normal");
    doc.setTextColor(...COLOR_NEGRO);

    // Precio final con descuento: mismo tratamiento que tenía el precio
    // único antes (naranja, 17pt) — es el importe que ahora tiene la
    // jerarquía principal, el que efectivamente se cobra.
    doc.setFontSize(17);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_NARANJA);
    doc.text(
      formatearPrecio(precioFinalConDescuento),
      anchoHoja / 2,
      y + altoBarraTotal + 10 + altoExtraDescuentoTotal,
      { align: "center" },
    );
    doc.setFont(undefined, "normal");
    doc.setTextColor(...COLOR_NEGRO);
  }

  // Acento visual: dos líneas finas naranjas flanqueando el importe
  // principal, inspiradas en la referencia estética. Puramente decorativo,
  // no altera el cálculo ni la jerarquía (el importe sigue siendo el
  // elemento más grande y destacado del documento). Cuando hay descuento,
  // flanquean el importe con descuento (el que está en naranja).
  const importePrincipalTotal = hayDescuentoTotal
    ? precioFinalConDescuento
    : precioFinal;
  const anchoTextoTotal = doc.getTextWidth(formatearPrecio(importePrincipalTotal));
  doc.setDrawColor(...COLOR_NARANJA);
  doc.setLineWidth(0.4);
  const yLineaTotal = y + altoBarraTotal + 7 + altoExtraDescuentoTotal;
  const semiAnchoTexto = anchoTextoTotal / 2 + 6;
  doc.line(
    anchoHoja / 2 - semiAnchoTexto - 14,
    yLineaTotal,
    anchoHoja / 2 - semiAnchoTexto,
    yLineaTotal,
  );
  doc.line(
    anchoHoja / 2 + semiAnchoTexto,
    yLineaTotal,
    anchoHoja / 2 + semiAnchoTexto + 14,
    yLineaTotal,
  );
  doc.setDrawColor(...COLOR_NEGRO);

  let altoCajaTotal = altoBarraTotal + 17 + altoExtraDescuentoTotal;

  if (opcionales?.trim()) {
    doc.setDrawColor(...COLOR_GRIS_BORDE);
    doc.line(
      margen + 20,
      y + 23 + altoExtraDescuentoTotal,
      margen + anchoUtil - 20,
      y + 23 + altoExtraDescuentoTotal,
    );

    doc.setFontSize(9);
    doc.setTextColor(...COLOR_NEGRO);

    doc.text(
      `Valor Opcional: ${formatearPrecio(precioOpcional)}`,
      anchoHoja / 2,
      y + 29 + altoExtraDescuentoTotal,
      { align: "center" },
    );

    doc.setFont(undefined, "bold");

    doc.text(
      "TOTAL CON OPCIONAL",
      anchoHoja / 2,
      y + 36 + altoExtraDescuentoTotal,
      {
        align: "center",
      },
    );

    doc.setFontSize(12);

    doc.text(
      formatearPrecio(totalConOpcional),
      anchoHoja / 2,
      y + 43 + altoExtraDescuentoTotal,
      {
        align: "center",
      },
    );

    doc.setFont(undefined, "normal");

    altoCajaTotal = 47 + altoExtraDescuentoTotal;
  }

  doc.setDrawColor(...COLOR_GRIS_BORDE);
  doc.setLineWidth(0.2);
  doc.rect(margen, y, anchoUtil, altoCajaTotal);
  doc.setDrawColor(...COLOR_NEGRO);
  doc.setTextColor(...COLOR_NEGRO);

  y += altoCajaTotal + 3; // total → alternativas (o → footer, si no hay alternativas)

  // ALTERNATIVAS DE TRABAJO (nueva sección, solo si hay alternativas cargadas)

  if (alternativas?.length > 0) {
    y = dibujarAlternativas(
      doc,
      margen,
      y,
      anchoUtil,
      alternativas,
      precioFinal,
      descuentoTipo,
      descuentoValor,
    );
    y += 3; // alternativas → footer
  }

  // ===== PIE DE PÁGINA =====
  const altoFooter = 10; // Volvemos a 10mm como en la imagen

  doc.setFillColor(...COLOR_GRIS_OSCURO);
  doc.rect(margen, y, anchoUtil, altoFooter, "F");

  // Líneas divisorias en naranja
  const col1Ancho = anchoUtil * 0.4;
  const col2Ancho = anchoUtil * 0.28;
  const divisor1X = margen + col1Ancho;
  const divisor2X = margen + col1Ancho + col2Ancho;

  doc.setDrawColor(...COLOR_NARANJA);
  doc.setLineWidth(0.8);
  doc.line(divisor1X, y + 1.5, divisor1X, y + altoFooter - 1.5);
  doc.line(divisor2X, y + 1.5, divisor2X, y + altoFooter - 1.5);
  doc.setDrawColor(...COLOR_NEGRO);

  // Calcular centro vertical exacto
  const centroYFooter = y + altoFooter / 2;
  // Ajuste para centrar perfectamente el texto (basado en la altura de la fuente)
  const offsetYTexto = 0.8; // Reducido para mejor centrado

  // ===== COLUMNA 1: Nombre de la empresa =====
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_BLANCO);

  const textoEmpresa1 = "CARPINTERÍA Y HERRERÍA ";
  const textoEmpresa2 = " VALVERDE ";
    const xTextoEmpresa = margen + 6;

  doc.text(textoEmpresa1, xTextoEmpresa, centroYFooter + offsetYTexto);

  const anchoTexto1 = doc.getTextWidth(textoEmpresa1);
  doc.setTextColor(...COLOR_NARANJA);
  doc.text(
    textoEmpresa2,
    xTextoEmpresa + anchoTexto1,
    centroYFooter + offsetYTexto,
  );

  // ===== COLUMNA 2: WhatsApp con ícono =====
  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_BLANCO);

  const textoWhatsapp = "WhatsApp: +54 9 11 3638-5790";
  const anchoTextoWhatsapp = doc.getTextWidth(textoWhatsapp);

  const tamañoIcono = 3.2;
  const espacioIconoTexto = 1.5;

  const centroCol2 = margen + col1Ancho + col2Ancho / 2;
  const anchoTotalBloqueWhatsapp =
    tamañoIcono + espacioIconoTexto + anchoTextoWhatsapp;
  const xInicioWhatsapp = centroCol2 - anchoTotalBloqueWhatsapp / 2;

  // Dibujar ícono de WhatsApp
  if (iconoWhatsApp) {
    const yIcono = centroYFooter - tamañoIcono / 2;
    doc.addImage(
      iconoWhatsApp,
      "PNG",
      xInicioWhatsapp,
      yIcono,
      tamañoIcono,
      tamañoIcono,
    );
  } else {
    // Fallback: círculo blanco simple
    doc.setFillColor(255, 255, 255);
    doc.circle(
      xInicioWhatsapp + tamañoIcono / 2,
      centroYFooter,
      tamañoIcono / 2,
      "F",
    );
  }

  doc.setTextColor(...COLOR_BLANCO);
  doc.text(
    textoWhatsapp,
    xInicioWhatsapp + tamañoIcono + espacioIconoTexto,
    centroYFooter + offsetYTexto,
  );

  // ===== COLUMNA 3: Sitio web con ícono =====
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_BLANCO);

  const textoWeb = "www.carpinteriavalverde.com.ar";
  const anchoTextoWeb = doc.getTextWidth(textoWeb);

  // Calcular centro de la columna 3
  const centroCol3 = margen + col1Ancho + col2Ancho + (anchoUtil * 0.32) / 2;
  const anchoTotalBloqueWeb = tamañoIcono + espacioIconoTexto + anchoTextoWeb;
  const xInicioWeb = centroCol3 - anchoTotalBloqueWeb / 2;

  // Dibujar ícono de Globo
  if (iconoGlobo) {
    const yIcono = centroYFooter - tamañoIcono / 2;
    doc.addImage(
      iconoGlobo,
      "PNG",
      xInicioWeb,
      yIcono,
      tamañoIcono,
      tamañoIcono,
    );
  } else {
    // Fallback: círculo blanco simple
    doc.setFillColor(255, 255, 255);
    doc.circle(
      xInicioWeb + tamañoIcono / 2,
      centroYFooter,
      tamañoIcono / 2,
      "F",
    );
  }

  doc.setTextColor(...COLOR_BLANCO);
  doc.text(
    textoWeb,
    xInicioWeb + tamañoIcono + espacioIconoTexto,
    centroYFooter + offsetYTexto,
  );

  // Restaurar colores
  doc.setTextColor(...COLOR_NEGRO);

  y += altoFooter;

  doc.save(`${presupuesto.numero}.pdf`);
}