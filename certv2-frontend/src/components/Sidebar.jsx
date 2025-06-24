// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaWaveSquare,
  FaCertificate,
  FaUsers,
  FaUserCircle,  // importamos icono para "Mi perfil"
} from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => (
  <aside className="sidebar">
    <div className="logo">
      <img src="/capa8-logo.png" alt="CertWatcher" />
      <span>CertWatcher</span>
    </div>

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
      <NavLink to="/admin/certificados" className="item">
        <FaCertificate /> <span>Certificados</span>
      </NavLink>
      <NavLink to="/admin/usuarios" className="item">
        <FaUsers /> <span>Usuarios</span>
      </NavLink>
    </nav>

    {/* Nueva sección “Mi perfil” justo encima del footer */}
    <nav className="menu menu-bottom">
      <NavLink to="/admin/perfil" className="item">
        <FaUserCircle /> <span>Mi perfil</span>
      </NavLink>
    </nav>

    <div className="brand-footer">
      <img src="/capa8-logo.png" alt="capa8" />
    </div>
  </aside>
);

export default Sidebar;
