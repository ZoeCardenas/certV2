import api from "./api";

/* ───────── util ───────── */
const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return { Authorization: `Bearer ${token}` };
};

/* ══════════════════════════════════════════
   MONITOREOS  (Admin & Analista)
═══════════════════════════════════════════*/
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

export const getMonitoreo = (id) =>
  api
    .get(`/monitoreos/${id}`, { headers: getTokenHeader() })
    .then((r) => r.data);

export const createMonitoreo = (payload) =>
  api
    .post("/monitoreos", payload, { headers: getTokenHeader() })
    .then((r) => r.data);

export const updateMonitoreo = (id, payload) =>
  api
    .put(`/monitoreos/${id}`, payload, { headers: getTokenHeader() })
    .then((r) => r.data);

export const deleteMonitoreo = (id) =>
  api
    .delete(`/monitoreos/${id}`, { headers: getTokenHeader() })
    .then((r) => r.data);

export const toggleMonitoreo = (id) =>
  api
    .patch(`/monitoreos/${id}/toggle`, {}, { headers: getTokenHeader() })
    .then((r) => r.data);

/* ══════════════════════════════════════════
   DETALLES  (Solo Analista)
═══════════════════════════════════════════*/
export const listDetalles = (monitoreoId) =>
  api
    .get(`/monitoreos/${monitoreoId}/detalles`, {
      headers: getTokenHeader(),
    })
    .then((r) => r.data);

export const createDetalle = (payload) =>
  api.post("/detalles", payload, { headers: getTokenHeader() }).then((r) => r.data);

export const updateDetalle = (id, payload) =>
  api.put(`/detalles/${id}`, payload, { headers: getTokenHeader() }).then((r) => r.data);

export const deleteDetalle = (id) =>
  api.delete(`/detalles/${id}`, { headers: getTokenHeader() }).then((r) => r.data);

/* ══════════════════════════════════════════
   VISTA UNIFICADA DOMINIOS
═══════════════════════════════════════════*/
export const listDominios = async () => {
  const rol = localStorage.getItem("rol");
  const headers = getTokenHeader();

  /* -------- MODO ADMIN -------- */
  if (rol === "admin") {
    const { data } = await api.get("/monitoreos/dominios/todos", { headers });

    return data.map((d) => ({
      id: d.id, // id del DETALLE
      // Mapeo robusto: snake_case, include, camelCase
      monitoreoId: d.monitoreo_id ?? d.Monitoreo?.id ?? d.monitoreoId ?? null,
      // Organizacion tomada del include; fallback a propiedad plana
      organizacion: d.Monitoreo?.organizacion ?? d.organizacion ?? "—",
      dominio: d.dominio,
      coincidencia: d.palabra_clave ?? d.coincidencia ?? "—",
      createdAt: d.createdAt,
      activo: d.Monitoreo?.activo ?? d.activo ?? true,
      country: d.country ?? "MX",
      location: d.location ?? "México",
    }));
  }

  /* -------- MODO ANALISTA -------- */
  const monitoreos = await listMonitoreos();
  const detallesPorMonitoreo = await Promise.all(
    monitoreos.map((m) =>
      listDetalles(m.id).then((detalles) =>
        detalles.map((d) => ({
          id: d.id,
          monitoreoId: m.id,
          organizacion: m.organizacion,
          dominio: d.dominio,
          coincidencia: d.palabra_clave,
          createdAt: d.createdAt,
          activo: m.activo,
          country: d.country ?? "MX",
          location: d.location ?? "México",
        }))
      )
    )
  );

  return detallesPorMonitoreo.flat();
};

/* ══════════════════════════════════════════
   ALERTAS  (Solo Analista)
═══════════════════════════════════════════*/
export const listAlertas = () =>
  api.get("/alertas", { headers: getTokenHeader() }).then((r) => r.data);

export const countAlertas = () =>
  api.get("/alertas/count", { headers: getTokenHeader() }).then((r) => r.data.count);

export const getAlertaById = (id) =>
  api.get(`/alertas/${id}`, { headers: getTokenHeader() }).then((r) => r.data);

/* ══════════════════════════════════════════
   USUARIOS  (Solo Admin)
═══════════════════════════════════════════*/
export const countUsuarios = () =>
  api.get("/usuarios/count", { headers: getTokenHeader() }).then((r) => r.data.count);

export const getAllUsers = () =>
  api.get("/usuarios", { headers: getTokenHeader() }).then((r) => r.data);

export const updateUser = (id, payload) =>
  api.put(`/usuarios/${id}`, payload, { headers: getTokenHeader() }).then((r) => r.data);

export const deleteUser = (id) =>
  api.delete(`/usuarios/${id}`, { headers: getTokenHeader() }).then((r) => r.data);
