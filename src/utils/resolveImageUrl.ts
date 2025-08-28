import axios from '../services/api';

export function resolveImageUrl(path?: string): string {
  if (!path || typeof path !== 'string') return '';

  const baseURL =
    axios.defaults.baseURL?.replace(/\/$/, '') || 'http://localhost:3000';

  const cleanPath = path.replace(/^\/+/, '').replace(/\\/g, '/');
  const finalPath = cleanPath.startsWith('uploads/')
    ? cleanPath
    : `uploads/${cleanPath}`;

  return `${baseURL}/${finalPath}`;
}
