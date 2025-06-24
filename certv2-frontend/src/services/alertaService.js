
// src/services/alertaService.js (NUEVO ARCHIVO LIMPIO)
import api from './api';

export const getAlertas = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get("/alertas", { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
};

export const getAlertaById = (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get(`/alertas/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
};

export const countAlertas = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get("/alertas/count", { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data.count);
};