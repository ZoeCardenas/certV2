import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL base del backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  // Obtener el token del localStorage
  if (token) config.headers.Authorization = `Bearer ${token}`;  // Añadir el token en la cabecera
  return config;
});

export default api;
