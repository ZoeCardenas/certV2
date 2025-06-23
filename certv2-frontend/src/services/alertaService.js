import api from "./api";

export const getAlertas = async () => {
  const rol = localStorage.getItem("rol");
  return rol === "admin"
    ? api.get("/alertas").then((r) => r.data)          // admin ve todas
    : api.get("/alertas/mias").then((r) => r.data);    // analista ve propias
};

export const getAlertaById = (id) => api.get(`/alertas/${id}`).then(r => r.data);
