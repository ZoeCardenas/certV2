// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Vistas de autenticación
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Vistas de administrador
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import Inicio from "../pages/admin/Inicio";
import Usuarios from "../pages/admin/Usuarios";
import Perfil from "../pages/admin/Perfil";
import Alertas from "../pages/admin/Alertas";

// Vistas de analista
import DashboardAnalista from "../pages/analista/DashboardAnalista";
import InicioAnalista from "../pages/analista/InicioAnalista";
import PerfilAnalista from "../pages/analista/Perfil";
import AlertasAnalista from "../pages/analista/Alertas";

// Ruta protegida
import ProtectedRoute from "../auth/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* Redirección base */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Rutas públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Rutas de administrador */}
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

    {/* Rutas de analista */}
    <Route
      path="/analista/inicio"
      element={
        <ProtectedRoute allowedRoles={['analista']}>
          <InicioAnalista />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analista/dashboard"
      element={
        <ProtectedRoute allowedRoles={['admin', 'analista']}>
          <DashboardAnalista />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analista/perfil"
      element={
        <ProtectedRoute allowedRoles={['analista']}>
          <PerfilAnalista />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analista/alertas"
      element={
        <ProtectedRoute allowedRoles={['analista']}>
          <AlertasAnalista />
        </ProtectedRoute>
      }
    />

    {/* Vistas por defecto */}
    <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
    <Route path="*" element={<h1>Página no encontrada</h1>} />
  </Routes>
);

export default AppRoutes;
