import { Link, Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
      <h1>Carpintería Manager</h1>

      <nav>
        <Link to="/">Clientes</Link> |{' '}
        <Link to="/materiales">Materiales</Link> |{' '}
        <Link to="/integrantes">Integrantes</Link> |{' '}
        <Link to="/presupuestos">Presupuestos</Link>
      </nav>

      <hr />

      <Outlet />
    </div>
  )
}

export default MainLayout