function MaterialesPresupuesto({
  materialNombre,
  setMaterialNombre,
  unidad,
  setUnidad,
  cantidad,
  setCantidad,
  precioUnitario,
  setPrecioUnitario,
  materialEditando,
  setMaterialEditando /* Agregado para permitir editar materiales */,
  materialesPresupuesto,
  costoMateriales,
  handleAgregarMaterial,
  handleEditarMaterial,
  handleEliminarMaterial,
}) {
  return (
    <>
      <h3>Materiales</h3>
      <form onSubmit={handleAgregarMaterial}>
        <input
          type="text"
          placeholder="Nombre del material"
          value={materialNombre}
          onChange={(e) => setMaterialNombre(e.target.value)}
          required
        />

        <select
          value={unidad}
          onChange={(e) => setUnidad(e.target.value)}
          required
        >
          <option value="">Unidad</option>

          <option value="Placa">Placa</option>
          <option value="Unidad">Unidad</option>
          <option value="Barra 6m">Barra 6m</option>
          <option value="Metro">Metro</option>
          <option value="m²">m²</option>
          <option value="Litro">Litro</option>
          <option value="Kg">Kg</option>
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Precio Unitario"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          required
        />

        <button type="submit">
          {materialEditando ? "Guardar Cambios" : "Agregar Material"}
        </button>
        {materialEditando && (
          <button
            type="button"
            onClick={() => {
              setMaterialEditando(null);
              setMaterialNombre("");
              setUnidad("");
              setCantidad("");
              setPrecioUnitario("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      {materialesPresupuesto.length === 0 ? (
        <p>Todavía no hay materiales cargados.</p>
      ) : (
        materialesPresupuesto.map((material) => (
          <div key={material.id}>
            <p>
              <strong>{material.material_nombre}</strong>
            </p>

            <p>
              {material.cantidad} {material.unidad}
            </p>

            <p>
              Precio Unitario: $
              {Number(material.precio_unitario).toLocaleString("es-AR")}
            </p>

            <p>
              Subtotal: ${Number(material.subtotal).toLocaleString("es-AR")}
            </p>

            <button onClick={() => handleEditarMaterial(material)}>
              Editar
            </button>

            <button onClick={() => handleEliminarMaterial(material.id)}>
              Eliminar
            </button>

            <hr />
          </div>
        ))
      )}

      <h4>Costo Materiales: ${costoMateriales.toLocaleString("es-AR")}</h4>

      <hr />
    </>
  );
}

export default MaterialesPresupuesto;
