function ManoObraPresupuesto({
  integrantes,
  integranteId,
  setIntegranteId,
  dias,
  setDias,
  manoObraPresupuesto,
  costoManoObra,
  handleAgregarManoObra,
  handleEliminarManoObra,
}) {
  return (
    <>
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
    </>
  );
}

export default ManoObraPresupuesto;
