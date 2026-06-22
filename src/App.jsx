import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ClientesPage from "./pages/Clientes/ClientesPage";
import MaterialesPage from "./pages/Materiales/MaterialesPage";
import IntegrantesPage from "./pages/Integrantes/IntegrantesPage";
import PresupuestosPage from "./pages/Presupuestos/PresupuestosPage";
import PresupuestoDetallePage from "./pages/Presupuestos/PresupuestoDetallePage";

import LoginPage from "./pages/Auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<ClientesPage />} />

          <Route path="/materiales" element={<MaterialesPage />} />

          <Route path="/integrantes" element={<IntegrantesPage />} />

          <Route path="/presupuestos" element={<PresupuestosPage />} />

          <Route
            path="/presupuestos/:id"
            element={<PresupuestoDetallePage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
