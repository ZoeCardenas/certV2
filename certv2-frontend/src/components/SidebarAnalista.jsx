// src/components/SidebarAnalista.jsx
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaWaveSquare,
  FaCertificate,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/sidebar.css";
import { useEffect, useState } from "react";
import { countAlertas } from "../services/alertaService";

const SidebarAnalista = () => {
  const [alertaCount, setAlertaCount] = useState(0);

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
      <div className="logo">
        <img src="/capa8-logo.png" alt="CertWatcher" />
        <span>CertWatcher</span>
      </div>

      <nav className="menu">
        <NavLink to="/analista/dashboard" className="item">
          <FaHome /> <span>Inicio</span>
        </NavLink>

        <NavLink to="/analista/dashboard" className="item">
          <FaWaveSquare />
          <span>
            Monitoreo en
            <br />
            Tiempo Real
          </span>
        </NavLink>

        <NavLink to="/analista/alertas" className="item">
          <FaCertificate />
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Alertas en Tiempo Real
            {alertaCount > 0 && (
              <span className="badge-alerta">{alertaCount}</span>
            )}
          </span>
        </NavLink>
      </nav>

      <nav className="menu menu-bottom">
        <NavLink to="/analista/perfil" className="item">
          <FaUserCircle /> <span>Mi perfil</span>
        </NavLink>
      </nav>

      <div className="brand-footer">
        <img src="/capa8-logo.png" alt="capa8" />
      </div>
    </aside>
  );
};

export default SidebarAnalista;
