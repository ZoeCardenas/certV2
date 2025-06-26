import api from "./api";

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return { Authorization: `Bearer ${token}` };
};

/* ════════════════════════════════
   MONITOREOS (Admin & Analista)
═════════════════════════════════*/

// Listar todos (admin → /monitoreos/todos, analista → /monitoreos)
export const listMonitoreos = async () => {
  const rol = localStorage.getItem("rol");
  const headers = getTokenHeader();
  if (rol === "admin") {
    const { data } = await api.get("/monitoreos/todos", { headers });
    return data;
  }
  const { data } = await api.get("/monitoreos", { headers });
  return data;
};

// Obtener uno (admin & analista)
export const getMonitoreo = (id) =>
  api.get(`/monitoreos/${id}`, { headers: getTokenHeader() }).then(r => r.data);

// Crear (admin & analista)
export const createMonitoreo = (payload) =>
  api.post("/monitoreos", payload, { headers: getTokenHeader() }).then(r => r.data);

// Actualizar (admin & analista)
export const updateMonitoreo = (id, payload) =>
  api.put(`/monitoreos/${id}`, payload, { headers: getTokenHeader() }).then(r => r.data);

// Eliminar (admin & analista)
export const deleteMonitoreo = (id) =>
  api.delete(`/monitoreos/${id}`, { headers: getTokenHeader() }).then(r => r.data);

// Toggle activo (analista y admin propio)
export const toggleMonitoreo = (id) =>
  api.patch(`/monitoreos/${id}/toggle`, {}, { headers: getTokenHeader() }).then(r => r.data);

// Toggle activo (solo admin sobre cualquier monitoreo)
export const toggleMonitoreoAdmin = (id) =>
  api.patch(`/admin/monitoreos/${id}/toggle`, {}, { headers: getTokenHeader() }).then(r => r.data);

/* ════════════════════════════════
   DETALLES (Analista only)
═════════════════════════════════*/

// Listar detalles de un monitoreo concreto
export const listDetalles = (monitoreoId) =>
  api.get(`/monitoreos/${monitoreoId}/detalles`, { headers: getTokenHeader() }).then(r => r.data);

// Crear detalle
export const createDetalle = (payload) =>
  api.post("/detalles", payload, { headers: getTokenHeader() }).then(r => r.data);

// Actualizar detalle
export const updateDetalle = (id, payload) =>
  api.put(`/detalles/${id}`, payload, { headers: getTokenHeader() }).then(r => r.data);

// Eliminar detalle
export const deleteDetalle = (id) =>
  api.delete(`/detalles/${id}`, { headers: getTokenHeader() }).then(r => r.data);

/* ════════════════════════════════
   VISTA UNIFICADA DE DOMINIOS
═════════════════════════════════*/

export const listDominios = async () => {
  const rol = localStorage.getItem("rol");
  const headers = getTokenHeader();

  if (rol === "admin") {
    const { data } = await api.get("/monitoreos/dominios/todos", { headers });
    return data.map(d => ({
      id: d.id,
      monitoreoId: d.Monitoreo.id,
      organizacion: d.Monitoreo.organizacion,
      dominio: d.dominio,
      coincidencia: d.palabra_clave,
      createdAt: d.createdAt,
      activo: d.Monitoreo.activo,
      country: d.country ?? "MX",
      location: d.location ?? "México"
    }));
  }

  const monitoreos = await listMonitoreos();
  const detallesPorMonitoreo = await Promise.all(
    monitoreos.map(m =>
      listDetalles(m.id).then(detalles =>
        detalles.map(d => ({
          id: d.id,
          monitoreoId: m.id,
          organizacion: m.organizacion,
          dominio: d.dominio,
          coincidencia: d.palabra_clave,
          createdAt: d.createdAt,
          activo: m.activo,
          country: d.country ?? "MX",
          location: d.location ?? "México"
        }))
      )
    )
  );
  return detallesPorMonitoreo.flat();
};

/* ════════════════════════════════
   ALERTAS (Analista only)
═════════════════════════════════*/

export const listAlertas = () =>
  api.get("/alertas", { headers: getTokenHeader() }).then(r => r.data);

export const countAlertas = () =>
  api.get("/alertas/count", { headers: getTokenHeader() }).then(r => r.data.count);

export const getAlertaById = id =>
  api.get(`/alertas/${id}`, { headers: getTokenHeader() }).then(r => r.data);

/* ════════════════════════════════
   USUARIOS (Admin only)
═════════════════════════════════*/

export const countUsuarios = () =>
  api.get("/usuarios/count", { headers: getTokenHeader() }).then(r => r.data.count);

export const getAllUsers = () =>
  api.get("/usuarios", { headers: getTokenHeader() }).then(r => r.data);

export const updateUser = (id, payload) =>
  api.put(`/usuarios/${id}`, payload, { headers: getTokenHeader() }).then(r => r.data);

export const deleteUser = (id) =>
  api.delete(`/usuarios/${id}`, { headers: getTokenHeader() }).then(r => r.data);
