import jsPDF from "jspdf";

// ---- Paleta de colores institucional (únicos colores permitidos) ----
const COLOR_GRIS_OSCURO = [44, 52, 64];
const COLOR_GRIS_BORDE = [170, 170, 170];
const COLOR_BLANCO = [255, 255, 255];
const COLOR_NEGRO = [0, 0, 0];
const COLOR_NARANJA = [234, 88, 12];

// Helper de formato visual de precios: unifica "$ " + separador de miles.
// Solo cambia el TEXTO mostrado, nunca el valor numérico ni los cálculos.
function formatearPrecio(valor) {
  return `$ ${Number(valor || 0).toLocaleString("es-AR")}`;
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

// Íconos vectoriales mínimos para el footer. Son formas GENÉRICAS y
// abstractas (no reproducen el logo real de WhatsApp ni de ningún sitio),
// dibujadas con primitivas nativas de jsPDF para que siempre se vean
// nítidas sin depender de fuentes/emoji.
function dibujarIconoChat(doc, x, y, ancho, alto) {
  doc.setFillColor(...COLOR_BLANCO);
  doc.roundedRect(x, y, ancho, alto, 0.4, 0.4, "F");
  doc.triangle(
    x + ancho * 0.2,
    y + alto,
    x + ancho * 0.5,
    y + alto,
    x + ancho * 0.2,
    y + alto + 0.9,
    "F",
  );
}

function dibujarIconoGlobo(doc, cx, cy, r) {
  doc.setDrawColor(...COLOR_BLANCO);
  doc.setLineWidth(0.25);
  doc.circle(cx, cy, r, "S");
  doc.ellipse(cx, cy, r * 0.45, r, "S");
  doc.line(cx - r, cy, cx + r, cy);
  doc.setDrawColor(...COLOR_NEGRO);
}

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
// Reutiliza la misma barra de título gris grafito que "dibujarCaja", pero
// el cuerpo es una lista compacta (título + importes en dos columnas) para
// no comprometer que el presupuesto entre en una sola hoja A4. El naranja
// se usa únicamente en los importes, igual que en el resto del documento.
function dibujarAlternativas(doc, x, y, ancho, alternativas, precioFinal) {
  const altoBarraTitulo = 6;

  doc.setFillColor(...COLOR_GRIS_OSCURO);
  doc.rect(x, y, ancho, altoBarraTitulo, "F");

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_BLANCO);
  doc.text("ALTERNATIVAS DE TRABAJO", x + ancho / 2, y + altoBarraTitulo / 2 + 1.5, {
    align: "center",
  });
  doc.setFont(undefined, "normal");
  doc.setTextColor(...COLOR_NEGRO);

  let yCursor = y + altoBarraTitulo + 5;
  const anchoMitad = ancho / 2;

  alternativas.forEach((alternativa, indice) => {
    if (indice > 0) {
      doc.setDrawColor(...COLOR_GRIS_BORDE);
      doc.setLineWidth(0.3);
      doc.line(x + 4, yCursor - 3, x + ancho - 4, yCursor - 3);
      doc.setDrawColor(...COLOR_NEGRO);
    }

    // Título de la alternativa
    doc.setFontSize(9.5);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_GRIS_OSCURO);
    doc.text(alternativa.titulo || "", x + 4, yCursor);
    doc.setFont(undefined, "normal");

    yCursor += 5;

    // Bloque "Precio Alternativa" (columna izquierda)
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_NEGRO);
    doc.text("Precio Alternativa", x + 4, yCursor);

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLOR_NARANJA);
    doc.text(formatearPrecio(alternativa.precio), x + 4, yCursor + 5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...COLOR_NEGRO);

    // Bloque "Precio Final" (columna derecha, solo si SUMA)
    if (alternativa.tipo_precio === "SUMA") {
      const precioFinalAlternativa =
        Number(precioFinal || 0) + Number(alternativa.precio || 0);

      doc.setFontSize(7.5);
      doc.setTextColor(...COLOR_NEGRO);
      doc.text("Precio Final", x + anchoMitad, yCursor);

      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...COLOR_NARANJA);
      doc.text(formatearPrecio(precioFinalAlternativa), x + anchoMitad, yCursor + 5);
      doc.setFont(undefined, "normal");
      doc.setTextColor(...COLOR_NEGRO);
    }

    yCursor += 8;
  });

  const altoCuerpo = yCursor - (y + altoBarraTitulo);

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
}) {
  const doc = new jsPDF();

  const anchoHoja = 210;
  const margen = 15;
  const anchoUtil = anchoHoja - margen * 2;

  let y = margen;

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

  doc.setFontSize(17);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_NARANJA);
  doc.text(formatearPrecio(precioFinal), anchoHoja / 2, y + altoBarraTotal + 10, {
    align: "center",
  });
  doc.setFont(undefined, "normal");
  doc.setTextColor(...COLOR_NEGRO);

  let altoCajaTotal = altoBarraTotal + 17;

  if (opcionales?.trim()) {
    doc.setDrawColor(...COLOR_GRIS_BORDE);
    doc.line(margen + 20, y + 23, margen + anchoUtil - 20, y + 23);

    doc.setFontSize(9);
    doc.setTextColor(...COLOR_NEGRO);

    doc.text(
      `Valor Opcional: ${formatearPrecio(precioOpcional)}`,
      anchoHoja / 2,
      y + 29,
      { align: "center" },
    );

    doc.setFont(undefined, "bold");

    doc.text("TOTAL CON OPCIONAL", anchoHoja / 2, y + 36, {
      align: "center",
    });

    doc.setFontSize(12);

    doc.text(formatearPrecio(totalConOpcional), anchoHoja / 2, y + 43, {
      align: "center",
    });

    doc.setFont(undefined, "normal");

    altoCajaTotal = 47;
  }

  doc.setDrawColor(...COLOR_GRIS_BORDE);
  doc.setLineWidth(0.2);
  doc.rect(margen, y, anchoUtil, altoCajaTotal);
  doc.setDrawColor(...COLOR_NEGRO);
  doc.setTextColor(...COLOR_NEGRO);

  y += altoCajaTotal + 3; // total → alternativas (o → footer, si no hay alternativas)

  // ALTERNATIVAS DE TRABAJO (nueva sección, solo si hay alternativas cargadas)

  if (alternativas?.length > 0) {
    y = dibujarAlternativas(doc, margen, y, anchoUtil, alternativas, precioFinal);
    y += 3; // alternativas → footer
  }

  // PIE DE PÁGINA: fondo gris oscuro, 3 bloques (Empresa | WhatsApp | Web)
  // separados por líneas verticales finas, con íconos chicos y genéricos.

  const altoFooter = 10;

  doc.setFillColor(...COLOR_GRIS_OSCURO);
  doc.rect(margen, y, anchoUtil, altoFooter, "F");

  const col1Ancho = anchoUtil * 0.4;
  const col2Ancho = anchoUtil * 0.28;
  const divisor1X = margen + col1Ancho;
  const divisor2X = margen + col1Ancho + col2Ancho;

  doc.setDrawColor(...COLOR_GRIS_BORDE);
  doc.setLineWidth(0.2);
  doc.line(divisor1X, y + 1.5, divisor1X, y + altoFooter - 1.5);
  doc.line(divisor2X, y + 1.5, divisor2X, y + altoFooter - 1.5);
  doc.setDrawColor(...COLOR_NEGRO);

  const baseLineFooter = y + altoFooter / 2 + 1.5;

  // Nombre de la empresa (izquierda)
  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLOR_BLANCO);
  doc.text("CARPINTERÍA Y HERRERÍA VALVERDE", margen + 4, baseLineFooter);

  // WhatsApp (centro), con ícono de "globo de chat" genérico
  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  const textoWhatsapp = "WhatsApp: +54 9 11 3638-5790";
  const anchoTextoWhatsapp = doc.getTextWidth(textoWhatsapp);
  const anchoIconoChat = 2.6;
  const espacioIconoTexto = 1.3;
  const centroCol2 = margen + col1Ancho + col2Ancho / 2;
  const inicioBloqueWhatsapp =
    centroCol2 - (anchoIconoChat + espacioIconoTexto + anchoTextoWhatsapp) / 2;

  dibujarIconoChat(
    doc,
    inicioBloqueWhatsapp,
    y + altoFooter / 2 - 1.6,
    anchoIconoChat,
    2,
  );
  doc.setTextColor(...COLOR_BLANCO);
  doc.text(
    textoWhatsapp,
    inicioBloqueWhatsapp + anchoIconoChat + espacioIconoTexto,
    baseLineFooter,
  );

  // Sitio web (derecha), con ícono de "globo" genérico
  const textoWeb = "www.carpinteriavalverde.com.ar";
  const anchoTextoWeb = doc.getTextWidth(textoWeb);
  const finBloqueWeb = margen + anchoUtil - 4;
  const inicioTextoWeb = finBloqueWeb - anchoTextoWeb;
  const radioGlobo = 1.3;

  dibujarIconoGlobo(
    doc,
    inicioTextoWeb - radioGlobo - 1.5,
    y + altoFooter / 2,
    radioGlobo,
  );
  doc.text(textoWeb, inicioTextoWeb, baseLineFooter);

  doc.setTextColor(...COLOR_NEGRO);

  y += altoFooter;

  doc.save(`${presupuesto.numero}.pdf`);
}
