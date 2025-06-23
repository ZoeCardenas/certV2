import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import { listDominios, createMonitoreo } from "../../services/monitoreoService";
import MonitorTable from "../../components/MonitorTable";
import "../../styles/dashboard.css";

import { FaUsers, FaFileAlt, FaBell, FaServer, FaPlus } from "react-icons/fa";

/* Tarjeta genérica */
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="stat-card">
    <div className="icon-wrapper">
      <Icon size={28} />
    </div>
    <div className="text-wrapper">
      <span className="value">{value}</span>
      <span className="label">{label}</span>
    </div>
  </div>
);

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    certificados: 0,
    alertas: 0,
    usuarios: 0,
    dominios: 0,
  });
  const [dominios, setDominios] = useState([]);
  const [loading, setLoading] = useState(true);

  /* modal */
  const [showModal, setShowModal] = useState(false);
  const [org, setOrg] = useState("");
  const [rows, setRows] = useState([{ dominio: "", palabra_clave: "" }]);

  /* ─ carga dominios ─ */
  const fetchDominios = async () => {
    setLoading(true);
    try {
      const data = await listDominios();
      setDominios(
        data.map((d) => ({
          id: d.id,
          dominio: d.dominio,
          hora: new Date(d.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          coincidencia: d.palabra_clave ?? "—",
          conteo: "",
          country: "MX",
          location: "México",
        }))
      );
      setStats((s) => ({ ...s, dominios: data.length }));
    } catch (e) {
      console.error("Error cargando dominios:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDominios();
  }, []);

  /* ─ crear monitoreo ─ */
  const handleAddRow = () =>
    setRows([...rows, { dominio: "", palabra_clave: "" }]);

  const handleChangeRow = (idx, field, val) => {
    const copy = [...rows];
    copy[idx][field] = val;
    setRows(copy);
  };

  const handleCreate = async () => {
    // limpia filas vacías
    const detalles = rows.filter(
      (r) => r.dominio.trim() && r.palabra_clave.trim()
    );
    if (!org.trim() || detalles.length === 0) {
      alert("Completa organización y al menos un dominio/palabra");
      return;
    }
    try {
      await createMonitoreo({ organizacion: org, detalles });
      setShowModal(false);
      setOrg("");
      setRows([{ dominio: "", palabra_clave: "" }]);
      fetchDominios(); // refresca tabla
    } catch (e) {
      console.error(e);
      alert("Error al crear monitoreo");
    }
  };

  if (loading) return <div className="dashboard-loading">Cargando…</div>;

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        {/* botón crear */}
        <button
          className="logout-btn"
          style={{ marginBottom: "1.5rem", background: "#198754" }}
          onClick={() => setShowModal(true)}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Nuevo monitoreo
        </button>

        {/* tarjetas */}
        <section className="stats-grid">
          <StatCard icon={FaFileAlt} label="Certificados" value={stats.certificados} />
          <StatCard icon={FaBell}    label="Alertas"       value={stats.alertas} />
          <StatCard icon={FaUsers}   label="Usuarios"      value={stats.usuarios} />
          <StatCard icon={FaServer}  label="Dominios"      value={stats.dominios} />
        </section>

        {/* tabla */}
        <MonitorTable data={dominios} />
      </div>

      {/* ───────── Modal simple ───────── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "420px",
              background: "#0f1f2e",
              borderRadius: 12,
              padding: "1.5rem",
              color: "#eaf6ff",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Nuevo monitoreo</h3>

            <label>Organización</label>
            <input
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />

            <label>Dominios & Palabras</label>
            {rows.map((r, idx) => (
              <div key={idx} style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                <input
                  placeholder="dominio"
                  value={r.dominio}
                  onChange={(e) => handleChangeRow(idx, "dominio", e.target.value)}
                  style={{ flex: 1, padding: 6 }}
                />
                <input
                  placeholder="palabra clave"
                  value={r.palabra_clave}
                  onChange={(e) =>
                    handleChangeRow(idx, "palabra_clave", e.target.value)
                  }
                  style={{ flex: 1, padding: 6 }}
                />
              </div>
            ))}
            <button
              onClick={handleAddRow}
              style={{ background: "#4de0ff", border: "none", padding: "4px 10px", borderRadius: 6, marginBottom: 12 }}
            >
              + fila
            </button>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "#6c757d", border: "none", padding: "6px 16px", borderRadius: 6 }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                style={{ background: "#198754", border: "none", padding: "6px 16px", borderRadius: 6 }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardAdmin;
