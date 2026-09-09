import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization token to outgoing requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clinic_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Graceful response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional auto-logout or token refresh hook
      console.warn('Unauthorized request - session may be expired.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
