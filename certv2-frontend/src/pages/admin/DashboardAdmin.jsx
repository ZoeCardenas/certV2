import React from 'react';
import '../../styles/dashboard.css';

const DashboardAdmin = () => {
  const rol = localStorage.getItem("rol");
  const email = localStorage.getItem("email") || 'admin@example.com';

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {email} ({rol})</p>
      </header>

      <main className="dashboard-main">
        <div className="card">
          <h3>Usuarios</h3>
          <p>Gestión de analistas, invitados y roles.</p>
        </div>
        <div className="card">
          <h3>Organizaciones</h3>
          <p>Visualiza y administra los dominios registrados.</p>
        </div>
        <div className="card">
          <h3>Reportes</h3>
          <p>Exporta actividades y alertas encontradas.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
