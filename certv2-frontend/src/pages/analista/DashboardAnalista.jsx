import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  listMonitoreos,
  createMonitoreo,
  toggleMonitoreo,
  updateDetalle,
  deleteMonitoreo,
  listDominios,  // Agregamos la importación de la función listDominios
} from "../../services/monitoreoService";

import MonitorTable from "../../components/MonitorTable";
import "../../styles/dashboard.css";

import { FaUsers, FaFileAlt, FaBell, FaServer, FaPlus } from "react-icons/fa";

// ───────── Tarjeta métrica ─────────
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

const DashboardAnalista = () => {
  /* métricas */
  const [stats, setStats] = useState({
    certificados: 0,
    alertas: 0,
    usuarios: 0,
    dominios: 0,
  });

  /* lista dominios */
  const [dominios, setDominios] = useState([]);
  const [loading, setLoading] = useState(true);

  /* modal CREAR */
  const [showCreate, setShowCreate] = useState(false);
  const [org, setOrg] = useState("");
  const [rows, setRows] = useState([{ dominio: "", palabra_clave: "" }]);

  /* modal DETALLE */
  const [detail, setDetail] = useState(null);

  /* modal EDITAR */
  const [edit, setEdit] = useState(null);
  const [editDom, setEditDom] = useState("");
  const [editKey, setEditKey] = useState("");

  /* ─── cargar dominios ─── */
  const fetchDominios = async () => {
    setLoading(true);
    try {
      // Obtiene los dominios de los monitoreos del analista (solo los del usuario actual)
      const data = await listDominios();  // Usamos la función listDominios en lugar de listMonitoreos

      // Asegúrate de que los datos de organización, dominio y palabra clave estén bien mapeados
      setDominios(
        data.map((d) => ({
          id: d.id,
          organizacion: d.organizacion ?? "—",  // Verifica que la organizacion esté presente
          dominio: d.dominio ?? "—", // Verifica que el dominio esté presente
          palabra_clave: d.palabra_clave ?? "—", // Se añadió aquí
          hora: new Date(d.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          country: "MX",
          location: "México",
          activo: d.activo ?? true,
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

  /* ─── crear monitoreo ─── */
  const addRow = () => setRows([...rows, { dominio: "", palabra_clave: "" }]);
  const changeRow = (i, f, v) => setRows(rows.map((r, idx) => (idx === i ? { ...r, [f]: v } : r)));

  const handleCreate = async () => {
    const detalles = rows
      .filter((r) => r.dominio.trim() && r.palabra_clave.trim())
      .map((r) => ({ dominio: r.dominio.trim(), palabra_clave: r.palabra_clave.trim() }));

    if (!org.trim() || !detalles.length) {
      alert("Completa organización y filas dominio/palabra");
      return;
    }

    try {
      await createMonitoreo({ organizacion: org.trim(), detalles });
      setShowCreate(false);
      setOrg("");
      setRows([{ dominio: "", palabra_clave: "" }]);
      fetchDominios();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error ?? "Error al crear monitoreo");
    }
  };

  /* ─── activar / desactivar ─── */
  const handleToggle = async (row) => {
    const ok = window.confirm(
      row.activo ? "¿Seguro que quieres desactivar este monitoreo?"
        : "¿Activar monitoreo?"
    );
    if (!ok) return;
    try {
      await toggleMonitoreo(row.id); // Llama a la función de servicio
      fetchDominios();  // Recarga los dominios después de cambiar el estado
    } catch (e) {
      console.error(e);
      alert("Error al cambiar estado");
    }
  };

  /* ─── editar ─── */
  const openEdit = (row) => {
    setEdit(row);
    setEditDom(row.dominio);
    setEditKey(row.coincidencia === "—" ? "" : row.coincidencia);
  };

  const saveEdit = async () => {
    if (!editDom.trim() || !editKey.trim()) {
      alert("Completa dominio y palabra clave");
      return;
    }
    try {
      await updateDetalle(edit.id, { dominio: editDom.trim(), palabra_clave: editKey.trim() });
      setEdit(null);  // Cierra el modal
      fetchDominios();  // Recarga los dominios
    } catch (e) {
      console.error(e);
      alert("Error al actualizar");
    }
  };

  /* ─── eliminar monitoreo ─── */
  const handleDelete = async (row) => {
    if (!window.confirm("¿Eliminar este detalle?")) return;
    try {
      await deleteMonitoreo(row.id);  // Llama a la función de servicio
      setDominios((d) => d.filter((x) => x.id !== row.id));  // Elimina el dominio localmente
    } catch (e) {
      console.error(e);
      alert("Error al eliminar");
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
          onClick={() => setShowCreate(true)}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Nuevo monitoreo
        </button>

        {/* métricas */}
        <section className="stats-grid">
          <StatCard icon={FaFileAlt} label="Certificados" value={stats.certificados} />
          <StatCard icon={FaBell} label="Alertas" value={stats.alertas} />
          <StatCard icon={FaUsers} label="Usuarios" value={stats.usuarios} />
          <StatCard icon={FaServer} label="Dominios" value={stats.dominios} />
        </section>

        {/* tabla */}
        <MonitorTable
          data={dominios}
          onDetail={setDetail}
          onToggle={handleToggle}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ───────── Modal CREAR ───────── */}
      {showCreate && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Nuevo monitoreo</h3>

            <label>Organización</label>
            <input value={org} onChange={(e) => setOrg(e.target.value)} />

            <label style={{ marginTop: 12 }}>Dominios & Palabras</label>
            {rows.map((r, i) => (
              <div key={i} className="row-flex">
                <input
                  placeholder="dominio"
                  value={r.dominio}
                  onChange={(e) => changeRow(i, "dominio", e.target.value)}
                />
                <input
                  placeholder="palabra clave"
                  value={r.palabra_clave}
                  onChange={(e) => changeRow(i, "palabra_clave", e.target.value)}
                />
              </div>
            ))}
            <button className="small-btn" onClick={addRow}>+ fila</button>

            <div className="modal-actions">
              <button className="grey-btn" onClick={() => setShowCreate(false)}>Cancelar</button>
              <button className="green-btn" onClick={handleCreate}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── Modal EDITAR ───────── */}
      {edit && (
        <div className="modal-backdrop" onClick={() => setEdit(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Editar dominio</h3>

            <label>Dominio</label>
            <input value={editDom} onChange={(e) => setEditDom(e.target.value)} />

            <label style={{ marginTop: 8 }}>Palabra clave</label>
            <input value={editKey} onChange={(e) => setEditKey(e.target.value)} />

            <div className="modal-actions" style={{ marginTop: 14 }}>
              <button className="grey-btn" onClick={() => setEdit(null)}>Cancelar</button>
              <button className="green-btn" onClick={saveEdit}>Guardar</button>
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
            <button className="green-btn" onClick={() => setDetail(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardAnalista;
