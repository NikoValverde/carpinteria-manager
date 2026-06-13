import { useEffect, useState } from "react";
import {
  obtenerIntegrantes,
  crearIntegrante,
  eliminarIntegrante,
  actualizarIntegrante,
} from "../../services/integrantesService";

function IntegrantesPage() {
  const [integrantes, setIntegrantes] = useState([]);
  const [integranteEditando, setIntegranteEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [jornalActual, setJornalActual] = useState("");
  const [activo, setActivo] = useState(true);

  async function cargarIntegrantes() {
    try {
      const data = await obtenerIntegrantes();
      setIntegrantes(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await cargarIntegrantes();
    };

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (integranteEditando) {
        await actualizarIntegrante(integranteEditando.id, {
          nombre,
          porcentaje,
          jornal_actual: jornalActual,
          activo,
        });
      } else {
        await crearIntegrante({
          nombre,
          porcentaje,
          jornal_actual: jornalActual,
          activo,
        });
      }

      setNombre("");
      setPorcentaje("");
      setJornalActual("");
      setActivo(true);
      setIntegranteEditando(null);

      await cargarIntegrantes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Desea eliminar este integrante?");

    if (!confirmar) return;

    try {
      await eliminarIntegrante(id);

      await cargarIntegrantes();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditar(integrante) {
    setIntegranteEditando(integrante);

    setNombre(integrante.nombre || "");
    setPorcentaje(integrante.porcentaje || "");
    setJornalActual(integrante.jornal_actual || "");
    setActivo(integrante.activo);
  }

  return (
    <div>
      <h2>Integrantes</h2>

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
          <input
            type="number"
            placeholder="Porcentaje"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Jornal"
            value={jornalActual}
            onChange={(e) => setJornalActual(e.target.value)}
            min="0"
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            Activo
          </label>
        </div>

        <button type="submit">
          {integranteEditando ? "Guardar Cambios" : "Crear Integrante"}
        </button>
      </form>

      <hr />

      {integrantes.map((integrante) => (
        <div key={integrante.id}>
          <strong>{integrante.nombre}</strong>

          <p>Porcentaje: {integrante.porcentaje}%</p>

          <p>Jornal: ${integrante.jornal_actual}</p>

          <p>
            Estado:
            {integrante.activo ? " Activo" : " Inactivo"}
          </p>
          <button onClick={() => handleEditar(integrante)}>Editar</button>
          <button onClick={() => handleEliminar(integrante.id)}>
            Eliminar
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default IntegrantesPage;
