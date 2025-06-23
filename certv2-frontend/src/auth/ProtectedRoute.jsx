import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  // El token se almacena como string tal cual
  const token = localStorage.getItem("token");      // ← sin JSON.parse
  const rol   = localStorage.getItem("rol");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
