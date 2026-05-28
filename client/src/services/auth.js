import API from './api';

export const authService = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await API.put('/auth/profile', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('agrifert_token');
    localStorage.removeItem('agrifert_user');
    delete API.defaults.headers.common['Authorization'];
  },
  isAuthenticated: () => !!localStorage.getItem('agrifert_token'),
};

export default authService;
