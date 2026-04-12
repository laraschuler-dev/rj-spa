import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Adiciona token JWT se existir
api.interceptors.request.use((config) => {
  // Tentar obter token do localStorage primeiro
  let token = localStorage.getItem('token');

  // Se não encontrou no localStorage, tentar do Zustand storage
  if (!token) {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authState = JSON.parse(authStorage);
        token = authState.state?.token;
      }
    } catch (error) {
      console.warn('Erro ao ler auth-storage:', error);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🟢 Token incluído na requisição:', token.slice(0, 10) + '...');
  } else {
    console.warn('🔴 Nenhum token encontrado para a requisição');
  }

  return config;
});

export default api;
