import jsPDF from "jspdf";

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

// Función auxiliar para dibujar un recuadro con título centrado y texto adentro
function dibujarCaja(doc, x, y, ancho, titulo, texto, fontSizeTexto = 9) {
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text(titulo, x + ancho / 2, y + 6, { align: "center" });
  doc.setFont(undefined, "normal");

  doc.line(x, y + 9, x + ancho, y + 9);

  doc.setFontSize(fontSizeTexto);

  const lineas = doc.splitTextToSize(texto || "", ancho - 8);

  doc.text(lineas, x + 4, y + 15, { lineHeightFactor: 1.15 });

  const altoTexto = lineas.length * (fontSizeTexto / 2.2) + 19;

  doc.rect(x, y, ancho, altoTexto);

  return y + altoTexto;
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
}) {
  const doc = new jsPDF();

  const anchoHoja = 210;
  const margen = 15;
  const anchoUtil = anchoHoja - margen * 2;

  let y = margen;

  // ENCABEZADO (logo + "Presupuesto" ya incluido en la imagen)

  const altoLogo = (399 / 1774) * anchoUtil * 0.85; // ≈ 18mm con anchoUtil de 180mm

  try {
    const logoBase64 = await obtenerLogoBase64();
    doc.addImage(logoBase64, "PNG", margen, y, anchoUtil, altoLogo);
  } catch (error) {
    console.error("No se pudo cargar el logo:", error);
  }

  y += altoLogo;
  doc.rect(margen, margen, anchoUtil, altoLogo);

  y += 4;

  // RECUADRO CLIENTE / CONTACTO / FECHA / VALIDEZ (unificado, sin espacio entre filas)

  const anchoMitad = anchoUtil / 2;
  const altoFila = 6;
  const altoTotalDatos = altoFila * 4;

  doc.rect(margen, y, anchoUtil, altoTotalDatos);
  doc.line(margen + anchoMitad, y, margen + anchoMitad, y + altoTotalDatos);
  doc.line(margen, y + altoFila, margen + anchoUtil, y + altoFila);
  doc.line(margen, y + altoFila * 2, margen + anchoUtil, y + altoFila * 2);
  doc.line(margen, y + altoFila * 3, margen + anchoUtil, y + altoFila * 3);

  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  doc.text("CLIENTE", margen + 3, y + 4);
  doc.text("CONTACTO", margen + anchoMitad + 3, y + 4);

  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.text(presupuesto.clientes?.nombre || "", margen + 3, y + altoFila + 4);
  doc.text(
    presupuesto.clientes?.telefono || "-",
    margen + anchoMitad + 3,
    y + altoFila + 4,
  );

  const fechaActual = new Date();
  const fechaValidez = new Date(fechaActual);
  fechaValidez.setDate(fechaValidez.getDate() + 15);

  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  doc.text("FECHA", margen + 3, y + altoFila * 2 + 4);
  doc.text("VALIDEZ", margen + anchoMitad + 3, y + altoFila * 2 + 4);

  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.text(
    fechaActual.toLocaleDateString("es-AR"),
    margen + 3,
    y + altoFila * 3 + 4,
  );
  doc.text(
    fechaValidez.toLocaleDateString("es-AR"),
    margen + anchoMitad + 3,
    y + altoFila * 3 + 4,
  );

  y += altoTotalDatos + 4;

  // TÍTULO DEL TRABAJO

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text((presupuesto.titulo || "").toUpperCase(), anchoHoja / 2, y + 7, {
    align: "center",
  });
  doc.setFont(undefined, "normal");
  doc.rect(margen, y, anchoUtil, 11);

  y += 11 + 4;

  // DETALLE DE CONSTRUCCIÓN

  y = dibujarCaja(
    doc,
    margen,
    y,
    anchoUtil,
    "DETALLE DE CONSTRUCCIÓN",
    descripcion,
  );

  y += 4;

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

  // OPCIONALES (solo el texto descriptivo, sin los montos)

  if (opcionales?.trim()) {
    y = dibujarCaja(doc, margen, y, anchoUtil, "OPCIONALES", opcionales);
    y += 2;
  }

  // TOTAL PRESUPUESTADO (incluye Valor Opcional y Total con Opcional si corresponde)

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("TOTAL PRESUPUESTADO", anchoHoja / 2, y + 6, { align: "center" });
  doc.setFont(undefined, "normal");
  doc.line(margen, y + 9, margen + anchoUtil, y + 9);

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");

  doc.text(
    `$${Number(precioFinal || 0).toLocaleString("es-AR")}`,
    anchoHoja / 2,
    y + 18,
    {
      align: "center",
    },
  );

  doc.setFont(undefined, "normal");

  let altoCajaTotal = 24;

  if (opcionales?.trim()) {
    doc.line(margen + 20, y + 24, margen + anchoUtil - 20, y + 24);

    doc.setFontSize(9);

    doc.text(
      `Valor Opcional: $${Number(precioOpcional || 0).toLocaleString(
        "es-AR",
      )}`,
      anchoHoja / 2,
      y + 31,
      {
        align: "center",
      },
    );

    doc.setFont(undefined, "bold");

    doc.text(`TOTAL CON OPCIONAL`, anchoHoja / 2, y + 38, {
      align: "center",
    });

    doc.setFontSize(12);

    doc.text(
      `$${Number(totalConOpcional || 0).toLocaleString("es-AR")}`,
      anchoHoja / 2,
      y + 45,
      {
        align: "center",
      },
    );

    doc.setFont(undefined, "normal");

    altoCajaTotal = 50;
  }

  doc.rect(margen, y, anchoUtil, altoCajaTotal);

  y += altoCajaTotal + 4;

  // PIE DE PÁGINA (una sola línea)

  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  doc.text("CARPINTERÍA Y HERRERÍA VALVERDE", margen + 4, y + 7);
  doc.setFont(undefined, "normal");
  doc.text(
    "WhatsApp: +54 9 11 3638-5790   |   www.carpinteriavalverde.com.ar/",
    anchoUtil + margen - 4,
    y + 7,
    { align: "right" },
  );

  doc.rect(margen, y, anchoUtil, 11);

  y += 11;

  console.log("y final:", y, "alto hoja A4:", 297);

  doc.save(`${presupuesto.numero}.pdf`);
}
