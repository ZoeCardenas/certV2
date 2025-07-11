
// src/services/authService.js
import api from './api';

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  const data = res.data;
  if (data.token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }
  return data;
};

export const registerUser = async (payload) => {
  // payload: { nombre, email, password }
  const res = await api.post('/auth/register', payload);
  const data = res.data;
  if (data.token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }
  return data;
};

// src/services/authService.js
export const getMyProfile = () =>
  api
    .get('/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.data);

export const logoutUser = () => {
  delete api.defaults.headers.common['Authorization'];
};
