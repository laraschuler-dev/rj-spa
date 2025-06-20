import axios from 'axios';

// Configuração global do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Adicionar headers globais (exemplo: autenticação)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
