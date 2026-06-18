import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  obtenerPresupuestoPorId,
  actualizarPresupuesto,
} from "../../services/presupuestosService";
import { obtenerMateriales } from "../../services/materialesService";

import {
  obtenerMaterialesPresupuesto,
  agregarMaterialPresupuesto,
  eliminarMaterialPresupuesto,
  actualizarMaterialPresupuesto,
} from "../../services/presupuestoMaterialesService";

import { obtenerIntegrantes } from "../../services/integrantesService";

import {
  obtenerManoObraPresupuesto,
  agregarManoObraPresupuesto,
  eliminarManoObraPresupuesto,
} from "../../services/presupuestoManoObraService";

import jsPDF from "jspdf";

function PresupuestoDetallePage() {
  const { id } = useParams();

  // Estado para presupuesto
  const [presupuesto, setPresupuesto] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [notasInternas, setNotasInternas] = useState("");
  const [opcionales, setOpcionales] = useState("");
  const [precioOpcional, setPrecioOpcional] = useState(0);

  // Estado para materiales
  const [materiales, setMateriales] = useState([]);
  const [materialesPresupuesto, setMaterialesPresupuesto] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [materialEditando, setMaterialEditando] = useState(null);

  // Estado para mano de obra
  const [integrantes, setIntegrantes] = useState([]);
  const [manoObraPresupuesto, setManoObraPresupuesto] = useState([]);
  const [integranteId, setIntegranteId] = useState("");
  const [dias, setDias] = useState("");
  const [precioFinal, setPrecioFinal] = useState("");
  const [consumiblesImprevistos, setConsumiblesImprevistos] = useState(0);
  const [porcentajeGanancia, setPorcentajeGanancia] = useState(35);
  const [descripcion, setDescripcion] = useState("");
  const [flete, setFlete] = useState(0);

  async function cargarMateriales() {
    try {
      const data = await obtenerMateriales();

      setMateriales(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarMaterialesPresupuesto() {
    try {
      const data = await obtenerMaterialesPresupuesto(id);

      setMaterialesPresupuesto(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarIntegrantes() {
    try {
      const data = await obtenerIntegrantes();

      setIntegrantes(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarManoObra() {
    try {
      const data = await obtenerManoObraPresupuesto(id);

      setManoObraPresupuesto(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await cargarMateriales();
      await cargarMaterialesPresupuesto();
      await cargarIntegrantes();
      await cargarManoObra();
      try {
        const data = await obtenerPresupuestoPorId(id);

        setPresupuesto(data);
        setPrecioFinal(data.precio_final || "");
        setFlete(data.flete || 0);
        setPorcentajeGanancia(data.porcentaje_ganancia || 35);
        setConsumiblesImprevistos(data.consumibles_imprevistos || 0);
        setDescripcion(data.descripcion || "");
        setObservaciones(data.observaciones || "");
        setNotasInternas(data.notas_internas || "");
        setOpcionales(data.opcionales || "");
        setPrecioOpcional(data.precio_opcional || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  async function handleAgregarMaterial(e) {
    e.preventDefault();

    try {
      const materialSeleccionado = materiales.find(
        (m) => m.id === Number(materialId),
      );

      if (!materialSeleccionado) {
        throw new Error("Material no encontrado");
      }

      const subtotal = Number(cantidad) * Number(materialSeleccionado.precio);

      if (materialEditando) {
        await actualizarMaterialPresupuesto(materialEditando.id, {
          material_id: materialSeleccionado.id,
          material_nombre: materialSeleccionado.nombre,
          cantidad: Number(cantidad),
          unidad: materialSeleccionado.unidad,
          precio_unitario: materialSeleccionado.precio,
          subtotal,
        });
      } else {
        await agregarMaterialPresupuesto({
          presupuesto_id: Number(id),
          material_id: materialSeleccionado.id,
          material_nombre: materialSeleccionado.nombre,
          cantidad: Number(cantidad),
          unidad: materialSeleccionado.unidad,
          precio_unitario: materialSeleccionado.precio,
          subtotal,
        });
      }

      setMaterialId("");
      setCantidad("");
      setMaterialEditando(null);
      await cargarMaterialesPresupuesto();
    } catch (error) {
      console.error("Error al agregar/editar material:", error);
    }
  }

  async function handleEliminarMaterial(id) {
    const confirmar = window.confirm("¿Desea eliminar este material?");

    if (!confirmar) return;

    try {
      await eliminarMaterialPresupuesto(id);

      await cargarMaterialesPresupuesto();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditarMaterial(material) {
    setMaterialEditando(material);

    setMaterialId(material.material_id);
    setCantidad(material.cantidad);
  }

  const integrantesActivos = integrantes.filter((i) => i.activo);

  async function handleAgregarManoObra(e) {
    e.preventDefault();

    try {
      if (integranteId === "todos") {
        try {
          const integrantesFaltantes = integrantesActivos.filter(
            (integrante) =>
              !manoObraPresupuesto.some(
                (item) => item.integrante_id === integrante.id,
              ),
          );

          if (integrantesFaltantes.length === 0) {
            alert("Todos los integrantes ya están agregados al presupuesto.");
            return;
          }

          for (const integrante of integrantesFaltantes) {
            const subtotal = Number(dias) * Number(integrante.jornal_actual);

            await agregarManoObraPresupuesto({
              presupuesto_id: Number(id),

              integrante_id: integrante.id,

              integrante_nombre: integrante.nombre,

              dias: Number(dias),

              jornal_utilizado: integrante.jornal_actual,

              subtotal,
            });
          }

          setIntegranteId("");
          setDias("");

          await cargarManoObra();
          await actualizarCostosPresupuesto();

          return;
        } catch (error) {
          console.error(error);
        }
      }

      const integrante = integrantes.find((i) => i.id === Number(integranteId));

      const yaExiste = manoObraPresupuesto.some(
        (item) => item.integrante_id === Number(integranteId),
      );

      if (yaExiste) {
        alert("Ese integrante ya está agregado al presupuesto.");
        return;
      }

      if (!integrante) {
        throw new Error("Integrante no encontrado");
      }

      const subtotal = Number(dias) * Number(integrante.jornal_actual);

      await agregarManoObraPresupuesto({
        presupuesto_id: Number(id),

        integrante_id: integrante.id,

        integrante_nombre: integrante.nombre,

        dias: Number(dias),

        jornal_utilizado: integrante.jornal_actual,

        subtotal,
      });

      setIntegranteId("");
      setDias("");

      await cargarManoObra();
      await actualizarCostosPresupuesto();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEliminarManoObra(id) {
    const confirmar = window.confirm("¿Desea eliminar esta mano de obra?");

    if (!confirmar) return;

    try {
      await eliminarManoObraPresupuesto(id);

      await cargarManoObra();

      await actualizarCostosPresupuesto();
    } catch (error) {
      console.error(error);
    }
  }

  const costoManoObra = manoObraPresupuesto.reduce(
    (total, item) => total + Number(item.subtotal),
    0,
  );

  const costoMateriales = materialesPresupuesto.reduce(
    (total, material) => total + Number(material.subtotal),
    0,
  );

  const costoTotal =
    costoMateriales + costoManoObra + Number(consumiblesImprevistos || 0);

  const montoGanancia = costoTotal * (Number(porcentajeGanancia) / 100);

  // Valor del trabajo sin considerar flete
  const precioTrabajo = costoTotal + montoGanancia;

  const precioCalculado = precioTrabajo + Number(flete || 0);

  const totalConOpcional =
    Number(precioFinal || 0) + Number(precioOpcional || 0);

  async function guardarResumenFinanciero() {
    try {
      await actualizarPresupuesto(id, {
        precio_final: Number(precioFinal) || 0,

        flete: Number(flete) || 0,

        porcentaje_ganancia: Number(porcentajeGanancia) || 0,

        monto_ganancia: Number(montoGanancia) || 0,

        precio_trabajo: Number(precioTrabajo) || 0,

        consumibles_imprevistos: Number(consumiblesImprevistos) || 0,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function actualizarCostosPresupuesto() {
    try {
      const materialesActualizados = await obtenerMaterialesPresupuesto(id);

      const manoObraActualizada = await obtenerManoObraPresupuesto(id);

      const costoMaterialesActualizado = materialesActualizados.reduce(
        (total, material) => total + Number(material.subtotal),
        0,
      );

      const costoManoObraActualizado = manoObraActualizada.reduce(
        (total, item) => total + Number(item.subtotal),
        0,
      );

      const costoTotalActualizado =
        costoMaterialesActualizado + costoManoObraActualizado;

      const montoGananciaActualizado =
        costoTotalActualizado * (Number(porcentajeGanancia) / 100);

      const precioTrabajoActualizado =
        costoTotalActualizado + montoGananciaActualizado;

      await actualizarPresupuesto(id, {
        costo_materiales: costoMaterialesActualizado,

        costo_mano_obra: costoManoObraActualizado,

        costo_total: costoTotalActualizado,

        monto_ganancia: montoGananciaActualizado,

        precio_trabajo: precioTrabajoActualizado,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function redondear(valor, multiplo) {
    return Math.ceil(valor / multiplo) * multiplo;
  }

  async function guardarDescripcion() {
    try {
      await actualizarPresupuesto(id, {
        descripcion,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function guardarObservaciones() {
    try {
      await actualizarPresupuesto(id, {
        observaciones,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function guardarNotasInternas() {
    try {
      await actualizarPresupuesto(id, {
        notas_internas: notasInternas,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function aplicarPrecioFinal(nuevoPrecio) {
    try {
      setPrecioFinal(nuevoPrecio);

      await actualizarPresupuesto(id, {
        precio_final: nuevoPrecio,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function guardarOpcionales() {
    try {
      await actualizarPresupuesto(id, {
        opcionales,
        precio_opcional: Number(precioOpcional) || 0,
      });
    } catch (error) {
      console.error(error);
    }
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

  // Función para generar el PDF del presupuesto
  async function generarPDF() {
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
      y += 4;
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
      y + 19,
      { align: "center" },
    );
    doc.setFont(undefined, "normal");

    let altoCajaTotal = 23;

    if (opcionales?.trim()) {
      doc.setFontSize(9);
      doc.text(
        `Valor Opcional: $${Number(precioOpcional || 0).toLocaleString("es-AR")}`,
        anchoHoja / 2,
        y + 26,
        { align: "center" },
      );
      doc.text(
        `Total con Opcional: $${Number(totalConOpcional || 0).toLocaleString("es-AR")}`,
        anchoHoja / 2,
        y + 32,
        { align: "center" },
      );

      altoCajaTotal = 35;
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

  if (!presupuesto) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>{presupuesto.numero}</h2>

      <p>
        <strong>Título:</strong> {presupuesto.titulo}
      </p>

      <p>
        <strong>Categoría:</strong> {presupuesto.categoria_trabajo}
      </p>

      <p>
        <strong>Cliente:</strong> {presupuesto.clientes?.nombre}
      </p>

      <p>
        <strong>Tipo:</strong> {presupuesto.tipo_trabajo}
      </p>

      <p>
        <strong>Estado:</strong> {presupuesto.estado}
      </p>

      <hr />

      <div>
        <label>Detalles de Construcción</label>

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onBlur={guardarDescripcion}
          rows={5}
          placeholder="Describa el trabajo a realizar..."
        />
      </div>

      <div>
        <label>Observaciones</label>

        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          onBlur={guardarObservaciones}
          rows={4}
        />
      </div>

      <h3>Opcionales</h3>

      <textarea
        value={opcionales}
        onChange={(e) => setOpcionales(e.target.value)}
        onBlur={guardarOpcionales}
        rows={4}
      />

      <div>
        <label>Valor Opcional</label>

        <input
          type="number"
          value={precioOpcional}
          onChange={(e) => setPrecioOpcional(e.target.value)}
          onBlur={guardarOpcionales}
        />
      </div>

      <div>
        <label>Notas Internas</label>
        <small>No se imprime en el PDF</small>

        <textarea
          value={notasInternas}
          onChange={(e) => setNotasInternas(e.target.value)}
          onBlur={guardarNotasInternas}
          rows={4}
        />
      </div>

      <h3>Materiales</h3>
      <form onSubmit={handleAgregarMaterial}>
        <select
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          required
        >
          <option value="">Seleccionar material</option>

          {materiales.map((material) => (
            <option key={material.id} value={material.id}>
              {material.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />

        <button type="submit">
          {materialEditando ? "Guardar Cambios" : "Agregar Material"}
        </button>
      </form>
      {materialesPresupuesto.map((material) => (
        <div key={material.id}>
          <p>
            <strong>{material.material_nombre}</strong>
          </p>

          <p>
            {material.cantidad} {material.unidad}
          </p>

          <p>${Number(material.subtotal).toLocaleString("es-AR")}</p>

          <button onClick={() => handleEditarMaterial(material)}>Editar</button>

          <button onClick={() => handleEliminarMaterial(material.id)}>
            Eliminar
          </button>

          <hr />
        </div>
      ))}

      <h4>Costo Materiales: ${costoMateriales.toLocaleString("es-AR")}</h4>

      <hr />

      <h3>Mano de Obra</h3>

      <form onSubmit={handleAgregarManoObra}>
        <select
          value={integranteId}
          onChange={(e) => setIntegranteId(e.target.value)}
          required
        >
          <option value="">Seleccionar integrante</option>
          <option value="todos">Todos</option>

          {integrantes.map((integrante) => (
            <option key={integrante.id} value={integrante.id}>
              {integrante.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.5"
          placeholder="Días"
          value={dias}
          onChange={(e) => setDias(e.target.value)}
          required
        />

        <button type="submit">Agregar Mano de Obra</button>
      </form>

      {manoObraPresupuesto.map((item) => (
        <div key={item.id}>
          <p>
            <strong>{item.integrante_nombre}</strong>
          </p>

          <p>{item.dias} días</p>

          <p>${Number(item.subtotal).toLocaleString("es-AR")}</p>

          <button onClick={() => handleEliminarManoObra(item.id)}>
            Eliminar
          </button>

          <hr />
        </div>
      ))}

      <h4>Costo Mano de Obra: ${costoManoObra.toLocaleString("es-AR")}</h4>
      <hr />

      <h3>Costo Total: ${costoTotal.toLocaleString("es-AR")}</h3>

      <hr />

      <h2>Resumen Financiero</h2>
      <div>
        <label>Consumibles e Imprevistos</label>

        <input
          type="number"
          value={consumiblesImprevistos}
          onChange={(e) => setConsumiblesImprevistos(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      <p>
        <strong>Costo Materiales:</strong> $
        {costoMateriales.toLocaleString("es-AR")}
      </p>

      <p>
        <strong>Costo Mano de Obra:</strong> $
        {costoManoObra.toLocaleString("es-AR")}
      </p>

      <p>
        <strong>Costo Total:</strong> ${costoTotal.toLocaleString("es-AR")}
      </p>

      <div>
        <label>Ganancia %</label>

        <input
          type="number"
          value={porcentajeGanancia}
          onChange={(e) => setPorcentajeGanancia(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      <p>
        <strong>Monto Ganancia:</strong> $
        {montoGanancia.toLocaleString("es-AR")}
      </p>

      <div>
        <label>Flete</label>

        <input
          type="number"
          value={flete}
          onChange={(e) => setFlete(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      <p>
        <strong>Precio Calculado:</strong> $
        {precioCalculado.toLocaleString("es-AR")}
      </p>
      <button
        type="button"
        onClick={() => aplicarPrecioFinal(redondear(precioCalculado, 10000))}
      >
        Redondear a 10.000
      </button>

      <button
        type="button"
        onClick={() => aplicarPrecioFinal(redondear(precioCalculado, 50000))}
      >
        Redondear a 50.000
      </button>

      <button
        type="button"
        onClick={() => aplicarPrecioFinal(redondear(precioCalculado, 100000))}
      >
        Redondear a 100.000
      </button>

      <button
        type="button"
        onClick={() => aplicarPrecioFinal(Math.round(precioCalculado))}
      >
        Copiar a Precio Final
      </button>

      <div>
        <label>
          <strong>Precio Final</strong>
        </label>

        <input
          type="number"
          value={precioFinal}
          onChange={(e) => setPrecioFinal(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      <p>
        <strong>Total con Opcional:</strong> $
        {totalConOpcional.toLocaleString("es-AR")}
      </p>

      <button onClick={generarPDF}>Generar PDF</button>

      {materialesPresupuesto.length === 0 && (
        <p>Todavía no hay materiales cargados.</p>
      )}
    </div>
  );
}

export default PresupuestoDetallePage;
