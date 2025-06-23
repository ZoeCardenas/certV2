import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario)); // Guarda rol, email, etc.
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  }

  return response.data;
};
export const getProfile  = () => api.get("/auth/perfil").then(r => r.data);
export const updateMe    = (payload) => api.put("/auth/perfil", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  delete api.defaults.headers.common['Authorization'];
};
