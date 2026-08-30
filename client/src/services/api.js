import axios from 'axios';
import { showToast } from '../utils/toastBus';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isAuthCheck = error.config?.url?.includes('/auth/me');

    if (status === 401 && !isAuthCheck) {
      // Session expired or token invalid — clear it and force a fresh
      // login rather than letting every subsequent call silently fail.
      const hadToken = Boolean(localStorage.getItem('token'));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (hadToken && !window.location.pathname.startsWith('/login')) {
        showToast('Your session has expired. Please log in again.', 'error');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      showToast(message || "You don't have permission to do that.", 'error');
    } else if (status >= 500) {
      showToast('Something went wrong on our end. Please try again.', 'error');
    } else if (!error.response) {
      showToast('Could not reach the server. Check your connection.', 'error');
    }
    // 400/404 errors are left to the calling component, since those
    // usually need to show inline (e.g. a form validation message)
    // rather than as a generic floating toast.

    return Promise.reject(error);
  }
);

export default api;