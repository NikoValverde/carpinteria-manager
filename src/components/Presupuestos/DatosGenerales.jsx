function DatosGenerales({
  presupuesto,
  descripcion,
  setDescripcion,
  guardarDescripcion,
  observaciones,
  setObservaciones,
  guardarObservaciones,
}) {
  return (
    <>
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
    </>
  );
}

export default DatosGenerales;
