// src/services/monitoreoService.js
import api from "./api";

// Listar todos los usuarios (para la tabla)
export const getAllUsers = () =>
  api
    .get("/usuarios", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);

// Actualizar un usuario (incluye rol)
export const updateUser = (id, payload) =>
  api.put(`/usuarios/${id}`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(r => r.data);


// Eliminar un usuario
export const deleteUser = (id) =>
  api
    .delete(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);
