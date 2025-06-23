import api from "./api";
export const getAllUsers = () => api.get("/usuarios").then(r => r.data);
export const updateUser  = (id,p) => api.put(`/usuarios/${id}`, p);
export const deleteUser  = (id)   => api.delete(`/usuarios/${id}`);
