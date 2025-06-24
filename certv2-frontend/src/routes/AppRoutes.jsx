// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import Inicio from "../pages/admin/Inicio";
import Usuarios from "../pages/admin/Usuarios";
import Perfil from "../pages/admin/Perfil";
import DashboardAnalista from "../pages/analista/DashboardAnalista";
import ProtectedRoute from "../auth/ProtectedRoute";

// ✅ Importa la vista de alertas
import Alertas from "../pages/admin/Alertas";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Panel de Admin */}
    <Route
      path="/admin/inicio"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Inicio />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardAdmin />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/usuarios"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Usuarios />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/perfil"
      element={
        <ProtectedRoute allowedRoles={['admin', 'analista']}>
          <Perfil />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/alertas"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Alertas />
        </ProtectedRoute>
      }
    />

    {/* Panel de Analista */}
    <Route
      path="/analista/dashboard"
      element={
        <ProtectedRoute allowedRoles={['admin', 'analista']}>
          <DashboardAnalista />
        </ProtectedRoute>
      }
    />

    <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
    <Route path="*" element={<h1>Página no encontrada</h1>} />
  </Routes>
);

export default AppRoutes;
