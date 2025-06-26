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
        <header className="topbar">
          {/* Aquí ya no hay botón de logout */}
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
