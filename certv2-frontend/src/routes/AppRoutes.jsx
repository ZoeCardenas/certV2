import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardAnalista from "../pages/analista/DashboardAnalista";
import DashboardInvitado from "../pages/invitado/DashboardInvitado";
import ProtectedRoute from "../auth/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardAdmin />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analista/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin", "analista"]}>
          <DashboardAnalista />
        </ProtectedRoute>
      }
    />
    <Route
      path="/invitado/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin", "analista", "invitado"]}>
          <DashboardInvitado />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
