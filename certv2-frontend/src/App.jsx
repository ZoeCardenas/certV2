import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardAnalista from "./pages/analista/DashboardAnalista";
import DashboardInvitado from "./pages/invitado/DashboardInvitado";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin", "analista"]} />}>
          <Route path="/analista/dashboard" element={<DashboardAnalista />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin", "analista", "invitado"]} />}>
          <Route path="/invitado/dashboard" element={<DashboardInvitado />} />
        </Route>

        <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
