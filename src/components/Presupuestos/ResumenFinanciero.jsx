function redondear(valor, multiplo) {
  return Math.ceil(valor / multiplo) * multiplo;
}

function ResumenFinanciero({
  consumiblesImprevistos,
  setConsumiblesImprevistos,
  costoMateriales,
  costoManoObra,
  costoTotal,
  porcentajeGanancia,
  setPorcentajeGanancia,
  montoGanancia,
  flete,
  setFlete,
  precioTrabajo,
  precioFinal,
  setPrecioFinal,
  precioDesactualizado,
  diferenciaPrecio,
  totalConOpcional,
  guardarResumenFinanciero,
  aplicarPrecioFinal,
}) {
  return (
    <>
      <h2>Resumen Financiero</h2>

      <div>
        <label>Consumibles e Imprevistos</label>

        <input
          type="number"
          value={consumiblesImprevistos}
          onChange={(e) => setConsumiblesImprevistos(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      <p>
        <strong>Costo Materiales:</strong> $
        {costoMateriales.toLocaleString("es-AR")}
      </p>

      <p>
        <strong>Costo Mano de Obra:</strong> $
        {costoManoObra.toLocaleString("es-AR")}
      </p>

      <p>
        <strong>Subtotal Costos:</strong> ${costoTotal.toLocaleString("es-AR")}
      </p>

      <div>
        <label>Ganancia %</label>

        <input
          type="number"
          value={porcentajeGanancia}
          onChange={(e) => setPorcentajeGanancia(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      <p>
        <strong>Monto Ganancia:</strong> $
        {montoGanancia.toLocaleString("es-AR")}
      </p>

      <div>
        <label>Flete</label>

        <input
          type="number"
          value={flete}
          onChange={(e) => setFlete(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      <p>
        <strong>Precio Trabajo:</strong> $
        {precioTrabajo.toLocaleString("es-AR")}
      </p>

      <button
        type="button"
        onClick={() => aplicarPrecioFinal(redondear(precioTrabajo, 10000))}
      >
        Redondear a 10.000
      </button>

      <button
        type="button"
        onClick={() => aplicarPrecioFinal(redondear(precioTrabajo, 50000))}
      >
        Redondear a 50.000
      </button>

      <button
        type="button"
        onClick={() => aplicarPrecioFinal(redondear(precioTrabajo, 100000))}
      >
        Redondear a 100.000
      </button>

      <button
        type="button"
        onClick={() => aplicarPrecioFinal(Math.round(precioTrabajo))}
      >
        Copiar a Precio Final
      </button>

      <div>
        <label>
          <strong>Precio Final</strong>
        </label>

        <input
          type="number"
          value={precioFinal}
          onChange={(e) => setPrecioFinal(e.target.value)}
          onBlur={guardarResumenFinanciero}
        />
      </div>

      {precioDesactualizado && (
        <div>
          <p>⚠ El Precio Final fue modificado o quedó desactualizado.</p>

          <p>
            Diferencia: {diferenciaPrecio > 0 ? "+" : "-"}$
            {Math.abs(diferenciaPrecio).toLocaleString("es-AR")}
          </p>
        </div>
      )}

      {totalConOpcional > Number(precioFinal || 0) && (
        <p>
          <strong>Total con Opcional:</strong> $
          {totalConOpcional.toLocaleString("es-AR")}
        </p>
      )}
    </>
  );
}

export default ResumenFinanciero;
