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

function PresupuestoDetallePage() {
  const { id } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const [materiales, setMateriales] = useState([]);
  const [materialesPresupuesto, setMaterialesPresupuesto] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [materialEditando, setMaterialEditando] = useState(null);

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

 
useEffect(() => {
  const fetchData = async () => {
    await cargarMateriales();
    await cargarMaterialesPresupuesto();
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

    if (!presupuesto) {
  return <p>Cargando...</p>;
}

const costoMateriales = materialesPresupuesto.reduce(
  (total, material) => total + Number(material.subtotal),
  0,
);

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

    {materialesPresupuesto.length === 0 && (
      <p>Todavía no hay materiales cargados.</p>
    )}
  </div>
);
}

export default PresupuestoDetallePage;
