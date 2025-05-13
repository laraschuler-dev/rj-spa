import axios from 'axios';

// Configuração global do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // Substitua pela URL base do seu backend
});

// Adicionar headers globais (exemplo: autenticação)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obter token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
