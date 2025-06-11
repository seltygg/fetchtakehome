import axios from 'axios';

const fetchClient = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
});

// Global 401/403 handler
fetchClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Remove user from localStorage/context and redirect to login
      window.localStorage.removeItem('user');
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default fetchClient; 