// src/pages/posts/CreatePostPage.tsx
import { useParams } from 'react-router-dom';
import PostFormFactory from '../../components/posts/PostFormFactory';
import { useCreatePost } from '../../hooks/useCreatePost';

const CreatePostPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { createPost, loading } = useCreatePost();

  if (!categoryId) return <p>Categoria inválida.</p>;

  return (
    <PostFormFactory
      categoryId={Number(categoryId)}
      mode="create"
      onSubmit={async (formData) => {
        const created = await createPost(formData);
        if (created) {
          // opcional: resetar formulário, fechar modal ou scroll para o post criado
          console.log('Post criado:', created.id);
        }
      }}
      submitDisabled={loading} // desabilita botão durante request
    />
  );
};

export default CreatePostPage;
