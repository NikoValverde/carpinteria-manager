import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [clientes, setClientes] = useState([])

  async function obtenerClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('id')

    if (error) {
      console.error(error)
      return
    }

    setClientes(data)
  }

  useEffect(() => {
  const cargarClientes = async () => {
    await obtenerClientes()
  }

  cargarClientes()
}, [])

  return (
    <div>
      <h1>Carpintería Manager</h1>

      <h2>Clientes</h2>

      {clientes.map(cliente => (
        <div key={cliente.id}>
          <h3>{cliente.nombre}</h3>
          <p>{cliente.telefono}</p>
          <p>{cliente.email}</p>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default App