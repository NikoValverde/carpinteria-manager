import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  obtenerPresupuestoPorId,
  actualizarPresupuesto,
  actualizarEstadoPresupuesto,
} from "../../services/presupuestosService";

import { PRESUPUESTO_ESTADOS } from "../../constants/presupuestoEstados";

import { calcularResumenFinanciero } from "../../domain/presupuesto/finanzas";

import {
  obtenerMaterialesPresupuesto,
  agregarMaterialPresupuesto,
  eliminarMaterialPresupuesto,
  actualizarMaterialPresupuesto,
} from "../../services/presupuestoMaterialesService";

import { obtenerIntegrantes } from "../../services/integrantesService";

import { obtenerAlternativas } from "../../services/alternativasService";

import {
  obtenerManoObraPresupuesto,
  agregarManoObraPresupuesto,
  eliminarManoObraPresupuesto,
} from "../../services/presupuestoManoObraService";

import ResumenFinanciero from "../../components/Presupuestos/ResumenFinanciero";
import MaterialesPresupuesto from "../../components/Presupuestos/MaterialesPresupuesto";
import ManoObraPresupuesto from "../../components/Presupuestos/ManoObraPresupuesto";
import DatosGenerales from "../../components/Presupuestos/DatosGenerales";
import AlternativasPresupuesto from "../../components/Presupuestos/AlternativasPresupuesto";

import { generarPDF } from "../../utils/pdfGenerator";

import {
  obtenerMateriales,
  crearMaterial,
} from "../../services/materialesService";

import { normalizarMaterial } from "../../utils/materiales";
import { validarMaterial } from "../../utils/validarMaterial";

