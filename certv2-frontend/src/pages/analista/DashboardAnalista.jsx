// src/pages/analista/DashboardAnalista.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  listDominios,
  createMonitoreo,
  toggleMonitoreo,
  updateDetalle,
  deleteDetalle,
} from "../../services/monitoreoService";
import MonitorTable from "../../components/MonitorTable";
import Swal from "sweetalert2";
import { showConfirm, showSuccess, showError } from "../../utils/swal";
import { FaPlus } from "react-icons/fa";
import "../../styles/dashboard.css";

const DashboardAnalista = () => {
  const [dominios, setDominios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para creación
  const [showCreate, setShowCreate] = useState(false);
  const [org, setOrg] = useState("");
  const [rows, setRows] = useState([{ dominio: "", palabra_clave: "" }]);

  // Estados para edición
  const [edit, setEdit] = useState(null);
  const [editDom, setEditDom] = useState("");
  const [editKey, setEditKey] = useState("");

  // Carga inicial y mapeo de datos
  const fetchDominios = async () => {
    setLoading(true);
    try {
      const data = await listDominios();
      setDominios(
        data.map((d) => ({
          id: d.id,
          monitoreoId: d.monitoreoId,
          organizacion: d.organizacion ?? "—",
          dominio: d.dominio ?? "—",
          coincidencia: d.palabra_clave ?? "—",
          hora: new Date(d.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          country: "MX",
          location: "México",
          activo: d.activo,
        }))
      );
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

  // Helpers para crear
  const addRow = () => setRows([...rows, { dominio: "", palabra_clave: "" }]);
  const changeRow = (idx, field, value) =>
    setRows(rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));

  // Crear nuevo monitoreo
  const handleCreate = async () => {
    const detalles = rows
      .filter((r) => r.dominio.trim() && r.palabra_clave.trim())
      .map((r) => ({
        dominio: r.dominio.trim(),
        palabra_clave: r.palabra_clave.trim(),
      }));
    if (!org.trim() || detalles.length === 0) {
      showError("Faltan datos", "Completa la organización y al menos un dominio/palabra.");
      return;
    }
    try {
      await createMonitoreo({ organizacion: org.trim(), detalles });
      showSuccess("Creado", "Monitoreo creado correctamente.");
      setShowCreate(false);
      setOrg("");
      setRows([{ dominio: "", palabra_clave: "" }]);
      await fetchDominios();
    } catch (e) {
      console.error(e);
      showError("Error", e.response?.data?.error ?? "Error al crear monitoreo");
    }
  };

  // Activar/Desactivar monitoreo
  const handleToggle = async (row) => {
    const ok = await showConfirm(
      row.activo ? "Desactivar monitoreo" : "Activar monitoreo",
      row.activo
        ? "¿Seguro que quieres desactivar este monitoreo?"
        : "¿Deseas activar este monitoreo?"
    );
    if (!ok) return;

    try {
      await toggleMonitoreo(row.monitoreoId);
      showSuccess("Hecho", `Monitoreo ${row.activo ? "desactivado" : "activado"}.`);
      await fetchDominios(); // recarga todo para reflejar cambio
    } catch (e) {
      console.error(e);
      showError("Error", "No se pudo cambiar el estado.");
    }
  };

  // Ver detalles en modal
  const handleDetail = (row) => {
    Swal.fire({
      title: "Detalle de dominio",
      html: `
        <p><b>ID detalle:</b> ${row.id}</p>
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

  // Abrir modal de edición
  const openEdit = (row) => {
    setEdit(row);
    setEditDom(row.dominio);
    setEditKey(row.coincidencia);
  };

  // Guardar cambios de edición
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
      await fetchDominios();
    } catch (e) {
      console.error(e);
      showError("Error", "No se pudo actualizar el detalle.");
    }
  };

  // Eliminar detalle
  const handleDelete = async (row) => {
    const ok = await showConfirm("Eliminar detalle", "¿Eliminar este detalle?");
    if (!ok) return;
    try {
      await deleteDetalle(row.id);
      showSuccess("Eliminado", "Detalle eliminado correctamente.");
      await fetchDominios();
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

        <MonitorTable
          data={dominios}
          onDetail={handleDetail}
          onToggle={handleToggle}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Crear */}
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
              style={{
                backgroundColor: "#38bdf8",
                color: "#000",
                marginBottom: 16,
              }}
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

      {/* Modal Editar */}
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
