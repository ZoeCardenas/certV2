import api from "./api";

/* EXISTENTE ── sigue vivo por compatibilidad */
export const listMonitoreos = async () => {
  const rol = localStorage.getItem("rol");
  const res = await (rol === "admin"
    ? api.get("/monitoreos/todos")
    : api.get("/monitoreos"));
  return Array.isArray(res.data) ? res.data : res.data.monitoreos || [];
};
export const deleteMonitoreo  = (id)          => api.delete(`/monitoreos/${id}`);
export const createMonitoreo  = (payload)     => api.post("/monitoreos", payload);
export const updateMonitoreo  = (id, payload) => api.put(`/monitoreos/${id}`, payload);
export const toggleMonitoreo = (id) =>
  api.patch(`/monitoreos/${id}/toggle`).then((r) => r.data);export const getMonitoreo     = (id)          => api.get(`/monitoreos/${id}`).then(r=>r.data);
export const listDominios = async () => {
  const rol = localStorage.getItem("rol");
  if (rol === "admin") {
    const { data } = await api.get("/monitoreos/dominios/todos");
    return data;
  }
  // analista → concatena detalles propios
  const misMonitoreos = await listMonitoreos();
  const promises = misMonitoreos.map((m) =>
    api.get(`/monitoreos/${m.id}/detalles`).then((r) => r.data)
  );
  const listas = await Promise.all(promises);
  return listas.flat();
};
