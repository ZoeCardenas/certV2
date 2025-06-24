// src/services/monitoreoService.js
import api from "./api";

/**
 * Devuelve todas las alertas si eres admin,
 * o sólo las tuyas si eres analista.
 */
export const getAlertas = () =>
  api
    .get("/alertas", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(r => r.data);

/**
 * Trae una alerta por ID (admin o analista dueño).
 */
export const getAlertaById = (id) =>
  api
    .get(`/alertas/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(r => r.data);
/**
 * Devuelve el conteo total de alertas detectadas (número).
 */
export const countAlertas = () =>
  api
    .get("/alertas/count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data.count);
