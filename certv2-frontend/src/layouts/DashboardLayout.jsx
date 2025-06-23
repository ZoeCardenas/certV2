import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const DashboardLayout = ({ children }) => (
  <div className="dashboard-wrapper">
    <Sidebar />

    <div className="content-area">
      {/* TOPBAR opcional */}
      <header className="topbar">
        <span className="greeting">👋 Hola, {localStorage.getItem("rol")}</span>
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

export default DashboardLayout;
