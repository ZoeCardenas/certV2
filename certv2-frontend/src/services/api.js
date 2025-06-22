import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // cambia en producción
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para login
export const loginUser = async (email, contrasena) => {
  const response = await api.post('/auth/login', { email, password: contrasena });
  return response.data; // { token, rol }
};

export default api;
