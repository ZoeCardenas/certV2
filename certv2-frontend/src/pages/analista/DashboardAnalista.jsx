// src/pages/analista/DashboardAnalista.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  listDominios,
  createMonitoreo,
  toggleMonitoreo,
  updateDetalle,
  deleteMonitoreo,
} from "../../services/monitoreoService";
import MonitorTable from "../../components/MonitorTable";
import Swal from "sweetalert2";
import { showConfirm, showSuccess, showError } from "../../utils/swal";
import { FaUsers, FaFileAlt, FaBell, FaServer, FaPlus } from "react-icons/fa";
import "../../styles/dashboard.css";

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
  const [stats, setStats] = useState({
    certificados: 0,
    alertas: 0,
    usuarios: 0,
    dominios: 0,
  });

  const [dominios, setDominios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [org, setOrg] = useState("");
  const [rows, setRows] = useState([{ dominio: "", palabra_clave: "" }]);

  const [edit, setEdit] = useState(null);
  const [editDom, setEditDom] = useState("");
  const [editKey, setEditKey] = useState("");

  const fetchDominios = async () => {
    setLoading(true);
    try {
      const data = await listDominios();
      setDominios(
        data.map((d) => ({
          id: d.id,
          organizacion: d.organizacion ?? "—",
          dominio: d.dominio ?? "—",
          coincidencia: d.palabra_clave ?? "—",
          hora: new Date(d.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          country: "MX",
          location: "México",
          activo: d.activo ?? true,
        }))
      );
      setStats((s) => ({ ...s, dominios: data.length }));
    } catch (e) {
      console.error(e);
      showError("Error", "No se pudieron cargar los dominios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDominios();
  }, []);

  const addRow = () => setRows([...rows, { dominio: "", palabra_clave: "" }]);
  const changeRow = (i, f, v) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [f]: v } : r)));

  const handleCreate = async () => {
    const detalles = rows
      .filter((r) => r.dominio.trim() && r.palabra_clave.trim())
      .map((r) => ({
        dominio: r.dominio.trim(),
        palabra_clave: r.palabra_clave.trim(),
      }));

    if (!org.trim() || !detalles.length) {
      showError("Faltan datos", "Completa la organización y al menos un dominio/palabra.");
      return;
    }

    try {
      await createMonitoreo({ organizacion: org.trim(), detalles });
      showSuccess("Creado", "Monitoreo creado correctamente.");
      setShowCreate(false);
      setOrg("");
      setRows([{ dominio: "", palabra_clave: "" }]);
      fetchDominios();
    } catch (e) {
      console.error(e);
      showError("Error", e.response?.data?.error ?? "Error al crear monitoreo");
    }
  };

  const handleToggle = async (row) => {
    const ok = await showConfirm(
      row.activo ? "Desactivar monitoreo" : "Activar monitoreo",
      row.activo
        ? "¿Seguro que quieres desactivar este monitoreo?"
        : "¿Deseas activar este monitoreo?"
    );
    if (!ok) return;

    try {
      await toggleMonitoreo(row.id);
      showSuccess("Hecho", `Monitoreo ${row.activo ? "desactivado" : "activado"}.`);
      setDominios((prev) =>
        prev.map((d) => (d.id === row.id ? { ...d, activo: !d.activo } : d))
      );
    } catch (e) {
      console.error(e);
      showError("Error", "No se pudo cambiar el estado.");
    }
  };

  const handleDetail = (row) => {
    Swal.fire({
      title: "Detalle de dominio",
      html: `
        <p><b>ID:</b> ${row.id}</p>
        <p><b>Organización:</b> ${row.organizacion}</p>
        <p><b>Dominio:</b> ${row.dominio}</p>
        <p><b>Palabra clave:</b> ${row.coincidencia}</p>
        <p><b>Hora:</b> ${row.hora}</p>
      `,
      confirmButtonText: "Cerrar",
      background: "#0e1b2c",
      color: "#fff",
      confirmButtonColor: "#16a34a",
    });
  };

  const openEdit = (row) => {
    setEdit(row);
    setEditDom(row.dominio);
    setEditKey(row.coincidencia);
  };

  const saveEdit = async () => {
    if (!editDom.trim() || !editKey.trim()) {
      showError("Faltan datos", "Completa dominio y palabra clave.");
      return;
    }
    try {
      await updateDetalle(edit.id, {
        dominio: editDom.trim(),
        palabra_clave: editKey.trim(),
      });
      showSuccess("Actualizado", "Detalle modificado correctamente.");
      setEdit(null);
      fetchDominios();
    } catch (e) {
      console.error(e);
      showError("Error", "No se pudo actualizar el detalle.");
    }
  };

  const handleDelete = async (row) => {
    const ok = await showConfirm("Eliminar detalle", "¿Eliminar este detalle?");
    if (!ok) return;
    try {
      await deleteMonitoreo(row.id);
      showSuccess("Eliminado", "Detalle eliminado correctamente.");
      setDominios((prev) => prev.filter((d) => d.id !== row.id));
    } catch (e) {
      console.error(e);
      showError("Error", "No se pudo eliminar el detalle.");
    }
  };

  if (loading) return <div className="dashboard-loading">Cargando…</div>;

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <button
          className="logout-btn"
          style={{ marginBottom: "1.5rem", background: "#198754" }}
          onClick={() => setShowCreate(true)}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Nuevo monitoreo
        </button>

        <section className="stats-grid">
          <StatCard icon={FaFileAlt} label="Certificados" value={stats.certificados} />
          <StatCard icon={FaBell} label="Alertas" value={stats.alertas} />
          <StatCard icon={FaUsers} label="Usuarios" value={stats.usuarios} />
          <StatCard icon={FaServer} label="Dominios" value={stats.dominios} />
        </section>

        <MonitorTable
          data={dominios}
          onDetail={handleDetail}
          onToggle={handleToggle}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal crear */}
      {showCreate && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Nuevo monitoreo</h3>
            <label>Organización</label>
            <input
              type="text"
              className="input"
              placeholder="Organización"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            />
            <label style={{ marginTop: 16 }}>Dominios & Palabras</label>
            {rows.map((r, i) => (
              <div key={i} className="row-flex" style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  className="input"
                  placeholder="dominio"
                  value={r.dominio}
                  onChange={(e) => changeRow(i, "dominio", e.target.value)}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="palabra clave"
                  value={r.palabra_clave}
                  onChange={(e) => changeRow(i, "palabra_clave", e.target.value)}
                />
              </div>
            ))}
            <button
              className="small-btn"
              style={{ backgroundColor: "#38bdf8", color: "#000", marginBottom: 16 }}
              onClick={addRow}
            >
              + fila
            </button>
            <div className="modal-actions">
              <button className="grey-btn" onClick={() => setShowCreate(false)}>
                Cancelar
              </button>
              <button className="green-btn" onClick={handleCreate}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {edit && (
        <div className="modal-backdrop" onClick={() => setEdit(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Editar dominio</h3>
            <label>Dominio</label>
            <input
              type="text"
              className="input"
              value={editDom}
              onChange={(e) => setEditDom(e.target.value)}
            />
            <label style={{ marginTop: 12 }}>Palabra clave</label>
            <input
              type="text"
              className="input"
              value={editKey}
              onChange={(e) => setEditKey(e.target.value)}
            />
            <div className="modal-actions" style={{ marginTop: 14 }}>
              <button className="grey-btn" onClick={() => setEdit(null)}>
                Cancelar
              </button>
              <button className="green-btn" onClick={saveEdit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardAnalista;
