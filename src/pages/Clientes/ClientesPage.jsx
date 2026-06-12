import { useEffect, useState } from "react";
import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente,
} from "../../services/clientesService";

function ClientesPage() {
  const [clientes, setClientes] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  async function cargarClientes() {
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const inicializar = async () => {
      await cargarClientes();
    };

    inicializar();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (clienteEditando) {
        await actualizarCliente(clienteEditando.id, {
          nombre,
          telefono,
          email,
          direccion,
          observaciones,
        });
      } else {
        console.log("CREANDO CLIENTE");

        await crearCliente({
          nombre,
          telefono,
          email,
          direccion,
          observaciones,
        });
      }

      setNombre("");
      setTelefono("");
      setEmail("");
      setDireccion("");
      setObservaciones("");
      setClienteEditando(null);

      await cargarClientes();
    } catch (error) {
      console.error("ERROR:", error);
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Desea eliminar este cliente?");

    if (!confirmar) return;

    try {
      const resultado = await eliminarCliente(id);

      console.log("RESULTADO:", resultado);

      await cargarClientes();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditar(cliente) {
    alert(`Editar: ${cliente.nombre}`);

    setClienteEditando(cliente);

    setNombre(cliente.nombre || "");
    setTelefono(cliente.telefono || "");
    setEmail(cliente.email || "");
    setDireccion(cliente.direccion || "");
    setObservaciones(cliente.observaciones || "");
  }

  return (
    <div>
      <h2>Clientes</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            autoComplete="tel"
            maxLength={20}
          />
        </div>

        <div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <input
            id="direccion"
            name="direccion"
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            maxLength={200}
          />
        </div>

        <div>
          <textarea
            id="observaciones"
            name="observaciones"
            placeholder="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit">
          {clienteEditando ? "Guardar Cambios" : "Crear Cliente"}
        </button>
      </form>

      <hr />

      {clientes.map((cliente) => (
        <div key={cliente.id}>
          <strong>{cliente.nombre}</strong>

          <p>{cliente.telefono}</p>

          <p>{cliente.email}</p>

          <p>{cliente.direccion}</p>

          <p>{cliente.observaciones}</p>

          <button onClick={() => handleEditar(cliente)}>Editar</button>

          <button onClick={() => handleEliminar(cliente.id)}>Eliminar</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default ClientesPage;
