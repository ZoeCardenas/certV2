import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(rol)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;
