import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // For multipart/form-data, let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Don't retry if it's already a retry or if it's a 401 from refresh token
    if (
      error.config?._retry || 
      error.config?.url?.includes('refresh-token') ||
      !error.response
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      error.config._retry = true;
      try {
        const response = await api.post('/users/refresh-token');
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return api(error.config);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
