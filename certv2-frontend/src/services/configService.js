// src/services/configService.js
import api from "./api";

// Obtener configuración de usuario
export const getConfig = () =>
  api
    .get("/configuracion", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(r => r.data);

// Actualizar configuración de usuario
export const updateConfig = payload =>
  api
    .put("/configuracion", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(r => r.data);
