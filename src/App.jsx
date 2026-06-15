import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'

import ClientesPage from './pages/Clientes/ClientesPage'
import MaterialesPage from './pages/Materiales/MaterialesPage'
import IntegrantesPage from './pages/Integrantes/IntegrantesPage'
import PresupuestosPage from './pages/Presupuestos/PresupuestosPage'
import PresupuestoDetallePage from "./pages/Presupuestos/PresupuestoDetallePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<ClientesPage />} />
          <Route path="/materiales" element={<MaterialesPage />} />
          <Route path="/integrantes" element={<IntegrantesPage />} />
          <Route path="/presupuestos" element={<PresupuestosPage />} />
          <Route
            path="/presupuestos/:id"
            element={<PresupuestoDetallePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App