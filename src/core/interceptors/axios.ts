import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    enqueueSnackbar('Request failed. Please try again.', { variant: 'error' });
    throw error;
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
      globalThis.location.href = '/login';
    } else {
      const message = error.response?.data?.message || 'Something went wrong.';
      enqueueSnackbar(message, { variant: 'error' });
    }

    throw error;
  },
);
