// src/services/configService.js
import api from "./api";

// Obtener configuración
export const getConfig = () =>
  api
    .get("/configuracion", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(r => r.data);

// Actualizar configuración (sin ID en la ruta)
export const updateConfig = payload =>
  api
    .put(
      "/configuracion",
      payload,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
    .then(r => r.data);
