// src/layouts/DashboardLayout.jsx
import SidebarAdmin from "../components/SidebarAdmin";
import SidebarAnalista from "../components/SidebarAnalista";
import "../styles/dashboard.css";

const DashboardLayout = ({ children }) => {
  const rol = localStorage.getItem("rol");

  return (
    <div className="dashboard-wrapper">
      {rol === "analista" ? <SidebarAnalista /> : <SidebarAdmin />}

      <div className="content-area">
        {/* TOPBAR opcional */}
        <header className="topbar">
          <span className="greeting">👋 Hola, {rol}</span>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Cerrar sesión
          </button>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
