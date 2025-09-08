import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../services/api';
import PostFormFactory from '../../components/posts/PostFormFactory';
import { useEditPost } from '../../hooks/useEditPost';
import { toast } from 'react-toastify';

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get('shareId')
    ? Number(searchParams.get('shareId'))
    : undefined;
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<any>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { editPost, loading } = useEditPost({ postId: Number(id), shareId });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const params = shareId ? { params: { shareId } } : {};
        const { data } = await axios.get(`/posts/${id}`, params);

        // ✅ Categoria do post
        setCategoryId(data.categoryId);
        console.log('[EditPostPage] categoryId:', data.categoryId);

        // ✅ Passa metadata como está, e ajusta imagens
        setInitialData({
          id: data.id, // garante que o form conheça o postId
          ...data.metadata,
          content: data.content ?? '',
          images: Array.isArray(data.images) ? data.images : [], // mantém {id, url}
        });

        console.log('[EditPostPage] raw initialData.images:', data.images);
      } catch (error: any) {
        toast.error('Erro ao carregar post.');
        console.error(error);
      }
    };

    fetchPost();
  }, [id, shareId]);

  if (!initialData || categoryId === null) return <div>Carregando...</div>;

  return (
    <PostFormFactory
      categoryId={categoryId}
      mode="edit"
      initialData={initialData}
      onSubmit={async (formData: FormData) => {
        await editPost(formData);
        // 🔹 após salvar, redireciona para a página do post
        navigate('/feed');
      }}
    />
  );
};

export default EditPostPage;
