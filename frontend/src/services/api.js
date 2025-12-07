import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const API_BASE = 'http://localhost:4000/api'; // ajuste se necessário

export function apiClient() {
  const store = useAuthStore();
  const instance = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
  });

  // adiciona idToken automaticamente quando existir
  instance.interceptors.request.use(config => {
    if (store.idToken) {
      config.headers.Authorization = `Bearer ${store.idToken}`;
    }
    return config;
  });

  return instance;
}
