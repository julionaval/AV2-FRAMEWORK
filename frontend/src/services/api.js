// frontend/src/services/api.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api', // Vite proxy encaminha para backend
  withCredentials: true,
});

// também exporta como default para compatibilidade
export default apiClient;
