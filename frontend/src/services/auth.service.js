import api from '../utils/axios.config';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
      localStorage.removeItem('accessToken');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    const response = await api.post('/users/refresh-token');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/current-user');
    return response.data;
  }
};
