import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  withCredentials: true, // cookies httpOnly
});

export const AuthAPI = {
  me: () => api.get('/me').then((r) => r.data),
  register: (email, password) => api.post('/auth/register', { email, password }).then((r) => r.data),
  login: (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
};

export const ProgressAPI = {
  get: () => api.get('/progress').then((r) => r.data),
  put: (progress) => api.put('/progress', progress).then((r) => r.data),
};