import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gymverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (disabled redirect for dev bypass)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Dev bypass: don't redirect to login on 401
    return Promise.reject(error);
  }
);

export default api;
