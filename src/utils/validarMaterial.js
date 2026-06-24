export function validarMaterial(nombre) {
  const advertencias = [];

  const texto = nombre.toLowerCase();

  // Melaminas
  if (texto.includes("melamina") && !/\d+\s?mm/i.test(texto)) {
    advertencias.push("Las melaminas suelen indicar el espesor.");
  }

  // Chapas - Usamos \b para buscar "chapa" como palabra completa
  if (/\bchapa\b/i.test(texto) && !/\d+([.,]\d+)?\s?mm/i.test(texto)) {
    advertencias.push("Las chapas suelen indicar el espesor.");
  }

  // Enchapados - Buscamos "enchapado" o "enchapados" como palabra completa
  if (/\benchapad[o|a|os|as]?\b/i.test(texto) && !/\d+\s?mm/i.test(texto)) {
    advertencias.push("Los enchapados suelen indicar el espesor.");
  }

  // MDF
  if (
    texto.includes("mdf") ||
    (texto.includes("fibro") && !/\d+\s?mm/i.test(texto))
  ) {
    advertencias.push("El MDF o Fibrofacil suele indicar el espesor.");
  }

  // Caños
  if (texto.includes("caño") && !/\d+\s?[x×*]\s?\d+/i.test(texto)) {
    advertencias.push("Parece faltar la medida del caño.");
  }

  // Perfiles
  if (texto.includes("perfil") && !/\d+/.test(texto)) {
    advertencias.push("Los perfiles suelen indicar una medida.");
  }

  // Vidrios
  if (texto.includes("vidrio") && !/\d+\s?mm/i.test(texto)) {
    advertencias.push("Los vidrios suelen indicar el espesor.");
  }

  // Maderas macizas
  if (
    (texto.includes("roble") ||
      texto.includes("incienso") ||
      texto.includes("alamo") ||
      texto.includes("lapacho") ||
      texto.includes("quebracho") ||
      texto.includes("anchico") ||
      texto.includes("kiri") ||
      texto.includes("eucalipto") ||
      texto.includes("petiribí") ||
      texto.includes("pino")) &&
    !/\d+/.test(texto)
  ) {
    advertencias.push("Las maderas macizas suelen indicar sección o espesor.");
  }

  // Herrajes
  if (
    (texto.includes("bisagra") ||
      texto.includes("tirador") ||
      texto.includes("guias") ||
      texto.includes("corredera")) &&
    !/\d+/.test(texto)
  ) {
    advertencias.push("El herraje suele indicar medida o modelo.");
  }

  // Terminaciones
  if (
    (texto.includes("laca") ||
      texto.includes("barniz") ||
      texto.includes("pintura")) &&
    !(
      texto.includes("mate") ||
      texto.includes("semimate") ||
      texto.includes("satinado") ||
      texto.includes("brillante")
    )
  ) {
    advertencias.push("La terminación suele indicar el acabado.");
  }

  return advertencias;
}