function PresupuestoDetallePage() {
  const { id } = useParams();

  // Estado para presupuesto
  const [presupuesto, setPresupuesto] = useState(null);
  const [observaciones, setObservaciones] = useState("");

  {/*const [notasInternas, setNotasInternas] = useState("");*/}

  const [opcionales, setOpcionales] = useState("");
  const [precioOpcional, setPrecioOpcional] = useState(0);

  // Estado para alternativas de presupuesto
  const [alternativas, setAlternativas] = useState([]);
  

  // Estado para materiales
  const [materialesPresupuesto, setMaterialesPresupuesto] = useState([]);
  const [materialNombre, setMaterialNombre] = useState("");
  const [unidad, setUnidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [materialEditando, setMaterialEditando] = useState(null);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [materialesCatalogo, setMaterialesCatalogo] = useState([]);
  const [sugerenciasMateriales, setSugerenciasMateriales] = useState([]);
  const [advertenciasMaterial, setAdvertenciasMaterial] = useState([]);
  

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

  // Estado para el descuento (se aplica siempre sobre el Precio Final)
  const [descuentoTipo, setDescuentoTipo] = useState("porcentaje");
  const [descuentoValor, setDescuentoValor] = useState("");

  async function cargarMaterialesPresupuesto() {
    try {
      const data = await obtenerMaterialesPresupuesto(id);

      setMaterialesPresupuesto(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarCatalogoMateriales() {
    try {
      const data = await obtenerMateriales();

      setMaterialesCatalogo(data);
    } catch (error) {
      console.error("ERROR:", error);
    }
  }

function buscarMateriales(texto) {
  setMaterialNombre(texto);
  setAdvertenciasMaterial(validarMaterial(texto));
  setMaterialSeleccionado(null);

  if (!texto.trim()) {
    setSugerenciasMateriales([]);
    return;
  }

  const busqueda = texto.toLowerCase();

  // Coincidencias que comienzan con la búsqueda
  const empieza = materialesCatalogo.filter((material) =>
    material.nombre.toLowerCase().startsWith(busqueda),
  );

  // Coincidencias en palabras posteriores
  const contiene = materialesCatalogo.filter((material) => {
    const nombre = material.nombre.toLowerCase();

    return (
      !nombre.startsWith(busqueda) &&
      nombre.split(" ").some((palabra) => palabra.startsWith(busqueda))
    );
  });

  // Primero las principales y luego las secundarias
  setSugerenciasMateriales([...empieza, ...contiene].slice(0, 8));
}

function seleccionarMaterial(material) {
  setMaterialSeleccionado(material);
  setMaterialNombre(material.nombre);
  setUnidad(material.unidad || "");
  setPrecioUnitario(material.precio || "");
  setSugerenciasMateriales([]);
}

useEffect(() => {
}, [materialSeleccionado]);

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

  async function cargarAlternativas() {
    try {
      const data = await obtenerAlternativas(id);

      setAlternativas(data);
    } catch (error) {
      console.error(error);
    }
  }

  
  useEffect(() => {
    const fetchData = async () => {
      await cargarMaterialesPresupuesto();
      await cargarCatalogoMateriales();
      await cargarIntegrantes();
      await cargarManoObra();
      await cargarAlternativas();
      try {
        const data = await obtenerPresupuestoPorId(id);

        setPresupuesto(data);
        setPrecioFinal(data.precio_final || "");
        setFlete(data.flete || 0);
        setPorcentajeGanancia(data.porcentaje_ganancia || 35);
        setConsumiblesImprevistos(data.consumibles_imprevistos || 0);
        setDescripcion(data.descripcion || "");
        setObservaciones(data.observaciones || "");
        {/*setNotasInternas(data.notas_internas || "");*/}
        setOpcionales(data.opcionales || "");
        setPrecioOpcional(data.precio_opcional || 0);
        setDescuentoTipo(data.descuento_tipo || "porcentaje");
        setDescuentoValor(
          data.descuento_valor !== null && data.descuento_valor !== undefined
            ? data.descuento_valor
            : "",
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  async function handleAgregarMaterial(e) {
    e.preventDefault();

    try {
      const subtotal = Number(cantidad) * Number(precioUnitario);

      let materialId = null;

      if (materialSeleccionado) {
        materialId = materialSeleccionado.id;
      } else {
        const nuevoMaterial = await crearMaterial({
          nombre: normalizarMaterial(materialNombre),
          categoria: "General",
          unidad,
          precio: Number(precioUnitario),
        });

        materialId = nuevoMaterial[0].id;

        await cargarCatalogoMateriales();
      }

      if (materialEditando) {
        await actualizarMaterialPresupuesto(materialEditando.id, {
          material_id: materialId,

          material_nombre: materialNombre,

          cantidad: Number(cantidad),

          unidad,

          precio_unitario: Number(precioUnitario),

          subtotal,
        });
      } else {
        await agregarMaterialPresupuesto({
          presupuesto_id: Number(id),

          material_id: materialId,

          material_nombre: materialNombre,

          cantidad: Number(cantidad),

          unidad,

          precio_unitario: Number(precioUnitario),

          subtotal,
        });
      }

      setMaterialNombre("");
      setUnidad("");
      setCantidad("");
      setPrecioUnitario("");

      setMaterialEditando(null);
      setMaterialSeleccionado(null);
      setSugerenciasMateriales([]);

      await cargarMaterialesPresupuesto();
      await actualizarCostosPresupuesto();
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
      await actualizarCostosPresupuesto();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditarMaterial(material) {
    setMaterialEditando(material);

    setMaterialNombre(material.material_nombre || "");
    setUnidad(material.unidad || "");
    setCantidad(material.cantidad || "");
    setPrecioUnitario(material.precio_unitario || "");
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

  // Única fuente de verdad de las fórmulas financieras (dominio):
  // costos -> ganancia -> precio de trabajo -> descuento sobre el Precio Final.
  const resumenFinanciero = calcularResumenFinanciero({
    costoMateriales,
    costoManoObra,
    consumiblesImprevistos,
    porcentajeGanancia,
    flete,
    precioFinal,
    descuentoTipo,
    descuentoValor,
  });

  const {
    costoTotal,
    montoGanancia,
    precioTrabajo,
    diferenciaPrecio,
    precioDesactualizado,
    descuentoAplicado,
    descuentoValorNumerico,
    precioFinalConDescuento,
    errorDescuento,
  } = resumenFinanciero;

  const totalConOpcional =
    Number(precioFinal || 0) + Number(precioOpcional || 0);

  async function guardarResumenFinanciero() {
    try {
      const payload = {
        precio_final: Number(precioFinal) || 0,

        flete: Number(flete) || 0,

        porcentaje_ganancia: Number(porcentajeGanancia) || 0,

        monto_ganancia: Number(montoGanancia) || 0,

        precio_trabajo: Number(precioTrabajo) || 0,

        consumibles_imprevistos: Number(consumiblesImprevistos) || 0,
      };

      // Mientras el descuento sea inválido, no se persiste (se impide guardar)
      if (!errorDescuento) {
        payload.descuento_tipo = descuentoAplicado ? descuentoTipo : null;
        payload.descuento_valor = descuentoAplicado
          ? descuentoValorNumerico
          : null;
        payload.precio_final_con_descuento = descuentoAplicado
          ? precioFinalConDescuento
          : null;
      }

      await actualizarPresupuesto(id, payload);
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

      // Misma fórmula que en el render: no se reimplementa acá, se reutiliza el dominio.
      const resumenActualizado = calcularResumenFinanciero({
        costoMateriales: costoMaterialesActualizado,
        costoManoObra: costoManoObraActualizado,
        consumiblesImprevistos,
        porcentajeGanancia,
        flete,
        precioFinal,
        descuentoTipo,
        descuentoValor,
      });

      await actualizarPresupuesto(id, {
        costo_materiales: costoMaterialesActualizado,

        costo_mano_obra: costoManoObraActualizado,

        costo_total: resumenActualizado.costoTotal,

        monto_ganancia: resumenActualizado.montoGanancia,

        precio_trabajo: resumenActualizado.precioTrabajo,
      });
    } catch (error) {
      console.error(error);
    }
  }

  
  useEffect(() => {
    const fetchData = async () => {
    await cargarMaterialesPresupuesto();
    await cargarCatalogoMateriales();
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
      {/*setNotasInternas(data.notas_internas || "");*/}
      setOpcionales(data.opcionales || "");
      setPrecioOpcional(data.precio_opcional || 0);
      setDescuentoTipo(data.descuento_tipo || "porcentaje");
      setDescuentoValor(
        data.descuento_valor !== null && data.descuento_valor !== undefined
          ? data.descuento_valor
          : "",
      );
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [id]); // ⬅ Cierre correcto del useEffect
  

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

  {/* Componente para guardar notas internas 
  async function guardarNotasInternas() {
    try {
      await actualizarPresupuesto(id, {
        notas_internas: notasInternas,
      });
    } catch (error) {
      console.error(error);
    }
  }   */}

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

  async function handleCambiarEstado(nuevoEstado) {
    const estadoAnterior = presupuesto.estado;

    // Actualización optimista para reflejar el cambio sin recargar la página
    setPresupuesto((prev) => ({ ...prev, estado: nuevoEstado }));

    try {
      await actualizarEstadoPresupuesto(id, nuevoEstado);
    } catch (error) {
      console.error(error);

      // Si falla, se restaura el estado anterior
      setPresupuesto((prev) => ({ ...prev, estado: estadoAnterior }));
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

  if (!presupuesto) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="max-w-[1700px] mx-auto px-4 md:px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-6">
          {/*COMPONENTES DE DATOS GENERALES, OPCIONALES Y NOTAS, MATERIALES Y MANO DE OBRA*/}
          <DatosGenerales
            presupuesto={presupuesto}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            guardarDescripcion={guardarDescripcion}
            observaciones={observaciones}
            setObservaciones={setObservaciones}
            guardarObservaciones={guardarObservaciones}
            materiales={materialesPresupuesto}
            estadosDisponibles={PRESUPUESTO_ESTADOS}
            onCambiarEstado={handleCambiarEstado}
          />

          <AlternativasPresupuesto
            presupuestoId={id}
            alternativas={alternativas}
            setAlternativas={setAlternativas}
            precioFinal={precioFinal}
            descuentoTipo={descuentoTipo}
            descuentoValor={descuentoValor}
          />

          <MaterialesPresupuesto
            materialNombre={materialNombre}
            setMaterialNombre={buscarMateriales}
            sugerenciasMateriales={sugerenciasMateriales}
            advertenciasMaterial={advertenciasMaterial}
            materialSeleccionado={materialSeleccionado}
            seleccionarMaterial={seleccionarMaterial}
            unidad={unidad}
            setUnidad={setUnidad}
            cantidad={cantidad}
            setCantidad={setCantidad}
            precioUnitario={precioUnitario}
            setPrecioUnitario={setPrecioUnitario}
            materialEditando={materialEditando}
            setMaterialEditando={setMaterialEditando}
            materialesPresupuesto={materialesPresupuesto}
            costoMateriales={costoMateriales}
            handleAgregarMaterial={handleAgregarMaterial}
            handleEditarMaterial={handleEditarMaterial}
            handleEliminarMaterial={handleEliminarMaterial}
          />

          <ManoObraPresupuesto
            integrantes={integrantes}
            integranteId={integranteId}
            setIntegranteId={setIntegranteId}
            dias={dias}
            setDias={setDias}
            manoObraPresupuesto={manoObraPresupuesto}
            costoManoObra={costoManoObra}
            handleAgregarManoObra={handleAgregarManoObra}
            handleEliminarManoObra={handleEliminarManoObra}
          />

          <div className="flex justify-end">
            <button
              className="px-5 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition"
              onClick={() =>
                generarPDF({
                  presupuesto,
                  descripcion,
                  opcionales,
                  precioFinal,
                  precioOpcional,
                  totalConOpcional,
                  alternativas,
                })
              }
            >
              Generar PDF
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="xl:sticky xl:top-6 h-fit">
          <ResumenFinanciero
            consumiblesImprevistos={consumiblesImprevistos}
            setConsumiblesImprevistos={setConsumiblesImprevistos}
            costoMateriales={costoMateriales}
            costoManoObra={costoManoObra}
            costoTotal={costoTotal}
            porcentajeGanancia={porcentajeGanancia}
            setPorcentajeGanancia={setPorcentajeGanancia}
            montoGanancia={montoGanancia}
            flete={flete}
            setFlete={setFlete}
            precioTrabajo={precioTrabajo}
            precioFinal={precioFinal}
            setPrecioFinal={setPrecioFinal}
            precioDesactualizado={precioDesactualizado}
            diferenciaPrecio={diferenciaPrecio}
            totalConOpcional={totalConOpcional}
            guardarResumenFinanciero={guardarResumenFinanciero}
            aplicarPrecioFinal={aplicarPrecioFinal}
            alternativas={alternativas}
            descuentoTipo={descuentoTipo}
            setDescuentoTipo={setDescuentoTipo}
            descuentoValor={descuentoValor}
            setDescuentoValor={setDescuentoValor}
            errorDescuento={errorDescuento}
            precioFinalConDescuento={precioFinalConDescuento}
          />
        </div>
      </div>
    </div>
  );
}

export default PresupuestoDetallePage;
