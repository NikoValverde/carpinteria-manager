import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { obtenerPresupuestoPorId } from "../../services/presupuestosService";
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

function PresupuestoDetallePage() {
  const { id } = useParams();

  // Estado para presupuesto
  const [presupuesto, setPresupuesto] = useState(null);

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
  } catch (error) {
    console.error(error);
  }
}

const costoManoObra = manoObraPresupuesto.reduce(
  (total, item) => total + Number(item.subtotal),
  0,
);

    if (!presupuesto) {
  return <p>Cargando...</p>;
}

const costoMateriales = materialesPresupuesto.reduce(
  (total, material) => total + Number(material.subtotal),
  0,
);

const costoTotal = costoMateriales + costoManoObra;
const ganancia = Number(precioFinal || 0) - costoTotal;

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
      <label>Precio Final</label>

      <input
        type="number"
        value={precioFinal}
        onChange={(e) => setPrecioFinal(e.target.value)}
      />
    </div>

    <p>
      <strong>Margen Comercial:</strong> ${ganancia.toLocaleString("es-AR")}
    </p>

    {materialesPresupuesto.length === 0 && (
      <p>Todavía no hay materiales cargados.</p>
    )}
  </div>
);
}

export default PresupuestoDetallePage;
