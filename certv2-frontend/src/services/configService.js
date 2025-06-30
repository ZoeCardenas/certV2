import api from "./api";

// Obtener configuración
export const getConfig = () =>
  api
    .get("/config", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

// Actualizar configuración
export const updateConfig = (payload) =>
  api
    .put("/config", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);
