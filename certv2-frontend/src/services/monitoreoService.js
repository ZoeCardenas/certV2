// src/services/monitoreoService.js
import api from "./api";

// ╔══════════════════════════════╗
// ║ MONITOREOS (cabeceras / organizaciones)
// ╚══════════════════════════════╝
export const listMonitoreos = async () => {
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  const headers = { Authorization: `Bearer ${token}` };
  if (rol === "admin") {
    const res = await api.get("/monitoreos/todos", { headers });
    return res.data;
  }
  const res = await api.get("/monitoreos", { headers });
  return res.data;
};

export const createMonitoreo = (payload) =>
  api
    .post("/monitoreos", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

export const updateMonitoreo = (id, payload) =>
  api
    .put(`/monitoreos/${id}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

export const deleteMonitoreo = (id) =>
  api
    .delete(`/monitoreos/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

export const toggleMonitoreo = (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .patch(
      `/monitoreos/${id}/toggle`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((r) => r.data);
};

export const getMonitoreo = (id) =>
  api
    .get(`/monitoreos/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

// ╔══════════════════════════════╗
// ║ DETALLES (dominio + palabra_clave)
// ╚══════════════════════════════╝
export const createDetalle = (payload) =>
  api
    .post("/detalles", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

export const updateDetalle = (id, payload) =>
  api
    .put(`/detalles/${id}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

// ╔══════════════════════════════╗
// ║ VISTA TABLA DOMINIOS
// ╚══════════════════════════════╝
export const listDominios = async () => {
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  const headers = { Authorization: `Bearer ${token}` };

  if (rol === "admin") {
    const { data } = await api.get("/monitoreos/dominios/todos", { headers });
    return data;
  }
  const mis = await listMonitoreos();
  const lists = await Promise.all(
    mis.map((m) =>
      api.get(`/monitoreos/${m.id}/detalles`, { headers }).then((r) => r.data)
    )
  );
  return lists.flat();
};

// ╔══════════════════════════════╗
// ║ ALERTAS
// ╚══════════════════════════════╝
export const listAlertas = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get("/alertas", { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
};

export const countAlertas = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get("/alertas/count", { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data.count);
};

export const getAlertaById = (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get(`/alertas/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
};

// ╔══════════════════════════════╗
// ║ USUARIOS
// ╚══════════════════════════════╝
export const countUsuarios = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get("/usuarios/count", { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data.count);
};

export const getAllUsers = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .get("/usuarios", { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
};

export const updateUser = (id, payload) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .put(`/usuarios/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
};

export const deleteUser = (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return api
    .delete(`/usuarios/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);
};
