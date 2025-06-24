import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardAnalista from "../pages/analista/DashboardAnalista";
import ProtectedRoute from "../auth/ProtectedRoute";
import Register from "../pages/auth/Register";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardAdmin />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analista/dashboard"
      element={
        <ProtectedRoute allowedRoles={['admin','analista']}>
          <DashboardAnalista />
        </ProtectedRoute>
      }
    />

    <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
    <Route path="*" element={<h1>Página no encontrada</h1>} />
  </Routes>
);

export default AppRoutes;
