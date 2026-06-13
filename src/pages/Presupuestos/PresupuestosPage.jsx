import { useEffect, useState } from "react";
import {
  obtenerPresupuestos,
  crearPresupuesto,
} from "../../services/presupuestosService";
import { obtenerClientes } from "../../services/clientesService";

function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [titulo, setTitulo] = useState("");
  const [categoriaTrabajo, setCategoriaTrabajo] = useState("");
  const [clienteId, setClienteId] = useState("");

  const [tipoTrabajo, setTipoTrabajo] = useState("Carpintería");

  const [descripcion, setDescripcion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [notasInternas, setNotasInternas] = useState("");

  const [porcentajeGanancia, setPorcentajeGanancia] = useState(35);
  const [consumiblesImprevistos, setConsumiblesImprevistos] = useState(0);
  const [flete, setFlete] = useState(0);

  const [validezDias, setValidezDias] = useState(15);

  async function cargarPresupuestos() {
    try {
      const data = await obtenerPresupuestos();

      setPresupuestos(data);
    } catch (error) {
      console.error(error);
    }
  }

  function generarNumeroPresupuesto() {
    const siguiente = presupuestos.length + 1;

    return `PV-${String(siguiente).padStart(4, "0")}`;
  }

  async function cargarClientes() {
    try {
      const data = await obtenerClientes();

      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await cargarPresupuestos();
      await cargarClientes();
    };

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await crearPresupuesto({
        numero: generarNumeroPresupuesto(),

        cliente_id: Number(clienteId),

        titulo,
        categoria_trabajo: categoriaTrabajo,

        tipo_trabajo: tipoTrabajo,

        descripcion,
        observaciones,
        notas_internas: notasInternas,

        porcentaje_ganancia: porcentajeGanancia,

        consumibles_imprevistos: consumiblesImprevistos,

        flete,

        validez_dias: validezDias,
      });

      await cargarPresupuestos();

      setTitulo("");
      setCategoriaTrabajo("");
      setClienteId("");

      setDescripcion("");
      setObservaciones("");
      setNotasInternas("");
    } catch (error) {
      console.error(error);
    }
  }

  const presupuestosFiltrados = presupuestos.filter((presupuesto) => {
    const textoBusqueda = busqueda.toLowerCase();

    return (
      presupuesto.numero?.toLowerCase().includes(textoBusqueda) ||
      presupuesto.titulo?.toLowerCase().includes(textoBusqueda) ||
      presupuesto.categoria_trabajo?.toLowerCase().includes(textoBusqueda) ||
      presupuesto.clientes?.nombre?.toLowerCase().includes(textoBusqueda)
    );
  });

  return (
    <div>
      <h2>Presupuestos</h2>
      <input
        type="text"
        placeholder="Buscar por número, cliente, título o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <hr />
      <form onSubmit={handleSubmit}>
        <h3>Nuevo Presupuesto</h3>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <select
          value={categoriaTrabajo}
          onChange={(e) => setCategoriaTrabajo(e.target.value)}
          required
        >
          <option value="">Seleccionar categoría</option>

          <option>Amoblamiento de cocina</option>
          <option>Placard</option>
          <option>Vestidor</option>
          <option>Biblioteca</option>
          <option>Pérgola</option>
          <option>Puerta</option>
          <option>Portón</option>
          <option>Escalera</option>
          <option>Parrilla</option>
          <option>Otro</option>
        </select>

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
        >
          <option value="">Seleccionar cliente</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <button type="submit">Crear Presupuesto</button>
      </form>

      <hr />

      {presupuestosFiltrados.map((presupuesto) => (
        <div key={presupuesto.id}>
          <strong>{presupuesto.numero}</strong>

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

          <p>
            <strong>Precio Final:</strong> $
            {Number(presupuesto.precio_final || 0).toLocaleString("es-AR")}
          </p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default PresupuestosPage;
