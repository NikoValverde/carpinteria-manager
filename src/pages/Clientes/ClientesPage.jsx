import { useEffect, useState } from "react";
import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
} from "../../services/clientesService";

function ClientesPage() {
  const [clientes, setClientes] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

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
      await crearCliente({
        nombre,
        telefono,
        email,
      });

      setNombre("");
      setTelefono("");
      setEmail("");

      await cargarClientes();
    } catch (error) {
      console.error(error);
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

        <button type="submit">Crear Cliente</button>
      </form>

      <hr />

      {clientes.map((cliente) => (
        <div key={cliente.id}>
          <strong>{cliente.nombre}</strong>

          <p>{cliente.telefono}</p>

          <p>{cliente.email}</p>

          <button onClick={() => handleEliminar(cliente.id)}>Eliminar</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default ClientesPage;
