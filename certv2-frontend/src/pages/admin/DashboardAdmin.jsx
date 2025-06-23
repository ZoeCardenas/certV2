import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  listDominios,
  createMonitoreo,
} from "../../services/monitoreoService";

import MonitorTable from "../../components/MonitorTable";
import "../../styles/dashboard.css";

import {
  FaUsers,
  FaFileAlt,
  FaBell,
  FaServer,
  FaPlus,
} from "react-icons/fa";

/* Tarjeta métrica */
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
  /* métricas */
  const [stats, setStats] = useState({
    certificados: 0,
    alertas: 0,
    usuarios: 0,
    dominios: 0,
  });

  /* dominios mostrados */
  const [dominios, setDominios] = useState([]);
  const [loading, setLoading] = useState(true);

  /* modal CREAR */
  const [showModal, setShowModal] = useState(false);
  const [org, setOrg] = useState("");
  const [rows, setRows] = useState([{ dominio: "", palabra_clave: "" }]);

  /* modal DETALLE */
  const [detail, setDetail] = useState(null);

  /* ───────── carga inicial ───────── */
  const fetchDominios = async () => {
    setLoading(true);
    try {
      const data = await listDominios();

      setDominios(
        data.map((d) => ({
          id: d.id,
          organizacion: d.Monitoreo?.organizacion ?? "—",
          dominio: d.dominio,
          hora: new Date(d.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          coincidencia: d.palabra_clave ?? "—",
          country: "MX",
          location: "México",
          raw: d,
        }))
      );

      setStats((s) => ({ ...s, dominios: data.length }));
    } catch (e) {
      console.error("Error cargando dominios:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchDominios(); }, []);

  /* ───────── CRUD crear ───────── */
  const handleAddRow = () =>
    setRows([...rows, { dominio: "", palabra_clave: "" }]);

  const handleChangeRow = (i, f, v) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [f]: v } : r)));

  const handleCreate = async () => {
    const detalles = rows
      .filter((r) => r.dominio.trim() || r.palabra_clave.trim())
      .map((r) => ({
        dominio: r.dominio.trim(),
        palabra_clave: r.palabra_clave.trim(),
      }));

    if (!org.trim() || detalles.length === 0 || detalles.some((d) => !d.dominio || !d.palabra_clave)) {
      return alert("Completa organización y todas las filas dominio/palabra");
    }

    try {
      await createMonitoreo({ organizacion: org.trim(), detalles });
      setShowModal(false);
      setOrg("");
      setRows([{ dominio: "", palabra_clave: "" }]);
      fetchDominios();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error ?? "Error al crear monitoreo");
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

        {/* tabla + detalle */}
        <MonitorTable data={dominios} onDetail={(row) => setDetail(row)} />
      </div>

      {/* ───────── Modal CREAR ───────── */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Nuevo monitoreo</h3>

            <label>Organización</label>
            <input value={org} onChange={(e) => setOrg(e.target.value)} />

            <label>Dominios & Palabras</label>
            {rows.map((r, i) => (
              <div key={i} className="row-flex">
                <input
                  placeholder="dominio"
                  value={r.dominio}
                  onChange={(e) => handleChangeRow(i, "dominio", e.target.value)}
                />
                <input
                  placeholder="palabra clave"
                  value={r.palabra_clave}
                  onChange={(e) =>
                    handleChangeRow(i, "palabra_clave", e.target.value)
                  }
                />
              </div>
            ))}
            <button className="small-btn" onClick={handleAddRow}>
              + fila
            </button>

            <div className="modal-actions">
              <button className="grey-btn" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="green-btn" onClick={handleCreate}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── Modal DETALLE ───────── */}
      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Detalle dominio</h3>
            <p><b>ID:</b> {detail.id}</p>
            <p><b>Organización:</b> {detail.organizacion}</p>
            <p><b>Dominio:</b> {detail.dominio}</p>
            <p><b>Palabra clave:</b> {detail.coincidencia}</p>
            <p><b>Hora:</b> {detail.hora}</p>
            <button className="green-btn" onClick={() => setDetail(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardAdmin;
