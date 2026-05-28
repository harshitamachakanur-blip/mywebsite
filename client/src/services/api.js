import axios from 'axios';

// Point directly at the backend — no proxy dependency
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrifert_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agrifert_token');
      localStorage.removeItem('agrifert_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default API;
