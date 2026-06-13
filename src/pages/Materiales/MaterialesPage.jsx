import { useEffect, useState } from "react";
import {
  obtenerMateriales,
  crearMaterial,
  eliminarMaterial,
  actualizarMaterial,
} from "../../services/materialesService";

function MaterialesPage() {
  const [materiales, setMateriales] = useState([]);
  const [materialEditando, setMaterialEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("");
  const [precio, setPrecio] = useState("");

  async function cargarMateriales() {
    try {
      const data = await obtenerMateriales();
      setMateriales(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await cargarMateriales();
    };
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (materialEditando) {
        await actualizarMaterial(materialEditando.id, {
          nombre,
          categoria,
          unidad,
          precio,
        });
      } else {
        await crearMaterial({
          nombre,
          categoria,
          unidad,
          precio,
        });
      }

      setNombre("");
      setCategoria("");
      setUnidad("");
      setPrecio("");
      setMaterialEditando(null);

      await cargarMateriales();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Desea eliminar este material?");

    if (!confirmar) return;

    try {
      await eliminarMaterial(id);

      await cargarMateriales();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditar(material) {
    setMaterialEditando(material);

    setNombre(material.nombre || "");
    setCategoria(material.categoria || "");
    setUnidad(material.unidad || "");
    setPrecio(material.precio || "");
  }

  return (
    <div>
      <h2>Materiales</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>

            <option value="Melamina">Melamina</option>
            <option value="MDF">MDF</option>
            <option value="Herraje">Herraje</option>
            <option value="Caño">Caño</option>
            <option value="Chapa">Chapa</option>
            <option value="Vidrio">Vidrio</option>
            <option value="Aluminio">Aluminio</option>
            <option value="Policarbonato">Policarbonato</option>
            <option value="Pintura">Pintura</option>
            <option value="Consumible">Consumible</option>
            <option value="Madera">Madera</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <select
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            required
          >
            <option value="">Seleccione una unidad</option>

            <option value="Placa">Placa</option>
            <option value="Unidad">Unidad</option>
            <option value="Barra 6m">Barra 6m</option>
            <option value="Metro">Metro</option>
            <option value="m²">m²</option>
            <option value="Litro">Litro</option>
            <option value="Kg">Kg</option>
            <option value="Hoja">Hoja</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          {materialEditando ? "Guardar Cambios" : "Crear Material"}
        </button>
      </form>

      <hr />

      {materiales.map((material) => (
        <div key={material.id}>
          <strong>{material.nombre}</strong>
          <p>{material.categoria}</p>
          <p>{material.unidad}</p>
          <p>${material.precio}</p>
          <button onClick={() => handleEditar(material)}>Editar</button>
          <button onClick={() => handleEliminar(material.id)}>Eliminar</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default MaterialesPage;
