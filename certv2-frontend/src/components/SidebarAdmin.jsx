import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaWaveSquare,
  FaCertificate,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/sidebar.css";
import { useEffect, useState } from "react";
import { countAlertas } from "../services/alertaService";

const SidebarAdmin = () => {
  const [alertaCount, setAlertaCount] = useState(0);
  const nombre = localStorage.getItem("nombre") || "Administrador";
  const rol = localStorage.getItem("rol") || "admin";

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await countAlertas();
        setAlertaCount(count);
      } catch (e) {
        console.error("Error al contar alertas", e);
      }
    };
    fetchCount();
  }, []);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div
        className="logo"
        style={{ flexDirection: "column", alignItems: "center", marginBottom: "0.5rem" }}
      >
        <img
          src="/src/assets/capa8-logo.png"
          alt="Capa8"
          style={{ width: "80px", height: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Nombre sistema, nombre usuario y rol */}
      <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
        <div style={{ fontWeight: "600", fontSize: "1.05rem", color: "#fff" }}>
          CertWatcher
        </div>
        <div style={{ fontSize: "0.85rem", color: "#ccc", marginTop: "0.3rem" }}>
          {nombre}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#8fb3ce", marginTop: "0.2rem" }}>
          {rol.charAt(0).toUpperCase() + rol.slice(1)}
        </div>
      </div>

      {/* Menú */}
      <nav className="menu">
        <NavLink to="/admin/inicio" className="item">
          <FaHome /> <span>Inicio</span>
        </NavLink>

        <NavLink to="/admin/dashboard" className="item">
          <FaWaveSquare />
          <span>
            Monitoreo en
            <br />
            Tiempo Real
          </span>
        </NavLink>

        <NavLink to="/admin/alertas" className="item">
          <FaCertificate />
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Alertas en Tiempo Real
            {alertaCount > 0 && (
              <span className="badge-alerta">{alertaCount}</span>
            )}
          </span>
        </NavLink>

        <NavLink to="/admin/usuarios" className="item">
          <FaUsers /> <span>Usuarios</span>
        </NavLink>
      </nav>

      {/* Menú inferior */}
      <nav className="menu menu-bottom">
        <NavLink to="/admin/perfil" className="item">
          <FaUserCircle /> <span>Mi perfil</span>
        </NavLink>

        <button
          className="item logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          <FaSignOutAlt /> <span>Cerrar sesión</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="brand-footer">
        <img src="/src/assets/capa8-logo.png" alt="capa8" />
        <span style={{ fontSize: "0.75rem" }}>Capa8.com</span>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
