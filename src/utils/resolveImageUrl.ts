export function resolveImageUrl(path?: string): string {
  if (!path || typeof path !== 'string') return '';

  console.log('🖼️ resolveImageUrl recebeu:', path);

  // 1️⃣ Se já for URL completa (Cloudinary ou externa)
  if (path.startsWith('http')) {
    console.log('🔗 URL completa, retornando como está');
    return path;
  }

  // 2️⃣ Caminho relativo vindo do /uploads/ da API
  const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  if (path.startsWith('/uploads/')) {
    const fullUrl = `${apiBaseURL}${path}`;
    console.log('📁 Caminho local (uploads), montando:', fullUrl);
    return fullUrl;
  }

  // 3️⃣ Se for apenas filename → monta caminho completo de uploads
  const cleanPath = path.replace(/^\/+/, '').replace(/\\/g, '/');
  const fullUrl = `${apiBaseURL}/uploads/${cleanPath}`;
  console.log('📄 Apenas filename, montando:', fullUrl);
  return fullUrl;
}
