import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const nombre = localStorage.getItem("nombre"); // 👈 obteniendo el nombre

  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Si quieres pasar el nombre como prop o usarlo:
  // console.log("Nombre del usuario:", nombre);

  return children;
};

export default ProtectedRoute;
