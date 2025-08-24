import api from '../services/api';

export async function likePost(postId: number, shareId?: number) {
  const params = shareId ? { shareId } : {};
  try {
    console.log('Requisição para /posts/:id/like', { postId, params });
    const res = await api.post(`/posts/${postId}/like`, null, { params });
    return res.data.liked;
  } catch (error) {
    console.error('Erro ao curtir/descurtir post:', error);
    throw error;
  }
}
